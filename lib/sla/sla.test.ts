import { describe, expect, it } from "vitest";
import { computeDueAt, evaluateSla, penaltyFor } from ".";

describe("SLA calendar", () => {
  it("counts three working days and skips Sunday", () => {
    expect(computeDueAt("2026-08-21T09:00:00.000Z", true, false, [] ).toISOString())
      .toBe("2026-08-25T09:00:00.000Z");
  });

  it("uses one working day for Samadhan Ek Din", () => {
    expect(computeDueAt("2026-08-21T09:00:00.000Z", false, true, []).toISOString())
      .toBe("2026-08-22T09:00:00.000Z");
  });

  it("skips seeded holidays", () => {
    expect(computeDueAt("2026-10-01T09:00:00.000Z", false, false).toISOString())
      .toBe("2026-10-06T09:00:00.000Z");
  });
});

describe("SLA state", () => {
  const base = {
    applicationId: "APP-SLA",
    startedAt: "2026-08-21T09:00:00.000Z",
    isSamadhanEkDin: false,
    holidays: [] as string[],
    currentOwner: "Patwari S. Rao",
  };

  it("is running before its deadline", () => {
    expect(evaluateSla({ ...base, now: "2026-08-24T09:00:00.000Z" })).toMatchObject({
      status: "RUNNING",
      penaltyAccruedInr: 0,
    });
  });

  it("marks a resolved application as met", () => {
    expect(evaluateSla({
      ...base,
      now: "2026-08-26T09:00:00.000Z",
      resolvedAt: "2026-08-25T08:00:00.000Z",
    }).status).toBe("MET");
  });

  it("breaches, accrues penalty, and drafts a bilingual appeal", () => {
    const state = evaluateSla({ ...base, now: "2026-08-26T10:00:00.000Z" });
    expect(state).toMatchObject({ status: "BREACHED", penaltyAccruedInr: 500 });
    expect(state.appealDraft?.hi).toContain("Patwari S. Rao");
    expect(state.appealDraft?.en).toContain("Patwari S. Rao");
  });

  it("pauses while citizen input is required", () => {
    expect(evaluateSla({ ...base, now: "2026-08-30T09:00:00.000Z", outcome: "NEEDS_INPUT" }))
      .toMatchObject({ status: "RUNNING", paused: true, penaltyAccruedInr: 0 });
  });

  it("closes a rejected application", () => {
    expect(evaluateSla({ ...base, now: "2026-08-30T09:00:00.000Z", outcome: "REJECT" }).status)
      .toBe("CLOSED");
  });

  it("charges INR 250 for every started calendar day of delay", () => {
    expect(penaltyFor(3)).toBe(750);
  });
});
