"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { DEPARTMENTS } from "@/components/services";

const LICENCE_SLUGS = new Set([
  "trade-license",
  "food-license",
  "learner-license",
  "vehicle-registration",
]);

export default function LicencesPage() {
  const { lang } = useLang();

  const licenceServices = DEPARTMENTS.flatMap((d) => d.services).filter((s) => LICENCE_SLUGS.has(s.slug));

  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>
              <a href="/services" style={{ color: "inherit", textDecoration: "none" }}>{pick(lang, bi("सेवाएँ", "Services"))}</a>
              {" → "}
              {pick(lang, bi("लाइसेंस", "Licences"))}
            </div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("लाइसेंस सेवाएँ", "Licence services"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "व्यापार लाइसेंस, खाद्य लाइसेंस, लर्निंग ड्राइविंग लाइसेंस और वाहन पंजीकरण — सभी ऑनलाइन।",
                "Trade licence, food licence, learner driving licence and vehicle registration — all online."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "40px var(--gutter) 80px" }}>
          <SectionHeading>{pick(lang, bi(`${licenceServices.length} लाइसेंस सेवाएँ`, `${licenceServices.length} licence services`))}</SectionHeading>
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            {licenceServices.map((s) => (
              <Card
                key={s.slug}
                icon={s.icon}
                href={s.href ?? `/services/${s.slug}`}
                title={pick(lang, s.title)}
                description={pick(lang, s.desc)}
                meta={
                  s.live ? (
                    <span style={{ display: "inline-flex", gap: 6 }}>
                      <Tag tone="success">{pick(lang, bi("कार्यशील", "Live"))}</Tag>
                      {s.oneDay ? <Tag tone="info">{pick(lang, bi("समाधान एक दिन", "1-day"))}</Tag> : null}
                    </span>
                  ) : s.oneDay ? (
                    <Tag tone="info">{pick(lang, bi("समाधान एक दिन", "1-day"))}</Tag>
                  ) : undefined
                }
              />
            ))}
          </div>

          <Callout tone="info" title={pick(lang, bi("लाइसेंस के बारे में जानकारी", "About licences"))}>
            {pick(lang, bi(
              "अधिकांश लाइसेंस सेवाएँ दस्तावेज़ सत्यापन के बाद 3 कार्य दिवसों में जारी होती हैं। लर्निंग लाइसेंस के लिए ₹200 का शुल्क है। व्यापार और खाद्य लाइसेंस निःशुल्क हैं। लोक सेवा गारंटी अधिनियम के तहत देरी पर ₹250/दिन जुर्माना आपके पक्ष में।",
              "Most licence services are issued within 3 working days after document verification. Learner licence carries a fee of ₹200. Trade and food licences are free. Under the Public Services Guarantee Act, a delay attracts ₹250/day in your favour."
            ))}
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
