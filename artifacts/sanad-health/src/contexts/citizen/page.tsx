import { useEffect } from "react";
import { useCitizenStore } from "../../lib/state/citizen.store";
import { api } from "../../lib/api/client";
import AuditFooter from "../../components/system/AuditFooter";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

type DashData = {
  healthScore: number;
  patient: { nameAr: string; nationalId: string; bloodType: string; city: string; phone: string; dateOfBirth: string };
  aiAlerts: { conditionAr: string; probability: number; severity: string; actionRequiredAr: string; timeframe: string }[];
  labResults: { id: number; testNameAr: string; value: string; unit: string; status: string; date: string; normalRange: string }[];
  currentMedications: { nameAr: string; name: string; dosage: string; frequency: string; hospital: string }[];
  recentVisits: { id: number; date: string; hospitalAr: string; diagnosisAr: string; type: string }[];
  upcomingVaccinations: { nameAr: string; status: string; nextDue: string | null }[];
};

const DEMO_ID = "1234567890";

export default function CitizenContext() {
  const store = useCitizenStore();

  useEffect(() => {
    (async () => {
      store.setLoading(true);
      store.setError(null);
      try {
        const data = await api.citizen.dashboard(store.nationalId || DEMO_ID) as DashData;
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
        store.setError(e instanceof Error ? e.message : "خطأ في تحميل البيانات");
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

  const SEVERITY_CFG: Record<string, { bar: string; label: string; cardClass: string; pillBg: string; pillColor: string }> = {
    high:   { bar: "var(--critical-500)", label: "خطر مرتفع", cardClass: "card-critical", pillBg: "rgba(220,38,38,0.10)", pillColor: "var(--critical-600)" },
    medium: { bar: "var(--warning-500)",  label: "خطر متوسط", cardClass: "card-warning",  pillBg: "rgba(217,119,6,0.10)",  pillColor: "var(--warning-600)"  },
    low:    { bar: "var(--success-500)",  label: "خطر منخفض", cardClass: "card-success",  pillBg: "rgba(5,150,105,0.10)",  pillColor: "var(--success-600)"  },
  };

  const scoreColor = score !== null
    ? score >= 80 ? "var(--success-500)"
    : score >= 60 ? "var(--warning-500)"
    : "var(--critical-500)"
    : "var(--n-300)";

  const scoreLabel = score !== null
    ? score >= 80 ? "ممتاز" : score >= 60 ? "جيد" : "يحتاج متابعة"
    : "";

  const VISIT_BADGE: Record<string, string> = {
    emergency: "badge-critical",
    inpatient: "badge-warning",
    outpatient: "badge-info",
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <div
        style={{
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(203,213,239,0.5)",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="text-h2" style={{ color: "var(--n-900)", letterSpacing: "-0.5px" }}>لوحة الصحة الشخصية</div>
        <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
          Citizen Health Dashboard · ملفك الصحي الموحد من نفاذ
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل ملفك الصحي..." />}

      {store.error && !store.loading && (
        <div className="flex items-center justify-center py-24 px-6">
          <div className="glass-card p-8 text-center max-w-sm">
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
            <div className="text-h4 mb-2" style={{ color: "var(--critical-700)" }}>{store.error}</div>
          </div>
        </div>
      )}

      {patient && score !== null && !store.loading && (
        <div className="flex-1 p-6 space-y-5 animate-fade-up">

          {/* Top Row: Identity Card + Health Score */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 220px" }}>

            {/* Identity Card — Premium dark glass */}
            <div
              className="rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,25,60,0.96) 0%, rgba(0,40,120,0.90) 100%)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 20px 60px rgba(0,51,255,0.15), 0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              {/* Background orb */}
              <div style={{
                position: "absolute", left: "-40px", top: "-40px",
                width: "200px", height: "200px",
                background: "radial-gradient(circle, rgba(0,51,255,0.25) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Avatar */}
              <div
                className="rounded-2xl flex items-center justify-center font-black flex-shrink-0"
                style={{
                  width: "64px",
                  height: "64px",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  fontSize: "26px",
                  color: "white",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {patient.nameAr.charAt(0)}
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "24px", fontWeight: 900, color: "white", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                  {patient.nameAr}
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "rgba(255,255,255,0.40)", letterSpacing: "1.5px" }}>
                    {patient.nationalId}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{patient.city}</span>
                  <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: "99px",
                      background: "rgba(239,68,68,0.25)",
                      color: "#FCA5A5",
                      fontWeight: 700,
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                      border: "1px solid rgba(239,68,68,0.40)",
                    }}
                  >
                    {patient.bloodType}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {[
                    { icon: "🛡", label: "NCA Compliant" },
                    { icon: "🔒", label: "HL7 FHIR R4" },
                    { icon: "✓", label: "Nafath Verified" },
                  ].map((b) => (
                    <span key={b.label} style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 600,
                    }}>
                      {b.icon} {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Score Card */}
            <div
              className="glass-card flex flex-col items-center justify-center p-5 text-center"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <div style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 50%, ${scoreColor}10 0%, transparent 70%)`,
              }} />
              <div className="text-label mb-3" style={{ position: "relative", zIndex: 1 }}>المؤشر الصحي</div>
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: 900,
                  letterSpacing: "-3px",
                  color: scoreColor,
                  lineHeight: 1,
                  position: "relative",
                  zIndex: 1,
                  textShadow: `0 0 40px ${scoreColor}50`,
                }}
              >
                {score}
              </div>
              <div style={{ fontSize: "11px", color: "var(--n-400)", marginTop: "4px", position: "relative", zIndex: 1 }}>
                من 100 · <span style={{ color: scoreColor, fontWeight: 700 }}>{scoreLabel}</span>
              </div>
              <div className="progress-track w-full mt-4" style={{ position: "relative", zIndex: 1 }}>
                <div className="progress-fill" style={{ width: `${score}%`, background: scoreColor, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
              </div>
            </div>
          </div>

          {/* AI Risk Alerts */}
          {aiAlerts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--n-400)" }}>
                  تنبيهات المخاطر الاستباقية
                </div>
                <span className="badge badge-brand">Sanad AI</span>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {aiAlerts.map((alert, i) => {
                  const cfg = SEVERITY_CFG[alert.severity] ?? SEVERITY_CFG.low;
                  const pct = Math.round(alert.probability * 100);
                  return (
                    <div key={i} className={`${cfg.cardClass} rounded-2xl p-5 space-y-3`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold" style={{ color: "var(--n-800)", fontSize: "14px" }}>
                          {alert.conditionAr}
                        </div>
                        <span style={{
                          padding: "3px 10px",
                          borderRadius: "99px",
                          fontSize: "11px",
                          fontWeight: 700,
                          background: cfg.pillBg,
                          color: cfg.pillColor,
                          flexShrink: 0,
                        }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-caption" style={{ color: "var(--n-400)" }}>الاحتمالية</span>
                          <span className="font-mono text-small font-bold" style={{ color: cfg.bar }}>{pct}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: cfg.bar }} />
                        </div>
                      </div>
                      <div className="text-small" style={{ color: "var(--n-600)" }}>
                        <span style={{ fontWeight: 600 }}>الإجراء: </span>{alert.actionRequiredAr}
                      </div>
                      <div className="text-caption" style={{ color: "var(--n-400)" }}>الإطار الزمني: {alert.timeframe}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lab Results — visual cards */}
          {labs.length > 0 && (
            <div>
              <div className="text-label mb-3">آخر التحاليل المخبرية</div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
                {labs.slice(0, 6).map((lab) => (
                  <div
                    key={lab.id}
                    className={`rounded-2xl p-4 ${lab.status === "normal" ? "card-success" : "card-critical"}`}
                  >
                    <div className="text-small font-medium mb-2" style={{ color: "var(--n-600)" }}>{lab.testNameAr}</div>
                    <div>
                      <span className="font-black font-mono" style={{
                        fontSize: "26px",
                        color: lab.status === "normal" ? "var(--success-700)" : "var(--critical-700)",
                        letterSpacing: "-0.5px",
                      }}>
                        {lab.value}
                      </span>
                      <span className="text-small mr-1" style={{ color: "var(--n-400)" }}>{lab.unit}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-caption" style={{ color: "var(--n-400)" }}>معدل: {lab.normalRange}</span>
                      <span className={`badge ${lab.status === "normal" ? "badge-success" : "badge-critical"}`}>
                        {lab.status === "normal" ? "طبيعي" : "مرتفع"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Middle Row: Visits + Medications */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Recent Visits */}
            <div>
              <div className="text-label mb-3">آخر الزيارات الطبية</div>
              <div className="glass-card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr><th>التشخيص</th><th>المنشأة</th><th>التاريخ</th></tr>
                  </thead>
                  <tbody>
                    {visits.slice(0, 5).map((v) => (
                      <tr key={v.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={`badge ${VISIT_BADGE[v.type] ?? "badge-neutral"}`} style={{ fontSize: "9px", padding: "1px 6px" }}>
                              {v.type === "emergency" ? "طوارئ" : v.type === "inpatient" ? "تنويم" : "عيادة"}
                            </span>
                            <span className="font-medium">{v.diagnosisAr}</span>
                          </div>
                        </td>
                        <td><span className="text-small" style={{ color: "var(--n-500)" }}>{v.hospitalAr}</span></td>
                        <td><span className="font-mono text-small" style={{ color: "var(--n-400)" }}>{v.date}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Medications */}
            <div>
              <div className="text-label mb-3">الأدوية الحالية</div>
              <div className="space-y-2">
                {meds.map((m, i) => (
                  <div
                    key={i}
                    className="glass-card-sm flex items-center gap-3 px-4 py-3"
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background: "rgba(0,51,255,0.08)",
                        border: "1px solid rgba(0,51,255,0.14)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "16px",
                      }}
                    >
                      💊
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-small font-semibold" style={{ color: "var(--n-800)" }}>{m.nameAr}</div>
                      <div className="text-caption" style={{ color: "var(--n-400)" }}>{m.dosage} · {m.hospital}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Vaccinations */}
          {vaccines.length > 0 && (
            <div>
              <div className="text-label mb-3">التطعيمات المطلوبة</div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {vaccines.map((v, i) => (
                  <div key={i} className="card-warning rounded-2xl p-4">
                    <div className="font-semibold text-sm" style={{ color: "var(--warning-800)" }}>💉 {v.nameAr}</div>
                    {v.nextDue && (
                      <div className="text-small mt-1" style={{ color: "var(--warning-600)" }}>الجرعة القادمة: {v.nextDue}</div>
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
