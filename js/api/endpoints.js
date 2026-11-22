// Die API-Endpunkte. Jeder bekommt die geprüften URL-Parameter und die Sprache
// (de/en/ar) und liefert ein einfaches Objekt, das als JSON ausgegeben wird.
import { CALCULATION_METHODS, MADHABS, PRAYERS } from "../config.js";
import { compassPoint, formatTime, isoInZone, isValidDate, todayIn } from "../core/time.js";
import { computePrayerDay, qiblaDirection } from "../services/prayer-times.js";
import { resolveLocation } from "./location.js";
import { compassPoints, madhabName, methodName, overviewText } from "./messages.js";
import { parseDate, parseMethod, parseMonth } from "./params.js";

const describeMethod = (lang, { id }) => ({ id, name: methodName(lang, id) });
const describeMadhab = (lang, { id }) => ({ id, name: madhabName(lang, id) });

function formatTimes(times, timeZone) {
  const local = {};
  const iso = {};
  for (const { key } of PRAYERS) {
    // Ungültige Zeiten (z. B. Polartag) als null statt "—"
    local[key] = isValidDate(times[key]) ? formatTime(times[key], timeZone) : null;
    iso[key] = isoInZone(times[key], timeZone);
  }
  return { times: local, timesIso: iso };
}

function dayFor(location, dateString, method, madhab) {
  return computePrayerDay({
    lat: location.latitude,
    lon: location.longitude,
    timeZone: location.timezone,
    dateString,
    methodId: method.id,
    madhabId: madhab.id
  });
}

async function times(query, lang) {
  const { method, madhab } = parseMethod(query);
  const date = parseDate(query.date);
  const location = await resolveLocation(query, lang);
  const dateString = date ?? todayIn(location.timezone);
  const { times: raw, next } = dayFor(location, dateString, method, madhab);

  return {
    location,
    date: dateString,
    method: describeMethod(lang, method),
    madhab: describeMadhab(lang, madhab),
    ...formatTimes(raw, location.timezone),
    nextPrayer: next && {
      prayer: next.key,
      time: formatTime(next.time, location.timezone),
      tomorrow: next.tomorrow,
      inSeconds: Math.max(0, Math.round((next.time - Date.now()) / 1000))
    }
  };
}

async function calendar(query, lang) {
  const { method, madhab } = parseMethod(query);
  const month = parseMonth(query.month);
  const location = await resolveLocation(query, lang);
  const [y, m] = todayIn(location.timezone).split("-").map(Number);
  const { year, month: mon } = month ?? { year: y, month: m };
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const prefix = `${year}-${String(mon).padStart(2, "0")}`;

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = `${prefix}-${String(i + 1).padStart(2, "0")}`;
    const { times: raw } = dayFor(location, date, method, madhab);
    return { date, times: formatTimes(raw, location.timezone).times };
  });

  return {
    location,
    month: prefix,
    method: describeMethod(lang, method),
    madhab: describeMadhab(lang, madhab),
    days
  };
}

async function qibla(query, lang) {
  const location = await resolveLocation(query, lang);
  const degrees = qiblaDirection(location.latitude, location.longitude);
  return {
    location,
    qibla: { degrees: Math.round(degrees * 100) / 100, compass: compassPoint(degrees, compassPoints(lang)) }
  };
}

async function methods(_query, lang) {
  return {
    methods: CALCULATION_METHODS.map((m) => describeMethod(lang, m)),
    madhabs: MADHABS.map((m) => describeMadhab(lang, m))
  };
}

/** Übersicht der Browser-API-Seiten (für die Doku-Seite und ?raw=1). */
async function index(_query, lang) {
  const text = overviewText(lang);
  const common = { method: text.method, madhab: "SHAFI | HANAFI", lang: text.lang };
  return {
    name: "Prayer Times Map – Browser API",
    endpoints: [
      {
        path: "api/times.html",
        description: text.times,
        params: { location: text.location, date: text.date, ...common },
        examples: [
          "api/times.html?lat=48.89&lon=8.70&date=2026-11-22&method=TURKEY",
          "api/times.html?city=Pforzheim&country=Germany&method=TURKEY&lang=en"
        ]
      },
      {
        path: "api/calendar.html",
        description: text.calendar,
        params: { location: text.location, month: text.month, ...common },
        examples: ["api/calendar.html?city=Berlin&country=Germany&month=2026-12&method=MWL"]
      },
      {
        path: "api/qibla.html",
        description: text.qibla,
        params: { location: text.location, lang: text.lang },
        examples: ["api/qibla.html?city=Mecca&lang=ar"]
      },
      {
        path: "api/methods.html",
        description: text.methods,
        params: { lang: text.lang },
        examples: ["api/methods.html?lang=en"]
      }
    ]
  };
}

export const endpoints = { times, calendar, qibla, methods, index };
