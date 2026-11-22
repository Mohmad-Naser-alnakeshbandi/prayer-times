// Zentrale Konfiguration – Methoden, Gebete, externe Dienste.

export const CALCULATION_METHODS = [
  { id: "MWL",           factory: "MuslimWorldLeague", label: "Muslim World League" },
  { id: "EGYPT",         factory: "Egyptian",          label: "Egyptian General Authority" },
  { id: "KARACHI",       factory: "Karachi",           label: "University of Islamic Sciences, Karachi" },
  { id: "UMM_AL_QURA",   factory: "UmmAlQura",         label: "Umm al-Qura (Saudi-Arabien)" },
  { id: "DUBAI",         factory: "Dubai",             label: "Dubai" },
  { id: "QATAR",         factory: "Qatar",             label: "Qatar" },
  { id: "KUWAIT",        factory: "Kuwait",            label: "Kuwait" },
  { id: "SINGAPORE",     factory: "Singapore",         label: "Singapore" },
  { id: "TURKEY",        factory: "Turkey",            label: "Diyanet / Türkei" },
  { id: "NORTH_AMERICA", factory: "NorthAmerica",      label: "ISNA / Nordamerika" }
];

export const MADHABS = [
  { id: "SHAFI",  label: "Schafi'i, Maliki, Hanbali", short: "Standard" },
  { id: "HANAFI", label: "Hanafi",                    short: "Hanafi" }
];

export const PRAYERS = [
  { key: "fajr",    label: "Fajr",          arabic: "الفجر" },
  { key: "sunrise", label: "Sonnenaufgang", arabic: "الشروق" },
  { key: "dhuhr",   label: "Dhuhr",         arabic: "الظهر" },
  { key: "asr",     label: "Asr",           arabic: "العصر" },
  { key: "maghrib", label: "Maghrib",       arabic: "المغرب" },
  { key: "isha",    label: "Isha",          arabic: "العشاء" }
];

export const STORAGE_KEY = "prayer-times-map:settings";

export const MAP = {
  center: [20, 0],
  zoom: 2,
  locateZoom: 11,
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
};

export const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
export const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
