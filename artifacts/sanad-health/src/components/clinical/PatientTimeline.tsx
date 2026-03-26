interface Record {
  id: number;
  date: string;
  hospitalAr: string;
  specialtyAr: string;
  diagnosisAr: string;
  doctorName: string;
  notes: string;
  type: string;
}

export default function PatientTimeline({ records }: { records: Record[] }) {
  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const typeStyle: Record<string, { bg: string; label: string; dot: string }> = {
    emergency: { bg: "sanad-card-critical", label: "طوارئ", dot: "var(--color-critical)" },
    inpatient:  { bg: "sanad-card-warning",  label: "تنويم",  dot: "var(--color-warning)"  },
    outpatient: { bg: "sanad-card",           label: "عيادة",  dot: "var(--sanad-teal)"     },
  };

  if (!sorted.length) {
    return (
      <div className="text-center py-12 text-neutral-400 text-sm">
        لا يوجد سجل طبي متاح
      </div>
    );
  }

  return (
    <div className="relative space-y-4 pr-6">
      {/* Timeline spine */}
      <div
        className="absolute top-0 bottom-0 right-2.5 w-0.5"
        style={{ background: "var(--neutral-200)" }}
      />

      {sorted.map((rec) => {
        const style = typeStyle[rec.type] ?? typeStyle.outpatient;
        return (
          <div key={rec.id} className="flex gap-4 items-start relative">
            {/* dot */}
            <div
              className="absolute -right-3.5 top-4 w-3 h-3 rounded-full border-2 border-white flex-shrink-0 z-10"
              style={{ background: style.dot }}
            />

            <div className={`${style.bg} p-4 rounded-xl flex-1 space-y-2 border border-neutral-100`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="font-bold text-neutral-800 text-sm">{rec.diagnosisAr}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {rec.hospitalAr} — {rec.specialtyAr}
                  </div>
                </div>
                <div className="text-left flex-shrink-0 space-y-1">
                  <div className="text-xs font-mono text-neutral-500">{rec.date}</div>
                  <span
                    className="badge text-[10px]"
                    style={{
                      background: style.dot,
                      color: "white",
                      display: "inline-flex",
                    }}
                  >
                    {style.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>👨‍⚕️ {rec.doctorName}</span>
              </div>

              {rec.notes && (
                <p className="text-xs text-neutral-600 border-t border-neutral-100 pt-2">
                  {rec.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
