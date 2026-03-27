import { useEffect } from "react";
import { useNationalStore } from "../../lib/state/national.store";
import { api } from "../../lib/api/client";
import AuditFooter from "../../components/system/AuditFooter";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

type SystemStats = {
  totalPatients: number;
  totalHospitals: number;
  totalMedicalRecords: number;
  drugInteractionsPrevented: number;
  emergencyResponsesThisMonth: number;
  activePhysicians: number;
};

type PatientRow = {
  id: number;
  nationalId: string;
  nameAr: string;
  bloodType: string;
  city: string;
  gender: string;
};

const KPI_CONFIG = [
  {
    key: "totalPatients",
    label: "إجمالي المرضى",
    sub: "Total Patients",
    color: "var(--sanad-blue)",
    bg: "rgba(0,51,255,0.07)",
    border: "rgba(0,51,255,0.15)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
        <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "totalHospitals",
    label: "المنشآت الصحية",
    sub: "Facilities",
    color: "var(--info-600)",
    bg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.15)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
        <rect x="2" y="7" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 18V12h6v6M10 2v5M2 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "totalMedicalRecords",
    label: "السجلات الطبية",
    sub: "Medical Records",
    color: "var(--success-600)",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.15)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
        <path d="M4 2h9l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M13 2v6h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "drugInteractionsPrevented",
    label: "تعارضات دوائية منعت",
    sub: "Drug Interactions Prevented",
    color: "var(--critical-600)",
    bg: "rgba(220,38,38,0.07)",
    border: "rgba(220,38,38,0.15)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
        <path d="M10 2L3 5.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "emergencyResponsesThisMonth",
    label: "استجابات طوارئ",
    sub: "Emergency Responses / Month",
    color: "var(--warning-600)",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.15)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
        <rect x="1" y="6" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M14 9h2.5l2.5 3.5V16h-5V9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <circle cx="5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="13.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 11V9M5 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "activePhysicians",
    label: "أطباء نشطون",
    sub: "Active Physicians",
    color: "var(--brand-700)",
    bg: "rgba(0,51,255,0.06)",
    border: "rgba(0,51,255,0.12)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
        <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M15 9v4M13 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function NationalDashboard() {
  const store = useNationalStore();

  useEffect(() => {
    (async () => {
      store.setLoading(true);
      try {
        const [stats, patients] = await Promise.all([
          api.national.stats() as Promise<SystemStats>,
          api.national.patients() as Promise<PatientRow[]>,
        ]);
        store.setStats(stats);
        store.setPatients(patients);
      } catch (e: unknown) {
        store.setError(e instanceof Error ? e.message : "خطأ في تحميل البيانات");
      } finally {
        store.setLoading(false);
      }
    })();
  }, []);

  const stats = store.stats as SystemStats | null;
  const patients = store.patients as PatientRow[];

  const BLOOD_COUNTS = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.bloodType] = (acc[p.bloodType] ?? 0) + 1;
    return acc;
  }, {});

  const CITY_COUNTS = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.city] = (acc[p.city] ?? 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(CITY_COUNTS).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const BLOOD_COLORS: Record<string, string> = {
    "O+": "var(--critical-500)", "O-": "var(--critical-600)",
    "A+": "var(--sanad-blue)", "A-": "var(--brand-600)",
    "B+": "var(--warning-500)", "B-": "var(--warning-600)",
    "AB+": "var(--success-500)", "AB-": "var(--success-600)",
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
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
          <div className="text-h2" style={{ color: "var(--n-900)", letterSpacing: "-0.5px" }}>لوحة التحكم الوطنية</div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            National Operations Center · مراقبة المنظومة الصحية على مستوى المملكة
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["NCA Compliant", "HL7 FHIR R4", "SDAIA Connected", "STC Cloud KSA"].map((tag) => (
            <span key={tag} className="badge badge-neutral">{tag}</span>
          ))}
          <div className="flex items-center gap-1.5 mr-2">
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success-500)", boxShadow: "0 0 8px var(--success-500)", animation: "pulse-soft 2.5s ease-in-out infinite" }} />
            <span style={{ fontSize: "11px", color: "var(--success-600)", fontWeight: 600 }}>Live</span>
          </div>
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل بيانات المنظومة الوطنية..." />}

      {!store.loading && stats && (
        <div className="flex-1 p-6 space-y-6 animate-fade-up">

          {/* KPI Grid */}
          <div>
            <div className="text-label mb-4">مؤشرات الأداء الرئيسية — Key Performance Indicators</div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {KPI_CONFIG.map((kpi) => {
                const value = stats[kpi.key as keyof SystemStats];
                return (
                  <div
                    key={kpi.key}
                    className="stat-card flex items-center gap-4 group"
                    style={{ transition: "all 0.2s ease", cursor: "default" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${kpi.color}15, 0 4px 12px rgba(0,0,0,0.05)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      (e.currentTarget as HTMLElement).style.boxShadow = "";
                    }}
                  >
                    <div
                      className="rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "52px", height: "52px",
                        background: kpi.bg,
                        border: `1px solid ${kpi.border}`,
                        color: kpi.color,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {kpi.icon}
                    </div>
                    <div>
                      <div className="stat-value" style={{ color: kpi.color }}>{value.toLocaleString("en")}</div>
                      <div className="stat-label">{kpi.label}</div>
                      <div className="text-caption" style={{ color: "var(--n-300)" }}>{kpi.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analytics Row */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>

            {/* Blood Type Distribution */}
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
                <div className="text-h4" style={{ color: "var(--n-800)" }}>توزيع فصائل الدم</div>
                <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>Blood Type Distribution</div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(BLOOD_COUNTS).map(([bt, count]) => (
                    <div
                      key={bt}
                      className="rounded-2xl text-center py-4"
                      style={{
                        background: `${BLOOD_COLORS[bt] ?? "var(--n-200)"}12`,
                        border: `1px solid ${BLOOD_COLORS[bt] ?? "var(--n-200)"}25`,
                        transition: "all 0.15s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
                    >
                      <div className="font-black font-mono leading-none mb-1" style={{ fontSize: "20px", color: BLOOD_COLORS[bt] ?? "var(--n-600)" }}>
                        {bt}
                      </div>
                      <div className="font-bold" style={{ fontSize: "17px", color: "var(--n-800)" }}>{count}</div>
                      <div className="text-caption" style={{ color: "var(--n-400)" }}>
                        {Math.round((count / patients.length) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* City Distribution */}
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
                <div className="text-h4" style={{ color: "var(--n-800)" }}>التوزيع الجغرافي</div>
                <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>Geographic Distribution by City</div>
              </div>
              <div className="p-5 space-y-3">
                {topCities.map(([city, count], idx) => {
                  const pct = Math.round((count / patients.length) * 100);
                  const colors = ["var(--sanad-blue)", "var(--success-500)", "var(--warning-500)", "var(--critical-500)", "var(--info-500)", "var(--brand-700)"];
                  const color = colors[idx] ?? "var(--n-400)";
                  return (
                    <div key={city}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                          <span className="text-small font-medium" style={{ color: "var(--n-700)" }}>{city}</span>
                        </div>
                        <span className="font-mono text-small font-semibold" style={{ color: "var(--n-500)" }}>
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Health Metrics */}
          <div>
            <div className="text-label mb-4">صحة النظام — System Health</div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {[
                { label: "Uptime", value: "99.97%", sub: "آخر 30 يوم", icon: "↑" },
                { label: "API Latency", value: "<200ms", sub: "متوسط الاستجابة", icon: "⚡" },
                { label: "Data Sync", value: "Real-time", sub: "التزامن مع المنشآت", icon: "⟳" },
                { label: "Security", value: "NCA A+", sub: "تصنيف الأمان", icon: "🛡" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">{item.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div className="rounded-full" style={{ width: "6px", height: "6px", background: "var(--success-500)", boxShadow: "0 0 6px var(--success-500)" }} />
                    </div>
                  </div>
                  <div className="font-black font-mono" style={{ fontSize: "18px", color: "var(--sanad-blue)" }}>{item.value}</div>
                  <div className="text-caption mt-1" style={{ color: "var(--n-400)" }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Registry */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-h3" style={{ color: "var(--n-800)" }}>سجل المرضى الوطني</div>
                <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>
                  National Patient Registry · {patients.length} مريض مسجل
                </div>
              </div>
              <span className="badge badge-brand">بيانات تجريبية — MVP</span>
            </div>

            <div className="glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th><th>الاسم</th><th>رقم الهوية</th>
                    <th>فصيلة الدم</th><th>المدينة</th><th>الجنس</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 25).map((p, idx) => (
                    <tr key={p.id}>
                      <td>
                        <span className="font-mono text-small" style={{ color: "var(--n-300)" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="font-semibold">{p.nameAr}</td>
                      <td>
                        <span className="font-mono text-small" style={{ color: "var(--n-500)", letterSpacing: "0.5px" }}>
                          {p.nationalId}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{
                          background: `${BLOOD_COLORS[p.bloodType] ?? "var(--critical-500)"}20`,
                          color: BLOOD_COLORS[p.bloodType] ?? "var(--critical-600)",
                          border: `1px solid ${BLOOD_COLORS[p.bloodType] ?? "var(--critical-500)"}35`,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 800,
                        }}>
                          {p.bloodType}
                        </span>
                      </td>
                      <td><span className="text-small">{p.city}</span></td>
                      <td>
                        <span className="badge badge-neutral">
                          {p.gender === "male" ? "ذكر" : "أنثى"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {patients.length > 25 && (
                <div className="px-5 py-3 text-center text-small" style={{ color: "var(--n-400)", borderTop: "1px solid var(--n-100)" }}>
                  يُعرض 25 من أصل {patients.length} مريض في قاعدة البيانات
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuditFooter context="National" userId="GOV-ADMIN-001" />
    </div>
  );
}
