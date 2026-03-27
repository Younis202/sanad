import { Link, useLocation } from "wouter";

interface NavItem {
  href: string;
  labelAr: string;
  labelEn: string;
  badge?: string;
  badgeStyle?: React.CSSProperties;
  icon: React.ReactNode;
}

const NAV: NavItem[] = [
  {
    href: "/",
    labelAr: "الرئيسية",
    labelEn: "Overview",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="nav-icon">
        <path d="M2 6.5L8 2l6 4.5V14a.5.5 0 0 1-.5.5h-3.75V10h-3.5v4.5H2.5A.5.5 0 0 1 2 14V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/emergency",
    labelAr: "واجهة الإسعاف",
    labelEn: "Emergency",
    badge: "EMERGENCY",
    badgeStyle: { background: "rgba(225,29,72,0.2)", color: "#fb7185", border: "1px solid rgba(225,29,72,0.3)" },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="nav-icon">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/clinical/dashboard",
    labelAr: "لوحة الطبيب",
    labelEn: "Clinical",
    badge: "CLINICAL",
    badgeStyle: { background: "rgba(37,99,235,0.2)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.3)" },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="nav-icon">
        <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/citizen",
    labelAr: "صحة المواطن",
    labelEn: "Citizen",
    badge: "CITIZEN",
    badgeStyle: { background: "rgba(22,163,74,0.2)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="nav-icon">
        <path d="M8 13.5c-4 0-6-2-6-5.5C2 4.5 4.686 2 8 2s6 2.5 6 6c0 3.5-2 5.5-6 5.5z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/national/dashboard",
    labelAr: "التحكم الوطني",
    labelEn: "National",
    badge: "GOV",
    badgeStyle: { background: "rgba(255,255,255,0.07)", color: "#8b98b0", border: "1px solid rgba(255,255,255,0.1)" },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="nav-icon">
        <rect x="1.5" y="4" width="13" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 4V2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V4" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 8h2M7 8h5M4 10.5h3M9 10.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
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
        width: "240px",
        minHeight: "100vh",
        background: "var(--sidebar-bg)",
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
            width: "34px",
            height: "34px",
            background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          س
        </div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.92)", fontSize: "15px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            سَنَد
          </div>
          <div style={{ fontSize: "11px", color: "var(--sidebar-text-dim)", letterSpacing: "0.3px" }}>
            SANAD Health OS
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="px-5 pt-5 pb-2">
        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--sidebar-text-dim)" }}>
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
            >
              {item.icon}
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "13px", fontWeight: active ? 600 : 500 }}>
                  {item.labelAr}
                </div>
                <div style={{ fontSize: "11px", color: active ? "rgba(34,211,238,0.6)" : "var(--sidebar-text-dim)", marginTop: "1px" }}>
                  {item.labelEn}
                </div>
              </div>
              {item.badge && item.badgeStyle && (
                <span
                  style={{
                    ...item.badgeStyle,
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                    whiteSpace: "nowrap",
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
          className="rounded-lg p-3 space-y-2.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--sidebar-border)" }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "11px", color: "var(--sidebar-text-dim)" }}>System Status</span>
            <div className="flex items-center gap-1.5">
              <div
                className="rounded-full"
                style={{ width: "6px", height: "6px", background: "var(--success-500)", animation: "pulse-slow 2s ease-in-out infinite" }}
              />
              <span style={{ fontSize: "11px", color: "var(--success-400)" }}>Operational</span>
            </div>
          </div>
          {[
            { label: "HL7 FHIR", value: "R4" },
            { label: "NCA", value: "Compliant" },
            { label: "Uptime", value: "99.97%" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span style={{ fontSize: "11px", color: "var(--sidebar-text-dim)" }}>{s.label}</span>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--sidebar-text)" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
