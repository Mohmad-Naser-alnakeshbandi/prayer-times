// Einstiegspunkt: verbindet Karte, Suche, Eingaben, Sprache, Berechnung und Anzeige.
import { state } from "./core/state.js";
import { loadSettings, saveSettings } from "./core/settings.js";
import { browserTimeZone, todayIn } from "./core/time.js";
import { detectLanguage, getLanguage, onLanguageChange, setLanguage, t } from "./core/i18n.js";
import { findTimeZone } from "./services/timezone.js";
import { reverseGeocode } from "./services/geocode.js";
import { getCurrentPosition } from "./services/geolocation.js";
import { computePrayerDay, qiblaDirection } from "./services/prayer-times.js";
import { initMap, setMarker, focusOn } from "./ui/map.js";
import { initSearch } from "./ui/search.js";
import { showError } from "./ui/notify.js";
import * as controls from "./ui/controls.js";
import * as sidebar from "./ui/sidebar.js";

function recalculate() {
  state.next = null;
  const dateString = controls.getDate();
  sidebar.renderDateInfo(dateString);

  if (state.location && state.timeZone && dateString) {
    try {
      const { times, next, isToday } = computePrayerDay({
        ...state.location,
        timeZone: state.timeZone,
        dateString,
        ...controls.getSettings()
      });
      state.next = next;
      sidebar.renderPrayerList(times, state.timeZone, next, isToday);
    } catch (error) {
      console.error(error);
      showError(t("errors.calculation"));
    }
  }
  tick();
}

let selectionId = 0;

/** Lädt den Ortsnamen in der aktuellen Sprache – nur wenn der Ort noch aktuell ist. */
async function loadPlaceName(id, lat, lon) {
  sidebar.renderPlace(t("place.loading"));
  try {
    const name = await reverseGeocode(lat, lon, getLanguage().id);
    if (name !== null && id === selectionId) sidebar.renderPlace(name || t("place.fallback"));
  } catch {
    if (id === selectionId) sidebar.renderPlace(t("place.fallback"));
  }
}

/** knownName: Ortsname aus der Suche – dann entfällt die Rückwärtssuche. */
function selectLocation(lat, lon, knownName = null) {
  const id = ++selectionId;
  state.location = { lat, lon };
  state.timeZone = findTimeZone(lat, lon);

  setMarker(lat, lon);
  updateUrl({ lat: lat.toFixed(4), lon: lon.toFixed(4) });
  sidebar.renderCoordinates(lat, lon);
  sidebar.renderTimeZone(state.timeZone);
  sidebar.renderQibla(qiblaDirection(lat, lon));

  if (!state.timeZone) {
    showError(t("errors.noTimezone"));
  } else if (!state.dateTouched) {
    controls.setDate(todayIn(state.timeZone));
  }
  recalculate();

  if (knownName) sidebar.renderPlace(knownName);
  else loadPlaceName(id, lat, lon);
}

/** Teilbarer Link: Parameter in der Adresszeile setzen (ohne neuen Verlaufseintrag). */
function updateUrl(params) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  history.replaceState(null, "", url);
}

/** Öffnet einen Ort aus ?lat=…&lon=…, falls gültig angegeben. */
function selectFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  if (!params.has("lat") || !params.has("lon")) return;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return;
  focusOn(lat, lon);
  selectLocation(lat, lon);
}

/** Läuft jede Sekunde: Ortszeit + Countdown, Neuberechnung bei Gebetsbeginn. */
function tick() {
  sidebar.renderLocalTime(state.timeZone);

  if (state.next && state.next.time <= Date.now()) {
    if (!state.dateTouched) controls.setDate(todayIn(state.timeZone));
    recalculate();
    return;
  }
  sidebar.renderNextPrayer(state.next, state.timeZone);
}

async function locateUser() {
  controls.setLocating(true);
  try {
    const { lat, lon } = await getCurrentPosition();
    focusOn(lat, lon);
    selectLocation(lat, lon);
  } catch (error) {
    showError(t(error.code === "unsupported" ? "errors.geoUnsupported" : "errors.geoDenied"));
  } finally {
    controls.setLocating(false);
  }
}

/** Alles Sprachabhängige neu darstellen. */
function onLanguageChanged(language) {
  controls.translateControls();
  controls.refreshLocateLabel();
  if (state.timeZone === null && state.location) sidebar.renderTimeZone(null);
  sidebar.renderQibla();
  recalculate();
  if (state.location) loadPlaceName(selectionId, state.location.lat, state.location.lon);
  updateUrl({ lang: language.id });
}

/* ---------- Start ---------- */

const saved = loadSettings();
const initialLanguage = detectLanguage(saved.lang);
setLanguage(initialLanguage);

controls.initControls(saved, initialLanguage);
controls.setDate(todayIn(browserTimeZone()));
initMap("map", (lat, lon) => selectLocation(lat, lon));
initSearch(({ lat, lon, name }) => {
  focusOn(lat, lon);
  selectLocation(lat, lon, name);
}, showError);

controls.onDateChange(() => { state.dateTouched = true; recalculate(); });
controls.onTodayClick(() => {
  state.dateTouched = false;
  controls.setDate(todayIn(state.timeZone ?? browserTimeZone()));
  recalculate();
});
controls.onSettingsChange(() => { saveSettings(controls.getSettings()); recalculate(); });
controls.onLocateClick(locateUser);
controls.onLanguageSelect((id) => {
  saveSettings({ lang: id });
  setLanguage(id);
});
onLanguageChange(onLanguageChanged);

recalculate();
selectFromUrl();
window.setInterval(tick, 1000);
