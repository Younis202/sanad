export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="card-critical rounded-xl p-6 max-w-md mx-auto mt-12 animate-fade-in"
      style={{ textAlign: "center" }}
    >
      <div
        className="flex items-center justify-center mx-auto mb-4 rounded-full"
        style={{
          width: "40px",
          height: "40px",
          background: "var(--critical-100)",
          color: "var(--critical-600)",
        }}
      >
        <svg viewBox="0 0 16 16" fill="none" width={18} height={18}>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 4.5v4M8 10.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-h4 mb-1" style={{ color: "var(--critical-700)" }}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-danger btn-sm mt-4">
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
