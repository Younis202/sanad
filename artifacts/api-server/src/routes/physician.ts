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

const DRUG_INTERACTIONS: Record<string, { drug2: string; severity: string; message: string; messageAr: string }[]> = {
  "warfarin": [
    { drug2: "aspirin", severity: "high", message: "High bleeding risk when combined", messageAr: "خطر نزيف مرتفع عند الجمع بين الدواءين" },
    { drug2: "ibuprofen", severity: "high", message: "NSAIDs increase anticoagulant effect", messageAr: "مضادات الالتهاب غير الستيرويدية تزيد من تأثير مضادات التخثر" },
  ],
  "metformin": [
    { drug2: "contrast dye", severity: "medium", message: "Risk of lactic acidosis with contrast", messageAr: "خطر الحماض اللاكتيكي مع صبغة التباين" },
  ],
  "simvastatin": [
    { drug2: "amiodarone", severity: "high", message: "Increased risk of myopathy", messageAr: "زيادة خطر اعتلال العضلات" },
    { drug2: "clarithromycin", severity: "high", message: "Statin toxicity risk", messageAr: "خطر سمية الستاتين" },
  ],
  "lisinopril": [
    { drug2: "potassium", severity: "medium", message: "Risk of hyperkalemia", messageAr: "خطر ارتفاع البوتاسيوم في الدم" },
    { drug2: "spironolactone", severity: "medium", message: "Hyperkalemia risk", messageAr: "خطر فرط بوتاسيوم الدم" },
  ],
};

function checkInteractions(medications: string[]): { drug1: string; drug2: string; severity: string; message: string; messageAr: string }[] {
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

    const riskScore = p.chronicConditions.length > 2 ? "high" :
      p.chronicConditions.length > 0 ? "medium" : "low";

    res.json({
      patient: {
        ...p,
        emergencyContacts: contacts,
        currentMedications: medications,
        medicalRecords: records,
        labResults: labs,
        vaccinations,
      },
      summary: {
        totalVisits: records.length,
        hospitalsVisited: hospitals.size,
        activeMedications: medications.length,
        lastVisit,
        riskScore,
      },
      drugInteractionAlerts,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch physician dashboard" });
  }
});

router.post("/medications/check-interaction", async (req, res) => {
  try {
    const { newDrug, existingDrugs } = req.body as { newDrug: string; existingDrugs: string[] };
    const allDrugs = [...existingDrugs, newDrug];
    const alerts = checkInteractions(allDrugs.map((d) => d.toLowerCase()))
      .filter((a) => a.drug1.toLowerCase() === newDrug.toLowerCase() || a.drug2.toLowerCase() === newDrug.toLowerCase());

    res.json({
      hasInteraction: alerts.length > 0,
      severity: alerts.length > 0 ? alerts[0].severity : "none",
      alerts,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to check drug interaction" });
  }
});

export default router;
