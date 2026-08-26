// lib/registries/ration.ts
// Mock Ration registry — family ration card category.
//
// In production this would call the National Food Security Act beneficiary database
// maintained by MP's Food, Civil Supplies and Consumer Protection department.
//
// Card categories:
//   AAY  — Antyodaya Anna Yojana (poorest of the poor)
//   BPL  — Below Poverty Line
//   APL  — Above Poverty Line
//   null — No card / not registered
//
// A family holding AAY or BPL while declaring income well above the BPL threshold
// triggers the RATION_CONTRADICTION hard signal → REJECT.
//
// All data is synthetic. See MOCKED.md for the honesty ledger.

import type { Applicant, RegistrySnapshot } from "../contracts";
import { REGISTRY_SEEDS } from "./seeds";

export interface RationRegistry {
  /** Return the ration slice of a RegistrySnapshot for the given applicant. */
  lookup(applicant: Applicant): RegistrySnapshot["ration"];
}

export const rationRegistry: RationRegistry = {
  lookup(applicant: Applicant): RegistrySnapshot["ration"] {
    const entry = REGISTRY_SEEDS.get(applicant.aadhaarLike);
    if (!entry) return { status: "NOT_FOUND" };
    return entry.ration;
  },
};
