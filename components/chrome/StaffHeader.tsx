"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { LangSwitch } from "./LangSwitch";
import { Icon } from "@/components/ui/Icon";

// Distinct chrome for the GOVERNMENT STAFF area (officer console + ops
// dashboard). Deliberately unlike the citizen site: dark ground, a saffron
// "restricted" rule, a staff identity, and an explicit exit back to the public
// site — so there is no confusion about which surface you are on.
const NAV = [
  { key: "queue", href: "/officer", label: bi("सत्यापन कतार", "Verification queue"), icon: "shield-check" },
  { key: "dashboard", href: "/dashboard", label: bi("जवाबदेही डैशबोर्ड", "Accountability dashboard"), icon: "landmark" },
];

export function StaffHeader({ active, officer = "आर. के. पटेल · पटवारी" }: { active?: string; officer?: string }) {
  const { lang } = useLang();
  return (
    <header style={{ background: "var(--ink-900)", color: "var(--ink-0)", borderBottom: "var(--border-rule) solid var(--saffron-500)" }}>
      <div className="container" style={{ padding: "6px var(--gutter)", display: "flex", gap: 12, alignItems: "center", font: "var(--type-caption)", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
        <Icon name="shield-check" size="sm" style={{ color: "var(--saffron-400)" }} />
        <span style={{ color: "rgba(255,255,255,.85)" }}>{pick(lang, bi("शासकीय पोर्टल — प्रतिबंधित पहुँच", "Staff portal — restricted access"))}</span>
        <span style={{ flex: 1 }} />
        <a href="/" style={{ color: "rgba(255,255,255,.85)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          {pick(lang, bi("नागरिक साइट", "Citizen site"))} <Icon name="arrow-right" size="sm" />
        </a>
      </div>
      <div className="container" style={{ padding: "12px var(--gutter)", display: "flex", alignItems: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
        <a href="/staff" style={{ textDecoration: "none", color: "var(--ink-0)", display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ font: "800 22px/1 var(--font-sans)" }}>Praman</span>
          <span className="mono" style={{ font: "var(--type-caption)", color: "var(--saffron-400)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" }}>{pick(lang, bi("शासकीय", "Staff"))}</span>
        </a>
        <nav style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
          {NAV.map((n) => (
            <a key={n.key} href={n.href} style={{ display: "flex", alignItems: "center", gap: 6, font: "var(--type-label)", fontSize: "var(--text-sm)", color: active === n.key ? "var(--ink-0)" : "rgba(255,255,255,.7)", textDecoration: "none", paddingBottom: 4, borderBottom: `2px solid ${active === n.key ? "var(--saffron-500)" : "transparent"}` }}>
              <Icon name={n.icon} size="sm" /> {pick(lang, n.label)}
            </a>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span className="mono" style={{ font: "var(--type-caption)", color: "rgba(255,255,255,.75)" }}>{officer}</span>
          <LangSwitch onDark />
        </div>
      </div>
    </header>
  );
}
