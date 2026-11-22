<div dir="rtl">

# خريطة مواقيت الصلاة · Prayer Times Map

[English](README.md) · [Deutsch](README.de.md) · **العربية**

</div>

[![API](https://img.shields.io/website?url=https%3A%2F%2Fprayer-times-map.salah-times.workers.dev%2Fapi%2Fhealth&label=API&up_message=online&down_message=offline)](https://prayer-times-map.salah-times.workers.dev/api/health)
[![Self-test](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fprayer-times-map.salah-times.workers.dev%2Fapi%2Fhealth&query=%24.data.status&label=self-test&color=brightgreen)](https://prayer-times-map.salah-times.workers.dev/api/health)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fprayer-times-map.salah-times.workers.dev%2Fapi%2Fhealth&query=%24.data.version&label=version&color=blue)](https://prayer-times-map.salah-times.workers.dev/api/health)
[![Service health](https://github.com/Mohmad-Naser-alnakeshbandi/prayer-times/actions/workflows/health.yml/badge.svg)](https://github.com/Mohmad-Naser-alnakeshbandi/prayer-times/actions/workflows/health.yml)

<div dir="rtl">

مواقيت الصلاة لأي مكان في العالم – على شكل خريطة تفاعلية وواجهة برمجية (API) بصيغة JSON.
تُحسب المواقيت بمكتبة [adhan](https://github.com/batoulapps/adhan-js)، والمناطق الزمنية عبر
[tz-lookup](https://github.com/darkskyapp/tz-lookup)، وأسماء الأماكن عبر
[Nominatim](https://nominatim.org/) (OpenStreetMap).

| | الرابط |
|---|---|
| الخريطة | <https://prayer-times-map.salah-times.workers.dev/?lang=ar> |
| توثيق الواجهة البرمجية | <https://prayer-times-map.salah-times.workers.dev/api/> |
| مثال (JSON) | <https://prayer-times-map.salah-times.workers.dev/api/times?city=Mecca&method=UMM_AL_QURA> |
| حالة الخدمة | <https://prayer-times-map.salah-times.workers.dev/api/health> |

## حالة الخدمة

| الشارة | المعنى |
|---|---|
| **API** | هل الواجهة البرمجية متاحة الآن؟ (يُفحص مباشرةً عند كل عرض للصفحة) |
| **self-test** | نتيجة `‎/api/health`: ‏`ok` (سليم) أو `degraded` (خلل) |
| **version** | الإصدار المنشور حاليًا |
| **Service health** | مهمة GitHub Actions تستدعي الواجهة الحية كل 30 دقيقة وتتحقق من صحة النتائج |

يُجري `GET /api/health` فحصًا ذاتيًا داخل الخدمة (المنطقة الزمنية، حساب المواقيت، القبلة)
دون الاتصال بخدمات خارجية. عند فشل أي فحص يكون الرد برمز HTTP ‏`503` و`"status": "degraded"`.

</div>

```json
{
  "status": 200,
  "endpoint": "health",
  "data": {
    "status": "ok",
    "service": "prayer-times-map",
    "version": "1.1.0",
    "time": "2026-11-22T20:15:00.000Z",
    "durationMs": 2,
    "checks": { "timezone": "ok", "calculation": "ok", "qibla": "ok" }
  }
}
```

<div dir="rtl">

## المزايا

**الخريطة**
- اختيار المكان بالنقر على الخريطة أو البحث عن مدينة أو استخدام موقع الجهاز
- الفجر والشروق والظهر والعصر والمغرب والعشاء – مع عدّ تنازلي للصلاة القادمة
- عشر طرق حساب (منها رابطة العالم الإسلامي، أم القرى، رئاسة الشؤون الدينية التركية) وحساب العصر حسب الجمهور أو الحنفي
- التاريخ الهجري والوقت المحلي والمنطقة الزمنية واتجاه القبلة
- اللغات **العربية والإنجليزية والألمانية** (مع اتجاه من اليمين إلى اليسار)
- وضع فاتح وداكن حسب إعدادات الجهاز، ومُهيّأ للهواتف
- روابط قابلة للمشاركة، مثل `‎/?lat=21.4225&lon=39.8262&lang=ar`
- حفظ طريقة الحساب والمذهب واللغة في المتصفح

**الواجهة البرمجية**
- JSON حقيقي (`application/json`) لـ Postman وcurl وغيرها من البرامج
- تفعيل CORS – يمكن استخدامها عبر `fetch()` من مواقع أخرى
- تحديد المكان بالإحداثيات أو بالمدينة/الدولة

## الواجهة البرمجية (JSON API)

الرابط الأساسي: `https://prayer-times-map.salah-times.workers.dev`

| نقطة النهاية | الوصف | المعاملات |
|---|---|---|
| `GET /api/times` | مواقيت يوم واحد | المكان، `date`، `method`، `madhab` |
| `GET /api/calendar` | مواقيت شهر كامل | المكان، `month`، `method`، `madhab` |
| `GET /api/qibla` | اتجاه القبلة بالدرجات من الشمال | المكان |
| `GET /api/methods` | جميع طرق الحساب والمذاهب | – |
| `GET /api/health` | حالة الخدمة (فحص ذاتي) | – |
| `GET /api` | نظرة عامة على نقاط النهاية | – |

### المعاملات

| المعامل | الصيغة | القيمة الافتراضية |
|---|---|---|
| `lat`، `lon` | درجات عشرية، مثل `21.42`، `39.83` | – |
| `city`، `country` | نص حر، مثل `Mecca`، `Saudi Arabia` (`country` اختياري) | – |
| `date` | `YYYY-MM-DD` | اليوم في المكان المحدد |
| `month` | `YYYY-MM` | الشهر الحالي في المكان المحدد |
| `method` | `MWL`، `EGYPT`، `KARACHI`، `UMM_AL_QURA`، `DUBAI`، `QATAR`، `KUWAIT`، `SINGAPORE`، `TURKEY`، `NORTH_AMERICA` | `MWL` |
| `madhab` | `SHAFI` (الشافعي والمالكي والحنبلي) أو `HANAFI` (الحنفي) | `SHAFI` |

يُحدَّد المكان إما بـ `lat` و`lon` **أو** بـ `city` (مع `country` اختياريًا).

### مثال

</div>

```bash
curl "https://prayer-times-map.salah-times.workers.dev/api/times?lat=21.4225&lon=39.8262&date=2026-11-22&method=UMM_AL_QURA"
```

```json
{
  "status": 200,
  "endpoint": "times",
  "data": {
    "location": { "latitude": 21.4225, "longitude": 39.8262, "timezone": "Asia/Riyadh", "source": "coordinates" },
    "date": "2026-11-22",
    "method": { "id": "UMM_AL_QURA", "name": "Umm al-Qura (Saudi-Arabien)" },
    "madhab": { "id": "SHAFI", "name": "Schafi'i, Maliki, Hanbali" },
    "times": { "fajr": "05:16", "sunrise": "06:36", "dhuhr": "12:07", "asr": "15:15", "maghrib": "17:37", "isha": "19:07" },
    "timesIso": { "fajr": "2026-11-22T05:16:00+03:00", "…": "…" },
    "nextPrayer": null
  }
}
```

<div dir="rtl">

يظهر `nextPrayer` فقط إذا كان `date` هو «اليوم» في المكان المحدد. الأوقات غير الموجودة في
مكان ما (مثل العشاء في صيف المناطق القطبية) تكون `null`. أسماء الطرق ورسائل الخطأ في الواجهة البرمجية باللغة الألمانية.

### الأخطاء

تُعاد الأخطاء برمز HTTP المناسب وبنفس الصيغة:

| الحالة | الرمز | المعنى |
|---|---|---|
| 400 | `missing_location` | لم يُحدَّد `lat`/`lon` ولا `city` |
| 400 | `invalid_lat`، `invalid_lon` | إحداثية مفقودة أو خارج النطاق |
| 400 | `invalid_date`، `invalid_month` | صيغة تاريخ خاطئة |
| 400 | `invalid_method`، `invalid_madhab` | قيمة غير معروفة (القيم المسموحة مذكورة في الرسالة) |
| 404 | `city_not_found` | لم يتم العثور على المدينة |
| 405 | `method_not_allowed` | يُسمح بـ `GET` فقط |
| 422 | `timezone_not_found` | لا توجد منطقة زمنية لهذا المكان |
| 502 | `geocoding_failed` | خدمة البحث عن الأماكن (Nominatim) غير متاحة |
| 503 | – | فشل الفحص الذاتي في `‎/api/health` |

### ملاحظات

- قد تختلف المواقيت المحسوبة عن تقويم المسجد المحلي (زوايا خاصة أو دقائق احتياط).
  في ألمانيا تكون طريقة `TURKEY` (رئاسة الشؤون الدينية التركية) غالبًا الأقرب.
- يعتمد البحث عن المدن على خدمة Nominatim العامة، وتُحفَظ النتائج مؤقتًا لمدة 30 يومًا.
  يُرجى تجنّب الطلبات الكثيفة بمدن مختلفة – واستخدام `lat`/`lon` عند كثرة الطلبات.

## التطوير المحلي

المتطلبات: Node.js الإصدار 20 أو أحدث.

</div>

```bash
npm install
npm run dev
```

<div dir="rtl">

| | الرابط |
|---|---|
| الخريطة | <http://127.0.0.1:8787/?lang=ar> |
| توثيق الواجهة البرمجية | <http://127.0.0.1:8787/api/> |
| JSON | <http://127.0.0.1:8787/api/times?lat=21.42&lon=39.83&method=UMM_AL_QURA> |

بدون الـ Worker (مثلًا مع Live Server في VS Code) تعمل الخريطة وصفحات الواجهة البرمجية في المتصفح
(`api/times.html` وغيرها)، لكن Postman وcurl يستلمان HTML فقط، لأن JSON يُنشأ في المتصفح بواسطة JavaScript.
مع `&view=1` تعرض هذه الصفحات عرضًا منسقًا.

## النشر

الاستضافة عبر [Cloudflare Worker](https://developers.cloudflare.com/workers/) مع ملفات ثابتة.

</div>

```bash
npx wrangler login   # مرة واحدة
npm run deploy
```

<div dir="rtl">

تجيب الخدمة على `‎/api` و`‎/api/*` بصيغة JSON، وتقدّم كل ما عدا ذلك كملفات ثابتة.
عند فتح `‎/api/` في المتصفح تظهر صفحة التوثيق، بينما تستلم البرامج نظرة عامة بصيغة JSON.
لا تُنشر الملفات المذكورة في [`.assetsignore`](.assetsignore) (مثل `node_modules` و`worker` و`wrangler.toml`).

يُعرّف `NOMINATIM_USER_AGENT` في [`wrangler.toml`](wrangler.toml) الطلبات المرسلة إلى Nominatim –
يُرجى تعديله عند استخدام نطاق آخر.

## بنية المشروع

</div>

```
index.html                الخريطة
css/                      التنسيقات
js/
  main.js                 نقطة بدء الخريطة
  config.js               طرق الحساب والمذاهب والصلوات والخدمات الخارجية
  core/                   الحالة، أدوات الوقت، الإعدادات، الترجمة
  i18n/                   الترجمات (de, en, ar)
  services/               الحساب، القبلة، المنطقة الزمنية، البحث، موقع الجهاز
  ui/                     الخريطة، البحث، عناصر التحكم، الشريط الجانبي
  api/                    منطق الواجهة البرمجية (مشترك بين المتصفح والـ Worker)
api/                      توثيق الواجهة البرمجية وصفحاتها في المتصفح
worker/index.js           Cloudflare Worker (واجهة JSON وفحص الحالة)
.github/workflows/        فحص دوري لحالة الخدمة
wrangler.toml             إعدادات الـ Worker
```

<div dir="rtl">

## المساهمون

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Mohmad-Naser-alnakeshbandi">
        <img src="https://github.com/Mohmad-Naser-alnakeshbandi.png?size=100" width="100" alt="Mohamad Naser Alnakshbandi"><br>
        <b>محمد ناصر النقشبندي</b><br>
        <b>Mohamad Naser Alnakshbandi</b>
      </a><br>
      <sub>المؤلف والمشرف على المشروع</sub>
    </td>
  </tr>
</table>

نرحّب بالأفكار والإبلاغ عن الأخطاء وطلبات الدمج (Pull Requests) عبر
[صفحة Issues](https://github.com/Mohmad-Naser-alnakeshbandi/prayer-times/issues).

## المصادر والبيانات

- بيانات الخريطة © المساهمون في [OpenStreetMap](https://www.openstreetmap.org/copyright)
- الخريطة: [Leaflet](https://leafletjs.com/)
- البحث عن الأماكن: [Nominatim](https://nominatim.org/) –
  [سياسة الاستخدام](https://operations.osmfoundation.org/policies/nominatim/)

</div>
