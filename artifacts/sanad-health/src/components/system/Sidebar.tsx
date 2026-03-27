import { Link, useLocation } from "wouter";

interface NavItem {
  href: string;
  labelAr: string;
  labelEn: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  icon: React.ReactNode;
}

const NAV: NavItem[] = [
  {
    href: "/",
    labelAr: "الرئيسية",
    labelEn: "Overview",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="nav-icon" width={20} height={20}>
        <path d="M3 8.5L10 3l7 5.5V17a.75.75 0 0 1-.75.75H13.5v-5h-3v5H3.75A.75.75 0 0 1 3 17V8.5z"
          stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/emergency",
    labelAr: "واجهة الإسعاف",
    labelEn: "Emergency",
    badge: "LIVE",
    badgeColor: "#dc2626",
    badgeBg: "rgba(220,38,38,0.08)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="nav-icon" width={20} height={20}>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/clinical/dashboard",
    labelAr: "لوحة الطبيب",
    labelEn: "Clinical",
    badge: "AI",
    badgeColor: "#0024c1",
    badgeBg: "rgba(0,36,193,0.08)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="nav-icon" width={20} height={20}>
        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/citizen",
    labelAr: "صحة المواطن",
    labelEn: "Citizen",
    badge: "هـ",
    badgeColor: "#059669",
    badgeBg: "rgba(5,150,105,0.08)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="nav-icon" width={20} height={20}>
        <path d="M10 17C5.858 17 3.5 15 3.5 11 3.5 6.5 6.41 3 10 3s6.5 3.5 6.5 8c0 4-2.358 6-6.5 6z"
          stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.5 10h5M10 7.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/national/dashboard",
    labelAr: "التحكم الوطني",
    labelEn: "National",
    badge: "GOV",
    badgeColor: "#7c3aed",
    badgeBg: "rgba(124,58,237,0.08)",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="nav-icon" width={20} height={20}>
        <rect x="2.5" y="6" width="15" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7 6V4.5A.5.5 0 0 1 7.5 4h5a.5.5 0 0 1 .5.5V6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 10.5h3M11 10.5h3.5M5.5 14h4M12 14h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside
      style={{
        width: "248px",
        minWidth: "248px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "28px",
        background: "rgba(255, 255, 255, 0.68)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.90)",
        boxShadow: "0 8px 40px rgba(0, 36, 193, 0.07), 0 2px 12px rgba(0, 0, 0, 0.04)",
        position: "sticky",
        top: "16px",
        maxHeight: "calc(100vh - 32px)",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "22px 20px 18px",
          borderBottom: "1px solid rgba(203, 213, 239, 0.45)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #0033FF 0%, #0055FF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(0, 51, 255, 0.35)",
          }}
        >
          س
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#191c1e", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
            سَنَد
          </div>
          <div style={{ fontSize: "10.5px", color: "#747689", letterSpacing: "0.5px", marginTop: "2px", fontWeight: 500 }}>
            SANAD Health OS
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "18px 20px 8px" }}>
        <span style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: "#747689",
        }}>
          السياقات
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "13.5px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : "#444657",
                  lineHeight: 1.3,
                }}>
                  {item.labelAr}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: active ? "rgba(255,255,255,0.55)" : "#c4c5da",
                  marginTop: "1px",
                  fontWeight: 400,
                }}>
                  {item.labelEn}
                </div>
              </div>
              {item.badge && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 7px",
                  borderRadius: "99px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  whiteSpace: "nowrap",
                  background: active ? "rgba(255,255,255,0.18)" : item.badgeBg,
                  color: active ? "#fff" : item.badgeColor,
                  border: active ? "1px solid rgba(255,255,255,0.25)" : `1px solid ${item.badgeColor}33`,
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System status */}
      <div style={{ padding: "16px 14px 20px", borderTop: "1px solid rgba(203, 213, 239, 0.45)" }}>
        <div style={{
          borderRadius: "16px",
          padding: "14px",
          background: "rgba(247, 249, 251, 0.80)",
          border: "1px solid rgba(196, 197, 218, 0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10.5px", color: "#747689", fontWeight: 600, letterSpacing: "0.3px" }}>
              System Status
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 7px #10B981",
                animation: "pulse-soft 2.5s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "10.5px", color: "#059669", fontWeight: 600 }}>Operational</span>
            </div>
          </div>
          {[
            { label: "HL7 FHIR", value: "R4" },
            { label: "NCA", value: "Compliant" },
            { label: "Uptime", value: "99.97%" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#c4c5da" }}>{s.label}</span>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#444657", fontWeight: 600 }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
