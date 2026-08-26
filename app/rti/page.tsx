"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";

const STEPS = [
  {
    title: bi("आवेदन तैयार करें", "Prepare your application"),
    body: bi(
      "सादे कागज़ पर या निर्धारित प्रारूप में हिंदी या अंग्रेज़ी में लिखें। जानकारी का स्पष्ट वर्णन करें — कौन-सा विभाग, कौन-सी अवधि, क्या जानकारी चाहिए।",
      "Write in plain language on plain paper or the prescribed format in Hindi or English. Clearly describe the information — which department, what period, what information is needed."
    ),
  },
  {
    title: bi("लोक सूचना अधिकारी (PIO) को भेजें", "Send to the Public Information Officer (PIO)"),
    body: bi(
      "आवेदन उस विभाग के PIO को भेजें जिसके पास सूचना है। ₹10 आवेदन शुल्क — IPO, DD, कैश, या online भुगतान। BPL नागरिकों के लिए शुल्क माफ़।",
      "Send the application to the PIO of the department holding the information. ₹10 application fee — IPO, DD, cash, or online payment. Fee waived for BPL citizens."
    ),
  },
  {
    title: bi("30 दिन में जवाब", "Response within 30 days"),
    body: bi(
      "PIO को 30 कार्य दिवसों में जवाब देना अनिवार्य है (जीवन-मृत्यु संबंधी मामलों में 48 घंटे)। अतिरिक्त जानकारी शुल्क: ₹2/पृष्ठ, CD/floppy: वास्तविक लागत।",
      "The PIO must respond within 30 working days (48 hours for life-or-death matters). Additional information charges: ₹2/page, CD/floppy: actual cost."
    ),
  },
  {
    title: bi("प्रथम अपील", "First appeal"),
    body: bi(
      "यदि उत्तर असंतोषजनक या अनुपलब्ध हो तो 30 दिनों में प्रथम अपीलीय अधिकारी (FAA) के समक्ष अपील करें। FAA 30 दिनों में निर्णय लेता है।",
      "If the response is unsatisfactory or missing, appeal to the First Appellate Authority (FAA) within 30 days. FAA decides within 30 days."
    ),
  },
  {
    title: bi("MP सूचना आयोग में द्वितीय अपील", "Second appeal to MP Information Commission"),
    body: bi(
      "FAA के निर्णय से असंतुष्ट होने पर मध्य प्रदेश राज्य सूचना आयोग (MPSIC) में 90 दिनों में द्वितीय अपील करें। MPSIC के पास दंड और मुआवज़े का अधिकार है।",
      "If dissatisfied with the FAA decision, file a second appeal to the MP State Information Commission (MPSIC) within 90 days. MPSIC has powers to impose penalties and award compensation."
    ),
  },
];

const EXEMPTIONS = [
  bi("राष्ट्रीय सुरक्षा, संप्रभुता और अखंडता से संबंधित सूचना।", "Information related to national security, sovereignty and integrity."),
  bi("कैबिनेट कागज़ात (निर्णय के बाद प्रकटीकरण के साथ)।", "Cabinet papers (with disclosure post-decision)."),
  bi("किसी व्यक्ति की निजता का अनुचित उल्लंघन करने वाली सूचना।", "Information that would constitute an unwarranted invasion of privacy."),
  bi("न्यायालयीन अवमानना से जुड़ी सूचना।", "Information that would amount to contempt of court."),
  bi("व्यापार रहस्य और बौद्धिक संपदा।", "Trade secrets and intellectual property."),
];

export default function RTIPage() {
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
              {pick(lang, bi("सूचना का अधिकार (RTI)", "Right to Information (RTI)"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "RTI अधिनियम 2005 के तहत हर नागरिक को सरकारी जानकारी माँगने का अधिकार है।",
                "Under the RTI Act 2005 every citizen has the right to seek information from the government."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 960 }}>
          {/* What is RTI */}
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "72ch", margin: "0 0 12px" }}>
            {pick(lang, bi(
              "सूचना का अधिकार अधिनियम, 2005 (RTI Act) भारत का एक क्रांतिकारी कानून है जो नागरिकों को सरकारी विभागों, सार्वजनिक प्राधिकरणों और उनके द्वारा वित्तपोषित निकायों से जानकारी माँगने का कानूनी अधिकार देता है।",
              "The Right to Information Act 2005 (RTI Act) is a landmark Indian law giving citizens the legal right to seek information from government departments, public authorities and bodies substantially financed by them."
            ))}
          </p>
          <p style={{ font: "var(--type-body)", color: "var(--ink-800)", maxWidth: "72ch", margin: "0 0 40px" }}>
            {pick(lang, bi(
              "मध्य प्रदेश में RTI आवेदन राज्य सरकार के विभागों के लिए लोक सूचना अधिकारी (PIO) को, और केंद्र सरकार के विभागों के लिए केंद्रीय PIO को भेजा जाता है।",
              "In Madhya Pradesh, RTI applications for state government departments are sent to the Public Information Officer (PIO) of that department, and for central government departments to the Central PIO."
            ))}
          </p>

          {/* Steps */}
          <SectionHeading>{pick(lang, bi("RTI कैसे दायर करें", "How to file an RTI"))}</SectionHeading>
          <div style={{ marginBottom: 48 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "var(--space-5)", paddingBottom: i < STEPS.length - 1 ? "var(--space-7)" : 0, borderBottom: i < STEPS.length - 1 ? "1px solid var(--border-default)" : "none", marginBottom: i < STEPS.length - 1 ? "var(--space-7)" : 0 }}>
                <div style={{ width: 48, height: 48, background: "var(--blue-500)", color: "var(--ink-0)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 18px var(--font-sans)", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ font: "var(--type-h3)", margin: "8px 0 8px" }}>{pick(lang, s.title)}</h3>
                  <p style={{ font: "var(--type-body-sm)", color: "var(--ink-800)", margin: 0 }}>{pick(lang, s.body)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key facts */}
          <SectionHeading>{pick(lang, bi("मुख्य तथ्य", "Key facts"))}</SectionHeading>
          <div style={{ border: "1px solid var(--border-default)", overflowX: "auto", marginBottom: 40 }}>
            <div style={{ minWidth: 400 }}>
              {[
                [bi("आवेदन शुल्क", "Application fee"), bi("₹10", "₹10")],
                [bi("प्रतिलिपि शुल्क", "Copy charge"), bi("₹2 प्रति पृष्ठ", "₹2 per page")],
                [bi("BPL छूट", "BPL exemption"), bi("निःशुल्क", "Free")],
                [bi("सामान्य समय-सीमा", "Standard deadline"), bi("30 कार्य दिवस", "30 working days")],
                [bi("जीवन-मृत्यु मामला", "Life or death matter"), bi("48 घंटे", "48 hours")],
                [bi("PIO द्वारा देरी पर जुर्माना", "PIO penalty for delay"), bi("₹250/दिन, अधिकतम ₹25,000", "₹250/day, max ₹25,000")],
                [bi("MP सूचना आयोग", "MP Information Commission"), bi("कोर्ट रोड, भोपाल — 462011", "Court Road, Bhopal — 462011")],
              ].map(([label, value], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: i > 0 ? "1px solid var(--border-default)" : "none", background: i % 2 ? "var(--ink-50)" : "var(--ink-0)" }}>
                  <div style={{ padding: "12px 16px", font: "600 13px var(--font-sans)", color: "var(--ink-700)" }}>{pick(lang, label as { hi: string; en: string })}</div>
                  <div style={{ padding: "12px 16px", font: "var(--type-body-sm)", color: "var(--ink-900)" }}>{pick(lang, value as { hi: string; en: string })}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Exemptions */}
          <SectionHeading>{pick(lang, bi("छूट प्राप्त सूचना", "Exempt information"))}</SectionHeading>
          <ul style={{ paddingLeft: 20, display: "grid", gap: "var(--space-3)", margin: "0 0 40px" }}>
            {EXEMPTIONS.map((e, i) => (
              <li key={i} style={{ font: "var(--type-body-sm)", color: "var(--ink-800)" }}>{pick(lang, e)}</li>
            ))}
          </ul>

          <Callout tone="info" title={pick(lang, bi("ऑनलाइन RTI — RTI Online Portal", "Online RTI — RTI Online Portal"))}>
            <p style={{ margin: 0 }}>
              {pick(lang, bi(
                "केंद्र सरकार के विभागों के लिए ऑनलाइन RTI: rtionline.gov.in। मध्य प्रदेश राज्य विभागों के लिए: mpedistrict.gov.in पर RTI अनुभाग। किसी सहायता के लिए CM हेल्पलाइन 181 पर कॉल करें।",
                "Online RTI for central government departments: rtionline.gov.in. For MP state departments: RTI section on mpedistrict.gov.in. For assistance call CM Helpline 181."
              ))}
            </p>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
