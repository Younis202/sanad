import { Layout } from "@/components/layout";
import { useGetSystemStats } from "@workspace/api-client-react";
import { Users, Building2, FileText, ShieldCheck, Ambulance, Stethoscope, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Admin() {
  const { data, isLoading } = useGetSystemStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Activity className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "إجمالي المستفيدين",
      value: data.totalPatients.toLocaleString('en-US'),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      border: "border-blue-600/20"
    },
    {
      title: "المنشآت المربوطة",
      value: data.totalHospitals.toLocaleString('en-US'),
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
      border: "border-emerald-600/20"
    },
    {
      title: "السجلات الطبية",
      value: data.totalMedicalRecords.toLocaleString('en-US'),
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-600/10",
      border: "border-purple-600/20"
    },
    {
      title: "تعارضات دوائية مُنعت",
      value: data.drugInteractionsPrevented.toLocaleString('en-US'),
      icon: ShieldCheck,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20"
    },
    {
      title: "استجابات إسعاف (الشهر)",
      value: data.emergencyResponsesThisMonth.toLocaleString('en-US'),
      icon: Ambulance,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20"
    },
    {
      title: "الأطباء النشطين",
      value: data.activePhysicians.toLocaleString('en-US'),
      icon: Stethoscope,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20"
    }
  ];

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">إحصائيات المنظومة الوطنية</h1>
            <p className="text-muted-foreground">نظرة حية على أداء منصة سَنَد على مستوى المملكة</p>
          </div>
          <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            النظام يعمل بكفاءة عالية
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-3xl p-6 border ${stat.border} shadow-sm hover:shadow-lg transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-muted-foreground font-semibold mb-1">{stat.title}</h3>
                <div className="text-4xl font-display font-bold text-foreground" dir="ltr">
                  {stat.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">التوزيع الجغرافي للمنشآت المربوطة</h2>
          <div className="h-[400px] bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-dashed border-border">
            {/* Placeholder for an actual map */}
            <div className="text-center">
              <img src={`${import.meta.env.BASE_URL}images/saudi-vision.png`} alt="Map Placeholder" className="w-full h-full object-cover opacity-20 absolute inset-0 rounded-2xl pointer-events-none" />
              <Activity className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-semibold">خريطة التغطية المباشرة</p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
