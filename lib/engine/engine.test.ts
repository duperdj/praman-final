import { describe, expect, it } from "vitest";
import type { Application, RegistrySnapshot } from "../contracts";
import { demoPersonas } from "../../data/personas";
import { fetchSnapshot } from "../registries";
import { evaluate } from ".";

const application: Application = {
  id: "APP-TEST",
  applicant: {
    fullName: "Synthetic Test",
    phone: "9000000000",
    aadhaarLike: "111111111111",
    samagraId: "SAM-TEST",
    dateOfBirth: "1990-01-01",
    district: "Bhopal",
    tehsil: "Huzur",
    addressLine: "Synthetic address",
  },
  statedAnnualIncome: 100_000,
  incomeSource: "SALARY",
  purpose: "Unknown purpose",
  submittedAt: "2026-08-24T08:00:00.000Z",
  lang: "en",
};

const clean: RegistrySnapshot = {
  aadhaar: { status: "MATCH", nameMatch: true, ageMatch: true },
  samagra: { status: "MATCH", ekycStatus: "PRESENT", ekycAgeMonths: 12 },
  land: { status: "MATCH", hasHoldings: false },
  ration: { status: "MATCH", cardType: "APL" },
  priorCertificate: { status: "MATCH", hasUnexpiredThisYear: false },
  fetchedAt: "2026-08-24T08:00:01.000Z",
};

function decide(
  app: Partial<Application>,
  snapshot: Partial<RegistrySnapshot>
) {
  return evaluate({ ...application, ...app }, { ...clean, ...snapshot });
}

describe("issuance rules", () => {
  it.each([
    ["RATION_CONTRADICTION", { statedAnnualIncome: 100_001 }, { ration: { status: "MATCH", cardType: "BPL" } }, "REJECT"],
    ["PRIOR_SWING", { statedAnnualIncome: 100_000 }, { priorCertificate: { status: "MATCH", lastYearDeclaredIncome: 50_000 } }, "FIELD_VERIFY"],
    ["LAND_VS_INCOME", { incomeSource: "AGRICULTURE" }, { land: { status: "MATCH", hasHoldings: true, estAnnualIncome: 150_001 } }, "FIELD_VERIFY"],
    ["THRESHOLD_HUGGING", { statedAnnualIncome: 245_000, purpose: "Scholarship" }, {}, "FIELD_VERIFY"],
    ["EKYC_STALE", {}, { samagra: { status: "MATCH", ekycStatus: "PRESENT", ekycAgeMonths: 13 } }, "NEEDS_INPUT"],
    ["IDENTITY_MISMATCH", {}, { aadhaar: { status: "MATCH", nameMatch: false, ageMatch: true } }, "NEEDS_INPUT"],
    ["DUPLICATE_ACTIVE", {}, { priorCertificate: { status: "MATCH", hasUnexpiredThisYear: true } }, "NEEDS_INPUT"],
    ["SOURCE_INCOMPLETE", {}, { land: { status: "MATCH", hasHoldings: true } }, "FIELD_VERIFY"],
  ] as const)("fires %s", (ruleId, app, snapshot, outcome) => {
    const decision = decide(app, snapshot);
    expect(decision.outcome).toBe(outcome);
    expect(decision.signals.map((signal) => signal.ruleId)).toContain(ruleId);
    expect(decision.signals.every((signal) => signal.reason.hi && signal.reason.en)).toBe(true);
  });

  it("auto-issues a clean application", () => {
    expect(evaluate(application, clean)).toMatchObject({
      outcome: "AUTO_ISSUE",
      score: 0,
      signals: [],
      decidedAt: clean.fetchedAt,
    });
  });

  it("measures PRIOR_SWING against last year's income", () => {
    expect(decide(
      { statedAnnualIncome: 140_000 },
      { priorCertificate: { status: "MATCH", lastYearDeclaredIncome: 100_000 } }
    ).signals.map((signal) => signal.ruleId)).not.toContain("PRIOR_SWING");

    expect(decide(
      { statedAnnualIncome: 140_001 },
      { priorCertificate: { status: "MATCH", lastYearDeclaredIncome: 100_000 } }
    ).signals.map((signal) => signal.ruleId)).toContain("PRIOR_SWING");
  });

  it("does not fire at strict rule boundaries", () => {
    const decision = decide(
      { statedAnnualIncome: 250_000, purpose: "Scholarship", incomeSource: "AGRICULTURE" },
      {
        ration: { status: "MATCH", cardType: "APL" },
        priorCertificate: { status: "MATCH", lastYearDeclaredIncome: 250_000 },
        land: { status: "MATCH", hasHoldings: true, estAnnualIncome: 375_000 },
      }
    );
    expect(decision.outcome).toBe("AUTO_ISSUE");
  });
});

describe("seeded demo personas", () => {
  it.each(demoPersonas)("maps $application.id to $intendedOutcome", (fixture) => {
    const expected = fixture.intendedOutcome === "BREACH_SLA" ? "FIELD_VERIFY" : fixture.intendedOutcome;
    const snapshot = fetchSnapshot(fixture.application.applicant, new Date(fixture.application.submittedAt));
    expect(evaluate(fixture.application, snapshot).outcome).toBe(expected);
  });
});
