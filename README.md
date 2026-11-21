# Flugradar

Mobile Live-Karte für Flugzeuge, mit Flugplätzen, Funkfeuern und Flugwetter – das Gegenstück zu [Zugradar](https://github.com/SquaredP/zugradar) und [Schiffsradar](https://github.com/SquaredP/schiffsradar). Zeigt, welche Flugzeuge gerade wo fliegen, wohin sie wollen und welches Flugzeug gerade über dir ist.

**Live:** https://squaredp.github.io/flugradar/

## Funktionen

- **Karte mit Flugzeugen** aus offenen ADS-B-Netzwerken. Die Silhouette zeigt die Art (Verkehrsflugzeug, Propellerflugzeug, Hubschrauber, Segelflugzeug, Militär) und dreht sich in Flugrichtung, die Größe folgt der Gewichtsklasse. Ab Zoom 8 stehen Kennung und Höhe daneben (Flugfläche oder Fuß, Pfeil bei Steig- oder Sinkflug). Überlappende Namen blendet die Seite aus, wie beim Zugradar. Gestrichelte Flugzeuge haben seit über einer Minute keine Position geschickt. Notfälle (Squawk 7500, 7600, 7700) sind rot umrandet.
- **Filter:** Das Menü „Typen“ schaltet Verkehrsflugzeuge, Allgemeine Luftfahrt, Hubschrauber, Militär sowie Segelflug · Sonstige einzeln. Flugzeuge am Boden lassen sich im selben Menü zuschalten.
- **Suche** nach Rufzeichen (`DLH400`), Flugnummer (`LH 400`), Kennzeichen (`D-AIBD`), Typ (`A320`) oder Transpondercode (`3c6444`). Enter sucht weltweit.
- **Navigation** (Chip „Navigation“): Flughäfen ab Zoom 6, UKW-Funkfeuer (VOR, VOR-DME, VORTAC, TACAN) ab Zoom 7, NDB und DME ab Zoom 9, kleine Flugplätze ab Zoom 10, Hubschrauberlandeplätze ab Zoom 11, jeweils in ICAO-ähnlichen Kartenzeichen. Ab Zoom 11 sind die Pisten maßstäblich eingezeichnet. Antippen zeigt beim Flugplatz Pisten (Länge, Breite, Belag, Befeuerung), Funkfrequenzen und Flugwetter, beim Funkfeuer Frequenz, Morsekennung, DME-Kanal und Missweisung.
- **Wetter** (Chip „Wetter“): METAR-Meldungen als Punkte in Flugwetterfarben ab Zoom 7 (grün Sichtflug, blau eingeschränkt, rot Instrumentenflug, violett sehr schlecht). Antippen zeigt die Meldung im Klartext auf Deutsch und im Original.
- **Luftraum** (Chip „Luftraum“, optional): openAIP-Karte mit Lufträumen, Meldepunkten und Hindernissen. Braucht einen kostenlosen openAIP-Schlüssel, den du in der App einträgst; er bleibt im Browser.
- **Flugzeug verfolgen:** Die Karte folgt dem Flugzeug. Wie bei einem Navi ist die Flugspur grau und der Kurs der nächsten 5 Minuten kräftig. Ist die Route bekannt, zeigt die Seite Start und Ziel, die Reststrecke zum Ziel als Großkreis, Restentfernung und eine geschätzte Ankunftszeit. „Strecke zeigen“ holt alles ins Bild.
- **Flugzeugdaten:** Flug und Fluggesellschaft, Kennzeichen, Typ, Halter, Baujahr, Gewichtsklasse, Squawk mit Bedeutung, Druck- und GPS-Höhe, gewählte Höhe, Steigrate, Fahrt durch die Luft (IAS, TAS, Mach), Wind und Temperatur in Flughöhe, Ortungsart (ADS-B, MLAT), dazu Links zu Fotos (Planespotters, JetPhotos), zum Verlauf bei adsb.lol und zu FlightAware.
- **Geschwindigkeit** in km/h und Knoten, Höhe in Fuß und Metern.
- **Mein Ort:** ein Ort (Garten, Balkon) oder ein Flughafen. „Jetzt in der Nähe“ zeigt die Flugzeuge im Umkreis von 10 km mit **Höhenwinkel und Himmelsrichtung**, damit du sie am Himmel findest. „Kommt vorbei“ listet, was in den nächsten 20 Minuten näher als 5 km vorbeifliegt. Ist Mein Ort ein Flughafen, kommen „Landet bald“ und „Am Boden · gestartet“ hinzu. Oben steht das aktuelle Flughafenwetter (METAR), so wie beim Schiffsradar der Pegel.
- **Meine Flüge:** einen **Flug** merken (Rufzeichen, also täglich dieselbe Flugnummer, z. B. dein Flug nächste Woche oder der Pendlerflug, mit dem jemand ankommt) oder ein **Flugzeug** (Transpondercode, z. B. der Rettungshubschrauber in deiner Nähe oder das Vereinsflugzeug). Die Seite findet beides weltweit wieder, solange ein Empfänger es hört.
- Hell- und Dunkelmodus, „Was ist neu“ und „Über Flugradar“ (mit dem aktuellen Stand aller Datenquellen) wie bei den Geschwistern.

### Warum hier „Meine Flüge“ statt „Meine Schiffe“

In der Luft gibt es echten Linienverkehr, anders als meist auf dem Wasser: Ein Flug wie LH 400 heißt jeden Tag gleich, also lohnt es sich, Flüge über ihr Rufzeichen zu merken. Einzelne Flugzeuge merkt sich die Seite zusätzlich über den Transpondercode, weil bei Rettungshubschraubern, Polizei oder dem eigenen Verein das Flugzeug zählt und nicht die Flugnummer.

## Wie genau sind die Positionen?

Flugzeuge senden ihre GPS-Position selbst per **ADS-B**, meist jede Sekunde. Ehrenamtliche Empfänger fangen die Signale auf und teilen sie mit offenen Netzwerken. Wo kein Empfänger steht, fehlen Flugzeuge; tief fliegende Flugzeuge und Hubschrauber verschwinden daher öfter. Manche Positionen sind per **MLAT** aus den Laufzeiten zu mehreren Empfängern berechnet und etwas ungenauer.

Zwischen zwei Abfragen schreibt die Seite die Position mit Kurs und Geschwindigkeit fort, höchstens 60 Sekunden (am Boden 15). Die **Route** (Start und Ziel) stammt aus einer gemeinschaftlich gepflegten Datenbank zum Rufzeichen. Sie kann veraltet sein; passt sie laut adsb.lol nicht zur Position, ist die Ziellinie dünn gestrichelt und das Blatt sagt es. Die **Ankunftszeit** ist eine grobe Schätzung über die direkte Strecke mit der aktuellen Geschwindigkeit plus einigen Minuten für den Anflug. „Kommt vorbei“ und der Höhenwinkel gehen davon aus, dass das Flugzeug geradeaus weiterfliegt.

**Datensparsam:** Flugzeuge erscheinen ab Zoom 6. Die Seite fragt nur einen Kreis um den sichtbaren Ausschnitt ab (höchstens 250 NM, also 463 km, mehr erlauben die Dienste nicht), bei kleinem Ausschnitt alle 5 Sekunden, bei mittlerem alle 10, bei großem alle 20, und nur, solange die Seite sichtbar ist. Routen fragt sie nur für das angetippte Flugzeug, für gemerkte Flüge und für Flugzeuge um einen Flughafen unter „Mein Ort“ ab. Navigationsdaten liegen nach dem ersten Laden eine Woche im Gerät.

**Nicht für die Navigation oder Flugvorbereitung verwenden.** Dafür gelten die amtlichen Unterlagen (AIP, DFS).

## Datenquellen und Rückfall

Die Seite fragt diese freien Dienste der Reihe nach und nimmt den ersten, der antwortet. Fällt einer aus, probiert sie ihn nach einigen Minuten erneut. Unter „Meine Flüge“ → „Über Flugradar“ steht, welcher gerade aktiv ist.

1. Eigener Vermittler (falls in `config.json` eingetragen, siehe unten)
2. [adsb.lol](https://adsb.lol) – gemeinschaftlich, werbefrei, ohne Schlüssel
3. [airplanes.live](https://airplanes.live) – nur nicht-kommerziell, höchstens eine Anfrage pro Sekunde
4. [OpenSky Network](https://opensky-network.org) – anonym 400 Abfragen pro Tag, daher nur alle 30 Sekunden
5. adsb.lol weltweiter Datenstand – Notbetrieb, lädt alle 30 Sekunden alle Flugzeuge der Welt (rund 1 MB komprimiert), nur wenn sonst nichts geht
6. Schnappschuss aus GitHub Actions – **nicht live**, nur Mitteleuropa, siehe „Technische Schulden“

Diese Dienste sind für Abfragen von Servern gebaut. Ob sie Abfragen **direkt aus dem Browser** zulassen (CORS), legen sie selbst fest, und das kann sich ändern; adsb.fi zum Beispiel lässt es nicht zu und fehlt deshalb. Steht oben „Keine Flugdatenquelle erreichbar“, hilft der eigene Vermittler.

### Eigener Vermittler (nur nötig, wenn keine Quelle antwortet)

Ein kleines Skript bei Cloudflare Workers (kostenloser Tarif, 100.000 Anfragen am Tag) holt die Daten bei adsb.lol oder airplanes.live ab und gibt sie mit dem nötigen CORS-Kopf an die Seite weiter. Es speichert nichts und leitet nur freigegebene Pfade weiter (Flugzeuge im Umkreis, Suche nach Kennung, METAR).

1. Auf [dash.cloudflare.com](https://dash.cloudflare.com) kostenlos anmelden, *Workers & Pages → Create → Worker*, Name z. B. `flugradar`, *Deploy*.
2. *Edit code*, den Inhalt von [`proxy/worker.js`](proxy/worker.js) einfügen, *Deploy*. Oben in der Datei steht, welche Seiten den Vermittler nutzen dürfen (`ALLOW`); dort ggf. die eigene GitHub-Pages-Adresse eintragen.
3. Die Adresse des Workers (z. B. `https://flugradar.DEINNAME.workers.dev`) in [`config.json`](config.json) bei `"proxy"` eintragen und committen.

Die Content-Security-Policy in `index.html` erlaubt Verbindungen zu `*.workers.dev`. Bei einer eigenen Domain diese dort in `connect-src` ergänzen.

## Technische Schulden

**TECH-DEBT-1: Schnappschuss statt Live-Daten (Notlösung).** Wenn kein Flugdatendienst direkt aus dem Browser antwortet (vermutlich CORS), zeigt die Seite zuletzt einen Schnappschuss, den GitHub Actions bei jedem Lauf (alle 30 Minuten, in der Praxis oft später) holt und mit der Seite veröffentlicht.

- Skript: [`tools/snapshot.mjs`](tools/snapshot.mjs), Workflow-Schritt „Schnappschuss Mitteleuropa (Notlösung)“, Anzeige in `index.html` (Suche nach `TECH-DEBT`, Anbieter `snap`).
- Einschränkungen: nicht live (Positionen sind bis zu eine Stunde alt und werden nur mit Kurs und Geschwindigkeit fortgeschrieben), nur Mitteleuropa (grob 43,5–58° N, 0–23° O), keine Suche nach Flügen außerhalb. Die Seite zeigt deutlich „Nicht live: Stand vor X Min“.
- Risiken: Die Server von GitHub Actions werden von Diensten eventuell gesperrt (OpenSky nennt das für Hyperscaler). Dann bleibt die Datei leer und die Seite meldet, dass keine Quelle erreichbar ist. Die Daten werden mit der Seite öffentlich ausgeliefert; die Quellen erlauben nur nicht-kommerzielle Nutzung.
- Abbau: Sobald der eigene Vermittler läuft (oben), den Anbieter `snap` aus `PROV` und `fetchSnap` aus `index.html`, `tools/snapshot.mjs`, den Workflow-Schritt und `data/snapshot.json` entfernen.

## Einrichtung

1. **GitHub Pages einschalten:** *Settings → Pages → Build and deployment → Source:* „GitHub Actions“ wählen.
2. **Ersten Lauf starten:** *Actions → „Seite bauen und veröffentlichen“ → Run workflow.* Nach rund zwei Minuten ist die Seite online.

Der Workflow baut bei jedem Push und alle 30 Minuten die Seite: Er lädt die Navigationsdaten von OurAirports (einmal pro Woche neu, sonst aus dem Zwischenspeicher) und holt die aktuellen METAR-Meldungen für Europa als Rückfall, falls der Browser aviationweather.gov nicht direkt abfragen darf. Es braucht keinen Schlüssel und kein Secret.

**Zeitplan pausiert?** GitHub hält geplante Workflows in Repositories an, in denen 60 Tage lang nichts committet wurde. Dann unter *Actions* den Workflow wieder aktivieren oder eine kleine Änderung committen. Die Seite selbst läuft weiter, nur der METAR-Rückfall veraltet.

## Neuerungen

Alle Änderungen stehen in [CHANGELOG.md](CHANGELOG.md). Die Seite liest diese Datei selbst. Neue Einträge kommen oben als `## JJJJ-MM-TT` mit Stichpunkten darunter; nur dieses Format wird angezeigt.

## Technik

- `index.html`: eine einzelne statische Datei mit Vanilla JavaScript, kein Build-Schritt. Die Rechenfunktionen (Großkreis, Fortschreibung, nächste Annäherung, METAR-Leser, Kategorien) stehen gesammelt zwischen `/* ===== PURE ===== */` und lassen sich ohne Browser testen.
- `vendor/`: [Leaflet](https://leafletjs.com) (BSD-2) und die Schrift Barlow (SIL OFL), wie beim Zugradar. Beim Laden der Seite gibt es dadurch keine Anfrage an Drittanbieter-CDNs oder Google Fonts. Eine Content-Security-Policy im HTML erlaubt Verbindungen nur zu den genannten Diensten.
- `tools/build-nav.mjs`: macht aus den CSV-Dateien von OurAirports kompakte JSON-Dateien: große und mittlere Flughäfen weltweit in einer Datei, alles andere (kleine Plätze, Funkfeuer, Pisten, Frequenzen) in Kacheln zu 5° × 5°, die die Seite nur für den sichtbaren Ausschnitt lädt.
- `tools/metar.mjs`: holt die METAR-Meldungen für Europa von aviationweather.gov als Rückfalldatei.
- `proxy/worker.js`: der optionale Vermittler für Cloudflare Workers.
- `.github/workflows/pages.yml`: baut und veröffentlicht die Seite auf GitHub Pages.
- Einstellungen, Mein Ort und gemerkte Flüge liegen im `localStorage`, Navigationsdaten zwischengespeichert in IndexedDB.

Lokal ausprobieren (Node 22):

```sh
node tools/build-nav.mjs     # lädt OurAirports, schreibt data/nav
node tools/metar.mjs         # optional, schreibt data/metar.json
python3 -m http.server       # dann http://localhost:8000 öffnen
```

## Datenschutz

Kein Konto, keine Cookies, kein Tracking, kein eigener Server. Mein Ort, Filter, Kartenausschnitt, gemerkte Flüge und ein openAIP-Schlüssel bleiben im Browser. Beim Benutzen sehen der jeweilige Flugdatendienst (Mittelpunkt und Radius des Ausschnitts, gesuchte und gemerkte Flüge), adsb.lol und adsbdb.com (Rufzeichen und Transpondercode des angetippten Flugzeugs), aviationweather.gov (Kartenausschnitt für METAR), Nominatim (Ortssuche), Esri und optional openAIP (Kartenkacheln) sowie GitHub Pages (Auslieferung) die IP-Adresse. Details stehen in der App unter „Meine Flüge“ → „Über Flugradar“.

## Daten und Nutzungsbedingungen

- Flugdaten: [adsb.lol](https://adsb.lol), [airplanes.live](https://airplanes.live/api-guide/) (nicht-kommerziell), [OpenSky Network](https://opensky-network.org) (Forschung und nicht-kommerzielle Nutzung). Alle sind gemeinschaftlich betrieben; bitte nicht übermäßig belasten.
- Routen: adsb.lol (aus [vradarserver standing-data](https://github.com/vradarserver/standing-data)), Rückfall [adsbdb.com](https://www.adsbdb.com). Flugzeugdaten: adsbdb.com.
- Flugplätze, Pisten, Frequenzen, Funkfeuer: [OurAirports](https://ourairports.com/data/), gemeinfrei. Nicht amtlich.
- Flugwetter: [NOAA Aviation Weather Center](https://aviationweather.gov/data/api/), gemeinfrei.
- Luftraum (optional): [openAIP](https://www.openaip.net), CC BY-NC 4.0.
- Kartendaten: © OpenStreetMap-Mitwirkende, Esri. Ortssuche: Nominatim / OpenStreetMap.

## Lizenz

Der Code steht unter der [MIT-Lizenz](LICENSE). Die angezeigten Karten-, Flug-, Navigations- und Wetterdaten unterliegen den Lizenzen ihrer jeweiligen Anbieter.
