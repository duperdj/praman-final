"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEPARTMENTS } from "@/components/services";

// Certificate slugs defined in task spec
const CERT_SLUGS = new Set([
  "income-certificate",
  "domicile",
  "caste-sc-st",
  "caste-obc",
  "ews",
  "legal-heir",
  "character-certificate",
  "birth-registration",
  "death-registration",
  "marriage-registration",
  "migration-certificate",
  "duplicate-marksheet",
]);

export default function CertificatesPage() {
  const { lang } = useLang();

  const certServices = DEPARTMENTS.flatMap((d) => d.services).filter((s) => CERT_SLUGS.has(s.slug));

  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>
              <a href="/services" style={{ color: "inherit", textDecoration: "none" }}>{pick(lang, bi("सेवाएँ", "Services"))}</a>
              {" → "}
              {pick(lang, bi("प्रमाण पत्र", "Certificates"))}
            </div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("प्रमाण पत्र सेवाएँ", "Certificate services"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "आय, निवास, जाति, जन्म, मृत्यु, विवाह सहित सभी प्रमाण पत्र — एक जगह। आवेदन करें और वैधानिक समय-सीमा के भीतर निर्णय पाएँ।",
                "Income, domicile, caste, birth, death, marriage and more — all certificates in one place. Apply and receive a decision within the statutory deadline."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "40px var(--gutter) 80px" }}>
          <SectionHeading>{pick(lang, bi(`${certServices.length} प्रमाण पत्र सेवाएँ`, `${certServices.length} certificate services`))}</SectionHeading>
          <div className="grid grid-3">
            {certServices.map((s) => (
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
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
