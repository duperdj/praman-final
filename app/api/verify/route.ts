// POST /api/verify — the downstream "certificate as data" endpoint (Spec §11,
// persona 5). A consumer (e.g. a scholarship portal) asks a threshold question
// against a citizen's certificate and gets back a SIGNED yes/no — no PDF, and
// no disclosure of the actual income (data minimisation). Lane B addition.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  let body: { phone?: string; applicationId?: string; threshold?: number } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const threshold = Number(body.threshold);
  if (!Number.isFinite(threshold) || threshold <= 0) {
    return NextResponse.json({ error: "threshold must be a positive number" }, { status: 400 });
  }

  const app = body.applicationId
    ? await db.application.findUnique({ where: { id: body.applicationId }, include: { applicant: true, decision: true } })
    : body.phone
      ? await db.application.findFirst({
          where: { applicant: { is: { phone: body.phone.replace(/\D/g, "") } } },
          include: { applicant: true, decision: true },
          orderBy: { submittedAt: "desc" },
        })
      : null;

  if (!app) return NextResponse.json({ error: "No certificate found for that citizen" }, { status: 404 });

  const issued = app.decision?.outcome === "AUTO_ISSUE";
  const belowThreshold = app.statedAnnualIncome <= threshold;
  const reference = `MP-AY-${new Date(app.submittedAt).getUTCFullYear()}-${app.id.slice(0, 8).toUpperCase()}`;
  // Synthetic signature over the answer (a real deployment would sign this).
  const signed = `PRAMAN.v1.${reference}.${belowThreshold ? "YES" : "NO"}.MOCK-SEAL-${app.id.slice(0, 12)}`;

  return NextResponse.json({
    reference,
    certified: issued,
    question: `annualIncome <= ${threshold}`,
    answer: belowThreshold,
    holderName: app.applicant.fullName,
    signed,
    note: "Signed yes/no only — the actual income is never disclosed.",
  });
}
