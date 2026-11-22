// Ermittelt den Ort aus lat/lon oder city/country inkl. Zeitzone.
import { searchCity } from "../services/geocode.js";
import { findTimeZone } from "../services/timezone.js";
import { ApiError, parseCoordinates } from "./params.js";

/** language bestimmt die Sprache des Ortsnamens (bei city-Suche). */
export async function resolveLocation(query, language = "de") {
  let place = parseCoordinates(query);
  let source = "coordinates";

  if (!place) {
    if (!query.city) throw new ApiError(400, "missing_location");
    try {
      place = await searchCity(query.city, query.country, language);
    } catch {
      throw new ApiError(502, "geocoding_failed");
    }
    if (!place) {
      const where = query.country ? `${query.city}, ${query.country}` : query.city;
      throw new ApiError(404, "city_not_found", { where });
    }
    source = "geocoded";
  }

  const timezone = findTimeZone(place.lat, place.lon);
  if (!timezone) throw new ApiError(422, "timezone_not_found");

  return {
    ...(place.name && { name: place.name }),
    latitude: place.lat,
    longitude: place.lon,
    timezone,
    source
  };
}
