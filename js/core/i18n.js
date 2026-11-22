// Mehrsprachigkeit: Wörterbücher, Sprachwahl, Übersetzen der Seite.
import de from "../i18n/de.js";
import en from "../i18n/en.js";
import ar from "../i18n/ar.js";

export const LANGUAGES = [
  { id: "de", name: "Deutsch", short: "DE", locale: "de-DE", dir: "ltr" },
  { id: "en", name: "English", short: "EN", locale: "en-GB", dir: "ltr" },
  // Lateinische Ziffern, damit Uhrzeiten einheitlich und gut lesbar bleiben
  { id: "ar", name: "العربية", short: "عربي", locale: "ar", dir: "rtl", numberingSystem: "latn" }
];

const DICTIONARIES = { de, en, ar };
const FALLBACK = "de";
const listeners = new Set();
let current = LANGUAGES[0];

const isSupported = (id) => LANGUAGES.some((l) => l.id === id);

/** Reihenfolge: ?lang= in der URL → gespeichert → Browsersprache → Deutsch. */
export function detectLanguage(saved) {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (isSupported(fromUrl)) return fromUrl;
  if (isSupported(saved)) return saved;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = String(tag).slice(0, 2).toLowerCase();
    if (isSupported(base)) return base;
  }
  return FALLBACK;
}

export const getLanguage = () => current;

/** Optionen für Intl-Formatierer der aktuellen Sprache. */
export const intlOptions = () => ({
  locale: current.locale,
  numberingSystem: current.numberingSystem
});

function lookup(dict, key) {
  return key.split(".").reduce((node, part) => node?.[part], dict);
}

/** Übersetzt einen Schlüssel wie "map.searchButton"; {name} wird ersetzt. */
export function t(key, vars = {}) {
  let value = lookup(DICTIONARIES[current.id], key) ?? lookup(DICTIONARIES[FALLBACK], key);
  if (value === undefined) return key;
  if (typeof value !== "string") return value;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, replacement);
  }
  return value;
}

/**
 * Überträgt data-i18n-Attribute auf Text, HTML (nur eigene Wörterbuch-Texte),
 * Platzhalter und aria-label. Der Seitentitel kommt aus <html data-i18n-title="…">.
 */
export function applyTranslations(root = document) {
  for (const el of root.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
  for (const el of root.querySelectorAll("[data-i18n-html]")) el.innerHTML = t(el.dataset.i18nHtml);
  for (const el of root.querySelectorAll("[data-i18n-placeholder]")) el.placeholder = t(el.dataset.i18nPlaceholder);
  for (const el of root.querySelectorAll("[data-i18n-aria-label]")) el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  document.title = t(document.documentElement.dataset.i18nTitle || "meta.title");
}

/** Füllt einen Segment-Schalter mit DE · EN · عربي; onSelect(id) bei Wechsel. */
export function renderLanguageSwitch(container, onSelect) {
  container.replaceChildren(...LANGUAGES.map(({ id, short, name }) => {
    const label = document.createElement("label");
    label.title = name;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `${container.id}-lang`;
    input.value = id;
    input.checked = id === current.id;
    const span = document.createElement("span");
    span.textContent = short;
    span.lang = id;
    label.append(input, span);
    return label;
  }));
  container.addEventListener("change", (event) => onSelect(event.target.value));
}

export function setLanguage(id) {
  current = LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
  document.documentElement.lang = current.id;
  document.documentElement.dir = current.dir;
  applyTranslations();
  listeners.forEach((fn) => fn(current));
}

export function onLanguageChange(fn) {
  listeners.add(fn);
}
