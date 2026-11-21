// Holt aktuelle METAR-Meldungen für Europa von aviationweather.gov (NOAA, gemeinfrei) und schreibt sie kompakt
// als Rückfall für die Seite, falls der Browser aviationweather.gov nicht direkt abfragen darf.
//
//   node tools/metar.mjs [Ziel]      (Standard: data/metar.json)
//
// Format: {"generated": ISO-Zeit, "m": {"EDDF": [Beobachtung (Unix-Sekunden), Breite, Länge, Rohtext, Kategorie]}}
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { gunzipSync } from 'node:zlib';

const OUT = process.argv[2] || 'data/metar.json';
const BOX = { s: 27, w: -32, n: 72, e: 45 };   // Europa, Nordafrika, Nahost
const CACHE = 'https://aviationweather.gov/data/cache/metars.cache.csv.gz';
const API = `https://aviationweather.gov/api/data/metar?bbox=${BOX.s},${BOX.w},${BOX.n},${BOX.e}&format=json`;
const UA = { 'User-Agent': 'Flugradar (github.com/SquaredP/flugradar)' };

function parseCsvLine(line) {
  const out = []; let f = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { out.push(f); f = ''; }
    else f += c;
  }
  out.push(f); return out;
}
const inBox = (la, lo) => la >= BOX.s && la <= BOX.n && lo >= BOX.w && lo <= BOX.e;

async function fromCache() {
  const r = await fetch(CACHE, { headers: UA });
  if (!r.ok) throw new Error('Cache: HTTP ' + r.status);
  const text = gunzipSync(Buffer.from(await r.arrayBuffer())).toString('utf8');
  const lines = text.split(/\r?\n/);
  const hi = lines.findIndex(l => l.startsWith('raw_text,'));
  if (hi < 0) throw new Error('Cache: Kopfzeile fehlt');
  const head = parseCsvLine(lines[hi]), col = n => head.indexOf(n);
  const iR = col('raw_text'), iS = col('station_id'), iT = col('observation_time'), iLa = col('latitude'), iLo = col('longitude'), iC = col('flight_category');
  const m = {};
  for (const l of lines.slice(hi + 1)) {
    if (!l) continue;
    const c = parseCsvLine(l), la = +c[iLa], lo = +c[iLo];
    if (!c[iS] || !isFinite(la) || !isFinite(lo) || !inBox(la, lo)) continue;
    const t = Math.floor(Date.parse(c[iT]) / 1000);
    if (!m[c[iS]] || m[c[iS]][0] < t) m[c[iS]] = [t, +la.toFixed(4), +lo.toFixed(4), c[iR], iC >= 0 ? c[iC] : ''];
  }
  return m;
}
async function fromApi() {
  const r = await fetch(API, { headers: { ...UA, accept: 'application/json' } });
  if (!r.ok) throw new Error('API: HTTP ' + r.status);
  const m = {};
  for (const x of await r.json()) {
    if (!x.icaoId || !x.rawOb) continue;
    const t = typeof x.obsTime === 'number' ? x.obsTime : Math.floor(Date.parse(x.reportTime) / 1000);
    m[x.icaoId] = [t, x.lat, x.lon, x.rawOb, x.fltCat || ''];
  }
  return m;
}

let m = {};
try { m = await fromCache(); }
catch (e) { console.warn(e.message + ', versuche die API'); m = await fromApi(); }
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ generated: new Date().toISOString(), m }));
console.log(`METAR: ${Object.keys(m).length} Stationen nach ${OUT}`);
