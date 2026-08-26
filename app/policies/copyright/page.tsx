"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function CopyrightPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 860 }}>
          <div className="eyebrow" style={{ color: "var(--blue-500)", marginBottom: 8 }}>Praman</div>
          <h1 className="h-page" style={{ margin: "0 0 8px" }}>{pick(lang, bi("कॉपीराइट नीति", "Copyright policy"))}</h1>
          <p style={{ font: "var(--type-caption)", color: "var(--text-muted)", margin: "0 0 40px" }}>
            {pick(lang, bi("अंतिम अद्यतन: 26 अगस्त 2026", "Last updated: 26 August 2026"))}
          </p>

          <SectionHeading>{pick(lang, bi("1. स्वामित्व", "1. Ownership"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "इस वेबसाइट की सामग्री — पाठ, चित्र, डिज़ाइन, लोगो, आइकन, ध्वनि और सॉफ्टवेयर — का स्वामित्व मध्य प्रदेश शासन के पास है। यह भारत के कॉपीराइट अधिनियम, 1957 द्वारा संरक्षित है।",
              "The content of this website — text, images, design, logos, icons, audio and software — is owned by the Government of Madhya Pradesh. It is protected by the Indian Copyright Act 1957."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("2. अनुमत उपयोग", "2. Permitted use"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 12px" }}>
            {pick(lang, bi(
              "आप निम्नलिखित कार्य कर सकते हैं, बशर्ते स्रोत का उल्लेख हो:",
              "You may do the following, provided the source is acknowledged:"
            ))}
          </p>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("व्यक्तिगत, गैर-व्यावसायिक उपयोग के लिए सामग्री डाउनलोड या प्रिंट करना।", "Download or print content for personal, non-commercial use."))}</li>
            <li>{pick(lang, bi("शैक्षिक या अनुसंधान उद्देश्यों के लिए उचित उद्धरण के साथ उद्धृत करना।", "Quote with fair citation for educational or research purposes."))}</li>
            <li>{pick(lang, bi("सार्वजनिक हित के समाचार कवरेज में उल्लेख करना।", "Mention in news coverage in the public interest."))}</li>
          </ul>

          <SectionHeading>{pick(lang, bi("3. वर्जित उपयोग", "3. Prohibited use"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("व्यावसायिक उद्देश्यों के लिए बिना लिखित अनुमति के सामग्री का पुनः उपयोग।", "Reuse of content for commercial purposes without written permission."))}</li>
            <li>{pick(lang, bi("सामग्री को इस प्रकार संशोधित करना जो गलत या भ्रामक हो।", "Modifying content in a way that is misleading or inaccurate."))}</li>
            <li>{pick(lang, bi("सामग्री का उपयोग किसी राजनीतिक या विचारधारात्मक उद्देश्य के लिए।", "Using content for political or ideological purposes."))}</li>
            <li>{pick(lang, bi("MP शासन के नाम या लोगो का अनधिकृत उपयोग।", "Unauthorised use of the Government of MP's name or logos."))}</li>
          </ul>

          <SectionHeading>{pick(lang, bi("4. तृतीय-पक्ष सामग्री", "4. Third-party content"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "इस पोर्टल पर कुछ चित्र और सामग्री तृतीय-पक्ष के लाइसेंस के अंतर्गत हैं। इनके उपयोग के लिए उनके मूल लाइसेंस की शर्तें लागू होती हैं। पोर्टल के UI घटक (Lucide Icons) MIT लाइसेंस के अंतर्गत हैं।",
              "Some images and content on this portal are under third-party licences. The terms of those original licences apply for their use. Portal UI components (Lucide Icons) are under the MIT licence."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("5. अनुमति के लिए संपर्क", "5. Contact for permissions"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: 0 }}>
            {pick(lang, bi(
              "इस पोर्टल की सामग्री के पुनः उपयोग की अनुमति के लिए: ",
              "For permission to reuse content from this portal: "
            ))}
            <a href="mailto:copyright@praman.mp.gov.in" style={{ color: "var(--blue-600)" }}>copyright@praman.mp.gov.in</a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
