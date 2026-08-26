// POST /api/dev/tick — dev-only demo control that advances the statutory clock.
// Body (all optional): { days?: number, reset?: boolean }. Default advances by
// 1 working day. Recomputes + persists the SLA for every still-running
// application and writes a BREACHED SlaEvent the first time a clock overruns —
// so the countdown visibly moves and can breach live during the pitch.
import { NextResponse } from "next/server";
import type { Outcome } from "@/lib/contracts";
import { db } from "@/lib/db";
import { advanceWorkingDays, demoNow, resetClock } from "../../_lib/clock";
import { recomputeSla, updateSla, ownerNameFor } from "../../_lib/store";

export async function POST(req: Request) {
  let days = 1;
  let reset = false;
  try {
    const body = (await req.json()) as { days?: number; reset?: boolean } | null;
    if (body && typeof body === "object") {
      if (typeof body.days === "number") days = body.days;
      if (body.reset === true) reset = true;
    }
  } catch {
    /* empty body → advance one working day */
  }

  if (reset) await resetClock();
  else await advanceWorkingDays(days);
  const now = await demoNow();

  const apps = await db.application.findMany({
    include: { decision: true, sla: true, applicant: true },
  });

  const applications: Array<{
    applicationId: string;
    status: string;
    workingDaysElapsed: number;
    penaltyAccruedInr: number;
    newlyBreached: boolean;
  }> = [];

  for (const app of apps) {
    if (!app.decision || !app.sla) continue;
    const prevStatus = app.sla.status;
    // MET / CLOSED are terminal — leave them settled.
    if (prevStatus === "MET" || prevStatus === "CLOSED") continue;

    const outcome = app.decision.outcome as Outcome;
    const currentOwner =
      outcome === "FIELD_VERIFY"
        ? await ownerNameFor(app.applicant.tehsil)
        : undefined;

    const sla = recomputeSla({
      applicationId: app.id,
      startedAt: app.sla.startedAt,
      now,
      workingDaysAllowed: app.sla.workingDaysAllowed,
      outcome,
      currentOwner,
    });
    await updateSla(sla);

    const newlyBreached = sla.status === "BREACHED" && prevStatus !== "BREACHED";
    if (newlyBreached) {
      await db.slaEvent.create({
        data: {
          applicationId: app.id,
          type: "BREACHED",
          at: new Date(sla.breachedAt ?? sla.dueAt),
        },
      });
    }

    applications.push({
      applicationId: app.id,
      status: sla.status,
      workingDaysElapsed: sla.workingDaysElapsed,
      penaltyAccruedInr: sla.penaltyAccruedInr,
      newlyBreached,
    });
  }

  return NextResponse.json({
    now: now.toISOString(),
    advancedWorkingDays: reset ? 0 : days,
    reset,
    recomputed: applications.length,
    applications,
  });
}
