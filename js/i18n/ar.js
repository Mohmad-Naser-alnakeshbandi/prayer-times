// العربية
export default {
  meta: { title: "مواقيت الصلاة · خريطة مواقيت الصلاة" },
  app: { title: "مواقيت الصلاة", tagline: "" },
  nav: { main: "التنقل الرئيسي", api: "واجهة API", language: "اللغة" },
  map: {
    region: "خريطة العالم",
    searchLabel: "البحث عن مكان",
    searchPlaceholder: "ابحث عن مدينة",
    searchButton: "بحث",
    noResults: "لم يتم العثور على نتائج.",
    locate: "موقعي",
    locating: "جارٍ تحديد الموقع …"
  },
  place: {
    eyebrow: "الموقع",
    none: "لم يتم اختيار مكان بعد",
    hint: "ابحث عن مدينة أو اضغط على الخريطة.",
    loading: "جارٍ تحميل الموقع …",
    fallback: "الموقع المحدد"
  },
  next: {
    eyebrow: "الصلاة القادمة",
    todayAt: "اليوم الساعة {time}",
    tomorrowAt: "غدًا الساعة {time}"
  },
  empty: {
    title: "ستظهر مواقيت صلاتك هنا",
    text: "ابحث عن مدينة أو اختر مكانًا على الخريطة."
  },
  controls: {
    date: "التاريخ",
    today: "اليوم",
    method: "طريقة الحساب",
    madhab: "حساب العصر"
  },
  info: { timezone: "المنطقة الزمنية", localTime: "الوقت المحلي", qibla: "القبلة", notFound: "غير متوفر" },
  footnote: "تُحسب المواقيت في متصفحك، وقد تختلف قليلًا حسب المسجد وطريقة الحساب.",
  footer: { credits: "بيانات الخريطة © المساهمون في OpenStreetMap · Leaflet · Nominatim", api: "واجهة JSON" },
  errors: {
    noTimezone: "تعذّر تحديد المنطقة الزمنية لهذا المكان.",
    calculation: "تعذّر حساب مواقيت الصلاة. يُرجى التحقق من التاريخ والإعدادات.",
    geoUnsupported: "متصفحك لا يدعم تحديد الموقع.",
    geoDenied: "تعذّر الوصول إلى الموقع. يُرجى السماح بالوصول أو الضغط على الخريطة.",
    search: "البحث عن الأماكن غير متاح حاليًا."
  },
  prayers: {
    fajr: "الفجر", sunrise: "الشروق", dhuhr: "الظهر",
    asr: "العصر", maghrib: "المغرب", isha: "العشاء"
  },
  madhabs: {
    SHAFI: { short: "الجمهور", label: "الشافعي والمالكي والحنبلي" },
    HANAFI: { short: "الحنفي", label: "الحنفي" }
  },
  methods: {
    MWL: "رابطة العالم الإسلامي",
    EGYPT: "الهيئة المصرية العامة للمساحة",
    KARACHI: "جامعة العلوم الإسلامية، كراتشي",
    UMM_AL_QURA: "أم القرى (السعودية)",
    DUBAI: "دبي",
    QATAR: "قطر",
    KUWAIT: "الكويت",
    SINGAPORE: "سنغافورة",
    TURKEY: "رئاسة الشؤون الدينية (تركيا)",
    NORTH_AMERICA: "الجمعية الإسلامية لأمريكا الشمالية"
  },
  compass: ["ش", "ش ق", "ق", "ج ق", "ج", "ج غ", "غ", "ش غ"]
};
