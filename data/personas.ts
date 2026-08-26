// data/personas.ts  (v1.1 — aligned to contracts.ts v1.1)
// Typed Application fixtures for demo + filler scenarios.
//
// ALL DATA IS SYNTHETIC — no real citizens, Aadhaar numbers, or Samagra IDs.
// Aadhaar-like numbers are generated via makeSyntheticAadhaar() and deliberately
// fail the Verhoeff checksum. A runtime guard at the bottom asserts this for all
// 45 fixtures before any test or seeding code can run.
//
// Each fixture carries intendedOutcome so engine tests can verify the right path.

import type { Application, Outcome } from "../lib/contracts";
import { failsVerhoeff } from "../lib/registries/verhoeff";
import {
  SUNITA_AADHAAR, RAMESH_AADHAAR, KAMLA_AADHAAR, ARJUN_AADHAAR, GANPAT_AADHAAR,
  F01_AADHAAR, F02_AADHAAR, F03_AADHAAR, F04_AADHAAR, F05_AADHAAR,
  F06_AADHAAR, F07_AADHAAR, F08_AADHAAR, F09_AADHAAR, F10_AADHAAR,
  F11_AADHAAR, F12_AADHAAR, F13_AADHAAR, F14_AADHAAR, F15_AADHAAR,
  F16_AADHAAR, F17_AADHAAR, F18_AADHAAR, F19_AADHAAR, F20_AADHAAR,
  F21_AADHAAR, F22_AADHAAR, F23_AADHAAR, F24_AADHAAR, F25_AADHAAR,
  F26_AADHAAR, F27_AADHAAR, F28_AADHAAR, F29_AADHAAR, F30_AADHAAR,
  F31_AADHAAR, F32_AADHAAR, F33_AADHAAR, F34_AADHAAR, F35_AADHAAR,
  F36_AADHAAR, F37_AADHAAR, F38_AADHAAR, F39_AADHAAR, F40_AADHAAR,
} from "../lib/registries/seeds";

// ---------- Fixture type ----------

/** An Application paired with its expected engine outcome for demo/test use. */
export interface ApplicationFixture {
  application: Application;
  /** Expected engine outcome. BREACH_SLA means FIELD_VERIFY + backdated submittedAt. */
  intendedOutcome: Outcome | "BREACH_SLA";
  note?: string;
}

// ---------- Demo personas (5) ----------

/**
 * Persona 1 — Sunita Verma, Indore (urban)
 * Clean case: all five registries match, no land, APL card, fresh eKYC, no duplicates.
 * Expected: AUTO_ISSUE
 */
const PERSONA_SUNITA: ApplicationFixture = {
  intendedOutcome: "AUTO_ISSUE",
  note: "All registries clean. No anomalies. Auto-issued in ~8 seconds.",
  application: {
    id: "APP-DEMO-001",
    applicant: {
      fullName:    "Sunita Verma",
      phone:       "9800000001",
      aadhaarLike: SUNITA_AADHAAR,
      samagraId:   "SAM-MEM-IND-0001",
      dateOfBirth: "1985-06-15",
      district:    "Indore",
      tehsil:      "Indore",
      addressLine: "12, Scheme 54, Vijay Nagar, Indore",
    },
    statedAnnualIncome: 120000,
    incomeSource:       "SALARY",
    purpose:            "Scholarship for daughter's engineering admission",
    submittedAt:        "2026-08-24T08:00:00.000Z",
    lang:               "hi",
  },
};

/**
 * Persona 2 — Ramesh Kumar, Dewas (rural)
 * 3.5 ha land holding → est ₹2.5L/yr vs declared ₹80K.
 * LAND_VS_INCOME soft flag → routed to Patwari with stated reason.
 * Expected: FIELD_VERIFY
 */
const PERSONA_RAMESH: ApplicationFixture = {
  intendedOutcome: "FIELD_VERIFY",
  note: "land.holdingHectares=3.5 → estAnnualIncome=₹2.5L vs statedIncome=₹80K → LAND_VS_INCOME → Patwari queue.",
  application: {
    id: "APP-DEMO-002",
    applicant: {
      fullName:    "Ramesh Kumar",
      phone:       "9800000002",
      aadhaarLike: RAMESH_AADHAAR,
      samagraId:   "SAM-MEM-DEW-0002",
      dateOfBirth: "1978-03-20",
      district:    "Dewas",
      tehsil:      "Dewas",
      addressLine: "Ward 7, Gram Antarsali, Dewas",
    },
    statedAnnualIncome: 80000,
    incomeSource:       "AGRICULTURE",
    purpose:            "EWS certificate for housing scheme",
    submittedAt:        "2026-08-22T10:30:00.000Z",
    lang:               "hi",
  },
};

/**
 * Persona 3 — Kamla Devi, Sehore
 * 2.0 ha land holding → est ₹1.8L vs declared ₹95K → LAND_VS_INCOME → FIELD_VERIFY.
 * Application backdated to 2026-08-15 (9 days ago); SLA clock (3 working days) breached.
 * Officer appeal auto-drafted; penalty accruing at ₹250/day.
 * Expected: BREACH_SLA (engine: FIELD_VERIFY, clock expired)
 */
const PERSONA_KAMLA: ApplicationFixture = {
  intendedOutcome: "BREACH_SLA",
  note: "FIELD_VERIFY + submittedAt=2026-08-15 (9 days ago). SLA breached → auto-drafted appeal + ₹250/day penalty.",
  application: {
    id: "APP-DEMO-003",
    applicant: {
      fullName:    "Kamla Devi",
      phone:       "9800000003",
      aadhaarLike: KAMLA_AADHAAR,
      samagraId:   "SAM-MEM-SEH-0003",
      dateOfBirth: "1972-11-08",
      district:    "Sehore",
      tehsil:      "Sehore",
      addressLine: "Gram Banjari, Tehsil Sehore, Sehore",
    },
    statedAnnualIncome: 95000,
    incomeSource:       "AGRICULTURE",
    purpose:            "Income certificate for ration card upgrade",
    submittedAt:        "2026-08-15T09:00:00.000Z", // backdated — SLA will be breached
    lang:               "hi",
  },
};

/**
 * Persona 4 — Arjun Sharma, Bhopal
 * samagra.ekycUpdatedAt=2024-06-15 → ekycAgeMonths=26 > 12 → EKYC_STALE blocking signal.
 * State → AWAITING_CITIZEN. SLA clock pauses (SlaState.paused=true).
 * Citizen renews eKYC on Samagra portal, resubmits → auto-issues.
 * Expected: NEEDS_INPUT
 */
const PERSONA_ARJUN: ApplicationFixture = {
  intendedOutcome: "NEEDS_INPUT",
  note: "samagra.ekycAgeMonths=26 > 12 → EKYC_STALE blocking → NEEDS_INPUT. SLA paused until resubmission.",
  application: {
    id: "APP-DEMO-004",
    applicant: {
      fullName:    "Arjun Sharma",
      phone:       "9800000004",
      aadhaarLike: ARJUN_AADHAAR,
      samagraId:   "SAM-MEM-BHO-0004",
      dateOfBirth: "1990-07-25",
      district:    "Bhopal",
      tehsil:      "Bhopal",
      addressLine: "H.No 45, Arera Colony, Bhopal",
    },
    statedAnnualIncome: 180000,
    incomeSource:       "BUSINESS",
    purpose:            "Income certificate for government tender eligibility",
    submittedAt:        "2026-08-23T14:00:00.000Z",
    lang:               "en",
  },
};

/**
 * Persona 5 — Ganpat Kewat, Ujjain
 * ration.cardType=AAY (Antyodaya — poorest-of-poor) + declared ₹4.2L.
 * Hard contradiction → RATION_CONTRADICTION → REJECT with explanation.
 * Citizen can correct declaration or appeal.
 * Expected: REJECT
 */
const PERSONA_GANPAT: ApplicationFixture = {
  intendedOutcome: "REJECT",
  note: "ration.cardType=AAY + statedIncome=₹4.2L → RATION_CONTRADICTION hard signal → REJECT.",
  application: {
    id: "APP-DEMO-005",
    applicant: {
      fullName:    "Ganpat Kewat",
      phone:       "9800000005",
      aadhaarLike: GANPAT_AADHAAR,
      samagraId:   "SAM-MEM-UJJ-0005",
      dateOfBirth: "1968-04-12",
      district:    "Ujjain",
      tehsil:      "Ujjain",
      addressLine: "Freeganj Colony, Ujjain",
    },
    statedAnnualIncome: 420000,
    incomeSource:       "BUSINESS",
    purpose:            "Income certificate for municipal contractor registration",
    submittedAt:        "2026-08-24T11:00:00.000Z",
    lang:               "hi",
  },
};

export const demoPersonas: ApplicationFixture[] = [
  PERSONA_SUNITA,
  PERSONA_RAMESH,
  PERSONA_KAMLA,
  PERSONA_ARJUN,
  PERSONA_GANPAT,
];

// ---------- Filler applications (40) ----------
// Spread across tehsils to give the accountability dashboard realistic shape.
// Counts: 15 AUTO_ISSUE · 12 FIELD_VERIFY · 8 NEEDS_INPUT · 5 REJECT

type FillerRow = [
  id: string,
  aadhaarLike: string,
  fullName: string,
  phone: string,
  dob: string,
  district: string,
  tehsil: string,
  address: string,
  samagraId: string,
  income: number,
  source: Application["incomeSource"],
  purpose: string,
  submittedAt: string,
  outcome: ApplicationFixture["intendedOutcome"],
  note?: string,
];

const FILLER_ROWS: FillerRow[] = [
  // ── AUTO_ISSUE (F01–F15) ─────────────────────────────────────────────────
  ["APP-FILL-001", F01_AADHAAR, "Priya Gupta",     "9810000001", "1990-02-14", "Jabalpur",    "Panagar",        "Gram Panagar Ward 3, Jabalpur",       "SAM-MEM-JAB-F01",  90000, "SALARY",     "Scholarship",                      "2026-08-18T09:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-002", F02_AADHAAR, "Suresh Singh",    "9810000002", "1983-07-30", "Gwalior",     "Morar",          "LIC Colony, Morar, Gwalior",          "SAM-MEM-GWL-F02",  75000, "SALARY",     "EWS housing scheme",               "2026-08-19T10:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-003", F03_AADHAAR, "Raju Patel",      "9810000003", "1975-11-05", "Rewa",        "Mauganj",        "Village Mauganj, Rewa",               "SAM-MEM-REW-F03", 110000, "AGRICULTURE","Scholarship for son",              "2026-08-20T11:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-004", F04_AADHAAR, "Savita Sharma",   "9810000004", "1992-04-18", "Satna",       "Nagod",          "Nagod Town Ward 5, Satna",            "SAM-MEM-SAT-F04",  85000, "DAILY_WAGE", "Fee waiver for nursing college",   "2026-08-21T08:30:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-005", F05_AADHAAR, "Mohan Verma",     "9810000005", "1980-09-22", "Sagar",       "Banda",          "Gram Banda, Tehsil Banda, Sagar",     "SAM-MEM-SAG-F05", 100000, "AGRICULTURE","Bank loan application",            "2026-08-22T09:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-006", F06_AADHAAR, "Geeta Yadav",     "9810000006", "1987-03-11", "Hoshangabad", "Sohagpur",       "Sohagpur Town, Hoshangabad",          "SAM-MEM-HOS-F06",  95000, "SALARY",     "Scholarship for daughter",         "2026-08-20T14:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-007", F07_AADHAAR, "Rajesh Kumar",    "9810000007", "1976-06-25", "Narsinghpur", "Gadarwara",      "Ward 2, Gadarwara, Narsinghpur",      "SAM-MEM-NAR-F07", 130000, "BUSINESS",   "EWS certificate for admission",    "2026-08-23T08:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-008", F08_AADHAAR, "Anita Mishra",    "9810000008", "1993-01-08", "Raisen",      "Bareli",         "Bareli Town Ward 1, Raisen",          "SAM-MEM-RAI-F08",  88000, "SALARY",     "Fee concession application",       "2026-08-19T09:30:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-009", F09_AADHAAR, "Dinesh Joshi",    "9810000009", "1985-08-14", "Vidisha",     "Ganj Basoda",    "Ganj Basoda, Vidisha",                "SAM-MEM-VID-F09",  92000, "SALARY",     "Bank loan",                        "2026-08-21T10:30:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-010", F10_AADHAAR, "Lata Tiwari",     "9810000010", "1970-12-30", "Mandla",      "Bichhia",        "Village Bichhia, Mandla",             "SAM-MEM-MAN-F10",  78000, "AGRICULTURE","Scholarship application",          "2026-08-22T11:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-011", F11_AADHAAR, "Vinod Sahu",      "9810000011", "1988-05-17", "Balaghat",    "Waraseoni",      "Waraseoni Town, Balaghat",            "SAM-MEM-BAL-F11", 105000, "BUSINESS",   "EWS housing",                      "2026-08-23T09:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-012", F12_AADHAAR, "Rekha Pandey",    "9810000012", "1995-10-03", "Chhindwara",  "Sausar",         "Ward 4, Sausar, Chhindwara",          "SAM-MEM-CHH-F12",  82000, "SALARY",     "College fee waiver",               "2026-08-20T15:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-013", F13_AADHAAR, "Santosh Dubey",   "9810000013", "1979-02-28", "Khandwa",     "Pandhana",       "Village Pandhana, Khandwa",           "SAM-MEM-KHA-F13", 115000, "AGRICULTURE","Bank loan for tractor",            "2026-08-24T07:30:00.000Z", "FIELD_VERIFY", "PRIOR_SWING: ₹115K vs last-year ₹55K = 109% swing (>40%)"],
  ["APP-FILL-014", F14_AADHAAR, "Pushpa Pal",      "9810000014", "1982-07-07", "Khargone",    "Bhikangaon",     "Bhikangaon, Khargone",                "SAM-MEM-KHG-F14",  72000, "DAILY_WAGE", "OBC scholarship",                  "2026-08-21T12:00:00.000Z", "AUTO_ISSUE"],
  ["APP-FILL-015", F15_AADHAAR, "Manoj Shukla",    "9810000015", "1984-09-19", "Dhar",        "Badnawar",       "Badnawar Town Ward 6, Dhar",          "SAM-MEM-DHA-F15",  98000, "SALARY",     "Scholarship",                      "2026-08-22T08:00:00.000Z", "AUTO_ISSUE"],

  // ── FIELD_VERIFY — land vs income (F16–F27) ───────────────────────────────
  ["APP-FILL-016", F16_AADHAAR, "Sheela Chauhan",  "9810000016", "1974-03-05", "Rajgarh",    "Narsinghgarh",   "Village Narsinghgarh, Rajgarh",       "SAM-MEM-RAJ-F16",  70000, "AGRICULTURE","Scholarship for son",              "2026-08-18T10:00:00.000Z", "FIELD_VERIFY", "1.8 ha → ₹1.5L est vs ₹70K declared"],
  ["APP-FILL-017", F17_AADHAAR, "Bharat Rajput",   "9810000017", "1969-11-11", "Betul",      "Multai",         "Gram Multai, Betul",                  "SAM-MEM-BET-F17",  65000, "AGRICULTURE","EWS housing scheme",               "2026-08-19T09:00:00.000Z", "FIELD_VERIFY", "2.5 ha → ₹2L est vs ₹65K declared"],
  ["APP-FILL-018", F18_AADHAAR, "Rupa Malviya",    "9810000018", "1977-08-24", "Morena",     "Ambah",          "Ambah Town, Morena",                  "SAM-MEM-MOR-F18",  55000, "AGRICULTURE","Bank loan",                        "2026-08-20T11:00:00.000Z", "FIELD_VERIFY", "2.2 ha → ₹1.75L est vs ₹55K declared"],
  ["APP-FILL-019", F19_AADHAAR, "Naresh Rathore",  "9810000019", "1971-04-16", "Sheopur",    "Vijaypur",       "Village Vijaypur, Sheopur",           "SAM-MEM-SHE-F19",  48000, "AGRICULTURE","Fee waiver",                       "2026-08-21T09:00:00.000Z", "FIELD_VERIFY", "3.0 ha → ₹2.2L est vs ₹48K declared"],
  ["APP-FILL-020", F20_AADHAAR, "Hemlata Saxena",  "9810000020", "1986-01-29", "Shivpuri",   "Pichhore",       "Village Pichhore, Shivpuri",          "SAM-MEM-SHV-F20",  60000, "AGRICULTURE","Scholarship",                      "2026-08-22T10:00:00.000Z", "FIELD_VERIFY", "2.4 ha → ₹1.9L est vs ₹60K declared"],
  ["APP-FILL-021", F21_AADHAAR, "Satish Dwivedi",  "9810000021", "1973-06-08", "Damoh",      "Jabera",         "Gram Jabera, Damoh",                  "SAM-MEM-DAM-F21",  72000, "AGRICULTURE","EWS certificate",                  "2026-08-23T11:00:00.000Z", "FIELD_VERIFY", "2.0 ha → ₹1.6L est vs ₹72K declared"],
  ["APP-FILL-022", F22_AADHAAR, "Usha Agarwal",    "9810000022", "1981-09-13", "Panna",      "Pawai",          "Village Pawai, Panna",                "SAM-MEM-PAN-F22",  50000, "AGRICULTURE","Scholarship for daughter",         "2026-08-18T13:00:00.000Z", "FIELD_VERIFY", "2.8 ha → ₹2.1L est vs ₹50K declared"],
  ["APP-FILL-023", F23_AADHAAR, "Pramod Nayak",    "9810000023", "1967-12-02", "Tikamgarh",  "Palera",         "Palera Town, Tikamgarh",              "SAM-MEM-TIK-F23",  68000, "AGRICULTURE","Bank loan for pump-set",           "2026-08-19T14:00:00.000Z", "FIELD_VERIFY", "2.3 ha → ₹1.8L est vs ₹68K declared"],
  ["APP-FILL-024", F24_AADHAAR, "Champa Devi",     "9810000024", "1965-05-20", "Chhatarpur", "Maharajpur",     "Maharajpur, Chhatarpur",              "SAM-MEM-CHT-F24",  45000, "AGRICULTURE","Fee waiver for grandson",          "2026-08-20T10:00:00.000Z", "FIELD_VERIFY", "2.5 ha → ₹1.95L est vs ₹45K declared"],
  ["APP-FILL-025", F25_AADHAAR, "Ashok Kumar",     "9810000025", "1970-07-03", "Katni",      "Bahoriband",     "Bahoriband Town, Katni",              "SAM-MEM-KAT-F25",  58000, "AGRICULTURE","Scholarship for daughter",         "2026-08-21T09:30:00.000Z", "FIELD_VERIFY", "2.1 ha → ₹1.65L est vs ₹58K declared"],
  ["APP-FILL-026", F26_AADHAAR, "Radha Bai",       "9810000026", "1963-03-28", "Umaria",     "Manpur",         "Village Manpur, Umaria",              "SAM-MEM-UMA-F26",  80000, "AGRICULTURE","Bank loan",                        "2026-08-22T08:30:00.000Z", "FIELD_VERIFY", "1.9 ha → ₹1.45L est vs ₹80K declared"],
  ["APP-FILL-027", F27_AADHAAR, "Deepak Singh",    "9810000027", "1989-10-10", "Anuppur",    "Jaithari",       "Jaithari Town, Anuppur",              "SAM-MEM-ANU-F27",  62000, "AGRICULTURE","EWS housing",                      "2026-08-23T10:30:00.000Z", "FIELD_VERIFY", "2.4 ha → ₹1.85L est vs ₹62K declared"],

  // ── NEEDS_INPUT — eKYC never completed (F28–F35) ─────────────────────────
  ["APP-FILL-028", F28_AADHAAR, "Saroj Sharma",    "9810000028", "1991-08-06", "Singrauli",  "Chitrangi",      "Ward 3, Singrauli",                   "SAM-MEM-SIN-F28", 140000, "SALARY",     "Scholarship for children",         "2026-08-20T09:00:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-029", F29_AADHAAR, "Kishan Yadav",    "9810000029", "1982-04-21", "Sidhi",      "Rampur Naikin",  "Gram Rampur Naikin, Sidhi",           "SAM-MEM-SID-F29",  95000, "AGRICULTURE","Bank loan",                        "2026-08-21T10:00:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-030", F30_AADHAAR, "Kavita Gupta",    "9810000030", "1988-11-15", "Shahdol",    "Beohari",        "Beohari Town, Shahdol",               "SAM-MEM-SHA-F30", 105000, "BUSINESS",   "EWS certificate",                  "2026-08-22T11:00:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-031", F31_AADHAAR, "Ramakant Verma",  "9810000031", "1976-01-17", "Dindori",    "Shahpura",       "Village Shahpura, Dindori",           "SAM-MEM-DIN-F31",  88000, "AGRICULTURE","Scholarship",                      "2026-08-23T09:00:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-032", F32_AADHAAR, "Mangala Devi",    "9810000032", "1964-06-30", "Seoni",      "Keolari",        "Gram Keolari, Seoni",                 "SAM-MEM-SEO-F32",  92000, "AGRICULTURE","Bank loan for well",               "2026-08-24T08:00:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-033", F33_AADHAAR, "Dheeraj Tiwari",  "9810000033", "1994-03-09", "Harda",      "Timarni",        "Timarni Town, Harda",                 "SAM-MEM-HAR-F33",  78000, "SALARY",     "Fee waiver",                       "2026-08-19T15:00:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-034", F34_AADHAAR, "Lalita Jain",     "9810000034", "1980-09-25", "Burhanpur",  "Nepanagar",      "Nepanagar, Burhanpur",                "SAM-MEM-BUR-F34",  85000, "BUSINESS",   "Scholarship for son",              "2026-08-20T10:30:00.000Z", "NEEDS_INPUT", "samagra.ekycStatus=MISSING"],
  ["APP-FILL-035", F35_AADHAAR, "Ramesh Soni",     "9810000035", "1972-12-19", "Agar Malwa", "Susner",         "Susner Town, Agar Malwa",             "SAM-MEM-AGA-F35", 110000, "BUSINESS",   "EWS certificate",                  "2026-08-21T11:30:00.000Z", "NEEDS_INPUT", "DUPLICATE_ACTIVE: hasUnexpiredThisYear=true (cert issued 2026-04-01, still valid)"],

  // ── REJECT — ration card vs income contradiction (F36–F40) ───────────────
  ["APP-FILL-036", F36_AADHAAR, "Parvati Devi",    "9810000036", "1966-07-14", "Niwari",     "Prithvipur",     "Prithvipur Town, Niwari",             "SAM-MEM-NIW-F36", 350000, "BUSINESS",   "Municipal contractor registration","2026-08-23T09:00:00.000Z", "REJECT", "AAY + ₹3.5L"],
  ["APP-FILL-037", F37_AADHAAR, "Ramjilal Kori",   "9810000037", "1968-02-03", "Ashoknagar", "Mungaoli",       "Mungaoli Town, Ashoknagar",           "SAM-MEM-ASH-F37", 420000, "BUSINESS",   "EWS certificate for land purchase","2026-08-22T14:00:00.000Z", "REJECT", "BPL + ₹4.2L"],
  ["APP-FILL-038", F38_AADHAAR, "Sharda Bai",      "9810000038", "1963-10-10", "Alirajpur",  "Jobat",          "Village Jobat, Alirajpur",            "SAM-MEM-ALI-F38", 380000, "BUSINESS",   "Income certificate for court case","2026-08-24T07:00:00.000Z", "REJECT", "AAY + ₹3.8L"],
  ["APP-FILL-039", F39_AADHAAR, "Ganesh Barela",   "9810000039", "1975-05-27", "Barwani",    "Sendhwa",        "Sendhwa Town, Barwani",               "SAM-MEM-BAR-F39", 450000, "BUSINESS",   "Scholarship for nephew",           "2026-08-21T13:00:00.000Z", "REJECT", "BPL + ₹4.5L"],
  ["APP-FILL-040", F40_AADHAAR, "Sunilbai Bhilala","9810000040", "1960-08-18", "Jhabua",     "Thandla",        "Thandla Town, Jhabua",                "SAM-MEM-JHA-F40", 400000, "DAILY_WAGE", "OBC income certificate",           "2026-08-20T09:30:00.000Z", "REJECT", "AAY + ₹4L"],
];

export const fillerApplications: ApplicationFixture[] = FILLER_ROWS.map(
  ([id, aadhaarLike, fullName, phone, dob, district, tehsil, address, samagraId,
    income, source, purpose, submittedAt, outcome, note]) => ({
    intendedOutcome: outcome,
    note,
    application: {
      id,
      applicant: {
        fullName,
        phone,
        aadhaarLike,
        samagraId,
        dateOfBirth: dob,
        district,
        tehsil,
        addressLine: address,
      },
      statedAnnualIncome: income,
      incomeSource:       source,
      purpose,
      submittedAt,
      lang: "hi",
    } satisfies Application,
  })
);

/** All 45 fixtures: 5 demo personas + 40 filler applications. */
export const allApplications: ApplicationFixture[] = [
  ...demoPersonas,
  ...fillerApplications,
];

// ---------- Runtime guard: every aadhaarLike must fail Verhoeff ----------
// Asserted at module load so any accidental valid Aadhaar throws immediately
// before tests, seeding, or any downstream consumer runs.

for (const { application } of allApplications) {
  const n = application.applicant.aadhaarLike;
  if (!failsVerhoeff(n)) {
    throw new Error(
      `[personas.ts] Synthetic aadhaarLike "${n}" in ${application.id} ` +
      `accidentally passes the Verhoeff checksum — use a different prefix.`
    );
  }
}
