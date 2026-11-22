// Deutsch
export default {
  meta: { title: "Gebetszeiten · Prayer Times Map" },
  app: { title: "Gebetszeiten", tagline: "مواقيت الصلاة" },
  nav: { main: "Hauptnavigation", api: "API", language: "Sprache" },
  map: {
    region: "Weltkarte",
    searchLabel: "Ort suchen",
    searchPlaceholder: "Stadt suchen",
    searchButton: "Suchen",
    noResults: "Keine Treffer gefunden.",
    locate: "Mein Standort",
    locating: "Suche Standort …"
  },
  place: {
    eyebrow: "Standort",
    none: "Noch kein Ort gewählt",
    hint: "Suche eine Stadt oder tippe auf die Karte.",
    loading: "Lade Standort …",
    fallback: "Ausgewählter Standort"
  },
  next: {
    eyebrow: "Nächstes Gebet",
    todayAt: "Heute um {time} Uhr",
    tomorrowAt: "Morgen um {time} Uhr"
  },
  empty: {
    title: "Deine Gebetszeiten erscheinen hier",
    text: "Suche eine Stadt oder wähle einen Ort auf der Karte."
  },
  controls: {
    date: "Datum",
    today: "Heute",
    method: "Berechnungsmethode",
    madhab: "Asr-Berechnung"
  },
  info: { timezone: "Zeitzone", localTime: "Ortszeit", qibla: "Qibla", notFound: "Nicht gefunden" },
  footnote: "Berechnet im Browser. Zeiten können je nach Moschee und Methode leicht abweichen.",
  footer: { credits: "Kartendaten © OpenStreetMap-Mitwirkende · Leaflet · Nominatim", api: "JSON-API" },
  errors: {
    noTimezone: "Für diesen Punkt konnte keine Zeitzone ermittelt werden.",
    calculation: "Gebetszeiten konnten nicht berechnet werden. Bitte prüfe Datum und Einstellungen.",
    geoUnsupported: "Dein Browser unterstützt keine Standortbestimmung.",
    geoDenied: "Standortzugriff nicht möglich. Bitte erlaube den Zugriff oder klicke auf die Karte.",
    search: "Die Ortssuche ist gerade nicht erreichbar."
  },
  prayers: {
    fajr: "Fajr", sunrise: "Sonnenaufgang", dhuhr: "Dhuhr",
    asr: "Asr", maghrib: "Maghrib", isha: "Isha"
  },
  madhabs: {
    SHAFI: { short: "Standard", label: "Schafi'i, Maliki, Hanbali" },
    HANAFI: { short: "Hanafi", label: "Hanafi" }
  },
  methods: {
    MWL: "Muslim World League",
    EGYPT: "Ägyptische Generalbehörde für Vermessung",
    KARACHI: "Universität für Islamische Wissenschaften, Karachi",
    UMM_AL_QURA: "Umm al-Qura (Saudi-Arabien)",
    DUBAI: "Dubai",
    QATAR: "Katar",
    KUWAIT: "Kuwait",
    SINGAPORE: "Singapur",
    TURKEY: "Diyanet / Türkei",
    NORTH_AMERICA: "ISNA / Nordamerika"
  },
  compass: ["N", "NO", "O", "SO", "S", "SW", "W", "NW"]
};
