// lib/registries/samagra.ts  (v1.1)
// Mock Samagra registry — family composition and eKYC freshness.
//
// In production this would call MP's Samagra portal API (samagra.gov.in).
//
// v1.1 adds eKYC freshness fields consumed by the EKYC_STALE engine rule:
//   ekycStatus    "PRESENT" | "MISSING"   — whether eKYC was ever completed
//   ekycUpdatedAt ISO date                 — date of last eKYC (absent = never)
//   ekycAgeMonths number                   — months since eKYC (>12 = stale)
//
// The EKYC_STALE rule fires when:
//   ekycStatus === "MISSING"  OR  ekycAgeMonths > 12
// → blocking signal → outcome NEEDS_INPUT → SlaState.paused = true
//
// All data is synthetic. See MOCKED.md for the honesty ledger.

import type { Applicant, RegistrySnapshot } from "../contracts";
import { REGISTRY_SEEDS } from "./seeds";

export interface SamagraRegistry {
  /** Return the samagra slice of a RegistrySnapshot for the given applicant. */
  lookup(applicant: Applicant): RegistrySnapshot["samagra"];
}

export const samagraRegistry: SamagraRegistry = {
  lookup(applicant: Applicant): RegistrySnapshot["samagra"] {
    const entry = REGISTRY_SEEDS.get(applicant.aadhaarLike);
    if (!entry) return { status: "NOT_FOUND" };
    return entry.samagra;
  },
};
