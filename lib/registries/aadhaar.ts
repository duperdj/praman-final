// lib/registries/aadhaar.ts
// Mock Aadhaar registry — name and date-of-birth matching.
//
// In production this would call UIDAI's OTP-based authentication API.
// All data here is synthetic. See MOCKED.md for the honesty ledger.

import type { Applicant, RegistrySnapshot } from "../contracts";
import { REGISTRY_SEEDS } from "./seeds";

export interface AadhaarRegistry {
  /** Return the aadhaar slice of a RegistrySnapshot for the given applicant. */
  lookup(applicant: Applicant): RegistrySnapshot["aadhaar"];
}

export const aadhaarRegistry: AadhaarRegistry = {
  lookup(applicant: Applicant): RegistrySnapshot["aadhaar"] {
    const entry = REGISTRY_SEEDS.get(applicant.aadhaarLike);
    if (!entry) return { status: "NOT_FOUND" };
    return entry.aadhaar;
  },
};
