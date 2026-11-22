// Kurzzeitige Hinweis-/Fehlermeldung über der Karte.
import { $ } from "../core/dom.js";

let timer = null;

export function showError(message, durationMs = 5000) {
  const el = $("mapError");
  el.textContent = message;
  el.style.display = "block";
  window.clearTimeout(timer);
  timer = window.setTimeout(() => { el.style.display = "none"; }, durationMs);
}
