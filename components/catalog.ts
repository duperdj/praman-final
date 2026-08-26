// Operational config for every catalog service, keyed by slug. This is what
// makes the system config-driven: the apply form, the decision engine, the SLA,
// the fee and the certificate all read from here — adding a service is data,
// not code. `services.ts` holds the browse/listing metadata; this holds the
// operational definition.
import type { Bilingual, IncomeSource } from "@/lib/contracts";

export type FieldType = "text" | "number" | "money" | "date" | "tel" | "select";

export type Field = {
  name: string;
  label: Bilingual;
  type: FieldType;
  required?: boolean;
  prefix?: string;
  placeholder?: Bilingual;
  help?: Bilingual;
  options?: { value: string; label: Bilingual }[];
};

// How a service reaches a decision. `income-engine` delegates to Lane A's proven
// 8-rule engine; the rest are config-driven strategies in components/engine.ts.
export type Strategy =
  | "income-engine"
  | "income-threshold"
  | "residency"
  | "age-eligibility"
  | "record-copy"
  | "document-verify";

export type ServiceConfig = {
  strategy: Strategy;
  param?: number; // income threshold / minimum age, per strategy
  fields: Field[]; // service-specific fields (identity is collected separately)
  feeInr: number; // 0 = free online
  slaDays: number; // statutory working days (1 for Samadhan Ek Din)
  certTitle: Bilingual;
  documents?: Bilingual[]; // physical documents a document-verify service will check
};

const INCOME_SOURCE_OPTIONS: { value: IncomeSource; label: Bilingual }[] = [
  { value: "AGRICULTURE", label: { hi: "कृषि", en: "Agriculture" } },
  { value: "SALARY", label: { hi: "वेतन", en: "Salary" } },
  { value: "BUSINESS", label: { hi: "व्यापार", en: "Business" } },
  { value: "DAILY_WAGE", label: { hi: "दैनिक मजदूरी", en: "Daily wage" } },
  { value: "PENSION", label: { hi: "पेंशन", en: "Pension" } },
  { value: "OTHER", label: { hi: "अन्य", en: "Other" } },
];

const purposeField: Field = { name: "purpose", label: { hi: "प्रयोजन", en: "Purpose" }, type: "text", required: true, placeholder: { hi: "जैसे छात्रवृत्ति", en: "e.g. scholarship" } };
const incomeField: Field = { name: "annualIncome", label: { hi: "वार्षिक आय", en: "Annual income" }, type: "money", required: true, prefix: "₹" };
const sourceField: Field = { name: "incomeSource", label: { hi: "आय का स्रोत", en: "Income source" }, type: "select", required: true, options: INCOME_SOURCE_OPTIONS };
const khasraField: Field = { name: "khasraNumber", label: { hi: "खसरा क्रमांक", en: "Khasra number" }, type: "text", required: true };
const bankField: Field = { name: "bankAccount", label: { hi: "बैंक खाता", en: "Bank account" }, type: "text", required: true };

export const SERVICE_CONFIG: Record<string, ServiceConfig> = {
  "income-certificate": { strategy: "income-engine", fields: [incomeField, sourceField, purposeField], feeInr: 0, slaDays: 1, certTitle: { hi: "आय प्रमाण पत्र", en: "Income Certificate" } },
  domicile: { strategy: "residency", fields: [{ name: "yearsOfResidence", label: { hi: "निवास के वर्ष", en: "Years of residence" }, type: "number", required: true }, purposeField], feeInr: 0, slaDays: 1, certTitle: { hi: "मूल निवासी प्रमाण पत्र", en: "Domicile Certificate" } },
  "caste-sc-st": { strategy: "document-verify", fields: [{ name: "caste", label: { hi: "जाति", en: "Caste" }, type: "text", required: true }, purposeField], feeInr: 0, slaDays: 3, certTitle: { hi: "जाति प्रमाण पत्र (SC/ST)", en: "Caste Certificate (SC/ST)" }, documents: [{ hi: "पिता/परिवार का जाति प्रमाण", en: "Father/family caste record" }, { hi: "निवास प्रमाण", en: "Residence proof" }] },
  "caste-obc": { strategy: "document-verify", fields: [{ name: "caste", label: { hi: "जाति", en: "Caste" }, type: "text", required: true }, purposeField], feeInr: 0, slaDays: 3, certTitle: { hi: "अन्य पिछड़ा वर्ग प्रमाण पत्र", en: "OBC Certificate" }, documents: [{ hi: "जाति संबंधी अभिलेख", en: "Caste record" }] },
  ews: { strategy: "income-threshold", param: 800000, fields: [incomeField, purposeField], feeInr: 0, slaDays: 1, certTitle: { hi: "EWS प्रमाण पत्र", en: "EWS Certificate" } },
  "khasra-khatauni": { strategy: "record-copy", fields: [khasraField], feeInr: 30, slaDays: 1, certTitle: { hi: "खसरा / खतौनी प्रति", en: "Khasra / Khatauni Copy" } },
  "land-partition": { strategy: "document-verify", fields: [khasraField], feeInr: 0, slaDays: 3, certTitle: { hi: "भूमि बँटवारा आदेश", en: "Land Partition Order" }, documents: [{ hi: "सह-खातेदार सहमति", en: "Co-holder consent" }, { hi: "नक्शा", en: "Map" }] },
  "legal-heir": { strategy: "document-verify", fields: [{ name: "deceasedName", label: { hi: "मृतक का नाम", en: "Deceased's name" }, type: "text", required: true }, { name: "relationship", label: { hi: "संबंध", en: "Relationship" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "उत्तराधिकारी प्रमाण पत्र", en: "Legal Heir Certificate" }, documents: [{ hi: "मृत्यु प्रमाण पत्र", en: "Death certificate" }] },
  "record-correction": { strategy: "document-verify", fields: [khasraField, { name: "correctionDetails", label: { hi: "सुधार विवरण", en: "Correction details" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "अभिलेख सुधार आदेश", en: "Record Correction Order" } },
  "old-age-pension": { strategy: "age-eligibility", param: 60, fields: [bankField], feeInr: 0, slaDays: 3, certTitle: { hi: "वृद्धावस्था पेंशन स्वीकृति", en: "Old-Age Pension Sanction" } },
  "widow-pension": { strategy: "document-verify", fields: [bankField], feeInr: 0, slaDays: 3, certTitle: { hi: "विधवा पेंशन स्वीकृति", en: "Widow Pension Sanction" }, documents: [{ hi: "पति का मृत्यु प्रमाण पत्र", en: "Spouse's death certificate" }] },
  "disability-pension": { strategy: "document-verify", fields: [{ name: "disabilityPct", label: { hi: "दिव्यांगता %", en: "Disability %" }, type: "number", required: true }, bankField], feeInr: 0, slaDays: 3, certTitle: { hi: "दिव्यांग पेंशन स्वीकृति", en: "Disability Pension Sanction" }, documents: [{ hi: "दिव्यांगता प्रमाण पत्र", en: "Disability certificate" }] },
  "kalyani-pension": { strategy: "document-verify", fields: [bankField], feeInr: 0, slaDays: 3, certTitle: { hi: "कल्याणी पेंशन स्वीकृति", en: "Kalyani Pension Sanction" }, documents: [{ hi: "पति का मृत्यु प्रमाण पत्र", en: "Spouse's death certificate" }] },
  "birth-registration": { strategy: "record-copy", fields: [{ name: "childName", label: { hi: "बच्चे का नाम", en: "Child's name" }, type: "text", required: true }, { name: "eventDate", label: { hi: "जन्म तिथि", en: "Date of birth" }, type: "date", required: true }, { name: "place", label: { hi: "जन्म स्थान", en: "Place of birth" }, type: "text", required: true }], feeInr: 0, slaDays: 1, certTitle: { hi: "जन्म प्रमाण पत्र", en: "Birth Certificate" } },
  "death-registration": { strategy: "record-copy", fields: [{ name: "deceasedName", label: { hi: "मृतक का नाम", en: "Deceased's name" }, type: "text", required: true }, { name: "eventDate", label: { hi: "मृत्यु तिथि", en: "Date of death" }, type: "date", required: true }], feeInr: 0, slaDays: 1, certTitle: { hi: "मृत्यु प्रमाण पत्र", en: "Death Certificate" } },
  "marriage-registration": { strategy: "document-verify", fields: [{ name: "spouseName", label: { hi: "जीवनसाथी का नाम", en: "Spouse's name" }, type: "text", required: true }, { name: "eventDate", label: { hi: "विवाह तिथि", en: "Marriage date" }, type: "date", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "विवाह प्रमाण पत्र", en: "Marriage Certificate" }, documents: [{ hi: "विवाह का प्रमाण", en: "Proof of marriage" }, { hi: "दो गवाह", en: "Two witnesses" }] },
  "character-certificate": { strategy: "document-verify", fields: [purposeField], feeInr: 0, slaDays: 3, certTitle: { hi: "चरित्र प्रमाण पत्र", en: "Character Certificate" }, documents: [{ hi: "पुलिस सत्यापन", en: "Police verification" }] },
  "migration-certificate": { strategy: "document-verify", fields: [{ name: "institution", label: { hi: "संस्थान", en: "Institution" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "माइग्रेशन प्रमाण पत्र", en: "Migration Certificate" }, documents: [{ hi: "अंतिम अंक-सूची", en: "Final marksheet" }] },
  "duplicate-marksheet": { strategy: "document-verify", fields: [{ name: "institution", label: { hi: "संस्थान", en: "Institution" }, type: "text", required: true }, { name: "rollNumber", label: { hi: "रोल नंबर", en: "Roll number" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "द्वितीय अंक-सूची", en: "Duplicate Marksheet" }, documents: [{ hi: "एफआईआर / शपथ पत्र", en: "FIR / affidavit" }] },
  "trade-license": { strategy: "document-verify", fields: [{ name: "businessName", label: { hi: "व्यवसाय का नाम", en: "Business name" }, type: "text", required: true }, { name: "businessType", label: { hi: "व्यवसाय का प्रकार", en: "Business type" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "व्यापार लाइसेंस", en: "Trade Licence" }, documents: [{ hi: "स्थल प्रमाण", en: "Premises proof" }] },
  "food-license": { strategy: "document-verify", fields: [{ name: "businessName", label: { hi: "व्यवसाय का नाम", en: "Business name" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "खाद्य लाइसेंस", en: "Food Licence" }, documents: [{ hi: "स्वास्थ्य प्रमाण", en: "Health certificate" }] },
  "learner-license": { strategy: "document-verify", fields: [{ name: "vehicleClass", label: { hi: "वाहन श्रेणी", en: "Vehicle class" }, type: "select", required: true, options: [{ value: "MCWG", label: { hi: "मोटरसाइकिल", en: "Motorcycle" } }, { value: "LMV", label: { hi: "हल्का वाहन", en: "Light vehicle" } }] }], feeInr: 200, slaDays: 3, certTitle: { hi: "लर्निंग लाइसेंस", en: "Learner Licence" }, documents: [{ hi: "आयु प्रमाण", en: "Age proof" }] },
  "vehicle-registration": { strategy: "document-verify", fields: [{ name: "vehicleType", label: { hi: "वाहन का प्रकार", en: "Vehicle type" }, type: "text", required: true }], feeInr: 0, slaDays: 3, certTitle: { hi: "वाहन पंजीकरण", en: "Vehicle Registration" }, documents: [{ hi: "बीमा", en: "Insurance" }, { hi: "इनवॉइस", en: "Invoice" }] },
};

export function configFor(slug: string): ServiceConfig {
  return SERVICE_CONFIG[slug] ?? SERVICE_CONFIG["income-certificate"];
}

export function hasApplyFlow(slug: string): boolean {
  return slug in SERVICE_CONFIG;
}
