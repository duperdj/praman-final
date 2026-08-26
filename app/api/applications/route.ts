// POST /api/applications — the core citizen submission.
// Validate (Zod) → fetch registry snapshot → evaluate (engine) → compute the
// statutory clock (SLA) → persist everything → return { application, decision,
// sla } in the frozen-contract shape. AUTO_ISSUE also mints a Certificate.
import { NextResponse } from "next/server";
import type { Application } from "@/lib/contracts";
import { fetchSnapshot } from "@/lib/registries";
import { evaluate } from "@/lib/engine";
import { createApplicationSchema } from "../_lib/validation";
import { demoNow } from "../_lib/clock";
import { persistApplication, recomputeSla, ownerNameFor } from "../_lib/store";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;
  const now = await demoNow();

  const application: Application = {
    id: crypto.randomUUID(),
    applicant: input.applicant,
    statedAnnualIncome: input.statedAnnualIncome,
    incomeSource: input.incomeSource,
    purpose: input.purpose,
    submittedAt: now.toISOString(),
    lang: input.lang,
  };

  const snapshot = fetchSnapshot(application.applicant, now);
  const decision = evaluate(application, snapshot);

  const currentOwner =
    decision.outcome === "FIELD_VERIFY"
      ? await ownerNameFor(application.applicant.tehsil)
      : undefined;

  const sla = recomputeSla({
    applicationId: application.id,
    startedAt: now,
    now,
    workingDaysAllowed: input.isSamadhanEkDin ? 1 : 3,
    outcome: decision.outcome,
    currentOwner,
  });

  await persistApplication(application, decision, sla);

  return NextResponse.json({ application, decision, sla }, { status: 201 });
}
