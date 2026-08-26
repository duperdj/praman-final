// GET /api/dashboard/list?bucket=<bucket> — the real applications behind each
// dashboard stat tile, so a staff user can click a number and see exactly which
// cases it counts. Buckets: total | autoIssue | running | breached | penalty.
// Reads only; SLA is the persisted value (kept current by POST /api/dev/tick),
// matching the tile counts. All synthetic.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Bucket = "total" | "autoIssue" | "running" | "breached" | "penalty";
const BUCKETS: Bucket[] = ["total", "autoIssue", "running", "breached", "penalty"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const bucket = (url.searchParams.get("bucket") ?? "total") as Bucket;
  if (!BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: `Unknown bucket. Use one of: ${BUCKETS.join(", ")}` }, { status: 400 });
  }

  const rows = await db.application.findMany({
    include: { decision: true, sla: true, applicant: true },
    orderBy: { submittedAt: "desc" },
  });

  const filtered = rows.filter((r) => {
    switch (bucket) {
      case "autoIssue": return r.decision?.outcome === "AUTO_ISSUE";
      case "running": return r.sla?.status === "RUNNING";
      case "breached": return r.sla?.status === "BREACHED";
      case "penalty": return (r.sla?.penaltyAccruedInr ?? 0) > 0;
      case "total":
      default: return true;
    }
  });

  const items = filtered.map((r) => ({
    id: r.id,
    name: r.applicant.fullName,
    tehsil: r.applicant.tehsil,
    district: r.applicant.district,
    serviceType: r.serviceType ?? "income-certificate",
    outcome: r.decision?.outcome ?? null,
    slaStatus: r.sla?.status ?? null,
    workingDaysElapsed: r.sla?.workingDaysElapsed ?? 0,
    workingDaysAllowed: r.sla?.workingDaysAllowed ?? 3,
    penaltyInr: r.sla?.penaltyAccruedInr ?? 0,
    dueAt: r.sla?.dueAt ? r.sla.dueAt.toISOString() : null,
    submittedAt: r.submittedAt.toISOString(),
  }));

  return NextResponse.json({ bucket, count: items.length, items });
}
