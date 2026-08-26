// Zod schema for POST /api/applications. Validates the frozen-contract
// Application/Applicant fields plus two API-level SLA flags (isUrban,
// isSamadhanEkDin) that the contract deliberately keeps off Application — the
// SLA functions take them separately (see lib/engine/ENGINE_NOTES.md).
import { z } from "zod";
import type { Application, Applicant } from "@/lib/contracts";

const incomeSource = z.enum([
  "SALARY",
  "AGRICULTURE",
  "BUSINESS",
  "DAILY_WAGE",
  "PENSION",
  "OTHER",
]);

const applicantSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/, "phone must be 10 digits"),
  aadhaarLike: z.string().regex(/^\d{12}$/, "aadhaarLike must be 12 digits"),
  samagraId: z.string().min(1),
  dateOfBirth: z.string().min(1), // ISO date
  district: z.string().min(1),
  tehsil: z.string().min(1),
  addressLine: z.string().min(1),
});

export const createApplicationSchema = z.object({
  applicant: applicantSchema,
  statedAnnualIncome: z.number().int().nonnegative(),
  incomeSource,
  purpose: z.string().min(1),
  lang: z.enum(["hi", "en"]).default("hi"),
  // SLA flags — optional, default to the standard 3-working-day track.
  isUrban: z.boolean().optional(),
  isSamadhanEkDin: z.boolean().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// Assert the shapes line up with the frozen contract at compile time.
export type _ApplicantOk = Applicant extends z.infer<typeof applicantSchema>
  ? true
  : never;
export type _AppOk = Pick<
  Application,
  "statedAnnualIncome" | "incomeSource" | "purpose" | "lang"
> extends Pick<
  CreateApplicationInput,
  "statedAnnualIncome" | "incomeSource" | "purpose" | "lang"
>
  ? true
  : never;
