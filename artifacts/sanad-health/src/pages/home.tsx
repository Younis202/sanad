import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { Activity, ShieldAlert, Pill, FileText, ArrowLeft, HeartPulse, Stethoscope, Users } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: ShieldAlert,
      title: "استجابة الطوارئ",
      desc: "وصول فوري للتاريخ الطبي الحرج في لحظات الطوارئ لإنقاذ الأرواح.",
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      icon: Pill,
      title: "منع التعارض الدوائي",
      desc: "تحليل ذكي لوصفات الأدوية من مختلف المستشفيات لمنع التفاعلات الخطرة.",
      color: "text-warning",
      bg: "bg-warning/10"
    },
    {
      icon: FileText,
      title: "ملف طبي موحد",
      desc: "تاريخ صحي شامل يربط كافة المنشآت الطبية في المملكة في منصة واحدة.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: Activity,
      title: "الوقاية بالذكاء الاصطناعي",
      desc: "تنبؤ مبكر بالمخاطر الصحية بناءً على تحليلات متقدمة للسجل الطبي.",
      color: "text-success",
      bg: "bg-success/10"
    }
  ];

  const portals = [
    {
      title: "تطبيق المواطن",
      desc: "تابع صحتك، واطلع على تحذيرات الذكاء الاصطناعي ونتائج الفحوصات.",
      path: "/citizen",
      icon: HeartPulse,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "لوحة الطبيب",
      desc: "رؤية شاملة للتاريخ الطبي للمريض وكشف التعارضات الدوائية لحظياً.",
      path: "/physician",
      icon: Stethoscope,
      gradient: "from-blue-600 to-primary"
    },
    {
      title: "واجهة المسعف",
      desc: "بيانات حرجة لإنقاذ الحياة في ثوانٍ. فصيلة الدم، الحساسية، والأمراض.",
      path: "/emergency",
      icon: ShieldAlert,
      gradient: "from-red-600 to-rose-500"
    }
  ];

  return (
    <Layout>
      <div className="space-y-24 pb-16">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-secondary text-white shadow-2xl">
          <div className="absolute inset-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-medical.png`} 
              alt="Medical Technology Background" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />
          </div>
          
          <div className="relative z-10 px-8 py-24 sm:px-16 sm:py-32 lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                مبادرة رؤية 2030 للصحة الرقمية
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
                البنية التحتية الرقمية <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-blue-400">
                  للصحة الوطنية
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                سَنَد يربط كافة المنشآت الطبية لتوفير سجل صحي موحد لكل مواطن، لضمان جودة الرعاية، منع الأخطاء الطبية، والارتقاء بصحة المجتمع.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/citizen" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                  دخول المواطن
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link href="/physician" className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                  دخول الممارس الصحي
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Portals Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold">بوابات النظام</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              واجهات مخصصة تلبي احتياجات كافة المستفيدين من المنظومة الصحية.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((portal, i) => (
              <motion.div
                key={portal.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={portal.path} className="block h-full">
                  <div className="h-full bg-card rounded-3xl p-8 border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${portal.gradient} opacity-5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20`} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-6 shadow-lg text-white group-hover:scale-110 transition-transform`}>
                      <portal.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{portal.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {portal.desc}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      الدخول للواجهة
                      <ArrowLeft className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-50 dark:bg-slate-900/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-24 rounded-3xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-display font-bold">القيمة المضافة للمنظومة</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                كيف يعالج سَنَد التحديات الكبرى في القطاع الصحي السعودي.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feat, i) => (
                <div key={i} className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-4`}>
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
