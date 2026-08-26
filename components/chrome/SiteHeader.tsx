"use client";

import { useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { useSession } from "@/components/ui/session";
import { LangSwitch } from "./LangSwitch";
import { Icon } from "@/components/ui/Icon";

const NAV = [
  { key: "services", href: "/services", label: bi("सेवाएँ", "Services") },
  { key: "track", href: "/track", label: bi("स्थिति देखें", "Track") },
  { key: "about", href: "/about/what-is-real", label: bi("यह कैसे काम करता है", "How it works") },
];

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

export function SiteHeader({ active = "services" }: { active?: string }) {
  const { lang } = useLang();
  const { user, signOut } = useSession();
  const [open, setOpen] = useState(false);
  const [acct, setAcct] = useState(false);

  return (
    <header style={{ background: "var(--ink-0)", borderBottom: "var(--border-rule) solid var(--blue-500)" }}>
      {/* Government identity bar */}
      <div style={{ background: "var(--ink-900)", color: "var(--ink-0)", font: "var(--type-caption)" }}>
        <div className="container" style={{ padding: "6px var(--gutter)", display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
          <span>{pick(lang, bi("मध्य प्रदेश शासन की आधिकारिक वेबसाइट", "An official website of the Government of Madhya Pradesh"))}</span>
          <span style={{ flex: 1 }} />
          <a href="tel:181" style={{ color: "rgba(255,255,255,.85)", textDecoration: "none" }}>{pick(lang, bi("सहायता · 181", "Help · 181"))}</a>
        </div>
      </div>

      {/* Main header */}
      <div className="container" style={{ padding: "var(--space-5) var(--gutter)", display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
        <a href="/" style={{ textDecoration: "none", color: "var(--text-body)", display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
          <span style={{ font: "800 22px/1 var(--font-sans)", letterSpacing: "var(--tracking-tight)" }}>Praman</span>
          <span style={{ font: "var(--type-caption)", color: "var(--text-muted)", borderLeft: "var(--border-hairline) solid var(--border-default)", paddingLeft: "var(--space-3)" }}>
            {pick(lang, bi("मध्य प्रदेश", "Madhya Pradesh"))}
          </span>
        </a>

        <nav className="nav-desktop" aria-label={pick(lang, bi("मुख्य", "Primary"))}>
          {NAV.map((n) => (
            <a key={n.key} href={n.href} style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--text-body)", textDecoration: "none", paddingBottom: 4, borderBottom: `var(--border-rule) solid ${active === n.key ? "var(--blue-500)" : "transparent"}` }}>
              {pick(lang, n.label)}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)", marginLeft: "auto", position: "relative" }}>
          <LangSwitch />
          {user ? (
            <div className="nav-desktop-signin" style={{ position: "relative" }}>
              <button type="button" onClick={() => setAcct((a) => !a)} aria-expanded={acct} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "2px solid var(--ink-900)", padding: "6px 12px", cursor: "pointer", font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--ink-900)", minHeight: 40 }}>
                <Icon name="user-round" size="sm" />
                {firstName(user.name)}
                <Icon name="chevron-down" size="sm" />
              </button>
              {acct ? (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "var(--ink-0)", border: "1px solid var(--ink-200)", boxShadow: "var(--shadow-menu)", minWidth: 200, zIndex: 20 }}>
                  <a href="/track" onClick={() => setAcct(false)} style={{ display: "block", padding: "12px 16px", textDecoration: "none", color: "var(--text-body)", font: "var(--type-body-sm)", borderBottom: "1px solid var(--ink-100)" }}>{pick(lang, bi("मेरे आवेदन", "My applications"))}</a>
                  <button type="button" onClick={() => { signOut(); setAcct(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", background: "none", border: 0, cursor: "pointer", color: "var(--red-600)", font: "var(--type-body-sm)" }}>{pick(lang, bi("साइन आउट", "Sign out"))}</button>
                </div>
              ) : null}
            </div>
          ) : (
            <a href="/track" className="nav-desktop-signin" style={{ alignItems: "center", gap: "var(--space-2)", font: "var(--type-label)", fontSize: "var(--text-sm)", textDecoration: "none", color: "var(--text-body)" }}>
              <Icon name="user-round" size="sm" />
              {pick(lang, bi("साइन इन", "Sign in"))}
            </a>
          )}
          <button type="button" className="nav-mobile-btn" aria-label={pick(lang, bi("मेन्यू", "Menu"))} aria-expanded={open} onClick={() => setOpen((o) => !o)} style={{ background: "none", border: "2px solid var(--ink-900)", padding: 8, cursor: "pointer", color: "var(--ink-900)", alignItems: "center", minHeight: 44 }}>
            <Icon name={open ? "x" : "menu"} size="md" />
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div className={`nav-mobile-panel${open ? " open" : ""}`} style={{ borderTop: "var(--border-hairline) solid var(--border-default)" }}>
        <div className="container" style={{ padding: "var(--space-4) var(--gutter)", display: "flex", flexDirection: "column" }}>
          {NAV.map((n) => (
            <a key={n.key} href={n.href} onClick={() => setOpen(false)} style={{ padding: "12px 0", borderBottom: "var(--border-hairline) solid var(--border-muted)", font: "var(--type-label)", fontSize: "var(--text-base)", color: "var(--text-body)", textDecoration: "none" }}>
              {pick(lang, n.label)}
            </a>
          ))}
          {user ? (
            <>
              <a href="/track" onClick={() => setOpen(false)} style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 8, font: "var(--type-label)", fontSize: "var(--text-base)", textDecoration: "none", color: "var(--text-body)" }}>
                <Icon name="user-round" size="sm" /> {pick(lang, bi("मेरे आवेदन", "My applications"))} · {firstName(user.name)}
              </a>
              <button type="button" onClick={() => { signOut(); setOpen(false); }} style={{ padding: "12px 0", textAlign: "left", background: "none", border: 0, cursor: "pointer", color: "var(--red-600)", font: "var(--type-label)", fontSize: "var(--text-base)" }}>{pick(lang, bi("साइन आउट", "Sign out"))}</button>
            </>
          ) : (
            <a href="/track" onClick={() => setOpen(false)} style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 8, font: "var(--type-label)", fontSize: "var(--text-base)", textDecoration: "none", color: "var(--text-body)" }}>
              <Icon name="user-round" size="sm" /> {pick(lang, bi("साइन इन", "Sign in"))}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
