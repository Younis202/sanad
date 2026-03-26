export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-10 h-10 rounded-full border-4 border-neutral-200"
        style={{
          borderTopColor: "var(--sanad-teal)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {label && <p className="text-sm text-neutral-500">{label}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
