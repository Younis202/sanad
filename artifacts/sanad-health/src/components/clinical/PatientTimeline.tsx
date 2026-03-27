interface MedRecord {
  id: number;
  date: string;
  hospitalAr: string;
  specialtyAr: string;
  diagnosisAr: string;
  doctorName: string;
  notes: string;
  type: string;
}

const TYPE_MAP: Record<string, { label: string; badge: string; accent: string }> = {
  emergency: { label: "طوارئ",  badge: "badge-critical", accent: "var(--critical-500)" },
  inpatient: { label: "تنويم",  badge: "badge-warning",  accent: "var(--warning-500)"  },
  outpatient:{ label: "عيادة",  badge: "badge-info",     accent: "var(--info-500)"     },
};

export default function PatientTimeline({ records }: { records: MedRecord[] }) {
  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!sorted.length) {
    return (
      <div
        className="card flex flex-col items-center justify-center py-16 text-center"
        style={{ color: "var(--n-400)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" width={32} height={32} className="mb-3">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 9h18M9 4v5M15 4v5M7 13h3M7 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div className="text-small font-medium">لا يوجد سجل طبي</div>
        <div className="text-caption mt-1">لم يتم رصد أي سجلات لهذا المريض</div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {sorted.map((rec, idx) => {
        const cfg = TYPE_MAP[rec.type] ?? TYPE_MAP.outpatient;
        return (
          <div
            key={rec.id}
            className="flex gap-5 group"
            style={{ paddingBottom: idx === sorted.length - 1 ? 0 : "2px" }}
          >
            {/* Timeline column */}
            <div className="flex flex-col items-center" style={{ width: "20px", flexShrink: 0 }}>
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width: "10px",
                  height: "10px",
                  background: cfg.accent,
                  border: "2px solid white",
                  boxShadow: `0 0 0 1px ${cfg.accent}`,
                  marginTop: "16px",
                  zIndex: 1,
                  flexShrink: 0,
                }}
              />
              {idx < sorted.length - 1 && (
                <div
                  className="flex-1 mt-1"
                  style={{ width: "1px", background: "var(--n-150)", minHeight: "24px" }}
                />
              )}
            </div>

            {/* Card */}
            <div
              className="card flex-1 mb-3 group-hover:shadow-md transition-shadow duration-150"
              style={{ overflow: "hidden" }}
            >
              <div className="flex items-start justify-between gap-4 px-4 pt-4 pb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-h4" style={{ color: "var(--n-900)" }}>
                      {rec.diagnosisAr}
                    </span>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <div className="text-small" style={{ color: "var(--n-500)" }}>
                    {rec.hospitalAr} · {rec.specialtyAr}
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <div
                    className="font-mono text-small font-medium"
                    style={{ color: "var(--n-700)" }}
                  >
                    {rec.date}
                  </div>
                  <div className="text-caption mt-0.5" style={{ color: "var(--n-400)" }}>
                    د. {rec.doctorName}
                  </div>
                </div>
              </div>
              {rec.notes && (
                <div
                  className="px-4 pb-4 text-small"
                  style={{ color: "var(--n-500)", borderTop: "1px solid var(--n-100)", paddingTop: "10px" }}
                >
                  {rec.notes}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
