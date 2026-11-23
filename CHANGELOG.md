# Was ist neu

Neue Funktionen und Korrekturen am Flugradar. Neueste Einträge oben.
Die Seite liest diese Datei selbst und zeigt nach einem Update einmalig einen Hinweis an.

## 2026-11-23

- Handy: Die Seite lässt sich nicht mehr versehentlich zoomen oder verschieben, sodass obere Leiste und Reiter im Bild bleiben. Nur die Karte zoomt
- Neues Symbol: ein stilisierter Radar mit Flugzeug im Browser-Tab und auf dem Home-Bildschirm. Der Hintergrund im Browser-Tab ist transparent, das Symbol sitzt mittig
- Mein Ort: Ein kleines × am Ende des Feldes setzt den Ort zurück
- Flughafenblatt einheitlich aufklappbar: Wetter, Abflüge, Ankünfte, Pisten und Frequenzen sind Zeilen mit Kurzinfo (z. B. „VFR · Wind 020° 2 kt“, „nächster 07:10“) und Pfeil. Die Seite merkt sich, was du aufgeklappt hast. Abflüge und Ankünfte laden erst beim Aufklappen

## 2026-11-22

- Flughafenblatt: Der Flugplan steht jetzt direkt unter dem Wetter, Pisten folgen darunter, die Frequenzen sind eingeklappt
- Flugplan: Schon gelandete Flüge stehen nicht mehr unter den nächsten fünf. Bei Flughäfen in anderen Zeitzonen entscheidet der Status des Flugs, nicht die Uhr des Geräts
- Flüge mit dem Status „in der Luft“ sind antippbar: Die Karte springt zum Flugzeug und verfolgt es. Stimmt das Rufzeichen nicht mit der Flugnummer überein (Codeshare), sucht die Seite unter den Flugzeugen rund um den Flughafen das mit passender Route
- Handy: Das Detailblatt öffnet kompakt und lässt sich über den Griff oben (antippen oder ziehen) auf halbe und volle Höhe bringen. Solange es offen ist, blenden sich Filterleiste und Statuszeile aus, die Karte bleibt größer sichtbar
- Wetterkarte kürzer: eine Zeile mit Wind, Temperatur und Druck, alle Angaben und der METAR-Text klappen auf Tipp auf
- Start und Ziel in der Flugzeug-Karte sind antippbar: Ein Tipp öffnet das Flughafenblatt mit Piste, Frequenzen und Flugplan, die Karte springt zum Flughafen. Dabei endet die Verfolgung des Flugzeugs

## 2026-11-21

- Navigation lässt sich nach Art filtern: Der Knopf „Navigation“ öffnet eine Auswahl für große Verkehrsflughäfen, Flughäfen, Flugplätze, Hubschrauberlandeplätze, Wasserflugplätze sowie VOR/VORTAC/TACAN, DME und NDB.
- Flugplan: Es erscheinen immer die nächsten 5 Flüge, mit Tasten für die 5 früheren oder 5 späteren (Abflüge und Ankünfte). Überlappung der Überschrift mit den Tasten behoben.
- Notebook und iPad im Querformat: Das Detailblatt (Flug, Flughafen, Mein Ort, Meine Flüge) erscheint rechts neben der Karte, sodass die Karte die volle Höhe behält. Auf dem Handy bleibt alles wie bisher.
- Neu: Flugplan mit Uhrzeiten. Im Flughafenblatt zeigen „Abflüge“ und „Ankünfte“ die geplanten Flüge, Verspätungen und gestrichene Flüge (Quelle AirLabs, braucht einen Schlüssel im Vermittler).
- Erste Version: Live-Karte mit Flugzeugen aus offenen ADS-B-Netzwerken (adsb.lol, airplanes.live). Die Silhouette zeigt die Art und dreht sich in Flugrichtung, am Namen steht die Höhe
- Filter nach Verkehrsflugzeugen, Allgemeiner Luftfahrt, Hubschraubern, Militär und Segelflug, Flugzeuge am Boden zuschaltbar. Suche nach Flugnummer, Kennzeichen, Typ oder Transpondercode, Enter sucht weltweit
- Flugzeug verfolgen: Flugspur, Kurs der nächsten 5 Minuten, Route mit Start, Ziel, Restentfernung und geschätzter Ankunft
- Navigation: Flughäfen, Flugplätze, Pisten, Frequenzen und Funkfeuer (VOR, NDB, DME) aus OurAirports, mit Morsekennung
- Wetter: METAR-Meldungen auf der Karte in Flugwetterfarben und im Klartext
- Luftraum: openAIP-Karte mit Lufträumen und Meldepunkten, mit eigenem kostenlosem Schlüssel
- Mein Ort: welche Flugzeuge gerade über dir sind, mit Höhenwinkel und Himmelsrichtung, und welche bald vorbeikommen. An Flughäfen auch Landungen, Starts und das Flughafenwetter
- Meine Flüge: Flüge (gleiche Flugnummer jeden Tag) und einzelne Flugzeuge merken und weltweit wiederfinden
