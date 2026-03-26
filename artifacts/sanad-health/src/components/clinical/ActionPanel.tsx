interface ActionItem {
  label: string;
  description?: string;
  severity?: "critical" | "warning" | "info" | "success";
  onClick?: () => void;
}

export default function ActionPanel({ title, actions }: { title?: string; actions: ActionItem[] }) {
  const bgMap = {
    critical: "var(--color-critical)",
    warning: "var(--color-warning)",
    info: "var(--sanad-teal)",
    success: "var(--color-success)",
  };

  return (
    <div className="sanad-card p-5 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🎯</span>
        <h3 className="font-bold text-neutral-800 text-sm">{title ?? "الإجراءات الموصى بها"}</h3>
      </div>
      <div className="space-y-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="w-full text-right p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 bg-white hover:bg-neutral-50 transition-all duration-150 text-sm space-y-0.5"
          >
            <div className="flex items-center gap-2">
              {action.severity && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: bgMap[action.severity] }}
                />
              )}
              <span className="font-semibold text-neutral-800">{action.label}</span>
            </div>
            {action.description && (
              <p className="text-neutral-500 text-xs pr-4">{action.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
