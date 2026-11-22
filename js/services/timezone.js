import tzLookup from "tz-lookup"; // Browser: Import-Map in index.html · Node: node_modules

/** Zeitzone für Koordinaten oder null, falls keine gefunden wird. */
export function findTimeZone(lat, lon) {
  try {
    return tzLookup(lat, lon);
  } catch {
    return null;
  }
}
