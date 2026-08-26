"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEPARTMENTS, serviceHref } from "@/components/services";

export default function ServicesCatalog() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>{pick(lang, bi("सेवा निर्देशिका", "Service directory"))}</div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>{pick(lang, bi("सभी सरकारी सेवाएँ", "All government services"))}</h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi("विभाग अनुसार हर सेवा — आवेदन करें, स्थिति जानें, और वैधानिक घड़ी पर निर्णय पाएँ।", "Every service by department — apply, track, and get a decision on the statutory clock."))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "40px var(--gutter) 0" }}>
          {DEPARTMENTS.map((dept) => (
            <section key={dept.key} style={{ marginBottom: 40 }}>
              <SectionHeading>{pick(lang, dept.name)}</SectionHeading>
              <div className="grid grid-3">
                {dept.services.map((s) => (
                  <Card
                    key={s.slug}
                    icon={s.icon}
                    href={serviceHref(s)}
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
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
