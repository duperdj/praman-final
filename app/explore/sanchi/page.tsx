"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";

const TIMELINE = [
  { year: bi("तीसरी शताब्दी ई.पू.", "3rd century BCE"), event: bi("सम्राट अशोक ने बुद्ध के अवशेषों पर मूल ईंट स्तूप बनवाया।", "Emperor Ashoka builds the original brick stupa over relics of the Buddha.") },
  { year: bi("दूसरी–पहली शताब्दी ई.पू.", "2nd–1st century BCE"), event: bi("सातवाहन शासनकाल में पत्थर के तोरण (द्वार) जोड़े गए — उत्तर, दक्षिण, पूर्व और पश्चिम।", "Satavahana rulers add stone toranas (gateways) — North, South, East and West — carved with Jataka tales.") },
  { year: bi("बारहवीं शताब्दी ई.", "12th century CE"), event: bi("स्थल का परित्याग हो गया और जंगल में खो गया।", "The site is abandoned and lost to the jungle.") },
  { year: bi("1818 ई.", "1818 CE"), event: bi("ब्रिटिश अधिकारी जनरल टेलर ने इसकी पुनः खोज की।", "British officer General Taylor rediscovers the site.") },
  { year: bi("1912–1919 ई.", "1912–1919 CE"), event: bi("जॉन मार्शल के नेतृत्व में ASI ने व्यापक उत्खनन और संरक्षण किया।", "ASI under John Marshall carries out extensive excavation and conservation.") },
  { year: bi("1989 ई.", "1989 CE"), event: bi("यूनेस्को ने साँची को विश्व धरोहर स्थल घोषित किया।", "UNESCO designates Sanchi a World Heritage Site.") },
];

const FACTS = [
  { label: bi("ऊँचाई (स्तूप 1)", "Height (Stupa 1)"), value: "16.46 m" },
  { label: bi("व्यास", "Diameter"), value: "36.6 m" },
  { label: bi("तोरण (द्वार)", "Toranas"), value: bi("4 (उत्तर, दक्षिण, पूर्व, पश्चिम)", "4 (N, S, E, W)") },
  { label: bi("स्थान", "Location"), value: bi("रायसेन जिला, मध्य प्रदेश", "Raisen district, Madhya Pradesh") },
  { label: bi("भोपाल से दूरी", "From Bhopal"), value: "46 km" },
  { label: bi("निकटतम रेलवे स्टेशन", "Nearest railway"), value: bi("साँची (भोपाल–जबलपुर लाइन)", "Sanchi (Bhopal–Jabalpur line)") },
];

export default function SanchiPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
          <Image
            src="/images/sanchi.jpg"
            alt={pick(lang, bi("साँची का महान स्तूप", "The Great Stupa at Sanchi"))}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.65) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div className="container" style={{ padding: "32px var(--gutter)" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,.8)", marginBottom: 8 }}>
                {pick(lang, bi("यूनेस्को विश्व धरोहर · जिला रायसेन", "UNESCO World Heritage · Raisen District"))}
              </div>
              <h1 className="h-page" style={{ color: "var(--ink-0)", margin: 0 }}>
                {pick(lang, bi("साँची का महान स्तूप", "The Great Stupa at Sanchi"))}
              </h1>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 960 }}>
          {/* Intro */}
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "72ch", marginBottom: 32 }}>
            {pick(lang, bi(
              "साँची का महान स्तूप भारत के सबसे पुराने पत्थर के स्थापत्य में से एक है और बौद्ध कला एवं वास्तुकला का अनुपम उदाहरण है। तीसरी शताब्दी ई.पू. में सम्राट अशोक द्वारा निर्मित यह स्तूप भगवान बुद्ध की शिक्षाओं और मौर्य साम्राज्य की महानता का जीवंत प्रमाण है।",
              "The Great Stupa at Sanchi is one of India's oldest stone structures and a supreme example of Buddhist art and architecture. Built by Emperor Ashoka in the third century BCE, it stands as living testimony to the teachings of the Buddha and the glory of the Maurya empire."
            ))}
          </p>

          {/* Quick facts */}
          <SectionHeading>{pick(lang, bi("मुख्य तथ्य", "Quick facts"))}</SectionHeading>
          <div style={{ border: "1px solid var(--border-default)", overflowX: "auto", marginBottom: 48 }}>
            <div style={{ minWidth: 400 }}>
              {FACTS.map((f, i) => (
                <div key={f.value.toString()} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < FACTS.length - 1 ? "1px solid var(--border-default)" : "none", background: i % 2 ? "var(--ink-50)" : "var(--ink-0)" }}>
                  <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--ink-700)", fontWeight: 600 }}>{pick(lang, f.label)}</div>
                  <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--ink-900)" }}>{typeof f.value === "string" ? f.value : pick(lang, f.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The Toranas */}
          <SectionHeading>{pick(lang, bi("तोरण — जातक कथाओं की दीवारें", "The Toranas — walls of Jataka tales"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "72ch", marginBottom: 16 }}>
            {pick(lang, bi(
              "साँची के चार तोरण (उत्तर, दक्षिण, पूर्व, पश्चिम) बौद्ध कला की सर्वोच्च उपलब्धि मानी जाती हैं। इन पर बुद्ध के पूर्व जन्म की कहानियाँ (जातक), उनके जीवन के प्रमुख प्रसंग और प्रतीकात्मक चित्रण उकेरे गए हैं। उत्तरी तोरण पर महामाया का स्वप्न और बोधि वृक्ष के दृश्य विशेष रूप से उल्लेखनीय हैं।",
              "Sanchi's four toranas (North, South, East, West) are considered the pinnacle of Buddhist sculptural art. Carved onto them are Jataka tales (stories of the Buddha's past lives), key episodes from his life, and symbolic representations. The North torana's depictions of Queen Maya's dream and the Bodhi tree are especially renowned."
            ))}
          </p>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "72ch", marginBottom: 48 }}>
            {pick(lang, bi(
              "ध्यान देने योग्य है कि इन शुरुआती बौद्ध शिल्पों में बुद्ध को कभी मानवरूप में नहीं दिखाया गया — उनकी उपस्थिति प्रतीकों से व्यक्त होती है: पदचिह्न, छत्र, खाली सिंहासन और बोधि वृक्ष। यह अनुपस्थिति स्वयं एक गहन कलात्मक और दार्शनिक बयान है।",
              "Notably, in these early Buddhist carvings the Buddha is never depicted in human form — his presence is conveyed through symbols: footprints, a parasol, an empty throne and the Bodhi tree. This deliberate absence is itself a profound artistic and philosophical statement."
            ))}
          </p>

          {/* Timeline */}
          <SectionHeading>{pick(lang, bi("इतिहास की झलक", "Timeline"))}</SectionHeading>
          <div style={{ marginBottom: 48 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "var(--space-6)", paddingBottom: "var(--space-6)", borderBottom: i < TIMELINE.length - 1 ? "1px solid var(--border-default)" : "none", marginBottom: i < TIMELINE.length - 1 ? "var(--space-6)" : 0 }}>
                <div style={{ font: "600 14px var(--font-sans)", color: "var(--blue-600)" }}>{pick(lang, t.year)}</div>
                <div style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, t.event)}</div>
              </div>
            ))}
          </div>

          {/* Visit info */}
          <SectionHeading>{pick(lang, bi("यात्रा की जानकारी", "Visitor information"))}</SectionHeading>
          <div className="grid grid-2" style={{ gap: "var(--space-6)", marginBottom: 40 }}>
            <div className="card-flat" style={{ padding: "var(--space-7)" }}>
              <h3 style={{ font: "var(--type-h3)", margin: "0 0 8px" }}>{pick(lang, bi("प्रवेश शुल्क", "Entry fees"))}</h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px", font: "var(--type-body-sm)", color: "var(--ink-800)" }}>
                <li>{pick(lang, bi("भारतीय नागरिक: ₹40", "Indian citizens: ₹40"))}</li>
                <li>{pick(lang, bi("SAARC नागरिक: ₹40", "SAARC nationals: ₹40"))}</li>
                <li>{pick(lang, bi("विदेशी: ₹600", "Foreign visitors: ₹600"))}</li>
                <li>{pick(lang, bi("15 वर्ष से कम: निःशुल्क", "Under 15 years: Free"))}</li>
              </ul>
            </div>
            <div className="card-flat" style={{ padding: "var(--space-7)" }}>
              <h3 style={{ font: "var(--type-h3)", margin: "0 0 8px" }}>{pick(lang, bi("समय और पहुँच", "Hours and access"))}</h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px", font: "var(--type-body-sm)", color: "var(--ink-800)" }}>
                <li>{pick(lang, bi("प्रतिदिन सुबह 6:30 से शाम 5:30 बजे", "Open daily 06:30–17:30"))}</li>
                <li>{pick(lang, bi("ASI संग्रहालय: शुक्रवार बंद", "ASI Museum: closed Fridays"))}</li>
                <li>{pick(lang, bi("भोपाल से 46 किमी · NH-146", "46 km from Bhopal · NH-146"))}</li>
                <li>{pick(lang, bi("साँची रेलवे स्टेशन: 2 किमी", "Sanchi railway station: 2 km"))}</li>
              </ul>
            </div>
          </div>

          <Callout tone="info" title={pick(lang, bi("यात्रा से पहले प्रमाण पत्र बनवाएँ", "Get your certificates before you travel"))}>
            <p style={{ margin: "0 0 12px" }}>
              {pick(lang, bi(
                "छात्र टूर, पुरातत्व रुचि या सरकारी योजना में भाग लेने के लिए आय, निवास या जाति प्रमाण पत्र की आवश्यकता हो सकती है। प्रमाण से इन्हें घर बैठे प्राप्त करें — निकटतम लोक सेवा केंद्र रायसेन कलेक्टरेट।",
                "School trips, archaeological interest or participation in government schemes may require income, domicile or caste certificates. Get them from home via Praman — nearest Lok Seva Kendra at Raisen Collectorate."
              ))}
            </p>
            <Button href="/services" variant="primary" size="sm" iconAfter="arrow-right">
              {pick(lang, bi("प्रमाण पत्र के लिए आवेदन करें", "Apply for a certificate"))}
            </Button>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
