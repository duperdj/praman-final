// ============================================================================
// lib/contracts.ts — FROZEN v1.1. The single shared contract between all lanes.
// Owned by god (Michael). Do NOT change a field without god's sign-off:
// propose the change, we update this file once, everyone rebuilds to it.
// Lane A (engine/sla/registries/api) PRODUCES these shapes.
// Lane B (Soham's UI) CONSUMES Decision + SlaState.
//
// CHANGELOG
//  v1.1 (2026-08-24): Aligned RegistrySnapshot to Spec §7's five registries.
//    - REPLACED `tax` (not in spec) with `priorCertificate` (PriorCertificateRegistry).
//    - samagra: added eKYC freshness (ekycStatus, ekycUpdatedAt, ekycAgeMonths) → EKYC_STALE.
//    - land: added holdingHectares → LAND_VS_INCOME (spec measures land in hectares).
//    - Signal: added optional weightedScore (spec: rules carry a weighted score).
//    - SlaState: added optional `paused` (NEEDS_INPUT pauses the clock; Arjun persona).
//    All changes are additive/aligning; Lane B consumers (Decision, SlaState) unaffected
//    except the new optional SlaState.paused.
//  v1   (2026-08-24): initial freeze.
// ============================================================================

export type Lang = "hi" | "en";
export type Bilingual = { hi: string; en: string };

// ---- Application: what the citizen submits ----
export type IncomeSource =
  | "SALARY"
  | "AGRICULTURE"
  | "BUSINESS"
  | "DAILY_WAGE"
  | "PENSION"
  | "OTHER";

export interface Applicant {
  fullName: string;
  phone: string; // 10-digit, OTP-verified
  aadhaarLike: string; // 12-digit, deliberately fails Verhoeff checksum (synthetic)
  samagraId: string; // MP family/member id (synthetic)
  dateOfBirth: string; // ISO date
  district: string;
  tehsil: string;
  addressLine: string;
}

export interface Application {
  id: string;
  applicant: Applicant;
  statedAnnualIncome: number; // INR
  incomeSource: IncomeSource;
  purpose: string; // why the certificate is needed (drives THRESHOLD_HUGGING cutoff)
  submittedAt: string; // ISO datetime
  lang: Lang; // language they applied in
}

// ---- RegistrySnapshot: what the 5 mock registries return for this applicant ----
// The five registries (Spec §7): Aadhaar, Samagra, Ration, Land, PriorCertificate.
export type MatchStatus = "MATCH" | "MISMATCH" | "NOT_FOUND" | "UNAVAILABLE";

export interface RegistrySnapshot {
  // AadhaarRegistry — name/DOB for mismatch checks (IDENTITY_MISMATCH), OTP issuance
  aadhaar: { status: MatchStatus; nameMatch?: boolean; ageMatch?: boolean };
  // SamagraRegistry — family composition, eKYC status/freshness (EKYC_STALE), name/DOB
  samagra: {
    status: MatchStatus;
    familyId?: string;
    residentDistrict?: string;
    ekycStatus?: "PRESENT" | "MISSING";
    ekycUpdatedAt?: string; // ISO date of last eKYC; absent = never
    ekycAgeMonths?: number; // convenience: months since eKYC (>12 => stale)
  };
  // LandRegistry — total holding in hectares (LAND_VS_INCOME, SOURCE_INCOMPLETE)
  land: {
    status: MatchStatus;
    hasHoldings?: boolean;
    holdingHectares?: number;
    estAnnualIncome?: number;
  };
  // RationRegistry — family card category (RATION_CONTRADICTION)
  ration: { status: MatchStatus; cardType?: "APL" | "BPL" | "AAY" | null };
  // PriorCertificateRegistry — previous income certificates for this family
  priorCertificate: {
    status: MatchStatus;
    lastYearDeclaredIncome?: number; // for PRIOR_SWING (>40% delta)
    hasUnexpiredThisYear?: boolean; // for DUPLICATE_ACTIVE
    lastCertifiedAt?: string; // ISO date of most recent certificate
  };
  fetchedAt: string; // ISO datetime
}

// ---- Signal: one rule's finding ----
export type Severity = "OK" | "INFO" | "WARN" | "BLOCK";

export interface Signal {
  ruleId: string; // the rule Code, e.g. "PRIOR_SWING", "EKYC_STALE"
  severity: Severity; // OK/INFO/WARN/BLOCK  (spec kinds: soft->WARN, blocking/hard->BLOCK)
  weightedScore?: number; // this rule's contribution to Decision.score
  reason: Bilingual; // human-readable, shown to citizen/officer (reasonHi/reasonEn)
  meta?: Record<string, unknown>; // evidence
}

// ---- Decision: the engine's verdict ----
export type Outcome = "AUTO_ISSUE" | "FIELD_VERIFY" | "NEEDS_INPUT" | "REJECT";

export interface Decision {
  applicationId: string;
  outcome: Outcome;
  score: number; // 0..100 total. AUTO_ISSUE <20 & no hard/block; FIELD_VERIFY 20-60; NEEDS_INPUT any blocking; REJECT hard
  signals: Signal[]; // every check that fired, in order
  headline: Bilingual; // one-line summary of the outcome
  requiredInput?: Bilingual[]; // for NEEDS_INPUT: the exact fix(es) the citizen must supply
  decidedAt: string; // ISO datetime
}

// ---- SlaState: the statutory clock ----
export type SlaStatus = "RUNNING" | "MET" | "BREACHED" | "CLOSED";

export interface SlaState {
  applicationId: string;
  startedAt: string; // ISO — clock starts when app enters a pending state
  dueAt: string; // ISO — startedAt + working days (3 standard, 1 for Samadhan Ek Din)
  workingDaysAllowed: number; // 3 (or 1)
  workingDaysElapsed: number; // 0..n
  status: SlaStatus;
  paused?: boolean; // true while AWAITING_CITIZEN (NEEDS_INPUT) — clock is paused
  breachedAt?: string; // ISO if breached
  penaltyAccruedInr: number; // ₹250 * breachDays
  appealDraft?: Bilingual; // auto-generated on breach
}

// ---- Pure engine function signature (implemented in lib/engine) ----
export type EvaluateFn = (
  application: Application,
  snapshot: RegistrySnapshot
) => Decision;
