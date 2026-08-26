"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";

export default function PrivacyPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 860 }}>
          <div className="eyebrow" style={{ color: "var(--blue-500)", marginBottom: 8 }}>Praman</div>
          <h1 className="h-page" style={{ margin: "0 0 8px" }}>{pick(lang, bi("गोपनीयता नीति", "Privacy Policy"))}</h1>
          <p style={{ font: "var(--type-caption)", color: "var(--text-muted)", margin: "0 0 32px" }}>
            {pick(lang, bi("अंतिम अद्यतन: 26 अगस्त 2026", "Last updated: 26 August 2026"))}
          </p>

          {/* Critical notice for hackathon */}
          <Callout tone="warning" title={pick(lang, bi("मूल्यांकन बिल्ड — नमूना डेटा", "Evaluation build — sample data"))} style={{ marginBottom: 36 }}>
            {pick(lang, bi(
              "यह प्रमाण का हैकाथॉन प्रदर्शन संस्करण है। इसमें कोई वास्तविक आधार, समग्र या व्यक्तिगत डेटा संग्रहीत या संसाधित नहीं किया जाता। आधार जैसे नंबर जानबूझकर Verhoeff checksum में विफल करने के लिए डिज़ाइन किए गए हैं। उत्पादन तैनाती में वास्तविक सरकारी API जोड़े जाएँगे।",
              "This is a hackathon demonstration version of Praman. No real Aadhaar, Samagra or personal data is stored or processed. Aadhaar-like numbers in the demo are designed to deliberately fail the Verhoeff checksum. Real government APIs will be connected at production deployment."
            ))}
          </Callout>

          <SectionHeading>{pick(lang, bi("1. हम क्या जानकारी एकत्र करते हैं", "1. What information we collect"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("मोबाइल नंबर — पहचान और OTP सत्यापन के लिए।", "Mobile number — for identification and OTP verification."))}</li>
            <li>{pick(lang, bi("आवेदन डेटा — आय, निवास, जाति आदि से संबंधित जानकारी जो आप स्वेच्छा से प्रदान करते हैं।", "Application data — income, residence, caste and other information you voluntarily provide."))}</li>
            <li>{pick(lang, bi("लॉग डेटा — IP पता, ब्राउज़र जानकारी, पृष्ठ दृश्य — सुरक्षा और सुधार के लिए।", "Log data — IP address, browser info, page views — for security and improvement."))}</li>
          </ul>

          <SectionHeading>{pick(lang, bi("2. डेटा का उपयोग", "2. How we use data"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("सेवा प्रदान करने के लिए — प्रमाण पत्र जारी करना, स्थिति दिखाना।", "To provide the service — issue certificates, show status."))}</li>
            <li>{pick(lang, bi("पहचान सत्यापन — आधार, समग्र और अन्य सरकारी रजिस्ट्रियों से।", "Identity verification — with Aadhaar, Samagra and other government registries."))}</li>
            <li>{pick(lang, bi("ऑडिट और अनुपालन — लोक सेवा गारंटी अधिनियम के तहत।", "Audit and compliance — under the Public Services Guarantee Act."))}</li>
          </ul>

          <SectionHeading>{pick(lang, bi("3. डेटा न्यूनीकरण और सहमति", "3. Data minimisation and consent"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>
            {pick(lang, bi(
              "हम केवल आवश्यक जानकारी एकत्र करते हैं। डाउनस्ट्रीम सेवाओं को आपकी वास्तविक आय या अन्य संवेदनशील डेटा नहीं मिलता — केवल हाँ/नहीं परिणाम। प्रत्येक रजिस्ट्री जाँच से पहले आपकी स्पष्ट सहमति ली जाती है।",
              "We collect only what is necessary. Downstream services do not receive your actual income or other sensitive data — only a yes/no outcome. Your explicit consent is sought before each registry check."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("4. डेटा साझाकरण", "4. Data sharing"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>
            {pick(lang, bi(
              "आपका डेटा निम्नलिखित के साथ साझा किया जा सकता है:",
              "Your data may be shared with the following:"
            ))}
          </p>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("संबंधित सरकारी विभाग — सेवा प्रदान करने के लिए।", "Relevant government departments — to provide the service."))}</li>
            <li>{pick(lang, bi("UIDAI, Samagra, MPBhulekh जैसी सरकारी रजिस्ट्रियाँ — सत्यापन के लिए।", "Government registries like UIDAI, Samagra, MPBhulekh — for verification."))}</li>
            <li>{pick(lang, bi("ऑडिट अधिकारी — कानूनी अनुपालन के लिए।", "Audit authorities — for legal compliance."))}</li>
          </ul>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            <strong>{pick(lang, bi("हम कभी भी: ", "We never: "))}</strong>
            {pick(lang, bi(
              "आपका डेटा तीसरे पक्ष को बेचते, किराए पर देते या विपणन उद्देश्यों के लिए उपयोग करते हैं।",
              "sell, rent or use your data for marketing purposes or share it with third parties outside the above."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("5. आधार डेटा स्थिति", "5. Aadhaar data stance"))}</SectionHeading>
          <Callout tone="info" style={{ marginBottom: 24 }}>
            {pick(lang, bi(
              "इस हैकाथॉन बिल्ड में: सभी डेटा सिंथेटिक है। आधार जैसे नंबर जानबूझकर Verhoeff checksum विफल करते हैं — कोई वास्तविक आधार डेटा संसाधित नहीं होता। कोई Aadhaar, Samagra या वास्तविक व्यक्तिगत डेटा संग्रहीत नहीं है।",
              "In this hackathon build: all data is synthetic. Aadhaar-like numbers deliberately fail the Verhoeff checksum — no real Aadhaar data is processed. No Aadhaar, Samagra or real personal data is stored."
            ))}
          </Callout>

          <SectionHeading>{pick(lang, bi("6. आपके अधिकार", "6. Your rights"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("अपने डेटा की प्रति माँगने का अधिकार (RTI Act 2005 के तहत)।", "Right to request a copy of your data (under RTI Act 2005)."))}</li>
            <li>{pick(lang, bi("गलत जानकारी सुधरवाने का अधिकार।", "Right to have incorrect information corrected."))}</li>
            <li>{pick(lang, bi("CM हेल्पलाइन 181 या समस्या बताएँ फ़ॉर्म के माध्यम से शिकायत दर्ज करने का अधिकार।", "Right to file a complaint via CM Helpline 181 or the Report a problem form."))}</li>
          </ul>

          <SectionHeading>{pick(lang, bi("7. संपर्क", "7. Contact"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: 0 }}>
            {pick(lang, bi("गोपनीयता संबंधी प्रश्नों के लिए: ", "For privacy questions: "))}
            <a href="mailto:privacy@praman.mp.gov.in" style={{ color: "var(--blue-600)" }}>privacy@praman.mp.gov.in</a>
            {pick(lang, bi(" या CM हेल्पलाइन 181।", " or CM Helpline 181."))}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
