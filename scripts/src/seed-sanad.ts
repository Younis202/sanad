import { db } from "@workspace/db";
import {
  patientsTable,
  emergencyContactsTable,
  medicationsTable,
  medicalRecordsTable,
  labResultsTable,
  vaccinationsTable,
} from "@workspace/db/schema";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const cities = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الطائف", "تبوك", "القصيم", "أبها", "حائل"];
const genders = ["male", "female"];

const saudiMaleNames = [
  { ar: "محمد العتيبي", en: "Mohammed Al-Otaibi" },
  { ar: "عبدالله الشمري", en: "Abdullah Al-Shammari" },
  { ar: "فهد الدوسري", en: "Fahad Al-Dosari" },
  { ar: "خالد القحطاني", en: "Khalid Al-Qahtani" },
  { ar: "سلطان المطيري", en: "Sultan Al-Mutairi" },
  { ar: "تركي الغامدي", en: "Turki Al-Ghamdi" },
  { ar: "بندر الزهراني", en: "Bandar Al-Zahrani" },
  { ar: "عمر الحربي", en: "Omar Al-Harbi" },
  { ar: "ناصر العنزي", en: "Nasser Al-Anzi" },
  { ar: "سعد الرشيدي", en: "Saad Al-Rashidi" },
  { ar: "أحمد البلوي", en: "Ahmed Al-Balawi" },
  { ar: "يوسف السبيعي", en: "Yousef Al-Subaie" },
  { ar: "إبراهيم العمري", en: "Ibrahim Al-Omari" },
  { ar: "علي الجهني", en: "Ali Al-Juhani" },
  { ar: "حمد الفيفي", en: "Hamad Al-Fifi" },
  { ar: "مساعد الثبيتي", en: "Musaed Al-Thubiti" },
  { ar: "فيصل الصبحي", en: "Faisal Al-Subhi" },
  { ar: "وليد الأسمري", en: "Walid Al-Asmari" },
  { ar: "صالح الشهري", en: "Saleh Al-Shahri" },
  { ar: "جابر الحارثي", en: "Jaber Al-Harith" },
  { ar: "راكان السلمي", en: "Rakan Al-Salmi" },
  { ar: "ماجد الخثلان", en: "Majed Al-Khathlan" },
  { ar: "هاني البقمي", en: "Hani Al-Baqami" },
  { ar: "نواف المالكي", en: "Nawaf Al-Maliki" },
  { ar: "ضيف الله الرويلي", en: "Daifullah Al-Ruwaili" },
];

const saudiFemaleNames = [
  { ar: "نورة السلطان", en: "Noura Al-Sultan" },
  { ar: "هند العمر", en: "Hind Al-Omar" },
  { ar: "ريم الخالدي", en: "Reem Al-Khalidi" },
  { ar: "لطيفة الزيد", en: "Latifa Al-Zaid" },
  { ar: "منيرة العبدالله", en: "Munira Al-Abdullah" },
  { ar: "أميرة الصالح", en: "Amira Al-Saleh" },
  { ar: "دلال المقرن", en: "Dalal Al-Maqran" },
  { ar: "وفاء السعدي", en: "Wafa Al-Saadi" },
  { ar: "رانيا الغامدي", en: "Rania Al-Ghamdi" },
  { ar: "شيماء الحربي", en: "Shaima Al-Harbi" },
  { ar: "فاطمة الدوسري", en: "Fatima Al-Dosari" },
  { ar: "مريم القحطاني", en: "Mariam Al-Qahtani" },
  { ar: "سارة العتيبي", en: "Sara Al-Otaibi" },
  { ar: "عبير الشمري", en: "Abeer Al-Shammari" },
  { ar: "بسمة الزهراني", en: "Basma Al-Zahrani" },
  { ar: "غدير المطيري", en: "Ghadir Al-Mutairi" },
  { ar: "أسماء الجهني", en: "Asma Al-Juhani" },
  { ar: "إيمان المالكي", en: "Iman Al-Maliki" },
  { ar: "صفاء الحربي", en: "Safa Al-Harbi" },
  { ar: "رهف السبيعي", en: "Rahaf Al-Subaie" },
  { ar: "خلود الشهري", en: "Khulood Al-Shahri" },
  { ar: "علياء البلوي", en: "Alya Al-Balawi" },
  { ar: "لين الأسمري", en: "Lin Al-Asmari" },
  { ar: "جوري الفيفي", en: "Jouri Al-Fifi" },
  { ar: "مها العنزي", en: "Maha Al-Anzi" },
];

const chronicConditionsList = [
  ["السكري من النوع الثاني"],
  ["ارتفاع ضغط الدم"],
  ["الربو"],
  ["قصور الغدة الدرقية"],
  ["السكري من النوع الثاني", "ارتفاع ضغط الدم"],
  ["الكوليسترول المرتفع"],
  ["الفشل الكلوي المزمن المبكر"],
  ["الصرع"],
  [],
  [],
  [],
];

const allergiesList = [
  ["البنسلين"],
  ["السلفا"],
  ["الأسبرين"],
  ["البنسلين", "الإيبوبروفين"],
  ["صبغة التباين"],
  [],
  [],
  [],
  [],
];

const medications = [
  { name: "Metformin", nameAr: "ميتفورمين", dosage: "500mg", frequency: "مرتين يومياً" },
  { name: "Lisinopril", nameAr: "ليسينوبريل", dosage: "10mg", frequency: "مرة يومياً" },
  { name: "Warfarin", nameAr: "وارفارين", dosage: "5mg", frequency: "مرة يومياً" },
  { name: "Simvastatin", nameAr: "سيمفاستاتين", dosage: "20mg", frequency: "مرة مساءً" },
  { name: "Aspirin", nameAr: "أسبرين", dosage: "81mg", frequency: "مرة يومياً" },
  { name: "Omeprazole", nameAr: "أوميبرازول", dosage: "20mg", frequency: "مرة يومياً" },
  { name: "Levothyroxine", nameAr: "ليفوثيروكسين", dosage: "50mcg", frequency: "مرة صباحاً" },
  { name: "Amlodipine", nameAr: "أملوديبين", dosage: "5mg", frequency: "مرة يومياً" },
  { name: "Atorvastatin", nameAr: "أتورفاستاتين", dosage: "40mg", frequency: "مرة مساءً" },
];

const hospitals = [
  { en: "King Faisal Specialist Hospital", ar: "مستشفى الملك فيصل التخصصي" },
  { en: "King Abdulaziz Medical City", ar: "مدينة الملك عبدالعزيز الطبية" },
  { en: "Al-Habib Medical Group", ar: "مجموعة الحبيب الطبية" },
  { en: "Saudi German Hospital", ar: "المستشفى السعودي الألماني" },
  { en: "Dallah Hospital", ar: "مستشفى دله" },
  { en: "National Guard Health Affairs", ar: "الشؤون الصحية بالحرس الوطني" },
  { en: "Mouwasat Hospital", ar: "مستشفى المواساة" },
  { en: "Al-Farabi Specialist Hospital", ar: "مستشفى الفارابي التخصصي" },
];

const specialties = [
  { en: "Internal Medicine", ar: "الباطنة" },
  { en: "Cardiology", ar: "أمراض القلب" },
  { en: "Orthopedics", ar: "العظام والمفاصل" },
  { en: "Endocrinology", ar: "الغدد الصماء" },
  { en: "Nephrology", ar: "أمراض الكلى" },
  { en: "Emergency", ar: "الطوارئ" },
  { en: "General Surgery", ar: "الجراحة العامة" },
  { en: "Pulmonology", ar: "أمراض الصدر والجهاز التنفسي" },
];

const diagnoses = [
  { en: "Uncontrolled Type 2 Diabetes", ar: "السكري غير المنضبط من النوع الثاني" },
  { en: "Hypertensive Crisis", ar: "أزمة ارتفاع ضغط الدم" },
  { en: "Acute Asthma Attack", ar: "نوبة ربو حادة" },
  { en: "Hypothyroidism Follow-up", ar: "متابعة قصور الغدة الدرقية" },
  { en: "Knee Osteoarthritis", ar: "خشونة مفصل الركبة" },
  { en: "Chronic Back Pain", ar: "آلام الظهر المزمنة" },
  { en: "Upper Respiratory Tract Infection", ar: "التهاب الجهاز التنفسي العلوي" },
  { en: "Anemia - Iron Deficiency", ar: "فقر الدم بسبب نقص الحديد" },
  { en: "Dyslipidemia", ar: "اضطراب شحوم الدم" },
  { en: "Routine Annual Check-up", ar: "الفحص الدوري السنوي" },
];

const labTests = [
  { name: "HbA1c", nameAr: "السكر التراكمي", unit: "%", normalRange: "4.0-5.6", lowNormal: 4.0, highNormal: 5.6, highValue: 9.2, lowValue: 4.2 },
  { name: "Fasting Blood Glucose", nameAr: "سكر الصيام", unit: "mg/dL", normalRange: "70-100", lowNormal: 70, highNormal: 100, highValue: 178, lowValue: 72 },
  { name: "Total Cholesterol", nameAr: "الكوليسترول الكلي", unit: "mg/dL", normalRange: "<200", lowNormal: 0, highNormal: 200, highValue: 248, lowValue: 165 },
  { name: "HDL Cholesterol", nameAr: "الكوليسترول الجيد", unit: "mg/dL", normalRange: ">40", lowNormal: 40, highNormal: 999, highValue: 65, lowValue: 35 },
  { name: "LDL Cholesterol", nameAr: "الكوليسترول الضار", unit: "mg/dL", normalRange: "<100", lowNormal: 0, highNormal: 100, highValue: 152, lowValue: 78 },
  { name: "Creatinine", nameAr: "الكرياتينين", unit: "mg/dL", normalRange: "0.6-1.2", lowNormal: 0.6, highNormal: 1.2, highValue: 1.6, lowValue: 0.7 },
  { name: "TSH", nameAr: "هرمون الغدة الدرقية", unit: "mIU/L", normalRange: "0.4-4.0", lowNormal: 0.4, highNormal: 4.0, highValue: 8.2, lowValue: 0.5 },
  { name: "Hemoglobin", nameAr: "الهيموجلوبين", unit: "g/dL", normalRange: "12-17", lowNormal: 12, highNormal: 17, highValue: 16.5, lowValue: 9.8 },
];

const vaccinesList = [
  { name: "COVID-19 (Pfizer)", nameAr: "كوفيد-19 (فايزر)", nextMonths: 12 },
  { name: "Influenza", nameAr: "الإنفلوانزا الموسمية", nextMonths: 12 },
  { name: "Hepatitis B", nameAr: "التهاب الكبد الوبائي ب", nextMonths: null },
  { name: "Tetanus (Td)", nameAr: "الكزاز", nextMonths: 120 },
  { name: "Pneumococcal", nameAr: "المكورات الرئوية", nextMonths: 60 },
  { name: "Meningococcal", nameAr: "التهاب السحايا", nextMonths: 60 },
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

async function seed() {
  console.log("🌱 Seeding SANAD database...");

  await db.delete(vaccinationsTable);
  await db.delete(labResultsTable);
  await db.delete(medicalRecordsTable);
  await db.delete(medicationsTable);
  await db.delete(emergencyContactsTable);
  await db.delete(patientsTable);

  const patientData: { id: number; nationalId: string }[] = [];

  const primaryPatient = {
    nationalId: "1234567890",
    nameAr: "أحمد محمد الشمري",
    nameEn: "Ahmed Mohammed Al-Shammari",
    bloodType: "O+",
    dateOfBirth: "1985-03-15",
    gender: "male",
    city: "الرياض",
    phone: "0501234567",
    allergies: ["البنسلين", "الإيبوبروفين"],
    chronicConditions: ["السكري من النوع الثاني", "ارتفاع ضغط الدم"],
    criticalNotes: "يعاني من حساسية شديدة للبنسلين - خطر الصدمة التأقية",
  };

  const inserted = await db.insert(patientsTable).values(primaryPatient).returning({ id: patientsTable.id });
  patientData.push({ id: inserted[0].id, nationalId: "1234567890" });

  for (let i = 1; i < 50; i++) {
    const gender = randomElement(genders);
    const nameList = gender === "male" ? saudiMaleNames : saudiFemaleNames;
    const name = randomElement(nameList);
    const nationalId = `10${String(i).padStart(8, "0")}`;
    const year = 1955 + Math.floor(Math.random() * 50);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

    const [p] = await db.insert(patientsTable).values({
      nationalId,
      nameAr: name.ar,
      nameEn: name.en,
      bloodType: randomElement(bloodTypes),
      dateOfBirth: `${year}-${month}-${day}`,
      gender,
      city: randomElement(cities),
      phone: `05${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}`,
      allergies: randomElement(allergiesList),
      chronicConditions: randomElement(chronicConditionsList),
      criticalNotes: "",
    }).returning({ id: patientsTable.id });

    patientData.push({ id: p.id, nationalId });
  }

  console.log(`✅ Inserted ${patientData.length} patients`);

  for (const patient of patientData) {
    const isPrimary = patient.nationalId === "1234567890";

    if (isPrimary) {
      await db.insert(emergencyContactsTable).values([
        { patientId: patient.id, name: "محمد الشمري", relation: "أب", phone: "0557890123" },
        { patientId: patient.id, name: "سارة الشمري", relation: "زوجة", phone: "0501112233" },
      ]);

      await db.insert(medicationsTable).values([
        {
          patientId: patient.id,
          name: "Metformin",
          nameAr: "ميتفورمين",
          dosage: "1000mg",
          frequency: "مرتين يومياً مع الطعام",
          prescribedBy: "د. خالد العمر",
          hospital: "مستشفى الملك فيصل التخصصي",
          prescribedDate: "2024-01-15",
        },
        {
          patientId: patient.id,
          name: "Lisinopril",
          nameAr: "ليسينوبريل",
          dosage: "10mg",
          frequency: "مرة يومياً صباحاً",
          prescribedBy: "د. سعد الحربي",
          hospital: "مجموعة الحبيب الطبية",
          prescribedDate: "2024-02-20",
        },
        {
          patientId: patient.id,
          name: "Aspirin",
          nameAr: "أسبرين",
          dosage: "81mg",
          frequency: "مرة يومياً",
          prescribedBy: "د. نواف الزيد",
          hospital: "مستشفى دله",
          prescribedDate: "2023-11-10",
        },
      ]);

      await db.insert(medicalRecordsTable).values([
        {
          patientId: patient.id,
          date: "2025-01-10",
          hospital: "King Faisal Specialist Hospital",
          hospitalAr: "مستشفى الملك فيصل التخصصي",
          doctorName: "د. خالد العمر",
          specialty: "Endocrinology",
          specialtyAr: "الغدد الصماء",
          diagnosis: "Uncontrolled Type 2 Diabetes",
          diagnosisAr: "السكري غير المنضبط - مراجعة وتعديل العلاج",
          notes: "تم رفع جرعة ميتفورمين. تحسن ملحوظ في السكر التراكمي.",
          type: "outpatient",
        },
        {
          patientId: patient.id,
          date: "2024-09-05",
          hospital: "Al-Habib Medical Group",
          hospitalAr: "مجموعة الحبيب الطبية",
          doctorName: "د. سعد الحربي",
          specialty: "Cardiology",
          specialtyAr: "أمراض القلب",
          diagnosis: "Hypertension - Routine Follow-up",
          diagnosisAr: "ارتفاع ضغط الدم - متابعة دورية",
          notes: "ضغط الدم تحت السيطرة مع الدواء. يُنصح بتقليل الصوديوم.",
          type: "outpatient",
        },
        {
          patientId: patient.id,
          date: "2024-06-18",
          hospital: "Dallah Hospital",
          hospitalAr: "مستشفى دله",
          doctorName: "د. نواف الزيد",
          specialty: "Emergency",
          specialtyAr: "الطوارئ",
          diagnosis: "Hypoglycemic Episode",
          diagnosisAr: "نوبة انخفاض حاد في السكر",
          notes: "تم استقرار المريض بإعطاء الجلوكوز وريدياً.",
          type: "emergency",
        },
        {
          patientId: patient.id,
          date: "2023-12-02",
          hospital: "Saudi German Hospital",
          hospitalAr: "المستشفى السعودي الألماني",
          doctorName: "د. فيصل المطيري",
          specialty: "Internal Medicine",
          specialtyAr: "الباطنة",
          diagnosis: "Annual Check-up",
          diagnosisAr: "الفحص الدوري السنوي",
          notes: "صحة جيدة عموماً. يُوصى بالحمية الغذائية وممارسة الرياضة.",
          type: "outpatient",
        },
      ]);

      await db.insert(labResultsTable).values([
        {
          patientId: patient.id,
          testName: "HbA1c",
          testNameAr: "السكر التراكمي",
          date: "2025-01-10",
          hospital: "مستشفى الملك فيصل التخصصي",
          value: "8.2",
          unit: "%",
          normalRange: "4.0-5.6",
          status: "high",
        },
        {
          patientId: patient.id,
          testName: "Fasting Blood Glucose",
          testNameAr: "سكر الصيام",
          date: "2025-01-10",
          hospital: "مستشفى الملك فيصل التخصصي",
          value: "178",
          unit: "mg/dL",
          normalRange: "70-100",
          status: "high",
        },
        {
          patientId: patient.id,
          testName: "Total Cholesterol",
          testNameAr: "الكوليسترول الكلي",
          date: "2024-09-05",
          hospital: "مجموعة الحبيب الطبية",
          value: "220",
          unit: "mg/dL",
          normalRange: "<200",
          status: "high",
        },
        {
          patientId: patient.id,
          testName: "Creatinine",
          testNameAr: "الكرياتينين",
          date: "2024-09-05",
          hospital: "مجموعة الحبيب الطبية",
          value: "1.1",
          unit: "mg/dL",
          normalRange: "0.6-1.2",
          status: "normal",
        },
        {
          patientId: patient.id,
          testName: "Hemoglobin",
          testNameAr: "الهيموجلوبين",
          date: "2023-12-02",
          hospital: "المستشفى السعودي الألماني",
          value: "14.5",
          unit: "g/dL",
          normalRange: "12-17",
          status: "normal",
        },
      ]);

      await db.insert(vaccinationsTable).values([
        {
          patientId: patient.id,
          name: "COVID-19 (Pfizer)",
          nameAr: "كوفيد-19 (فايزر)",
          date: "2023-10-15",
          nextDue: "2024-10-15",
          status: "due",
        },
        {
          patientId: patient.id,
          name: "Influenza",
          nameAr: "الإنفلوانزا الموسمية",
          date: "2024-11-01",
          nextDue: "2025-11-01",
          status: "completed",
        },
        {
          patientId: patient.id,
          name: "Hepatitis B",
          nameAr: "التهاب الكبد الوبائي ب",
          date: "2010-03-10",
          nextDue: null,
          status: "completed",
        },
      ]);
    } else {
      const contactNames = [
        { name: "عبدالله محمد", relation: "أب", phone: `055${Math.floor(Math.random() * 10000000).toString().padStart(7, "0")}` },
      ];
      await db.insert(emergencyContactsTable).values(
        contactNames.map((c) => ({ patientId: patient.id, ...c }))
      );

      const numMeds = Math.floor(Math.random() * 3);
      if (numMeds > 0) {
        const selectedMeds = medications.slice(0, numMeds);
        const hospital = randomElement(hospitals);
        await db.insert(medicationsTable).values(
          selectedMeds.map((m) => ({
            patientId: patient.id,
            ...m,
            prescribedBy: `د. ${randomElement(["خالد", "سعد", "فيصل", "عمر", "ناصر"])} ${randomElement(["العمر", "الحربي", "المطيري", "الغامدي"])}`,
            hospital: hospital.ar,
            prescribedDate: randomDate(new Date("2023-01-01"), new Date("2025-01-01")),
          }))
        );
      }

      const numRecords = 1 + Math.floor(Math.random() * 4);
      const hosp = randomElement(hospitals);
      const spec = randomElement(specialties);
      const diag = randomElement(diagnoses);
      await db.insert(medicalRecordsTable).values(
        Array.from({ length: numRecords }, (_, i) => ({
          patientId: patient.id,
          date: randomDate(new Date("2022-01-01"), new Date("2025-03-01")),
          hospital: hosp.en,
          hospitalAr: hosp.ar,
          doctorName: `د. ${randomElement(["خالد", "سعد", "فيصل", "عمر", "ناصر"])} ${randomElement(["العمر", "الحربي", "المطيري"])}`,
          specialty: spec.en,
          specialtyAr: spec.ar,
          diagnosis: diag.en,
          diagnosisAr: diag.ar,
          notes: "تمت المتابعة وصرف الدواء المناسب.",
          type: i === 0 ? "emergency" : "outpatient",
        }))
      );

      const numLabs = 2 + Math.floor(Math.random() * 3);
      const selectedLabs = labTests.slice(0, numLabs);
      await db.insert(labResultsTable).values(
        selectedLabs.map((lab) => {
          const isHigh = Math.random() > 0.6;
          const value = isHigh ? lab.highValue : lab.lowValue;
          const status = isHigh ? "high" : "normal";
          return {
            patientId: patient.id,
            testName: lab.name,
            testNameAr: lab.nameAr,
            date: randomDate(new Date("2023-01-01"), new Date("2025-03-01")),
            hospital: randomElement(hospitals).ar,
            value: String(value),
            unit: lab.unit,
            normalRange: lab.normalRange,
            status,
          };
        })
      );

      const numVaccines = 1 + Math.floor(Math.random() * 3);
      await db.insert(vaccinationsTable).values(
        vaccinesList.slice(0, numVaccines).map((v) => {
          const vaccDate = randomDate(new Date("2020-01-01"), new Date("2024-01-01"));
          return {
            patientId: patient.id,
            name: v.name,
            nameAr: v.nameAr,
            date: vaccDate,
            nextDue: v.nextMonths ? addMonths(vaccDate, v.nextMonths) : null,
            status: "completed",
          };
        })
      );
    }
  }

  console.log("✅ SANAD database seeded successfully with 50 patients!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
