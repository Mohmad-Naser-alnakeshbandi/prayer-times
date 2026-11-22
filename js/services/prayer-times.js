// Gebetszeiten- und Qibla-Berechnung mit adhan.
import {
  Coordinates,
  PrayerTimes,
  CalculationMethod,
  Madhab,
  HighLatitudeRule,
  Qibla
} from "adhan"; // Browser: Import-Map in index.html · Node: node_modules
import { CALCULATION_METHODS, PRAYERS } from "../config.js";
import { calendarDate, isValidDate, todayIn } from "../core/time.js";

function buildParams(coordinates, methodId, madhabId) {
  const method = CALCULATION_METHODS.find((m) => m.id === methodId) ?? CALCULATION_METHODS[0];
  const params = CalculationMethod[method.factory]();
  params.madhab = madhabId === "HANAFI" ? Madhab.Hanafi : Madhab.Shafi;
  // Ohne diese Regel gibt es in hohen Breiten keine gültigen Fajr-/Isha-Zeiten.
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
  return params;
}

/**
 * Berechnet die Zeiten eines Tages und – falls dieser Tag am Ort "heute" ist –
 * das nächste Gebet (nach Isha: Fajr des Folgetags).
 */
export function computePrayerDay({ lat, lon, timeZone, dateString, methodId, madhabId }) {
  const coordinates = new Coordinates(lat, lon);
  const params = buildParams(coordinates, methodId, madhabId);
  const day = new PrayerTimes(coordinates, calendarDate(dateString), params);

  const times = Object.fromEntries(PRAYERS.map(({ key }) => [key, day[key]]));

  let next = null;
  const isToday = todayIn(timeZone) === dateString;
  if (isToday) {
    const now = new Date();
    const upcoming = PRAYERS.find(({ key }) => isValidDate(times[key]) && times[key] > now);
    if (upcoming) {
      next = { key: upcoming.key, time: times[upcoming.key], tomorrow: false };
    } else {
      const tomorrow = new PrayerTimes(coordinates, calendarDate(dateString, 1), params);
      if (isValidDate(tomorrow.fajr)) next = { key: "fajr", time: tomorrow.fajr, tomorrow: true };
    }
  }

  return { times, next, isToday };
}

/** Qibla-Richtung in Grad ab Norden (im Uhrzeigersinn). */
export function qiblaDirection(lat, lon) {
  return Qibla(new Coordinates(lat, lon));
}
