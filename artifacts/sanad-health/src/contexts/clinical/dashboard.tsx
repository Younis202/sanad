import { useEffect, useState } from "react";
import { useClinicalStore } from "../../lib/state/clinical.store";
import { api } from "../../lib/api/client";
import PriorityStrip from "../../components/system/PriorityStrip";
import AuditFooter from "../../components/system/AuditFooter";
import PatientTimeline from "../../components/clinical/PatientTimeline";
import AIInsightPanel from "../../components/clinical/AIInsightPanel";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorState from "../../components/shared/ErrorState";

const TABS = [
  { key: "timeline",     label: "السجل الطبي"   },
  { key: "labs",        label: "التحاليل"       },
  { key: "medications", label: "الأدوية"        },
  { key: "vaccinations",label: "التطعيمات"      },
] as const;

const RISK_CFG: Record<string, { label: string; color: string }> = {
  high:   { label: "خطر مرتفع",   color: "var(--critical-600)" },
  medium: { label: "خطر متوسط",   color: "var(--warning-600)"  },
  low:    { label: "خطر منخفض",   color: "var(--success-600)"  },
};

export default function ClinicalDashboard() {
  const store = useClinicalStore();
  const [localId, setLocalId] = useState(store.searchId);
  const [aiPredictions, setAiPredictions] = useState<Parameters<typeof AIInsightPanel>[0]["predictions"]>([]);
  const didInit = { current: false };

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
    const existing = store.patient.currentMedications.map((m) => m.name);
    try {
      const result = await api.physician.checkInteraction(store.newDrugInput, existing) as Parameters<typeof store.setInteractionResult>[0];
      store.setInteractionResult(result);
    } catch {
      // ignore
    }
  }

  const p = store.patient;
  const s = store.summary;
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

      {/* Header + Search */}
      <div
        className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap"
        style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--n-150)" }}
      >
        <div>
          <div className="text-h2" style={{ color: "var(--n-900)" }}>لوحة الطبيب السريرية</div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            Physician Dashboard · السجل الموحد من كافة المنشآت
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="رقم الهوية الوطنية"
            className="input font-mono"
            style={{ width: "200px", letterSpacing: "1px" }}
            dir="ltr"
          />
          <button onClick={() => load()} className="btn btn-primary">
            بحث
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
        <div className="flex-1 flex gap-0 overflow-hidden">

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-y-auto">

            {/* Patient Identity Header */}
            <div
              className="p-6"
              style={{ borderBottom: "1px solid var(--n-150)", background: "var(--card-bg)" }}
            >
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div
                  className="rounded-xl flex items-center justify-center font-black text-white flex-shrink-0"
                  style={{
                    width: "54px",
                    height: "54px",
                    background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
                    fontSize: "22px",
                  }}
                >
                  {p.nameAr?.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-h2" style={{ color: "var(--n-900)" }}>{p.nameAr}</span>
                    {p.allergies.map((a: string) => (
                      <span key={a} className="badge badge-critical">{a}</span>
                    ))}
                    {p.chronicConditions.map((c: string) => (
                      <span key={c} className="badge badge-warning">{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-small" style={{ color: "var(--n-500)" }}>
                    <span className="font-mono">{p.nationalId}</span>
                    <span style={{ color: "var(--n-300)" }}>·</span>
                    <span>{p.city}</span>
                    <span style={{ color: "var(--n-300)" }}>·</span>
                    <span>{p.phone}</span>
                    <span style={{ color: "var(--n-300)" }}>·</span>
                    <span
                      className="font-bold badge badge-critical-solid"
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
                      className="card text-center px-4 py-3"
                      style={{ minWidth: "70px" }}
                    >
                      <div className="stat-value" style={{ fontSize: "24px" }}>
                        {stat.value}
                      </div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                  {risk && (
                    <div className="card text-center px-4 py-3">
                      <div
                        className="font-black leading-none"
                        style={{ fontSize: "18px", color: risk.color, marginBottom: "4px" }}
                      >
                        {risk.label}
                      </div>
                      <div className="stat-label">مؤشر المخاطر</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drug Alerts */}
            {store.drugAlerts.length > 0 && (
              <div className="p-4 px-6">
                <div className="card-critical rounded-xl p-4 space-y-2">
                  <div className="text-h4" style={{ color: "var(--critical-700)" }}>
                    تحذيرات التعارض الدوائي
                  </div>
                  <div className="space-y-2">
                    {store.drugAlerts.map((a: { drug1: string; drug2: string; messageAr: string }, i: number) => (
                      <div
                        key={i}
                        className="rounded-lg px-4 py-3"
                        style={{ background: "white", border: "1px solid var(--critical-200)" }}
                      >
                        <div className="text-small font-bold" style={{ color: "var(--critical-700)" }}>
                          {a.drug1} — {a.drug2}
                        </div>
                        <div className="text-small mt-0.5" style={{ color: "var(--critical-500)" }}>
                          {a.messageAr}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="px-6 py-4">
              <div className="flex gap-1 mb-5" style={{ borderBottom: "1px solid var(--n-150)", paddingBottom: "0" }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => store.setActiveTab(tab.key)}
                    className="text-small font-semibold pb-3 px-1 transition-all"
                    style={{
                      color: store.activeTab === tab.key ? "var(--brand-600)" : "var(--n-400)",
                      borderBottom: store.activeTab === tab.key
                        ? "2px solid var(--brand-600)"
                        : "2px solid transparent",
                      marginBottom: "-1px",
                      marginLeft: "16px",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Timeline */}
              {store.activeTab === "timeline" && (
                <PatientTimeline records={p.medicalRecords} />
              )}

              {/* Labs */}
              {store.activeTab === "labs" && (
                <div className="card rounded-xl overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>التحليل</th>
                        <th>القيمة</th>
                        <th>المعدل الطبيعي</th>
                        <th>الحالة</th>
                        <th>التاريخ</th>
                        <th>المنشأة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.labResults.map((lab: {
                        id: number; testNameAr: string; value: string; unit: string;
                        normalRange: string; status: string; date: string; hospital: string;
                      }) => (
                        <tr key={lab.id}>
                          <td className="font-medium">{lab.testNameAr}</td>
                          <td>
                            <span className="font-mono font-bold" style={{ color: lab.status !== "normal" ? "var(--critical-600)" : "var(--n-900)" }}>
                              {lab.value} {lab.unit}
                            </span>
                          </td>
                          <td>
                            <span className="font-mono text-small" style={{ color: "var(--n-400)" }}>
                              {lab.normalRange}
                            </span>
                          </td>
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

              {/* Medications */}
              {store.activeTab === "medications" && (
                <div className="card rounded-xl overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>الدواء</th>
                        <th>الجرعة</th>
                        <th>التكرار</th>
                        <th>الطبيب</th>
                        <th>المنشأة</th>
                        <th>تاريخ الوصف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.currentMedications.map((m: {
                        nameAr: string; dosage: string; frequency: string;
                        prescribedBy: string; hospital: string; prescribedDate: string;
                      }, i: number) => (
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

              {/* Vaccinations */}
              {store.activeTab === "vaccinations" && (
                <div className="card rounded-xl overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>التطعيم</th>
                        <th>تاريخ التطعيم</th>
                        <th>الجرعة القادمة</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.vaccinations.map((v: {
                        nameAr: string; date: string; nextDue: string | null; status: string;
                      }, i: number) => (
                        <tr key={i}>
                          <td className="font-semibold">{v.nameAr}</td>
                          <td><span className="font-mono text-small">{v.date}</span></td>
                          <td>
                            {v.nextDue ? (
                              <span className="font-mono text-small">{v.nextDue}</span>
                            ) : (
                              <span className="text-small" style={{ color: "var(--n-300)" }}>—</span>
                            )}
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

          {/* Right Sidebar */}
          <div
            className="overflow-y-auto space-y-4 p-4"
            style={{
              width: "300px",
              flexShrink: 0,
              borderRight: "1px solid var(--n-150)",
              background: "var(--n-25)",
            }}
          >
            {/* Drug Interaction Checker */}
            <div className="card rounded-xl p-4 space-y-3">
              <div>
                <div className="text-h4" style={{ color: "var(--n-800)" }}>
                  كاشف التعارض الدوائي
                </div>
                <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>
                  Drug Interaction Check
                </div>
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
                <button onClick={checkInteraction} className="btn btn-primary btn-sm">
                  فحص
                </button>
              </div>
              {store.interactionResult && (
                <div
                  className={`rounded-lg p-3 ${store.interactionResult.hasInteraction ? "card-critical" : "card-success"}`}
                >
                  {store.interactionResult.hasInteraction ? (
                    <div>
                      <div className="text-small font-bold" style={{ color: "var(--critical-700)" }}>
                        تحذير: يوجد تعارض دوائي
                      </div>
                      {store.interactionResult.alerts.map((a: { messageAr: string }, i: number) => (
                        <div key={i} className="text-small mt-1" style={{ color: "var(--critical-600)" }}>
                          {a.messageAr}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-small font-semibold" style={{ color: "var(--success-700)" }}>
                      لا يوجد تعارض دوائي مرصود
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Insights */}
            {aiPredictions.length > 0 && (
              <AIInsightPanel predictions={aiPredictions} />
            )}

            {/* Clinical Actions */}
            <div className="card rounded-xl p-4 space-y-2">
              <div className="text-h4 mb-3" style={{ color: "var(--n-800)" }}>
                إجراءات سريرية
              </div>
              {[
                { label: "طلب تحاليل إضافية",   sub: "إرسال طلب للمختبر",       variant: "badge-info"    },
                { label: "تحديث قائمة الأدوية", sub: "وصف دواء جديد أو تعديل",  variant: "badge-warning" },
                { label: "تحويل لاختصاصي",       sub: "إحالة لقسم آخر",          variant: "badge-neutral" },
                { label: "تسجيل ملاحظة سريرية",  sub: "إضافة ملاحظة للسجل",     variant: "badge-neutral" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full text-right rounded-lg px-3 py-2.5 transition-colors"
                  style={{
                    background: "var(--n-50)",
                    border: "1px solid var(--n-150)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--n-100)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--n-50)")}
                >
                  <div className="text-small font-semibold" style={{ color: "var(--n-800)" }}>
                    {action.label}
                  </div>
                  <div className="text-caption" style={{ color: "var(--n-400)" }}>
                    {action.sub}
                  </div>
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
