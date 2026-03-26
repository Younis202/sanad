interface AiPrediction {
  conditionAr: string;
  probability: number;
  severity: string;
  actionRequiredAr: string;
  timeframe: string;
}

export default function AIInsightPanel({ predictions }: { predictions: AiPrediction[] }) {
  if (!predictions.length) return null;

  const severityColor: Record<string, string> = {
    high: "var(--color-critical)",
    medium: "var(--color-warning)",
    low: "var(--color-success)",
  };
  const severityLabel: Record<string, string> = { high: "عالي", medium: "متوسط", low: "منخفض" };

  return (
    <div className="sanad-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🧠</span>
        <h3 className="font-bold text-neutral-800 text-sm">تحليل سَنَد الذكي</h3>
        <span className="badge badge-info text-[10px] mr-auto">Sanad AI</span>
      </div>
      <div className="space-y-3">
        {predictions.map((p, i) => (
          <div key={i} className="rounded-xl p-3 border border-neutral-100 bg-neutral-50">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-semibold text-neutral-800 text-sm">{p.conditionAr}</span>
              <span
                className="badge text-[10px] whitespace-nowrap"
                style={{ background: severityColor[p.severity] ?? "#64748b", color: "white" }}
              >
                {severityLabel[p.severity] ?? p.severity}
              </span>
            </div>
            {/* Probability bar */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round(p.probability * 100)}%`,
                    background: severityColor[p.severity] ?? "var(--sanad-teal)",
                  }}
                />
              </div>
              <span className="text-xs font-mono text-neutral-500 w-10 text-left">
                {Math.round(p.probability * 100)}%
              </span>
            </div>
            <div className="text-xs text-neutral-500">⏱ {p.timeframe}</div>
            <div
              className="mt-2 text-xs px-2 py-1 rounded-lg font-medium"
              style={{ background: "var(--sanad-teal-light)", color: "var(--sanad-teal-dark)" }}
            >
              الإجراء: {p.actionRequiredAr}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
