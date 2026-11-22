// Ortssuche über der Karte: Absenden → Trefferliste → Auswahl.
import { $ } from "../core/dom.js";
import { getLanguage, t } from "../core/i18n.js";
import { searchPlaces } from "../services/geocode.js";

/** onPick({ lat, lon, name }) wird bei Auswahl eines Treffers aufgerufen. */
export function initSearch(onPick, onError) {
  const form = $("searchForm");
  const input = $("searchInput");
  const button = $("searchBtn");
  const list = $("searchResults");

  const clear = () => list.replaceChildren();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (text.length < 2) return;

    button.disabled = true;
    button.textContent = "…";
    try {
      const places = await searchPlaces(text, getLanguage().id);
      renderResults(places);
    } catch {
      clear();
      onError(t("errors.search"));
    } finally {
      button.disabled = false;
      button.textContent = t("map.searchButton");
    }
  });

  function renderResults(places) {
    if (places.length === 0) {
      const empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = t("map.noResults");
      list.replaceChildren(empty);
      return;
    }
    // Erster Treffer direkt übernehmen, weitere zur Auswahl anbieten
    if (places.length === 1) { pick(places[0]); return; }

    list.replaceChildren(...places.map((place) => {
      const item = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      const title = document.createElement("strong");
      title.textContent = place.name;
      const detail = document.createElement("span");
      detail.textContent = place.detail;
      btn.append(title, detail);
      btn.addEventListener("click", () => pick(place));
      item.append(btn);
      return item;
    }));
  }

  function pick(place) {
    clear();
    input.value = place.name;
    onPick(place);
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") clear();
  });
  document.addEventListener("click", (event) => {
    if (!form.contains(event.target)) clear();
  });
}
