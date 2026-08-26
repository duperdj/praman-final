// lib/registries/index.ts  (v1.1)
// Aggregates the five mock registries into a single fetchSnapshot() call.
//
// Five registries (Spec §7): Aadhaar · Samagra · Ration · Land · PriorCertificate.
// (The `tax` registry from v1.0 has been removed — see tax.ts for the tombstone.)
//
// fetchSnapshot() calls all five and assembles the complete RegistrySnapshot
// that the engine's EvaluateFn expects.

import type { Applicant, RegistrySnapshot } from "../contracts";
import { aadhaarRegistry,          type AadhaarRegistry          } from "./aadhaar";
import { samagraRegistry,          type SamagraRegistry          } from "./samagra";
import { landRegistry,             type LandRegistry             } from "./land";
import { rationRegistry,           type RationRegistry           } from "./ration";
import { priorCertificateRegistry, type PriorCertificateRegistry } from "./priorCertificate";

export type { AadhaarRegistry }          from "./aadhaar";
export type { SamagraRegistry }          from "./samagra";
export type { LandRegistry }             from "./land";
export type { RationRegistry }           from "./ration";
export type { PriorCertificateRegistry } from "./priorCertificate";

export {
  aadhaarRegistry,
  samagraRegistry,
  landRegistry,
  rationRegistry,
  priorCertificateRegistry,
};

export { isValidVerhoeff, failsVerhoeff, makeSyntheticAadhaar } from "./verhoeff";

/** Shared interface for a single-slice registry lookup. */
export interface RegistryModule<K extends keyof Omit<RegistrySnapshot, "fetchedAt">> {
  lookup(applicant: Applicant): RegistrySnapshot[K];
}

/**
 * Fetch all five registry slices for an applicant and return a complete
 * RegistrySnapshot. Pass `now` explicitly so callers in tests can control time.
 */
export function fetchSnapshot(
  applicant: Applicant,
  now: Date = new Date()
): RegistrySnapshot {
  return {
    aadhaar:          aadhaarRegistry.lookup(applicant),
    samagra:          samagraRegistry.lookup(applicant),
    land:             landRegistry.lookup(applicant),
    ration:           rationRegistry.lookup(applicant),
    priorCertificate: priorCertificateRegistry.lookup(applicant),
    fetchedAt:        now.toISOString(),
  };
}
