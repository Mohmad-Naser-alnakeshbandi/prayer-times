// Ermittelt den Ort aus lat/lon oder city/country inkl. Zeitzone.
import { searchCity } from "../services/geocode.js";
import { findTimeZone } from "../services/timezone.js";
import { ApiError, parseCoordinates } from "./params.js";

export async function resolveLocation(query) {
  let place = parseCoordinates(query);
  let source = "coordinates";

  if (!place) {
    if (!query.city) {
      throw new ApiError(400, "missing_location",
        "Bitte entweder lat und lon oder city (optional mit country) angeben.");
    }
    try {
      place = await searchCity(query.city, query.country);
    } catch {
      throw new ApiError(502, "geocoding_failed", "Die Ortssuche (Nominatim) ist gerade nicht erreichbar.");
    }
    if (!place) {
      const where = query.country ? `${query.city}, ${query.country}` : query.city;
      throw new ApiError(404, "city_not_found", `Ort nicht gefunden: ${where}.`);
    }
    source = "geocoded";
  }

  const timezone = findTimeZone(place.lat, place.lon);
  if (!timezone) {
    throw new ApiError(422, "timezone_not_found", "Für diesen Ort konnte keine Zeitzone ermittelt werden.");
  }

  return {
    ...(place.name && { name: place.name }),
    latitude: place.lat,
    longitude: place.lon,
    timezone,
    source
  };
}
