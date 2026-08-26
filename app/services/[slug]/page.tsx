"use client";

import { useParams } from "next/navigation";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Icon } from "@/components/ui/Icon";
import { serviceBySlug } from "@/components/services";

// Generic service info page for every non-flagship service in the catalog.
export default function ServiceDetail() {
  const { lang } = useLang();
  const params = useParams<{ slug: string }>();
  const found = serviceBySlug(params?.slug as string);

  if (!found) {
    return (
      <>
        <SiteHeader active="services" />
        <main id="main" className="container" style={{ padding: "48px var(--gutter)", maxWidth: 640 }}>
          <Callout tone="info" title={pick(lang, bi("सेवा नहीं मिली", "Service not found"))}>
            <div style={{ marginTop: 12 }}><Button href="/services" variant="outline">{pick(lang, bi("सभी सेवाएँ", "All services"))}</Button></div>
          </Callout>
        </main>
        <SiteFooter />
      </>
    );
  }

  const { service, dept } = found;

  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        <div className="container mono" style={{ padding: "20px var(--gutter) 0", font: "var(--type-caption)", color: "var(--ink-500)" }}>
          <a href="/services">{pick(lang, bi("सेवाएँ", "Services"))}</a> / {pick(lang, dept.name)} /{" "}
          <span style={{ color: "var(--ink-900)" }}>{pick(lang, service.title)}</span>
        </div>

        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)", marginTop: 20 }}>
          <div className="container" style={{ padding: "44px var(--gutter)" }}>
            <div className="row" style={{ gap: 12, marginBottom: 12 }}>
              <Icon name={service.icon} size="lg" style={{ color: "rgba(255,255,255,.9)" }} />
              {service.oneDay ? <Tag tone="info">{pick(lang, bi("समाधान एक दिन", "Samadhan Ek Din · 1 day"))}</Tag> : null}
            </div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: 0 }}>{pick(lang, service.title)}</h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "62ch" }}>{pick(lang, service.desc)}</p>
            <div style={{ marginTop: 24 }}>
              <Button href={`/apply/${service.slug}`} variant="inverse" size="lg" iconAfter="arrow-right">{pick(lang, bi("अभी आवेदन करें", "Apply now"))}</Button>
            </div>
          </div>
        </section>

        <div className="container grid grid-main-aside" style={{ padding: "48px var(--gutter)", gap: 64, alignItems: "start" }}>
          <div>
            <h2>{pick(lang, bi("कौन आवेदन कर सकता है", "Who can apply"))}</h2>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "16px 0 0", maxWidth: "66ch" }}>
              {pick(lang, bi("मध्य प्रदेश के निवासी, जिनकी समग्र आईडी सक्रिय है, आवेदन कर सकते हैं। केवल मोबाइल नंबर और OTP से — कोई पासवर्ड नहीं।", "Residents of Madhya Pradesh with an active Samagra ID can apply — with just a mobile number and an OTP, no password."))}
            </p>

            <h2 style={{ margin: "40px 0 20px" }}>{pick(lang, bi("आपको क्या चाहिए", "What you need"))}</h2>
            <div className="grid grid-2">
              <Card icon="id-card" title={pick(lang, bi("समग्र सदस्य आईडी", "Samagra member ID"))} description={pick(lang, bi("समग्र कार्ड पर 9 अंकों की संख्या।", "The 9-digit number on your Samagra card."))} />
              <Card icon="file-text" title={pick(lang, bi("संबंधित विवरण", "Relevant details"))} description={pick(lang, bi("इस सेवा से जुड़ी जानकारी।", "Information related to this service."))} />
            </div>

            <Callout tone="info" title={pick(lang, bi("आपका आवेदन कैसे तय होता है", "How your application is decided"))} style={{ marginTop: 32 }}>
              {pick(lang, bi("आपकी जानकारी सरकारी अभिलेखों से मिलाई जाती है। मेल खाने पर प्रमाण पत्र तुरंत जारी; किसी विरोधाभास पर अधिकारी को स्पष्ट कारण के साथ भेजा जाता है। हर निर्णय वैधानिक घड़ी पर होता है।", "Your details are checked against government records. On a match the certificate is issued at once; on a discrepancy it goes to an officer with a clear reason. Every decision runs on the statutory clock."))}
              <div className="row wrap-gap" style={{ marginTop: 12 }}>
                <Button href={`/apply/${service.slug}`} iconAfter="arrow-right">{pick(lang, bi("अभी आवेदन करें", "Apply now"))}</Button>
                <Button href="/services" variant="outline">{pick(lang, bi("सभी सेवाएँ", "All services"))}</Button>
              </div>
            </Callout>
          </div>

          <aside className="stack" style={{ gap: 24 }}>
            <div style={{ borderTop: "4px solid var(--blue-500)", borderBottom: "1px solid var(--ink-200)", padding: "16px 0" }}>
              <div style={{ font: "700 20px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, bi("सेवा मानक", "Service standard"))}</div>
              <div className="mono" style={{ font: "800 22px var(--font-mono)", color: "var(--ink-900)", marginTop: 8 }}>
                {service.oneDay ? pick(lang, bi("1 कार्य-दिवस", "1 working day")) : pick(lang, bi("3 कार्य-दिवस", "3 working days"))}
              </div>
              <div style={{ font: "var(--type-body-sm)", color: "var(--ink-600)", marginTop: 8 }}>
                {pick(lang, bi("लोक सेवा गारंटी अधिनियम — देरी पर ₹250/दिन जुर्माना आपके पक्ष में।", "Public Services Guarantee Act — ₹250/day in your favour if delayed."))}
              </div>
            </div>
            <div style={{ background: "var(--ink-50)", border: "1px solid var(--ink-200)", padding: 20 }}>
              <div style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, bi("शुल्क", "Fee"))}</div>
              <div className="mono" style={{ font: "800 22px var(--font-mono)", color: "var(--ink-900)", marginTop: 6 }}>{pick(lang, bi("नि:शुल्क ऑनलाइन", "Free online"))}</div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
