import { Link, useLocation } from "wouter";

const NAV = [
  {
    label: "الرئيسية",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "الإسعاف",
    href: "/emergency",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    badge: "طوارئ",
    badgeColor: "badge-critical",
  },
  {
    label: "الطبيب",
    href: "/clinical/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    badge: "سريري",
    badgeColor: "badge-info",
  },
  {
    label: "المواطن",
    href: "/citizen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    badge: "صحتي",
    badgeColor: "badge-success",
  },
  {
    label: "الإدارة الوطنية",
    href: "/national/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <rect width="20" height="14" x="2" y="3" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    badge: "وطني",
    badgeColor: "badge-neutral",
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside
      className="w-64 flex-shrink-0 bg-white border-l border-neutral-200 flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-neutral-100 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "var(--sanad-teal)" }}
        >
          س
        </div>
        <div>
          <div className="font-bold text-neutral-900 text-base">سَنَد</div>
          <div className="text-xs text-neutral-400">المنظومة الصحية الوطنية</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? location === "/"
              : location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-blue-50 text-cyan-700"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span className={active ? "text-cyan-600" : "text-neutral-400"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`badge text-[10px] px-2 py-0.5 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System info */}
      <div className="p-4 border-t border-neutral-100">
        <div className="sanad-card p-3 text-xs text-neutral-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>حالة النظام</span>
            <span className="badge badge-success text-[10px]">نشط</span>
          </div>
          <div className="flex items-center justify-between">
            <span>المعيار</span>
            <span className="font-mono text-neutral-400">HL7 FHIR R4</span>
          </div>
          <div className="flex items-center justify-between">
            <span>التشفير</span>
            <span className="font-mono text-neutral-400">NCA Compliant</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
