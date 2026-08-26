"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Tag } from "@/components/ui/Tag";

const TENDERS = [
  {
    ref: "MPeTender/2026-27/GAD/001",
    dept: bi("सामान्य प्रशासन विभाग", "General Administration Dept."),
    title: bi("प्रमाण पोर्टल — वार्षिक रखरखाव अनुबंध (AMC)", "Praman portal — Annual Maintenance Contract (AMC)"),
    value: "₹18,00,000",
    close: "2026-09-15",
    status: bi("खुला", "Open"),
    tone: "success" as const,
  },
  {
    ref: "MPeTender/2026-27/NIC/042",
    dept: bi("NIC — MP राज्य केंद्र", "NIC — MP State Centre"),
    title: bi("डेटा सेंटर नेटवर्क उपकरण आपूर्ति", "Data centre network equipment supply"),
    value: "₹52,00,000",
    close: "2026-09-20",
    status: bi("खुला", "Open"),
    tone: "success" as const,
  },
  {
    ref: "MPeTender/2026-27/REV/008",
    dept: bi("राजस्व विभाग", "Revenue Dept."),
    title: bi("भू-अभिलेख डिजिटाइज़ेशन — रायसेन जिला", "Land record digitisation — Raisen district"),
    value: "₹24,50,000",
    close: "2026-09-30",
    status: bi("खुला", "Open"),
    tone: "success" as const,
  },
  {
    ref: "MPeTender/2026-27/ED/019",
    dept: bi("स्कूल शिक्षा विभाग", "School Education Dept."),
    title: bi("डिजिटल पाठ्यपुस्तक पोर्टल — कंटेंट अपलोड सेवा", "Digital textbook portal — content upload service"),
    value: "₹9,75,000",
    close: "2026-08-31",
    status: bi("बंद", "Closed"),
    tone: "error" as const,
  },
  {
    ref: "MPeTender/2026-27/SJD/003",
    dept: bi("सामाजिक न्याय विभाग", "Social Justice Dept."),
    title: bi("पेंशन वितरण प्रणाली — सॉफ्टवेयर अपग्रेड", "Pension disbursement system — software upgrade"),
    value: "₹31,00,000",
    close: "2026-10-05",
    status: bi("खुला", "Open"),
    tone: "success" as const,
  },
];

export default function TendersPage() {
  const { lang } = useLang();

  function formatDate(d: string) {
    const dt = new Date(d);
    return lang === "hi"
      ? dt.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })
      : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>
              {pick(lang, bi("मध्य प्रदेश ई-प्रोक्योरमेंट", "MP e-Procurement"))}
            </div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("निविदाएँ", "Tenders"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "प्रमाण और संबंधित प्रणालियों के लिए जारी नवीनतम निविदाएँ। पूर्ण सूची के लिए राज्य ई-प्रोक्योरमेंट पोर्टल देखें।",
                "Latest tenders issued for Praman and related systems. For the complete list visit the state e-Procurement portal."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          <SectionHeading>{pick(lang, bi("हालिया निविदाएँ", "Recent tenders"))}</SectionHeading>

          <div style={{ border: "1px solid var(--border-default)", overflowX: "auto", marginBottom: 40 }}>
            <div style={{ minWidth: 760 }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 120px 110px 90px", background: "var(--ink-900)", color: "var(--ink-0)", font: "var(--type-label)", fontSize: "var(--text-sm)" }}>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("संदर्भ क्रमांक", "Ref. no."))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("विषय", "Subject"))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("अनुमानित मूल्य", "Est. value"))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("अंतिम तिथि", "Close date"))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("स्थिति", "Status"))}</div>
              </div>
              {TENDERS.map((t, i) => (
                <div key={t.ref} style={{ display: "grid", gridTemplateColumns: "200px 1fr 120px 110px 90px", borderTop: "1px solid var(--border-default)", background: i % 2 ? "var(--ink-50)" : "var(--ink-0)", alignItems: "start" }}>
                  <div style={{ padding: "14px 16px" }}>
                    <div className="mono" style={{ fontSize: 12, color: "var(--ink-700)", marginBottom: 4 }}>{t.ref}</div>
                    <div style={{ font: "var(--type-caption)", color: "var(--text-muted)" }}>{pick(lang, t.dept)}</div>
                  </div>
                  <div style={{ padding: "14px 16px", font: "var(--type-body-sm)", color: "var(--ink-900)" }}>{pick(lang, t.title)}</div>
                  <div style={{ padding: "14px 16px", font: "600 14px var(--font-sans)", color: "var(--ink-900)" }}>{t.value}</div>
                  <div style={{ padding: "14px 16px", font: "var(--type-body-sm)", color: "var(--ink-700)" }}>{formatDate(t.close)}</div>
                  <div style={{ padding: "14px 16px" }}>
                    <Tag tone={t.tone}>{pick(lang, t.status)}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Callout tone="info" title={pick(lang, bi("ई-प्रोक्योरमेंट पोर्टल", "e-Procurement portal"))}>
            <p style={{ margin: "0 0 12px" }}>
              {pick(lang, bi(
                "उपरोक्त सूची प्रतिनिधि है। मध्य प्रदेश सरकार की सभी निविदाएँ राज्य ई-प्रोक्योरमेंट पोर्टल (eproc.mp.gov.in) पर प्रकाशित होती हैं। निविदा में भाग लेने के लिए वहाँ पंजीकरण आवश्यक है।",
                "The above list is representative. All tenders of the Government of Madhya Pradesh are published on the state e-Procurement portal (eproc.mp.gov.in). Registration there is required to participate in a tender."
              ))}
            </p>
            <div style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>
              {pick(lang, bi("हेल्पडेस्क: ", "Helpdesk: "))}
              <a href="tel:181" style={{ color: "var(--blue-600)" }}>181</a>
              {pick(lang, bi(" · NIC ई-प्रोक्योरमेंट हेल्पडेस्क: 0755-6720200", " · NIC e-Procurement helpdesk: 0755-6720200"))}
            </div>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
