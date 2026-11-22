// Cloudflare Worker: echte JSON-API für Postman, curl & Co.
// Nutzt dieselbe Logik wie die Browser-API (js/api, js/services).
// Alles außerhalb von /api/<endpunkt> wird als statische Datei ausgeliefert (Karte, Doku).
import { execute } from "../js/api/run.js";
import { readQuery } from "../js/api/params.js";
import { configureGeocoding } from "../js/services/geocode.js";

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

function overview(origin) {
  const ex = (path) => `${origin}${path}`;
  return {
    status: 200,
    endpoint: "index",
    data: {
      name: "Prayer Times API",
      format: "JSON (application/json), CORS aktiviert",
      location: "lat & lon ODER city (+ optional country)",
      endpoints: [
        { path: "/api/times", description: "Gebetszeiten eines Tages",
          params: ["lat", "lon", "city", "country", "date=YYYY-MM-DD", "method", "madhab"],
          example: ex("/api/times?city=Pforzheim&country=Germany&method=TURKEY") },
        { path: "/api/calendar", description: "Gebetszeiten eines Monats",
          params: ["lat", "lon", "city", "country", "month=YYYY-MM", "method", "madhab"],
          example: ex("/api/calendar?lat=48.89&lon=8.70&month=2026-12&method=TURKEY") },
        { path: "/api/qibla", description: "Qibla-Richtung in Grad",
          params: ["lat", "lon", "city", "country"],
          example: ex("/api/qibla?city=Wien&country=Austria") },
        { path: "/api/methods", description: "Berechnungsmethoden und Madhabs",
          params: [], example: ex("/api/methods") }
      ]
    }
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

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
      return json(200, overview(url.origin));
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
