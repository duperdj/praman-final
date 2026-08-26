"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function TermsPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 860 }}>
          <div className="eyebrow" style={{ color: "var(--blue-500)", marginBottom: 8 }}>Praman</div>
          <h1 className="h-page" style={{ margin: "0 0 8px" }}>{pick(lang, bi("उपयोग की शर्तें", "Terms of Use"))}</h1>
          <p style={{ font: "var(--type-caption)", color: "var(--text-muted)", margin: "0 0 40px" }}>
            {pick(lang, bi("अंतिम अद्यतन: 26 अगस्त 2026", "Last updated: 26 August 2026"))}
          </p>

          <SectionHeading>{pick(lang, bi("1. स्वीकृति", "1. Acceptance"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "प्रमाण (praman.mp.gov.in) का उपयोग करके आप इन उपयोग की शर्तों से सहमत होते हैं। यदि आप इनसे सहमत नहीं हैं, तो कृपया इस पोर्टल का उपयोग न करें। ये शर्तें समय-समय पर बदली जा सकती हैं; परिवर्तन इस पृष्ठ पर प्रकाशित होंगे।",
              "By using Praman (praman.mp.gov.in) you agree to these Terms of Use. If you do not agree, please do not use this portal. These terms may be updated from time to time; changes will be published on this page."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("2. पोर्टल का उद्देश्य", "2. Purpose of the portal"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "प्रमाण मध्य प्रदेश शासन की एक नागरिक सेवा पहल है जो सरकारी प्रमाण पत्रों और सेवाओं के लिए ऑनलाइन आवेदन, स्थिति-ट्रैकिंग और निर्णय प्राप्त करने की सुविधा प्रदान करती है। यह पोर्टल एक हैकाथॉन प्रदर्शन संस्करण है जो नमूना डेटा पर चलता है।",
              "Praman is a Government of Madhya Pradesh citizen service initiative that enables online application, status tracking and receipt of decisions for government certificates and services. This portal is a hackathon demonstration version operating on sample data."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("3. उपयोगकर्ता का दायित्व", "3. User responsibilities"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px", display: "grid", gap: "var(--space-3)" }}>
            <li>{pick(lang, bi("सटीक और सत्य जानकारी प्रदान करना। गलत जानकारी आवेदन रद्द करने का आधार है।", "Provide accurate and truthful information. Incorrect information may result in rejection of application."))}</li>
            <li>{pick(lang, bi("अपने OTP, अकाउंट और डिवाइस की सुरक्षा स्वयं करना।", "Keep your OTP, account and device secure."))}</li>
            <li>{pick(lang, bi("पोर्टल का उपयोग केवल वैध नागरिक उद्देश्यों के लिए करना।", "Use the portal only for legitimate citizen purposes."))}</li>
            <li>{pick(lang, bi("किसी अन्य नागरिक के नाम पर आवेदन न करना (अधिकृत प्रतिनिधि को छोड़कर)।", "Do not apply in another citizen's name (except authorised representatives)."))}</li>
          </ul>

          <SectionHeading>{pick(lang, bi("4. डेटा और गोपनीयता", "4. Data and privacy"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "आपके डेटा का उपयोग केवल सेवा प्रदान करने के लिए किया जाता है। विस्तृत जानकारी के लिए हमारी गोपनीयता नीति देखें।",
              "Your data is used only for service delivery. See our privacy policy for full details."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("5. सेवा उपलब्धता", "5. Service availability"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "प्रमाण सर्वोत्तम उपलब्धता के लिए प्रयास करता है परंतु रखरखाव, अपग्रेड या अप्रत्याशित घटनाओं के कारण सेवा अस्थायी रूप से अनुपलब्ध हो सकती है। अनुपलब्धता के लिए शासन उत्तरदायी नहीं है।",
              "Praman strives for maximum availability but service may be temporarily unavailable due to maintenance, upgrades or unforeseen events. The government is not liable for such unavailability."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("6. बौद्धिक संपदा", "6. Intellectual property"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "इस पोर्टल की सामग्री, डिज़ाइन और सॉफ्टवेयर मध्य प्रदेश शासन की बौद्धिक संपदा हैं। लिखित अनुमति के बिना व्यावसायिक उपयोग, पुनः प्रकाशन या अनुकूलन वर्जित है।",
              "The content, design and software of this portal are the intellectual property of the Government of Madhya Pradesh. Commercial use, republication or adaptation without written permission is prohibited."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("7. लागू कानून", "7. Applicable law"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
            {pick(lang, bi(
              "ये शर्तें भारत के कानून के अंतर्गत शासित हैं। किसी विवाद की स्थिति में भोपाल की न्यायालयों का अधिकार क्षेत्र लागू होगा।",
              "These terms are governed by the laws of India. In case of any dispute, the courts at Bhopal shall have jurisdiction."
            ))}
          </p>

          <SectionHeading>{pick(lang, bi("8. संपर्क", "8. Contact"))}</SectionHeading>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: 0 }}>
            {pick(lang, bi(
              "इन शर्तों के बारे में प्रश्नों के लिए: ",
              "For questions about these terms: "
            ))}
            <a href="mailto:support@praman.mp.gov.in" style={{ color: "var(--blue-600)" }}>support@praman.mp.gov.in</a>
            {pick(lang, bi(" या CM हेल्पलाइन 181।", " or CM Helpline 181."))}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
