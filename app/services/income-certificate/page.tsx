"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";

export default function IncomeCertificateService() {
  const { lang } = useLang();

  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        {/* Breadcrumb */}
        <div className="container mono" style={{ padding: "20px var(--gutter) 0", font: "var(--type-caption)", color: "var(--ink-500)" }}>
          {pick(lang, bi("सेवाएँ", "Services"))} / {pick(lang, bi("राजस्व", "Revenue"))} /{" "}
          <span style={{ color: "var(--ink-900)" }}>{pick(lang, bi("आय प्रमाण पत्र", "Income certificate"))}</span>
        </div>

        {/* Blue hero band */}
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)", marginTop: 20 }}>
          <div className="container" style={{ padding: "44px var(--gutter)", display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ maxWidth: 660, flex: "1 1 420px" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>{pick(lang, bi("राजस्व विभाग · Revenue", "Revenue Department"))}</div>
              <h1 style={{ font: "800 clamp(30px,5vw,44px) var(--font-sans)", color: "var(--ink-0)", margin: "12px 0 0" }}>{pick(lang, bi("आय प्रमाण पत्र", "Income certificate"))}</h1>
              <div style={{ font: "600 22px var(--font-sans)", color: "rgba(255,255,255,.9)", marginTop: 6 }}>{pick(lang, bi("Income certificate", "आय प्रमाण पत्र"))}</div>
              <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "16px 0 0", maxWidth: "60ch" }}>
                {pick(lang, bi("छात्रवृत्ति, कल्याणकारी योजना या प्रवेश के लिए परिवार की वार्षिक आय का प्रमाण चाहिए तो यहाँ आवेदन करें। अभिलेख मेल खाने पर प्रमाण पत्र उसी समय जारी हो जाता है।", "Need proof of your family's annual income for a scholarship, welfare scheme or admission? Apply here. When records match, the certificate is issued at once."))}
              </p>
              <div style={{ marginTop: 24 }}>
                <Button href="/apply" variant="inverse" size="lg" iconAfter="arrow-right">{pick(lang, bi("अभी शुरू करें", "Start now"))}</Button>
              </div>
            </div>
            <div style={{ width: 320, flex: "0 1 320px", border: "1px solid rgba(255,255,255,.4)", padding: 20 }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>{pick(lang, bi("सेवा मानक", "Service standard"))}</div>
              <div className="mono" style={{ font: "800 26px var(--font-mono)", marginTop: 10 }}>{pick(lang, bi("3 कार्य-दिवस", "3 working days"))}</div>
              <div style={{ font: "var(--type-body-sm)", color: "rgba(255,255,255,.9)", marginTop: 8 }}>
                {pick(lang, bi("लोक सेवा गारंटी अधिनियम। देरी पर ₹ 250 प्रतिदिन जुर्माना आवेदक के पक्ष में।", "Public Services Guarantee Act. ₹250/day penalty in the applicant's favour if delayed."))}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
                <div style={{ flex: 1, height: 10, background: "var(--ink-0)" }} />
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,.35)" }} />
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,.35)" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Content + aside */}
        <div className="container grid grid-main-aside" style={{ padding: "48px var(--gutter)", gap: 64, alignItems: "start" }}>
          <div>
            <h2>{pick(lang, bi("कौन आवेदन कर सकता है", "Who can apply"))}</h2>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "16px 0 0", maxWidth: "66ch" }}>
              {pick(lang, bi("आप आवेदन कर सकते हैं यदि आप मध्य प्रदेश के निवासी हैं और आपकी समग्र आईडी सक्रिय है। यदि आपने इस वर्ष जिला बदला है तो पहले पता अद्यतन कराएँ।", "You can apply if you are a resident of Madhya Pradesh and your Samagra ID is active. If you changed district this year, update your address first."))}
            </p>
            <div style={{ marginTop: 24 }}>
              <Callout tone="warning" title={pick(lang, bi("कर रजिस्ट्री आज धीमी है", "The tax registry is slow today"))}>
                {pick(lang, bi("अभिलेख न मिलने पर निर्णय शेष चार रजिस्ट्री पर आधारित होगा और यह पृष्ठ आपको कारण बता देगा।", "If a record cannot be fetched, the decision is based on the remaining four registries — and this page tells you why."))}
              </Callout>
            </div>

            <h2 style={{ margin: "40px 0 20px" }}>{pick(lang, bi("आपको क्या चाहिए", "What you need"))}</h2>
            <div className="grid grid-2">
              <Card icon="id-card" title={pick(lang, bi("समग्र सदस्य आईडी", "Samagra member ID"))} description={pick(lang, bi("समग्र कार्ड पर 9 अंकों की संख्या।", "The 9-digit number on your Samagra card."))} />
              <Card icon="file-text" title={pick(lang, bi("आय का विवरण", "Income details"))} description={pick(lang, bi("वार्षिक आय और उसका स्रोत।", "Your annual income and its source."))} />
            </div>

            <h2 style={{ margin: "40px 0 20px" }}>{pick(lang, bi("मध्य प्रदेश में यह सेवा", "This service in Madhya Pradesh"))}</h2>
            <article className="card-flat">
              <div className="media ratio-16-9">
                <Image src="/images/lok-seva-kendra.jpg" alt={pick(lang, bi("लोक सेवा केंद्र", "Lok Seva Kendra"))} fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ font: "700 17px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, bi("देपालपुर तहसील में लोक सेवा केंद्र", "Lok Seva Kendra in Depalpur tehsil"))}</div>
                <div style={{ font: "var(--type-body-sm)", color: "var(--ink-600)", marginTop: 6 }}>
                  {pick(lang, bi("पिछले माह जिले के 1,284 आवेदनों में से 67% उसी दिन ऑनलाइन निपटे।", "Last month, 67% of the district's 1,284 applications were settled online the same day."))}
                </div>
              </div>
            </article>
          </div>

          <aside className="stack" style={{ gap: 24 }}>
            <div style={{ borderTop: "4px solid var(--blue-500)", borderBottom: "1px solid var(--ink-200)", padding: "16px 0" }}>
              <div style={{ font: "700 20px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, bi("इस पृष्ठ पर", "On this page"))}</div>
              <div className="stack" style={{ gap: 8, marginTop: 12, font: "var(--type-body-sm)" }}>
                <a href="#">{pick(lang, bi("कौन आवेदन कर सकता है", "Who can apply"))}</a>
                <a href="#">{pick(lang, bi("आपको क्या चाहिए", "What you need"))}</a>
                <a href="#">{pick(lang, bi("शुल्क और समय", "Fees and time"))}</a>
                <a href="/track">{pick(lang, bi("आवेदन की स्थिति", "Track application"))}</a>
              </div>
            </div>
            <div style={{ background: "var(--ink-50)", border: "1px solid var(--ink-200)", padding: 20 }}>
              <div style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, bi("शुल्क", "Fee"))}</div>
              <div className="mono" style={{ font: "800 22px var(--font-mono)", color: "var(--ink-900)", marginTop: 6 }}>{pick(lang, bi("नि:शुल्क ऑनलाइन", "Free online"))}</div>
              <div style={{ font: "var(--type-body-sm)", color: "var(--ink-600)", marginTop: 8 }}>{pick(lang, bi("लोक सेवा केंद्र पर ₹ 40।", "₹40 at a Lok Seva Kendra."))}</div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
