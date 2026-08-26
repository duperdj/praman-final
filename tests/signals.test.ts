// ============================================================================
// tests/signals.test.ts — every Signal is bilingual + explainable (Spec §4),
// and every Aadhaar-like number is synthetic (fails Verhoeff, Spec §4).
// Checked across ALL 45 seeded fixtures through the real engine.
// ============================================================================

import { describe, it, expect } from "vitest";
import type { Severity } from "@/lib/contracts";
import { evaluate } from "@/lib/engine";
import { failsVerhoeff } from "@/lib/registries";
import { allApplications, snapshotFor } from "./fixtures";

const SEVERITIES: Severity[] = ["OK", "INFO", "WARN", "BLOCK"];

const decisions = allApplications.map((f) => ({
  id: f.application.id,
  decision: evaluate(f.application, snapshotFor(f.application)),
}));

describe("bilingual reasons — every Signal carries hi + en (Spec §4)", () => {
  it.each(decisions)("$id: every signal reason is bilingual and non-empty", ({ decision }) => {
    for (const signal of decision.signals) {
      expect(signal.reason.hi.trim().length).toBeGreaterThan(0);
      expect(signal.reason.en.trim().length).toBeGreaterThan(0);
      expect(signal.ruleId.trim().length).toBeGreaterThan(0);
      expect(SEVERITIES).toContain(signal.severity);
    }
  });

  it.each(decisions)("$id: headline is bilingual and non-empty", ({ decision }) => {
    expect(decision.headline.hi.trim().length).toBeGreaterThan(0);
    expect(decision.headline.en.trim().length).toBeGreaterThan(0);
  });

  it("NEEDS_INPUT decisions give a bilingual, non-empty required fix", () => {
    const needsInput = decisions.filter(({ decision }) => decision.outcome === "NEEDS_INPUT");
    expect(needsInput.length).toBeGreaterThan(0); // the corpus must exercise this path
    for (const { decision } of needsInput) {
      expect(decision.requiredInput && decision.requiredInput.length).toBeGreaterThan(0);
      for (const fix of decision.requiredInput ?? []) {
        expect(fix.hi.trim().length).toBeGreaterThan(0);
        expect(fix.en.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("synthetic Aadhaar — every aadhaarLike fails Verhoeff (Spec §4)", () => {
  it.each(allApplications)("$application.id: aadhaarLike is a synthetic 12-digit number", (fixture) => {
    const n = fixture.application.applicant.aadhaarLike;
    expect(n).toMatch(/^\d{12}$/);
    expect(failsVerhoeff(n)).toBe(true); // never collides with a real Aadhaar
  });
});
