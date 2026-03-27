import type { EmergencyData } from "../../lib/state/emergency.store";

interface Props {
  data: EmergencyData;
  responseTimeMs: number | null;
}

export default function EmergencyCard({ data, responseTimeMs }: Props) {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Identity Block */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(0, 25, 60, 0.88)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.20)",
        }}
      >
        {/* Header bar */}
        <div
          className="px-6 py-3 flex items-center gap-3"
          style={{
            background: "rgba(220, 38, 38, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" width={13} height={13}>
            <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.3"/>
            <path d="M8 1.5v13M1.5 8h13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ color: "white", fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase" }}>
            Critical Patient Data · بيانات حرجة
          </span>
          {responseTimeMs !== null && (
            <span
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                marginRight: "auto",
                background: "rgba(255,255,255,0.10)",
                padding: "2px 8px",
                borderRadius: "99px",
              }}
            >
              {responseTimeMs}ms
            </span>
          )}
        </div>

        {/* Patient info */}
        <div className="px-6 py-5 flex items-center justify-between gap-6">
          <div>
            <div className="text-caption mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              اسم المريض / Patient Name
            </div>
            <div style={{ fontSize: "30px", fontWeight: 900, color: "white", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              {data.nameAr}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              marginTop: "8px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "2px",
            }}>
              {data.nationalId}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "90px",
              height: "90px",
              background: "rgba(220, 38, 38, 0.80)",
              border: "1.5px solid rgba(239, 68, 68, 0.50)",
              borderRadius: "28px",
              boxShadow: "0 8px 24px rgba(220, 38, 38, 0.35)",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: "2px" }}>
              فصيلة الدم
            </div>
            <div style={{ fontSize: "36px", color: "white", fontWeight: 900, lineHeight: 1, letterSpacing: "-1px" }}>
              {data.bloodType}
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Allergies */}
        <div className="glass-card p-5" style={{ borderRight: "3px solid var(--critical-500)" }}>
          <div className="flex items-center gap-2 mb-3" style={{ borderBottom: "1px solid rgba(239,68,68,0.12)", paddingBottom: "10px" }}>
            <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
              <path d="M7 1L13 12H1L7 1z" stroke="var(--critical-600)" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(220,38,38,0.08)"/>
              <path d="M7 5.5v3M7 10v.5" stroke="var(--critical-600)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-h4" style={{ color: "var(--critical-700)" }}>تحسس مفرط</span>
            <span
              style={{
                marginRight: "auto",
                background: "rgba(220,38,38,0.09)",
                color: "var(--critical-600)",
                border: "1px solid rgba(220,38,38,0.18)",
                padding: "2px 8px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {data.allergies.length}
            </span>
          </div>
          {data.allergies.length > 0 ? (
            <div className="space-y-2">
              {data.allergies.map((a) => (
                <div key={a} className="flex items-center gap-2" style={{ color: "var(--critical-700)", fontSize: "13px", fontWeight: 600 }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--critical-500)", flexShrink: 0 }} />
                  {a}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-small" style={{ color: "var(--critical-400)" }}>لا يوجد تحسس مسجل</div>
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="glass-card p-5" style={{ borderRight: "3px solid var(--sanad-blue)" }}>
          <div className="flex items-center gap-2 mb-3" style={{ borderBottom: "1px solid rgba(0,51,255,0.10)", paddingBottom: "10px" }}>
            <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
              <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="var(--sanad-blue)" strokeWidth="1.2" fill="rgba(0,51,255,0.06)"/>
              <path d="M7 4v6M4 7h6" stroke="var(--sanad-blue)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-h4" style={{ color: "var(--n-700)" }}>الأمراض المزمنة</span>
            <span
              style={{
                marginRight: "auto",
                background: "rgba(0,51,255,0.08)",
                color: "var(--sanad-blue)",
                border: "1px solid rgba(0,51,255,0.16)",
                padding: "2px 8px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {data.chronicConditions.length}
            </span>
          </div>
          {data.chronicConditions.length > 0 ? (
            <div className="space-y-2">
              {data.chronicConditions.map((c) => (
                <div key={c} className="flex items-center gap-2" style={{ color: "var(--n-600)", fontSize: "13px", fontWeight: 600 }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--sanad-blue)", flexShrink: 0 }} />
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-small" style={{ color: "var(--n-400)" }}>لا توجد أمراض مزمنة مسجلة</div>
          )}
        </div>
      </div>

      {/* Current Medications */}
      {data.currentMedications.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
            <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
              <ellipse cx="7" cy="7" rx="5.5" ry="3" transform="rotate(-45 7 7)" stroke="var(--n-500)" strokeWidth="1.2" fill="rgba(0,51,255,0.06)"/>
              <path d="M3.9 10.1L10.1 3.9" stroke="rgba(0,51,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="text-h4" style={{ color: "var(--n-700)" }}>الأدوية الحالية</span>
            <span
              style={{
                marginRight: "auto",
                background: "rgba(51,65,85,0.08)",
                color: "var(--n-500)",
                border: "1px solid rgba(51,65,85,0.15)",
                padding: "2px 8px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {data.currentMedications.length}
            </span>
          </div>
          <div>
            {data.currentMedications.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3"
                style={{
                  borderBottom: i < data.currentMedications.length - 1 ? "1px solid rgba(203,213,239,0.4)" : "none",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "10px",
                    background: "rgba(0,51,255,0.07)",
                    border: "1px solid rgba(0,51,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 10 10" fill="none" width={10} height={10}>
                    <circle cx="5" cy="5" r="4" stroke="var(--sanad-blue)" strokeWidth="1"/>
                    <path d="M5 2.5v5M2.5 5h5" stroke="var(--sanad-blue)" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-small font-medium" style={{ color: "var(--n-700)" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
          <svg viewBox="0 0 14 14" fill="none" width={13} height={13}>
            <path
              d="M13 10.5c0 .55-.12 1.09-.35 1.62-.23.53-.55.98-.97 1.35-.68.6-1.41.9-2.19.9-.28 0-.58-.03-.9-.09a9.68 9.68 0 0 1-3.38-1.52 9.57 9.57 0 0 1-2.36-2.36A9.68 9.68 0 0 1 1.33 7.1a5.78 5.78 0 0 1-.09-.93C1.24 5.4 1.54 4.68 2.12 4c.35-.4.8-.6 1.25-.6.18 0 .36.04.52.12.17.08.32.2.44.38L5.59 5.5a1.32 1.32 0 0 1 0 1.31L5.07 7.6a.12.12 0 0 0 .02.14c.32.62.76 1.2 1.32 1.75.55.56 1.13 1 1.75 1.33.07.04.15.02.18-.05l.7-.96c.12-.17.27-.3.44-.38.17-.09.35-.13.52-.13.24 0 .5.07.76.22l1.65 1.2c.18.12.3.27.38.44.07.17.11.35.11.54z"
              stroke="var(--success-600)"
              strokeWidth="1"
              strokeLinejoin="round"
              fill="rgba(5,150,105,0.08)"
            />
          </svg>
          <span className="text-h4" style={{ color: "var(--n-700)" }}>جهات الطوارئ</span>
        </div>
        <div>
          {data.emergencyContacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5"
              style={{
                borderBottom: i < data.emergencyContacts.length - 1 ? "1px solid rgba(203,213,239,0.4)" : "none",
              }}
            >
              <div>
                <div className="text-small font-semibold" style={{ color: "var(--n-800)" }}>{c.name}</div>
                <div className="text-caption" style={{ color: "var(--n-400)" }}>{c.relation}</div>
              </div>
              <a
                href={`tel:${c.phone}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "var(--success-600)",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                  background: "rgba(5,150,105,0.08)",
                  padding: "6px 12px",
                  borderRadius: "99px",
                  border: "1px solid rgba(5,150,105,0.18)",
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
        <div
          className="rounded-3xl px-5 py-4"
          style={{
            background: "rgba(255, 241, 242, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(254, 205, 211, 0.8)",
            borderRight: "3px solid var(--critical-500)",
          }}
        >
          <div className="text-caption mb-2" style={{ color: "var(--critical-600)", letterSpacing: "0.8px", textTransform: "uppercase" }}>
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
