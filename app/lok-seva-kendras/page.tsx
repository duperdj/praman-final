"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";

const KENDRAS = [
  { district: "भोपाल", en: "Bhopal", address: bi("कलेक्टर परिसर, अरेरा हिल्स, भोपाल — 462011", "Collectorate Campus, Arera Hills, Bhopal — 462011"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("सभी 50+ सेवाएँ", "All 50+ services") },
  { district: "इंदौर", en: "Indore", address: bi("एमजी रोड, कलेक्टर भवन, इंदौर — 452001", "MG Road, Collector Building, Indore — 452001"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("सभी 50+ सेवाएँ", "All 50+ services") },
  { district: "ग्वालियर", en: "Gwalior", address: bi("जयेंद्रगंज, ग्वालियर — 474009", "Jayendraganj, Gwalior — 474009"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("सभी 50+ सेवाएँ", "All 50+ services") },
  { district: "जबलपुर", en: "Jabalpur", address: bi("रसेल चौक, जबलपुर — 482001", "Russell Chowk, Jabalpur — 482001"), hours: bi("सोमवार–शनिवार 9:30–17:00", "Mon–Sat 09:30–17:00"), services: bi("सभी 50+ सेवाएँ", "All 50+ services") },
  { district: "उज्जैन", en: "Ujjain", address: bi("कलेक्टर परिसर, माधव क्लब रोड, उज्जैन — 456001", "Collectorate Campus, Madhav Club Road, Ujjain — 456001"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("सभी 50+ सेवाएँ", "All 50+ services") },
  { district: "सागर", en: "Sagar", address: bi("कलेक्टर ऑफिस परिसर, सागर — 470001", "Collectorate Campus, Sagar — 470001"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("40+ सेवाएँ", "40+ services") },
  { district: "रीवा", en: "Rewa", address: bi("एकता परिसर, पुराना स्टेशन, रीवा — 486001", "Ekta Campus, Old Station, Rewa — 486001"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("40+ सेवाएँ", "40+ services") },
  { district: "सीहोर", en: "Sehore", address: bi("कलेक्टरेट परिसर, सीहोर — 466001", "Collectorate Campus, Sehore — 466001"), hours: bi("सोमवार–शनिवार 9:00–17:30", "Mon–Sat 09:00–17:30"), services: bi("35+ सेवाएँ", "35+ services") },
  { district: "देवास", en: "Dewas", address: bi("राजगढ़ रोड, देवास — 455001", "Rajgarh Road, Dewas — 455001"), hours: bi("सोमवार–शनिवार 9:30–17:00", "Mon–Sat 09:30–17:00"), services: bi("35+ सेवाएँ", "35+ services") },
  { district: "सतना", en: "Satna", address: bi("कलेक्टर परिसर, सतना — 485001", "Collectorate Campus, Satna — 485001"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("40+ सेवाएँ", "40+ services") },
  { district: "रायसेन", en: "Raisen", address: bi("कलेक्टरेट भवन, रायसेन — 464551", "Collectorate Building, Raisen — 464551"), hours: bi("सोमवार–शनिवार 9:30–17:00", "Mon–Sat 09:30–17:00"), services: bi("35+ सेवाएँ", "35+ services") },
  { district: "छतरपुर", en: "Chhatarpur", address: bi("कलेक्टरेट परिसर, छतरपुर — 471001", "Collectorate Campus, Chhatarpur — 471001"), hours: bi("सोमवार–शनिवार 9:00–17:00", "Mon–Sat 09:00–17:00"), services: bi("35+ सेवाएँ", "35+ services") },
];

export default function LokSevaKendrasPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero with image */}
        <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
          <Image
            src="/images/lok-seva-kendra.jpg"
            alt={pick(lang, bi("लोक सेवा केंद्र", "Lok Seva Kendra"))}
            fill sizes="100vw" priority style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.2), rgba(0,0,0,.7))" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div className="container" style={{ padding: "28px var(--gutter)" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,.8)", marginBottom: 8 }}>
                {pick(lang, bi("मध्य प्रदेश शासन", "Government of Madhya Pradesh"))}
              </div>
              <h1 className="h-page" style={{ color: "var(--ink-0)", margin: 0 }}>
                {pick(lang, bi("लोक सेवा केंद्र", "Lok Seva Kendras"))}
              </h1>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          {/* What are they */}
          <div style={{ maxWidth: "72ch", marginBottom: 40 }}>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>
              {pick(lang, bi(
                "लोक सेवा केंद्र (LSK) मध्य प्रदेश शासन के सिंगल-विंडो सेवा केंद्र हैं जो नागरिकों को सरकारी सेवाएँ ऑफलाइन प्रदान करते हैं। ये प्रत्येक जिले के कलेक्टरेट परिसर में स्थित हैं।",
                "Lok Seva Kendras (LSKs) are the Government of Madhya Pradesh's single-window service centres providing government services to citizens offline. They are located in the collectorate campus of each district."
              ))}
            </p>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>
              {pick(lang, bi(
                "LSK पर आप आय प्रमाण पत्र, मूल निवासी, जाति, जन्म-मृत्यु-विवाह पंजीकरण, भू-अभिलेख और अन्य 50+ सेवाओं के लिए आवेदन कर सकते हैं। प्रशिक्षित ऑपरेटर आपकी मदद के लिए उपलब्ध हैं।",
                "At an LSK you can apply for income, domicile, caste, birth-death-marriage registration, land records and 50+ other services. Trained operators are available to assist you."
              ))}
            </p>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: 0 }}>
              {pick(lang, bi(
                "लोक सेवा गारंटी अधिनियम, 2010 के तहत LSK पर दी गई सेवाओं के लिए भी समय-सीमा लागू होती है। देरी पर ₹250 प्रति दिन जुर्माना आपके पक्ष में।",
                "The Public Services Guarantee Act 2010 applies to services delivered via LSK as well. Delays attract ₹250 per day in your favour."
              ))}
            </p>
          </div>

          <SectionHeading>{pick(lang, bi("जिलेवार केंद्र सूची", "District-wise centre list"))}</SectionHeading>

          <div style={{ border: "1px solid var(--border-default)", overflowX: "auto", marginBottom: 40 }}>
            <div style={{ minWidth: 700 }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 160px 120px", background: "var(--ink-900)", color: "var(--ink-0)", font: "var(--type-label)", fontSize: "var(--text-sm)" }}>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("जिला", "District"))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("पता", "Address"))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("समय", "Hours"))}</div>
                <div style={{ padding: "12px 16px" }}>{pick(lang, bi("सेवाएँ", "Services"))}</div>
              </div>
              {KENDRAS.map((k, i) => (
                <div key={k.en} style={{ display: "grid", gridTemplateColumns: "120px 1fr 160px 120px", borderTop: "1px solid var(--border-default)", background: i % 2 ? "var(--ink-50)" : "var(--ink-0)" }}>
                  <div style={{ padding: "12px 16px", font: "600 14px var(--font-sans)", color: "var(--ink-900)" }}>
                    {lang === "hi" ? k.district : k.en}
                  </div>
                  <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--ink-700)" }}>{pick(lang, k.address)}</div>
                  <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--ink-700)" }}>{pick(lang, k.hours)}</div>
                  <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--blue-600)", fontWeight: 600 }}>{pick(lang, k.services)}</div>
                </div>
              ))}
            </div>
          </div>

          <Callout tone="info" title={pick(lang, bi("ऑनलाइन आवेदन — घर से", "Apply online — from home"))}>
            <p style={{ margin: "0 0 12px" }}>
              {pick(lang, bi(
                "अधिकांश सेवाएँ प्रमाण पोर्टल पर ऑनलाइन उपलब्ध हैं — LSK पर जाने की ज़रूरत नहीं। केवल दस्तावेज़ सत्यापन वाली सेवाओं के लिए लोक सेवा केंद्र जाएँ।",
                "Most services are available online on the Praman portal — no need to visit an LSK. Visit a Lok Seva Kendra only for document-verification services."
              ))}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/services" style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--blue-600)", textDecoration: "underline" }}>
                {pick(lang, bi("ऑनलाइन सेवाएँ देखें →", "Browse online services →"))}
              </a>
            </div>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
