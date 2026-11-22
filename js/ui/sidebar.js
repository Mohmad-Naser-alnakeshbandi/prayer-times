// Anzeige in der Seitenleiste: Standort, Datum, Info-Zeilen, Gebetszeiten.
import { PRAYERS } from "../config.js";
import { $ } from "../core/dom.js";
import { getLanguage, intlOptions, t } from "../core/i18n.js";
import {
  compassPoint, formatCountdown, formatHijri, formatLongDate, formatTime, isValidDate
} from "../core/time.js";

const prayerByKey = Object.fromEntries(PRAYERS.map((p) => [p.key, p]));
const isArabicUi = () => getLanguage().id === "ar";

// Schlichte Linien-Symbole im Stil von SF Symbols
const svg = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const ICONS = {
  fajr: svg('<path d="M3 18h18"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 6v3M5.6 10.6l1.4 1.4M18.4 10.6 17 12"/>'),
  sunrise: svg('<path d="M3 18h18"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="m9 8 3-3 3 3M12 5v6"/>'),
  dhuhr: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  asr: svg('<circle cx="12" cy="13" r="4"/><path d="M12 5v2M5 13H3M21 13h-2M6.3 7.3l1.4 1.4M17.7 7.3l-1.4 1.4"/><path d="M3 20h18"/>'),
  maghrib: svg('<path d="M3 18h18"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="m9 9 3 3 3-3M12 12V5"/>'),
  isha: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>')
};

/** Setzt Text und entfernt den Platzhalter-Schlüssel, damit ein Sprachwechsel ihn nicht überschreibt. */
function setDynamic(id, text) {
  const el = $(id);
  el.removeAttribute("data-i18n");
  el.textContent = text;
}

export function renderPlace(name) {
  setDynamic("placeName", name);
}

export function renderCoordinates(lat, lon) {
  setDynamic("coordinates", `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`);
}

export function renderDateInfo(dateString) {
  const options = intlOptions();
  $("gregorianDate").textContent = dateString ? formatLongDate(dateString, options) : "—";
  const hijri = dateString && formatHijri(dateString, options);
  $("hijriDate").textContent = hijri || "—";
  $("hijriDate").hidden = !hijri;
}

export function renderTimeZone(timeZone) {
  $("timezone").textContent = timeZone ?? t("info.notFound");
}

export function renderLocalTime(timeZone) {
  $("localTime").textContent = timeZone ? formatTime(new Date(), timeZone, true) : "—";
}

let lastQibla = null;

export function renderQibla(degrees = lastQibla) {
  if (degrees === null) return;
  lastQibla = degrees;
  $("qiblaArrow").style.transform = `rotate(${degrees}deg)`;
  $("qiblaValue").textContent = `${Math.round(degrees)}° ${compassPoint(degrees, t("compass"))}`;
  $("qiblaLine").hidden = false;
}

export function renderPrayerList(times, timeZone, next, isToday) {
  const now = Date.now();
  const arabicUi = isArabicUi();
  $("prayerList").innerHTML = PRAYERS.map(({ key, arabic }) => {
    const time = times[key];
    const isNext = next && !next.tomorrow && next.key === key;
    const passed = isToday && !isNext && isValidDate(time) && time.getTime() <= now;
    const classes = ["prayer-row", key === "sunrise" && "sunrise", isNext && "next", passed && "passed"]
      .filter(Boolean).join(" ");
    // In der arabischen Oberfläche ist der Name schon arabisch – keine Doppelung
    const secondary = arabicUi ? "" : `<span class="prayer-arabic" lang="ar">${arabic}</span>`;
    return `<div class="${classes}"${isNext ? ' aria-current="true"' : ""}>
      <span class="prayer-icon" aria-hidden="true">${ICONS[key]}</span>
      <span class="prayer-name">${t(`prayers.${key}`)}</span>
      ${secondary || "<span></span>"}
      <time class="prayer-time">${formatTime(time, timeZone)}</time>
    </div>`;
  }).join("");
}

/** Zeigt den Countdown oder blendet die Mihrab-Karte aus (next = null). */
export function renderNextPrayer(next, timeZone) {
  const box = $("nextPrayer");
  if (!next) { box.hidden = true; return; }
  box.hidden = false;
  $("nextPrayerArabic").textContent = prayerByKey[next.key].arabic;
  const name = $("nextPrayerName");
  name.textContent = t(`prayers.${next.key}`);
  name.hidden = isArabicUi();
  $("nextPrayerCountdown").textContent = formatCountdown(next.time - Date.now());
  $("nextPrayerAt").textContent =
    t(next.tomorrow ? "next.tomorrowAt" : "next.todayAt", { time: formatTime(next.time, timeZone) });
}
