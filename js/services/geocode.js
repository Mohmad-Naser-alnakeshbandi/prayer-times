// Ortsnamen über Nominatim. Nur bei Nutzeraktion aufrufen,
// nicht automatisiert oder in schneller Folge.
import { NOMINATIM_URL, NOMINATIM_SEARCH_URL } from "../config.js";

let controller = null;

// Optional von außen einstellbar (z. B. im Cloudflare Worker):
// zusätzliche Header wie User-Agent und ein Cache für Stadtsuchen.
let extraHeaders = {};
let cityCache = null; // { get(key) → Wert | undefined, put(key, value) }

export function configureGeocoding({ headers = {}, cache = null } = {}) {
  extraHeaders = headers;
  cityCache = cache;
}

const requestHeaders = () => ({ Accept: "application/json", ...extraHeaders });

/**
 * Liefert den Ortsnamen in der gewünschten Sprache ("" wenn unbekannt).
 * Eine noch laufende frühere Anfrage wird abgebrochen und liefert null.
 */
export async function reverseGeocode(lat, lon, language = "de") {
  controller?.abort();
  controller = new AbortController();

  const url = new URL(NOMINATIM_URL);
  url.search = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
    zoom: "10",
    "accept-language": language
  });

  try {
    const response = await fetch(url, {
      headers: requestHeaders(),
      signal: controller.signal
    });
    if (!response.ok) throw new Error("Ortsname konnte nicht geladen werden.");
    const data = await response.json();
    return formatPlace(data.address || {}, language);
  } catch (error) {
    if (error.name === "AbortError") return null;
    throw error;
  }
}

/**
 * Sucht eine Stadt (optional mit Land) und liefert Koordinaten + Namen,
 * oder null, wenn nichts gefunden wurde.
 */
export async function searchCity(city, country, language = "de") {
  const cacheKey = `city:${language}:${city.toLowerCase()}|${(country ?? "").toLowerCase()}`;
  const cached = await cityCache?.get(cacheKey);
  if (cached !== undefined) return cached;

  const url = new URL(NOMINATIM_SEARCH_URL);
  url.search = new URLSearchParams({
    format: "jsonv2",
    city,
    ...(country && { country }),
    limit: "1",
    addressdetails: "1",
    "accept-language": language
  });

  const response = await fetch(url, { headers: requestHeaders() });
  if (!response.ok) throw new Error("Ortssuche fehlgeschlagen.");
  const [hit] = await response.json();
  const place = hit
    ? { lat: Number(hit.lat), lon: Number(hit.lon), name: formatPlace(hit.address || {}, language) }
    : null;
  await cityCache?.put(cacheKey, place); // auch "nicht gefunden" merken
  return place;
}

/**
 * Freitextsuche für die Karte (bis zu 5 Treffer). Nur beim Absenden
 * aufrufen – Nominatim erlaubt keine Autovervollständigung.
 */
export async function searchPlaces(text, language = "de") {
  const url = new URL(NOMINATIM_SEARCH_URL);
  url.search = new URLSearchParams({
    format: "jsonv2",
    q: text,
    limit: "5",
    addressdetails: "1",
    "accept-language": language
  });

  const response = await fetch(url, { headers: requestHeaders() });
  if (!response.ok) throw new Error("Ortssuche fehlgeschlagen.");
  const hits = await response.json();
  return hits.map((hit) => ({
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    name: formatPlace(hit.address || {}, language) || hit.display_name,
    detail: hit.display_name
  }));
}

function formatPlace(a, language = "de") {
  const name = a.city || a.town || a.village || a.municipality || a.county || a.state;
  const separator = language === "ar" ? "، " : ", ";
  if (name && a.country && name !== a.country) return `${name}${separator}${a.country}`;
  return name || a.country || ""; // "" = kein Name bekannt
}
