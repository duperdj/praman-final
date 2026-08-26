import type { Application, Decision, EvaluateFn, Outcome, RegistrySnapshot } from "../contracts";
import { runRules } from "./rules";

const HEADLINES: Record<Outcome, Decision["headline"]> = {
  AUTO_ISSUE: {
    hi: "जाँच पूरी हुई — प्रमाण पत्र स्वतः जारी किया जा सकता है।",
    en: "Checks complete — the certificate can be issued automatically.",
  },
  FIELD_VERIFY: {
    hi: "क्षेत्रीय सत्यापन आवश्यक है — कारण नीचे दिए गए हैं।",
    en: "Field verification is required — the reasons are listed below.",
  },
  NEEDS_INPUT: {
    hi: "आवेदन आगे बढ़ाने के लिए आपकी कार्रवाई आवश्यक है।",
    en: "Your action is required before the application can proceed.",
  },
  REJECT: {
    hi: "रिकॉर्ड में ठोस विरोधाभास के कारण आवेदन अस्वीकृत हुआ।",
    en: "The application was rejected because the records contain a hard contradiction.",
  },
};

export const evaluate: EvaluateFn = (
  application: Application,
  snapshot: RegistrySnapshot
): Decision => {
  const results = runRules(application, snapshot);
  const rawScore = results.reduce(
    (total, finding) => total + (finding.signal.weightedScore ?? 0),
    0
  );
  const hasHard = results.some((finding) => finding.kind === "hard");
  const hasBlocking = results.some((finding) => finding.kind === "blocking");
  const score = hasHard ? 100 : Math.min(60, rawScore);

  let outcome: Outcome;
  if (hasHard) outcome = "REJECT";
  else if (hasBlocking) outcome = "NEEDS_INPUT";
  else if (score >= 20) outcome = "FIELD_VERIFY";
  else outcome = "AUTO_ISSUE";

  const requiredInput = outcome === "NEEDS_INPUT"
    ? results.flatMap((finding) => finding.requiredInput ? [finding.requiredInput] : [])
    : undefined;

  return {
    applicationId: application.id,
    outcome,
    score,
    signals: results.map((finding) => finding.signal),
    headline: HEADLINES[outcome],
    ...(requiredInput && requiredInput.length > 0 ? { requiredInput } : {}),
    // The registry read is the engine's decision instant. Using it keeps the
    // two-argument EvaluateFn deterministic and avoids consulting wall time.
    decidedAt: new Date(snapshot.fetchedAt).toISOString(),
  };
};

export { runRules } from "./rules";
