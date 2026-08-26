// GET /api/officer/queue — the Patwari's work queue: only the FIELD_VERIFY
// applications, each with its signals (why it was flagged), its live SLA clock,
// and the officer who currently holds it (Spec §6/§10 — targeted human review).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { demoNow } from "../../_lib/clock";
import {
  mapApplication,
  mapDecision,
  recomputeSla,
  ownerNameFor,
} from "../../_lib/store";

export async function GET() {
  const rows = await db.application.findMany({
    where: { decision: { is: { outcome: "FIELD_VERIFY" } } },
    include: {
      applicant: true,
      decision: { include: { signals: true } },
      sla: true,
    },
    orderBy: { submittedAt: "asc" },
  });

  const now = await demoNow();
  const queue = [];

  for (const row of rows) {
    if (!row.decision || !row.sla) continue;
    // Terminal cases (an officer already decided) drop off the queue.
    if (row.sla.status === "MET" || row.sla.status === "CLOSED") continue;
    const application = mapApplication(row);
    const decision = mapDecision(row.decision);
    const currentOwner = await ownerNameFor(application.applicant.tehsil);
    const sla = recomputeSla({
      applicationId: row.id,
      startedAt: row.sla.startedAt,
      now,
      workingDaysAllowed: row.sla.workingDaysAllowed,
      outcome: decision.outcome,
      currentOwner,
    });
    queue.push({ application, decision, sla, currentOwner: currentOwner ?? null });
  }

  return NextResponse.json({ count: queue.length, queue });
}
