// TECH-DEBT (siehe README, „Technische Schulden“): Notlösung, kein Live-Betrieb.
// Holt einmal einen Schnappschuss der Flugzeuge über Mitteleuropa und schreibt ihn kompakt als Datei,
// die GitHub Pages mit ausliefert. Die Seite nutzt ihn nur, wenn kein Live-Dienst aus dem Browser erreichbar ist.
//
//   node tools/snapshot.mjs [Ziel]      (Standard: data/snapshot.json)
//
// Reihenfolge der Quellen: adsb.lol, airplanes.live (je drei Kreise, höchstens eine Anfrage pro Sekunde),
// zuletzt OpenSky anonym (ein Rechteck). Endet mit Fehlercode, wenn zu wenige Flugzeuge ankommen.
//
// Format: {"t": Unix-Sekunden, "src": Quelle, "box": [S,W,N,E], "ac": [ADSBexchange-v2-Objekte, gekürzt]}
//     oder {"t":…, "src":"OpenSky Network", "box":…, "os": [OpenSky-Zustandsvektoren]}
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = process.argv[2] || 'data/snapshot.json';
const UA = { 'User-Agent': 'Flugradar (github.com/SquaredP/flugradar)', accept: 'application/json' };
const CIRCLES = [[52.0, 9.0, 250], [48.0, 11.0, 250], [51.0, 17.0, 250]];   // Breite, Länge, Seemeilen
const BOX = [43.5, 0, 58, 23];                                              // grobe Umhüllende der Kreise
const MIN = 150;                                                            // darunter gilt der Lauf als misslungen
const KEEP = ['hex', 'flight', 'r', 't', 'desc', 'ownOp', 'year', 'category', 'dbFlags', 'lat', 'lon', 'seen_pos', 'seen',
  'alt_baro', 'alt_geom', 'baro_rate', 'geom_rate', 'gs', 'track', 'true_heading', 'mag_heading', 'squawk', 'emergency', 'type'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJSON(url) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 20000);
  try {
    const r = await fetch(url, { headers: UA, signal: c.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
function slim(a) {
  if (typeof a.lat !== 'number' || typeof a.lon !== 'number' || !a.hex) return null;
  const o = {};
  for (const k of KEEP) {
    const v = a[k];
    if (v == null || v === '' || (k === 'dbFlags' && !v) || (k === 'emergency' && v === 'none')) continue;
    o[k] = typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1000) / 1000 : v;
  }
  return o;
}
async function viaV2(name, base) {
  const map = new Map();
  for (const [la, lo, nm] of CIRCLES) {
    const j = await getJSON(`${base}/v2/point/${la}/${lo}/${nm}`);
    for (const a of j.ac || j.aircraft || []) { const s = slim(a); if (s) map.set(s.hex, s); }
    await sleep(1300);
  }
  return { src: name, ac: [...map.values()] };
}
async function viaOpenSky() {
  const [S, W, N, E] = BOX;
  const j = await getJSON(`https://opensky-network.org/api/states/all?extended=1&lamin=${S}&lomin=${W}&lamax=${N}&lomax=${E}`);
  const os = (j.states || []).filter(s => s[5] != null && s[6] != null).map(s => s.map(v => typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1000) / 1000 : v));
  return { src: 'OpenSky Network', os };
}

const tries = [
  () => viaV2('adsb.lol', 'https://api.adsb.lol'),
  () => viaV2('airplanes.live', 'https://api.airplanes.live'),
  viaOpenSky,
];
let res = null;
for (const f of tries) {
  try {
    const r = await f();
    const n = (r.ac || r.os).length;
    console.log(`${r.src}: ${n} Flugzeuge`);
    if (n >= MIN) { res = r; break; }
  } catch (e) { console.log('Quelle fehlgeschlagen:', e.message); }
}
if (!res) { console.error('Kein Schnappschuss: keine Quelle lieferte genug Flugzeuge.'); process.exit(1); }
const out = { t: Math.floor(Date.now() / 1000), src: res.src, box: BOX, ...(res.ac ? { ac: res.ac } : { os: res.os }) };
await mkdir(dirname(OUT), { recursive: true });
const text = JSON.stringify(out);
await writeFile(OUT, text);
console.log(`geschrieben: ${OUT} (${(text.length / 1024).toFixed(0)} KB)`);
