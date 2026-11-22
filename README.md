# Prayer Times Map · مواقيت الصلاة

**English** · [Deutsch](README.de.md) · [العربية](README.ar.md)

[![API](https://img.shields.io/website?url=https%3A%2F%2Fprayer-times-map.salah-times.workers.dev%2Fapi%2Fhealth&label=API&up_message=online&down_message=offline)](https://prayer-times-map.salah-times.workers.dev/api/health)
[![Self-test](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fprayer-times-map.salah-times.workers.dev%2Fapi%2Fhealth&query=%24.data.status&label=self-test&color=brightgreen)](https://prayer-times-map.salah-times.workers.dev/api/health)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fprayer-times-map.salah-times.workers.dev%2Fapi%2Fhealth&query=%24.data.version&label=version&color=blue)](https://prayer-times-map.salah-times.workers.dev/api/health)
[![Service health](https://github.com/Mohmad-Naser-alnakeshbandi/prayer-times/actions/workflows/health.yml/badge.svg)](https://github.com/Mohmad-Naser-alnakeshbandi/prayer-times/actions/workflows/health.yml)

Prayer times for any place in the world – as an interactive map and as a JSON API.
Calculated with [adhan](https://github.com/batoulapps/adhan-js), time zones via
[tz-lookup](https://github.com/darkskyapp/tz-lookup), place names via
[Nominatim](https://nominatim.org/) (OpenStreetMap).

| | URL |
|---|---|
| Map | <https://prayer-times-map.salah-times.workers.dev/> |
| API docs | <https://prayer-times-map.salah-times.workers.dev/api/> |
| Example (JSON) | <https://prayer-times-map.salah-times.workers.dev/api/times?city=Pforzheim&country=Germany&method=TURKEY> |
| Service status | <https://prayer-times-map.salah-times.workers.dev/api/health> |

## Service status

| Badge | Meaning |
|---|---|
| **API** | Is the API reachable right now? (checked live on every page view) |
| **self-test** | Result of `/api/health`: `ok` or `degraded` |
| **version** | Currently deployed version |
| **Service health** | GitHub Action that calls the live API every 30 minutes and checks real results |

`GET /api/health` runs a self-test inside the worker (time zone lookup, prayer time
calculation, Qibla) without calling external services:

```json
{
  "status": 200,
  "endpoint": "health",
  "data": {
    "status": "ok",
    "service": "prayer-times-map",
    "version": "1.1.0",
    "time": "2026-11-22T20:15:00.000Z",
    "durationMs": 2,
    "checks": { "timezone": "ok", "calculation": "ok", "qibla": "ok" }
  }
}
```

If a check fails, the endpoint answers with HTTP `503` and `"status": "degraded"`.

## Features

**Map**
- Choose a place by clicking the map, searching for a city or using your device location
- Fajr, sunrise, Dhuhr, Asr, Maghrib, Isha – with a countdown to the next prayer
- 10 calculation methods (e.g. MWL, Umm al-Qura, Diyanet) and Asr by standard or Hanafi
- Hijri date, local time, time zone and Qibla direction
- Languages **Deutsch, English, العربية** (including right-to-left layout)
- Light and dark mode following the system setting, optimised for phones
- Shareable links, e.g. `/?lat=48.8908&lon=8.6987&lang=ar`
- Method, madhab and language are remembered in the browser

**API**
- Real JSON (`application/json`) for Postman, curl and other programs
- CORS enabled – usable via `fetch()` from other websites
- Location by coordinates or by city/country

## JSON API

Base URL: `https://prayer-times-map.salah-times.workers.dev`

| Endpoint | Description | Parameters |
|---|---|---|
| `GET /api/times` | Prayer times for one day | location, `date`, `method`, `madhab` |
| `GET /api/calendar` | Prayer times for a month | location, `month`, `method`, `madhab` |
| `GET /api/qibla` | Qibla direction in degrees from north | location |
| `GET /api/methods` | All methods and madhabs | – |
| `GET /api/health` | Service status (self-test) | – |
| `GET /api` | Overview of all endpoints | – |

### Parameters

| Parameter | Format | Default |
|---|---|---|
| `lat`, `lon` | Decimal degrees, e.g. `48.89`, `8.70` | – |
| `city`, `country` | Free text, e.g. `Pforzheim`, `Germany` (`country` optional) | – |
| `date` | `YYYY-MM-DD` | today at the location |
| `month` | `YYYY-MM` | current month at the location |
| `method` | `MWL`, `EGYPT`, `KARACHI`, `UMM_AL_QURA`, `DUBAI`, `QATAR`, `KUWAIT`, `SINGAPORE`, `TURKEY`, `NORTH_AMERICA` | `MWL` |
| `madhab` | `SHAFI` (Shafi'i, Maliki, Hanbali) or `HANAFI` | `SHAFI` |

The location is given either as `lat` + `lon` **or** as `city` (optionally with `country`).

### Example

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

`nextPrayer` is only set when `date` is "today" at the location. Times that do not exist at a
place (e.g. Isha during the polar summer) are `null`. Names and messages in the API are in German.

### Errors

Errors use a matching HTTP status and the same format:

```json
{ "status": 400, "endpoint": "times", "error": { "code": "invalid_lat", "message": "lat muss eine Zahl zwischen -90 und 90 sein." } }
```

| Status | Code | Meaning |
|---|---|---|
| 400 | `missing_location` | neither `lat`/`lon` nor `city` given |
| 400 | `invalid_lat`, `invalid_lon` | coordinate missing or out of range |
| 400 | `invalid_date`, `invalid_month` | wrong date format |
| 400 | `invalid_method`, `invalid_madhab` | unknown value (allowed values are listed in the message) |
| 404 | `city_not_found` | city not found |
| 405 | `method_not_allowed` | only `GET` is allowed |
| 422 | `timezone_not_found` | no time zone for this location |
| 502 | `geocoding_failed` | place search (Nominatim) unavailable |
| 503 | – | `/api/health` self-test failed |

### Notes

- Calculated times can differ from local mosque timetables (custom angles or minute offsets).
  In Germany, `TURKEY` (Diyanet) is often the closest match.
- City searches use the public Nominatim service and are cached for 30 days. Please avoid bulk
  requests with many different cities – use `lat`/`lon` for high volumes.

## Local development

Requirement: Node.js 20 or newer.

```bash
npm install
npm run dev
```

| | URL |
|---|---|
| Map | <http://127.0.0.1:8787/> |
| API docs | <http://127.0.0.1:8787/api/> |
| JSON | <http://127.0.0.1:8787/api/times?lat=48.89&lon=8.70&method=TURKEY> |

Without the worker (e.g. VS Code Live Server) the map and the browser API pages
(`api/times.html` etc.) work, but Postman and curl only receive HTML there, because the JSON is
created in the browser by JavaScript. With `&view=1` these pages show a formatted view.

## Deployment

Hosted as a [Cloudflare Worker](https://developers.cloudflare.com/workers/) with static assets.

```bash
npx wrangler login   # once
npm run deploy
```

The worker answers `/api` and `/api/*` (JSON) and serves everything else as static files.
A browser opening `/api/` gets the documentation, programs get the JSON overview. Files listed
in [`.assetsignore`](.assetsignore) (e.g. `node_modules`, `worker`, `wrangler.toml`) are not published.

`NOMINATIM_USER_AGENT` in [`wrangler.toml`](wrangler.toml) identifies requests to Nominatim –
please update it when using a different domain.

## Project structure

```
index.html                Map
css/                      Styles (base, layout, map, sidebar, prayers, i18n, api)
js/
  main.js                 Map entry point
  config.js               Methods, madhabs, prayers, external services
  core/                   State, time helpers, settings, translations
  i18n/                   Translations (de, en, ar)
  services/               Calculation, Qibla, time zone, place search, device location
  ui/                     Map, search, controls, sidebar, messages
  api/                    API logic (shared by browser pages and worker)
api/                      API documentation and browser API pages
worker/index.js           Cloudflare Worker (JSON API, health check)
.github/workflows/        Scheduled service health check
wrangler.toml             Worker configuration
```

## Credits & data

- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Map: [Leaflet](https://leafletjs.com/)
- Place search: [Nominatim](https://nominatim.org/) –
  [usage policy](https://operations.osmfoundation.org/policies/nominatim/)
