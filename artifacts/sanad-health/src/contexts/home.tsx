import { Link } from "wouter";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width={12} height={12}>
      <circle cx="7" cy="7" r="6" fill="var(--success-500)"/>
      <path d="M4.5 7l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const CONTEXTS = [
  {
    href: "/emergency",
    code: "CTX-01",
    title: "واجهة الإسعاف",
    en: "Emergency Interface",
    desc: "مسح الهوية الوطنية واسترجاع البيانات الحرجة — فصيلة الدم، الحساسية، الأمراض المزمنة — في أقل من 200 مللي ثانية. مُحمَّل على أجهزة الهلال الأحمر.",
    metrics: ["< 200ms استجابة", "بدون اتصال إنترنت", "HL7 FHIR مشفر"],
    color: "var(--critical-600)",
    bg: "var(--critical-50)",
    border: "var(--critical-200)",
    badge: "badge-critical",
    badgeLabel: "EMERGENCY",
  },
  {
    href: "/clinical/dashboard",
    code: "CTX-02",
    title: "لوحة الطبيب السريرية",
    en: "Physician Dashboard",
    desc: "السجل الطبي الموحد من كافة المنشآت، كاشف التعارض الدوائي الآني، وتحليل سَنَد الذكي للمخاطر الاستباقية. قرار أفضل في وقت أقل.",
    metrics: ["سجل موحد من 48+ منشأة", "AI Risk Analysis", "Drug Interaction Engine"],
    color: "var(--brand-600)",
    bg: "var(--brand-50)",
    border: "var(--brand-200)",
    badge: "badge-brand",
    badgeLabel: "CLINICAL",
  },
  {
    href: "/citizen",
    code: "CTX-03",
    title: "لوحة الصحة الشخصية",
    en: "Citizen Dashboard",
    desc: "المواطن يرى ملفه الصحي الكامل، مؤشره الصحي، تنبيهات الذكاء الاصطناعي الاستباقية، وتوصيات مخصصة — قبل أن تسوء حالته.",
    metrics: ["مؤشر صحي شخصي", "تنبيهات AI استباقية", "تصدير بطاقة صحية دولية"],
    color: "var(--success-600)",
    bg: "var(--success-50)",
    border: "var(--success-200)",
    badge: "badge-success",
    badgeLabel: "CITIZEN",
  },
  {
    href: "/national/dashboard",
    code: "CTX-04",
    title: "لوحة التحكم الوطنية",
    en: "National Command Center",
    desc: "رؤية استراتيجية شاملة على مستوى المملكة. KPIs في الوقت الفعلي، توزيع المخاطر الصحية، وتقارير تشغيلية للمسؤولين في وزارة الصحة وسدايا.",
    metrics: ["KPIs فورية", "توزيع جغرافي", "تقارير وزارية"],
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#e9d5ff",
    badge: "badge-neutral",
    badgeLabel: "GOV",
  },
];

const PROBLEMS = [
  {
    num: "01",
    title: "عمى الطوارئ",
    desc: "مريض في حالة حرجة — لا أحد يعرف فصيلة دمه، حساسيته، أو الأدوية التي يتناولها. قرارات تُتخذ في الظلام.",
  },
  {
    num: "02",
    title: "أخطاء دوائية قاتلة",
    desc: "طبيب يصف دواء لا يعلم أن طبيباً آخر وصف ما يتعارض معه. تعارض كيميائي يدمر كلية المريض.",
  },
  {
    num: "03",
    title: "هدر مالي ملياري",
    desc: "المريض يكرر نفس التحاليل في كل مستشفى لأنه لا توجد قاعدة بيانات موحدة. مليارات الريالات هدراً سنوياً.",
  },
  {
    num: "04",
    title: "غياب الطب الوقائي",
    desc: "البيانات موجودة لكنها غير مُحللة. لا يوجد نظام يُنبه المواطن باقتراب إصابته بالسكري أو ارتفاع ضغط الدم.",
  },
];

const STACK = [
  { label: "معيار البيانات",   value: "HL7 FHIR R4" },
  { label: "الاستضافة",        value: "STC Cloud — KSA" },
  { label: "التحقق من الهوية", value: "Nafath / نفاذ" },
  { label: "الأمن السيبراني", value: "NCA Compliant A+" },
  { label: "تحليل البيانات",   value: "SDAIA Framework" },
  { label: "محرك الذكاء",      value: "Sanad AI Engine" },
  { label: "بنية النظام",      value: "Modular Monolith" },
  { label: "تشفير البيانات",   value: "AES-256 + mTLS" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(160deg, var(--n-950) 0%, #0c2340 50%, #0a1e35 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "72px 48px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="flex items-center gap-3 mb-8">
            <div
              className="rounded"
              style={{ width: "6px", height: "6px", background: "var(--success-400)", animation: "pulse-slow 2s ease-in-out infinite" }}
            />
            <span className="text-caption" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase" }}>
              مبادرة رؤية 2030 · Vision 2030 Health Initiative
            </span>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <span
              className="font-black"
              style={{ fontSize: "72px", color: "white", letterSpacing: "-3px", lineHeight: 1 }}
            >
              سَنَد
            </span>
          </div>
          <div
            className="font-bold"
            style={{ fontSize: "24px", color: "rgba(255,255,255,0.65)", letterSpacing: "-0.5px", marginBottom: "24px" }}
          >
            البنية التحتية الرقمية للصحة الوطنية
          </div>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "580px",
              marginBottom: "40px",
            }}
          >
            نحوّل رقم الهوية الوطنية إلى مفتاح مشفر يربط جميع السجلات الطبية عبر كافة المنشآت الصحية.
            لأن قرارات الحياة والموت تحتاج بيانات لحظية — لا ورق.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link href="/emergency" className="btn btn-danger btn-lg">
              واجهة الإسعاف
              <ArrowIcon />
            </Link>
            <Link
              href="/clinical/dashboard"
              className="btn btn-lg"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
              }}
            >
              لوحة الطبيب
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section style={{ padding: "64px 48px", background: "white", borderBottom: "1px solid var(--n-150)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="text-label mb-2">المشكلة</div>
          <div className="text-h1 mb-2" style={{ color: "var(--n-900)" }}>
            القطاع الصحي يعاني من نزيف بياني
          </div>
          <p className="text-body mb-10" style={{ color: "var(--n-400)", maxWidth: "520px" }}>
            ميزانية 214 مليار ريال سنوياً — ومع ذلك طبيب لا يرى ما وصفه زميله، ومريض يعيد نفس الفحص في كل مستشفى.
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {PROBLEMS.map((p) => (
              <div
                key={p.num}
                className="rounded-xl p-6"
                style={{
                  border: "1px solid var(--n-150)",
                  background: "var(--n-25)",
                }}
              >
                <div
                  className="font-black font-mono mb-3"
                  style={{ fontSize: "11px", color: "var(--n-300)", letterSpacing: "2px" }}
                >
                  {p.num}
                </div>
                <div className="text-h4 mb-2" style={{ color: "var(--n-900)" }}>{p.title}</div>
                <p className="text-small" style={{ color: "var(--n-500)", lineHeight: "1.7" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Contexts */}
      <section style={{ padding: "64px 48px", background: "var(--n-50)", borderBottom: "1px solid var(--n-150)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div className="text-label mb-2">الحل</div>
          <div className="text-h1 mb-2" style={{ color: "var(--n-900)" }}>
            أربعة سياقات — نظام واحد
          </div>
          <p className="text-body mb-10" style={{ color: "var(--n-400)", maxWidth: "480px" }}>
            كل سياق مُصمَّم لمستخدم محدد بإمكانيات وصلاحيات مختلفة. هوية واحدة تفتح كل السجلات.
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {CONTEXTS.map((ctx) => (
              <Link
                key={ctx.href}
                href={ctx.href}
                className="block rounded-xl p-6 transition-all duration-150 group"
                style={{
                  background: ctx.bg,
                  border: `1px solid ${ctx.border}`,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--card-shadow-md)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div
                      className="font-mono text-caption mb-1"
                      style={{ color: ctx.color, letterSpacing: "1px" }}
                    >
                      {ctx.code}
                    </div>
                    <div className="text-h3" style={{ color: "var(--n-900)" }}>{ctx.title}</div>
                    <div className="text-caption" style={{ color: "var(--n-400)" }}>{ctx.en}</div>
                  </div>
                  <span className={`badge ${ctx.badge}`}>{ctx.badgeLabel}</span>
                </div>

                <p className="text-small mb-4" style={{ color: "var(--n-500)", lineHeight: "1.7" }}>
                  {ctx.desc}
                </p>

                <div className="space-y-1.5">
                  {ctx.metrics.map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <CheckIcon />
                      <span className="text-small font-medium" style={{ color: "var(--n-600)" }}>{m}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center gap-1.5 mt-4 text-small font-semibold transition-all"
                  style={{ color: ctx.color }}
                >
                  <span>فتح السياق</span>
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: "64px 48px", background: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="text-label mb-2">البنية التقنية</div>
          <div className="text-h1 mb-2" style={{ color: "var(--n-900)" }}>هندسة سيادية 100%</div>
          <p className="text-body mb-10" style={{ color: "var(--n-400)", maxWidth: "480px" }}>
            مُصمَّم ليتجاوز معايير سدايا، هيئة الاتصالات، والهيئة الوطنية للأمن السيبراني.
            لا cloud أجنبي. لا بيانات خارج المملكة.
          </p>

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STACK.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4"
                style={{ border: "1px solid var(--n-150)", background: "var(--n-25)" }}
              >
                <div className="text-label mb-1.5" style={{ color: "var(--n-300)" }}>{s.label}</div>
                <div className="font-bold text-small" style={{ color: "var(--n-800)" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-12 py-8 flex items-center justify-between"
        style={{
          background: "var(--n-950)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          marginTop: "auto",
        }}
      >
        <div>
          <div className="font-black" style={{ fontSize: "18px", color: "white", letterSpacing: "-0.5px" }}>
            سَنَد
          </div>
          <div className="text-caption mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
            SANAD · National Digital Health Infrastructure
          </div>
        </div>
        <div className="text-caption" style={{ color: "rgba(255,255,255,0.2)" }}>
          وثيقة سرية للمؤسسين — Confidential Founders Document
        </div>
      </footer>
    </div>
  );
}
