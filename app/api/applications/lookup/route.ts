// GET /api/applications/lookup?phone=XXXXXXXXXX — find a citizen's applications
// by their (OTP-verified) phone number, for the Track flow. Lane B addition;
// reads only. Returns a light list, newest first.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = (url.searchParams.get("phone") ?? "").replace(/\D/g, "");
  if (phone.length < 10) {
    return NextResponse.json({ error: "phone must be 10 digits" }, { status: 400 });
  }
  const rows = await db.application.findMany({
    where: { applicant: { is: { phone } } },
    include: { applicant: true, decision: true, sla: true },
    orderBy: { submittedAt: "desc" },
  });
  const results = rows.map((r) => ({
    id: r.id,
    fullName: r.applicant.fullName,
    purpose: r.purpose,
    submittedAt: r.submittedAt.toISOString(),
    outcome: r.decision?.outcome ?? null,
    slaStatus: r.sla?.status ?? null,
  }));
  return NextResponse.json({ count: results.length, results });
}
