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
  footer: {
    credits: "Kartendaten © OpenStreetMap-Mitwirkende · Leaflet · Nominatim",
    api: "JSON-API",
    madeBy: "Erstellt von",
    source: "Quellcode auf GitHub"
  },
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
  compass: ["N", "NO", "O", "SO", "S", "SW", "W", "NW"],
  docs: {
    metaTitle: "Prayer Times API · Dokumentation",
    back: "← Zur Karte",
    intro: "Gebetszeiten, Monatskalender und Qibla-Richtung als JSON – direkt über die URL, in Deutsch, Englisch oder Arabisch.",
    try: "Ausprobieren",
    endpoint: "Endpunkt",
    epTimes: "times – Gebetszeiten eines Tages",
    epCalendar: "calendar – ganzer Monat",
    epQibla: "qibla – Qibla-Richtung",
    epMethods: "methods – Methoden & Madhabs",
    locationBy: "Ort angeben über",
    byCity: "Stadt",
    byCoords: "Koordinaten",
    city: "Stadt",
    country: "Land (optional)",
    lat: "Breitengrad (lat)",
    lon: "Längengrad (lon)",
    date: "Datum",
    month: "Monat",
    method: "Methode",
    madhab: "Madhab",
    responseLang: "Antwortsprache (lang)",
    run: "Anfrage ausführen",
    running: "Läuft …",
    copyUrl: "URL kopieren",
    open: "In neuem Tab öffnen ↗",
    previewEmpty: "Die Antwort erscheint hier.",
    endpoints: "Endpunkte",
    endpointsLead: "Ort immer entweder über <code>lat</code> &amp; <code>lon</code> oder über <code>city</code> (optional mit <code>country</code>). Mit <code>lang=de|en|ar</code> kommen Namen und Meldungen in der gewünschten Sprache. Jede Endpunkt-Seite liefert reines JSON, mit <code>&amp;view=1</code> eine formatierte Ansicht.",
    programs: "Für Postman, curl & Programme",
    programsLead: "Die <code>.html</code>-Seiten rechnen im Browser – Programme ohne JavaScript erhalten dort nur HTML. Echtes JSON (<code>application/json</code>, CORS aktiviert) liefern die Endpunkte <strong>ohne</strong> <code>.html</code>.",
    programsNote: "Fehler kommen mit passendem HTTP-Status (400, 404, 422, 502) und demselben JSON-Format.",
    format: "Antwortformat & Fehler",
    formatLead: "Jede Antwort enthält <code>status</code> und <code>endpoint</code>, dazu entweder <code>data</code> oder <code>error</code> mit <code>code</code> und <code>message</code>. Zeiten, die es an einem Ort nicht gibt (z. B. im Polarsommer), sind <code>null</code>.",
    thStatus: "Status",
    thCode: "Code",
    thMeaning: "Bedeutung",
    thParam: "Parameter",
    thDesc: "Beschreibung",
    errMissing: "Weder lat/lon noch city angegeben",
    errCoords: "Koordinate fehlt oder außerhalb des Bereichs",
    errFormat: "Falsches Format (YYYY-MM-DD bzw. YYYY-MM)",
    errValue: "Unbekannter Wert – erlaubte Werte stehen in der Meldung",
    errCity: "Stadt nicht gefunden",
    errTz: "Keine Zeitzone für den Ort",
    errGeo: "Ortssuche (Nominatim) nicht erreichbar",
    footnote: "Die Ortssuche nutzt den öffentlichen Dienst Nominatim – bitte keine Massenabfragen."
  },
  viewer: {
    copy: "Kopieren",
    copied: "Kopiert ✓",
    copyFailed: "Nicht möglich",
    download: "Download",
    raw: "Roh-JSON",
    backToDocs: "← API-Dokumentation",
    status: { 200: "OK", 400: "Ungültige Anfrage", 404: "Nicht gefunden", 422: "Nicht verarbeitbar", 500: "Interner Fehler", 502: "Dienst nicht erreichbar" }
  }
};
