// Gemeinsamer App-Zustand.
export const state = {
  location: null,     // { lat, lon }
  timeZone: null,     // z. B. "Europe/Berlin"
  dateTouched: false, // Datum manuell geändert?
  next: null          // { key, time, tomorrow } für den Countdown
};
