// Cloudflare Worker: echte JSON-API für Postman, curl & Co.
// Nutzt dieselbe Logik wie die Browser-API (js/api, js/services).
// Alles außerhalb von /api/<endpunkt> wird als statische Datei ausgeliefert (Karte, Doku).
import { execute } from "../js/api/run.js";
import { readQuery } from "../js/api/params.js";
import { configureGeocoding } from "../js/services/geocode.js";
import { API_LANGUAGES, DEFAULT_API_LANGUAGE, overviewText } from "../js/api/messages.js";
import { computePrayerDay, qiblaDirection } from "../js/services/prayer-times.js";
import { findTimeZone } from "../js/services/timezone.js";

const SERVICE = { name: "prayer-times-map", version: "1.2.0" };

const ROUTES = {
  "/api/times": "times",
  "/api/calendar": "calendar",
  "/api/qibla": "qibla",
  "/api/methods": "methods"
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const GEOCODE_TTL = 60 * 60 * 24 * 30; // Stadtsuchen 30 Tage merken

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...CORS,
      ...extraHeaders
    }
  });
}

/** Cache für Stadtsuchen über die Cache-API von Cloudflare (pro Rechenzentrum). */
function geocodeCache(ctx) {
  const keyUrl = (key) => `https://geocode.cache.internal/${encodeURIComponent(key)}`;
  return {
    async get(key) {
      const hit = await caches.default.match(keyUrl(key));
      return hit ? (await hit.json()).value : undefined;
    },
    async put(key, value) {
      const response = new Response(JSON.stringify({ value }), {
        headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${GEOCODE_TTL}` }
      });
      ctx.waitUntil(caches.default.put(keyUrl(key), response));
    }
  };
}

/**
 * Selbsttest ohne externe Dienste: Zeitzone, Gebetszeiten und Qibla für Mekka
 * (dort gibt es das ganze Jahr alle Zeiten). Nominatim wird bewusst nicht geprüft.
 */
function health() {
  const started = Date.now();
  const checks = {};
  const run = (name, fn) => {
    try { checks[name] = fn() ? "ok" : "failed"; } catch { checks[name] = "failed"; }
  };

  run("timezone", () => findTimeZone(21.4225, 39.8262) === "Asia/Riyadh");
  run("calculation", () => {
    const { times } = computePrayerDay({
      lat: 21.4225, lon: 39.8262, timeZone: "Asia/Riyadh",
      dateString: "2026-01-01", methodId: "UMM_AL_QURA", madhabId: "SHAFI"
    });
    return ["fajr", "dhuhr", "asr", "maghrib", "isha"].every((k) => times[k] instanceof Date && !isNaN(times[k]));
  });
  run("qibla", () => Math.abs(qiblaDirection(48.89, 8.70) - 126.8) < 1);

  const ok = Object.values(checks).every((v) => v === "ok");
  const status = ok ? 200 : 503;
  return {
    status,
    body: {
      status,
      endpoint: "health",
      data: {
        status: ok ? "ok" : "degraded",
        service: SERVICE.name,
        version: SERVICE.version,
        time: new Date().toISOString(),
        durationMs: Date.now() - started,
        checks
      }
    }
  };
}

function overview(origin, lang) {
  const ex = (path) => `${origin}${path}`;
  const text = overviewText(lang);
  return {
    status: 200,
    endpoint: "index",
    data: {
      name: "Prayer Times API",
      format: "JSON (application/json), CORS",
      location: text.location,
      languages: API_LANGUAGES,
      endpoints: [
        { path: "/api/times", description: text.times,
          params: ["lat", "lon", "city", "country", "date=YYYY-MM-DD", "method", "madhab", "lang"],
          example: ex("/api/times?city=Pforzheim&country=Germany&method=TURKEY") },
        { path: "/api/calendar", description: text.calendar,
          params: ["lat", "lon", "city", "country", "month=YYYY-MM", "method", "madhab", "lang"],
          example: ex("/api/calendar?lat=48.89&lon=8.70&month=2026-12&method=TURKEY") },
        { path: "/api/qibla", description: text.qibla,
          params: ["lat", "lon", "city", "country", "lang"],
          example: ex("/api/qibla?city=Wien&country=Austria") },
        { path: "/api/methods", description: text.methods,
          params: ["lang"], example: ex("/api/methods?lang=en") },
        { path: "/api/health", description: text.health,
          params: [], example: ex("/api/health") }
      ]
    }
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    if (path === "/api/health") {
      const { status, body } = health();
      return json(status, body);
    }

    const name = ROUTES[path];
    if (!name && path !== "/api") {
      // Karte, Doku, CSS, JS … als statische Dateien
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return json(404, { status: 404, error: { code: "not_found", message: `Unbekannter Pfad: ${path}` } });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return json(405, { status: 405, error: { code: "method_not_allowed", message: "Nur GET ist erlaubt." } },
        { Allow: "GET, HEAD, OPTIONS" });
    }

    if (path === "/api") {
      // Browser (Accept: text/html) → Doku-Seite; Postman/curl → JSON-Übersicht
      const wantsHtml = (request.headers.get("Accept") ?? "").includes("text/html");
      if (wantsHtml && env.ASSETS) return env.ASSETS.fetch(new Request(new URL("/api/", url), request));
      const lang = String(url.searchParams.get("lang") ?? "").toLowerCase();
      return json(200, overview(url.origin, API_LANGUAGES.includes(lang) ? lang : DEFAULT_API_LANGUAGE));
    }

    // Nominatim verlangt einen erkennbaren User-Agent
    configureGeocoding({
      headers: { "User-Agent": env.NOMINATIM_USER_AGENT || "prayer-times-map/1.0" },
      cache: geocodeCache(ctx)
    });

    const query = readQuery(url.search);
    delete query.view;
    delete query.raw;

    const result = await execute(name, query);
    return json(result.status, result);
  }
};
