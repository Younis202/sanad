import { useEffect } from "react";
import { useNationalStore } from "../../lib/state/national.store";
import { api } from "../../lib/api/client";
import AuditFooter from "../../components/system/AuditFooter";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

interface SystemStats {
  totalPatients: number;
  totalHospitals: number;
  totalMedicalRecords: number;
  drugInteractionsPrevented: number;
  emergencyResponsesThisMonth: number;
  activePhysicians: number;
}

interface PatientRow {
  id: number;
  nationalId: string;
  nameAr: string;
  bloodType: string;
  city: string;
  gender: string;
}

export default function NationalDashboard() {
  const store = useNationalStore();

  async function load() {
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
  }

  useEffect(() => { load(); }, []);

  const stats = store.stats as SystemStats | null;
  const patients = store.patients as PatientRow[];

  const KPI = stats
    ? [
        { label: "إجمالي المرضى المسجلين", value: stats.totalPatients.toLocaleString("ar-SA"), icon: "👥", color: "var(--sanad-teal)" },
        { label: "المنشآت الصحية المرتبطة", value: stats.totalHospitals.toLocaleString("ar-SA"), icon: "🏥", color: "var(--color-info)" },
        { label: "السجلات الطبية الموحدة", value: stats.totalMedicalRecords.toLocaleString("ar-SA"), icon: "📋", color: "var(--color-success)" },
        { label: "تعارضات دوائية منعت", value: stats.drugInteractionsPrevented.toLocaleString("ar-SA"), icon: "🛡️", color: "var(--color-critical)" },
        { label: "استجابات طوارئ هذا الشهر", value: stats.emergencyResponsesThisMonth.toLocaleString("ar-SA"), icon: "🚑", color: "var(--color-warning)" },
        { label: "الأطباء النشطون", value: stats.activePhysicians.toLocaleString("ar-SA"), icon: "👨‍⚕️", color: "var(--sanad-teal-dark)" },
      ]
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900 flex items-center gap-2">
            <span>🇸🇦</span> لوحة التحكم الوطنية
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            نظرة شاملة على المنظومة الصحية الوطنية — للمسؤولين فقط
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-neutral text-[10px]">NCA Compliant</span>
          <span className="badge badge-success text-[10px]">HL7 FHIR R4</span>
          <span className="badge badge-info text-[10px]">SDAIA Connected</span>
        </div>
      </div>

      {store.loading && <LoadingSpinner label="جاري تحميل بيانات المنظومة الوطنية..." />}

      {!store.loading && stats && (
        <div className="flex-1 p-6 space-y-8">
          {/* KPI Grid */}
          <div>
            <h2 className="font-bold text-neutral-700 mb-4 text-sm uppercase tracking-wide">
              المؤشرات الرئيسية للأداء — KPIs
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {KPI.map((kpi, i) => (
                <div key={i} className="sanad-card p-5 rounded-2xl flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${kpi.color}15` }}
                  >
                    {kpi.icon}
                  </div>
                  <div>
                    <div
                      className="text-3xl font-black leading-none"
                      style={{ color: kpi.color }}
                    >
                      {kpi.value}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">{kpi.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-3 gap-4">
            <div className="sanad-card-success p-5 rounded-2xl text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-green-800">النظام يعمل بكفاءة</div>
              <div className="text-xs text-green-600 mt-1">وقت التشغيل: 99.97%</div>
            </div>
            <div className="sanad-card-info p-5 rounded-2xl text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-bold text-blue-800">الأمن السيبراني</div>
              <div className="text-xs text-blue-600 mt-1">معايير NCA مطبقة بالكامل</div>
            </div>
            <div className="sanad-card p-5 rounded-2xl text-center">
              <div className="text-3xl mb-2">☁️</div>
              <div className="font-bold text-neutral-800">استضافة سيادية</div>
              <div className="text-xs text-neutral-500 mt-1">STC Cloud — داخل المملكة</div>
            </div>
          </div>

          {/* Patients Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-neutral-700 text-sm uppercase tracking-wide">
                قاعدة بيانات المرضى ({patients.length} مريض)
              </h2>
              <span className="badge badge-info text-[10px]">بيانات تجريبية</span>
            </div>
            <div className="sanad-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-600">الاسم</th>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-600">رقم الهوية</th>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-600">فصيلة الدم</th>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-600">المدينة</th>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-600">الجنس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {patients.slice(0, 20).map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-25 transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-800">{p.nameAr}</td>
                      <td className="px-4 py-3 font-mono text-neutral-500 text-xs">{p.nationalId}</td>
                      <td className="px-4 py-3">
                        <span className="badge badge-critical text-[10px]">{p.bloodType}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{p.city}</td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        {p.gender === "male" ? "ذكر" : "أنثى"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <AuditFooter context="National" userId="admin-001" />
    </div>
  );
}
