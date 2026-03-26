import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  patientsTable,
  medicalRecordsTable,
  medicationsTable,
  labResultsTable,
  vaccinationsTable,
  emergencyContactsTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/patients", async (_req, res) => {
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

    res.json({
      ...p,
      emergencyContacts: contacts,
      currentMedications: medications,
      medicalRecords: records,
      labResults: labs,
      vaccinations,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch patient" });
  }
});

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

    const aiAlerts = p.chronicConditions.length > 0 ? [
      {
        condition: "Type 2 Diabetes Risk",
        conditionAr: "خطر الإصابة بمرض السكري من النوع الثاني",
        probability: 0.68,
        timeframe: "خلال 12-18 شهر",
        severity: "medium",
        actionRequired: "Schedule preventive consultation",
        actionRequiredAr: "جدولة استشارة وقائية مع طبيب التغذية"
      }
    ] : [];

    res.json({
      patient: {
        id: p.id,
        nationalId: p.nationalId,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        bloodType: p.bloodType,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        city: p.city,
        phone: p.phone,
      },
      healthScore,
      recentVisits: records,
      upcomingVaccinations: vaccinations.filter((v) => v.status === "due"),
      currentMedications: medications,
      aiAlerts,
      labResults: labs,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch citizen dashboard" });
  }
});

export default router;
