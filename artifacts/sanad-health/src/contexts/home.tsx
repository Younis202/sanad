import { Link } from "wouter";

const PROBLEMS = [
  {
    icon: "🚑",
    title: "كارثة الطوارئ",
    desc: "عندما يقع حادث، يصل المصاب للطوارئ مجهولاً طبياً. يضيع وقت حرج في تخمين فصيلة الدم والحساسية.",
    severity: "critical",
  },
  {
    icon: "💊",
    title: "الأخطاء الدوائية",
    desc: "طبيب لا يرى ما وصفه طبيب آخر. أدوية تتعارض كيميائياً وتدمر كلى المريض.",
    severity: "warning",
  },
  {
    icon: "💸",
    title: "الهدر المالي الملياري",
    desc: "المريض يعيد نفس التحاليل في كل مستشفى لأنه لا يوجد سجل يربط النتائج. مليارات هدراً.",
    severity: "info",
  },
  {
    icon: "📊",
    title: "غياب الطب الوقائي",
    desc: "لا يوجد نظام يراقب صحة المواطن ليُنبهه باقتراب إصابته بالسكري قبل حدوثه.",
    severity: "neutral",
  },
];

const CONTEXTS = [
  {
    href: "/emergency",
    icon: "🚑",
    title: "واجهة المسعف",
    subtitle: "Emergency Mode",
    desc: "مسح الهوية وعرض البيانات الحرجة في أقل من ثانية واحدة. مُحمَّل على أجهزة الهلال الأحمر.",
    color: "var(--color-critical)",
    bg: "var(--color-critical-bg)",
    border: "var(--color-critical-border)",
  },
  {
    href: "/clinical/dashboard",
    icon: "🩺",
    title: "لوحة الطبيب السريرية",
    subtitle: "Physician Dashboard",
    desc: "السجل الطبي الموحد من كافة المستشفيات، كاشف التعارض الدوائي، وتحليل سَنَد الذكي.",
    color: "var(--sanad-teal)",
    bg: "var(--sanad-teal-light)",
    border: "#a5f3fc",
  },
  {
    href: "/citizen",
    icon: "❤️",
    title: "تطبيق المواطن",
    subtitle: "Citizen App",
    desc: "لوحة تحكم صحية شخصية، تنبيهات AI استباقية، وتصدير بطاقة صحية دولية مشفرة.",
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
    border: "var(--color-success-border)",
  },
  {
    href: "/national/dashboard",
    icon: "🇸🇦",
    title: "لوحة التحكم الوطنية",
    subtitle: "National Dashboard",
    desc: "رؤية شاملة على مستوى المملكة — KPIs، إحصائيات، وتقارير للمسؤولين.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
];

const TECH = [
  { label: "معيار الربط", value: "HL7 FHIR R4" },
  { label: "الاستضافة", value: "STC Cloud (KSA)" },
  { label: "التحقق", value: "نفاذ / Nafath" },
  { label: "الأمن السيبراني", value: "NCA Compliant" },
  { label: "الذكاء الاصطناعي", value: "Sanad AI Engine" },
  { label: "البنية", value: "Modular Monolith" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section
        className="relative px-8 py-20 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0c1a2e 0%, #0891b2 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            مبادرة رؤية 2030 للصحة الرقمية
          </div>
          <h1 className="text-6xl font-black leading-tight mb-4">
            <span
              className="block text-7xl"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              سَنَد
            </span>
            <span className="text-3xl font-bold opacity-90">
              البنية التحتية الرقمية للصحة الوطنية
            </span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed mb-10">
            نحوّل "الهوية الوطنية السعودية" إلى مفتاح مشفر يربط جميع السجلات الطبية
            في مكان واحد — لأن قرارات الحياة والموت تحتاج بيانات لحظية.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/emergency"
              className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
              style={{ background: "var(--color-critical)", color: "white" }}
            >
              🚑 واجهة الإسعاف
            </Link>
            <Link
              href="/clinical/dashboard"
              className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)", color: "white" }}
            >
              🩺 لوحة الطبيب
            </Link>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-neutral-900 mb-2">
              المشكلة التي نحلها
            </h2>
            <p className="text-neutral-500">القطاع الصحي السعودي — ميزانية 214 مليار ريال — يعاني من نزيف في البيانات والموارد</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {PROBLEMS.map((p, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl ${
                  p.severity === "critical" ? "sanad-card-critical" :
                  p.severity === "warning" ? "sanad-card-warning" :
                  p.severity === "info" ? "sanad-card-info" : "sanad-card"
                }`}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{p.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Contexts */}
      <section className="px-8 py-16" style={{ background: "var(--neutral-50)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-neutral-900 mb-2">أربعة سياقات — نظام واحد</h2>
            <p className="text-neutral-500">كل سياق مُصمَّم لمستخدم محدد بإمكانيات وصلاحيات مختلفة</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {CONTEXTS.map((ctx, i) => (
              <Link
                key={i}
                href={ctx.href}
                className="p-6 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 block"
                style={{ background: ctx.bg, borderColor: ctx.border }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${ctx.color}20` }}
                  >
                    {ctx.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-neutral-900">{ctx.title}</h3>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={{ background: `${ctx.color}20`, color: ctx.color }}
                      >
                        {ctx.subtitle}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">{ctx.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-neutral-900 mb-2">الهندسة التقنية السيادية</h2>
            <p className="text-neutral-500">مُصمَّم لتكون سيادية 100% — لقبول سدايا ووزارة الصحة</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {TECH.map((t, i) => (
              <div key={i} className="sanad-card p-5 rounded-2xl">
                <div className="text-xs text-neutral-400 mb-1">{t.label}</div>
                <div className="font-bold text-neutral-800">{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-6 text-center text-sm text-white"
        style={{ background: "#0c1a2e" }}
      >
        <div className="font-bold text-lg mb-1">سَنَد</div>
        <div className="opacity-60">المنظومة الصحية الوطنية السعودية — وثيقة سرية للمؤسسين</div>
      </footer>
    </div>
  );
}
