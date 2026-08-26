// Registry adapters — the swappable boundary between the engine and the data
// sources. Today the `sample` provider serves the built-in synthetic registries
// (Lane A's fetchSnapshot). On deployment, a `live` provider wired to the real
// Aadhaar / Samagra / Bhu-Abhilekh APIs is dropped in behind the same interface
// — no engine change. Switch via the PRAMAN_REGISTRY env var.
import type { Applicant, RegistrySnapshot } from "@/lib/contracts";
import { fetchSnapshot } from "@/lib/registries";

export interface RegistryProvider {
  readonly name: string;
  snapshot(applicant: Applicant, now: Date): RegistrySnapshot | Promise<RegistrySnapshot>;
}

/** Built-in provider backed by the seeded sample registries. */
export const sampleProvider: RegistryProvider = {
  name: "sample",
  snapshot: (applicant, now) => fetchSnapshot(applicant, now),
};

/** Placeholder for real government APIs — configured per deployment. */
export const liveProvider: RegistryProvider = {
  name: "live",
  snapshot() {
    throw new Error(
      "Live registry provider is not configured. Set PRAMAN_REGISTRY credentials and implement the live adapter.",
    );
  },
};

export function getProvider(): RegistryProvider {
  return process.env.PRAMAN_REGISTRY === "live" ? liveProvider : sampleProvider;
}
