import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  patientsTable,
  medicationsTable,
  emergencyContactsTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

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
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch emergency data" });
  }
});

export default router;
