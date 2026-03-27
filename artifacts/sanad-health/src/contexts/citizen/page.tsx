import { useEffect } from "react";
import { useCitizenStore } from "../../lib/state/citizen.store";
import { api } from "../../lib/api/client";
import AuditFooter from "../../components/system/AuditFooter";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

type DashData = {
  healthScore: number;
  patient: { nameAr: string; nationalId: string; bloodType: string; city: string; phone: string };
  aiAlerts: { conditionAr: string; probability: number; severity: string; actionRequiredAr: string; timeframe: string }[];
  labResults: { id: number; testNameAr: string; value: string; unit: string; status: string; date: string; normalRange: string }[];
  currentMedications: { nameAr: string; dosage: string; frequency: string; hospital: string }[];
  recentVisits: { id: number; date: string; hospitalAr: string; diagnosisAr: string; type: string }[];
  upcomingVaccinations: { nameAr: string; status: string; nextDue: string | null }[];
};

export default function CitizenContext() {
  const store = useCitizenStore();

  useEffect(() => {
    (async () => {
      store.setLoading(true);
      store.setError(null);
      try {
        const data = await api.citizen.dashboard(store.nationalId) as DashData;
        store.setDashboard({
          healthScore: data.healthScore,
          patient: data.patient as Record<string, unknown>,
          recentVisits: data.recentVisits,
          currentMedications: data.currentMedications,
          aiAlerts: data.aiAlerts,
          labResults: data.labResults,
          upcomingVaccinations: data.upcomingVaccinations,
        });
      } catch (e: unknown) {
        store.setError(e instanceof Error ? e.message : "خطأ");
      } finally {
        store.setLoading(false);
      }
    })();
  }, []);

  const patient = store.patient as DashData["patient"] | null;
  const aiAlerts = store.aiAlerts as DashData["aiAlerts"];
  const labs = store.labResults as DashData["labResults"];
  const meds = store.currentMedications as DashData["currentMedications"];
  const visits = store.recentVisits as DashData["recentVisits"];
  const vaccines = store.upcomingVaccinations as DashData["upcomingVaccinations"];
  const score = store.healthScore;

  const SEVERITY_CFG: Record<string, { bar: string; label: string; cardClass: string }> = {
    high:   { bar: "var(--critical-500)", label: "خطر مرتفع", cardClass: "card-critical" },
    medium: { bar: "var(--warning-500)",  label: "خطر متوسط", cardClass: "card-warning"  },
    low:    { bar: "var(--success-500)",  label: "خطر منخفض", cardClass: "card-success"  },
  };

  const VISIT_TYPE: Record<string, string> = {
    emergency: "badge-critical",
    inpatient:  "badge-warning",
    outpatient: "badge-info",
    default:    "badge-neutral",
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--n-150)" }}
      >
        <div className="text-h2" style={{ color: "var(--n-900)" }}>لوحة الصحة الشخصية</div>
        <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
          Citizen Health Dashboard · ملفك الصحي الموحد
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل ملفك الصحي..." />}

      {patient && score !== null && !store.loading && (
        <div className="flex-1 p-6 space-y-6">

          {/* Top Row: Identity + Health Score */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 200px" }}>
            {/* Identity */}
            <div
              className="rounded-xl p-6 flex items-center gap-5"
              style={{
                background: "linear-gradient(135deg, var(--n-900) 0%, var(--brand-900) 100%)",
                border: "1px solid var(--n-800)",
              }}
            >
              <div
                className="rounded-xl flex items-center justify-center font-black flex-shrink-0"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(255,255,255,0.1)",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                {patient.nameAr.charAt(0)}
              </div>
              <div>
                <div className="font-black" style={{ fontSize: "22px", color: "white", letterSpacing: "-0.3px" }}>
                  {patient.nameAr}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-mono text-small" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "1px" }}>
                    {patient.nationalId}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span className="text-small" style={{ color: "rgba(255,255,255,0.55)" }}>{patient.city}</span>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span
                    className="badge badge-critical-solid"
                    style={{ background: "var(--critical-600)" }}
                  >
                    {patient.bloodType}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="card rounded-xl flex flex-col items-center justify-center p-5 text-center">
              <div className="text-label mb-2">المؤشر الصحي</div>
              <div
                className="font-black leading-none"
                style={{
                  fontSize: "52px",
                  letterSpacing: "-2px",
                  color: score >= 80 ? "var(--success-600)" : score >= 60 ? "var(--warning-600)" : "var(--critical-600)",
                }}
              >
                {score}
              </div>
              <div className="text-caption mt-1" style={{ color: "var(--n-400)" }}>من 100</div>
              <div className="progress-track w-full mt-3">
                <div
                  className="progress-fill"
                  style={{
                    width: `${score}%`,
                    background: score >= 80 ? "var(--success-500)" : score >= 60 ? "var(--warning-500)" : "var(--critical-500)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* AI Risk Alerts */}
          {aiAlerts.length > 0 && (
            <div>
              <div className="text-h3 mb-3" style={{ color: "var(--n-800)" }}>
                تنبيهات المخاطر الاستباقية
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {aiAlerts.map((alert, i) => {
                  const cfg = SEVERITY_CFG[alert.severity] ?? SEVERITY_CFG.low;
                  const pct = Math.round(alert.probability * 100);
                  return (
                    <div key={i} className={`${cfg.cardClass} rounded-xl p-4 space-y-3`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-sm" style={{ color: "var(--n-800)" }}>
                          {alert.conditionAr}
                        </div>
                        <span className={`badge ${alert.severity === "high" ? "badge-critical" : alert.severity === "medium" ? "badge-warning" : "badge-success"} flex-shrink-0`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-caption" style={{ color: "var(--n-400)" }}>الاحتمالية</span>
                          <span className="font-mono text-small font-semibold" style={{ color: cfg.bar }}>{pct}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: cfg.bar }} />
                        </div>
                      </div>
                      <div className="text-small" style={{ color: "var(--n-600)" }}>
                        الإجراء: {alert.actionRequiredAr}
                      </div>
                      <div className="text-caption" style={{ color: "var(--n-400)" }}>
                        الإطار: {alert.timeframe}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Middle Row: Visits + Medications */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Recent Visits */}
            <div>
              <div className="text-h3 mb-3" style={{ color: "var(--n-800)" }}>آخر الزيارات</div>
              <div className="card rounded-xl overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>التشخيص</th>
                      <th>المنشأة</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.slice(0, 5).map((v) => (
                      <tr key={v.id}>
                        <td className="font-medium">{v.diagnosisAr}</td>
                        <td>
                          <span className="text-small" style={{ color: "var(--n-500)" }}>{v.hospitalAr}</span>
                        </td>
                        <td>
                          <span className="font-mono text-small" style={{ color: "var(--n-400)" }}>{v.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Medications */}
            <div>
              <div className="text-h3 mb-3" style={{ color: "var(--n-800)" }}>الأدوية الحالية</div>
              <div className="card rounded-xl overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>الدواء</th>
                      <th>الجرعة</th>
                      <th>المنشأة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meds.map((m, i) => (
                      <tr key={i}>
                        <td className="font-medium">{m.nameAr}</td>
                        <td><span className="font-mono text-small">{m.dosage}</span></td>
                        <td><span className="text-small" style={{ color: "var(--n-400)" }}>{m.hospital}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lab Results */}
          <div>
            <div className="text-h3 mb-3" style={{ color: "var(--n-800)" }}>آخر التحاليل المخبرية</div>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {labs.slice(0, 6).map((lab) => (
                <div
                  key={lab.id}
                  className={`rounded-xl p-4 ${lab.status === "normal" ? "card-success" : "card-critical"}`}
                >
                  <div className="text-small font-medium mb-2" style={{ color: "var(--n-600)" }}>
                    {lab.testNameAr}
                  </div>
                  <div>
                    <span
                      className="font-black font-mono"
                      style={{
                        fontSize: "22px",
                        color: lab.status === "normal" ? "var(--success-700)" : "var(--critical-700)",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {lab.value}
                    </span>
                    <span className="text-small mr-1" style={{ color: "var(--n-400)" }}>{lab.unit}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-caption" style={{ color: "var(--n-400)" }}>
                      معدل: {lab.normalRange}
                    </span>
                    <span className={`badge ${lab.status === "normal" ? "badge-success" : "badge-critical"}`}>
                      {lab.status === "normal" ? "طبيعي" : "مرتفع"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Vaccinations */}
          {vaccines.length > 0 && (
            <div>
              <div className="text-h3 mb-3" style={{ color: "var(--n-800)" }}>التطعيمات المطلوبة</div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {vaccines.map((v, i) => (
                  <div key={i} className="card-warning rounded-xl p-4">
                    <div className="font-semibold text-sm" style={{ color: "var(--warning-800)" }}>
                      {v.nameAr}
                    </div>
                    {v.nextDue && (
                      <div className="text-small mt-1" style={{ color: "var(--warning-600)" }}>
                        الجرعة القادمة: {v.nextDue}
                      </div>
                    )}
                    <span className="badge badge-warning mt-2">مطلوب</span>
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
