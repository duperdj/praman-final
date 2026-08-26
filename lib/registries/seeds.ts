// lib/registries/seeds.ts  (v1.1 — aligned to contracts.ts v1.1)
// Centralised synthetic seed data for all 5 mock registries.
// Contains 5 demo personas + 40 filler applications (45 entries total).
//
// ALL DATA IS SYNTHETIC. No real Aadhaar, Samagra, or personal information.
// Aadhaar-like numbers are generated with makeSyntheticAadhaar() and deliberately
// fail the Verhoeff checksum — they cannot collide with real Aadhaar numbers.
//
// Five registries (Spec §7): Aadhaar · Samagra · Ration · Land · PriorCertificate
// (There is NO tax registry — that was v1.0 error, corrected in v1.1.)

import type { RegistrySnapshot } from "../contracts";
import { makeSyntheticAadhaar } from "./verhoeff";

// ---------- Registry entry type (all 5 slices, no fetchedAt) ----------

export type RegistryEntry = {
  aadhaar:           RegistrySnapshot["aadhaar"];
  samagra:           RegistrySnapshot["samagra"];
  land:              RegistrySnapshot["land"];
  ration:            RegistrySnapshot["ration"];
  priorCertificate:  RegistrySnapshot["priorCertificate"];
};

// ---------- Synthetic Aadhaar-like IDs (all fail Verhoeff by design) ----------

// Demo personas
export const SUNITA_AADHAAR = makeSyntheticAadhaar("23456789012"); // → AUTO_ISSUE
export const RAMESH_AADHAAR = makeSyntheticAadhaar("34567890123"); // → FIELD_VERIFY
export const KAMLA_AADHAAR  = makeSyntheticAadhaar("45678901234"); // → FIELD_VERIFY + BREACH_SLA
export const ARJUN_AADHAAR  = makeSyntheticAadhaar("56789012345"); // → NEEDS_INPUT (EKYC_STALE)
export const GANPAT_AADHAAR = makeSyntheticAadhaar("67890123456"); // → REJECT (RATION_CONTRADICTION)

// Filler — AUTO_ISSUE (1–15)
export const F01_AADHAAR = makeSyntheticAadhaar("10000000001");
export const F02_AADHAAR = makeSyntheticAadhaar("10000000002");
export const F03_AADHAAR = makeSyntheticAadhaar("10000000003");
export const F04_AADHAAR = makeSyntheticAadhaar("10000000004");
export const F05_AADHAAR = makeSyntheticAadhaar("10000000005");
export const F06_AADHAAR = makeSyntheticAadhaar("10000000006");
export const F07_AADHAAR = makeSyntheticAadhaar("10000000007");
export const F08_AADHAAR = makeSyntheticAadhaar("10000000008");
export const F09_AADHAAR = makeSyntheticAadhaar("10000000009");
export const F10_AADHAAR = makeSyntheticAadhaar("10000000010");
export const F11_AADHAAR = makeSyntheticAadhaar("10000000011");
export const F12_AADHAAR = makeSyntheticAadhaar("10000000012");
export const F13_AADHAAR = makeSyntheticAadhaar("10000000013");
export const F14_AADHAAR = makeSyntheticAadhaar("10000000014");
export const F15_AADHAAR = makeSyntheticAadhaar("10000000015");
// Filler — FIELD_VERIFY (16–27)
export const F16_AADHAAR = makeSyntheticAadhaar("10000000016");
export const F17_AADHAAR = makeSyntheticAadhaar("10000000017");
export const F18_AADHAAR = makeSyntheticAadhaar("10000000018");
export const F19_AADHAAR = makeSyntheticAadhaar("10000000019");
export const F20_AADHAAR = makeSyntheticAadhaar("10000000020");
export const F21_AADHAAR = makeSyntheticAadhaar("10000000021");
export const F22_AADHAAR = makeSyntheticAadhaar("10000000022");
export const F23_AADHAAR = makeSyntheticAadhaar("10000000023");
export const F24_AADHAAR = makeSyntheticAadhaar("10000000024");
export const F25_AADHAAR = makeSyntheticAadhaar("10000000025");
export const F26_AADHAAR = makeSyntheticAadhaar("10000000026");
export const F27_AADHAAR = makeSyntheticAadhaar("10000000027");
// Filler — NEEDS_INPUT / EKYC_STALE (28–35)
export const F28_AADHAAR = makeSyntheticAadhaar("10000000028");
export const F29_AADHAAR = makeSyntheticAadhaar("10000000029");
export const F30_AADHAAR = makeSyntheticAadhaar("10000000030");
export const F31_AADHAAR = makeSyntheticAadhaar("10000000031");
export const F32_AADHAAR = makeSyntheticAadhaar("10000000032");
export const F33_AADHAAR = makeSyntheticAadhaar("10000000033");
export const F34_AADHAAR = makeSyntheticAadhaar("10000000034");
export const F35_AADHAAR = makeSyntheticAadhaar("10000000035");
// Filler — REJECT / RATION_CONTRADICTION (36–40)
export const F36_AADHAAR = makeSyntheticAadhaar("10000000036");
export const F37_AADHAAR = makeSyntheticAadhaar("10000000037");
export const F38_AADHAAR = makeSyntheticAadhaar("10000000038");
export const F39_AADHAAR = makeSyntheticAadhaar("10000000039");
export const F40_AADHAAR = makeSyntheticAadhaar("10000000040");

// ---------- Registry entry helpers ----------

/** Clean entry: all registries match, no land, APL card, fresh eKYC, no duplicates. */
function cleanEntry(district: string, familyId: string, prevIncome: number): RegistryEntry {
  return {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId,
      residentDistrict: district,
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-09-01",   // ~11 months ago — fresh
      ekycAgeMonths: 11,
    },
    land:   { status: "MATCH", hasHoldings: false },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: false,
      lastYearDeclaredIncome: prevIncome,
      lastCertifiedAt: "2025-09-15",
    },
  };
}

/** FIELD_VERIFY entry: land holdings produce estAnnualIncome >> declared. */
function fieldVerifyEntry(
  district: string,
  familyId: string,
  holdingHectares: number,
  estAnnualIncome: number,
  prevIncome: number
): RegistryEntry {
  return {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId,
      residentDistrict: district,
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-08-01",
      ekycAgeMonths: 12,   // right at threshold — engine decides; land flag fires first
    },
    land: { status: "MATCH", hasHoldings: true, holdingHectares, estAnnualIncome },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: false,
      lastYearDeclaredIncome: prevIncome,
    },
  };
}

/**
 * NEEDS_INPUT / EKYC_STALE entry.
 * samagra.ekycStatus="MISSING" means eKYC was never completed →
 * engine fires EKYC_STALE (blocking) → outcome NEEDS_INPUT.
 */
function ekycStaleEntry(): RegistryEntry {
  return {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      ekycStatus: "MISSING",       // eKYC never completed → EKYC_STALE
    },
    land:             { status: "NOT_FOUND" },
    ration:           { status: "MATCH", cardType: "APL" },
    priorCertificate: { status: "NOT_FOUND" },
  };
}

/**
 * REJECT / RATION_CONTRADICTION entry.
 * cardType AAY or BPL + high statedAnnualIncome = hard contradiction.
 */
function rejectEntry(district: string, familyId: string, cardType: "AAY" | "BPL"): RegistryEntry {
  return {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId,
      residentDistrict: district,
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-10-01",
      ekycAgeMonths: 10,
    },
    land:   { status: "MATCH", hasHoldings: false },
    ration: { status: "MATCH", cardType },
    priorCertificate: { status: "MATCH", hasUnexpiredThisYear: false },
  };
}

// ---------- The registry seed map (keyed by aadhaarLike) ----------

export const REGISTRY_SEEDS: ReadonlyMap<string, RegistryEntry> = new Map<string, RegistryEntry>([

  // ── Demo persona 1: Sunita Verma, Indore (AUTO_ISSUE) ─────────────────────
  // All registries clean. No land, APL card, fresh eKYC, no duplicates, no PRIOR_SWING.
  [SUNITA_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-IND-001",
      residentDistrict: "Indore",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-10-15",  // ~10 months ago — fresh
      ekycAgeMonths: 10,
    },
    land:   { status: "MATCH", hasHoldings: false },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: false,
      lastYearDeclaredIncome: 115000,  // within 5% of current 120K → no PRIOR_SWING
      lastCertifiedAt: "2025-09-20",
    },
  }],

  // ── Demo persona 2: Ramesh Kumar, Dewas (FIELD_VERIFY — LAND_VS_INCOME) ───
  // 3.5 ha → est ₹2.5L/yr vs declared ₹80K. Soft flag → Patwari queue.
  [RAMESH_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-DEW-002",
      residentDistrict: "Dewas",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-11-01",
      ekycAgeMonths: 9,
    },
    land:   { status: "MATCH", hasHoldings: true, holdingHectares: 3.5, estAnnualIncome: 250000 },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: false,
      lastYearDeclaredIncome: 76000,  // ~5% below current → no PRIOR_SWING
    },
  }],

  // ── Demo persona 3: Kamla Devi, Sehore (FIELD_VERIFY + BREACH_SLA) ────────
  // 2.0 ha → est ₹1.8L/yr vs declared ₹95K → LAND_VS_INCOME → FIELD_VERIFY.
  // submittedAt is backdated to 2026-08-15 (9 working days ago) → SLA breached.
  [KAMLA_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-SEH-003",
      residentDistrict: "Sehore",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-09-01",
      ekycAgeMonths: 11,
    },
    land:   { status: "MATCH", hasHoldings: true, holdingHectares: 2.0, estAnnualIncome: 180000 },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: false,
      lastYearDeclaredIncome: 90000,
    },
  }],

  // ── Demo persona 4: Arjun Sharma, Bhopal (NEEDS_INPUT — EKYC_STALE) ───────
  // samagra.ekycUpdatedAt=2024-06-15 → ekycAgeMonths=26 > 12 → EKYC_STALE → NEEDS_INPUT.
  // SLA clock pauses (SlaState.paused=true) until citizen refreshes eKYC.
  [ARJUN_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-BHO-004",
      residentDistrict: "Bhopal",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2024-06-15",  // 26 months ago — stale (>12)
      ekycAgeMonths: 26,
    },
    land:             { status: "NOT_FOUND" },
    ration:           { status: "MATCH", cardType: "APL" },
    priorCertificate: { status: "NOT_FOUND" },
  }],

  // ── Demo persona 5: Ganpat Kewat, Ujjain (REJECT — RATION_CONTRADICTION) ──
  // AAY ration card (Antyodaya — poorest-of-poor) + declared ₹4.2L.
  // Hard contradiction → RATION_CONTRADICTION → REJECT.
  [GANPAT_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-UJJ-005",
      residentDistrict: "Ujjain",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-11-15",
      ekycAgeMonths: 9,
    },
    land:   { status: "MATCH", hasHoldings: false },
    ration: { status: "MATCH", cardType: "AAY" },
    priorCertificate: { status: "MATCH", hasUnexpiredThisYear: false },
  }],

  // ── Filler: AUTO_ISSUE (F01–F12, F14–F15) ───────────────────────────────
  [F01_AADHAAR, cleanEntry("Jabalpur",    "SAM-FAM-JAB-F01", 86000)],
  [F02_AADHAAR, cleanEntry("Gwalior",     "SAM-FAM-GWL-F02", 71000)],
  [F03_AADHAAR, cleanEntry("Rewa",        "SAM-FAM-REW-F03", 105000)],
  [F04_AADHAAR, cleanEntry("Satna",       "SAM-FAM-SAT-F04", 81000)],
  [F05_AADHAAR, cleanEntry("Sagar",       "SAM-FAM-SAG-F05", 96000)],
  [F06_AADHAAR, cleanEntry("Hoshangabad", "SAM-FAM-HOS-F06", 91000)],
  [F07_AADHAAR, cleanEntry("Narsinghpur", "SAM-FAM-NAR-F07", 125000)],
  [F08_AADHAAR, cleanEntry("Raisen",      "SAM-FAM-RAI-F08", 84000)],
  [F09_AADHAAR, cleanEntry("Vidisha",     "SAM-FAM-VID-F09", 88000)],
  [F10_AADHAAR, cleanEntry("Mandla",      "SAM-FAM-MAN-F10", 74000)],
  [F11_AADHAAR, cleanEntry("Balaghat",    "SAM-FAM-BAL-F11", 100000)],
  [F12_AADHAAR, cleanEntry("Chhindwara",  "SAM-FAM-CHH-F12", 78000)],

  // ── Filler F13: PRIOR_SWING → FIELD_VERIFY ───────────────────────────────
  // statedAnnualIncome=115000 vs lastYearDeclaredIncome=55000 = 109% swing (>40%)
  // PRIOR_SWING soft signal fires → score 20-60 → FIELD_VERIFY
  [F13_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-KHA-F13",
      residentDistrict: "Khandwa",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-09-01",
      ekycAgeMonths: 11,
    },
    land:   { status: "MATCH", hasHoldings: false },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: false,
      lastYearDeclaredIncome: 55000,   // 109% below current → PRIOR_SWING soft flag
      lastCertifiedAt: "2025-09-15",
    },
  }],

  [F14_AADHAAR, cleanEntry("Khargone",    "SAM-FAM-KHG-F14", 69000)],
  [F15_AADHAAR, cleanEntry("Dhar",        "SAM-FAM-DHA-F15", 94000)],

  // ── Filler: FIELD_VERIFY — land income vs declared (F16–F27) ─────────────
  [F16_AADHAAR, fieldVerifyEntry("Rajgarh",    "SAM-FAM-RAJ-F16", 1.8, 150000, 67000)],
  [F17_AADHAAR, fieldVerifyEntry("Betul",      "SAM-FAM-BET-F17", 2.5, 200000, 62000)],
  [F18_AADHAAR, fieldVerifyEntry("Morena",     "SAM-FAM-MOR-F18", 2.2, 175000, 53000)],
  [F19_AADHAAR, fieldVerifyEntry("Sheopur",    "SAM-FAM-SHE-F19", 3.0, 220000, 46000)],
  [F20_AADHAAR, fieldVerifyEntry("Shivpuri",   "SAM-FAM-SHV-F20", 2.4, 190000, 58000)],
  [F21_AADHAAR, fieldVerifyEntry("Damoh",      "SAM-FAM-DAM-F21", 2.0, 160000, 69000)],
  [F22_AADHAAR, fieldVerifyEntry("Panna",      "SAM-FAM-PAN-F22", 2.8, 210000, 48000)],
  [F23_AADHAAR, fieldVerifyEntry("Tikamgarh",  "SAM-FAM-TIK-F23", 2.3, 180000, 65000)],
  [F24_AADHAAR, fieldVerifyEntry("Chhatarpur", "SAM-FAM-CHT-F24", 2.5, 195000, 43000)],
  [F25_AADHAAR, fieldVerifyEntry("Katni",      "SAM-FAM-KAT-F25", 2.1, 165000, 55000)],
  [F26_AADHAAR, fieldVerifyEntry("Umaria",     "SAM-FAM-UMA-F26", 1.9, 145000, 77000)],
  [F27_AADHAAR, fieldVerifyEntry("Anuppur",    "SAM-FAM-ANU-F27", 2.4, 185000, 59000)],

  // ── Filler: NEEDS_INPUT — eKYC never completed (F28–F34) ────────────────
  [F28_AADHAAR, ekycStaleEntry()],
  [F29_AADHAAR, ekycStaleEntry()],
  [F30_AADHAAR, ekycStaleEntry()],
  [F31_AADHAAR, ekycStaleEntry()],
  [F32_AADHAAR, ekycStaleEntry()],
  [F33_AADHAAR, ekycStaleEntry()],
  [F34_AADHAAR, ekycStaleEntry()],

  // ── Filler F35: DUPLICATE_ACTIVE → NEEDS_INPUT ───────────────────────────
  // hasUnexpiredThisYear=true: a valid certificate already exists for this family
  // this year → DUPLICATE_ACTIVE blocking signal → NEEDS_INPUT
  [F35_AADHAAR, {
    aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
    samagra: {
      status: "MATCH",
      familyId: "SAM-FAM-AGA-F35",
      residentDistrict: "Agar Malwa",
      ekycStatus: "PRESENT",
      ekycUpdatedAt: "2025-11-01",
      ekycAgeMonths: 9,
    },
    land:   { status: "MATCH", hasHoldings: false },
    ration: { status: "MATCH", cardType: "APL" },
    priorCertificate: {
      status: "MATCH",
      hasUnexpiredThisYear: true,       // unexpired cert exists → DUPLICATE_ACTIVE blocking
      lastCertifiedAt: "2026-04-01",   // issued ~5 months ago, still valid (1-year validity)
    },
  }],

  // ── Filler: REJECT — ration card vs income contradiction (F36–F40) ────────
  [F36_AADHAAR, rejectEntry("Niwari",     "SAM-FAM-NIW-F36", "AAY")],
  [F37_AADHAAR, rejectEntry("Ashoknagar", "SAM-FAM-ASH-F37", "BPL")],
  [F38_AADHAAR, rejectEntry("Alirajpur",  "SAM-FAM-ALI-F38", "AAY")],
  [F39_AADHAAR, rejectEntry("Barwani",    "SAM-FAM-BAR-F39", "BPL")],
  [F40_AADHAAR, rejectEntry("Jhabua",     "SAM-FAM-JHA-F40", "AAY")],
]);
