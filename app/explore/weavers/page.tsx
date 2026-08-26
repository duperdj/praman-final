"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

const CRAFT_FACTS = [
  {
    craft: bi("चंदेरी", "Chanderi"),
    district: bi("जिला अशोकनगर", "Ashoknagar district"),
    fabric: bi("रेशम, ज़री और कपास का मिश्रण", "Silk, zari and cotton blend"),
    motif: bi("फूल-पत्ती, मंदिर बॉर्डर, बूटी", "Floral, temple border, buti"),
    gi: "2005",
    weavers: bi("25,000 से अधिक बुनकर परिवार", "25,000+ weaver families"),
    note: bi(
      "चंदेरी साड़ी अपनी पारदर्शिता और हल्केपन के लिए विख्यात है। पाँचवीं शताब्दी से इसकी परंपरा चली आ रही है। चंदेरी कपड़े की विशेषता उसकी कोमलता, चमक और नाज़ुक बुनावट है जो इसे विशेष अवसरों की पोशाक बनाती है।",
      "Chanderi sarees are renowned for their translucency and lightness. The tradition dates to the fifth century. Chanderi fabric is distinguished by its softness, lustre and delicate weave, making it ideal for special occasions."
    ),
  },
  {
    craft: bi("माहेश्वरी", "Maheshwari"),
    district: bi("जिला खरगोन", "Khargone district"),
    fabric: bi("रेशम और कपास", "Silk and cotton"),
    motif: bi("धारी, चेक, ज़री पल्लू", "Stripes, checks, zari pallu"),
    gi: "2006",
    weavers: bi("5,000 से अधिक बुनकर परिवार", "5,000+ weaver families"),
    note: bi(
      "माहेश्वरी साड़ी की उत्पत्ति 18वीं शताब्दी में इंदौर की रानी अहिल्याबाई होल्कर के आश्रय में हुई। महेश्वर के बुनकर आज भी पारंपरिक हथकरघे पर इन साड़ियों का निर्माण करते हैं। नर्मदा तट पर बसे महेश्वर में हथकरघा प्रशिक्षण केंद्र भी हैं।",
      "Maheshwari sarees originated in the 18th century under the patronage of Rani Ahilyabai Holkar of Indore. Weavers in Maheshwar still produce these sarees on traditional handlooms. The town on the banks of the Narmada also has handloom training centres."
    ),
  },
];

const MISSION_POINTS = [
  bi("मध्य प्रदेश राज्य ग्रामीण आजीविका मिशन (MPSRLM) हथकरघा बुनकरों को स्वयं सहायता समूहों (SHG) से जोड़ता है।", "MP State Rural Livelihoods Mission (MPSRLM) connects handloom weavers to self-help groups (SHGs)."),
  bi("बुनकरों को कच्चे माल की आपूर्ति, प्रशिक्षण और बाज़ार तक पहुँच में सहायता दी जाती है।", "Weavers receive support for raw material supply, skill training and market linkages."),
  bi("'एक जिला एक उत्पाद' (ODOP) योजना के तहत चंदेरी और माहेश्वरी को विशेष प्रोत्साहन।", "Under the 'One District One Product' (ODOP) scheme, Chanderi and Maheshwari receive special support."),
  bi("राष्ट्रीय हस्तशिल्प पुरस्कार विजेता बुनकरों की मदद से नई पीढ़ी को उस्तादी प्रशिक्षण।", "Mentorship training for the new generation by National Handcraft Award-winning weavers."),
];

export default function WeaversPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
          <Image
            src="/images/weavers.jpg"
            alt={pick(lang, bi("चंदेरी और माहेश्वरी बुनकर", "Chanderi and Maheshwari weavers"))}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.65) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div className="container" style={{ padding: "32px var(--gutter)" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,.8)", marginBottom: 8 }}>
                {pick(lang, bi("आजीविका मिशन · हथकरघा परंपरा", "Livelihood Mission · Handloom heritage"))}
              </div>
              <h1 className="h-page" style={{ color: "var(--ink-0)", margin: 0 }}>
                {pick(lang, bi("चंदेरी और माहेश्वरी बुनकर", "Chanderi & Maheshwari weavers"))}
              </h1>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 960 }}>
          {/* Intro */}
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "72ch", marginBottom: 40 }}>
            {pick(lang, bi(
              "मध्य प्रदेश का हथकरघा उद्योग सदियों पुरानी परंपरा और आधुनिक बाज़ार का संगम है। चंदेरी और माहेश्वरी — दो विशिष्ट भौगोलिक संकेत (GI) प्राप्त कपड़े — MP की सांस्कृतिक विरासत और आर्थिक आजीविका दोनों के प्रतीक हैं। इनसे जुड़े हज़ारों बुनकर परिवार आज राज्य सरकार की आजीविका योजनाओं से लाभान्वित हो रहे हैं।",
              "Madhya Pradesh's handloom industry is a meeting point of centuries-old tradition and modern markets. Chanderi and Maheshwari — two fabrics with distinct Geographical Indication (GI) tags — symbolise both MP's cultural heritage and its economic livelihoods. Thousands of weaver families today benefit from the state government's livelihood schemes."
            ))}
          </p>

          {/* Craft sections */}
          {CRAFT_FACTS.map((c, i) => (
            <section key={c.craft.en} style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h2 style={{ font: "var(--type-h2)", margin: 0 }}>{pick(lang, c.craft)}</h2>
                <Tag tone="info">GI {c.gi}</Tag>
              </div>
              <p style={{ font: "var(--type-caption)", color: "var(--text-muted)", margin: "0 0 16px" }}>{pick(lang, c.district)}</p>

              <div className="grid grid-2" style={{ gap: "var(--space-8)", alignItems: "start" }}>
                <div>
                  <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>{pick(lang, c.note)}</p>
                  <div style={{ background: "var(--surface-muted)", padding: "var(--space-6)", marginBottom: 16 }}>
                    <dl style={{ margin: 0, display: "grid", gap: "var(--space-4)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                        <dt style={{ font: "600 13px var(--font-sans)", color: "var(--ink-600)" }}>{pick(lang, bi("कपड़ा", "Fabric"))}</dt>
                        <dd style={{ margin: 0, font: "var(--type-body-sm)", color: "var(--ink-900)" }}>{pick(lang, c.fabric)}</dd>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                        <dt style={{ font: "600 13px var(--font-sans)", color: "var(--ink-600)" }}>{pick(lang, bi("मोटिफ", "Motifs"))}</dt>
                        <dd style={{ margin: 0, font: "var(--type-body-sm)", color: "var(--ink-900)" }}>{pick(lang, c.motif)}</dd>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                        <dt style={{ font: "600 13px var(--font-sans)", color: "var(--ink-600)" }}>{pick(lang, bi("बुनकर परिवार", "Weaver families"))}</dt>
                        <dd style={{ margin: 0, font: "var(--type-body-sm)", color: "var(--ink-900)" }}>{pick(lang, c.weavers)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="card-flat" style={{ padding: "var(--space-7)" }}>
                  <h3 style={{ font: "var(--type-h3)", margin: "0 0 12px" }}>{pick(lang, bi("पहचान और खरीद", "Identity and purchase"))}</h3>
                  <ul style={{ margin: 0, padding: "0 0 0 18px", font: "var(--type-body-sm)", color: "var(--ink-800)", display: "grid", gap: "var(--space-3)" }}>
                    <li>{pick(lang, bi("GI टैग की पुष्टि करें — असली उत्पाद पर यह होना चाहिए।", "Verify the GI tag — authentic products carry it."))}</li>
                    <li>{pick(lang, bi("MP हस्तशिल्प विकास निगम के अधिकृत बिक्री केंद्रों से खरीदें।", "Buy from authorised MP Handicrafts Development Corporation outlets."))}</li>
                    <li>{pick(lang, bi("ऑनलाइन: mp.mygov.in हथकरघा पोर्टल।", "Online: MP handloom portal via mp.mygov.in."))}</li>
                    <li>{pick(lang, bi("भोपाल के मृगनयनी शोरूम में दोनों कपड़े उपलब्ध हैं।", "Both fabrics available at Mrignayani showroom in Bhopal."))}</li>
                  </ul>
                </div>
              </div>
            </section>
          ))}

          <SectionHeading>{pick(lang, bi("MP राज्य ग्रामीण आजीविका मिशन", "MP State Rural Livelihoods Mission"))}</SectionHeading>
          <ul style={{ margin: "0 0 40px", padding: "0 0 0 20px", display: "grid", gap: "var(--space-4)" }}>
            {MISSION_POINTS.map((p, i) => (
              <li key={i} style={{ font: "var(--type-body)", color: "var(--ink-800)" }}>{pick(lang, p)}</li>
            ))}
          </ul>

          <div className="grid grid-2" style={{ gap: "var(--space-6)", marginBottom: 40 }}>
            <div className="media ratio-16-9">
              <Image src="/images/rural.jpg" alt={pick(lang, bi("ग्रामीण आजीविका", "Rural livelihoods"))} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ font: "var(--type-h3)", margin: "0 0 12px" }}>{pick(lang, bi("बुनकर का जीवन — परिवर्तन की कहानी", "A weaver's life — a story of change"))}</h3>
              <p style={{ font: "var(--type-body-sm)", color: "var(--ink-800)", margin: 0 }}>
                {pick(lang, bi(
                  "MPSRLM के तहत गठित महिला स्वयं सहायता समूह न केवल बुनाई सिखाते हैं बल्कि डिज़ाइन, मूल्य निर्धारण और सीधी बिक्री का प्रशिक्षण भी देते हैं। इससे बुनकर परिवारों की आय में उल्लेखनीय वृद्धि हुई है।",
                  "Women's self-help groups formed under MPSRLM not only teach weaving but also train in design, pricing and direct sales. This has led to a significant increase in weaver family incomes."
                ))}
              </p>
            </div>
          </div>

          <Callout tone="success" title={pick(lang, bi("आजीविका से जुड़ी सरकारी सेवाएँ", "Government services related to livelihoods"))}>
            <p style={{ margin: "0 0 12px" }}>
              {pick(lang, bi(
                "हथकरघा उद्यमिता के लिए व्यापार लाइसेंस, आय प्रमाण पत्र, या MPSRLM पंजीकरण की आवश्यकता हो सकती है। प्रमाण से इन सेवाओं के लिए घर बैठे आवेदन करें।",
                "Handloom entrepreneurship may require a trade licence, income certificate, or MPSRLM registration. Apply for these services from home via Praman."
              ))}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button href="/services/income-certificate" variant="primary" size="sm" iconAfter="arrow-right">
                {pick(lang, bi("आय प्रमाण पत्र", "Income certificate"))}
              </Button>
              <Button href="/services/trade-license" variant="outline" size="sm">
                {pick(lang, bi("व्यापार लाइसेंस", "Trade licence"))}
              </Button>
            </div>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
