import { describe, it, expect } from "vitest";
import type { Decision, SlaState } from "@/lib/contracts";

// Foundation smoke test: proves the frozen contract imports and type-checks
// cleanly, and that the "@/" alias resolves under Vitest. Real rule/outcome and
// SLA suites arrive with Lane A's engine work.
describe("contracts (frozen v1)", () => {
  it("a Decision object satisfies the contract shape", () => {
    const decision: Decision = {
      applicationId: "app_1",
      outcome: "AUTO_ISSUE",
      score: 7,
      signals: [],
      headline: { hi: "प्रमाण पत्र जारी", en: "Certificate issued" },
      decidedAt: new Date(0).toISOString(),
    };
    expect(decision.outcome).toBe("AUTO_ISSUE");
    expect(decision.signals).toHaveLength(0);
  });

  it("an SlaState object satisfies the contract shape", () => {
    const sla: SlaState = {
      applicationId: "app_1",
      startedAt: new Date(0).toISOString(),
      dueAt: new Date(0).toISOString(),
      workingDaysAllowed: 3,
      workingDaysElapsed: 0,
      status: "RUNNING",
      penaltyAccruedInr: 0,
    };
    expect(sla.workingDaysAllowed).toBe(3);
    expect(sla.status).toBe("RUNNING");
  });
});
