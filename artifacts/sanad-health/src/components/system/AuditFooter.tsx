export default function AuditFooter({
  context,
  userId,
}: {
  context: string;
  userId?: string;
}) {
  const now = new Date().toLocaleString("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
    calendar: "gregory",
  });

  return (
    <footer
      className="flex items-center justify-between px-6 py-3 mt-auto"
      style={{
        borderTop: "1px solid var(--n-150)",
        background: "var(--n-50)",
        fontSize: "11px",
        color: "var(--n-400)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="font-bold"
          style={{ color: "var(--brand-600)", fontFamily: "var(--font-ui)" }}
        >
          SANAD
        </span>
        <span style={{ color: "var(--n-300)" }}>|</span>
        <span>المنظومة الصحية الوطنية</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono" style={{ letterSpacing: "0.3px" }}>
          CTX:{context}
        </span>
        {userId && (
          <span className="font-mono">USR:{userId}</span>
        )}
        <span className="font-mono">{now}</span>
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-full"
            style={{ width: "5px", height: "5px", background: "var(--success-500)" }}
          />
          <span>HL7 FHIR R4</span>
        </div>
      </div>
    </footer>
  );
}
