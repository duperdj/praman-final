"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Icon } from "@/components/ui/Icon";

const FEATURES = [
  { icon: "volume-2", title: bi("पाठ सुनें (Read-aloud)", "Read-aloud"), body: bi("स्क्रीन पर मौजूद पाठ को ज़ोर से पढ़कर सुनाएँ — दृष्टिबाधित या कम साक्षर उपयोगकर्ताओं के लिए।", "Page content is read aloud — for visually impaired or low-literacy users.") },
  { icon: "type", title: bi("बड़ा पाठ (Larger text)", "Larger text"), body: bi("एक क्लिक से पूरी साइट का फ़ॉन्ट बड़ा करें। पढ़ने में कठिनाई वाले उपयोगकर्ताओं के लिए।", "Increase the site-wide font size with one click — for users with reading difficulty.") },
  { icon: "contrast", title: bi("उच्च कंट्रास्ट (High contrast)", "High contrast"), body: bi("रंग योजना को उच्च-कंट्रास्ट मोड में बदलें — कम दृष्टि वाले उपयोगकर्ताओं के लिए।", "Switch the colour scheme to high-contrast mode — for low-vision users.") },
  { icon: "languages", title: bi("द्विभाषी समर्थन", "Bilingual support"), body: bi("पूरी साइट हिंदी और अंग्रेज़ी दोनों में उपलब्ध है। भाषा टॉगल हर पृष्ठ के शीर्ष पर।", "The full site is available in both Hindi and English. Language toggle at the top of every page.") },
  { icon: "keyboard", title: bi("कीबोर्ड नेविगेशन", "Keyboard navigation"), body: bi("Tab, Enter और Arrow keys से पूरी साइट नेविगेट करें — माउस की ज़रूरत नहीं।", "Navigate the full site with Tab, Enter and arrow keys — no mouse required.") },
  { icon: "smartphone", title: bi("मोबाइल-प्रथम डिज़ाइन", "Mobile-first design"), body: bi("360px से लेकर सभी स्क्रीन आकारों पर सुचारू अनुभव। छोटे स्मार्टफोन पर पूरी तरह काम करता है।", "Smooth experience from 360px up to any screen size. Fully functional on small smartphones.") },
];

const WCAG_ITEMS = [
  bi("बोधगम्य — रंग केवल सूचना का एकमात्र माध्यम नहीं; पाठ का कंट्रास्ट अनुपात WCAG AA (4.5:1) के अनुसार।", "Perceivable — colour is never the sole means of conveying information; text contrast meets WCAG AA (4.5:1)."),
  bi("प्रचालन-योग्य — सभी इंटरफेस तत्व कीबोर्ड से सुलभ; फ़ोकस संकेतक दृश्यमान।", "Operable — all interface elements keyboard accessible; focus indicators visible."),
  bi("बोधगम्य — सभी फ़ॉर्म फ़ील्ड में लेबल; त्रुटि संदेश स्पष्ट और सुझावात्मक।", "Understandable — all form fields labelled; error messages clear and suggestive."),
  bi("मज़बूत — सिमेंटिक HTML और ARIA विशेषताएँ स्क्रीन-रीडर के साथ अनुकूल।", "Robust — semantic HTML and ARIA attributes compatible with screen readers."),
];

export default function AccessibilityPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Praman</div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("सुगम्यता", "Accessibility"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "प्रमाण सभी नागरिकों के लिए — विकलांगता, आयु या साक्षरता स्तर की परवाह किए बिना — सुलभ और उपयोगी होना चाहिए।",
                "Praman should be accessible and useful for all citizens — regardless of disability, age or literacy level."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 960 }}>
          {/* Accessibility menu features */}
          <SectionHeading>{pick(lang, bi("सुगम्यता मेन्यू की विशेषताएँ", "Accessibility menu features"))}</SectionHeading>
          <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 28px" }}>
            {pick(lang, bi(
              "स्क्रीन के ऊपरी दाएँ कोने में सुगम्यता बटन दबाएँ और अपनी ज़रूरत के अनुसार सुविधाएँ चुनें।",
              "Press the accessibility button in the top-right corner and choose features as needed."
            ))}
          </p>
          <div className="grid grid-3" style={{ gap: "var(--space-6)", marginBottom: 48 }}>
            {FEATURES.map((f) => (
              <div key={f.title.en} className="hairline" style={{ background: "var(--ink-0)", padding: "var(--space-6)" }}>
                <Icon name={f.icon} size="lg" style={{ color: "var(--blue-500)", marginBottom: 10 }} />
                <h3 style={{ font: "var(--type-h3)", margin: "0 0 8px" }}>{pick(lang, f.title)}</h3>
                <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>{pick(lang, f.body)}</p>
              </div>
            ))}
          </div>

          {/* WCAG statement */}
          <SectionHeading>{pick(lang, bi("WCAG 2.1 अनुपालन", "WCAG 2.1 conformance"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>
            {pick(lang, bi(
              "प्रमाण वेब सामग्री सुगम्यता दिशानिर्देश (WCAG) 2.1 के स्तर AA के अनुरूप होने का प्रयास करता है। यह एक हैकाथॉन बिल्ड है और हम निरंतर सुधार कर रहे हैं।",
              "Praman aims to conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. This is a hackathon build and we are continuously improving."
            ))}
          </p>
          <ul style={{ paddingLeft: 20, display: "grid", gap: "var(--space-4)", margin: "0 0 40px" }}>
            {WCAG_ITEMS.map((item, i) => (
              <li key={i} style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, item)}</li>
            ))}
          </ul>

          {/* Skip links */}
          <SectionHeading>{pick(lang, bi("अतिरिक्त सुगम्यता उपाय", "Additional accessibility measures"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, display: "grid", gap: "var(--space-4)", margin: "0 0 40px" }}>
            <li style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, bi("'मुख्य सामग्री पर जाएँ' लिंक — कीबोर्ड उपयोगकर्ताओं के लिए।", "'Skip to main content' link for keyboard users."))}</li>
            <li style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, bi("सभी <img> में वर्णनात्मक alt पाठ।", "Descriptive alt text on all images."))}</li>
            <li style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, bi("डायनामिक घोषणाओं के लिए ARIA live regions।", "ARIA live regions for dynamic announcements."))}</li>
            <li style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, bi("फ़ॉर्म त्रुटियाँ: स्पष्ट, इनलाइन, ARIA aria-describedby से जोड़ी गई।", "Form errors: clear, inline, associated via aria-describedby."))}</li>
          </ul>

          <Callout tone="info" title={pick(lang, bi("सुगम्यता समस्या बताएँ", "Report an accessibility problem"))}>
            <p style={{ margin: "0 0 12px" }}>
              {pick(lang, bi(
                "यदि आपको कोई सुगम्यता बाधा मिले — पाठ पढ़ने में कठिनाई, कीबोर्ड trap, या स्क्रीन रीडर समस्या — तो कृपया हमें बताएँ। CM हेल्पलाइन 181 पर कॉल करें या रिपोर्ट फ़ॉर्म भरें।",
                "If you encounter an accessibility barrier — text difficulty, keyboard trap or screen reader problem — please let us know. Call CM Helpline 181 or fill the report form."
              ))}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/report-a-problem" style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--blue-600)", textDecoration: "underline" }}>
                {pick(lang, bi("समस्या बताएँ →", "Report a problem →"))}
              </a>
              <a href="tel:181" style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--blue-600)", textDecoration: "underline" }}>
                {pick(lang, bi("181 पर कॉल करें", "Call 181"))}
              </a>
            </div>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
