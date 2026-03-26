import { Layout } from "@/components/layout";
import { useGetCitizenDashboard } from "@workspace/api-client-react";
import { Activity, BellRing, Calendar, ChevronLeft, Download, ShieldAlert, TestTube2, HeartPulse } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function Citizen() {
  const nationalId = "1234567890"; // In real app, from auth session
  const { data, isLoading } = useGetCitizenDashboard(nationalId);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <HeartPulse className="w-12 h-12 text-primary animate-bounce" />
        </div>
      </Layout>
    );
  }

  if (!data) return null;

  const scoreData = [
    { name: "Score", value: data.healthScore },
    { name: "Remaining", value: 100 - data.healthScore }
  ];

  return (
    <Layout>
      <div className="max-w-md mx-auto sm:max-w-xl md:max-w-3xl space-y-6 pb-20">
        
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">مرحباً، {data.patient.nameAr.split(" ")[0]}</h1>
            <p className="text-muted-foreground text-sm">لوحة المؤشرات الصحية الخاصة بك</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
            {data.patient.nameAr.charAt(0)}
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white/90">المؤشر الصحي العام</h2>
              <div className="text-5xl font-display font-bold">
                {data.healthScore}<span className="text-2xl text-white/70">/100</span>
              </div>
              <p className="text-sm text-white/80 max-w-[200px]">
                مؤشر صحتك ممتاز بناءً على أحدث الفحوصات والزيارات.
              </p>
            </div>

            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    innerRadius={40}
                    outerRadius={55}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#ffffff" />
                    <Cell fill="rgba(255,255,255,0.2)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Alerts from Sanad AI */}
        {data.aiAlerts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                تنبيهات سَنَد الذكية
              </h3>
            </div>
            
            {data.aiAlerts.map((alert, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  alert.severity === 'high' ? 'bg-destructive/10 text-destructive' : 
                  alert.severity === 'medium' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{alert.conditionAr}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    احتمالية {alert.probability}% خلال {alert.timeframe === '6 months' ? '٦ أشهر' : alert.timeframe}
                  </p>
                  <div className="inline-block bg-muted px-3 py-1 rounded-lg text-xs font-semibold">
                    الإجراء المطلوب: {alert.actionRequiredAr}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">البطاقة الصحية</span>
          </button>
          <button className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">حجز موعد</span>
          </button>
        </div>

        {/* Recent Lab Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <TestTube2 className="w-5 h-5 text-primary" /> أحدث الفحوصات
            </h3>
            <button className="text-primary text-sm font-semibold hover:underline">عرض الكل</button>
          </div>
          
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {data.labResults.slice(0, 3).map((lab, i) => (
              <div key={lab.id} className={`p-4 flex items-center justify-between ${i !== 0 ? 'border-t border-border' : ''}`}>
                <div>
                  <div className="font-bold mb-1">{lab.testNameAr}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(lab.date), 'yyyy/MM/dd')} • {lab.hospital}</div>
                </div>
                <div className="text-left" dir="ltr">
                  <div className={`font-bold text-lg ${lab.status === 'normal' ? 'text-success' : 'text-warning'}`}>
                    {lab.value} <span className="text-sm font-normal text-muted-foreground">{lab.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
