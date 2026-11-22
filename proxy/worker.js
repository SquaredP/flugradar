// Flugradar-Vermittler für Cloudflare Workers (kostenloser Tarif reicht).
//
// Wozu? Manche freien Flugdatendienste erlauben keine Abfragen direkt aus dem Browser (CORS).
// Dieser kleine Worker nimmt die Anfrage der Seite entgegen, holt die Daten beim Dienst ab und gibt sie
// mit passendem CORS-Kopf zurück. Er speichert nichts und leitet nur die unten freigegebenen Pfade weiter.
//
// Einrichtung: siehe README, Abschnitt „Eigener Vermittler“.

// Seiten, die den Vermittler nutzen dürfen (dein GitHub-Pages-Ursprung und lokal zum Testen)
const ALLOW = ['https://squaredp.github.io', 'http://localhost:8000', 'http://127.0.0.1:8000'];

// Flugdaten: erst adsb.lol, bei Fehler airplanes.live (beide im ADSBexchange-v2-Format)
const UPSTREAMS = ['https://api.adsb.lol', 'https://api.airplanes.live'];
const V2 = /^\/v2\/(point\/-?\d{1,2}(\.\d+)?\/-?\d{1,3}(\.\d+)?\/\d{1,3}|hex\/[0-9a-fA-F,~]{6,200}|callsign\/[A-Za-z0-9,]{2,200}|reg\/[A-Za-z0-9,\-]{2,200})$/;

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOW.includes(origin) ? origin : ALLOW[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'accept, content-type',
    'Vary': 'Origin'
  };
}

async function pass(url, ttl, origin) {
  const r = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'Flugradar-Vermittler' }, cf: { cacheTtl: ttl, cacheEverything: true } });
  const h = new Headers(cors(origin));
  h.set('Content-Type', r.headers.get('Content-Type') || 'application/json');
  h.set('Cache-Control', 'public, max-age=' + ttl);
  return new Response(r.body, { status: r.status, headers: h });
}

// Flugplan (Abflüge und Ankünfte) von AirLabs. Der Schlüssel liegt als geheime Variable AIRLABS_KEY im Worker
// (Settings → Variables and Secrets) und gelangt nie in die Seite. Antworten werden 10 Minuten zwischengespeichert,
// damit das kleine Gratis-Kontingent reicht. AirLabs spiegelt in der Antwort den Schlüssel zurück ("request"),
// deshalb wird nur "response" weitergegeben.
const SCHED_FIELDS = 'flight_iata,airline_iata,dep_iata,arr_iata,dep_time,arr_time,dep_estimated,arr_estimated,status,dep_terminal,arr_terminal,dep_gate,arr_gate,cs_flight_iata,cs_airline_iata,delayed,dep_delayed,arr_delayed';
async function schedule(u, env, origin) {
  const ap = u.searchParams.get('airport') || '', dir = u.searchParams.get('dir') || '';
  if (!/^[A-Z]{3}$/.test(ap) || !/^(dep|arr)$/.test(dir)) return new Response('airport (IATA) oder dir fehlt', { status: 400, headers: cors(origin) });
  const h = new Headers(cors(origin)); h.set('Content-Type', 'application/json');
  if (!env || !env.AIRLABS_KEY) return new Response(JSON.stringify({ error: 'nicht eingerichtet' }), { status: 501, headers: h });
  const url = 'https://airlabs.co/api/v9/schedules?' + dir + '_iata=' + ap + '&_fields=' + SCHED_FIELDS + '&api_key=' + encodeURIComponent(env.AIRLABS_KEY);
  try {
    const r = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'Flugradar-Vermittler' }, cf: { cacheTtl: 600, cacheEverything: true } });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j || j.error) return new Response(JSON.stringify({ error: (j && j.error && (j.error.code || j.error.message)) || 'HTTP ' + r.status }), { status: r.ok ? 502 : r.status, headers: h });
    h.set('Cache-Control', 'public, max-age=600');
    return new Response(JSON.stringify({ response: j.response || [] }), { status: 200, headers: h });
  } catch (e) { return new Response(JSON.stringify({ error: 'Dienst nicht erreichbar' }), { status: 502, headers: h }); }
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== 'GET') return new Response('Nur GET', { status: 405, headers: cors(origin) });
    if (origin && !ALLOW.includes(origin)) return new Response('Ursprung nicht freigegeben', { status: 403 });
    const u = new URL(req.url);

    if (V2.test(u.pathname)) {
      let last;
      for (const base of UPSTREAMS) {
        try {
          const res = await pass(base + u.pathname, 4, origin);
          if (res.ok) return res;
          last = res;
        } catch (e) { last = new Response('Dienst nicht erreichbar', { status: 502, headers: cors(origin) }); }
      }
      return last;
    }

    if (u.pathname === '/metar') {
      const bbox = u.searchParams.get('bbox') || '', ids = u.searchParams.get('ids') || '';
      if (!/^-?[\d.]+,-?[\d.]+,-?[\d.]+,-?[\d.]+$/.test(bbox) && !/^[A-Z0-9,]{3,100}$/.test(ids))
        return new Response('bbox oder ids fehlt', { status: 400, headers: cors(origin) });
      const q = bbox ? 'bbox=' + bbox : 'ids=' + ids;
      return pass('https://aviationweather.gov/api/data/metar?' + q + '&format=json', 300, origin);
    }

    if (u.pathname === '/schedule') return schedule(u, env, origin);

    return new Response('Unbekannter Pfad', { status: 404, headers: cors(origin) });
  }
};
