// Die API-Endpunkte. Jeder bekommt die geprüften URL-Parameter
// und liefert ein einfaches Objekt, das als JSON ausgegeben wird.
import { CALCULATION_METHODS, MADHABS, PRAYERS } from "../config.js";
import { compassPoint, formatTime, isoInZone, isValidDate, todayIn } from "../core/time.js";
import { computePrayerDay, qiblaDirection } from "../services/prayer-times.js";
import { resolveLocation } from "./location.js";
import { parseDate, parseMethod, parseMonth } from "./params.js";

const describe = ({ id, label }) => ({ id, name: label });

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

async function times(query) {
  const { method, madhab } = parseMethod(query);
  const date = parseDate(query.date);
  const location = await resolveLocation(query);
  const dateString = date ?? todayIn(location.timezone);
  const { times: raw, next } = dayFor(location, dateString, method, madhab);

  return {
    location,
    date: dateString,
    method: describe(method),
    madhab: describe(madhab),
    ...formatTimes(raw, location.timezone),
    nextPrayer: next && {
      prayer: next.key,
      time: formatTime(next.time, location.timezone),
      tomorrow: next.tomorrow,
      inSeconds: Math.max(0, Math.round((next.time - Date.now()) / 1000))
    }
  };
}

async function calendar(query) {
  const { method, madhab } = parseMethod(query);
  const month = parseMonth(query.month);
  const location = await resolveLocation(query);
  const [y, m] = todayIn(location.timezone).split("-").map(Number);
  const { year, month: mon } = month ?? { year: y, month: m };
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const prefix = `${year}-${String(mon).padStart(2, "0")}`;

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = `${prefix}-${String(i + 1).padStart(2, "0")}`;
    const { times: raw } = dayFor(location, date, method, madhab);
    return { date, times: formatTimes(raw, location.timezone).times };
  });

  return { location, month: prefix, method: describe(method), madhab: describe(madhab), days };
}

async function qibla(query) {
  const location = await resolveLocation(query);
  const degrees = qiblaDirection(location.latitude, location.longitude);
  return {
    location,
    qibla: { degrees: Math.round(degrees * 100) / 100, compass: compassPoint(degrees) }
  };
}

async function methods() {
  return {
    methods: CALCULATION_METHODS.map(describe),
    madhabs: MADHABS.map(describe)
  };
}

async function index() {
  const location = "lat & lon ODER city (+ optional country)";
  return {
    name: "Prayer Times Map – Browser-API",
    note: "Die Ergebnisse werden im Browser berechnet. Die Seiten liefern JSON nur, wenn JavaScript ausgeführt wird.",
    endpoints: [
      {
        path: "api/times.html",
        description: "Gebetszeiten eines Tages",
        params: { location, date: "YYYY-MM-DD (Standard: heute am Ort)", method: "siehe methods", madhab: "SHAFI | HANAFI" },
        examples: [
          "api/times.html?lat=48.89&lon=8.70&date=2026-11-22&method=TURKEY",
          "api/times.html?city=Pforzheim&country=Germany&method=TURKEY"
        ]
      },
      {
        path: "api/calendar.html",
        description: "Gebetszeiten eines ganzen Monats",
        params: { location, month: "YYYY-MM (Standard: aktueller Monat am Ort)", method: "siehe methods", madhab: "SHAFI | HANAFI" },
        examples: ["api/calendar.html?city=Berlin&country=Germany&month=2026-12&method=MWL"]
      },
      {
        path: "api/qibla.html",
        description: "Qibla-Richtung in Grad ab Norden",
        params: { location },
        examples: ["api/qibla.html?city=Wien&country=Austria"]
      },
      {
        path: "api/methods.html",
        description: "Alle Berechnungsmethoden und Madhabs",
        params: {},
        examples: ["api/methods.html"]
      }
    ]
  };
}

export const endpoints = { times, calendar, qibla, methods, index };
