// POST /api/services/:slug/apply — the ONE apply endpoint for every service.
// Validates against the service config, fetches the registry snapshot through
// the swappable adapter, runs the one engine (income → Lane A's 8-rule engine,
// others → config strategy), computes the statutory clock, persists into the
// single Application table, and returns { application, decision, sla }.
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Application, IncomeSource } from "@/lib/contracts";
import { configFor, hasApplyFlow } from "@/components/catalog";
import { getProvider } from "../../_lib/adapters";
import { evaluateService } from "../../_lib/engine";
import { demoNow } from "../../../_lib/clock";
import { recomputeSla, ownerNameFor, persistApplication } from "../../../_lib/store";

const applicantSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/, "phone must be 10 digits"),
  aadhaarLike: z.string().regex(/^\d{12}$/, "aadhaarLike must be 12 digits"),
  samagraId: z.string().min(1),
  dateOfBirth: z.string().min(1),
  district: z.string().min(1),
  tehsil: z.string().min(1),
  addressLine: z.string().min(1),
});

const INCOME_SOURCES = ["SALARY", "AGRICULTURE", "BUSINESS", "DAILY_WAGE", "PENSION", "OTHER"];

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasApplyFlow(slug)) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  }
  const cfg = configFor(slug);

  let body: { applicant?: unknown; form?: Record<string, string>; lang?: "hi" | "en"; isSamadhanEkDin?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const applicantParsed = applicantSchema.safeParse(body.applicant);
  if (!applicantParsed.success) {
    return NextResponse.json({ error: "Applicant validation failed", issues: applicantParsed.error.flatten() }, { status: 400 });
  }
  const applicant = applicantParsed.data;
  const form: Record<string, string> = body.form ?? {};
  const lang = body.lang === "en" ? "en" : "hi";

  // Required service fields present (and numeric fields positive).
  for (const f of cfg.fields) {
    if (!f.required) continue;
    const v = (form[f.name] ?? "").toString().trim();
    if (!v) return NextResponse.json({ error: `Missing required field: ${f.name}` }, { status: 400 });
    if ((f.type === "money" || f.type === "number") && !(Number(v) > 0)) {
      return NextResponse.json({ error: `Field ${f.name} must be greater than 0` }, { status: 400 });
    }
  }

  const now = await demoNow();
  const statedAnnualIncome = Number(form.annualIncome ?? 0) || 0;
  const incomeSource: IncomeSource = INCOME_SOURCES.includes(form.incomeSource) ? (form.incomeSource as IncomeSource) : "OTHER";

  const application: Application = {
    id: crypto.randomUUID(),
    applicant,
    statedAnnualIncome,
    incomeSource,
    purpose: form.purpose || cfg.certTitle.en,
    submittedAt: now.toISOString(),
    lang,
  };

  const snapshot = await getProvider().snapshot(applicant, now);
  const decision = evaluateService(cfg, application, form, snapshot, now);

  const currentOwner = decision.outcome === "FIELD_VERIFY" ? await ownerNameFor(applicant.tehsil) : undefined;
  const sla = recomputeSla({
    applicationId: application.id,
    startedAt: now,
    now,
    workingDaysAllowed: body.isSamadhanEkDin ? 1 : cfg.slaDays,
    outcome: decision.outcome,
    currentOwner,
  });

  await persistApplication(application, decision, sla, { serviceType: slug, formData: JSON.stringify(form) });

  return NextResponse.json({ application, decision, sla }, { status: 201 });
}
