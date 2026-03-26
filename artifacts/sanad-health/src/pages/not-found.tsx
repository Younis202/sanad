import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله في منصة سَنَد.
        </p>
        <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
          العودة للرئيسة
        </Link>
      </div>
    </Layout>
  );
}
