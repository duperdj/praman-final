// The service catalog — modelled on the real mpedistrict.gov.in breadth
// (300+ services across departments). Income certificate is the fully-working
// flagship flow; the rest have authentic info pages via /services/[slug].
import type { Bilingual } from "@/lib/contracts";

export type Service = {
  slug: string;
  title: Bilingual;
  desc: Bilingual;
  icon: string;
  live?: boolean; // has a working end-to-end flow in this build
  oneDay?: boolean; // "समाधान एक दिन" — 1 working day
  href?: string; // overrides /services/[slug] for live flows
};

export type Department = { key: string; name: Bilingual; services: Service[] };

export const DEPARTMENTS: Department[] = [
  {
    key: "general",
    name: { hi: "सामान्य प्रशासन", en: "General Administration" },
    services: [
      { slug: "income-certificate", title: { hi: "आय प्रमाण पत्र", en: "Income certificate" }, desc: { hi: "परिवार की वार्षिक आय का प्रमाण। अभिलेख मेल खाने पर उसी दिन जारी।", en: "Proof of annual family income. Issued same-day when records match." }, icon: "file-text", live: true, oneDay: true, href: "/services/income-certificate" },
      { slug: "domicile", title: { hi: "मूल निवासी प्रमाण पत्र", en: "Domicile certificate" }, desc: { hi: "मध्य प्रदेश का निवास प्रमाण — प्रवेश और नौकरी के लिए।", en: "Proof of residence in MP — for admissions and jobs." }, icon: "id-card", oneDay: true },
      { slug: "caste-sc-st", title: { hi: "अनुसूचित जाति/जनजाति प्रमाण पत्र", en: "SC/ST certificate" }, desc: { hi: "आरक्षण और योजनाओं के लिए जाति प्रमाण।", en: "Caste proof for reservation and schemes." }, icon: "users" },
      { slug: "caste-obc", title: { hi: "अन्य पिछड़ा वर्ग प्रमाण पत्र", en: "OBC certificate" }, desc: { hi: "OBC वर्ग का प्रमाण पत्र।", en: "Certificate for the OBC category." }, icon: "users" },
      { slug: "ews", title: { hi: "EWS प्रमाण पत्र", en: "EWS certificate" }, desc: { hi: "आर्थिक रूप से कमज़ोर वर्ग हेतु प्रमाण।", en: "Economically Weaker Section certificate." }, icon: "banknote", oneDay: true },
    ],
  },
  {
    key: "revenue",
    name: { hi: "राजस्व एवं भू-अभिलेख", en: "Revenue & Land Records" },
    services: [
      { slug: "khasra-khatauni", title: { hi: "खसरा / खतौनी की प्रति", en: "Khasra / Khatauni copy" }, desc: { hi: "भूमि जोत का अभिलेख ऑनलाइन।", en: "Landholding record online." }, icon: "tractor" },
      { slug: "land-partition", title: { hi: "भूमि बँटवारा", en: "Land partition" }, desc: { hi: "सह-खातेदारों के बीच भूमि का बँटवारा।", en: "Division of land among co-holders." }, icon: "scale" },
      { slug: "legal-heir", title: { hi: "उत्तराधिकारी / वारिस प्रमाण पत्र", en: "Legal heir / succession" }, desc: { hi: "उत्तराधिकार का प्रमाण।", en: "Proof of succession." }, icon: "scale" },
      { slug: "record-correction", title: { hi: "अभिलेख सुधार", en: "Record correction" }, desc: { hi: "भू-अभिलेख में त्रुटि सुधार।", en: "Correct an error in land records." }, icon: "file-text" },
    ],
  },
  {
    key: "welfare",
    name: { hi: "सामाजिक न्याय एवं पेंशन", en: "Social Welfare & Pensions" },
    services: [
      { slug: "old-age-pension", title: { hi: "वृद्धावस्था पेंशन", en: "Old-age pension" }, desc: { hi: "वरिष्ठ नागरिकों हेतु मासिक पेंशन।", en: "Monthly pension for senior citizens." }, icon: "hourglass" },
      { slug: "widow-pension", title: { hi: "विधवा पेंशन", en: "Widow pension" }, desc: { hi: "विधवा महिलाओं हेतु सहायता।", en: "Support for widowed women." }, icon: "banknote" },
      { slug: "disability-pension", title: { hi: "दिव्यांग पेंशन", en: "Disability pension" }, desc: { hi: "दिव्यांगजनों हेतु मासिक पेंशन।", en: "Monthly pension for persons with disabilities." }, icon: "banknote" },
      { slug: "kalyani-pension", title: { hi: "मुख्यमंत्री कल्याणी पेंशन", en: "CM Kalyani pension" }, desc: { hi: "विधवा महिलाओं हेतु कल्याणी सहायता।", en: "Kalyani assistance for widows." }, icon: "banknote" },
    ],
  },
  {
    key: "registration",
    name: { hi: "प्रमाण पत्र एवं पंजीकरण", en: "Certificates & Registration" },
    services: [
      { slug: "birth-registration", title: { hi: "जन्म पंजीकरण", en: "Birth registration" }, desc: { hi: "जन्म प्रमाण पत्र हेतु पंजीकरण।", en: "Registration for a birth certificate." }, icon: "id-card" },
      { slug: "death-registration", title: { hi: "मृत्यु पंजीकरण", en: "Death registration" }, desc: { hi: "मृत्यु प्रमाण पत्र हेतु पंजीकरण।", en: "Registration for a death certificate." }, icon: "id-card" },
      { slug: "marriage-registration", title: { hi: "विवाह पंजीकरण", en: "Marriage registration" }, desc: { hi: "विवाह का पंजीकरण एवं प्रमाण पत्र।", en: "Register a marriage and get a certificate." }, icon: "users" },
      { slug: "character-certificate", title: { hi: "चरित्र प्रमाण पत्र", en: "Character certificate" }, desc: { hi: "चरित्र सत्यापन प्रमाण।", en: "Character verification certificate." }, icon: "shield-check" },
    ],
  },
  {
    key: "education-employment",
    name: { hi: "शिक्षा एवं रोज़गार", en: "Education & Employment" },
    services: [
      { slug: "scholarship", title: { hi: "छात्रवृत्ति", en: "Scholarship" }, desc: { hi: "पात्रता जाँचें और छात्रवृत्ति के लिए आवेदन करें।", en: "Check eligibility and apply for a scholarship." }, icon: "graduation-cap", live: true, href: "/services/scholarship" },
      { slug: "employment", title: { hi: "रोज़गार एवं कौशल", en: "Employment & skills" }, desc: { hi: "कौशल प्रशिक्षण और रोज़गार योजनाओं के लिए पंजीकरण।", en: "Register for skill training and employment schemes." }, icon: "briefcase", live: true, href: "/services/employment" },
      { slug: "migration-certificate", title: { hi: "माइग्रेशन प्रमाण पत्र", en: "Migration certificate" }, desc: { hi: "विश्वविद्यालय स्थानांतरण हेतु।", en: "For university transfer." }, icon: "file-text" },
      { slug: "duplicate-marksheet", title: { hi: "द्वितीय अंक-सूची", en: "Duplicate marksheet" }, desc: { hi: "खोई हुई अंक-सूची की प्रति।", en: "Copy of a lost marksheet." }, icon: "file-text" },
    ],
  },
  {
    key: "business-transport",
    name: { hi: "व्यापार एवं परिवहन", en: "Business & Transport" },
    services: [
      { slug: "trade-license", title: { hi: "व्यापार लाइसेंस", en: "Trade licence" }, desc: { hi: "व्यवसाय हेतु लाइसेंस।", en: "Licence to run a business." }, icon: "briefcase" },
      { slug: "food-license", title: { hi: "खाद्य लाइसेंस", en: "Food licence" }, desc: { hi: "खाद्य विक्रेताओं हेतु लाइसेंस।", en: "Licence for food handlers." }, icon: "briefcase" },
      { slug: "learner-license", title: { hi: "लर्निंग ड्राइविंग लाइसेंस", en: "Learner driving licence" }, desc: { hi: "अस्थायी ड्राइविंग लाइसेंस।", en: "A learner's driving licence." }, icon: "id-card" },
      { slug: "vehicle-registration", title: { hi: "वाहन पंजीकरण", en: "Vehicle registration" }, desc: { hi: "नए वाहन का पंजीकरण।", en: "Register a new vehicle." }, icon: "id-card" },
    ],
  },
];

export const ALL_SERVICES: Service[] = DEPARTMENTS.flatMap((d) => d.services);

export function serviceBySlug(slug: string): { service: Service; dept: Department } | undefined {
  for (const dept of DEPARTMENTS) {
    const service = dept.services.find((s) => s.slug === slug);
    if (service) return { service, dept };
  }
  return undefined;
}

export function serviceHref(s: Service): string {
  return s.href ?? `/services/${s.slug}`;
}
