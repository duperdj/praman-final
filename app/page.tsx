"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const SERVICES = [
  { icon: "file-text", href: "/services/income-certificate", title: bi("आय प्रमाण पत्र", "Income certificate"), desc: bi("परिवार की वार्षिक आय का प्रमाण। अभिलेख मेल खाने पर उसी दिन जारी।", "Proof of your family's annual income. Issued the same day when records match.") },
  { icon: "graduation-cap", href: "/services/scholarship", title: bi("छात्रवृत्ति", "Scholarship"), desc: bi("पात्रता जाँचें और छात्रवृत्ति के लिए आवेदन करें।", "Check eligibility and apply for a scholarship.") },
  { icon: "briefcase", href: "/services/employment", title: bi("रोज़गार एवं कौशल", "Employment & skills"), desc: bi("कौशल प्रशिक्षण और रोज़गार योजनाओं के लिए पंजीकरण।", "Register for skill training and employment schemes.") },
  { icon: "id-card", href: "/services/domicile", title: bi("मूल निवासी", "Domicile"), desc: bi("मध्य प्रदेश का निवास प्रमाण — प्रवेश और नौकरी के लिए।", "Proof of residence in Madhya Pradesh — for admissions and jobs.") },
  { icon: "users", href: "/services/caste-sc-st", title: bi("जाति प्रमाण पत्र", "Caste certificate"), desc: bi("आरक्षण और योजनाओं के लिए जाति प्रमाण।", "Caste proof for reservation and schemes.") },
  { icon: "tractor", href: "/services/khasra-khatauni", title: bi("भू-अभिलेख", "Land record"), desc: bi("खसरा/खतौनी की प्रति ऑनलाइन प्राप्त करें।", "Get a copy of your Khasra / Khatauni online.") },
];

export default function Home() {
  const { lang } = useLang();

  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        {/* Hero band */}
        <section className="hero">
          <div className="hero-media">
            <Image src="/images/hero-mp.jpg" alt={pick(lang, bi("मध्य प्रदेश का लोक उत्सव", "A folk festival in Madhya Pradesh"))} fill sizes="100vw" priority style={{ objectFit: "cover", objectPosition: "center 30%" }} />
            <div className="hero-scrim" />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <div className="container" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ maxWidth: 620 }}>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,.85)" }}>
                  {pick(lang, bi("प्रमाण · एक ही जगह, हर सरकारी सेवा", "Praman · every government service, one place"))}
                </div>
                <h1 className="h-hero" style={{ color: "var(--ink-0)", margin: "14px 0 0" }}>
                  {pick(lang, bi("आपकी कैसे मदद करें?", "How can we help you?"))}
                </h1>
                <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0" }}>
                  {pick(lang, bi("प्रमाण पत्र के लिए आवेदन करें, स्थिति जानें, या योजना खोजें। तेज़, स्पष्ट और दोनों भाषाओं में।", "Apply for a certificate, track a decision, or find a scheme. Fast, clear and in both languages."))}
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  style={{ marginTop: 24, background: "var(--ink-0)", border: "2px solid var(--ink-900)", display: "flex" }}
                >
                  <input
                    aria-label={pick(lang, bi("सेवा खोजें", "Search a service"))}
                    placeholder={pick(lang, bi("सेवा, विभाग या दस्तावेज़ खोजें", "Search a service, department or document"))}
                    style={{ flex: 1, border: 0, outline: 0, padding: "0 18px", height: 56, font: "var(--type-body)", color: "var(--ink-900)", background: "transparent", minWidth: 0 }}
                  />
                  <button type="submit" style={{ border: 0, background: "var(--blue-500)", color: "var(--ink-0)", padding: "0 24px", font: "700 15px var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="search" size="sm" />
                    <span className="hide-narrow">{pick(lang, bi("खोजें", "Search"))}</span>
                  </button>
                </form>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, alignItems: "center" }}>
                  <span style={{ font: "var(--type-caption)", color: "rgba(255,255,255,.75)" }}>{pick(lang, bi("लोकप्रिय:", "Popular:"))}</span>
                  {[
                    { l: bi("आय प्रमाण पत्र", "Income certificate"), h: "/services/income-certificate" },
                    { l: bi("छात्रवृत्ति", "Scholarship"), h: "/services/scholarship" },
                    { l: bi("रोज़गार", "Employment"), h: "/services/employment" },
                  ].map((c) => (
                    <a key={c.h + c.l.en} href={c.h} style={{ font: "600 14px var(--font-sans)", color: "var(--ink-0)", textDecoration: "none", border: "1px solid rgba(255,255,255,.5)", padding: "6px 12px" }}>
                      {pick(lang, c.l)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary actions — the three things a citizen actually wants to do */}
        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <div className="grid grid-3">
            {[
              { icon: "file-text", href: "/apply", title: bi("प्रमाण पत्र के लिए आवेदन करें", "Apply for a certificate"), desc: bi("फ़ोन और OTP से। कुछ ही मिनट।", "With your phone and an OTP. A few minutes.") },
              { icon: "clock", href: "/track", title: bi("मेरे आवेदन की स्थिति", "Track my application"), desc: bi("वैधानिक घड़ी और निर्णय के कारण देखें।", "See the statutory clock and the reasons.") },
              { icon: "landmark", href: "/services", title: bi("सभी सेवाएँ देखें", "Browse all services"), desc: bi("विभाग अनुसार हर सरकारी सेवा।", "Every government service, by department.") },
            ].map((a) => (
              <a key={a.href} href={a.href} className="card-flat" style={{ display: "block", textDecoration: "none", color: "var(--text-body)", background: "var(--ink-0)", padding: "var(--space-7)" }}>
                <Icon name={a.icon} size="lg" style={{ color: "var(--blue-500)", marginBottom: 12 }} />
                <div style={{ font: "var(--type-h3)", marginBottom: 6 }}>{pick(lang, a.title)}</div>
                <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>{pick(lang, a.desc)}</p>
                <div className="row" style={{ gap: 6, marginTop: 12, color: "var(--blue-600)", font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("जाएँ", "Go"))} <Icon name="arrow-right" size="sm" /></div>
              </a>
            ))}
          </div>
        </section>

        {/* Most-used services */}
        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <SectionHeading action={pick(lang, bi("सभी सेवाएँ →", "View all services →"))} actionHref="/services">
            {pick(lang, bi("सर्वाधिक उपयोग की जाने वाली सेवाएँ", "Most-used services"))}
          </SectionHeading>
          <div className="grid grid-3">
            {SERVICES.map((s) => (
              <Card key={s.title.en} icon={s.icon} href={s.href} title={pick(lang, s.title)} description={pick(lang, s.desc)} />
            ))}
          </div>
        </section>

        {/* Explore Madhya Pradesh */}
        <section className="container" style={{ paddingTop: "var(--section-y-tight)" }}>
          <SectionHeading action={pick(lang, bi("सभी विषय →", "All topics →"))} actionHref="/explore">
            {pick(lang, bi("मध्य प्रदेश को जानें", "Explore Madhya Pradesh"))}
          </SectionHeading>
          <div className="grid grid-2-1">
            <a href="/explore/heritage" style={{ textDecoration: "none", color: "var(--text-body)" }}>
              <article className="card-flat">
                <div className="media ratio-16-9">
                  <Image src="/images/khajuraho.jpg" alt="Khajuraho" fill sizes="(max-width: 900px) 100vw, 66vw" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "var(--space-7)" }}>
                  <div className="eyebrow" style={{ color: "var(--blue-500)" }}>{pick(lang, bi("पर्यटन", "Tourism"))}</div>
                  <h3 style={{ margin: "8px 0 0" }}>{pick(lang, bi("विरासत जो हर साल लाखों को बुलाती है", "Heritage that draws millions every year"))}</h3>
                  <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "8px 0 0" }}>
                    {pick(lang, bi("खजुराहो, साँची और भीमबेटका — तीन विश्व धरोहर स्थल। यात्रा और पास के लोक सेवा केंद्रों की जानकारी एक जगह।", "Khajuraho, Sanchi and Bhimbetka — three World Heritage sites. Travel and nearby Lok Seva Kendra info in one place."))}
                  </p>
                  <div style={{ marginTop: 12, font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--blue-600)" }}>
                    {pick(lang, bi("पढ़ें →", "Read →"))}
                  </div>
                </div>
              </article>
            </a>
            <div className="stack" style={{ gap: "var(--space-6)" }}>
              {[
                { href: "/explore/sanchi", img: "/images/sanchi.jpg", t: bi("साँची स्तूप, रायसेन", "Sanchi Stupa, Raisen"), tag: bi("विश्व धरोहर", "World Heritage") },
                { href: "/explore/weavers", img: "/images/weavers.jpg", t: bi("चंदेरी और माहेश्वरी बुनकर", "Chanderi & Maheshwari weavers"), tag: bi("आजीविका मिशन", "Livelihood Mission") },
              ].map((c) => (
                <a key={c.img} href={c.href} style={{ textDecoration: "none", color: "var(--text-body)" }}>
                  <article className="hairline" style={{ background: "var(--ink-0)" }}>
                    <div className="media ratio-3-2">
                      <Image src={c.img} alt={pick(lang, c.t)} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "var(--space-5)" }}>
                      <div style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, c.t)}</div>
                      <div style={{ font: "var(--type-caption)", color: "var(--text-muted)", marginTop: 4 }}>{pick(lang, c.tag)}</div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Track CTA band */}
        <section style={{ marginTop: "var(--section-y-tight)", background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "var(--space-10) var(--gutter)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-8)", flexWrap: "wrap" }}>
            <div style={{ maxWidth: 660 }}>
              <h2 style={{ font: "800 clamp(26px,4vw,36px) var(--font-sans)", margin: 0 }}>{pick(lang, bi("पहले से आवेदन किया है?", "Already applied?"))}</h2>
              <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.9)", margin: "10px 0 0" }}>
                {pick(lang, bi("केवल मोबाइल नंबर और OTP से अपने आवेदन की स्थिति, वैधानिक घड़ी और निर्णय के कारण देखें।", "See your status, the statutory clock and the reasons for the decision with just your phone number and an OTP."))}
              </p>
            </div>
            <Button href="/track" variant="inverse" size="lg" iconAfter="arrow-right">{pick(lang, bi("स्थिति जानें", "Track status"))}</Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
