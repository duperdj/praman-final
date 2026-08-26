"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TOPICS = [
  {
    href: "/explore/heritage",
    img: "/images/khajuraho.jpg",
    tag: bi("यूनेस्को विश्व धरोहर", "UNESCO World Heritage"),
    title: bi("विरासत — खजुराहो, साँची और भीमबेटका", "Heritage — Khajuraho, Sanchi & Bhimbetka"),
    desc: bi(
      "मध्य प्रदेश के तीन विश्व-प्रसिद्ध धरोहर स्थल। इतिहास, कला और वास्तुकला का अनुपम संगम।",
      "Three world-renowned heritage sites in Madhya Pradesh. An unparalleled confluence of history, art and architecture."
    ),
  },
  {
    href: "/explore/sanchi",
    img: "/images/sanchi.jpg",
    tag: bi("बौद्ध विरासत", "Buddhist Heritage"),
    title: bi("साँची का महान स्तूप", "The Great Stupa at Sanchi"),
    desc: bi(
      "सम्राट अशोक द्वारा निर्मित भारत का सबसे पुराना पत्थर स्थापत्य। रायसेन जिले में स्थित।",
      "India's oldest stone structure, built by Emperor Ashoka. Located in Raisen district."
    ),
  },
  {
    href: "/explore/weavers",
    img: "/images/weavers.jpg",
    tag: bi("आजीविका मिशन", "Livelihood Mission"),
    title: bi("चंदेरी और माहेश्वरी बुनकर", "Chanderi & Maheshwari weavers"),
    desc: bi(
      "GI-मान्यता प्राप्त हथकरघा परंपराएँ जो हज़ारों परिवारों की आजीविका हैं।",
      "GI-recognised handloom traditions sustaining thousands of families across Madhya Pradesh."
    ),
  },
];

export default function ExplorePage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Praman</div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("मध्य प्रदेश को जानें", "Explore Madhya Pradesh"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.9)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "विरासत, संस्कृति और आजीविका — MP की समृद्ध विविधता को जानें और संबंधित सरकारी सेवाओं से जुड़ें।",
                "Heritage, culture and livelihoods — discover MP's rich diversity and connect with related government services."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          <SectionHeading>{pick(lang, bi("सभी विषय", "All topics"))}</SectionHeading>
          <div className="grid grid-3">
            {TOPICS.map((t) => (
              <a key={t.href} href={t.href} style={{ textDecoration: "none", color: "var(--text-body)", display: "block" }}>
                <article className="card-flat" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="media ratio-16-9">
                    <Image src={t.img} alt={pick(lang, t.title)} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "var(--space-6)", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="eyebrow" style={{ color: "var(--blue-500)", marginBottom: 8 }}>{pick(lang, t.tag)}</div>
                    <h2 style={{ font: "var(--type-h3)", margin: "0 0 8px" }}>{pick(lang, t.title)}</h2>
                    <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 16px", flex: 1 }}>{pick(lang, t.desc)}</p>
                    <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--blue-600)" }}>
                      {pick(lang, bi("पढ़ें →", "Read →"))}
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
