interface PriorityStripProps {
  message: string;
  level: "critical" | "warning" | "info";
  detail?: string;
}

export default function PriorityStrip({ message, level, detail }: PriorityStripProps) {
  const icon =
    level === "critical" ? (
      <svg viewBox="0 0 16 16" fill="none" width={15} height={15}>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 4.5v4M8 10.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ) : level === "warning" ? (
      <svg viewBox="0 0 16 16" fill="none" width={15} height={15}>
        <path d="M8 1.5L14.5 14H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ) : (
      <svg viewBox="0 0 16 16" fill="none" width={15} height={15}>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 7v5M8 4.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );

  return (
    <div className={`priority-strip priority-strip-${level}`}>
      <span className="opacity-90">{icon}</span>
      <span>{message}</span>
      {detail && (
        <>
          <span className="opacity-40 mx-1">|</span>
          <span className="opacity-75 font-normal">{detail}</span>
        </>
      )}
    </div>
  );
}
