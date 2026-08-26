// GET /api/applications/:id — the status page payload.
// Returns { application, decision, sla, registry }. The SLA is recomputed
// against the current demo clock so the statutory countdown is always live
// (it reflects any POST /api/dev/tick without a re-submit).
import { NextResponse } from "next/server";
import { fetchSnapshot } from "@/lib/registries";
import { db } from "@/lib/db";
import { demoNow } from "../../_lib/clock";
import {
  mapApplication,
  mapDecision,
  recomputeSla,
  ownerNameFor,
} from "../../_lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const row = await db.application.findUnique({
    where: { id },
    include: {
      applicant: true,
      decision: { include: { signals: true } },
      sla: true,
    },
  });

  if (!row || !row.decision || !row.sla) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const application = mapApplication(row);
  const decision = mapDecision(row.decision);
  const now = await demoNow();

  const currentOwner =
    decision.outcome === "FIELD_VERIFY"
      ? await ownerNameFor(application.applicant.tehsil)
      : undefined;

  // MET / CLOSED are terminal (an officer decided, or the case is settled) —
  // return the persisted clock as-is instead of recomputing, matching how the
  // demo-tick route already leaves MET/CLOSED settled.
  const terminal = row.sla.status === "MET" || row.sla.status === "CLOSED";
  const sla = terminal
    ? {
        applicationId: id,
        startedAt: row.sla.startedAt.toISOString(),
        dueAt: row.sla.dueAt.toISOString(),
        workingDaysAllowed: row.sla.workingDaysAllowed,
        workingDaysElapsed: row.sla.workingDaysElapsed,
        status: row.sla.status as "MET" | "CLOSED",
        penaltyAccruedInr: row.sla.penaltyAccruedInr,
        ...(row.sla.breachedAt ? { breachedAt: row.sla.breachedAt.toISOString() } : {}),
        ...(row.sla.appealDraftHi && row.sla.appealDraftEn
          ? { appealDraft: { hi: row.sla.appealDraftHi, en: row.sla.appealDraftEn } }
          : {}),
      }
    : recomputeSla({
        applicationId: id,
        startedAt: row.sla.startedAt,
        now,
        workingDaysAllowed: row.sla.workingDaysAllowed,
        outcome: decision.outcome,
        currentOwner,
      });

  const registry = fetchSnapshot(application.applicant, now);

  return NextResponse.json({
    application,
    decision,
    sla,
    registry,
    serviceType: row.serviceType ?? "income-certificate",
    formData: row.formData ? JSON.parse(row.formData) : null,
  });
}
