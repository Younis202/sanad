export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="sanad-card-critical p-8 text-center space-y-4 rounded-2xl max-w-md mx-auto mt-12">
      <div className="text-4xl">⚠️</div>
      <p className="text-red-700 font-semibold">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "var(--color-critical)" }}
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
