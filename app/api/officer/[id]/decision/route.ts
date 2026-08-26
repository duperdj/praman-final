// POST /api/officer/:id/decision — an officer clears a FIELD_VERIFY case.
// Lane B addition (approve / return-with-reason) — the queue route was read-only.
// approve → SLA status MET + mint the Certificate; reject → SLA CLOSED.
// Body: { approve: boolean, note?: string }. All synthetic; demo-only.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { approve?: boolean; note?: string } = {};
  try {
    body = (await req.json()) as { approve?: boolean; note?: string };
  } catch {
    /* empty body defaults to approve */
  }
  const approve = body.approve !== false;

  const app = await db.application.findUnique({
    where: { id },
    include: { decision: true, sla: true, certificate: true },
  });
  if (!app || !app.decision || !app.sla) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const nextStatus = approve ? "MET" : "CLOSED";
  await db.slaState.update({ where: { applicationId: id }, data: { status: nextStatus } });
  await db.slaEvent.create({ data: { applicationId: id, type: approve ? "RESUMED" : "WARNED", at: new Date() } });

  if (approve && !app.certificate) {
    const issuedAt = new Date(app.submittedAt);
    const expiresAt = new Date(issuedAt);
    expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);
    await db.certificate.create({
      data: {
        number: `MP-AY-${issuedAt.getUTCFullYear()}-${id.slice(0, 8).toUpperCase()}`,
        applicationId: id,
        issuedAt,
        expiresAt,
        signature: `MOCK-SEAL-${id.slice(0, 12)}`,
      },
    });
  }

  return NextResponse.json({ ok: true, applicationId: id, status: nextStatus, approved: approve, note: body.note ?? null });
}
