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
  footer: { credits: "Map data © OpenStreetMap contributors · Leaflet · Nominatim", api: "JSON API" },
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
  compass: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
};
