"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { StaffHeader } from "@/components/chrome/StaffHeader";
import { Icon } from "@/components/ui/Icon";
import { Callout } from "@/components/ui/Callout";

const CARDS = [
  { href: "/officer", icon: "shield-check", title: bi("क्षेत्र सत्यापन कतार", "Field-verification queue"), desc: bi("पटवारी के लिए — केवल फ़्लैग किए गए मामले, कारण सहित। स्वीकृत/वापस करें।", "For the Patwari — only flagged cases, with reasons. Approve or return.") },
  { href: "/dashboard", icon: "landmark", title: bi("जवाबदेही डैशबोर्ड", "Accountability dashboard"), desc: bi("तहसील अनुसार उल्लंघन, औसत निर्णय समय, तत्काल जारी दर, संचित जुर्माना।", "Breaches by tehsil, median decision time, auto-issue rate, penalties accrued.") },
];

export default function StaffLanding() {
  const { lang } = useLang();
  return (
    <>
      <StaffHeader />
      <main id="main" className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 900 }}>
        <div className="eyebrow" style={{ color: "var(--saffron-600)" }}>{pick(lang, bi("शासकीय क्षेत्र", "Staff area"))}</div>
        <h1 className="h-page" style={{ marginTop: 8 }}>{pick(lang, bi("अधिकारी एवं संचालन", "Officers & operations"))}</h1>
        <p style={{ font: "var(--type-body)", color: "var(--ink-700)", marginTop: 12, maxWidth: "66ch" }}>
          {pick(lang, bi("यह क्षेत्र केवल अधिकृत शासकीय कर्मचारियों के लिए है। नागरिक यहाँ आवेदन नहीं करते।", "This area is for authorised government staff only. Citizens do not apply here."))}
        </p>

        <Callout tone="warning" title={pick(lang, bi("मूल्यांकन बिल्ड", "Evaluation build"))} style={{ marginTop: 20 }}>
          {pick(lang, bi("इस संस्करण में स्टाफ़ लॉगिन खुला है ताकि आप कंसोल आज़मा सकें। तैनाती में यहाँ विभागीय SSO/अधिकारी लॉगिन जुड़ता है।", "Staff login is open in this build so you can try the console. On deployment, departmental SSO / officer login is connected here."))}
        </Callout>

        <div className="grid grid-2" style={{ marginTop: 32 }}>
          {CARDS.map((c) => (
            <a key={c.href} href={c.href} style={{ display: "block", textDecoration: "none", color: "var(--text-body)", background: "var(--ink-0)", borderRight: "1px solid var(--ink-200)", borderBottom: "1px solid var(--ink-200)", borderLeft: "1px solid var(--ink-200)", borderTop: "4px solid var(--saffron-500)", padding: "var(--space-7)" }}>
              <Icon name={c.icon} size="lg" style={{ color: "var(--saffron-600)", marginBottom: 12 }} />
              <div style={{ font: "var(--type-h3)", marginBottom: 8 }}>{pick(lang, c.title)}</div>
              <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>{pick(lang, c.desc)}</p>
              <div className="row" style={{ gap: 6, marginTop: 12, color: "var(--saffron-600)", font: "var(--type-label)", fontSize: "var(--text-sm)" }}>
                {pick(lang, bi("खोलें", "Open"))} <Icon name="arrow-right" size="sm" />
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
