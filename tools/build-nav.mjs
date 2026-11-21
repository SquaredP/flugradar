// Baut die Navigationsdaten für den Flugradar aus OurAirports (gemeinfrei, https://ourairports.com/data/).
//
//   node tools/build-nav.mjs [Quellordner] [Zielordner]
//
// Ohne Quellordner lädt das Skript die CSV-Dateien von davidmegginson.github.io/ourairports-data.
// Ergebnis (Standard: data/nav):
//   airports.json   große und mittlere Flughäfen weltweit (Suche, Routen, Übersichtskarte)
//   t/<B>_<L>.json  Kacheln zu 5° × 5°: kleine Plätze, Hubschrauberlandeplätze, Funkfeuer, Pisten, Frequenzen
//   index.json      Stand und welche Kacheln es gibt
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = process.argv[2] || '';
const OUT = process.argv[3] || 'data/nav';
const BASE = 'https://davidmegginson.github.io/ourairports-data/';
const TILE = 5;

async function load(name) {
  if (SRC) return readFile(join(SRC, name), 'utf8');
  const r = await fetch(BASE + name);
  if (!r.ok) throw new Error(name + ': HTTP ' + r.status);
  return r.text();
}

/* CSV nach RFC 4180 (Anführungszeichen, Kommas und Zeilenumbrüche in Feldern) */
function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const num = (v, d) => { const x = parseFloat(v); return Number.isFinite(x) ? (d == null ? x : +x.toFixed(d)) : null; };
const tileOf = (lat, lon) => Math.floor(lat / TILE) * TILE + '_' + Math.floor(lon / TILE) * TILE;
const TYPE = { large_airport: 'L', medium_airport: 'M', small_airport: 'S', heliport: 'H', seaplane_base: 'W' };

function icaoOf(a) {
  if (/^[A-Z]{4}$/.test(a.icao_code || '')) return a.icao_code;
  if (/^[A-Z]{4}$/.test(a.gps_code || '')) return a.gps_code;
  if (/^[A-Z]{4}$/.test(a.ident)) return a.ident;
  return '';
}

const [aCsv, nCsv, rCsv, fCsv] = await Promise.all(['airports.csv', 'navaids.csv', 'runways.csv', 'airport-frequencies.csv'].map(load));
const airports = parseCsv(aCsv), navaids = parseCsv(nCsv), runways = parseCsv(rCsv), freqs = parseCsv(fCsv);

const tiles = new Map();
const tile = k => { let t = tiles.get(k); if (!t) { t = { a: [], n: [], r: {}, f: {} }; tiles.set(k, t); } return t; };
const byIdent = new Map();
const big = [];

for (const a of airports) {
  const ty = TYPE[a.type]; if (!ty) continue;
  const lat = num(a.latitude_deg, 4), lon = num(a.longitude_deg, 4); if (lat == null || lon == null) continue;
  // [Kennung, ICAO, IATA, Name, Ort, Breite, Länge, Höhe ft, Art, Land, Linienverkehr]
  const row = [a.ident, icaoOf(a), a.iata_code || '', a.name, a.municipality || '', lat, lon, num(a.elevation_ft, 0), ty, a.iso_country, a.scheduled_service === 'yes' ? 1 : 0];
  byIdent.set(a.ident, { lat, lon });
  if (ty === 'L' || ty === 'M') big.push(row);
  else tile(tileOf(lat, lon)).a.push(row);
}

for (const n of navaids) {
  const lat = num(n.latitude_deg, 4), lon = num(n.longitude_deg, 4); if (lat == null || lon == null) continue;
  // [Kennung, Name, Art, Frequenz kHz, Breite, Länge, Höhe ft, Land, DME-Kanal, Missweisung, Nutzung, Leistung, Flughafen]
  tile(tileOf(lat, lon)).n.push([n.ident, n.name, n.type, num(n.frequency_khz, 0), lat, lon, num(n.elevation_ft, 0), n.iso_country,
    n.dme_channel || '', num(n.magnetic_variation_deg, 1), n.usageType || '', n.power || '', n.associated_airport || '']);
}

for (const r of runways) {
  if (r.closed === '1') continue;
  const ap = byIdent.get(r.airport_ident); if (!ap) continue;
  const t = tile(tileOf(ap.lat, ap.lon));
  // [Länge ft, Breite ft, Belag, befeuert, Ende 1, Br, Lä, Kurs, Ende 2, Br, Lä, Kurs]
  (t.r[r.airport_ident] ||= []).push([num(r.length_ft, 0), num(r.width_ft, 0), r.surface || '', r.lighted === '1' ? 1 : 0,
    r.le_ident || '', num(r.le_latitude_deg, 5), num(r.le_longitude_deg, 5), num(r.le_heading_degT, 0),
    r.he_ident || '', num(r.he_latitude_deg, 5), num(r.he_longitude_deg, 5), num(r.he_heading_degT, 0)]);
}

for (const f of freqs) {
  const ap = byIdent.get(f.airport_ident); if (!ap) continue;
  const mhz = num(f.frequency_mhz, 3); if (mhz == null) continue;
  (tile(tileOf(ap.lat, ap.lon)).f[f.airport_ident] ||= []).push([f.type || '', f.description || '', mhz]);
}

await rm(join(OUT, 't'), { recursive: true, force: true });
await mkdir(join(OUT, 't'), { recursive: true });
let bytes = 0;
const keys = [...tiles.keys()].sort();
for (const k of keys) {
  const s = JSON.stringify(tiles.get(k));
  bytes += s.length;
  await writeFile(join(OUT, 't', k + '.json'), s);
}
big.sort((a, b) => (b[8] === 'L') - (a[8] === 'L') || b[10] - a[10] || a[0].localeCompare(b[0]));
const bigS = JSON.stringify(big);
await writeFile(join(OUT, 'airports.json'), bigS);
await writeFile(join(OUT, 'index.json'), JSON.stringify({ generated: new Date().toISOString(), tile: TILE, tiles: keys, source: 'OurAirports (public domain)' }));
console.log(`Flughäfen groß/mittel: ${big.length} (${(bigS.length / 1024).toFixed(0)} KB), Kacheln: ${keys.length} (${(bytes / 1048576).toFixed(1)} MB gesamt)`);
