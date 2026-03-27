# SANAD — Frontend (سَنَد)
**Stack:** React 19 · Vite · TypeScript · Tailwind CSS · Zustand · Wouter  
**Directory:** `artifacts/sanad-health/src/`  
**Port:** 18543 (dev) — served at `/`

---

## هيكل الملفات

```
src/
├── main.tsx                        نقطة الدخول — يعمّل الـ React app
├── App.tsx                         الـ Router الرئيسي + تخطيط الصفحة (Sidebar + main)
├── index.css                       نظام التصميم الكامل (CSS variables, components, utilities)
│
├── contexts/                       الصفحات الأربعة (السياقات التشغيلية)
│   ├── home.tsx                    الصفحة الرئيسية — Landing page مع شرح المنظومة
│   ├── emergency/
│   │   └── page.tsx                واجهة الإسعاف — مسح الهوية الوطنية وعرض بيانات حرجة فورية
│   ├── clinical/
│   │   └── dashboard.tsx           لوحة الطبيب السريرية — سجل طبي موحد + تحاليل + أدوية
│   ├── citizen/
│   │   └── page.tsx                صحة المواطن — المؤشر الصحي + تنبيهات AI + سجل شخصي
│   └── national/
│       └── dashboard.tsx           التحكم الوطني — KPIs + توزيع جغرافي + سجل المرضى
│
├── components/
│   ├── system/                     مكونات هيكل التطبيق
│   │   ├── Sidebar.tsx             الشريط الجانبي الزجاجي العائم (RTL، 4 سياقات، مؤشر النظام)
│   │   ├── PriorityStrip.tsx       شريط التنبيه الحرج (الأحمر في الأعلى)
│   │   └── AuditFooter.tsx         فوتر التدقيق (timestamp، context، compliance)
│   ├── emergency/
│   │   └── EmergencyCard.tsx       بطاقة المريض الحرجة (فصيلة الدم، الحساسية، الأدوية، جهات الطوارئ)
│   ├── clinical/
│   │   ├── PatientTimeline.tsx     جدول زمني لزيارات المريض الطبية
│   │   └── AIInsightPanel.tsx      لوحة تنبؤات الـ AI السريرية
│   └── shared/
│       ├── LoadingSpinner.tsx      مؤشر التحميل
│       └── ErrorState.tsx          حالة الخطأ مع زر إعادة المحاولة
│
└── lib/
    ├── api/
    │   └── client.ts               واجهة API الموحدة (كل الـ endpoints في مكان واحد)
    └── state/
        ├── emergency.store.ts      Zustand store — بيانات واجهة الإسعاف
        ├── clinical.store.ts       Zustand store — بيانات لوحة الطبيب
        ├── citizen.store.ts        Zustand store — بيانات صحة المواطن
        └── national.store.ts       Zustand store — بيانات التحكم الوطني
```

---

## الراوتينج (Wouter)

| المسار | المكوّن | الوصف |
|--------|---------|-------|
| `/` | `HomePage` | الصفحة الرئيسية |
| `/emergency` | `EmergencyContext` | واجهة الإسعاف |
| `/clinical/dashboard` | `ClinicalDashboard` | لوحة الطبيب |
| `/citizen` | `CitizenContext` | صحة المواطن |
| `/national/dashboard` | `NationalDashboard` | التحكم الوطني |

---

## API Client — `lib/api/client.ts`

```ts
api.emergency.scan(nationalId)           // GET /api/emergency/:nationalId
api.physician.dashboard(nationalId)      // GET /api/physician/:nationalId
api.physician.checkInteraction(drug, []) // POST /api/medications/check-interaction
api.citizen.dashboard(nationalId)        // GET /api/citizen/:nationalId
api.national.stats()                     // GET /api/stats
api.national.patients()                  // GET /api/patients
api.ai.predictions(nationalId)           // GET /api/ai/predictions/:nationalId
```

---

## نظام التصميم — `index.css`

### المتغيرات الأساسية
| المتغير | القيمة | الاستخدام |
|---------|--------|-----------|
| `--surface-base` | `#f7f9fb` | خلفية التطبيق |
| `--sanad-blue` | `#0033ff` | اللون الرئيسي |
| `--n-25` إلى `--n-900` | درجات رمادية-زرقاء | النصوص والحدود |
| `--critical-*` | درجات حمراء | حالات الطوارئ |
| `--warning-*` | درجات برتقالية | التحذيرات |
| `--success-*` | درجات خضراء | الحالات الإيجابية |

### الكلاسات الجاهزة
```css
.glass-card          /* بطاقة زجاجية شفافة مع blur */
.glass-card-sm       /* بطاقة زجاجية صغيرة */
.stat-card           /* بطاقة إحصائية */
.data-table          /* جدول بيانات موحد */
.badge               /* وسوم الحالة */
.badge-critical / .badge-success / .badge-warning / .badge-brand
.card-critical / .card-success / .card-warning
.btn / .btn-primary / .btn-danger / .btn-ghost
.input / .input-lg
.progress-track / .progress-fill
.text-h2 / .text-h3 / .text-h4 / .text-label / .text-small / .text-caption
```

### الخطوط
- **UI:** IBM Plex Sans Arabic (النصوص العربية والإنجليزية)
- **Mono:** IBM Plex Mono (الأرقام والأكواد)
- **Icons:** Material Symbols Rounded

---

## إدارة الحالة (Zustand)

كل سياق له store منفصل بنفس النمط:

```ts
// مثال: emergency.store.ts
const useEmergencyStore = create<EmergencyStore>((set) => ({
  scannedId: "1234567890",  // الـ ID الافتراضي للتجربة
  data: null,
  loading: false,
  error: null,
  responseTimeMs: null,
  // ... setters
}));
```

| الـ Store | السياق | الحالة المُدارة |
|----------|--------|----------------|
| `emergency.store` | الإسعاف | scannedId، بيانات المريض الحرجة، وقت الاستجابة |
| `clinical.store` | الطبيب | بيانات المريض الكاملة، علامات التبويب، كاشف التعارض |
| `citizen.store` | المواطن | المؤشر الصحي، التنبيهات، الزيارات، الأدوية |
| `national.store` | الوطني | KPIs، قائمة المرضى |

---

## تشغيل الفرونت إند

```bash
pnpm --filter @workspace/sanad-health run dev
```
