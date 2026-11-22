// Reine Hilfsfunktionen für Datum und Uhrzeit (ohne DOM-Zugriff).

export const browserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

export function formatTime(date, timeZone, withSeconds = false) {
  if (!isValidDate(date)) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds && { second: "2-digit" }),
    hourCycle: "h23"
  }).format(date);
}

/** "Heute" als YYYY-MM-DD in der angegebenen Zeitzone. */
export function todayIn(timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
}

/**
 * Kalenderdatum als Date für adhan (liest nur Jahr/Monat/Tag).
 * Mittags gesetzt, um Sommerzeit-Sprünge im Browser zu umgehen.
 */
export function calendarDate(dateString, offsetDays = 0) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day + offsetDays, 12, 0, 0);
}

/** z. B. "So., 22. Nov. 2026" – { locale, numberingSystem } optional */
export function formatLongDate(dateString, { locale = "de-DE", numberingSystem } = {}) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short", day: "numeric", month: "short", year: "numeric", numberingSystem
  }).format(calendarDate(dateString));
}

/** Hijri-Datum (Umm al-Qura), z. B. "12. Dschumada II 1448 AH" */
export function formatHijri(dateString, { locale = "de-DE", numberingSystem } = {}) {
  try {
    return new Intl.DateTimeFormat(locale, {
      calendar: "islamic-umalqura", numberingSystem,
      day: "numeric", month: "long", year: "numeric"
    }).format(calendarDate(dateString));
  } catch {
    return null;
  }
}

export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** ISO-8601 mit Offset in der Zeitzone, z. B. "2026-11-22T05:53:00+01:00". */
export function isoInZone(date, timeZone) {
  if (!isValidDate(date)) return null;
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23", timeZoneName: "longOffset"
  }).formatToParts(date).map(({ type, value }) => [type, value]));
  const offset = parts.timeZoneName.replace("GMT", "") || "+00:00";
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${offset}`;
}

/** Index 0–7 der Himmelsrichtung (N, NO, O, …) für Grad ab Norden. */
export function compassIndex(deg) {
  return Math.round((((deg % 360) + 360) % 360) / 45) % 8;
}

export function compassPoint(deg, points = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"]) {
  return points[compassIndex(deg)];
}
