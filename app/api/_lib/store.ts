// Persistence + contract-shape mapping for the API routes.
// Bridges the Prisma rows (schema conventions: String enums, flattened *Hi/*En
// Bilingual, JSON-as-String) back to the FROZEN contract shapes the routes
// return. Two contract fields have no dedicated column and are packed into
// existing JSON: Signal.weightedScore (into Signal.meta) — SlaState.paused is
// re-derived from the decision outcome on read.
import type {
  Application,
  Decision,
  IncomeSource,
  Lang,
  Outcome,
  Severity,
  Signal,
  SlaState,
} from "@/lib/contracts";
import { evaluateSla } from "@/lib/sla";
import { db } from "@/lib/db";

// ---------- write ----------

function packSignal(s: Signal) {
  return {
    ruleId: s.ruleId,
    severity: s.severity,
    reasonHi: s.reason.hi,
    reasonEn: s.reason.en,
    // weightedScore has no column — carry it alongside the evidence.
    meta: JSON.stringify({ evidence: s.meta ?? null, weightedScore: s.weightedScore ?? null }),
  };
}

function slaRow(sla: SlaState) {
  return {
    startedAt: new Date(sla.startedAt),
    dueAt: new Date(sla.dueAt),
    workingDaysAllowed: sla.workingDaysAllowed,
    workingDaysElapsed: sla.workingDaysElapsed,
    status: sla.status,
    breachedAt: sla.breachedAt ? new Date(sla.breachedAt) : null,
    penaltyAccruedInr: sla.penaltyAccruedInr,
    appealDraftHi: sla.appealDraft?.hi ?? null,
    appealDraftEn: sla.appealDraft?.en ?? null,
  };
}

function certificateFor(a: Application) {
  const issuedAt = new Date(a.submittedAt);
  const expiresAt = new Date(issuedAt);
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1); // valid one year
  return {
    number: `MP-AY-${issuedAt.getUTCFullYear()}-${a.id.slice(0, 8).toUpperCase()}`,
    applicationId: a.id,
    issuedAt,
    expiresAt,
    signature: `MOCK-SEAL-${a.id.slice(0, 12)}`, // synthetic; see MOCKED.md
  };
}

/** Persist a freshly decided application: Applicant, Application, Decision +
 *  Signals, SlaState, a STARTED (and BREACHED) SlaEvent, and a Certificate for
 *  AUTO_ISSUE — all in one transaction. */
export async function persistApplication(
  a: Application,
  decision: Decision,
  sla: SlaState,
  extra?: { serviceType?: string; formData?: string }
): Promise<void> {
  await db.$transaction(async (tx) => {
    await tx.application.create({
      data: {
        id: a.id,
        statedAnnualIncome: a.statedAnnualIncome,
        incomeSource: a.incomeSource,
        purpose: a.purpose,
        submittedAt: new Date(a.submittedAt),
        lang: a.lang,
        serviceType: extra?.serviceType ?? "income-certificate",
        formData: extra?.formData ?? null,
        applicant: { create: { ...a.applicant } },
      },
    });
    await tx.decision.create({
      data: {
        applicationId: a.id,
        outcome: decision.outcome,
        score: decision.score,
        headlineHi: decision.headline.hi,
        headlineEn: decision.headline.en,
        requiredInput: decision.requiredInput
          ? JSON.stringify(decision.requiredInput)
          : null,
        decidedAt: new Date(decision.decidedAt),
        signals: { create: decision.signals.map(packSignal) },
      },
    });
    await tx.slaState.create({ data: { applicationId: a.id, ...slaRow(sla) } });
    await tx.slaEvent.create({
      data: { applicationId: a.id, type: "STARTED", at: new Date(sla.startedAt) },
    });
    if (sla.status === "BREACHED") {
      await tx.slaEvent.create({
        data: {
          applicationId: a.id,
          type: "BREACHED",
          at: new Date(sla.breachedAt ?? sla.dueAt),
        },
      });
    }
    if (decision.outcome === "AUTO_ISSUE") {
      await tx.certificate.create({ data: certificateFor(a) });
    }
  });
}

/** Re-persist an SLA row after the demo clock advances (POST /api/dev/tick). */
export async function updateSla(sla: SlaState): Promise<void> {
  await db.slaState.update({
    where: { applicationId: sla.applicationId },
    data: slaRow(sla),
  });
}

/** Re-decide an EXISTING application in place after the citizen supplies the
 *  missing input (POST /api/applications/:id/resolve). Replaces the decision +
 *  its signals, resumes/updates the clock, logs a RESUMED event, and mints the
 *  certificate if it now auto-issues — all in one transaction. */
export async function updateDecision(
  a: Application,
  decision: Decision,
  sla: SlaState,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const existing = await tx.decision.findUnique({
      where: { applicationId: a.id },
      select: { id: true },
    });
    if (existing) {
      await tx.signal.deleteMany({ where: { decisionId: existing.id } });
      await tx.decision.update({
        where: { applicationId: a.id },
        data: {
          outcome: decision.outcome,
          score: decision.score,
          headlineHi: decision.headline.hi,
          headlineEn: decision.headline.en,
          requiredInput: decision.requiredInput ? JSON.stringify(decision.requiredInput) : null,
          decidedAt: new Date(decision.decidedAt),
          signals: { create: decision.signals.map(packSignal) },
        },
      });
    }
    await tx.slaState.update({ where: { applicationId: a.id }, data: slaRow(sla) });
    await tx.slaEvent.create({ data: { applicationId: a.id, type: "RESUMED", at: new Date() } });
    if (decision.outcome === "AUTO_ISSUE") {
      const cert = await tx.certificate.findUnique({ where: { applicationId: a.id } });
      if (!cert) await tx.certificate.create({ data: certificateFor(a) });
    }
  });
}

// ---------- read / map to contract ----------

type SignalRow = { ruleId: string; severity: string; reasonHi: string; reasonEn: string; meta: string | null };
type ApplicantRow = {
  fullName: string; phone: string; aadhaarLike: string; samagraId: string;
  dateOfBirth: string; district: string; tehsil: string; addressLine: string;
};
type ApplicationRow = {
  id: string; statedAnnualIncome: number; incomeSource: string; purpose: string;
  submittedAt: Date; lang: string; applicant: ApplicantRow;
};
type DecisionRow = {
  applicationId: string; outcome: string; score: number; headlineHi: string;
  headlineEn: string; requiredInput: string | null; decidedAt: Date; signals: SignalRow[];
};

function unpackSignal(row: SignalRow): Signal {
  const parsed = row.meta ? (JSON.parse(row.meta) as { evidence?: unknown; weightedScore?: number | null }) : {};
  return {
    ruleId: row.ruleId,
    severity: row.severity as Severity,
    ...(parsed.weightedScore != null ? { weightedScore: parsed.weightedScore } : {}),
    reason: { hi: row.reasonHi, en: row.reasonEn },
    ...(parsed.evidence != null ? { meta: parsed.evidence as Record<string, unknown> } : {}),
  };
}

export function mapApplication(row: ApplicationRow): Application {
  const p = row.applicant;
  return {
    id: row.id,
    applicant: {
      fullName: p.fullName, phone: p.phone, aadhaarLike: p.aadhaarLike,
      samagraId: p.samagraId, dateOfBirth: p.dateOfBirth, district: p.district,
      tehsil: p.tehsil, addressLine: p.addressLine,
    },
    statedAnnualIncome: row.statedAnnualIncome,
    incomeSource: row.incomeSource as IncomeSource,
    purpose: row.purpose,
    submittedAt: row.submittedAt.toISOString(),
    lang: row.lang as Lang,
  };
}

export function mapDecision(row: DecisionRow): Decision {
  return {
    applicationId: row.applicationId,
    outcome: row.outcome as Outcome,
    score: row.score,
    signals: row.signals.map(unpackSignal),
    headline: { hi: row.headlineHi, en: row.headlineEn },
    ...(row.requiredInput ? { requiredInput: JSON.parse(row.requiredInput) } : {}),
    decidedAt: row.decidedAt.toISOString(),
  };
}

// ---------- SLA recompute (pure engine call) + owner lookup ----------

/** Recompute the statutory clock against a given `now` (the demo clock). */
export function recomputeSla(args: {
  applicationId: string;
  startedAt: Date;
  now: Date;
  workingDaysAllowed: number;
  outcome: Outcome;
  currentOwner?: string;
}): SlaState {
  return evaluateSla({
    applicationId: args.applicationId,
    startedAt: args.startedAt,
    now: args.now,
    isSamadhanEkDin: args.workingDaysAllowed === 1,
    outcome: args.outcome,
    currentOwner: args.currentOwner,
  });
}

/** The officer who holds a flagged file — their name appears on the breach
 *  appeal and in the officer queue (Spec §10). Falls back to any Patwari. */
export async function ownerNameFor(tehsil: string): Promise<string | undefined> {
  const officer =
    (await db.officer.findFirst({ where: { role: "PATWARI", tehsil } })) ??
    (await db.officer.findFirst({ where: { role: "PATWARI" } }));
  return officer ? `${officer.name} (${officer.role})` : undefined;
}
