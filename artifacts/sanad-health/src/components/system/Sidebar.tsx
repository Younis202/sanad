import { Link, useLocation } from "wouter";

interface NavItem {
  href: string;
  labelAr: string;
  labelEn: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
}

const NAV: NavItem[] = [
  {
    href: "/",
    labelAr: "الرئيسية",
    labelEn: "Overview",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="nav-icon" width={18} height={18}>
        <path d="M3 7.5L9 3l6 4.5V15a.75.75 0 0 1-.75.75H12v-4.5h-3V15.75H3.75A.75.75 0 0 1 3 15V7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/emergency",
    labelAr: "واجهة الإسعاف",
    labelEn: "Emergency",
    badge: "LIVE",
    badgeColor: "#EF4444",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="nav-icon" width={18} height={18}>
        <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/clinical/dashboard",
    labelAr: "لوحة الطبيب",
    labelEn: "Clinical",
    badge: "AI",
    badgeColor: "#0033FF",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="nav-icon" width={18} height={18}>
        <circle cx="9" cy="6" r="3.25" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/citizen",
    labelAr: "صحة المواطن",
    labelEn: "Citizen",
    badge: "هـ",
    badgeColor: "#059669",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="nav-icon" width={18} height={18}>
        <path d="M9 15.5C4.858 15.5 2.5 13.5 2.5 9.5 2.5 5.5 5.41 2.5 9 2.5s6.5 3 6.5 7c0 4-2.358 6-6.5 6z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M6.5 9h5M9 6.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/national/dashboard",
    labelAr: "التحكم الوطني",
    labelEn: "National",
    badge: "GOV",
    badgeColor: "#7C3AED",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="nav-icon" width={18} height={18}>
        <rect x="2" y="5" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M6 5V3.5A.5.5 0 0 1 6.5 3h5a.5.5 0 0 1 .5.5V5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 9h2.5M9.5 9h3.5M5 12h3.5M10.5 12h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside
      className="flex flex-col flex-shrink-0 select-none"
      style={{
        width: "248px",
        minHeight: "100vh",
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderLeft: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="flex items-center justify-center font-black text-white flex-shrink-0"
          style={{
            width: "38px",
            height: "38px",
            background: "linear-gradient(135deg, #0033FF 0%, #0055FF 100%)",
            borderRadius: "12px",
            fontSize: "17px",
            boxShadow: "0 4px 16px rgba(0, 51, 255, 0.45)",
          }}
        >
          س
        </div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.95)", fontSize: "16px", fontWeight: 800, letterSpacing: "-0.4px" }}>
            سَنَد
          </div>
          <div style={{ fontSize: "10.5px", color: "var(--sidebar-text-dim)", letterSpacing: "0.5px", marginTop: "1px" }}>
            SANAD Health OS
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-5 pt-6 pb-2">
        <span style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: "var(--sidebar-text-dim)",
        }}>
          السياقات
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? location === "/"
              : location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active ? "active" : ""}`}
              style={{
                ...(active && {
                  background: "rgba(0, 51, 255, 0.18)",
                  boxShadow: "inset 0 0 0 1px rgba(0, 51, 255, 0.25)",
                }),
              }}
            >
              {item.icon}
              <div className="flex-1 min-w-0">
                <div style={{
                  fontSize: "13.5px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : "rgba(255,255,255,0.65)",
                }}>
                  {item.labelAr}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)",
                  marginTop: "1px",
                }}>
                  {item.labelEn}
                </div>
              </div>
              {item.badge && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "2px 7px",
                    borderRadius: "99px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    background: `${item.badgeColor}22`,
                    color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}33`,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <div
          className="rounded-2xl p-3 space-y-2.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.3px" }}>
              System Status
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#10B981",
                  boxShadow: "0 0 8px #10B981",
                  animation: "pulse-soft 2.5s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "10.5px", color: "#34D399", fontWeight: 600 }}>Operational</span>
            </div>
          </div>
          {[
            { label: "HL7 FHIR", value: "R4" },
            { label: "NCA", value: "Compliant" },
            { label: "Uptime", value: "99.97%" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>{s.label}</span>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
