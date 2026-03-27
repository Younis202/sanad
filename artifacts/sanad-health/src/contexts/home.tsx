import { Link } from "wouter";

function ChevronLeft() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width={14} height={14} style={{ transform: "rotate(180deg)" }}>
      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={22} height={22}>
      <path d="M12 3L4 6.5V12c0 4.5 3.5 8.5 8 9.5 4.5-1 8-5 8-9.5V6.5L12 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={`${color}18`}/>
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const CONTEXTS = [
  {
    href: "/emergency",
    code: "CTX-01",
    title: "واجهة الإسعاف",
    en: "Emergency Interface",
    desc: "مسح الهوية الوطنية واسترجاع البيانات الحرجة — فصيلة الدم، الحساسية، الأمراض المزمنة — في أقل من 200ms.",
    metrics: ["< 200ms استجابة", "HL7 FHIR مشفر", "بدون اتصال إنترنت"],
    accent: "#EF4444",
    accentLight: "rgba(239, 68, 68, 0.08)",
    accentBorder: "rgba(239, 68, 68, 0.18)",
    badge: "EMERGENCY",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <circle cx="14" cy="14" r="12" stroke="#EF4444" strokeWidth="1.5" fill="rgba(239,68,68,0.08)"/>
        <path d="M14 8v12M8 14h12" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/clinical/dashboard",
    code: "CTX-02",
    title: "لوحة الطبيب السريرية",
    en: "Physician Dashboard",
    desc: "السجل الطبي الموحد من 48+ منشأة، كاشف التعارض الدوائي الآني، وتحليل سَنَد الذكي لمخاطر المريض.",
    metrics: ["سجل موحد 48+ منشأة", "Drug Interaction AI", "تحليل المخاطر الذكي"],
    accent: "#0033FF",
    accentLight: "rgba(0, 51, 255, 0.07)",
    accentBorder: "rgba(0, 51, 255, 0.16)",
    badge: "CLINICAL",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <circle cx="14" cy="10" r="5" stroke="#0033FF" strokeWidth="1.5" fill="rgba(0,51,255,0.08)"/>
        <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#0033FF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/citizen",
    code: "CTX-03",
    title: "لوحة الصحة الشخصية",
    en: "Citizen Dashboard",
    desc: "المواطن يرى ملفه الصحي الكامل، مؤشره الصحي، تنبيهات الذكاء الاصطناعي، وتوصيات شخصية استباقية.",
    metrics: ["مؤشر صحي شخصي", "تنبيهات AI استباقية", "بطاقة صحية دولية"],
    accent: "#059669",
    accentLight: "rgba(5, 150, 105, 0.07)",
    accentBorder: "rgba(5, 150, 105, 0.18)",
    badge: "CITIZEN",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <path d="M14 25C8 25 4.5 22 4.5 16 4.5 9.5 8.91 3.5 14 3.5s9.5 6 9.5 12.5C23.5 22 20 25 14 25z" stroke="#059669" strokeWidth="1.5" fill="rgba(5,150,105,0.08)"/>
        <path d="M9.5 14h9M14 9.5v9" stroke="#059669" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/national/dashboard",
    code: "CTX-04",
    title: "لوحة التحكم الوطنية",
    en: "National Command Center",
    desc: "رؤية استراتيجية على مستوى المملكة. KPIs فورية، توزيع المخاطر الصحية، وتقارير تشغيلية لوزارة الصحة وسدايا.",
    metrics: ["KPIs فورية وطنية", "توزيع جغرافي", "تقارير وزارية"],
    accent: "#7C3AED",
    accentLight: "rgba(124, 58, 237, 0.07)",
    accentBorder: "rgba(124, 58, 237, 0.18)",
    badge: "GOV",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
        <rect x="3" y="7" width="22" height="17" rx="2.5" stroke="#7C3AED" strokeWidth="1.5" fill="rgba(124,58,237,0.08)"/>
        <path d="M9 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" stroke="#7C3AED" strokeWidth="1.5"/>
        <path d="M7.5 14h4M13.5 14h7M7.5 18.5h6M15.5 18.5h5" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const PROBLEMS = [
  {
    num: "01",
    title: "عمى الطوارئ",
    desc: "مريض في حالة حرجة — لا أحد يعرف فصيلة دمه أو الأدوية التي يتناولها. قرارات تُتخذ في الظلام الكامل.",
    accent: "#EF4444",
  },
  {
    num: "02",
    title: "أخطاء دوائية قاتلة",
    desc: "طبيبان يصفان دواءين يتعارضان كيميائياً دون علم بعضهما. التعارض يدمر أعضاء المريض بصمت.",
    accent: "#F59E0B",
  },
  {
    num: "03",
    title: "هدر مالي ملياري",
    desc: "نفس التحليل يُعاد في كل مستشفى لأنه لا توجد قاعدة بيانات موحدة. مليارات الريالات تُهدر سنوياً.",
    accent: "#0033FF",
  },
  {
    num: "04",
    title: "غياب الطب الوقائي",
    desc: "البيانات موجودة لكنها ميتة وغير محللة. لا نظام ينبه المواطن باقتراب إصابته بالسكري أو أمراض القلب.",
    accent: "#059669",
  },
];

const STACK = [
  { label: "معيار البيانات",   value: "HL7 FHIR R4" },
  { label: "الاستضافة",        value: "STC Cloud KSA" },
  { label: "التحقق من الهوية", value: "Nafath / نفاذ" },
  { label: "الأمن السيبراني", value: "NCA — A+" },
  { label: "تحليل البيانات",  value: "SDAIA Framework" },
  { label: "محرك الذكاء",      value: "Sanad AI Engine" },
  { label: "بنية النظام",      value: "Modular Monolith" },
  { label: "تشفير البيانات",  value: "AES-256 + mTLS" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, var(--sanad-navy) 0%, #001A4D 55%, #001133 100%)",
          padding: "80px 48px 88px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow orbs */}
        <div style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,51,255,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-60px",
          left: "-40px",
          width: "380px",
          height: "380px",
          background: "radial-gradient(circle, rgba(0,51,255,0.10) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative" }}>
          {/* Status pill */}
          <div
            className="inline-flex items-center gap-2 mb-10"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "99px",
              padding: "6px 14px 6px 10px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 10px #10B981",
                animation: "pulse-soft 2.5s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 600, letterSpacing: "0.5px" }}>
              مبادرة رؤية 2030 — Vision 2030 Health Initiative
            </span>
          </div>

          {/* Logo word */}
          <div style={{ marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "88px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-4px",
                lineHeight: 1,
                display: "block",
                textShadow: "0 0 80px rgba(0, 51, 255, 0.4)",
              }}
            >
              سَنَد
            </span>
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "-0.3px",
              marginBottom: "20px",
            }}
          >
            البنية التحتية الرقمية للصحة الوطنية
          </div>

          <p style={{
            fontSize: "16px",
            lineHeight: "1.85",
            color: "rgba(255,255,255,0.38)",
            maxWidth: "560px",
            marginBottom: "44px",
          }}>
            نحوّل رقم الهوية الوطنية إلى مفتاح مشفر يربط جميع السجلات الطبية عبر كافة المنشآت الصحية.
            لأن قرارات الحياة والموت تحتاج بيانات لحظية — لا ورق.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link href="/emergency" className="btn btn-danger btn-lg">
              واجهة الإسعاف
              <ChevronLeft />
            </Link>
            <Link href="/clinical/dashboard" className="btn btn-glass btn-lg">
              لوحة الطبيب
              <ChevronLeft />
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex gap-6 flex-wrap mt-12"
            style={{ paddingTop: "36px", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { value: "48+", label: "منشأة صحية مرتبطة" },
              { value: "< 200ms", label: "زمن الاستجابة" },
              { value: "99.97%", label: "وقت التشغيل" },
              { value: "AES-256", label: "تشفير البيانات" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)", marginTop: "3px", fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMS ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 48px", background: "transparent" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <div className="text-label mb-3">المشكلة</div>
          <div className="text-h1 mb-3" style={{ color: "var(--n-800)" }}>
            القطاع الصحي يعاني من نزيف بياني
          </div>
          <p className="text-body mb-10" style={{ color: "var(--n-400)", maxWidth: "500px" }}>
            ميزانية 214 مليار ريال سنوياً — ومع ذلك طبيب لا يرى ما وصفه زميله، ومريض يعيد نفس الفحص في كل مستشفى.
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {PROBLEMS.map((p, i) => (
              <div
                key={p.num}
                className={`glass-card p-6 animate-fade-up animate-stagger-${i + 1}`}
                style={{ position: "relative", overflow: "hidden" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    background: `radial-gradient(circle, ${p.accent}14 0%, transparent 70%)`,
                  }}
                />
                <div style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: p.accent,
                  letterSpacing: "2px",
                  fontFamily: "var(--font-mono)",
                  marginBottom: "12px",
                  opacity: 0.7,
                }}>
                  {p.num}
                </div>
                <div className="text-h4 mb-2" style={{ color: "var(--n-800)" }}>{p.title}</div>
                <p className="text-small" style={{ color: "var(--n-400)", lineHeight: "1.75" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTEXTS ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 48px", background: "transparent" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div className="text-label mb-3">الحل</div>
          <div className="text-h1 mb-3" style={{ color: "var(--n-800)" }}>
            أربعة سياقات — نظام واحد
          </div>
          <p className="text-body mb-10" style={{ color: "var(--n-400)", maxWidth: "480px" }}>
            كل سياق مُصمَّم لمستخدم محدد بإمكانيات وصلاحيات مختلفة. هوية واحدة تفتح كل السجلات.
          </p>

          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {CONTEXTS.map((ctx, i) => (
              <Link
                key={ctx.href}
                href={ctx.href}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className={`glass-card p-6 animate-fade-up animate-stagger-${i + 1}`}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 20px 48px ${ctx.accent}18, 0 4px 16px rgba(0,0,0,0.07)`;
                    el.style.borderColor = `${ctx.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "";
                    el.style.boxShadow = "";
                    el.style.borderColor = "";
                  }}
                >
                  {/* Background tint */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, right: 0,
                      width: "160px", height: "160px",
                      background: `radial-gradient(circle, ${ctx.accent}10 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {ctx.icon}
                      <div>
                        <div style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: ctx.accent,
                          letterSpacing: "1.5px",
                          fontFamily: "var(--font-mono)",
                          opacity: 0.7,
                          marginBottom: "2px",
                        }}>
                          {ctx.code}
                        </div>
                        <div className="text-h3" style={{ color: "var(--n-800)" }}>{ctx.title}</div>
                        <div className="text-caption" style={{ color: "var(--n-400)" }}>{ctx.en}</div>
                      </div>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: ctx.accentLight,
                        color: ctx.accent,
                        border: `1px solid ${ctx.accentBorder}`,
                        borderRadius: "99px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        flexShrink: 0,
                      }}
                    >
                      {ctx.badge}
                    </span>
                  </div>

                  <p className="text-small mb-5" style={{ color: "var(--n-500)", lineHeight: "1.75" }}>
                    {ctx.desc}
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {ctx.metrics.map((m) => (
                      <span
                        key={m}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "99px",
                          background: ctx.accentLight,
                          border: `1px solid ${ctx.accentBorder}`,
                          fontSize: "11.5px",
                          fontWeight: 600,
                          color: ctx.accent,
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5" style={{ color: ctx.accent, fontSize: "13px", fontWeight: 700 }}>
                    <span>فتح السياق</span>
                    <ChevronLeft />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 48px" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <div className="text-label mb-3">البنية التقنية</div>
          <div className="text-h1 mb-3" style={{ color: "var(--n-800)" }}>هندسة سيادية 100%</div>
          <p className="text-body mb-10" style={{ color: "var(--n-400)", maxWidth: "500px" }}>
            مُصمَّم ليتجاوز معايير سدايا، هيئة الاتصالات، والهيئة الوطنية للأمن السيبراني. لا cloud أجنبي.
          </p>

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STACK.map((s) => (
              <div key={s.label} className="glass-card-sm p-4">
                <div className="text-label mb-2" style={{ color: "var(--n-300)" }}>{s.label}</div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--n-700)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 48px 72px" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <div
            className="glass-card-dark p-8 flex flex-wrap items-center justify-between gap-6"
          >
            <div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-1.5px" }}>
                سَنَد
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px", letterSpacing: "0.4px" }}>
                SANAD · National Digital Health Infrastructure
              </div>
            </div>

            <div className="flex items-center gap-8">
              {[
                { icon: <ShieldIcon color="#10B981" />, label: "NCA Compliant" },
                { icon: <ShieldIcon color="#3B82F6" />, label: "HL7 FHIR R4" },
                { icon: <ShieldIcon color="#7C3AED" />, label: "SDAIA Certified" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.icon}
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.50)", fontWeight: 600 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.20)", textAlign: "left" }}>
              وثيقة سرية للمؤسسين
              <br/>
              Confidential Founders Document
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
