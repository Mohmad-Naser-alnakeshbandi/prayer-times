// Liest und prüft die URL-Parameter der API.
// Fehler tragen nur Code + Platzhalter; den Text in der gewünschten Sprache baut run.js.
import { CALCULATION_METHODS, MADHABS } from "../config.js";
import { API_LANGUAGES, DEFAULT_API_LANGUAGE } from "./messages.js";

export class ApiError extends Error {
  constructor(status, code, vars = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.vars = vars;
  }
}

const badRequest = (code, vars) => new ApiError(400, code, vars);

export function readQuery(search = window.location.search) {
  const params = new URLSearchParams(search);
  // Leere Werte wie "?date=" behandeln wie nicht gesetzt
  return Object.fromEntries([...params].filter(([, v]) => v.trim() !== "").map(([k, v]) => [k, v.trim()]));
}

/** Sprache der Antwort: de (Standard), en oder ar. */
export function parseLang(value) {
  if (value === undefined) return DEFAULT_API_LANGUAGE;
  const id = value.toLowerCase();
  if (!API_LANGUAGES.includes(id)) {
    throw badRequest("invalid_lang", { value, allowed: API_LANGUAGES.join(", ") });
  }
  return id;
}

export function parseCoordinates(query) {
  if (query.lat === undefined && query.lon === undefined) return null;
  const lat = Number(query.lat);
  const lon = Number(query.lon);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw badRequest("invalid_lat");
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw badRequest("invalid_lon");
  return { lat, lon };
}

export function parseDate(value) {
  if (value === undefined) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match && new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  if (!match || date.getUTCMonth() !== +match[2] - 1 || date.getUTCDate() !== +match[3]) {
    throw badRequest("invalid_date");
  }
  return value;
}

export function parseMonth(value) {
  if (value === undefined) return null;
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match || +match[2] < 1 || +match[2] > 12) throw badRequest("invalid_month");
  return { year: +match[1], month: +match[2] };
}

function pick(list, value, name, fallback) {
  if (value === undefined) return list.find((item) => item.id === fallback);
  const found = list.find((item) => item.id === value.toUpperCase());
  if (!found) {
    throw badRequest(`invalid_${name}`, { value, allowed: list.map((i) => i.id).join(", ") });
  }
  return found;
}

export function parseMethod(query) {
  return {
    method: pick(CALCULATION_METHODS, query.method, "method", "MWL"),
    madhab: pick(MADHABS, query.madhab, "madhab", "SHAFI")
  };
}
