import { useEffect, useRef, useState } from "react";
import { useClinicalStore } from "../../lib/state/clinical.store";
import { api } from "../../lib/api/client";
import PriorityStrip from "../../components/system/PriorityStrip";
import AuditFooter from "../../components/system/AuditFooter";
import PatientTimeline from "../../components/clinical/PatientTimeline";
import AIInsightPanel from "../../components/clinical/AIInsightPanel";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorState from "../../components/shared/ErrorState";

const TABS = [
  { key: "timeline",      label: "السجل الطبي",  icon: "M3 4h9l4 4v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" },
  { key: "labs",          label: "التحاليل",      icon: "M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-6-5z" },
  { key: "medications",   label: "الأدوية",       icon: "M12 2a5 5 0 0 1 5 5v1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1V7a5 5 0 0 1 5-5z" },
  { key: "vaccinations",  label: "التطعيمات",     icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" },
] as const;

const RISK_CFG: Record<string, { label: string; color: string; bg: string }> = {
  high:   { label: "خطر مرتفع",  color: "var(--critical-600)", bg: "rgba(220,38,38,0.08)"   },
  medium: { label: "خطر متوسط",  color: "var(--warning-600)",  bg: "rgba(217,119,6,0.08)"   },
  low:    { label: "خطر منخفض",  color: "var(--success-600)",  bg: "rgba(5,150,105,0.08)"   },
};

export default function ClinicalDashboard() {
  const store = useClinicalStore();
  const [localId, setLocalId] = useState(store.searchId);
  const [aiPredictions, setAiPredictions] = useState<Parameters<typeof AIInsightPanel>[0]["predictions"]>([]);
  const didInit = useRef(false);

  async function load(id?: string) {
    const target = (id ?? localId).trim();
    if (!target) return;
    store.setSearchId(target);
    store.setLoading(true);
    store.setError(null);
    store.setPatient(null);
    store.setSummary(null);
    store.setDrugAlerts([]);
    setAiPredictions([]);
    try {
      const [res, aiRes] = await Promise.all([
        api.physician.dashboard(target) as Promise<{
          patient: Parameters<typeof store.setPatient>[0];
          summary: Parameters<typeof store.setSummary>[0];
          drugInteractionAlerts: Parameters<typeof store.setDrugAlerts>[0];
        }>,
        api.ai.predictions(target) as Promise<{ predictions: typeof aiPredictions }>,
      ]);
      store.setPatient(res.patient);
      store.setSummary(res.summary);
      store.setDrugAlerts(res.drugInteractionAlerts);
      setAiPredictions(aiRes.predictions ?? []);
    } catch (e: unknown) {
      store.setError(e instanceof Error ? e.message : "تعذر تحميل بيانات المريض");
    } finally {
      store.setLoading(false);
    }
  }

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      load(store.searchId);
    }
  }, []);

  async function checkInteraction() {
    if (!store.newDrugInput.trim() || !store.patient) return;
    const existing = (store.patient as { currentMedications: { name: string }[] }).currentMedications.map((m) => m.name);
    try {
      const result = await api.physician.checkInteraction(store.newDrugInput, existing) as Parameters<typeof store.setInteractionResult>[0];
      store.setInteractionResult(result);
    } catch {
      // ignore
    }
  }

  const p = store.patient as {
    nameAr: string; nationalId: string; city: string; phone: string; bloodType: string;
    allergies: string[]; chronicConditions: string[];
    currentMedications: { nameAr: string; name: string; dosage: string; frequency: string; prescribedBy: string; hospital: string; prescribedDate: string }[];
    medicalRecords: Parameters<typeof PatientTimeline>[0]["records"];
    labResults: { id: number; testNameAr: string; value: string; unit: string; normalRange: string; status: string; date: string; hospital: string }[];
    vaccinations: { nameAr: string; date: string; nextDue: string | null; status: string }[];
  } | null;
  const s = store.summary as { totalVisits: number; hospitalsVisited: number; activeMedications: number; riskScore: string } | null;
  const risk = s ? RISK_CFG[s.riskScore] ?? RISK_CFG.low : null;

  return (
    <div className="flex flex-col min-h-screen">
      {store.drugAlerts.length > 0 && (
        <PriorityStrip
          level="critical"
          message={`${store.drugAlerts.length} تعارض دوائي حرج — ${p?.nameAr ?? ""}`}
          detail="مراجعة فورية مطلوبة"
        />
      )}

      {/* Sticky Header */}
      <div
        className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap"
        style={{
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(203,213,239,0.5)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div>
          <div className="text-h2" style={{ color: "var(--n-900)", letterSpacing: "-0.5px" }}>لوحة الطبيب السريرية</div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            Physician Dashboard · السجل الموحد من كافة المنشآت
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="رقم الهوية الوطنية"
              className="input font-mono"
              style={{ width: "200px", letterSpacing: "1px", paddingRight: "40px" }}
              dir="ltr"
            />
            <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} viewBox="0 0 16 16" fill="none" width={14} height={14}>
              <circle cx="7" cy="7" r="5.5" stroke="var(--n-600)" strokeWidth="1.3"/>
              <path d="M11 11l3 3" stroke="var(--n-600)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <button onClick={() => load()} className="btn btn-primary">
            بحث
          </button>
          <button
            onClick={() => { setLocalId("1234567890"); load("1234567890"); }}
            className="btn btn-ghost btn-sm"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
          >
            1234567890
          </button>
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل السجل الطبي الموحد..." />}
      {store.error && !store.loading && (
        <div className="p-6">
          <ErrorState message={store.error} onRetry={() => load()} />
        </div>
      )}

      {p && s && !store.loading && (
        <div className="flex-1 flex overflow-hidden">

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-y-auto">

            {/* Patient Identity Hero */}
            <div
              className="p-6"
              style={{
                background: "linear-gradient(135deg, rgba(0,25,60,0.96) 0%, rgba(0,51,255,0.85) 100%)",
                borderBottom: "1px solid rgba(0,51,255,0.2)",
              }}
            >
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div
                  className="rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "24px",
                  }}
                >
                  {p.nameAr?.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span style={{ fontSize: "22px", fontWeight: 900, color: "white", letterSpacing: "-0.3px" }}>{p.nameAr}</span>
                    {p.allergies.map((a: string) => (
                      <span key={a} style={{
                        padding: "3px 10px",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: "rgba(239,68,68,0.25)",
                        color: "#FCA5A5",
                        border: "1px solid rgba(239,68,68,0.4)",
                      }}>
                        ⚠ {a}
                      </span>
                    ))}
                    {p.chronicConditions.map((c: string) => (
                      <span key={c} style={{
                        padding: "3px 10px",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: "rgba(251,191,36,0.20)",
                        color: "#FCD34D",
                        border: "1px solid rgba(251,191,36,0.35)",
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-small flex-wrap" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <span className="font-mono" style={{ letterSpacing: "1px" }}>{p.nationalId}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span>{p.city}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span>{p.phone}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: "99px",
                        background: "rgba(239,68,68,0.30)",
                        color: "#FCA5A5",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        border: "1px solid rgba(239,68,68,0.5)",
                      }}
                    >
                      {p.bloodType}
                    </span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="flex gap-3 flex-shrink-0">
                  {[
                    { value: s.totalVisits,       label: "زيارة"  },
                    { value: s.hospitalsVisited,  label: "منشأة"  },
                    { value: s.activeMedications, label: "دواء"   },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center px-4 py-3 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        minWidth: "72px",
                      }}
                    >
                      <div style={{ fontSize: "26px", fontWeight: 900, color: "white", letterSpacing: "-1px", lineHeight: 1 }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.45)", marginTop: "4px", letterSpacing: "0.3px" }}>{stat.label}</div>
                    </div>
                  ))}
                  {risk && (
                    <div
                      className="text-center px-4 py-3 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        minWidth: "80px",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 900, color: risk.color, lineHeight: 1.2 }}>
                        {risk.label}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>مؤشر المخاطر</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drug Alerts */}
            {store.drugAlerts.length > 0 && (
              <div className="p-5">
                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{
                    background: "rgba(254,242,242,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(254,205,211,0.8)",
                    borderRight: "4px solid var(--critical-500)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--critical-500)", boxShadow: "0 0 8px var(--critical-500)", animation: "pulse-soft 1.5s ease-in-out infinite", flexShrink: 0 }} />
                    <div className="text-h4" style={{ color: "var(--critical-700)" }}>تحذيرات التعارض الدوائي الحرج</div>
                  </div>
                  <div className="space-y-2">
                    {(store.drugAlerts as { drug1: string; drug2: string; messageAr: string }[]).map((a, i) => (
                      <div key={i} className="rounded-xl px-4 py-3" style={{ background: "white", border: "1px solid var(--critical-200)" }}>
                        <div className="text-small font-bold" style={{ color: "var(--critical-700)" }}>
                          {a.drug1} ← تعارض → {a.drug2}
                        </div>
                        <div className="text-small mt-0.5" style={{ color: "var(--critical-500)" }}>{a.messageAr}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(240,244,255,0.8)", backdropFilter: "blur(8px)", display: "inline-flex" }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => store.setActiveTab(tab.key)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "16px",
                      fontSize: "13px",
                      fontWeight: store.activeTab === tab.key ? 700 : 500,
                      color: store.activeTab === tab.key ? "white" : "var(--n-500)",
                      background: store.activeTab === tab.key ? "var(--sanad-blue)" : "transparent",
                      boxShadow: store.activeTab === tab.key ? "0 4px 12px rgba(0,51,255,0.30)" : "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
                      fontFamily: "var(--font-ui)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 pt-3">
              {store.activeTab === "timeline" && (
                <PatientTimeline records={p.medicalRecords} />
              )}

              {store.activeTab === "labs" && (
                <div className="glass-card overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>التحليل</th><th>القيمة</th><th>المعدل الطبيعي</th>
                        <th>الحالة</th><th>التاريخ</th><th>المنشأة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.labResults.map((lab) => (
                        <tr key={lab.id}>
                          <td className="font-medium">{lab.testNameAr}</td>
                          <td>
                            <span className="font-mono font-bold" style={{ color: lab.status !== "normal" ? "var(--critical-600)" : "var(--n-900)" }}>
                              {lab.value} {lab.unit}
                            </span>
                          </td>
                          <td><span className="font-mono text-small" style={{ color: "var(--n-400)" }}>{lab.normalRange}</span></td>
                          <td>
                            <span className={`badge ${lab.status === "normal" ? "badge-success" : "badge-critical"}`}>
                              {lab.status === "normal" ? "طبيعي" : "غير طبيعي"}
                            </span>
                          </td>
                          <td><span className="font-mono text-small" style={{ color: "var(--n-500)" }}>{lab.date}</span></td>
                          <td><span className="text-small" style={{ color: "var(--n-500)" }}>{lab.hospital}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {store.activeTab === "medications" && (
                <div className="glass-card overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>الدواء</th><th>الجرعة</th><th>التكرار</th>
                        <th>الطبيب</th><th>المنشأة</th><th>تاريخ الوصف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.currentMedications.map((m, i) => (
                        <tr key={i}>
                          <td className="font-semibold">{m.nameAr}</td>
                          <td><span className="font-mono text-small">{m.dosage}</span></td>
                          <td><span className="text-small">{m.frequency}</span></td>
                          <td><span className="text-small">{m.prescribedBy}</span></td>
                          <td><span className="text-small" style={{ color: "var(--n-500)" }}>{m.hospital}</span></td>
                          <td><span className="font-mono text-small" style={{ color: "var(--n-500)" }}>{m.prescribedDate}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {store.activeTab === "vaccinations" && (
                <div className="glass-card overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>التطعيم</th><th>تاريخ التطعيم</th><th>الجرعة القادمة</th><th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.vaccinations.map((v, i) => (
                        <tr key={i}>
                          <td className="font-semibold">{v.nameAr}</td>
                          <td><span className="font-mono text-small">{v.date}</span></td>
                          <td>
                            {v.nextDue
                              ? <span className="font-mono text-small">{v.nextDue}</span>
                              : <span className="text-small" style={{ color: "var(--n-300)" }}>—</span>}
                          </td>
                          <td>
                            <span className={`badge ${v.status === "completed" ? "badge-success" : "badge-warning"}`}>
                              {v.status === "completed" ? "مكتمل" : "مطلوب"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Decision Sidebar */}
          <div
            className="overflow-y-auto space-y-4 p-4"
            style={{
              width: "300px",
              flexShrink: 0,
              borderRight: "1px solid rgba(203,213,239,0.5)",
              background: "var(--n-25)",
            }}
          >
            {/* Drug Interaction Checker */}
            <div className="glass-card p-4 space-y-3">
              <div>
                <div className="text-h4" style={{ color: "var(--n-800)" }}>كاشف التعارض الدوائي</div>
                <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>Drug Interaction Checker · AI</div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={store.newDrugInput}
                  onChange={(e) => store.setNewDrugInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkInteraction()}
                  placeholder="اسم الدواء"
                  className="input text-small flex-1"
                />
                <button onClick={checkInteraction} className="btn btn-primary btn-sm">فحص</button>
              </div>
              {store.interactionResult && (
                <div className={`rounded-xl p-3 ${(store.interactionResult as { hasInteraction: boolean }).hasInteraction ? "card-critical" : "card-success"}`}>
                  {(store.interactionResult as { hasInteraction: boolean }).hasInteraction ? (
                    <div>
                      <div className="text-small font-bold" style={{ color: "var(--critical-700)" }}>⚠ تحذير: يوجد تعارض دوائي</div>
                      {(store.interactionResult as { alerts: { messageAr: string }[] }).alerts.map((a, i) => (
                        <div key={i} className="text-small mt-1" style={{ color: "var(--critical-600)" }}>{a.messageAr}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-small font-semibold" style={{ color: "var(--success-700)" }}>✓ لا يوجد تعارض دوائي مرصود</div>
                  )}
                </div>
              )}
            </div>

            {/* AI Insights */}
            {aiPredictions.length > 0 && (
              <AIInsightPanel predictions={aiPredictions} />
            )}

            {/* Clinical Actions */}
            <div className="glass-card p-4 space-y-2">
              <div className="text-h4 mb-3" style={{ color: "var(--n-800)" }}>إجراءات سريرية</div>
              {[
                { label: "طلب تحاليل إضافية",    sub: "إرسال طلب للمختبر",       color: "var(--info-600)"    },
                { label: "تحديث قائمة الأدوية",  sub: "وصف دواء جديد أو تعديل",  color: "var(--warning-600)" },
                { label: "تحويل لاختصاصي",        sub: "إحالة لقسم آخر",          color: "var(--n-500)"       },
                { label: "تسجيل ملاحظة سريرية",   sub: "إضافة ملاحظة للسجل",     color: "var(--n-500)"       },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full text-right rounded-xl px-3 py-2.5 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(203,213,239,0.6)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.95)";
                    (e.currentTarget as HTMLElement).style.transform = "translateX(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.7)";
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}
                >
                  <div className="text-small font-semibold" style={{ color: "var(--n-800)" }}>{action.label}</div>
                  <div className="text-caption" style={{ color: "var(--n-400)" }}>{action.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AuditFooter context="Clinical" />
    </div>
  );
}
