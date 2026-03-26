export default function AuditFooter({ context, userId }: { context: string; userId?: string }) {
  const now = new Date().toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 px-6 py-3 text-xs text-neutral-400 flex items-center justify-between mt-auto">
      <span>سَنَد — المنظومة الصحية الوطنية</span>
      <span className="flex items-center gap-4">
        <span>السياق: {context}</span>
        {userId && <span>المستخدم: {userId}</span>}
        <span>{now}</span>
      </span>
    </footer>
  );
}
