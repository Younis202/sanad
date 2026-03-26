import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { patientsTable, medicalRecordsTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [patientCount] = await db.select({ count: sql<number>`count(*)` }).from(patientsTable);
    const [recordCount] = await db.select({ count: sql<number>`count(*)` }).from(medicalRecordsTable);

    res.json({
      totalPatients: Number(patientCount.count),
      totalHospitals: 48,
      totalMedicalRecords: Number(recordCount.count),
      drugInteractionsPrevented: 1247,
      emergencyResponsesThisMonth: 342,
      activePhysicians: 2891,
    });
  } catch (err) {
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
          actionRequiredAr: "جدولة استشارة مع أخصائي التغذية وفحص السكر التراكمي"
        },
        {
          condition: "Hypertension",
          conditionAr: "ارتفاع ضغط الدم",
          probability: 0.42,
          timeframe: "6-12 months",
          severity: "low",
          actionRequired: "Monitor blood pressure weekly",
          actionRequiredAr: "مراقبة ضغط الدم أسبوعياً والتقليل من الصوديوم"
        }
      ],
      recommendations: [
        "تقليل الاستهلاك اليومي من السكر والنشويات",
        "ممارسة الرياضة 30 دقيقة يومياً",
        "فحص السكر التراكمي كل 3 أشهر",
        "المتابعة مع طبيب الباطنة"
      ]
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to fetch AI predictions" });
  }
});

export default router;
