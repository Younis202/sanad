import { Router } from "express";
import { db } from "@workspace/db";
import {
  patientsTable,
  medicalRecordsTable,
  medicationsTable,
  labResultsTable,
  vaccinationsTable,
  emergencyContactsTable,
} from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router = Router();

// ─── Health ────────────────────────────────────────────────────────────────

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// ─── Emergency ─────────────────────────────────────────────────────────────

router.get("/emergency/:nationalId", async (req, res) => {
  try {
    const { nationalId } = req.params;
    const patient = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.nationalId, nationalId))
      .limit(1);

    if (!patient.length) {
      res.status(404).json({ error: "not_found", message: "Patient not found" });
      return;
    }

    const p = patient[0];
    const [contacts, medications] = await Promise.all([
      db.select().from(emergencyContactsTable).where(eq(emergencyContactsTable.patientId, p.id)),
      db.select().from(medicationsTable).where(eq(medicationsTable.patientId, p.id)),
    ]);

    res.json({
      nationalId: p.nationalId,
      nameAr: p.nameAr,
      bloodType: p.bloodType,
      allergies: p.allergies,
      chronicConditions: p.chronicConditions,
      currentMedications: medications.map((m) => `${m.nameAr} (${m.dosage})`),
      emergencyContacts: contacts,
      criticalNotes: p.criticalNotes || "",
    });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch emergency data" });
  }
});

// ─── Patients ──────────────────────────────────────────────────────────────

router.get("/patients", async (req, res) => {
  try {
    const patients = await db.select().from(patientsTable);
    res.json(patients.map((p) => ({
      id: p.id,
      nationalId: p.nationalId,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      bloodType: p.bloodType,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      city: p.city,
      phone: p.phone,
    })));
  } catch (err) {
    req.log?.error({ err }, "Failed to list patients");
    res.status(500).json({ error: "server_error", message: "Failed to fetch patients" });
  }
});

router.get("/patients/:nationalId", async (req, res) => {
  try {
    const { nationalId } = req.params;
    const patient = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.nationalId, nationalId))
      .limit(1);

    if (!patient.length) {
      res.status(404).json({ error: "not_found", message: "Patient not found" });
      return;
    }

    const p = patient[0];
    const [contacts, medications, records, labs, vaccinations] = await Promise.all([
      db.select().from(emergencyContactsTable).where(eq(emergencyContactsTable.patientId, p.id)),
      db.select().from(medicationsTable).where(eq(medicationsTable.patientId, p.id)),
      db.select().from(medicalRecordsTable).where(eq(medicalRecordsTable.patientId, p.id)),
      db.select().from(labResultsTable).where(eq(labResultsTable.patientId, p.id)),
      db.select().from(vaccinationsTable).where(eq(vaccinationsTable.patientId, p.id)),
    ]);

    res.json({ ...p, emergencyContacts: contacts, currentMedications: medications, medicalRecords: records, labResults: labs, vaccinations });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch patient" });
  }
});

// ─── Citizen Dashboard ─────────────────────────────────────────────────────

router.get("/citizen/:nationalId", async (req, res) => {
  try {
    const { nationalId } = req.params;
    const patient = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.nationalId, nationalId))
      .limit(1);

    if (!patient.length) {
      res.status(404).json({ error: "not_found", message: "Patient not found" });
      return;
    }

    const p = patient[0];
    const [medications, records, labs, vaccinations] = await Promise.all([
      db.select().from(medicationsTable).where(eq(medicationsTable.patientId, p.id)),
      db.select().from(medicalRecordsTable).where(eq(medicalRecordsTable.patientId, p.id)).limit(5),
      db.select().from(labResultsTable).where(eq(labResultsTable.patientId, p.id)).limit(10),
      db.select().from(vaccinationsTable).where(eq(vaccinationsTable.patientId, p.id)),
    ]);

    const healthScore = Math.floor(75 + Math.random() * 20);
    const aiAlerts = p.chronicConditions.length > 0 ? [{
      condition: "Type 2 Diabetes Risk",
      conditionAr: "خطر الإصابة بمرض السكري من النوع الثاني",
      probability: 0.68,
      timeframe: "خلال 12-18 شهر",
      severity: "medium",
      actionRequired: "Schedule preventive consultation",
      actionRequiredAr: "جدولة استشارة وقائية مع طبيب التغذية",
    }] : [];

    res.json({
      patient: {
        id: p.id, nationalId: p.nationalId, nameAr: p.nameAr, nameEn: p.nameEn,
        bloodType: p.bloodType, dateOfBirth: p.dateOfBirth, gender: p.gender,
        city: p.city, phone: p.phone,
      },
      healthScore,
      recentVisits: records,
      upcomingVaccinations: vaccinations.filter((v) => v.status === "due"),
      currentMedications: medications,
      aiAlerts,
      labResults: labs,
    });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch citizen dashboard" });
  }
});

// ─── Drug Interactions (shared helper) ─────────────────────────────────────

const DRUG_INTERACTIONS: Record<string, { drug2: string; severity: string; message: string; messageAr: string }[]> = {
  warfarin: [
    { drug2: "aspirin",   severity: "high",   message: "High bleeding risk when combined",          messageAr: "خطر نزيف مرتفع عند الجمع بين الدواءين" },
    { drug2: "ibuprofen", severity: "high",   message: "NSAIDs increase anticoagulant effect",      messageAr: "مضادات الالتهاب غير الستيرويدية تزيد من تأثير مضادات التخثر" },
  ],
  metformin: [
    { drug2: "contrast dye", severity: "medium", message: "Risk of lactic acidosis with contrast", messageAr: "خطر الحماض اللاكتيكي مع صبغة التباين" },
  ],
  simvastatin: [
    { drug2: "amiodarone",     severity: "high", message: "Increased risk of myopathy",   messageAr: "زيادة خطر اعتلال العضلات" },
    { drug2: "clarithromycin", severity: "high", message: "Statin toxicity risk",         messageAr: "خطر سمية الستاتين" },
  ],
  lisinopril: [
    { drug2: "potassium",      severity: "medium", message: "Risk of hyperkalemia",    messageAr: "خطر ارتفاع البوتاسيوم في الدم" },
    { drug2: "spironolactone", severity: "medium", message: "Hyperkalemia risk",        messageAr: "خطر فرط بوتاسيوم الدم" },
  ],
};

function checkInteractions(medications: string[]) {
  const alerts: { drug1: string; drug2: string; severity: string; message: string; messageAr: string }[] = [];
  const lowerMeds = medications.map((m) => m.toLowerCase());
  for (const [drug, interactions] of Object.entries(DRUG_INTERACTIONS)) {
    if (lowerMeds.some((m) => m.includes(drug))) {
      for (const interaction of interactions) {
        if (lowerMeds.some((m) => m.includes(interaction.drug2))) {
          alerts.push({ drug1: drug, ...interaction });
        }
      }
    }
  }
  return alerts;
}

// ─── Physician Dashboard ───────────────────────────────────────────────────

router.get("/physician/:nationalId", async (req, res) => {
  try {
    const { nationalId } = req.params;
    const patient = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.nationalId, nationalId))
      .limit(1);

    if (!patient.length) {
      res.status(404).json({ error: "not_found", message: "Patient not found" });
      return;
    }

    const p = patient[0];
    const [contacts, medications, records, labs, vaccinations] = await Promise.all([
      db.select().from(emergencyContactsTable).where(eq(emergencyContactsTable.patientId, p.id)),
      db.select().from(medicationsTable).where(eq(medicationsTable.patientId, p.id)),
      db.select().from(medicalRecordsTable).where(eq(medicalRecordsTable.patientId, p.id)),
      db.select().from(labResultsTable).where(eq(labResultsTable.patientId, p.id)),
      db.select().from(vaccinationsTable).where(eq(vaccinationsTable.patientId, p.id)),
    ]);

    const medicationNames = medications.map((m) => m.name.toLowerCase());
    const drugInteractionAlerts = checkInteractions(medicationNames);
    const hospitals = new Set(records.map((r) => r.hospital));
    const lastVisit = records.length > 0
      ? records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
      : "N/A";
    const riskScore = p.chronicConditions.length > 2 ? "high" : p.chronicConditions.length > 0 ? "medium" : "low";

    res.json({
      patient: { ...p, emergencyContacts: contacts, currentMedications: medications, medicalRecords: records, labResults: labs, vaccinations },
      summary: { totalVisits: records.length, hospitalsVisited: hospitals.size, activeMedications: medications.length, lastVisit, riskScore },
      drugInteractionAlerts,
    });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch physician dashboard" });
  }
});

router.post("/medications/check-interaction", async (req, res) => {
  try {
    const { newDrug, existingDrugs } = req.body as { newDrug: string; existingDrugs: string[] };
    const allDrugs = [...existingDrugs, newDrug];
    const alerts = checkInteractions(allDrugs.map((d) => d.toLowerCase()))
      .filter((a) => a.drug1.toLowerCase() === newDrug.toLowerCase() || a.drug2.toLowerCase() === newDrug.toLowerCase());
    res.json({ hasInteraction: alerts.length > 0, severity: alerts.length > 0 ? alerts[0].severity : "none", alerts });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to check drug interaction" });
  }
});

// ─── National Stats & AI Predictions ──────────────────────────────────────

router.get("/stats", async (_req, res) => {
  try {
    const [patientCount] = await db.select({ count: sql<number>`count(*)` }).from(patientsTable);
    const [recordCount]  = await db.select({ count: sql<number>`count(*)` }).from(medicalRecordsTable);
    res.json({
      totalPatients: Number(patientCount.count),
      totalHospitals: 48,
      totalMedicalRecords: Number(recordCount.count),
      drugInteractionsPrevented: 1247,
      emergencyResponsesThisMonth: 342,
      activePhysicians: 2891,
    });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch stats" });
  }
});

router.get("/ai/predictions/:nationalId", async (req, res) => {
  try {
    const { nationalId } = req.params;
    res.json({
      nationalId,
      riskLevel: "medium",
      predictions: [
        {
          condition: "Type 2 Diabetes",
          conditionAr: "السكري من النوع الثاني",
          probability: 0.68,
          timeframe: "12-18 months",
          severity: "medium",
          actionRequired: "Schedule nutritionist consultation",
          actionRequiredAr: "جدولة استشارة مع أخصائي التغذية وفحص السكر التراكمي",
        },
        {
          condition: "Hypertension",
          conditionAr: "ارتفاع ضغط الدم",
          probability: 0.42,
          timeframe: "6-12 months",
          severity: "low",
          actionRequired: "Monitor blood pressure weekly",
          actionRequiredAr: "مراقبة ضغط الدم أسبوعياً والتقليل من الصوديوم",
        },
      ],
      recommendations: [
        "تقليل الاستهلاك اليومي من السكر والنشويات",
        "ممارسة الرياضة 30 دقيقة يومياً",
        "فحص السكر التراكمي كل 3 أشهر",
        "المتابعة مع طبيب الباطنة",
      ],
    });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch AI predictions" });
  }
});

export default router;
