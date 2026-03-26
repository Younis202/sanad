import { useEffect, useState } from "react";
import { useClinicalStore } from "../../lib/state/clinical.store";
import { api } from "../../lib/api/client";
import PriorityStrip from "../../components/system/PriorityStrip";
import AuditFooter from "../../components/system/AuditFooter";
import PatientTimeline from "../../components/clinical/PatientTimeline";
import AIInsightPanel from "../../components/clinical/AIInsightPanel";
import ActionPanel from "../../components/clinical/ActionPanel";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorState from "../../components/shared/ErrorState";

const TABS = [
  { key: "timeline", label: "السجل الطبي" },
  { key: "labs", label: "التحاليل" },
  { key: "medications", label: "الأدوية" },
  { key: "vaccinations", label: "التطعيمات" },
] as const;

const riskColor: Record<string, string> = {
  high: "var(--color-critical)",
  medium: "var(--color-warning)",
  low: "var(--color-success)",
};
const riskLabel: Record<string, string> = { high: "مرتفع", medium: "متوسط", low: "منخفض" };

export default function ClinicalDashboard() {
  const store = useClinicalStore();
  const [localId, setLocalId] = useState(store.searchId);
  const [aiData, setAiData] = useState<{ predictions: unknown[] } | null>(null);

  async function load(id?: string) {
    const target = (id ?? localId).trim();
    if (!target) return;
    store.setSearchId(target);
    store.setLoading(true);
    store.setError(null);
    store.setPatient(null);
    store.setSummary(null);
    store.setDrugAlerts([]);
    try {
      const res = await api.physician.dashboard(target) as {
        patient: Parameters<typeof store.setPatient>[0];
        summary: Parameters<typeof store.setSummary>[0];
        drugInteractionAlerts: Parameters<typeof store.setDrugAlerts>[0];
      };
      store.setPatient(res.patient);
      store.setSummary(res.summary);
      store.setDrugAlerts(res.drugInteractionAlerts);
      // Also load AI predictions
      const ai = await api.ai.predictions(target) as { predictions: unknown[] };
      setAiData(ai);
    } catch (e: unknown) {
      store.setError(e instanceof Error ? e.message : "تعذر تحميل بيانات المريض");
    } finally {
      store.setLoading(false);
    }
  }

  useEffect(() => { load(store.searchId); }, []);

  async function checkInteraction() {
    if (!store.newDrugInput.trim() || !store.patient) return;
    const existing = store.patient.currentMedications.map((m) => m.name);
    const result = await api.physician.checkInteraction(store.newDrugInput, existing) as {
      hasInteraction: boolean;
      severity: string;
      alerts: Parameters<typeof store.setDrugAlerts>[0];
    };
    store.setInteractionResult(result);
  }

  const p = store.patient;
  const s = store.summary;

  return (
    <div className="flex flex-col min-h-screen">
      {store.drugAlerts.length > 0 && (
        <PriorityStrip
          level="critical"
          message={`⚠️ تحذير: تم رصد ${store.drugAlerts.length} تعارض دوائي خطير للمريض ${p?.nameAr ?? ""}`}
        />
      )}

      {/* Search bar */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-neutral-900 flex items-center gap-2">
            <span>🩺</span> لوحة الطبيب السريرية
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">السجل الطبي الموحد من كافة المنشآت</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="رقم الهوية الوطنية"
            className="border border-neutral-200 rounded-xl px-4 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-200 w-48"
            dir="ltr"
          />
          <button
            onClick={() => load()}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "var(--sanad-teal)" }}
          >
            بحث
          </button>
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل السجل الطبي الموحد..." />}
      {store.error && !store.loading && <ErrorState message={store.error} onRetry={() => load()} />}

      {p && s && !store.loading && (
        <div className="flex-1 p-6 grid grid-cols-3 gap-6">
          {/* Main area */}
          <div className="col-span-2 space-y-5">
            {/* Patient header */}
            <div className="sanad-card p-5 rounded-2xl">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white font-black flex-shrink-0"
                    style={{ background: "var(--sanad-teal)" }}
                  >
                    {p.nameAr.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xl font-black text-neutral-900">{p.nameAr}</div>
                    <div className="text-sm text-neutral-400 font-mono">{p.nationalId}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                      <span>📍 {p.city}</span>
                      <span>📞 {p.phone}</span>
                      <span>🩸 {p.bloodType}</span>
                    </div>
                  </div>
                </div>

                {/* Risk & Summary */}
                <div className="flex gap-3">
                  <div className="text-center sanad-card px-4 py-3 rounded-xl">
                    <div className="text-2xl font-black text-neutral-800">{s.totalVisits}</div>
                    <div className="text-xs text-neutral-500">زيارة</div>
                  </div>
                  <div className="text-center sanad-card px-4 py-3 rounded-xl">
                    <div className="text-2xl font-black text-neutral-800">{s.hospitalsVisited}</div>
                    <div className="text-xs text-neutral-500">منشأة</div>
                  </div>
                  <div className="text-center sanad-card px-4 py-3 rounded-xl">
                    <div
                      className="text-2xl font-black"
                      style={{ color: riskColor[s.riskScore] ?? "#64748b" }}
                    >
                      {riskLabel[s.riskScore] ?? s.riskScore}
                    </div>
                    <div className="text-xs text-neutral-500">مؤشر الخطر</div>
                  </div>
                </div>
              </div>

              {/* Allergies & Chronic */}
              {(p.allergies.length > 0 || p.chronicConditions.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
                  {p.allergies.map((a) => (
                    <span key={a} className="badge badge-critical">{a}</span>
                  ))}
                  {p.chronicConditions.map((c) => (
                    <span key={c} className="badge badge-warning">{c}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Drug Interaction Alerts */}
            {store.drugAlerts.length > 0 && (
              <div className="sanad-card-critical p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-700">
                  <span className="text-lg">🚨</span>
                  تحذيرات التعارض الدوائي ({store.drugAlerts.length})
                </div>
                {store.drugAlerts.map((a, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 text-sm">
                    <div className="font-bold text-red-800">{a.drug1} × {a.drug2}</div>
                    <div className="text-red-600 text-xs mt-1">{a.messageAr}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div>
              <div className="flex gap-1 mb-4 bg-neutral-100 p-1 rounded-xl w-fit">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => store.setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      store.activeTab === tab.key
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {store.activeTab === "timeline" && (
                <PatientTimeline records={p.medicalRecords} />
              )}

              {store.activeTab === "labs" && (
                <div className="sanad-card rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-4 py-3 text-right font-semibold text-neutral-600">التحليل</th>
                        <th className="px-4 py-3 text-right font-semibold text-neutral-600">القيمة</th>
                        <th className="px-4 py-3 text-right font-semibold text-neutral-600">المعدل</th>
                        <th className="px-4 py-3 text-right font-semibold text-neutral-600">الحالة</th>
                        <th className="px-4 py-3 text-right font-semibold text-neutral-600">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {p.labResults.map((lab) => (
                        <tr key={lab.id} className="hover:bg-neutral-25">
                          <td className="px-4 py-3 font-medium text-neutral-800">{lab.testNameAr}</td>
                          <td className="px-4 py-3 font-mono font-bold text-neutral-900">{lab.value} {lab.unit}</td>
                          <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{lab.normalRange}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${lab.status === "normal" ? "badge-success" : "badge-critical"}`}>
                              {lab.status === "normal" ? "طبيعي" : "غير طبيعي"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-400 font-mono text-xs">{lab.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {store.activeTab === "medications" && (
                <div className="space-y-3">
                  {p.currentMedications.map((m, i) => (
                    <div key={i} className="sanad-card p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <div className="font-bold text-neutral-800">{m.nameAr}</div>
                        <div className="text-xs text-neutral-500 mt-1">{m.dosage} — {m.frequency}</div>
                      </div>
                      <div className="text-left text-xs text-neutral-400 space-y-0.5">
                        <div>👨‍⚕️ {m.prescribedBy}</div>
                        <div>🏥 {m.hospital}</div>
                        <div>📅 {m.prescribedDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {store.activeTab === "vaccinations" && (
                <div className="space-y-3">
                  {p.vaccinations.map((v, i) => (
                    <div key={i} className="sanad-card p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <div className="font-bold text-neutral-800">{v.nameAr}</div>
                        <div className="text-xs text-neutral-500 mt-1">تاريخ التطعيم: {v.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {v.nextDue && <span className="text-xs text-neutral-400">الجرعة القادمة: {v.nextDue}</span>}
                        <span className={`badge ${v.status === "completed" ? "badge-success" : "badge-warning"}`}>
                          {v.status === "completed" ? "مكتمل" : "مطلوب"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Drug Interaction Checker */}
            <div className="sanad-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💊</span>
                <h3 className="font-bold text-neutral-800 text-sm">كاشف التعارض الدوائي</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={store.newDrugInput}
                  onChange={(e) => store.setNewDrugInput(e.target.value)}
                  placeholder="اسم الدواء الجديد"
                  className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                />
                <button
                  onClick={checkInteraction}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ background: "var(--sanad-teal)" }}
                >
                  فحص
                </button>
              </div>
              {store.interactionResult && (
                <div
                  className={`p-3 rounded-xl text-sm ${
                    store.interactionResult.hasInteraction
                      ? "sanad-card-critical"
                      : "sanad-card-success"
                  }`}
                >
                  {store.interactionResult.hasInteraction ? (
                    <div className="space-y-1">
                      <div className="font-bold text-red-700">⚠️ يوجد تعارض!</div>
                      {store.interactionResult.alerts.map((a, i) => (
                        <div key={i} className="text-xs text-red-600">{a.messageAr}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-bold text-green-700">✅ لا يوجد تعارض دوائي</div>
                  )}
                </div>
              )}
            </div>

            {/* AI Insights */}
            {aiData && aiData.predictions.length > 0 && (
              <AIInsightPanel predictions={aiData.predictions as Parameters<typeof AIInsightPanel>[0]["predictions"]} />
            )}

            {/* Action Panel */}
            <ActionPanel
              title="إجراءات سريرية"
              actions={[
                {
                  label: "طلب تحاليل إضافية",
                  description: "إرسال طلب للمختبر",
                  severity: "info",
                },
                {
                  label: "تحديث الأدوية",
                  description: "وصف دواء جديد أو تعديل الجرعة",
                  severity: "warning",
                },
                {
                  label: "تحويل لاختصاصي",
                  description: "إحالة المريض لقسم آخر",
                  severity: "info",
                },
              ]}
            />
          </div>
        </div>
      )}

      <AuditFooter context="Clinical" />
    </div>
  );
}
