# Prayer Times Map · مواقيت الصلاة

Gebetszeiten für jeden Ort der Welt – als interaktive Karte und als JSON-API.
Die Berechnung erfolgt mit [adhan](https://github.com/batoulapps/adhan-js), Zeitzonen über
[tz-lookup](https://github.com/darkskyapp/tz-lookup), Ortsnamen über
[Nominatim](https://nominatim.org/) (OpenStreetMap).

**Live:** <https://prayer-times-map.salah-times.workers.dev/>

| | URL |
|---|---|
| Karte | <https://prayer-times-map.salah-times.workers.dev/> |
| API-Dokumentation | <https://prayer-times-map.salah-times.workers.dev/api/> |
| Beispiel (JSON) | <https://prayer-times-map.salah-times.workers.dev/api/times?city=Pforzheim&country=Germany&method=TURKEY> |

## Funktionen

**Karte**
- Ort per Klick auf die Karte, Stadtsuche oder Geräte-Standort wählen
- Fajr, Sonnenaufgang, Dhuhr, Asr, Maghrib, Isha – mit Countdown zum nächsten Gebet
- 10 Berechnungsmethoden (u. a. MWL, Umm al-Qura, Diyanet) und Asr nach Standard oder Hanafi
- Hijri-Datum, Ortszeit, Zeitzone und Qibla-Richtung
- Sprachen **Deutsch, English, العربية** (inkl. Rechts-nach-links-Layout)
- Hell- und Dunkelmodus nach Systemeinstellung, optimiert für Smartphone
- Teilbare Links, z. B. `/?lat=48.8908&lon=8.6987&lang=ar`
- Methode, Madhab und Sprache werden im Browser gespeichert

**API**
- Echtes JSON (`application/json`) für Postman, curl und andere Programme
- CORS aktiviert – auch aus anderen Webseiten per `fetch()` nutzbar
- Ort über Koordinaten oder Stadt/Land

## JSON-API

Basis-URL: `https://prayer-times-map.salah-times.workers.dev`

| Endpunkt | Beschreibung | Parameter |
|---|---|---|
| `GET /api/times` | Gebetszeiten eines Tages | Ort, `date`, `method`, `madhab` |
| `GET /api/calendar` | Gebetszeiten eines Monats | Ort, `month`, `method`, `madhab` |
| `GET /api/qibla` | Qibla-Richtung in Grad ab Norden | Ort |
| `GET /api/methods` | Alle Methoden und Madhabs | – |
| `GET /api` | Übersicht der Endpunkte | – |

### Parameter

| Parameter | Format | Standard |
|---|---|---|
| `lat`, `lon` | Dezimalgrad, z. B. `48.89`, `8.70` | – |
| `city`, `country` | Freitext, z. B. `Pforzheim`, `Germany` (`country` optional) | – |
| `date` | `YYYY-MM-DD` | heute am Ort |
| `month` | `YYYY-MM` | aktueller Monat am Ort |
| `method` | `MWL`, `EGYPT`, `KARACHI`, `UMM_AL_QURA`, `DUBAI`, `QATAR`, `KUWAIT`, `SINGAPORE`, `TURKEY`, `NORTH_AMERICA` | `MWL` |
| `madhab` | `SHAFI` (Schafi'i, Maliki, Hanbali) oder `HANAFI` | `SHAFI` |

Der Ort wird entweder über `lat` + `lon` **oder** über `city` (optional mit `country`) angegeben.

### Beispiel

```bash
curl "https://prayer-times-map.salah-times.workers.dev/api/times?lat=48.89&lon=8.70&date=2026-11-22&method=TURKEY"
```

```json
{
  "status": 200,
  "endpoint": "times",
  "data": {
    "location": { "latitude": 48.89, "longitude": 8.7, "timezone": "Europe/Berlin", "source": "coordinates" },
    "date": "2026-11-22",
    "method": { "id": "TURKEY", "name": "Diyanet / Türkei" },
    "madhab": { "id": "SHAFI", "name": "Schafi'i, Maliki, Hanbali" },
    "times": {
      "fajr": "05:53", "sunrise": "07:38", "dhuhr": "12:16",
      "asr": "14:20", "maghrib": "16:44", "isha": "18:23"
    },
    "timesIso": { "fajr": "2026-11-22T05:53:00+01:00", "…": "…" },
    "nextPrayer": { "prayer": "fajr", "time": "05:54", "tomorrow": true, "inSeconds": 31208 }
  }
}
```

`nextPrayer` ist nur gesetzt, wenn `date` am Ort „heute“ ist. Zeiten, die es an einem Ort nicht
gibt (z. B. Isha im Polarsommer), sind `null`.

### Fehler

Fehler kommen mit passendem HTTP-Status im selben Format:

```json
{ "status": 400, "endpoint": "times", "error": { "code": "invalid_lat", "message": "lat muss eine Zahl zwischen -90 und 90 sein." } }
```

| Status | Code | Bedeutung |
|---|---|---|
| 400 | `missing_location` | weder `lat`/`lon` noch `city` angegeben |
| 400 | `invalid_lat`, `invalid_lon` | Koordinate fehlt oder außerhalb des Bereichs |
| 400 | `invalid_date`, `invalid_month` | falsches Datumsformat |
| 400 | `invalid_method`, `invalid_madhab` | unbekannter Wert (erlaubte Werte stehen in der Meldung) |
| 404 | `city_not_found` | Stadt nicht gefunden |
| 405 | `method_not_allowed` | nur `GET` ist erlaubt |
| 422 | `timezone_not_found` | keine Zeitzone für den Ort |
| 502 | `geocoding_failed` | Ortssuche (Nominatim) nicht erreichbar |

### Hinweise

- Die berechneten Zeiten können von lokalen Moschee-Kalendern abweichen (eigene Winkel oder
  Minuten-Aufschläge). In Deutschland liegt oft `TURKEY` (Diyanet) am nächsten.
- Stadtsuchen nutzen den öffentlichen Dienst Nominatim und werden 30 Tage zwischengespeichert.
  Bitte keine Massenabfragen mit wechselnden Städten – für viele Anfragen besser `lat`/`lon` nutzen.

## Lokal entwickeln

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

| | URL |
|---|---|
| Karte | <http://127.0.0.1:8787/> |
| API-Doku | <http://127.0.0.1:8787/api/> |
| JSON | <http://127.0.0.1:8787/api/times?lat=48.89&lon=8.70&method=TURKEY> |

Ohne Worker (z. B. mit VS Code Live Server) funktionieren Karte und die Browser-API-Seiten
(`api/times.html` usw.), aber Postman und curl erhalten dort nur HTML, weil das JSON erst im
Browser per JavaScript entsteht. Mit `&view=1` zeigen diese Seiten eine formatierte Ansicht.

## Veröffentlichen

Gehostet als [Cloudflare Worker](https://developers.cloudflare.com/workers/) mit statischen Assets.

```bash
npx wrangler login   # einmalig
npm run deploy
```

Der Worker beantwortet `/api` und `/api/*` (JSON) und liefert alles andere als statische
Dateien aus. Ruft ein Browser `/api/` auf, erhält er die Dokumentation, Programme die
JSON-Übersicht. Nicht veröffentlicht werden die in [`.assetsignore`](.assetsignore)
gelisteten Dateien (z. B. `node_modules`, `worker`, `wrangler.toml`).

In [`wrangler.toml`](wrangler.toml) steht unter `NOMINATIM_USER_AGENT` die Kennung, mit der
Anfragen an Nominatim gesendet werden – bei einer neuen Domain bitte anpassen.

## Projektstruktur

```
index.html                Karte
css/                      Styles (base, layout, map, sidebar, prayers, i18n, api)
js/
  main.js                 Einstieg der Karte
  config.js               Methoden, Madhabs, Gebete, externe Dienste
  core/                   Zustand, Zeit-Helfer, Einstellungen, Mehrsprachigkeit
  i18n/                   Übersetzungen (de, en, ar)
  services/               Berechnung, Qibla, Zeitzone, Ortssuche, Geräte-Standort
  ui/                     Karte, Suche, Eingaben, Seitenleiste, Meldungen
  api/                    API-Logik (gemeinsam für Browser-Seiten und Worker)
api/                      API-Dokumentation und Browser-API-Seiten
worker/index.js           Cloudflare Worker (JSON-API)
wrangler.toml             Worker-Konfiguration
```

Die Berechnungslogik in `js/services/` und `js/api/` wird von Karte, Browser-API und Worker
gemeinsam genutzt.

## Lizenzen & Daten

- Kartendaten © [OpenStreetMap](https://www.openstreetmap.org/copyright)-Mitwirkende
- Karte: [Leaflet](https://leafletjs.com/)
- Ortssuche: [Nominatim](https://nominatim.org/) –
  [Nutzungsrichtlinie](https://operations.osmfoundation.org/policies/nominatim/)
