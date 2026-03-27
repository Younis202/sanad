export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        style={{
          width: "28px",
          height: "28px",
          border: "2px solid var(--n-150)",
          borderTopColor: "var(--brand-500)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      {label && (
        <p className="text-small" style={{ color: "var(--n-400)" }}>
          {label}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
