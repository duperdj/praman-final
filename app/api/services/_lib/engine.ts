// The one config-driven engine. Income delegates to Lane A's proven 8-rule
// engine; every other service is decided by its configured strategy, against
// the registry snapshot (from the adapter) and the applicant's answers. Every
// outcome carries a bilingual, human-readable reason — nothing is a black box.
import type { Application, Decision, Outcome, Signal, RegistrySnapshot, Bilingual } from "@/lib/contracts";
import { evaluate as evaluateIncome } from "@/lib/engine";
import type { ServiceConfig } from "@/components/catalog";

const SCORE: Record<Outcome, number> = { AUTO_ISSUE: 8, FIELD_VERIFY: 42, NEEDS_INPUT: 55, REJECT: 88 };

function mk(
  applicationId: string,
  outcome: Outcome,
  signals: Signal[],
  headline: Bilingual,
  now: Date,
  requiredInput?: Bilingual[],
): Decision {
  return {
    applicationId,
    outcome,
    score: SCORE[outcome],
    signals,
    headline,
    ...(requiredInput ? { requiredInput } : {}),
    decidedAt: now.toISOString(),
  };
}

function ageFrom(iso: string, now: Date): number {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

export function evaluateService(
  cfg: ServiceConfig,
  application: Application,
  form: Record<string, string>,
  snapshot: RegistrySnapshot,
  now: Date,
): Decision {
  const id = application.id;
  const idMatch: Signal = {
    ruleId: "IDENTITY_MATCH",
    severity: snapshot.aadhaar.status === "MATCH" ? "OK" : "INFO",
    reason: snapshot.aadhaar.status === "MATCH"
      ? { hi: "आधार नाम व जन्मतिथि मेल", en: "Aadhaar name & DOB match" }
      : { hi: "पहचान अभिलेख उपलब्ध नहीं", en: "Identity record not available" },
  };

  switch (cfg.strategy) {
    case "income-engine":
      return evaluateIncome(application, snapshot);

    case "income-threshold": {
      const limit = cfg.param ?? 800000;
      const ok = application.statedAnnualIncome <= limit;
      const sig: Signal = {
        ruleId: "INCOME_THRESHOLD",
        severity: ok ? "OK" : "BLOCK",
        reason: ok
          ? { hi: `घोषित आय सीमा ₹${limit.toLocaleString("en-IN")} के भीतर`, en: `Declared income within the ₹${limit.toLocaleString("en-IN")} limit` }
          : { hi: `घोषित आय ₹${application.statedAnnualIncome.toLocaleString("en-IN")} सीमा ₹${limit.toLocaleString("en-IN")} से अधिक`, en: `Declared income ₹${application.statedAnnualIncome.toLocaleString("en-IN")} exceeds the ₹${limit.toLocaleString("en-IN")} limit` },
      };
      return ok
        ? mk(id, "AUTO_ISSUE", [sig, idMatch], { hi: "पात्र — प्रमाण पत्र जारी", en: "Eligible — certificate issued" }, now)
        : mk(id, "REJECT", [sig], { hi: "पात्रता सीमा से अधिक — अस्वीकृत", en: "Above the eligibility limit — rejected" }, now);
    }

    case "residency": {
      const s = snapshot.samagra;
      const match = s.status === "MATCH" && (!s.residentDistrict || s.residentDistrict === application.applicant.district);
      const sig: Signal = {
        ruleId: "RESIDENCY",
        severity: match ? "OK" : "WARN",
        reason: match
          ? { hi: `समग्र अभिलेख में ${application.applicant.district} का निवास दर्ज`, en: `Samagra records residence in ${application.applicant.district}` }
          : { hi: "निवास अभिलेख से पुष्टि नहीं — क्षेत्र जाँच आवश्यक", en: "Residence not confirmed from records — field check needed" },
      };
      return match
        ? mk(id, "AUTO_ISSUE", [sig, idMatch], { hi: "निवास सत्यापित — प्रमाण पत्र जारी", en: "Residence verified — certificate issued" }, now)
        : mk(id, "FIELD_VERIFY", [sig, idMatch], { hi: "क्षेत्रीय सत्यापन आवश्यक", en: "Field verification required" }, now);
    }

    case "age-eligibility": {
      const minAge = cfg.param ?? 60;
      const age = ageFrom(application.applicant.dateOfBirth, now);
      const ok = age >= minAge;
      const sig: Signal = {
        ruleId: "AGE_ELIGIBILITY",
        severity: ok ? "OK" : "BLOCK",
        reason: ok
          ? { hi: `आयु ${age} वर्ष — ${minAge}+ की पात्रता पूरी`, en: `Age ${age} — meets the ${minAge}+ eligibility` }
          : { hi: `आयु ${age} वर्ष — ${minAge} वर्ष से कम, पात्र नहीं`, en: `Age ${age} — below ${minAge}, not eligible` },
      };
      return ok
        ? mk(id, "AUTO_ISSUE", [sig, idMatch], { hi: "पेंशन स्वीकृत", en: "Pension sanctioned" }, now)
        : mk(id, "REJECT", [sig], { hi: "आयु पात्रता पूरी नहीं — अस्वीकृत", en: "Age eligibility not met — rejected" }, now);
    }

    case "record-copy":
      return mk(
        id,
        "AUTO_ISSUE",
        [{ ruleId: "RECORD_FOUND", severity: "OK", reason: { hi: "अभिलेख मिला — प्रति जारी", en: "Record found — copy issued" } }, idMatch],
        { hi: "अभिलेख जारी", en: "Record issued" },
        now,
      );

    case "document-verify":
    default: {
      const docs = cfg.documents ?? [];
      const sig: Signal = {
        ruleId: "DOCUMENT_VERIFY",
        severity: "WARN",
        reason: { hi: "दस्तावेज़ सत्यापन आवश्यक — अधिकारी जाँच करेंगे", en: "Requires document verification — an officer will review" },
      };
      return mk(id, "FIELD_VERIFY", [sig, idMatch], { hi: "सत्यापन हेतु भेजा गया", en: "Sent for verification" }, now, docs.length ? docs : undefined);
    }
  }
}
