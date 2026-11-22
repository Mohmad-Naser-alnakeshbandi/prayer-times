// Eingabefelder der Seitenleiste, Sprachumschalter und Standort-Button.
import { CALCULATION_METHODS, MADHABS } from "../config.js";
import { $ } from "../core/dom.js";
import { LANGUAGES, t } from "../core/i18n.js";

/** Segment-Schalter (iOS-Stil) aus Radio-Buttons. */
function fillSegmented(group, name, items) {
  group.replaceChildren(...items.map(({ id, text, title, lang }) => {
    const wrapper = document.createElement("label");
    if (title) wrapper.title = title;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = id;
    const span = document.createElement("span");
    span.textContent = text;
    if (lang) span.lang = lang;
    wrapper.append(input, span);
    return wrapper;
  }));
}

const checkedValue = (group) => group.querySelector("input:checked")?.value;
const check = (group, value) => {
  group.querySelectorAll("input").forEach((input) => { input.checked = input.value === value; });
};

/** Beschriftet Methoden und Madhabs in der aktuellen Sprache (Auswahl bleibt erhalten). */
export function translateControls() {
  const select = $("methodSelect");
  const method = select.value;
  select.replaceChildren(...CALCULATION_METHODS.map(({ id }) => new Option(t(`methods.${id}`), id)));
  if (method) select.value = method;

  const group = $("madhabGroup");
  const madhab = checkedValue(group) ?? MADHABS[0].id;
  fillSegmented(group, "madhab", MADHABS.map(({ id }) => ({
    id, text: t(`madhabs.${id}.short`), title: t(`madhabs.${id}.label`)
  })));
  check(group, madhab);
}

/** Baut die Auswahlen auf und übernimmt gespeicherte Werte. */
export function initControls(saved = {}, languageId) {
  translateControls();
  if (CALCULATION_METHODS.some((m) => m.id === saved.methodId)) $("methodSelect").value = saved.methodId;
  if (MADHABS.some((m) => m.id === saved.madhabId)) check($("madhabGroup"), saved.madhabId);

  fillSegmented($("langGroup"), "lang", LANGUAGES.map(({ id, short, name }) => ({
    id, text: short, title: name, lang: id
  })));
  check($("langGroup"), languageId);
}

export const getDate = () => $("dateInput").value;
export const setDate = (value) => { $("dateInput").value = value; };

export function getSettings() {
  return {
    methodId: $("methodSelect").value,
    madhabId: checkedValue($("madhabGroup")) ?? MADHABS[0].id
  };
}

export function onDateChange(handler) { $("dateInput").addEventListener("change", handler); }
export function onTodayClick(handler) { $("todayBtn").addEventListener("click", handler); }
export function onLocateClick(handler) { $("locateBtn").addEventListener("click", handler); }

export function onSettingsChange(handler) {
  $("methodSelect").addEventListener("change", handler);
  $("madhabGroup").addEventListener("change", handler);
}

export function onLanguageSelect(handler) {
  $("langGroup").addEventListener("change", () => handler(checkedValue($("langGroup"))));
}

let locating = false;

export function setLocating(busy) {
  locating = busy;
  const btn = $("locateBtn");
  btn.disabled = busy;
  btn.querySelector("span").textContent = t(busy ? "map.locating" : "map.locate");
}

/** Nach Sprachwechsel den aktuellen Button-Zustand neu beschriften. */
export const refreshLocateLabel = () => setLocating(locating);
