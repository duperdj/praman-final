"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Icon } from "@/components/ui/Icon";

const RESPONSIBILITIES = [
  bi("राज्य मंत्रिमंडल का नेतृत्व और नीति-निर्देशन।", "Leading the state Cabinet and guiding policy."),
  bi("लोक सेवा गारंटी अधिनियम के माध्यम से नागरिक सेवाओं की समयबद्ध डिलीवरी सुनिश्चित करना।", "Ensuring time-bound delivery of citizen services through the Public Services Guarantee Act."),
  bi("सामाजिक कल्याण — पेंशन, आवास, शिक्षा और स्वास्थ्य योजनाओं का क्रियान्वयन।", "Social welfare — implementing pension, housing, education and health schemes."),
  bi("आपदा प्रबंधन में राज्य की समन्वय भूमिका।", "Coordination of the state in disaster management."),
  bi("CM हेल्पलाइन 181 के माध्यम से नागरिकों की सीधी शिकायतों का समाधान।", "Direct resolution of citizens' grievances via CM Helpline 181."),
];

const HELPLINE_FEATURES = [
  bi("24×7 उपलब्ध — रात और सप्ताहांत सहित।", "Available 24×7 — including nights and weekends."),
  bi("हिंदी और अंग्रेज़ी दोनों में सहायता।", "Assistance in both Hindi and English."),
  bi("शिकायत तत्काल दर्ज और नोडल अधिकारी को अग्रेषित।", "Grievance registered immediately and forwarded to nodal officer."),
  bi("SMS अपडेट और लाइव ट्रैकिंग।", "SMS updates and live tracking."),
  bi("SLA उल्लंघन पर स्वतः ऊर्ध्वगामी (escalation)।", "Automatic escalation on SLA breach."),
];

export default function ChiefMinisterPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>
              {pick(lang, bi("मध्य प्रदेश शासन", "Government of Madhya Pradesh"))}
            </div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("मुख्यमंत्री का कार्यालय", "Office of the Chief Minister"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "मध्य प्रदेश के मुख्यमंत्री की भूमिका, कर्तव्य और नागरिक सेवाओं से संबंध।",
                "The role, responsibilities and relationship of the Chief Minister of Madhya Pradesh with citizen services."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 960 }}>
          <div className="grid grid-2" style={{ gap: "var(--space-12)", alignItems: "start" }}>
            <div>
              {/* Office role */}
              <SectionHeading>{pick(lang, bi("मुख्यमंत्री का पद", "The office"))}</SectionHeading>
              <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 16px" }}>
                {pick(lang, bi(
                  "मुख्यमंत्री मध्य प्रदेश सरकार के कार्यपालिका प्रमुख होते हैं। वे राज्य विधानसभा में बहुमत दल या गठबंधन के नेता के रूप में राज्यपाल द्वारा नियुक्त होते हैं और मंत्रिपरिषद के नेतृत्व के साथ राज्य की नीतियों का निर्देशन करते हैं।",
                  "The Chief Minister is the head of the executive branch of the Government of Madhya Pradesh. Appointed by the Governor as the leader of the majority party or coalition in the state assembly, they lead the Council of Ministers and direct state policy."
                ))}
              </p>
              <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "0 0 24px" }}>
                {pick(lang, bi(
                  "भारत के संविधान के अनुच्छेद 163 और 164 के अंतर्गत मुख्यमंत्री मंत्रिपरिषद का नेतृत्व करते हैं और राज्यपाल को प्रशासनिक मामलों में सलाह देते हैं।",
                  "Under Articles 163 and 164 of the Constitution of India, the Chief Minister leads the Council of Ministers and advises the Governor on administrative matters."
                ))}
              </p>

              <SectionHeading>{pick(lang, bi("प्रमुख उत्तरदायित्व", "Key responsibilities"))}</SectionHeading>
              <ul style={{ paddingLeft: 20, display: "grid", gap: "var(--space-4)", margin: "0 0 32px" }}>
                {RESPONSIBILITIES.map((r, i) => (
                  <li key={i} style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, r)}</li>
                ))}
              </ul>
            </div>

            <div>
              {/* CM Helpline 181 */}
              <div style={{ background: "var(--blue-500)", padding: "var(--space-8)", color: "var(--ink-0)", marginBottom: "var(--space-8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: 12 }}>
                  <Icon name="phone" size="lg" />
                  <span style={{ font: "800 32px var(--font-sans)" }}>181</span>
                </div>
                <h2 style={{ font: "var(--type-h3)", margin: "0 0 8px", color: "var(--ink-0)" }}>
                  {pick(lang, bi("मुख्यमंत्री हेल्पलाइन", "Chief Minister Helpline"))}
                </h2>
                <p style={{ font: "var(--type-body-sm)", margin: "0 0 20px", color: "rgba(255,255,255,.9)" }}>
                  {pick(lang, bi(
                    "CM हेल्पलाइन 181 नागरिकों और मुख्यमंत्री कार्यालय के बीच सीधी कड़ी है। किसी भी सरकारी सेवा या शिकायत के लिए 24×7 उपलब्ध।",
                    "CM Helpline 181 is the direct link between citizens and the Chief Minister's office. Available 24×7 for any government service or grievance."
                  ))}
                </p>
                <a href="tel:181" style={{ display: "inline-block", background: "var(--ink-0)", color: "var(--blue-600)", font: "700 16px var(--font-sans)", padding: "12px 24px", textDecoration: "none" }}>
                  {pick(lang, bi("181 पर कॉल करें", "Call 181"))}
                </a>
              </div>

              <SectionHeading level={2}>{pick(lang, bi("हेल्पलाइन की विशेषताएँ", "Helpline features"))}</SectionHeading>
              <ul style={{ paddingLeft: 20, display: "grid", gap: "var(--space-4)", margin: "0 0 24px" }}>
                {HELPLINE_FEATURES.map((f, i) => (
                  <li key={i} style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, f)}</li>
                ))}
              </ul>

              <Callout tone="neutral">
                {pick(lang, bi(
                  "इस पृष्ठ पर किसी विशिष्ट व्यक्ति का नाम या उद्धरण नहीं दिया गया है — पद की भूमिका बताई गई है। वर्तमान मुख्यमंत्री की जानकारी के लिए आधिकारिक MP शासन वेबसाइट देखें।",
                  "This page describes the role of the office and does not name a specific individual — for current office-holder information visit the official MP Government website."
                ))}
              </Callout>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
