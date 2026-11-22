// Speichert Einstellungen (Methode, Madhab, Sprache) im Browser (best effort).
import { STORAGE_KEY } from "../config.js";

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Ergänzt die gespeicherten Einstellungen um die übergebenen Werte. */
export function saveSettings(changes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadSettings(), ...changes }));
  } catch { /* Speicher nicht verfügbar – ignorieren */ }
}
