// GET /api/dashboard — public accountability stats (Spec §6 / Phase 6).
// Lane B addition: aggregates the seeded applications into the numbers the Ops
// dashboard shows — outcome mix, live clocks, breaches, penalties, and breach
// counts by tehsil. Reads only; all synthetic.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rows = await db.application.findMany({
    include: { decision: true, sla: true, applicant: true },
  });

  let autoIssue = 0, fieldVerify = 0, needsInput = 0, reject = 0;
  let running = 0, breached = 0, met = 0, penaltyInr = 0;
  const breachByTehsil: Record<string, number> = {};

  for (const r of rows) {
    switch (r.decision?.outcome) {
      case "AUTO_ISSUE": autoIssue++; break;
      case "FIELD_VERIFY": fieldVerify++; break;
      case "NEEDS_INPUT": needsInput++; break;
      case "REJECT": reject++; break;
    }
    if (r.sla) {
      if (r.sla.status === "RUNNING") running++;
      else if (r.sla.status === "BREACHED") breached++;
      else if (r.sla.status === "MET") met++;
      penaltyInr += r.sla.penaltyAccruedInr ?? 0;
      if (r.sla.status === "BREACHED") {
        const t = r.applicant.tehsil || "—";
        breachByTehsil[t] = (breachByTehsil[t] ?? 0) + 1;
      }
    }
  }

  const total = rows.length;
  const byTehsil = Object.entries(breachByTehsil)
    .map(([tehsil, count]) => ({ tehsil, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return NextResponse.json({
    total,
    autoIssue,
    fieldVerify,
    needsInput,
    reject,
    running,
    breached,
    met,
    penaltyInr,
    byTehsil,
    autoIssueRate: total ? Math.round((autoIssue / total) * 100) : 0,
  });
}
