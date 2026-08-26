import type { Application, RegistrySnapshot, Signal } from "../contracts";

export type RuleKind = "soft" | "blocking" | "hard";

export interface RuleResult {
  kind: RuleKind;
  signal: Signal;
  requiredInput?: Signal["reason"];
}

const WEIGHTS = {
  RATION_CONTRADICTION: 100,
  PRIOR_SWING: 25,
  LAND_VS_INCOME: 30,
  THRESHOLD_HUGGING: 20,
  EKYC_STALE: 0,
  IDENTITY_MISMATCH: 0,
  DUPLICATE_ACTIVE: 0,
  SOURCE_INCOMPLETE: 20,
} as const;

function result(
  ruleId: keyof typeof WEIGHTS,
  kind: RuleKind,
  reason: Signal["reason"],
  meta: Record<string, unknown>,
  requiredInput?: Signal["reason"]
): RuleResult {
  return {
    kind,
    signal: {
      ruleId,
      severity: kind === "soft" ? "WARN" : "BLOCK",
      weightedScore: WEIGHTS[ruleId],
      reason,
      meta,
    },
    requiredInput,
  };
}

function purposeCutoff(purpose: string): { purpose: "EWS" | "SCHOLARSHIP"; cutoff: number } | undefined {
  const normalized = purpose.toLocaleLowerCase("en-IN");
  if (/\bews\b|e\.w\.s|आर्थिक\s*रूप\s*से\s*कमजोर/.test(normalized)) {
    return { purpose: "EWS", cutoff: 800_000 };
  }
  if (/scholarship|छात्रवृत्ति/.test(normalized)) {
    return { purpose: "SCHOLARSHIP", cutoff: 250_000 };
  }
  return undefined;
}

export function runRules(application: Application, snapshot: RegistrySnapshot): RuleResult[] {
  const fired: RuleResult[] = [];
  const stated = application.statedAnnualIncome;
  const cardType = snapshot.ration.cardType;

  /** RATION_CONTRADICTION: rejects income above the BPL band for AAY/BPL cards. */
  if ((cardType === "AAY" || cardType === "BPL") && stated > 100_000) {
    fired.push(result(
      "RATION_CONTRADICTION",
      "hard",
      {
        hi: `${cardType} राशन कार्ड का रिकॉर्ड है, लेकिन घोषित वार्षिक आय ₹${stated} BPL सीमा ₹100000 से अधिक है।`,
        en: `The registry shows a ${cardType} ration card, but the declared annual income of INR ${stated} exceeds the INR 100000 BPL ceiling.`,
      },
      { cardType, statedAnnualIncome: stated, bplBandCeiling: 100_000 }
    ));
  }

  const prior = snapshot.priorCertificate.lastYearDeclaredIncome;
  /** PRIOR_SWING: flags a change greater than 40% from last year's income. */
  if (prior != null) {
    const ratio = prior === 0 ? (stated === 0 ? 0 : 1) : Math.abs(stated - prior) / prior;
    if (ratio > 0.4) {
      fired.push(result(
        "PRIOR_SWING",
        "soft",
        {
          hi: `घोषित आय पिछले प्रमाण पत्र की आय से ${(ratio * 100).toFixed(1)}% अलग है; क्षेत्रीय सत्यापन आवश्यक है।`,
          en: `The declared income differs from last year's certificate by ${(ratio * 100).toFixed(1)}%; field verification is required.`,
        },
        { statedAnnualIncome: stated, lastYearDeclaredIncome: prior, differenceRatio: ratio }
      ));
    }
  }

  const land = snapshot.land;
  /** LAND_VS_INCOME: flags known land income over 150% of declared income. */
  if (land.hasHoldings === true && land.estAnnualIncome != null && land.estAnnualIncome > stated * 1.5) {
    fired.push(result(
      "LAND_VS_INCOME",
      "soft",
      {
        hi: `भूमि रिकॉर्ड से अनुमानित वार्षिक आय ₹${land.estAnnualIncome} घोषित आय ₹${stated} से काफी अधिक है।`,
        en: `Estimated annual land income of INR ${land.estAnnualIncome} is substantially higher than the declared INR ${stated}.`,
      },
      {
        hasHoldings: land.hasHoldings,
        holdingHectares: land.holdingHectares,
        estimatedAnnualIncome: land.estAnnualIncome,
        statedAnnualIncome: stated,
        comparisonMultiplier: 1.5,
      }
    ));
  }

  const cutoff = purposeCutoff(application.purpose);
  /** THRESHOLD_HUGGING: flags income in the 2% band immediately below a known cutoff. */
  if (cutoff && stated >= cutoff.cutoff * 0.98 && stated < cutoff.cutoff) {
    fired.push(result(
      "THRESHOLD_HUGGING",
      "soft",
      {
        hi: `घोषित आय ${cutoff.purpose} की ₹${cutoff.cutoff} सीमा से 2% के भीतर ठीक नीचे है।`,
        en: `The declared income is just below and within 2% of the INR ${cutoff.cutoff} ${cutoff.purpose} cutoff.`,
      },
      { purpose: cutoff.purpose, purposeText: application.purpose, cutoff: cutoff.cutoff, statedAnnualIncome: stated }
    ));
  }

  const ekycAge = snapshot.samagra.ekycAgeMonths ?? 0;
  /** EKYC_STALE: blocks missing eKYC or eKYC older than 12 months. */
  if (snapshot.samagra.ekycStatus === "MISSING" || ekycAge > 12) {
    fired.push(result(
      "EKYC_STALE",
      "blocking",
      {
        hi: "समग्र e-KYC उपलब्ध नहीं है या 12 महीने से पुराना है, इसलिए आवेदन अभी आगे नहीं बढ़ सकता।",
        en: "Samagra eKYC is missing or older than 12 months, so the application cannot proceed yet.",
      },
      { ekycStatus: snapshot.samagra.ekycStatus, ekycAgeMonths: snapshot.samagra.ekycAgeMonths, maximumAgeMonths: 12 },
      {
        hi: "समग्र पोर्टल या अधिकृत केंद्र पर अपना e-KYC अपडेट करें और फिर आवेदन दोबारा भेजें।",
        en: "Update your Samagra eKYC on the Samagra portal or at an authorised centre, then resubmit the application.",
      }
    ));
  }

  const { nameMatch, ageMatch } = snapshot.aadhaar;
  /** IDENTITY_MISMATCH: blocks a name or date-of-birth mismatch. */
  if (nameMatch === false || ageMatch === false) {
    const mismatches = [nameMatch === false ? "name" : undefined, ageMatch === false ? "dateOfBirth" : undefined].filter(Boolean);
    fired.push(result(
      "IDENTITY_MISMATCH",
      "blocking",
      {
        hi: "आधार और समग्र रिकॉर्ड में नाम या जन्मतिथि मेल नहीं खाती।",
        en: "The name or date of birth does not match between the Aadhaar and Samagra records.",
      },
      { nameMatch, ageMatch, mismatchedFields: mismatches },
      {
        hi: "आधार या समग्र में गलत नाम/जन्मतिथि सुधारें ताकि दोनों रिकॉर्ड मेल खाएँ, फिर आवेदन दोबारा भेजें।",
        en: "Correct the name or date of birth in Aadhaar or Samagra so both records match, then resubmit the application.",
      }
    ));
  }

  /** DUPLICATE_ACTIVE: blocks a second application while a certificate remains valid. */
  if (snapshot.priorCertificate.hasUnexpiredThisYear === true) {
    fired.push(result(
      "DUPLICATE_ACTIVE",
      "blocking",
      {
        hi: "इस परिवार के लिए इस वर्ष का एक वैध, अभी समाप्त न हुआ आय प्रमाण पत्र पहले से मौजूद है।",
        en: "An unexpired income certificate for this family already exists for this year.",
      },
      { hasUnexpiredThisYear: true, lastCertifiedAt: snapshot.priorCertificate.lastCertifiedAt },
      {
        hi: "मौजूदा वैध प्रमाण पत्र का उपयोग करें; यदि रिकॉर्ड गलत है तो उसे रद्द या सही करवाकर फिर आवेदन करें।",
        en: "Use the existing valid certificate; if the record is wrong, have it cancelled or corrected before reapplying.",
      }
    ));
  }

  /** SOURCE_INCOMPLETE: flags land holdings when agriculture is not declared. */
  if (land.hasHoldings === true && application.incomeSource !== "AGRICULTURE") {
    fired.push(result(
      "SOURCE_INCOMPLETE",
      "soft",
      {
        hi: "भूमि रिकॉर्ड में कृषि भूमि है, लेकिन घोषित आय स्रोत में कृषि शामिल नहीं है।",
        en: "The land registry shows agricultural holdings, but agriculture is not the declared income source.",
      },
      { hasHoldings: true, holdingHectares: land.holdingHectares, declaredIncomeSource: application.incomeSource }
    ));
  }

  return fired;
}
