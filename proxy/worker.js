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

export default {
  async fetch(req) {
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

    return new Response('Unbekannter Pfad', { status: 404, headers: cors(origin) });
  }
};
