// Texte der API (Fehler, Namen, Übersicht) in DE/EN/AR – ohne DOM, auch im Worker nutzbar.
import de from "../i18n/de.js";
import en from "../i18n/en.js";
import ar from "../i18n/ar.js";

export const API_LANGUAGES = ["de", "en", "ar"];
export const DEFAULT_API_LANGUAGE = "de";

const DICTIONARIES = { de, en, ar };

const ERRORS = {
  de: {
    invalid_lang: "Unbekannte Sprache \"{value}\". Erlaubt: {allowed}.",
    invalid_lat: "lat muss eine Zahl zwischen -90 und 90 sein.",
    invalid_lon: "lon muss eine Zahl zwischen -180 und 180 sein.",
    invalid_date: "date muss im Format YYYY-MM-DD sein, z. B. 2026-11-22.",
    invalid_month: "month muss im Format YYYY-MM sein, z. B. 2026-11.",
    invalid_method: "Unbekannter Wert für method: \"{value}\". Erlaubt: {allowed}.",
    invalid_madhab: "Unbekannter Wert für madhab: \"{value}\". Erlaubt: {allowed}.",
    missing_location: "Bitte entweder lat und lon oder city (optional mit country) angeben.",
    geocoding_failed: "Die Ortssuche (Nominatim) ist gerade nicht erreichbar.",
    city_not_found: "Ort nicht gefunden: {where}.",
    timezone_not_found: "Für diesen Ort konnte keine Zeitzone ermittelt werden.",
    unknown_endpoint: "Unbekannter Endpunkt: {name}",
    internal_error: "Unerwarteter Fehler bei der Berechnung."
  },
  en: {
    invalid_lang: "Unknown language \"{value}\". Allowed: {allowed}.",
    invalid_lat: "lat must be a number between -90 and 90.",
    invalid_lon: "lon must be a number between -180 and 180.",
    invalid_date: "date must use the format YYYY-MM-DD, e.g. 2026-11-22.",
    invalid_month: "month must use the format YYYY-MM, e.g. 2026-11.",
    invalid_method: "Unknown value for method: \"{value}\". Allowed: {allowed}.",
    invalid_madhab: "Unknown value for madhab: \"{value}\". Allowed: {allowed}.",
    missing_location: "Please provide either lat and lon or city (optionally with country).",
    geocoding_failed: "Place search (Nominatim) is currently unavailable.",
    city_not_found: "Place not found: {where}.",
    timezone_not_found: "No time zone could be found for this location.",
    unknown_endpoint: "Unknown endpoint: {name}",
    internal_error: "Unexpected error during calculation."
  },
  ar: {
    invalid_lang: "لغة غير معروفة \"{value}\". القيم المسموحة: {allowed}.",
    invalid_lat: "يجب أن يكون lat رقمًا بين ‎-90 و90.",
    invalid_lon: "يجب أن يكون lon رقمًا بين ‎-180 و180.",
    invalid_date: "يجب أن يكون date بالصيغة YYYY-MM-DD، مثل 2026-11-22.",
    invalid_month: "يجب أن يكون month بالصيغة YYYY-MM، مثل 2026-11.",
    invalid_method: "قيمة غير معروفة لـ method: \"{value}\". القيم المسموحة: {allowed}.",
    invalid_madhab: "قيمة غير معروفة لـ madhab: \"{value}\". القيم المسموحة: {allowed}.",
    missing_location: "يُرجى تحديد lat وlon أو city (مع country اختياريًا).",
    geocoding_failed: "البحث عن الأماكن (Nominatim) غير متاح حاليًا.",
    city_not_found: "لم يتم العثور على المكان: {where}.",
    timezone_not_found: "تعذّر تحديد المنطقة الزمنية لهذا المكان.",
    unknown_endpoint: "نقطة نهاية غير معروفة: {name}",
    internal_error: "حدث خطأ غير متوقع أثناء الحساب."
  }
};

/** Beschreibungen für die Endpunkt-Übersicht. */
const OVERVIEW = {
  de: {
    location: "lat & lon ODER city (+ optional country)",
    date: "YYYY-MM-DD (Standard: heute am Ort)",
    month: "YYYY-MM (Standard: aktueller Monat am Ort)",
    method: "siehe methods",
    lang: "de | en | ar (Standard: de) – Sprache für Namen und Meldungen",
    times: "Gebetszeiten eines Tages",
    calendar: "Gebetszeiten eines ganzen Monats",
    qibla: "Qibla-Richtung in Grad ab Norden",
    methods: "Alle Berechnungsmethoden und Madhabs",
    health: "Service-Status (Selbsttest)"
  },
  en: {
    location: "lat & lon OR city (+ optional country)",
    date: "YYYY-MM-DD (default: today at the location)",
    month: "YYYY-MM (default: current month at the location)",
    method: "see methods",
    lang: "de | en | ar (default: de) – language for names and messages",
    times: "Prayer times for one day",
    calendar: "Prayer times for a whole month",
    qibla: "Qibla direction in degrees from north",
    methods: "All calculation methods and madhabs",
    health: "Service status (self-test)"
  },
  ar: {
    location: "lat وlon أو city (مع country اختياريًا)",
    date: "YYYY-MM-DD (الافتراضي: اليوم في المكان المحدد)",
    month: "YYYY-MM (الافتراضي: الشهر الحالي في المكان المحدد)",
    method: "انظر methods",
    lang: "de | en | ar (الافتراضي: de) – لغة الأسماء والرسائل",
    times: "مواقيت يوم واحد",
    calendar: "مواقيت شهر كامل",
    qibla: "اتجاه القبلة بالدرجات من الشمال",
    methods: "جميع طرق الحساب والمذاهب",
    health: "حالة الخدمة (فحص ذاتي)"
  }
};

const fill = (text, vars) =>
  Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, v), text);

const lang = (id) => (API_LANGUAGES.includes(id) ? id : DEFAULT_API_LANGUAGE);

export function errorMessage(language, code, vars = {}) {
  const text = ERRORS[lang(language)][code] ?? ERRORS[DEFAULT_API_LANGUAGE][code] ?? code;
  return fill(text, vars);
}

export const methodName = (language, id) => DICTIONARIES[lang(language)].methods[id] ?? id;
export const madhabName = (language, id) => DICTIONARIES[lang(language)].madhabs[id]?.label ?? id;
export const compassPoints = (language) => DICTIONARIES[lang(language)].compass;
export const overviewText = (language) => OVERVIEW[lang(language)];
