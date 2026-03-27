# SANAD — Backend (سَنَد)
**Stack:** Node.js · Express · TypeScript · Drizzle ORM · PostgreSQL · Pino  
**Directories:** `artifacts/api-server/src/` · `lib/db/src/`  
**Port:** 8080 (dev) — كل الـ routes تبدأ بـ `/api`

---

## هيكل الملفات

```
artifacts/api-server/src/
├── index.ts              نقطة الدخول — يشغّل الـ Express server على PORT
├── app.ts                إعداد الـ Express (CORS، JSON، Pino logger، routes)
├── lib/
│   └── logger.ts         إعداد Pino logger
└── routes/
    └── index.ts          كل الـ API endpoints (ملف واحد)

lib/db/src/
├── index.ts              يعرّض connection الـ Drizzle (db)
└── schema/
    ├── index.ts          يصدّر كل الـ tables
    ├── patients.ts       جدول المرضى الرئيسي
    ├── medical-records.ts جدول السجلات الطبية
    ├── medications.ts    جدول الأدوية
    ├── lab-results.ts    جدول نتائج التحاليل
    ├── vaccinations.ts   جدول التطعيمات
    └── emergency-contacts.ts جدول جهات الطوارئ

scripts/src/
└── seed-sanad.ts         سكريبت بيانات تجريبية (50 مريض)
```

---

## قاعدة البيانات — PostgreSQL (Drizzle ORM)

### جدول `patients` — المرضى
| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | serial PK | معرّف تلقائي |
| `national_id` | varchar(20) UNIQUE | رقم الهوية الوطنية |
| `name_ar` | text | الاسم بالعربية |
| `name_en` | text | الاسم بالإنجليزية |
| `blood_type` | varchar(10) | فصيلة الدم |
| `date_of_birth` | date | تاريخ الميلاد |
| `gender` | varchar(10) | الجنس (male/female) |
| `city` | text | المدينة |
| `phone` | varchar(20) | رقم الجوال |
| `allergies` | text[] | الحساسيات (مصفوفة) |
| `chronic_conditions` | text[] | الأمراض المزمنة (مصفوفة) |
| `critical_notes` | text | ملاحظات حرجة |

### جدول `medical_records` — السجلات الطبية
| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | serial PK | معرّف تلقائي |
| `patient_id` | integer FK→patients | ربط بالمريض |
| `date` | date | تاريخ الزيارة |
| `hospital` | text | اسم المنشأة (EN) |
| `hospital_ar` | text | اسم المنشأة (AR) |
| `doctor_name` | text | اسم الطبيب |
| `specialty` / `specialty_ar` | text | التخصص |
| `diagnosis` / `diagnosis_ar` | text | التشخيص |
| `notes` | text | ملاحظات |
| `type` | varchar(50) | outpatient / inpatient / emergency |

### جدول `medications` — الأدوية
| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | serial PK | |
| `patient_id` | integer FK→patients | |
| `name` / `name_ar` | text | اسم الدواء |
| `dosage` | text | الجرعة (مثل: 1000mg) |
| `frequency` | text | التكرار (مثل: مرتين يومياً) |
| `prescribed_by` | text | الطبيب الواصف |
| `hospital` | text | المنشأة |
| `prescribed_date` | date | تاريخ الوصفة |

### جدول `lab_results` — التحاليل المخبرية
| العمود | الوصف |
|--------|-------|
| `test_name` / `test_name_ar` | اسم التحليل |
| `value` | القيمة |
| `unit` | الوحدة (mg/dL، %...) |
| `normal_range` | المعدل الطبيعي |
| `status` | normal / high / low |

### جدول `vaccinations` — التطعيمات
| العمود | الوصف |
|--------|-------|
| `name` / `name_ar` | اسم التطعيم |
| `date` | تاريخ التطعيم |
| `next_due` | موعد الجرعة القادمة |
| `status` | completed / due |

### جدول `emergency_contacts` — جهات الطوارئ
| العمود | الوصف |
|--------|-------|
| `name` | اسم جهة الاتصال |
| `relation` | صلة القرابة |
| `phone` | رقم الهاتف |

---

## API Endpoints — `routes/index.ts`

### صحة الخادم
```
GET  /api/healthz
→ { status: "ok" }
```

### واجهة الإسعاف
```
GET  /api/emergency/:nationalId
→ nationalId، nameAr، bloodType، allergies[]، chronicConditions[]
   currentMedications[]، emergencyContacts[]، criticalNotes
```

### المرضى
```
GET  /api/patients
→ قائمة بكل المرضى (id، nationalId، nameAr، nameEn، bloodType، city...)

GET  /api/patients/:nationalId
→ بيانات مريض كاملة مع كل الجداول المرتبطة
```

### لوحة الطبيب السريرية
```
GET  /api/physician/:nationalId
→ {
    patient: { ...بيانات كاملة مع السجلات والأدوية والتحاليل والتطعيمات },
    summary: { totalVisits، hospitalsVisited، activeMedications، riskScore },
    drugInteractionAlerts: []
  }
```

### كاشف التعارض الدوائي
```
POST /api/medications/check-interaction
Body: { newDrug: string, existingDrugs: string[] }
→ { hasInteraction: boolean، severity، alerts[] }
```

### صحة المواطن
```
GET  /api/citizen/:nationalId
→ {
    patient، healthScore (0-100)،
    aiAlerts[]، labResults[]، currentMedications[]،
    recentVisits[]، upcomingVaccinations[]
  }
```

### التحكم الوطني
```
GET  /api/stats
→ {
    totalPatients، totalHospitals، totalMedicalRecords،
    drugInteractionsPrevented، emergencyResponsesThisMonth، activePhysicians
  }
```

### تنبؤات الـ AI
```
GET  /api/ai/predictions/:nationalId
→ {
    riskLevel، predictions[]، recommendations[]
  }
```

---

## إعداد الـ Express — `app.ts`

```ts
app.use(pinoHttp(...))          // Structured logging
app.use(cors())                  // Allow all origins (dev)
app.use(express.json())          // Parse JSON body
app.use(express.urlencoded(...)) // Parse form data
app.use("/api", router)          // كل الـ routes تحت /api
```

---

## أوامر قاعدة البيانات

```bash
# إنشاء/تحديث الجداول من الـ schema
pnpm --filter @workspace/db push

# حشو بيانات تجريبية (50 مريض)
pnpm --filter @workspace/scripts run seed-sanad

# الـ demo patient
National ID: 1234567890
الاسم: أحمد محمد الشمري
```

---

## متغيرات البيئة

| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PGHOST` / `PGPORT` / `PGUSER` / `PGPASSWORD` / `PGDATABASE` | إعدادات الاتصال |
| `PORT` | منفذ الخادم (افتراضي: 8080) |

---

## تشغيل الباك إند

```bash
pnpm --filter @workspace/api-server run dev
```
