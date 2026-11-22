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
  footer: {
    credits: "بيانات الخريطة © المساهمون في OpenStreetMap · Leaflet · Nominatim",
    api: "واجهة JSON",
    madeBy: "تطوير",
    source: "الشيفرة المصدرية على GitHub"
  },
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
  compass: ["ش", "ش ق", "ق", "ج ق", "ج", "ج غ", "غ", "ش غ"],
  docs: {
    metaTitle: "واجهة مواقيت الصلاة · التوثيق",
    back: "→ العودة إلى الخريطة",
    intro: "مواقيت الصلاة والتقويم الشهري واتجاه القبلة بصيغة JSON – مباشرةً عبر الرابط، بالعربية أو الإنجليزية أو الألمانية.",
    try: "جرّبها",
    endpoint: "نقطة النهاية",
    epTimes: "times – مواقيت يوم واحد",
    epCalendar: "calendar – شهر كامل",
    epQibla: "qibla – اتجاه القبلة",
    epMethods: "methods – طرق الحساب والمذاهب",
    locationBy: "تحديد المكان عبر",
    byCity: "المدينة",
    byCoords: "الإحداثيات",
    city: "المدينة",
    country: "الدولة (اختياري)",
    lat: "خط العرض (lat)",
    lon: "خط الطول (lon)",
    date: "التاريخ",
    month: "الشهر",
    method: "طريقة الحساب",
    madhab: "المذهب",
    responseLang: "لغة الرد (lang)",
    run: "إرسال الطلب",
    running: "جارٍ التنفيذ …",
    copyUrl: "نسخ الرابط",
    open: "فتح في علامة تبويب جديدة ↗",
    previewEmpty: "سيظهر الرد هنا.",
    endpoints: "نقاط النهاية",
    endpointsLead: "يُحدَّد المكان دائمًا إما عبر <code>lat</code> و<code>lon</code> أو عبر <code>city</code> (مع <code>country</code> اختياريًا). مع <code>lang=de|en|ar</code> تأتي الأسماء والرسائل باللغة المطلوبة. كل صفحة نقطة نهاية تُعيد JSON خالصًا، ومع <code>&amp;view=1</code> عرضًا منسقًا.",
    programs: "لـ Postman وcurl والبرامج",
    programsLead: "صفحات <code>.html</code> تحسب داخل المتصفح – البرامج التي لا تشغّل JavaScript تستلم HTML فقط. أما JSON الحقيقي (<code>application/json</code> مع تفعيل CORS) فتقدّمه نقاط النهاية <strong>بدون</strong> <code>.html</code>.",
    programsNote: "تُعاد الأخطاء برمز HTTP المناسب (400، 404، 422، 502) وبنفس صيغة JSON.",
    format: "صيغة الرد والأخطاء",
    formatLead: "يحتوي كل رد على <code>status</code> و<code>endpoint</code>، إضافةً إلى <code>data</code> أو <code>error</code> مع <code>code</code> و<code>message</code>. الأوقات غير الموجودة في مكان ما (مثل صيف المناطق القطبية) تكون <code>null</code>.",
    thStatus: "الحالة",
    thCode: "الرمز",
    thMeaning: "المعنى",
    thParam: "المعامل",
    thDesc: "الوصف",
    errMissing: "لم يُحدَّد lat/lon ولا city",
    errCoords: "إحداثية مفقودة أو خارج النطاق",
    errFormat: "صيغة خاطئة (YYYY-MM-DD أو YYYY-MM)",
    errValue: "قيمة غير معروفة – القيم المسموحة مذكورة في الرسالة",
    errCity: "لم يتم العثور على المدينة",
    errTz: "لا توجد منطقة زمنية لهذا المكان",
    errGeo: "البحث عن الأماكن (Nominatim) غير متاح",
    footnote: "يعتمد البحث عن الأماكن على خدمة Nominatim العامة – يُرجى تجنّب الطلبات الكثيفة."
  },
  viewer: {
    copy: "نسخ",
    copied: "تم النسخ ✓",
    copyFailed: "غير ممكن",
    download: "تنزيل",
    raw: "JSON خام",
    backToDocs: "→ توثيق الواجهة البرمجية",
    status: { 200: "تم", 400: "طلب غير صالح", 404: "غير موجود", 422: "تعذّرت المعالجة", 500: "خطأ داخلي", 502: "الخدمة غير متاحة" }
  }
};
