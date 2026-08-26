// Demo persona prefills for the citizen apply flow.
//
// The mock registries key strictly off `aadhaarLike` (Lane A). To reproduce a
// specific engine outcome in the LIVE apply form, we must submit one of the
// five seeded Aadhaar-like numbers — an unknown number returns NOT_FOUND from
// every registry and always AUTO_ISSUEs. These values are the synthetic keys
// from Lane A's seed (all fail the Verhoeff checksum by design), verified
// against the seeded database. Choosing a persona on the login screen prefills
// the whole applicant so the demo lands each outcome reliably.
import type { IncomeSource, Outcome, Bilingual } from "@/lib/contracts";
import type { ApplyInput } from "./api";

export type DemoPersona = {
  key: string;
  phone: string;
  outcome: Outcome;
  label: Bilingual;
  story: Bilingual;
  applicant: ApplyInput["applicant"];
  statedAnnualIncome: number;
  incomeSource: IncomeSource;
  purpose: string;
};

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    key: "sunita",
    phone: "9800000001",
    outcome: "AUTO_ISSUE",
    label: { hi: "सुनीता वर्मा · इंदौर", en: "Sunita Verma · Indore" },
    story: { hi: "साफ़ मामला — तुरंत जारी", en: "Clean case — instant issue" },
    applicant: { fullName: "सुनीता वर्मा", phone: "9800000001", aadhaarLike: "234567890125", samagraId: "SAM-MEM-IND-0001", dateOfBirth: "1985-06-15", district: "Indore", tehsil: "Indore", addressLine: "12, Scheme 54, Vijay Nagar, Indore" },
    statedAnnualIncome: 120000,
    incomeSource: "SALARY",
    purpose: "Scholarship for daughter's engineering admission",
  },
  {
    key: "ramesh",
    phone: "9800000002",
    outcome: "FIELD_VERIFY",
    label: { hi: "रमेश कुमार · देवास", en: "Ramesh Kumar · Dewas" },
    story: { hi: "भूमि बनाम आय — पटवारी जाँच", en: "Land vs income — Patwari check" },
    applicant: { fullName: "रमेश कुमार", phone: "9800000002", aadhaarLike: "345678901239", samagraId: "SAM-MEM-DEW-0002", dateOfBirth: "1978-03-20", district: "Dewas", tehsil: "Dewas", addressLine: "Ward 7, Gram Antarsali, Dewas" },
    statedAnnualIncome: 80000,
    incomeSource: "AGRICULTURE",
    purpose: "EWS certificate for housing scheme",
  },
  {
    key: "arjun",
    phone: "9800000004",
    outcome: "NEEDS_INPUT",
    label: { hi: "अर्जुन शर्मा · भोपाल", en: "Arjun Sharma · Bhopal" },
    story: { hi: "eKYC पुराना — घड़ी रुकी", en: "eKYC stale — clock paused" },
    applicant: { fullName: "अर्जुन शर्मा", phone: "9800000004", aadhaarLike: "567890123459", samagraId: "SAM-MEM-BHO-0004", dateOfBirth: "1990-07-25", district: "Bhopal", tehsil: "Bhopal", addressLine: "H.No 45, Arera Colony, Bhopal" },
    statedAnnualIncome: 180000,
    incomeSource: "BUSINESS",
    purpose: "Income certificate for government tender eligibility",
  },
  {
    key: "ganpat",
    phone: "9800000005",
    outcome: "REJECT",
    label: { hi: "गणपत केवट · उज्जैन", en: "Ganpat Kewat · Ujjain" },
    story: { hi: "राशन बनाम आय — अस्वीकृत", en: "Ration vs income — rejected" },
    applicant: { fullName: "गणपत केवट", phone: "9800000005", aadhaarLike: "678901234561", samagraId: "SAM-MEM-UJJ-0005", dateOfBirth: "1968-04-12", district: "Ujjain", tehsil: "Ujjain", addressLine: "Freeganj Colony, Ujjain" },
    statedAnnualIncome: 420000,
    incomeSource: "BUSINESS",
    purpose: "Income certificate for municipal contractor registration",
  },
];

export const INCOME_SOURCES: { value: IncomeSource; label: Bilingual }[] = [
  { value: "AGRICULTURE", label: { hi: "कृषि", en: "Agriculture" } },
  { value: "SALARY", label: { hi: "वेतन", en: "Salary" } },
  { value: "BUSINESS", label: { hi: "व्यापार", en: "Business" } },
  { value: "DAILY_WAGE", label: { hi: "दैनिक मजदूरी", en: "Daily wage" } },
  { value: "PENSION", label: { hi: "पेंशन", en: "Pension" } },
  { value: "OTHER", label: { hi: "अन्य", en: "Other" } },
];

export function personaByPhone(phone: string): DemoPersona | undefined {
  const p = phone.replace(/\D/g, "");
  return DEMO_PERSONAS.find((d) => d.phone === p);
}
