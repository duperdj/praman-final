// ============================================================================
// tests/outcomes.test.ts — every engine Outcome is reachable and well-formed,
// across ALL 45 seeded fixtures (5 demo + 40 filler), through the real engine.
// Complements lib/engine/engine.test.ts (per-rule boundaries) — here we guard
// the whole seeded corpus and the Decision shape contract.
// ============================================================================

import { describe, it, expect } from "vitest";
import type { Outcome } from "@/lib/contracts";
import { evaluate } from "@/lib/engine";
import { allApplications, snapshotFor } from "./fixtures";

const OUTCOMES: Outcome[] = ["AUTO_ISSUE", "FIELD_VERIFY", "NEEDS_INPUT", "REJECT"];

/** BREACH_SLA is a seeding label for FIELD_VERIFY + a backdated clock. */
function engineOutcomeOf(intended: string): Outcome {
  return (intended === "BREACH_SLA" ? "FIELD_VERIFY" : intended) as Outcome;
}

describe("engine outcomes — the whole seeded corpus resolves as intended", () => {
  it.each(allApplications)(
    "$application.id → its intended outcome",
    (fixture) => {
      const decision = evaluate(fixture.application, snapshotFor(fixture.application));
      expect(decision.outcome).toBe(engineOutcomeOf(fixture.intendedOutcome));
    }
  );

  it("all four outcomes are reachable across the corpus", () => {
    const seen = new Set(
      allApplications.map(
        (f) => evaluate(f.application, snapshotFor(f.application)).outcome
      )
    );
    for (const o of OUTCOMES) expect(seen).toContain(o);
  });
});

describe("Decision shape contract (lib/contracts.ts)", () => {
  it.each(allApplications)("$application.id yields a well-formed Decision", (fixture) => {
    const decision = evaluate(fixture.application, snapshotFor(fixture.application));

    expect(decision.applicationId).toBe(fixture.application.id);
    expect(OUTCOMES).toContain(decision.outcome);
    expect(decision.score).toBeGreaterThanOrEqual(0);
    expect(decision.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(decision.signals)).toBe(true);
    expect(typeof decision.decidedAt).toBe("string");

    // Outcome ↔ score/signal invariants (ENGINE_NOTES.md).
    if (decision.outcome === "AUTO_ISSUE") {
      expect(decision.score).toBeLessThan(20);
      expect(decision.signals.every((s) => s.severity !== "BLOCK")).toBe(true);
    }
    if (decision.outcome === "FIELD_VERIFY") {
      expect(decision.score).toBeGreaterThanOrEqual(20);
      expect(decision.score).toBeLessThanOrEqual(60);
    }
    if (decision.outcome === "REJECT") {
      expect(decision.score).toBe(100);
    }
    if (decision.outcome === "NEEDS_INPUT") {
      // A blocking signal is present, and the citizen is told exactly what to fix.
      expect(decision.signals.some((s) => s.severity === "BLOCK")).toBe(true);
      expect(decision.requiredInput && decision.requiredInput.length).toBeGreaterThan(0);
    }
  });
});
