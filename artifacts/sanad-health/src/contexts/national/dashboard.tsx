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

function KpiIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    patients: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    hospitals: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <rect x="2" y="6" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M6 16V11h6v5M9 2v4M2 9h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    records: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <path d="M3 2h9l4 4v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M12 2v5h4M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <path d="M9 1.5L2.5 4.5v4c0 3.7 2.8 7.1 6.5 8 3.7-.9 6.5-4.3 6.5-8v-4L9 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    ambulance: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <rect x="1" y="5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M13 8h2l2 3v2h-4V8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="4.5" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="12.5" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 9V7M4 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    doctors: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M13.5 10v3M12 11.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  };
  return <>{icons[type]}</>;
}

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
        store.setError(e instanceof Error ? e.message : "خطأ");
      } finally {
        store.setLoading(false);
      }
    })();
  }, []);

  const stats = store.stats as SystemStats | null;
  const patients = store.patients as PatientRow[];

  const KPI = stats ? [
    {
      label: "إجمالي المرضى",
      sub: "Total Patients",
      value: stats.totalPatients.toLocaleString("en"),
      icon: "patients",
      color: "var(--brand-600)",
      bg: "var(--brand-50)",
    },
    {
      label: "المنشآت الصحية",
      sub: "Facilities",
      value: stats.totalHospitals.toLocaleString("en"),
      icon: "hospitals",
      color: "var(--info-600)",
      bg: "var(--info-50)",
    },
    {
      label: "السجلات الطبية",
      sub: "Medical Records",
      value: stats.totalMedicalRecords.toLocaleString("en"),
      icon: "records",
      color: "var(--success-600)",
      bg: "var(--success-50)",
    },
    {
      label: "تعارضات دوائية منعت",
      sub: "Drug Interactions Prevented",
      value: stats.drugInteractionsPrevented.toLocaleString("en"),
      icon: "shield",
      color: "var(--critical-600)",
      bg: "var(--critical-50)",
    },
    {
      label: "استجابات طوارئ",
      sub: "Emergency Responses",
      value: stats.emergencyResponsesThisMonth.toLocaleString("en"),
      icon: "ambulance",
      color: "var(--warning-600)",
      bg: "var(--warning-50)",
    },
    {
      label: "أطباء نشطون",
      sub: "Active Physicians",
      value: stats.activePhysicians.toLocaleString("en"),
      icon: "doctors",
      color: "var(--brand-700)",
      bg: "var(--brand-100)",
    },
  ] : [];

  const BLOOD_COUNTS = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.bloodType] = (acc[p.bloodType] ?? 0) + 1;
    return acc;
  }, {});

  const CITY_COUNTS = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.city] = (acc[p.city] ?? 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(CITY_COUNTS)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
        style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--n-150)" }}
      >
        <div>
          <div className="text-h2" style={{ color: "var(--n-900)" }}>لوحة التحكم الوطنية</div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            National Operations Center · مراقبة المنظومة الصحية
          </div>
        </div>
        <div className="flex items-center gap-2">
          {["NCA Compliant", "HL7 FHIR R4", "SDAIA Connected", "STC Cloud"].map((tag) => (
            <span key={tag} className="badge badge-neutral">{tag}</span>
          ))}
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل بيانات المنظومة..." />}

      {!store.loading && stats && (
        <div className="flex-1 p-6 space-y-7">

          {/* KPI Grid */}
          <div>
            <div className="text-label mb-4">المؤشرات الرئيسية للأداء — Key Performance Indicators</div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {KPI.map((kpi) => (
                <div key={kpi.label} className="stat-card flex items-center gap-4">
                  <div
                    className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: "46px", height: "46px", background: kpi.bg, color: kpi.color }}
                  >
                    <KpiIcon type={kpi.icon} />
                  </div>
                  <div>
                    <div className="stat-value" style={{ color: kpi.color }}>{kpi.value}</div>
                    <div className="stat-label">{kpi.label}</div>
                    <div className="text-caption" style={{ color: "var(--n-300)" }}>{kpi.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Row */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {/* Blood Type Distribution */}
            <div className="card rounded-xl overflow-hidden">
              <div
                className="px-5 py-4"
                style={{ borderBottom: "1px solid var(--card-border)" }}
              >
                <div className="text-h4" style={{ color: "var(--n-800)" }}>توزيع فصائل الدم</div>
                <div className="text-caption" style={{ color: "var(--n-400)" }}>Blood Type Distribution</div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(BLOOD_COUNTS).map(([bt, count]) => (
                    <div
                      key={bt}
                      className="rounded-lg text-center py-3"
                      style={{ background: "var(--n-50)", border: "1px solid var(--n-150)" }}
                    >
                      <div
                        className="font-black font-mono leading-none mb-1"
                        style={{ fontSize: "18px", color: "var(--critical-600)" }}
                      >
                        {bt}
                      </div>
                      <div className="font-bold" style={{ fontSize: "16px", color: "var(--n-800)" }}>
                        {count}
                      </div>
                      <div className="text-caption" style={{ color: "var(--n-400)" }}>
                        {Math.round((count / patients.length) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* City Distribution */}
            <div className="card rounded-xl overflow-hidden">
              <div
                className="px-5 py-4"
                style={{ borderBottom: "1px solid var(--card-border)" }}
              >
                <div className="text-h4" style={{ color: "var(--n-800)" }}>التوزيع الجغرافي</div>
                <div className="text-caption" style={{ color: "var(--n-400)" }}>Geographic Distribution</div>
              </div>
              <div className="p-5 space-y-3">
                {topCities.map(([city, count]) => {
                  const pct = Math.round((count / patients.length) * 100);
                  return (
                    <div key={city}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-small font-medium" style={{ color: "var(--n-700)" }}>{city}</span>
                        <span className="font-mono text-small" style={{ color: "var(--n-400)" }}>
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: "var(--brand-500)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { label: "Uptime", value: "99.97%", sub: "آخر 30 يوم", ok: true },
              { label: "API Latency", value: "<200ms", sub: "متوسط الاستجابة", ok: true },
              { label: "Data Sync", value: "Real-time", sub: "التزامن مع المنشآت", ok: true },
              { label: "Security", value: "NCA A+", sub: "تصنيف الأمان", ok: true },
            ].map((item) => (
              <div key={item.label} className="card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label">{item.label}</span>
                  <div
                    className="rounded-full"
                    style={{ width: "6px", height: "6px", background: "var(--success-500)" }}
                  />
                </div>
                <div className="font-black font-mono" style={{ fontSize: "18px", color: "var(--n-900)" }}>
                  {item.value}
                </div>
                <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Patient Registry */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-h3" style={{ color: "var(--n-800)" }}>سجل المرضى الوطني</div>
                <div className="text-caption" style={{ color: "var(--n-400)" }}>
                  National Patient Registry · {patients.length} مريض مسجل
                </div>
              </div>
              <span className="badge badge-neutral">بيانات تجريبية</span>
            </div>

            <div className="card rounded-xl overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>رقم الهوية</th>
                    <th>فصيلة الدم</th>
                    <th>المدينة</th>
                    <th>الجنس</th>
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
                        <span className="font-mono text-small" style={{ color: "var(--n-500)" }}>
                          {p.nationalId}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-critical-solid" style={{ fontFamily: "var(--font-mono)" }}>
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
                <div
                  className="px-5 py-3 text-center text-small"
                  style={{ color: "var(--n-400)", borderTop: "1px solid var(--n-100)" }}
                >
                  يُعرض 25 من أصل {patients.length} مريض
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
