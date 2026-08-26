"use client";

import Image from "next/image";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";

const SITES = [
  {
    key: "khajuraho",
    img: "/images/khajuraho.jpg",
    name: bi("खजुराहो", "Khajuraho"),
    district: bi("जिला छतरपुर", "Chhatarpur district"),
    tag: bi("यूनेस्को विश्व धरोहर 1986", "UNESCO World Heritage 1986"),
    body1: bi(
      "खजुराहो मंदिर समूह मध्यकालीन चंदेला राजवंश (950–1050 ई.) की उत्कृष्ट कृति है। यहाँ 85 मंदिरों में से 22 आज भी अस्तित्व में हैं, जो पश्चिमी, पूर्वी और दक्षिणी तीन खंडों में फैले हैं। कंदरिया महादेव मंदिर, 30.5 मीटर ऊँचा, इस समूह का सबसे भव्य स्थापत्य है।",
      "The Khajuraho Group of Monuments is a masterpiece of the medieval Chandela dynasty (950–1050 CE). Of the original 85 temples, 22 survive today, spread across three clusters — Western, Eastern and Southern. The Kandariya Mahadeva temple, at 30.5 metres, is the most imposing structure."
    ),
    body2: bi(
      "मंदिरों की बाहरी दीवारों पर उकेरी गई मूर्तियाँ मानव जीवन के समग्र चित्रण — धर्म, अर्थ, काम, मोक्ष — को दर्शाती हैं। हर साल फ़रवरी-मार्च में यहाँ अंतर्राष्ट्रीय नृत्य महोत्सव आयोजित होता है जिसमें भरतनाट्यम, कथक और ओडिसी की प्रस्तुतियाँ होती हैं।",
      "The sculptures covering the outer walls depict the totality of human life — dharma, artha, kama and moksha. Every February-March, an International Dance Festival is held here, featuring performances of Bharatanatyam, Kathak and Odissi."
    ),
    how: bi("खजुराहो पहुँचने के लिए: निकटतम हवाई अड्डा खजुराहो (KJR), जबलपुर से 170 किमी। प्रतिदिन इंडिगो की उड़ानें दिल्ली और मुंबई से। झाँसी से बस/टैक्सी।", "Getting there: Khajuraho Airport (KJR) — daily IndiGo flights from Delhi and Mumbai. By road from Jhansi, 175 km. Buses from Bhopal, Jabalpur and Satna."),
    kendra: bi("निकटतम लोक सेवा केंद्र: छतरपुर कलेक्टरेट परिसर", "Nearest Lok Seva Kendra: Chhatarpur Collectorate campus"),
  },
  {
    key: "sanchi",
    img: "/images/sanchi.jpg",
    name: bi("साँची का महान स्तूप", "The Great Stupa at Sanchi"),
    district: bi("जिला रायसेन", "Raisen district"),
    tag: bi("यूनेस्को विश्व धरोहर 1989", "UNESCO World Heritage 1989"),
    body1: bi(
      "साँची स्तूप सम्राट अशोक (तीसरी शताब्दी ई.पू.) द्वारा बुद्ध के अवशेषों पर बनवाया गया था। यह भारत का सबसे पुराना पत्थर का स्थापत्य है। बाद की शताब्दियों में चार भव्य तोरण (द्वार) जोड़े गए जिन पर बुद्ध के जातक कथाओं का अंकन है।",
      "The Great Stupa at Sanchi was built by Emperor Ashoka (third century BCE) over the relics of the Buddha. It is India's oldest stone structure. Four magnificent toranas (gateways) were added in later centuries, each carved with Jataka tales from the life of the Buddha."
    ),
    body2: bi(
      "भोपाल से मात्र 46 किमी दूर, साँची एक शांत पहाड़ी पर बसा है। यहाँ स्तूप 1, 2 और 3 के अलावा गुप्तकालीन मंदिर 17 और अशोक का एकल-शीर्ष स्तंभ भी है। भारतीय पुरातत्व सर्वेक्षण (ASI) का संग्रहालय परिसर में ही स्थित है।",
      "Just 46 km from Bhopal, Sanchi sits on a peaceful hillock. Besides Stupas 1, 2 and 3, the site has the Gupta-era Temple 17 and Ashoka's monolithic lion-capital pillar. An ASI museum is on the grounds."
    ),
    how: bi("भोपाल से साँची: रेलमार्ग द्वारा 1 घंटा (भोपाल–जबलपुर लाइन), सड़क मार्ग द्वारा 1.5 घंटा।", "From Bhopal: 1 hour by train (Bhopal–Jabalpur line) or 1.5 hours by road (NH-146)."),
    kendra: bi("निकटतम लोक सेवा केंद्र: रायसेन कलेक्टरेट", "Nearest Lok Seva Kendra: Raisen Collectorate"),
  },
  {
    key: "bhimbetka",
    img: "/images/rural.jpg",
    name: bi("भीमबेटका शैलाश्रय", "Bhimbetka Rock Shelters"),
    district: bi("जिला रायसेन", "Raisen district"),
    tag: bi("यूनेस्को विश्व धरोहर 2003", "UNESCO World Heritage 2003"),
    body1: bi(
      "विंध्य पर्वत की तलहटी में बसे भीमबेटका में 700 से अधिक शैलाश्रय हैं जिनमें 300,000 वर्ष से अधिक पुराने मानव निवास के साक्ष्य मिले हैं। यहाँ की गुफाओं में बनी रंगीन चित्रकारी आदिमानव की जीवन-शैली — शिकार, नृत्य, अनुष्ठान — का जीवंत दस्तावेज़ है।",
      "Nestled in the foothills of the Vindhyas, Bhimbetka contains over 700 rock shelters with evidence of human habitation dating back more than 300,000 years. Vivid cave paintings chronicle the life of early humans — hunting, dancing and ritual."
    ),
    body2: bi(
      "भोपाल से लगभग 45 किमी दक्षिण में स्थित भीमबेटका, भारत के सबसे महत्त्वपूर्ण प्रागैतिहासिक स्थलों में से एक है। कुछ चित्रकारियाँ आज भी प्राकृतिक रंजकों से इतनी जीवंत हैं कि आधुनिक युग में भी उन्हें देखकर विस्मय होता है।",
      "Located about 45 km south of Bhopal, Bhimbetka is one of India's most important prehistoric sites. Some paintings remain so vivid in their natural pigments that they astonish even modern visitors."
    ),
    how: bi("भोपाल से: NH-69 पर 45 किमी दक्षिण, लगभग 1 घंटा। ओबेदुल्लागंज से टैक्सी उपलब्ध।", "From Bhopal: 45 km south on NH-69, approximately 1 hour. Shared taxis from Obaidullaganj."),
    kendra: bi("निकटतम लोक सेवा केंद्र: रायसेन कलेक्टरेट", "Nearest Lok Seva Kendra: Raisen Collectorate"),
  },
];

export default function HeritagePage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>{pick(lang, bi("मध्य प्रदेश को जानें", "Explore Madhya Pradesh"))}</div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("विरासत — तीन विश्व धरोहर स्थल", "Heritage — three UNESCO World Heritage sites"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "खजुराहो, साँची और भीमबेटका — मध्य प्रदेश के तीन विश्व-प्रसिद्ध धरोहर स्थल जो हर साल लाखों पर्यटकों को आकर्षित करते हैं।",
                "Khajuraho, Sanchi and Bhimbetka — three of Madhya Pradesh's world-renowned heritage sites drawing millions of visitors every year."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          {SITES.map((site, i) => (
            <section key={site.key} style={{ marginBottom: 64 }}>
              <div className={i % 2 === 0 ? "grid grid-2" : "grid grid-2"} style={{ gap: "var(--space-10)", alignItems: "start" }}>
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div className="media ratio-16-9" style={{ marginBottom: "var(--space-4)" }}>
                    <Image
                      src={site.img}
                      alt={pick(lang, site.name)}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div className="eyebrow" style={{ color: "var(--blue-500)", marginBottom: 8 }}>{pick(lang, site.tag)}</div>
                  <h2 style={{ font: "var(--type-h2)", margin: "0 0 4px" }}>{pick(lang, site.name)}</h2>
                  <p style={{ font: "var(--type-caption)", color: "var(--text-muted)", margin: "0 0 16px" }}>{pick(lang, site.district)}</p>
                  <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 12px" }}>{pick(lang, site.body1)}</p>
                  <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 20px" }}>{pick(lang, site.body2)}</p>
                  <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: 16, marginTop: 16 }}>
                    <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 8px" }}>
                      <strong>{pick(lang, bi("कैसे पहुँचें: ", "Getting there: "))}</strong>
                      {pick(lang, site.how)}
                    </p>
                    <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>
                      <strong>{pick(lang, bi("", ""))}</strong>{pick(lang, site.kendra)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}

          <Callout tone="info" title={pick(lang, bi("सरकारी सेवाएँ — यात्रा से पहले", "Government services — before you travel"))}>
            <p style={{ margin: "0 0 12px" }}>
              {pick(lang, bi(
                "यात्रा से पहले आपको निवास, आय या जाति प्रमाण पत्र की ज़रूरत हो सकती है — छात्रवृत्ति, आरक्षित टिकट, या सरकारी योजनाओं के लिए। प्रमाण से इन्हें घर बैठे प्राप्त करें।",
                "Before your trip you may need a domicile, income or caste certificate — for scholarships, reserved tickets or government schemes. Get them from home via Praman."
              ))}
            </p>
            <Button href="/services" variant="primary" size="sm" iconAfter="arrow-right">
              {pick(lang, bi("सभी सेवाएँ देखें", "Browse all services"))}
            </Button>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
