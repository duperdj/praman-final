"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SCHEMES = [
  { t: bi("मुख्यमंत्री सीखो-कमाओ योजना", "CM Seekho-Kamao Yojana"), d: bi("उद्योगों में सवैतनिक कौशल प्रशिक्षण — प्रशिक्षण के साथ मासिक भत्ता।", "Paid on-the-job skill training in industry — a monthly stipend while you learn.") },
  { t: bi("औद्योगिक प्रशिक्षण (ITI)", "Industrial Training (ITI)"), d: bi("वेल्डिंग, फिटर, इलेक्ट्रीशियन जैसे ट्रेडों में प्रमाणित प्रशिक्षण।", "Certified training in trades like welding, fitter and electrician.") },
  { t: bi("प्रधानमंत्री कौशल विकास", "PM Kaushal Vikas"), d: bi("अल्पकालिक कौशल पाठ्यक्रम और प्रमाणन।", "Short-term skilling courses and certification.") },
  { t: bi("स्वरोज़गार ऋण", "Self-employment loan"), d: bi("सूक्ष्म उद्यम शुरू करने के लिए ब्याज-अनुदान सहित ऋण।", "Interest-subsidised loans to start a micro-enterprise.") },
];

export default function EmploymentPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader active="schemes" />
      <main id="main">
        {/* Hero band — factory worker */}
        <section className="hero">
          <div className="hero-media">
            <Image src="/images/employment-factory.jpg" alt={pick(lang, bi("कारखाने में कर्मचारी", "A factory worker"))} fill sizes="100vw" priority quality={60} style={{ objectFit: "cover", objectPosition: "center 45%" }} />
            <div className="hero-scrim" />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <div className="container" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ maxWidth: 640 }}>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,.85)" }}>{pick(lang, bi("कौशल एवं रोज़गार विभाग", "Skills & Employment Department"))}</div>
                <h1 className="h-hero" style={{ color: "var(--ink-0)", margin: "14px 0 0" }}>{pick(lang, bi("कौशल से रोज़गार तक", "From skilling to a job"))}</h1>
                <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0" }}>
                  {pick(lang, bi("प्रशिक्षण, अप्रेंटिसशिप और स्वरोज़गार योजनाओं के लिए पंजीकरण करें। कई योजनाओं के लिए एक आय प्रमाण पत्र ही पर्याप्त है।", "Register for training, apprenticeships and self-employment schemes. For many, an income certificate is all you need."))}
                </p>
                <div style={{ marginTop: 24 }}>
                  <Button href="/apply" variant="inverse" size="lg" iconAfter="arrow-right">{pick(lang, bi("आय प्रमाण पत्र बनाएँ", "Get an income certificate"))}</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <SectionHeading>{pick(lang, bi("प्रशिक्षण और रोज़गार योजनाएँ", "Training & employment schemes"))}</SectionHeading>
          <div className="grid grid-2">
            {SCHEMES.map((s) => (
              <Card key={s.t.en} icon="briefcase" title={pick(lang, s.t)} description={pick(lang, s.d)} href="/apply" />
            ))}
          </div>
        </section>

        {/* Industrial training gallery */}
        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <SectionHeading>{pick(lang, bi("प्रशिक्षण जो काम दिलाता है", "Training that leads to work"))}</SectionHeading>
          <div className="grid grid-3">
            {[
              { img: "/images/employment-welding.jpg", t: bi("वेल्डिंग एवं फैब्रिकेशन", "Welding & fabrication"), tag: bi("ITI प्रमाणित", "ITI certified") },
              { img: "/images/employment-factory.jpg", t: bi("कारखाना प्रशिक्षण", "Shop-floor training"), tag: bi("सीखो-कमाओ", "Seekho-Kamao") },
              { img: "/images/employment-plumber.jpg", t: bi("प्लम्बिंग एवं सेवाएँ", "Plumbing & services"), tag: bi("कौशल विकास", "Kaushal Vikas") },
            ].map((c) => (
              <article key={c.img} className="hairline" style={{ background: "var(--ink-0)" }}>
                <div className="media ratio-4-3">
                  <Image src={c.img} alt={pick(lang, c.t)} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "var(--space-5)" }}>
                  <div style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, c.t)}</div>
                  <div style={{ font: "var(--type-caption)", color: "var(--text-muted)", marginTop: 4 }}>{pick(lang, c.tag)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
