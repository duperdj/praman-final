"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import type { Bilingual } from "@/components/ui/lang";

const COLUMNS: { title: Bilingual; links: { label: Bilingual; href: string }[] }[] = [
  {
    title: bi("सेवाएँ", "Services"),
    links: [
      { label: bi("सभी सेवाएँ", "All services"), href: "/services" },
      { label: bi("प्रमाण पत्र", "Certificates"), href: "/services/category/certificates" },
      { label: bi("लाइसेंस", "Licences"), href: "/services/category/licences" },
      { label: bi("भुगतान", "Payments"), href: "/services/category/payments" },
    ],
  },
  {
    title: bi("सहायता", "Help"),
    links: [
      { label: bi("संपर्क करें", "Contact us"), href: "/contact" },
      { label: bi("लोक सेवा केंद्र", "Lok Seva Kendras"), href: "/lok-seva-kendras" },
      { label: bi("सुगम्यता", "Accessibility"), href: "/accessibility" },
      { label: bi("समस्या बताएँ", "Report a problem"), href: "/report-a-problem" },
    ],
  },
  {
    title: bi("शासन", "Government"),
    links: [
      { label: bi("विभाग", "Departments"), href: "/departments" },
      { label: bi("मुख्यमंत्री", "Chief Minister"), href: "/government/chief-minister" },
      { label: bi("सूचना का अधिकार", "Right to Information"), href: "/rti" },
      { label: bi("निविदाएँ", "Tenders"), href: "/tenders" },
    ],
  },
  {
    title: bi("नीतियाँ", "Policies"),
    links: [
      { label: bi("उपयोग की शर्तें", "Terms of use"), href: "/policies/terms" },
      { label: bi("गोपनीयता", "Privacy"), href: "/policies/privacy" },
      { label: bi("कॉपीराइट", "Copyright"), href: "/policies/copyright" },
      { label: bi("यह कैसे काम करता है", "How it works"), href: "/about/what-is-real" },
    ],
  },
];

export function SiteFooter() {
  const { lang } = useLang();
  return (
    <footer style={{ background: "var(--surface-muted)", borderTop: "var(--border-rule) solid var(--blue-500)", marginTop: "var(--section-y)" }}>
      <div className="container" style={{ padding: "var(--section-y-tight) var(--gutter)" }}>
        <div className="grid grid-4" style={{ gap: "var(--space-8)" }}>
          {COLUMNS.map((c) => (
            <div key={c.title.en}>
              <p style={{ font: "var(--type-label)", fontSize: "var(--text-base)", margin: "0 0 var(--space-4)" }}>{pick(lang, c.title)}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-3)" }}>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} style={{ font: "var(--type-body-sm)" }}>
                      {pick(lang, l.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "var(--space-9)", paddingTop: "var(--space-6)", borderTop: "var(--border-hairline) solid var(--border-default)", display: "flex", gap: "var(--space-6)", alignItems: "baseline", flexWrap: "wrap" }}>
          <span style={{ font: "var(--weight-bold) var(--text-sm)/1 var(--font-sans)" }}>Praman</span>
          <span style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>
            {pick(lang, bi(
              "सामग्री का स्वामित्व एवं रखरखाव मध्य प्रदेश शासन द्वारा।",
              "Content owned and maintained by the Government of Madhya Pradesh.",
            ))}
          </span>
          <a href="/staff" style={{ marginLeft: "auto", font: "var(--type-caption)", color: "var(--text-muted)" }}>
            {pick(lang, bi("कर्मचारी लॉगिन", "Staff login"))}
          </a>
        </div>
      </div>
    </footer>
  );
}
