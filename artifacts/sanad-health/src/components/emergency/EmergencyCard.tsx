import type { EmergencyData } from "../../lib/state/emergency.store";

interface Props {
  data: EmergencyData;
  responseTimeMs: number | null;
}

export default function EmergencyCard({ data, responseTimeMs }: Props) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Identity Block */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--n-900)",
          border: "1px solid var(--n-800)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{
            background: "var(--critical-600)",
            borderBottom: "1px solid var(--critical-700)",
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
            <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.3"/>
            <path d="M8 1.5v13M1.5 8h13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span
            className="font-semibold"
            style={{ color: "white", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}
          >
            Critical Patient Data · بيانات حرجة
          </span>
          {responseTimeMs !== null && (
            <span
              className="font-mono mr-auto"
              style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}
            >
              {responseTimeMs}ms
            </span>
          )}
        </div>

        <div className="px-6 py-5 flex items-center justify-between gap-6">
          <div>
            <div className="text-caption mb-1" style={{ color: "var(--n-400)" }}>
              اسم المريض / Patient Name
            </div>
            <div
              className="font-black"
              style={{ fontSize: "28px", color: "white", letterSpacing: "-0.5px" }}
            >
              {data.nameAr}
            </div>
            <div
              className="font-mono mt-1"
              style={{ fontSize: "13px", color: "var(--n-400)", letterSpacing: "1px" }}
            >
              {data.nationalId}
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center rounded-xl"
            style={{
              width: "96px",
              height: "80px",
              background: "var(--critical-600)",
              border: "1px solid var(--critical-500)",
            }}
          >
            <div className="text-caption mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              فصيلة الدم
            </div>
            <div
              className="font-black"
              style={{ fontSize: "32px", color: "white", lineHeight: 1, letterSpacing: "-1px" }}
            >
              {data.bloodType}
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Allergies */}
        <div className="card-critical rounded-xl p-4">
          <div
            className="flex items-center gap-2 mb-3"
            style={{ borderBottom: "1px solid var(--critical-200)", paddingBottom: "10px" }}
          >
            <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
              <path
                d="M7 1L13 12H1L7 1z"
                stroke="var(--critical-600)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M7 5.5v3M7 10v.5" stroke="var(--critical-600)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-h4" style={{ color: "var(--critical-700)" }}>
              تحسس مفرط
            </span>
            <span className="badge badge-critical mr-auto">{data.allergies.length}</span>
          </div>
          {data.allergies.length > 0 ? (
            <div className="space-y-1.5">
              {data.allergies.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--critical-700)" }}
                >
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{
                      width: "5px",
                      height: "5px",
                      background: "var(--critical-500)",
                    }}
                  />
                  {a}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-small" style={{ color: "var(--critical-400)" }}>
              لا يوجد تحسس مسجل
            </div>
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="card-info rounded-xl p-4">
          <div
            className="flex items-center gap-2 mb-3"
            style={{ borderBottom: "1px solid var(--info-200)", paddingBottom: "10px" }}
          >
            <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
              <path
                d="M7 1L7 13M4 4L10 4M3 8h8"
                stroke="var(--info-600)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="var(--info-600)" strokeWidth="1.2"/>
            </svg>
            <span className="text-h4" style={{ color: "var(--info-700)" }}>
              الأمراض المزمنة
            </span>
            <span className="badge badge-info mr-auto">{data.chronicConditions.length}</span>
          </div>
          {data.chronicConditions.length > 0 ? (
            <div className="space-y-1.5">
              {data.chronicConditions.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--info-700)" }}
                >
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{ width: "5px", height: "5px", background: "var(--info-500)" }}
                  />
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-small" style={{ color: "var(--info-400)" }}>
              لا توجد أمراض مزمنة مسجلة
            </div>
          )}
        </div>
      </div>

      {/* Current Medications */}
      {data.currentMedications.length > 0 && (
        <div className="card rounded-xl overflow-hidden">
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
              <rect
                x="1.5" y="4" width="7" height="9" rx="1"
                stroke="var(--n-500)" strokeWidth="1.2" transform="rotate(-45 7 7)"
              />
              <path d="M5 7l4 4" stroke="var(--n-300)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="text-h4" style={{ color: "var(--n-700)" }}>
              الأدوية الحالية
            </span>
            <span className="badge badge-neutral mr-auto">{data.currentMedications.length}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--n-100)" }}>
            {data.currentMedications.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3"
              >
                <div
                  className="rounded flex-shrink-0"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "var(--brand-50)",
                    border: "1px solid var(--brand-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg viewBox="0 0 10 10" fill="none" width={10} height={10}>
                    <circle cx="5" cy="5" r="4" stroke="var(--brand-600)" strokeWidth="1"/>
                    <path d="M5 2.5v5M2.5 5h5" stroke="var(--brand-600)" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-small font-medium" style={{ color: "var(--n-800)" }}>
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="card rounded-xl overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
            <path
              d="M13 10.5c0 .55-.12 1.09-.35 1.62-.23.53-.55.98-.97 1.35-.68.6-1.41.9-2.19.9-.28 0-.58-.03-.9-.09a9.68 9.68 0 0 1-3.38-1.52 9.57 9.57 0 0 1-2.36-2.36A9.68 9.68 0 0 1 1.33 7.1a5.78 5.78 0 0 1-.09-.93C1.24 5.4 1.54 4.68 2.12 4c.35-.4.8-.6 1.25-.6.18 0 .36.04.52.12.17.08.32.2.44.38L5.59 5.5a1.32 1.32 0 0 1 0 1.31L5.07 7.6a.12.12 0 0 0 .02.14c.32.62.76 1.2 1.32 1.75.55.56 1.13 1 1.75 1.33.07.04.15.02.18-.05l.7-.96c.12-.17.27-.3.44-.38.17-.09.35-.13.52-.13.24 0 .5.07.76.22l1.65 1.2c.18.12.3.27.38.44.07.17.11.35.11.54z"
              stroke="var(--success-600)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-h4" style={{ color: "var(--n-700)" }}>
            جهات الطوارئ
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--n-100)" }}>
          {data.emergencyContacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3"
            >
              <div>
                <div className="text-small font-semibold" style={{ color: "var(--n-800)" }}>
                  {c.name}
                </div>
                <div className="text-caption" style={{ color: "var(--n-400)" }}>
                  {c.relation}
                </div>
              </div>
              <a
                href={`tel:${c.phone}`}
                className="font-mono font-semibold"
                style={{
                  fontSize: "14px",
                  color: "var(--success-600)",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                }}
              >
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Notes */}
      {data.criticalNotes && (
        <div className="card-critical rounded-xl px-5 py-4">
          <div className="text-caption mb-2" style={{ color: "var(--critical-600)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            ملاحظات حرجة · Critical Notes
          </div>
          <p className="text-small font-semibold" style={{ color: "var(--critical-700)" }}>
            {data.criticalNotes}
          </p>
        </div>
      )}
    </div>
  );
}
