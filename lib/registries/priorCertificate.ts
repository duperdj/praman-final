// lib/registries/priorCertificate.ts
// Mock PriorCertificate registry — previous income certificates for this family.
//
// In production this would query the Praman certificate store itself (or the MP
// Lok Seva Guarantee database). Two engine rules consume this data:
//
//   PRIOR_SWING      — lastYearDeclaredIncome differs from current by > 40%
//   DUPLICATE_ACTIVE — hasUnexpiredThisYear=true means a valid cert already exists
//
// All data is synthetic. See MOCKED.md for the honesty ledger.

import type { Applicant, RegistrySnapshot } from "../contracts";
import { REGISTRY_SEEDS } from "./seeds";

export interface PriorCertificateRegistry {
  /** Return the priorCertificate slice of a RegistrySnapshot for the given applicant. */
  lookup(applicant: Applicant): RegistrySnapshot["priorCertificate"];
}

export const priorCertificateRegistry: PriorCertificateRegistry = {
  lookup(applicant: Applicant): RegistrySnapshot["priorCertificate"] {
    const entry = REGISTRY_SEEDS.get(applicant.aadhaarLike);
    if (!entry) return { status: "NOT_FOUND" };
    return entry.priorCertificate;
  },
};
