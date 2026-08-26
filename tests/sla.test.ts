// ============================================================================
// tests/sla.test.ts — the statutory clock (lib/sla, Spec §9) paired with each
// demo persona's engine outcome. Guards the two headline transitions
// RUNNING→MET and RUNNING→BREACHED (₹250/day + auto-drafted bilingual appeal),
// plus the NEEDS_INPUT pause and the REJECT close.
// ============================================================================

import { describe, it, expect } from "vitest";
import { evaluateSla, computeDueAt, penaltyFor } from "@/lib/sla";
import { personas } from "./fixtures";

const OWNER = "Patwari R. Verma";

describe("SLA working-day math (Spec §9)", () => {
  it("penaltyFor charges ₹250 per breach day", () => {
    expect(penaltyFor(0)).toBe(0);
    expect(penaltyFor(1)).toBe(250);
    expect(penaltyFor(5)).toBe(1250);
  });

  it("computeDueAt = start + 3 working days, Sundays excluded", () => {
    // 2026-08-15 Sat → skip 08-16 Sun → 08-17,18,19 → due 08-19.
    expect(computeDueAt("2026-08-15T09:00:00.000Z", false, false).toISOString())
      .toBe("2026-08-19T09:00:00.000Z");
  });
});

describe("RUNNING → MET (clean / approved in time)", () => {
  it("Sunita (AUTO_ISSUE) → MET, no penalty", () => {
    const p = personas.sunita;
    const state = evaluateSla({
      applicationId: p.application.id,
      startedAt: p.application.submittedAt,
      now: "2026-08-28T09:00:00.000Z",
      outcome: "AUTO_ISSUE",
    });
    expect(state.status).toBe("MET");
    expect(state.penaltyAccruedInr).toBe(0);
    expect(state.appealDraft).toBeUndefined();
  });

  it("Ramesh (FIELD_VERIFY) resolved before dueAt → MET, no penalty", () => {
    const p = personas.ramesh;
    const state = evaluateSla({
      applicationId: p.application.id,
      startedAt: p.application.submittedAt, // 2026-08-22 → due 2026-08-26
      now: "2026-08-27T09:00:00.000Z",
      resolvedAt: "2026-08-25T10:00:00.000Z",
      currentOwner: OWNER,
    });
    expect(state.status).toBe("MET");
    expect(state.penaltyAccruedInr).toBe(0);
  });
});

describe("RUNNING → BREACHED (Kamla — the breach persona, Spec §9 & §11 #3)", () => {
  const p = personas.kamla;
  const state = evaluateSla({
    applicationId: p.application.id,
    startedAt: p.application.submittedAt, // 2026-08-15 → due 2026-08-19
    now: "2026-08-24T09:00:00.000Z", // 5 calendar days past due
    outcome: "FIELD_VERIFY",
    currentOwner: OWNER,
  });

  it("status is BREACHED with breachedAt set to the due instant", () => {
    expect(state.status).toBe("BREACHED");
    expect(state.breachedAt).toBe("2026-08-19T09:00:00.000Z");
  });

  it("penalty accrues at ₹250/day (5 days → ₹1250)", () => {
    expect(state.penaltyAccruedInr).toBe(1250);
    expect(state.penaltyAccruedInr % 250).toBe(0);
  });

  it("an appeal is auto-drafted, bilingual, and names the current officer", () => {
    expect(state.appealDraft).toBeDefined();
    expect(state.appealDraft?.hi.trim().length).toBeGreaterThan(0);
    expect(state.appealDraft?.en.trim().length).toBeGreaterThan(0);
    expect(state.appealDraft?.hi).toContain(OWNER);
    expect(state.appealDraft?.en).toContain(OWNER);
  });
});

describe("NEEDS_INPUT pause & REJECT close (Spec §8/§9)", () => {
  it("Arjun (EKYC_STALE) → clock paused, RUNNING, no penalty", () => {
    const p = personas.arjun;
    const state = evaluateSla({
      applicationId: p.application.id,
      startedAt: p.application.submittedAt,
      now: "2026-09-30T09:00:00.000Z", // far past due, but paused
      outcome: "NEEDS_INPUT",
      currentOwner: OWNER,
    });
    expect(state.status).toBe("RUNNING");
    expect(state.paused).toBe(true);
    expect(state.penaltyAccruedInr).toBe(0);
    expect(state.appealDraft).toBeUndefined();
  });

  it("Ganpat (REJECT) → CLOSED, no accrual", () => {
    const p = personas.ganpat;
    const state = evaluateSla({
      applicationId: p.application.id,
      startedAt: p.application.submittedAt,
      now: "2026-09-30T09:00:00.000Z",
      outcome: "REJECT",
      currentOwner: OWNER,
    });
    expect(state.status).toBe("CLOSED");
    expect(state.penaltyAccruedInr).toBe(0);
  });
});
