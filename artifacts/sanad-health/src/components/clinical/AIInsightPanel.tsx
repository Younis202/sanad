interface AiPrediction {
  conditionAr: string;
  probability: number;
  severity: string;
  actionRequiredAr: string;
  timeframe: string;
}

export default function AIInsightPanel({
  predictions,
}: {
  predictions: AiPrediction[];
}) {
  if (!predictions.length) return null;

  const severityConfig: Record<string, { bar: string; badge: string; label: string }> = {
    high:   { bar: "var(--critical-500)", badge: "badge-critical", label: "خطر مرتفع"   },
    medium: { bar: "var(--warning-500)",  badge: "badge-warning",  label: "خطر متوسط"   },
    low:    { bar: "var(--success-500)",  badge: "badge-success",  label: "خطر منخفض"   },
  };

  return (
    <div className="card">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        <div>
          <div className="text-h4" style={{ color: "var(--n-900)" }}>
            تحليل المخاطر الاستباقي
          </div>
          <div className="text-small mt-0.5" style={{ color: "var(--n-400)" }}>
            Sanad AI Engine · Predictive Risk Analysis
          </div>
        </div>
        <span className="badge badge-brand">
          <svg viewBox="0 0 12 12" fill="none" width={10} height={10}>
            <path
              d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4.5H4.5L6 1z"
              fill="currentColor"
            />
          </svg>
          AI
        </span>
      </div>

      {/* Predictions */}
      <div className="divide-y" style={{ borderColor: "var(--n-100)" }}>
        {predictions.map((p, i) => {
          const cfg = severityConfig[p.severity] ?? severityConfig.low;
          const pct = Math.round(p.probability * 100);
          return (
            <div key={i} className="px-5 py-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-sm" style={{ color: "var(--n-800)" }}>
                  {p.conditionAr}
                </div>
                <span className={`badge ${cfg.badge} flex-shrink-0`}>{cfg.label}</span>
              </div>

              {/* Probability bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-caption" style={{ color: "var(--n-400)" }}>
                    احتمالية الإصابة
                  </span>
                  <span
                    className="text-mono font-semibold"
                    style={{ fontSize: "12px", color: cfg.bar }}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: cfg.bar }}
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-caption" style={{ color: "var(--n-400)" }}>
                    الإطار الزمني
                  </div>
                  <div className="text-small font-medium" style={{ color: "var(--n-700)" }}>
                    {p.timeframe}
                  </div>
                </div>
                <div
                  className="h-8"
                  style={{ width: "1px", background: "var(--n-150)" }}
                />
                <div className="flex-1">
                  <div className="text-caption" style={{ color: "var(--n-400)" }}>
                    الإجراء الموصى به
                  </div>
                  <div className="text-small font-medium" style={{ color: "var(--n-700)" }}>
                    {p.actionRequiredAr}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
