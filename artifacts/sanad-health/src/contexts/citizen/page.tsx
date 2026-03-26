import { useEffect } from "react";
import { useCitizenStore } from "../../lib/state/citizen.store";
import { api } from "../../lib/api/client";
import AuditFooter from "../../components/system/AuditFooter";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

interface AiAlert {
  conditionAr: string;
  probability: number;
  severity: string;
  actionRequiredAr: string;
  timeframe: string;
}

interface LabResult {
  id: number;
  testNameAr: string;
  value: string;
  unit: string;
  status: string;
  date: string;
  normalRange: string;
}

interface Medication {
  nameAr: string;
  dosage: string;
  frequency: string;
  hospital: string;
}

interface Visit {
  id: number;
  date: string;
  hospitalAr: string;
  diagnosisAr: string;
  type: string;
}

interface Vaccination {
  nameAr: string;
  status: string;
  nextDue: string | null;
}

type DashboardData = {
  healthScore: number;
  patient: { nameAr: string; nationalId: string; bloodType: string; city: string };
  aiAlerts: AiAlert[];
  labResults: LabResult[];
  currentMedications: Medication[];
  recentVisits: Visit[];
  upcomingVaccinations: Vaccination[];
};

export default function CitizenContext() {
  const store = useCitizenStore();

  async function load() {
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await api.citizen.dashboard(store.nationalId) as DashboardData;
      store.setDashboard(data as {
        healthScore: number;
        patient: Record<string, unknown>;
        recentVisits: unknown[];
        currentMedications: unknown[];
        aiAlerts: unknown[];
        labResults: unknown[];
        upcomingVaccinations: unknown[];
      });
    } catch (e: unknown) {
      store.setError(e instanceof Error ? e.message : "خطأ");
    } finally {
      store.setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const patient = store.patient as DashboardData["patient"] | null;
  const aiAlerts = store.aiAlerts as AiAlert[];
  const labs = store.labResults as LabResult[];
  const meds = store.currentMedications as Medication[];
  const visits = store.recentVisits as Visit[];
  const vaccines = store.upcomingVaccinations as Vaccination[];
  const score = store.healthScore;

  const severityColor: Record<string, string> = {
    high: "var(--color-critical)",
    medium: "var(--color-warning)",
    low: "var(--color-success)",
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-white">
        <h1 className="text-xl font-black text-neutral-900 flex items-center gap-2">
          <span>❤️</span> لوحة صحتي
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">ملفك الصحي الشخصي الموحد</p>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل ملفك الصحي..." />}

      {patient && score !== null && !store.loading && (
        <div className="flex-1 p-6 space-y-6">
          {/* Welcome + Health Score */}
          <div className="grid grid-cols-3 gap-4">
            <div
              className="col-span-2 p-6 rounded-2xl text-white"
              style={{ background: `linear-gradient(135deg, var(--sanad-teal), var(--sanad-teal-dark))` }}
            >
              <div className="text-sm opacity-80 mb-1">مرحباً،</div>
              <div className="text-3xl font-black mb-2">{patient.nameAr}</div>
              <div className="flex items-center gap-4 text-sm opacity-80">
                <span>🩸 {patient.bloodType}</span>
                <span>📍 {patient.city}</span>
                <span className="font-mono text-xs">{patient.nationalId}</span>
              </div>
            </div>

            <div className="sanad-card p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="text-xs text-neutral-500 mb-2">المؤشر الصحي العام</div>
              <div
                className="text-5xl font-black leading-none mb-1"
                style={{
                  color: score >= 80 ? "var(--color-success)" : score >= 60 ? "var(--color-warning)" : "var(--color-critical)",
                }}
              >
                {score}
              </div>
              <div className="text-xs text-neutral-400">من 100</div>
              <div className="w-full bg-neutral-100 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${score}%`,
                    background: score >= 80 ? "var(--color-success)" : score >= 60 ? "var(--color-warning)" : "var(--color-critical)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* AI Alerts */}
          {aiAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-bold text-neutral-800 flex items-center gap-2">
                <span>🧠</span> تنبيهات سَنَد الذكية
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {aiAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border flex items-start gap-4"
                    style={{
                      background: alert.severity === "high"
                        ? "var(--color-critical-bg)"
                        : alert.severity === "medium"
                        ? "var(--color-warning-bg)"
                        : "var(--color-info-bg)",
                      borderColor: alert.severity === "high"
                        ? "var(--color-critical-border)"
                        : alert.severity === "medium"
                        ? "var(--color-warning-border)"
                        : "var(--color-info-border)",
                    }}
                  >
                    <div className="text-2xl">
                      {alert.severity === "high" ? "🚨" : alert.severity === "medium" ? "⚠️" : "💡"}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-neutral-800">{alert.conditionAr}</div>
                      <div className="text-sm text-neutral-600 mt-1">احتمالية: {Math.round(alert.probability * 100)}%</div>
                      <div className="text-xs text-neutral-500">⏱ {alert.timeframe}</div>
                      <div
                        className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg inline-block"
                        style={{ background: severityColor[alert.severity] ?? "#64748b", color: "white" }}
                      >
                        الإجراء: {alert.actionRequiredAr}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Recent Visits */}
            <div className="space-y-3">
              <h2 className="font-bold text-neutral-800 flex items-center gap-2">
                <span>📋</span> آخر الزيارات
              </h2>
              <div className="space-y-2">
                {visits.slice(0, 4).map((v, i) => (
                  <div key={i} className="sanad-card p-3 rounded-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">{v.diagnosisAr}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{v.hospitalAr}</div>
                      </div>
                      <div className="text-xs font-mono text-neutral-400 flex-shrink-0">{v.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-3">
              <h2 className="font-bold text-neutral-800 flex items-center gap-2">
                <span>💊</span> الأدوية الحالية
              </h2>
              <div className="space-y-2">
                {meds.map((m, i) => (
                  <div key={i} className="sanad-card p-3 rounded-xl">
                    <div className="font-semibold text-neutral-800 text-sm">{m.nameAr}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{m.dosage} — {m.frequency}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{m.hospital}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lab Results */}
          <div className="space-y-3">
            <h2 className="font-bold text-neutral-800 flex items-center gap-2">
              <span>🔬</span> آخر التحاليل
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {labs.slice(0, 6).map((lab, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl ${lab.status === "normal" ? "sanad-card-success" : "sanad-card-critical"}`}
                >
                  <div className="text-xs text-neutral-600 mb-1">{lab.testNameAr}</div>
                  <div className="text-xl font-black text-neutral-900">{lab.value} <span className="text-xs font-normal text-neutral-500">{lab.unit}</span></div>
                  <div className="text-xs text-neutral-500 mt-1">معدل: {lab.normalRange}</div>
                  <span className={`badge mt-2 text-[10px] ${lab.status === "normal" ? "badge-success" : "badge-critical"}`}>
                    {lab.status === "normal" ? "طبيعي" : "مرتفع"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vaccinations */}
          {vaccines.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-bold text-neutral-800 flex items-center gap-2">
                <span>💉</span> التطعيمات المطلوبة
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {vaccines.map((v, i) => (
                  <div key={i} className="sanad-card-warning p-4 rounded-xl">
                    <div className="font-semibold text-amber-800 text-sm">{v.nameAr}</div>
                    {v.nextDue && <div className="text-xs text-amber-600 mt-1">موعد الجرعة: {v.nextDue}</div>}
                    <span className="badge badge-warning text-[10px] mt-2">مطلوب</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AuditFooter context="Citizen" />
    </div>
  );
}
