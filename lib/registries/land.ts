// lib/registries/land.ts  (v1.1)
// Mock Land registry — agricultural holding size and estimated annual income.
//
// In production this would integrate with MP's Bhu-Abhilekh (land records)
// portal (mpbhulekh.gov.in).
//
// v1.1 adds holdingHectares (Spec §7 measures land in hectares) consumed by:
//   LAND_VS_INCOME    — holding size implies income >> statedAnnualIncome (soft, WARN)
//   SOURCE_INCOMPLETE — land present but no AGRICULTURE in incomeSources (soft, WARN)
//
// estAnnualIncome is a computed estimate based on holding size × crop yield norms;
// it is what the engine rule compares against statedAnnualIncome.
//
// All data is synthetic. See MOCKED.md for the honesty ledger.

import type { Applicant, RegistrySnapshot } from "../contracts";
import { REGISTRY_SEEDS } from "./seeds";

export interface LandRegistry {
  /** Return the land slice of a RegistrySnapshot for the given applicant. */
  lookup(applicant: Applicant): RegistrySnapshot["land"];
}

export const landRegistry: LandRegistry = {
  lookup(applicant: Applicant): RegistrySnapshot["land"] {
    const entry = REGISTRY_SEEDS.get(applicant.aadhaarLike);
    if (!entry) return { status: "NOT_FOUND" };
    return entry.land;
  },
};
