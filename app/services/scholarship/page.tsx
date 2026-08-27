"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SCHEMES = [
  { t: bi("पोस्ट-मैट्रिक छात्रवृत्ति", "Post-Matric scholarship"), d: bi("कक्षा 11 से स्नातकोत्तर तक SC/ST/OBC विद्यार्थियों के लिए।", "For SC/ST/OBC students from Class 11 to post-graduation.") },
  { t: bi("प्री-मैट्रिक छात्रवृत्ति", "Pre-Matric scholarship"), d: bi("कक्षा 9–10 के विद्यार्थियों हेतु शुल्क व पुस्तक सहायता।", "Fees and book support for students in Classes 9–10.") },
  { t: bi("गाँव की बेटी योजना", "Gaon Ki Beti Yojana"), d: bi("गाँव की छात्राओं को उच्च शिक्षा हेतु मासिक सहायता।", "Monthly support for rural girls pursuing higher education.") },
  { t: bi("मेधावी विद्यार्थी योजना", "Medhavi Vidyarthi Yojana"), d: bi("मेधावी विद्यार्थियों की कॉलेज फीस राज्य वहन करता है।", "The state covers college fees for meritorious students.") },
];

export default function ScholarshipPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader active="schemes" />
      <main id="main">
        {/* Hero band with rural students */}
        <section className="hero">
          <div className="hero-media">
            <Image src="/images/scholarship-students.jpg" alt={pick(lang, bi("पढ़ते हुए ग्रामीण विद्यार्थी", "Rural students studying"))} fill sizes="100vw" priority quality={60} style={{ objectFit: "cover", objectPosition: "center 40%" }} />
            <div className="hero-scrim" />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <div className="container" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ maxWidth: 640 }}>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,.85)" }}>{pick(lang, bi("शिक्षा विभाग · Education", "Education Department"))}</div>
                <h1 className="h-hero" style={{ color: "var(--ink-0)", margin: "14px 0 0" }}>{pick(lang, bi("हर योग्य छात्र तक छात्रवृत्ति", "A scholarship for every eligible student"))}</h1>
                <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0" }}>
                  {pick(lang, bi("पात्रता जाँचें और आवेदन करें। अधिकांश छात्रवृत्तियों के लिए केवल एक आय प्रमाण पत्र चाहिए — जो यहीं मिनटों में बनता है।", "Check eligibility and apply. Most scholarships need only an income certificate — which you can get here in minutes."))}
                </p>
                <div style={{ marginTop: 24 }}>
                  <Button href="/apply" variant="inverse" size="lg" iconAfter="arrow-right">{pick(lang, bi("आय प्रमाण पत्र बनाएँ", "Get an income certificate"))}</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <Callout tone="info" title={pick(lang, bi("आय प्रमाण पत्र क्यों?", "Why an income certificate?"))}>
            {pick(lang, bi("लगभग हर छात्रवृत्ति के लिए परिवार की वार्षिक आय का प्रमाण अनिवार्य है। प्रमाण को PDF की तरह अपलोड करने के बजाय, पोर्टल सीधे यह पूछ सकता है — “क्या यह परिवार ₹ 2.5 लाख से कम है?” और हस्ताक्षरित उत्तर पा सकता है।", "Almost every scholarship needs proof of family income. Instead of uploading a PDF, a portal can ask directly — 'is this family under ₹2.5 lakh?' — and get a signed answer."))}
            <div style={{ marginTop: 12 }}>
              <Button href="/verify" variant="outline" size="md" iconAfter="arrow-right">{pick(lang, bi("यह कैसे काम करता है देखें", "See how that works"))}</Button>
            </div>
          </Callout>
        </section>

        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <SectionHeading>{pick(lang, bi("प्रमुख छात्रवृत्ति योजनाएँ", "Major scholarship schemes"))}</SectionHeading>
          <div className="grid grid-2">
            {SCHEMES.map((s) => (
              <Card key={s.t.en} icon="graduation-cap" title={pick(lang, s.t)} description={pick(lang, s.d)} href="/apply" />
            ))}
          </div>
        </section>

        {/* Feature photo — rural kids */}
        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <div className="grid grid-2-1" style={{ alignItems: "center" }}>
            <article className="card-flat">
              <div className="media ratio-3-2">
                <Image src="/images/scholarship-kids.jpg" alt={pick(lang, bi("कक्षा में ग्रामीण बच्चे", "Rural children in a classroom"))} fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: "cover" }} />
              </div>
            </article>
            <div>
              <div className="eyebrow" style={{ color: "var(--blue-500)" }}>{pick(lang, bi("प्रभाव", "Impact"))}</div>
              <h3 style={{ margin: "8px 0 0" }}>{pick(lang, bi("देरी अब पढ़ाई नहीं रोकेगी", "Delays no longer hold up an education"))}</h3>
              <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "10px 0 0" }}>
                {pick(lang, bi("जब आय प्रमाण पत्र तीन दिन की गारंटी के साथ बनता है, तो छात्रवृत्ति की समय-सीमा नहीं छूटती। साफ़ मामले उसी दिन जारी होते हैं।", "When the income certificate comes with a 3-day guarantee, scholarship deadlines aren't missed. Clean cases issue the same day."))}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
