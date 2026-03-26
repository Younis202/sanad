interface PriorityStripProps {
  message: string;
  level: "critical" | "warning" | "info";
  icon?: string;
}

export default function PriorityStrip({ message, level, icon }: PriorityStripProps) {
  const icons = { critical: "🚨", warning: "⚠️", info: "ℹ️" };
  return (
    <div className={`priority-strip priority-strip-${level}`}>
      <span className="text-lg">{icon ?? icons[level]}</span>
      <span>{message}</span>
    </div>
  );
}
