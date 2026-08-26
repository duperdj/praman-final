// ============================================================================
// tests/fixtures.ts — persona expectation table for the Praman correctness
// suite, aligned to the FROZEN contract v1.1 (lib/contracts.ts).
// Owned by Oscar (correctness guard). Boundary: this file + tests/*.test.ts only.
//
// v1.1 change: the hand-built v1 snapshots (which used the removed `tax` field)
// are gone. Snapshots now come from the REAL registries via fetchSnapshot(), so
// they carry priorCertificate + samagra eKYC + land.holdingHectares by
// construction and can never drift from what the engine actually consumes.
// The persona Applications are the canonical ones Pam seeded in data/personas.ts.
//
// All data is SYNTHETIC; every aadhaarLike deliberately fails Verhoeff.
// ============================================================================

import type {
  Application,
  RegistrySnapshot,
  Outcome,
  SlaStatus,
} from "@/lib/contracts";
import { demoPersonas, allApplications, type ApplicationFixture } from "@/data/personas";
import { fetchSnapshot } from "@/lib/registries";

/** Resolve the real registry snapshot for an application (time-pinned to submit). */
export function snapshotFor(app: Application): RegistrySnapshot {
  return fetchSnapshot(app.applicant, new Date(app.submittedAt));
}

// ---- One row of the persona -> expectation table (Spec §11) -----------------
export interface PersonaExpectation {
  key: string;
  name: string;
  district: string;
  application: Application;
  /** Built from the real registries — v1.1 shape, no `tax`. */
  snapshot: RegistrySnapshot;
  expectedOutcome: Outcome;
  /** Rule ids we expect to fire (subset assertion). */
  expectedSignalRuleIds: string[];
  /** Terminal SLA status this persona demonstrates. */
  expectedSla: SlaStatus;
  /** True while AWAITING_CITIZEN (NEEDS_INPUT) — clock paused, not terminal. */
  slaPaused: boolean;
  /** True only for the persona whose clock must BREACH. */
  breaches: boolean;
  note: string;
}

// Expectation metadata, keyed by the canonical application id in data/personas.ts.
const META: Record<
  string,
  Omit<PersonaExpectation, "application" | "snapshot"> & { id: string }
> = {
  "APP-DEMO-001": {
    id: "APP-DEMO-001", key: "sunita", name: "Sunita Verma", district: "Indore",
    expectedOutcome: "AUTO_ISSUE", expectedSignalRuleIds: [],
    expectedSla: "MET", slaPaused: false, breaches: false,
    note: "Clean case — no rule fires. Auto-issued. RUNNING→MET.",
  },
  "APP-DEMO-002": {
    id: "APP-DEMO-002", key: "ramesh", name: "Ramesh Kumar", district: "Dewas",
    expectedOutcome: "FIELD_VERIFY", expectedSignalRuleIds: ["LAND_VS_INCOME"],
    expectedSla: "MET", slaPaused: false, breaches: false,
    note: "Soft LAND_VS_INCOME → Patwari with the reason stated; officer approves within SLA.",
  },
  "APP-DEMO-003": {
    id: "APP-DEMO-003", key: "kamla", name: "Kamla Devi", district: "Sehore",
    expectedOutcome: "FIELD_VERIFY", expectedSignalRuleIds: ["LAND_VS_INCOME"],
    expectedSla: "BREACHED", slaPaused: false, breaches: true,
    note: "Routed to Patwari; officer never acts. Backdated clock runs out → BREACHED, appeal drafted, ₹250/day penalty. ← the breach persona.",
  },
  "APP-DEMO-004": {
    id: "APP-DEMO-004", key: "arjun", name: "Arjun Sharma", district: "Bhopal",
    expectedOutcome: "NEEDS_INPUT", expectedSignalRuleIds: ["EKYC_STALE"],
    expectedSla: "RUNNING", slaPaused: true, breaches: false,
    note: "EKYC_STALE blocking → AWAITING_CITIZEN with the exact fix. SLA pauses. Blocked ≠ abandoned.",
  },
  "APP-DEMO-005": {
    id: "APP-DEMO-005", key: "ganpat", name: "Ganpat Kewat", district: "Ujjain",
    expectedOutcome: "REJECT", expectedSignalRuleIds: ["RATION_CONTRADICTION"],
    expectedSla: "CLOSED", slaPaused: false, breaches: false,
    note: "AAY card vs income above the BPL band → hard contradiction → REJECT with evidence; CLOSED.",
  },
};

function toExpectation(fixture: ApplicationFixture): PersonaExpectation {
  const meta = META[fixture.application.id];
  if (!meta) {
    throw new Error(`No expectation metadata for persona ${fixture.application.id}`);
  }
  const { id: _id, ...rest } = meta;
  return {
    ...rest,
    application: fixture.application,
    snapshot: snapshotFor(fixture.application),
  };
}

/** The five demo personas (Spec §11), each with its intended Outcome + SLA. */
export const personaExpectations: PersonaExpectation[] = demoPersonas.map(toExpectation);

export const personas: Record<string, PersonaExpectation> = Object.fromEntries(
  personaExpectations.map((p) => [p.key, p])
);

/** The single persona whose SLA must transition RUNNING→BREACHED. */
export const breachPersona =
  personaExpectations.find((p) => p.breaches) ?? personaExpectations[2];

/** All 45 seeded fixtures (5 demo + 40 filler) for cross-cutting invariants. */
export { allApplications };
export type { ApplicationFixture };
