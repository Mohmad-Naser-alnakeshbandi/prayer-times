// English
export default {
  meta: { title: "Prayer Times · Prayer Times Map" },
  app: { title: "Prayer Times", tagline: "مواقيت الصلاة" },
  nav: { main: "Main navigation", api: "API", language: "Language" },
  map: {
    region: "World map",
    searchLabel: "Search place",
    searchPlaceholder: "Search city",
    searchButton: "Search",
    noResults: "No results found.",
    locate: "My location",
    locating: "Locating …"
  },
  place: {
    eyebrow: "Location",
    none: "No place selected yet",
    hint: "Search for a city or tap the map.",
    loading: "Loading location …",
    fallback: "Selected location"
  },
  next: {
    eyebrow: "Next prayer",
    todayAt: "Today at {time}",
    tomorrowAt: "Tomorrow at {time}"
  },
  empty: {
    title: "Your prayer times will appear here",
    text: "Search for a city or pick a place on the map."
  },
  controls: {
    date: "Date",
    today: "Today",
    method: "Calculation method",
    madhab: "Asr calculation"
  },
  info: { timezone: "Time zone", localTime: "Local time", qibla: "Qibla", notFound: "Not found" },
  footnote: "Calculated in your browser. Times may differ slightly depending on the mosque and method.",
  footer: {
    credits: "Map data © OpenStreetMap contributors · Leaflet · Nominatim",
    api: "JSON API",
    madeBy: "Made by",
    source: "Source code on GitHub"
  },
  errors: {
    noTimezone: "No time zone could be found for this location.",
    calculation: "Prayer times could not be calculated. Please check the date and settings.",
    geoUnsupported: "Your browser does not support geolocation.",
    geoDenied: "Location access is not available. Please allow access or click on the map.",
    search: "Place search is currently unavailable."
  },
  prayers: {
    fajr: "Fajr", sunrise: "Sunrise", dhuhr: "Dhuhr",
    asr: "Asr", maghrib: "Maghrib", isha: "Isha"
  },
  madhabs: {
    SHAFI: { short: "Standard", label: "Shafi'i, Maliki, Hanbali" },
    HANAFI: { short: "Hanafi", label: "Hanafi" }
  },
  methods: {
    MWL: "Muslim World League",
    EGYPT: "Egyptian General Authority of Survey",
    KARACHI: "University of Islamic Sciences, Karachi",
    UMM_AL_QURA: "Umm al-Qura (Saudi Arabia)",
    DUBAI: "Dubai",
    QATAR: "Qatar",
    KUWAIT: "Kuwait",
    SINGAPORE: "Singapore",
    TURKEY: "Diyanet / Turkey",
    NORTH_AMERICA: "ISNA / North America"
  },
  compass: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  docs: {
    metaTitle: "Prayer Times API · Documentation",
    back: "← Back to map",
    intro: "Prayer times, monthly calendars and Qibla direction as JSON – straight from the URL, in English, German or Arabic.",
    try: "Try it",
    endpoint: "Endpoint",
    epTimes: "times – prayer times for one day",
    epCalendar: "calendar – whole month",
    epQibla: "qibla – Qibla direction",
    epMethods: "methods – methods & madhabs",
    locationBy: "Specify location by",
    byCity: "City",
    byCoords: "Coordinates",
    city: "City",
    country: "Country (optional)",
    lat: "Latitude (lat)",
    lon: "Longitude (lon)",
    date: "Date",
    month: "Month",
    method: "Method",
    madhab: "Madhab",
    responseLang: "Response language (lang)",
    run: "Send request",
    running: "Running …",
    copyUrl: "Copy URL",
    open: "Open in new tab ↗",
    previewEmpty: "The response will appear here.",
    endpoints: "Endpoints",
    endpointsLead: "Always specify the location either with <code>lat</code> &amp; <code>lon</code> or with <code>city</code> (optionally with <code>country</code>). With <code>lang=de|en|ar</code> names and messages come in the chosen language. Every endpoint page returns plain JSON; add <code>&amp;view=1</code> for a formatted view.",
    programs: "For Postman, curl & programs",
    programsLead: "The <code>.html</code> pages calculate in the browser – programs without JavaScript only get HTML there. Real JSON (<code>application/json</code>, CORS enabled) is served by the endpoints <strong>without</strong> <code>.html</code>.",
    programsNote: "Errors come with a matching HTTP status (400, 404, 422, 502) and the same JSON format.",
    format: "Response format & errors",
    formatLead: "Every response contains <code>status</code> and <code>endpoint</code>, plus either <code>data</code> or <code>error</code> with <code>code</code> and <code>message</code>. Times that do not exist at a place (e.g. during the polar summer) are <code>null</code>.",
    thStatus: "Status",
    thCode: "Code",
    thMeaning: "Meaning",
    thParam: "Parameter",
    thDesc: "Description",
    errMissing: "Neither lat/lon nor city given",
    errCoords: "Coordinate missing or out of range",
    errFormat: "Wrong format (YYYY-MM-DD or YYYY-MM)",
    errValue: "Unknown value – allowed values are listed in the message",
    errCity: "City not found",
    errTz: "No time zone for this location",
    errGeo: "Place search (Nominatim) unavailable",
    footnote: "Place search uses the public Nominatim service – please avoid bulk requests."
  },
  viewer: {
    copy: "Copy",
    copied: "Copied ✓",
    copyFailed: "Not possible",
    download: "Download",
    raw: "Raw JSON",
    backToDocs: "← API documentation",
    status: { 200: "OK", 400: "Bad request", 404: "Not found", 422: "Unprocessable", 500: "Internal error", 502: "Service unavailable" }
  }
};
