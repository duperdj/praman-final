// ============================================================================
// tests/personas.test.ts — the five demo personas map to their intended
// Outcome (Spec §11), driven through the REAL engine + registries.
// ============================================================================

import { describe, it, expect } from "vitest";
import { evaluate } from "@/lib/engine";
import { personaExpectations, breachPersona } from "./fixtures";

describe("demo personas — persona → Outcome (Spec §11)", () => {
  it.each(personaExpectations)(
    "$name ($district): evaluate() → $expectedOutcome",
    (p) => {
      const decision = evaluate(p.application, p.snapshot);
      expect(decision.outcome).toBe(p.expectedOutcome);
      expect(decision.applicationId).toBe(p.application.id);
      // Every expected rule id is present among the fired signals.
      const fired = decision.signals.map((s) => s.ruleId);
      for (const ruleId of p.expectedSignalRuleIds) {
        expect(fired).toContain(ruleId);
      }
      // A clean persona fires nothing.
      if (p.expectedSignalRuleIds.length === 0) {
        expect(decision.signals).toHaveLength(0);
        expect(decision.score).toBeLessThan(20);
      }
    }
  );
});

describe("demo personas — the four outcomes are all represented (Spec §8)", () => {
  it("AUTO_ISSUE, FIELD_VERIFY, NEEDS_INPUT and REJECT each appear across the five", () => {
    const outcomes = new Set(
      personaExpectations.map((p) => evaluate(p.application, p.snapshot).outcome)
    );
    for (const o of ["AUTO_ISSUE", "FIELD_VERIFY", "NEEDS_INPUT", "REJECT"] as const) {
      expect(outcomes).toContain(o);
    }
  });
});

describe("demo personas — exactly one is the breach persona (Spec §11 #3)", () => {
  it("Kamla is flagged as the persona that must BREACH", () => {
    expect(breachPersona.key).toBe("kamla");
    expect(breachPersona.expectedSla).toBe("BREACHED");
  });

  it("exactly one persona carries breaches=true", () => {
    expect(personaExpectations.filter((p) => p.breaches)).toHaveLength(1);
  });
});
