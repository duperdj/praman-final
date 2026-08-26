"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DEPTS = [
  {
    key: "revenue",
    name: bi("राजस्व एवं भू-अभिलेख विभाग", "Department of Revenue and Land Records"),
    remit: bi(
      "भू-अभिलेखों का रखरखाव, खसरा-खतौनी, भूमि बँटवारा, नजूल भूमि, राजस्व न्यायालय और आपदा प्रबंधन। खसरा-खतौनी, भूमि सुधार और आय प्रमाण पत्र सहित कई सेवाएँ इस विभाग के अंतर्गत आती हैं।",
      "Maintenance of land records, Khasra-Khatauni, land partition, Nazul land, revenue courts and disaster management. Khasra-Khatauni, land correction and income certificates fall under this department."
    ),
    services: [bi("खसरा / खतौनी प्रति", "Khasra / Khatauni copy"), bi("भूमि बँटवारा", "Land partition"), bi("अभिलेख सुधार", "Record correction"), bi("आय प्रमाण पत्र", "Income certificate")],
    href: "/services",
  },
  {
    key: "general-admin",
    name: bi("सामान्य प्रशासन विभाग", "General Administration Department"),
    remit: bi(
      "मूल निवासी, जाति (SC/ST/OBC), EWS प्रमाण पत्र और सरकारी सेवाओं की समन्वय व निगरानी। लोक सेवा गारंटी अधिनियम के क्रियान्वयन की नोडल एजेंसी।",
      "Domicile, caste (SC/ST/OBC), EWS certificates and coordination of government services. Nodal agency for implementing the Public Services Guarantee Act."
    ),
    services: [bi("मूल निवासी प्रमाण पत्र", "Domicile certificate"), bi("EWS प्रमाण पत्र", "EWS certificate"), bi("जाति प्रमाण पत्र", "Caste certificate")],
    href: "/services",
  },
  {
    key: "social-justice",
    name: bi("सामाजिक न्याय एवं निःशक्तजन कल्याण विभाग", "Social Justice and Disability Welfare Department"),
    remit: bi(
      "वृद्धावस्था, विधवा, दिव्यांग और कल्याणी पेंशन योजनाएँ। SC/ST/OBC वर्ग के कल्याण की योजनाएँ। समाज कल्याण संस्थाओं का पंजीकरण और नियंत्रण।",
      "Old-age, widow, disability and Kalyani pension schemes. Welfare schemes for SC/ST/OBC categories. Registration and regulation of social welfare institutions."
    ),
    services: [bi("वृद्धावस्था पेंशन", "Old-age pension"), bi("विधवा पेंशन", "Widow pension"), bi("दिव्यांग पेंशन", "Disability pension"), bi("मुख्यमंत्री कल्याणी पेंशन", "CM Kalyani pension")],
    href: "/services",
  },
  {
    key: "panchayat",
    name: bi("पंचायत एवं ग्रामीण विकास विभाग", "Panchayat and Rural Development Department"),
    remit: bi(
      "ग्राम पंचायतों की स्थापना, मनरेगा, ग्रामीण आवास, पेयजल, ग्रामीण सड़कें और MP राज्य ग्रामीण आजीविका मिशन (MPSRLM) का क्रियान्वयन।",
      "Establishment of gram panchayats, MGNREGA, rural housing, drinking water, village roads, and implementation of MPSRLM."
    ),
    services: [bi("ग्रामीण आजीविका मिशन", "Rural Livelihoods Mission"), bi("ग्राम पंचायत सेवाएँ", "Gram Panchayat services")],
    href: "/services",
  },
  {
    key: "school-education",
    name: bi("स्कूल शिक्षा विभाग", "School Education Department"),
    remit: bi(
      "कक्षा 1 से 12 तक की स्कूली शिक्षा, MP बोर्ड (MPBSE), छात्रवृत्ति वितरण, शाला दर्पण और नि:शुल्क पाठ्यपुस्तकें।",
      "School education from class 1 to 12, MP Board (MPBSE), scholarship distribution, Shala Darpan and free textbooks."
    ),
    services: [bi("छात्रवृत्ति", "Scholarship"), bi("माइग्रेशन प्रमाण पत्र", "Migration certificate"), bi("द्वितीय अंक-सूची", "Duplicate marksheet")],
    href: "/services",
  },
  {
    key: "higher-education",
    name: bi("उच्च शिक्षा विभाग", "Higher Education Department"),
    remit: bi(
      "महाविद्यालय और विश्वविद्यालय शिक्षा, अनुसंधान, MP उच्च शिक्षा अनुदान आयोग और उच्च शिक्षा छात्रवृत्ति।",
      "College and university education, research, MP Higher Education Grant Commission and higher education scholarships."
    ),
    services: [bi("उच्च शिक्षा छात्रवृत्ति", "Higher education scholarship"), bi("द्वितीय अंक-सूची", "Duplicate marksheet")],
    href: "/services",
  },
  {
    key: "labour",
    name: bi("श्रम विभाग", "Labour Department"),
    remit: bi(
      "श्रम अधिनियमों का क्रियान्वयन, असंगठित क्षेत्र श्रमिकों का पंजीकरण, व्यावसायिक सुरक्षा और कर्मकार मुआवज़ा।",
      "Enforcement of labour laws, registration of unorganised sector workers, occupational safety and workmen's compensation."
    ),
    services: [bi("श्रम पंजीकरण", "Labour registration"), bi("रोज़गार एवं कौशल", "Employment & skills")],
    href: "/services",
  },
  {
    key: "transport",
    name: bi("परिवहन विभाग", "Transport Department"),
    remit: bi(
      "वाहन पंजीकरण, ड्राइविंग लाइसेंस, परमिट, बस सेवाएँ और सड़क सुरक्षा। ऑनलाइन सेवाएँ: Sarathi और Vahan पोर्टल।",
      "Vehicle registration, driving licences, permits, bus services and road safety. Online services via Sarathi and Vahan portals."
    ),
    services: [bi("लर्निंग ड्राइविंग लाइसेंस", "Learner driving licence"), bi("वाहन पंजीकरण", "Vehicle registration")],
    href: "/services",
  },
  {
    key: "food",
    name: bi("खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग", "Food, Civil Supplies and Consumer Protection Department"),
    remit: bi(
      "राशन कार्ड, सार्वजनिक वितरण प्रणाली (PDS), खाद्य गुणवत्ता नियंत्रण और उपभोक्ता शिकायत निवारण।",
      "Ration cards, Public Distribution System (PDS), food quality control and consumer grievance redress."
    ),
    services: [bi("खाद्य लाइसेंस", "Food licence"), bi("राशन कार्ड सेवाएँ", "Ration card services")],
    href: "/services",
  },
];

export default function DepartmentsPage() {
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
              {pick(lang, bi("विभाग निर्देशिका", "Department directory"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "प्रमाण पर उपलब्ध सेवाओं से संबंधित मध्य प्रदेश सरकार के मुख्य विभाग।",
                "Key Madhya Pradesh government departments related to services available on Praman."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          <SectionHeading>{pick(lang, bi(`${DEPTS.length} विभाग`, `${DEPTS.length} departments`))}</SectionHeading>

          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            {DEPTS.map((d) => (
              <div key={d.key} className="hairline" style={{ background: "var(--ink-0)", padding: "var(--space-7)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-6)", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <h2 style={{ font: "600 17px var(--font-sans)", color: "var(--ink-900)", margin: "0 0 8px" }}>{pick(lang, d.name)}</h2>
                    <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 12px", maxWidth: "68ch" }}>{pick(lang, d.remit)}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {d.services.map((s) => (
                        <span key={s.en} style={{ font: "var(--type-caption)", background: "var(--surface-muted)", padding: "4px 10px", border: "1px solid var(--border-muted)" }}>
                          {pick(lang, s)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a href={d.href} style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--blue-600)", whiteSpace: "nowrap", textDecoration: "underline", flexShrink: 0, paddingTop: 4 }}>
                    {pick(lang, bi("सेवाएँ देखें →", "View services →"))}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
