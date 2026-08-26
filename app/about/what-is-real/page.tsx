"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import type { Bilingual } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Callout } from "@/components/ui/Callout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

const STEPS: { icon: string; title: Bilingual; body: Bilingual }[] = [
  { icon: "file-text", title: bi("आप आवेदन करते हैं", "You apply"), body: bi("मोबाइल नंबर और OTP से साइन इन करें और छोटा फ़ॉर्म भरें। कोई पासवर्ड नहीं, कोई कैप्चा नहीं।", "Sign in with your mobile number and an OTP, and fill a short form. No password, no captcha.") },
  { icon: "shield-check", title: bi("अभिलेखों से मिलान", "Records are checked"), body: bi("आपकी जानकारी उन सरकारी अभिलेखों से मिलाई जाती है जो राज्य के पास पहले से हैं — आधार, समग्र, भू-अभिलेख, राशन और पूर्व प्रमाण पत्र।", "Your details are checked against records the state already holds — Aadhaar, Samagra, land, ration and prior certificates.") },
  { icon: "circle-check", title: bi("तुरंत निर्णय", "An instant decision"), body: bi("मेल खाने पर प्रमाण पत्र सेकंडों में जारी। किसी विरोधाभास पर आवेदन अधिकारी के पास स्पष्ट कारण के साथ जाता है — कुछ भी चुपचाप लंबित नहीं रहता।", "On a match the certificate issues in seconds. On a discrepancy it goes to an officer with a clear reason — nothing silently pends.") },
  { icon: "clock", title: bi("वैधानिक घड़ी", "The statutory clock"), body: bi("लोक सेवा गारंटी अधिनियम के तहत निर्णय की समय-सीमा दिखती है। देरी पर ₹250/दिन जुर्माना आपके पक्ष में और अपील स्वतः तैयार।", "Under the Public Services Guarantee Act the deadline is visible. If it's missed, ₹250/day accrues in your favour and the appeal is drafted automatically.") },
];

const SOURCES: { name: Bilingual; use: Bilingual; system: string }[] = [
  { name: bi("आधार", "Aadhaar"), use: bi("नाम व जन्मतिथि सत्यापन, OTP", "Name & DOB verification, OTP"), system: "UIDAI" },
  { name: bi("समग्र", "Samagra"), use: bi("परिवार व निवास, eKYC स्थिति", "Family & residence, eKYC status"), system: "samagra.gov.in" },
  { name: bi("भू-अभिलेख", "Land records"), use: bi("जोत का आकार व अनुमानित आय", "Holding size & estimated income"), system: "mpbhulekh.gov.in" },
  { name: bi("राशन", "Ration"), use: bi("कार्ड श्रेणी (APL/BPL/AAY)", "Card category (APL/BPL/AAY)"), system: "nfsa.gov.in" },
  { name: bi("पूर्व प्रमाण पत्र", "Prior certificates"), use: bi("दोहराव व घोषित आय में बदलाव", "Duplicates & income changes"), system: "e-District" },
];

export default function HowItWorksPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader active="about" />
      <main id="main" className="container" style={{ padding: "40px var(--gutter) 80px", maxWidth: 900 }}>
        <div className="eyebrow" style={{ color: "var(--blue-500)" }}>{pick(lang, bi("यह कैसे काम करता है", "How it works"))}</div>
        <h1 className="h-page" style={{ marginTop: 8 }}>{pick(lang, bi("भरोसेमंद, तेज़ और पारदर्शी", "Trusted, fast and transparent"))}</h1>
        <p style={{ font: "var(--type-body)", color: "var(--ink-800)", marginTop: 12, maxWidth: "66ch" }}>
          {pick(lang, bi("प्रमाण आपके आवेदन को उन अभिलेखों से जाँचता है जो सरकार के पास पहले से हैं, ताकि साफ़ मामले तुरंत निपटें और केवल असामान्य मामलों में ही मानवीय जाँच हो — हर कदम आपको दिखता है।", "Praman checks your application against records the government already holds, so clean cases settle instantly and a human reviews only the anomalies — with every step visible to you."))}
        </p>

        <div className="grid grid-2" style={{ marginTop: 32 }}>
          {STEPS.map((s) => (
            <div key={s.title.en} className="hairline" style={{ background: "var(--ink-0)", padding: "var(--space-6)" }}>
              <Icon name={s.icon} size="lg" style={{ color: "var(--blue-500)", marginBottom: 10 }} />
              <div style={{ font: "var(--type-h3)", marginBottom: 6 }}>{pick(lang, s.title)}</div>
              <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>{pick(lang, s.body)}</p>
            </div>
          ))}
        </div>

        <SectionHeading style={{ marginTop: 48 }}>{pick(lang, bi("आपकी निजता", "Your privacy"))}</SectionHeading>
        <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "70ch" }}>
          <li style={{ marginBottom: 8 }}>{pick(lang, bi("प्रत्येक रजिस्ट्री जाँच से पहले आपकी सहमति ली जाती है।", "Your consent is taken before each registry check."))}</li>
          <li style={{ marginBottom: 8 }}>{pick(lang, bi("न्यूनतम साझाकरण — डाउनस्ट्रीम सेवाओं को केवल हाँ/नहीं मिलता है, आपकी वास्तविक आय नहीं।", "Data minimisation — downstream services get only a yes/no, never your actual income."))}</li>
          <li style={{ marginBottom: 8 }}>{pick(lang, bi("हर पहुँच का ऑडिट लॉग रखा जाता है।", "Every access is written to an audit log."))}</li>
          <li style={{ marginBottom: 8 }}>{pick(lang, bi("कोई पासवर्ड नहीं — केवल फ़ोन और OTP।", "No passwords — just your phone and an OTP."))}</li>
        </ul>

        <SectionHeading style={{ marginTop: 40 }}>{pick(lang, bi("अभिलेख स्रोत", "Record sources"))}</SectionHeading>
        <div style={{ border: "1px solid var(--ink-200)", overflowX: "auto" }}>
          <div style={{ minWidth: 560 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", background: "var(--ink-900)", color: "var(--ink-0)", font: "var(--type-label)", fontSize: "var(--text-sm)" }}>
              <div style={{ padding: "12px 16px" }}>{pick(lang, bi("अभिलेख", "Record"))}</div>
              <div style={{ padding: "12px 16px" }}>{pick(lang, bi("किसलिए जाँचा जाता है", "What it checks"))}</div>
              <div style={{ padding: "12px 16px" }}>{pick(lang, bi("प्रणाली", "System"))}</div>
            </div>
            {SOURCES.map((r, i) => (
              <div key={r.system} style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", borderTop: "1px solid var(--ink-200)", background: i % 2 ? "var(--ink-50)" : "var(--ink-0)" }}>
                <div style={{ padding: "12px 16px", font: "600 15px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, r.name)}</div>
                <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--ink-700)" }}>{pick(lang, r.use)}</div>
                <div style={{ padding: "12px 16px" }} className="mono">{r.system}</div>
              </div>
            ))}
          </div>
        </div>

        <Callout tone="info" title={pick(lang, bi("मूल्यांकन बिल्ड", "Evaluation build"))} style={{ marginTop: 32 }}>
          {pick(lang, bi("यह संस्करण नमूना अभिलेखों पर चलता है ताकि आप पूरी सेवा आज़मा सकें। तैनाती के समय ऊपर दी गई वास्तविक सरकारी APIs जोड़ी जाती हैं — प्रवाह वही रहता है।", "This version runs on sample records so you can try the full service. On deployment the real government APIs above are connected — the flow stays the same."))}
        </Callout>
      </main>
      <SiteFooter />
    </>
  );
}
