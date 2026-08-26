// POST /api/applications/:id/resolve — the citizen supplies the ONE missing
// thing a NEEDS_INPUT decision asked for (fresh eKYC, corrected identity, …) and
// we re-check ONLY that — no re-filling the whole form. We re-fetch the registry
// snapshot, clear the specific blocking dimension(s) the citizen just fixed,
// re-run the same engine, and update the decision + resume the clock in place.
// All synthetic (demo): "providing the fix" clears the flagged registry field.
import { NextResponse } from "next/server";
import type { RegistrySnapshot } from "@/lib/contracts";
import { configFor } from "@/components/catalog";
import { db } from "@/lib/db";
import { getProvider } from "../../../services/_lib/adapters";
import { evaluateService } from "../../../services/_lib/engine";
import { demoNow } from "../../../_lib/clock";
import { mapApplication, recomputeSla, ownerNameFor, updateDecision } from "../../../_lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // The corrected value(s) the citizen typed — recorded for the audit trail.
  // In this synthetic build their presence is what "clears" the flagged field.
  let corrections: Record<string, string> = {};
  try {
    const body = (await req.json()) as { corrections?: Record<string, string> } | null;
    if (body?.corrections && typeof body.corrections === "object") corrections = body.corrections;
  } catch {
    /* empty body → treat as "I've fixed it, re-check" */
  }

  const row = await db.application.findUnique({
    where: { id },
    include: { applicant: true, decision: { include: { signals: true } }, sla: true },
  });
  if (!row || !row.decision || !row.sla) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  if (row.decision.outcome !== "NEEDS_INPUT") {
    return NextResponse.json({ error: "Nothing to resolve — this application is not awaiting citizen input." }, { status: 409 });
  }

  const application = mapApplication(row);
  const now = await demoNow();

  // Which blocking rules fired → clear exactly those registry dimensions.
  const fired = new Set(row.decision.signals.map((s) => s.ruleId));
  const base = await getProvider().snapshot(application.applicant, now);
  const snapshot: RegistrySnapshot = { ...base, fetchedAt: now.toISOString() };

  if (fired.has("EKYC_STALE")) {
    snapshot.samagra = { ...snapshot.samagra, status: "MATCH", ekycStatus: "PRESENT", ekycAgeMonths: 0, ekycUpdatedAt: now.toISOString() };
  }
  if (fired.has("IDENTITY_MISMATCH")) {
    snapshot.aadhaar = { ...snapshot.aadhaar, status: "MATCH", nameMatch: true, ageMatch: true };
  }
  if (fired.has("DUPLICATE_ACTIVE")) {
    snapshot.priorCertificate = { ...snapshot.priorCertificate, status: "MATCH", hasUnexpiredThisYear: false };
  }

  const cfg = configFor(row.serviceType ?? "income-certificate");
  const form: Record<string, string> = row.formData ? JSON.parse(row.formData) : {};

  const decision = evaluateService(cfg, application, form, snapshot, now);

  // Clock resumes from the moment the correction lands (paused time never counts).
  const currentOwner = decision.outcome === "FIELD_VERIFY" ? await ownerNameFor(application.applicant.tehsil) : undefined;
  const sla = recomputeSla({
    applicationId: application.id,
    startedAt: now,
    now,
    workingDaysAllowed: row.sla.workingDaysAllowed,
    outcome: decision.outcome,
    currentOwner,
  });

  await updateDecision(application, decision, sla);

  const resolved = decision.outcome !== "NEEDS_INPUT";
  return NextResponse.json({
    resolved,
    correctionsReceived: Object.keys(corrections),
    application,
    decision,
    sla,
    registry: snapshot,
    serviceType: row.serviceType ?? "income-certificate",
  });
}
