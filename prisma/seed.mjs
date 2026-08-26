// prisma/seed.mjs — Praman DB seed.
// Run via: npx prisma db seed  (or npm run db:reset)
//
// This file is intentionally self-contained (plain ESM, no TypeScript imports)
// so it runs with `node prisma/seed.mjs` without tsx or ts-node.
// Engine rules, SLA calendar, and registry data are inlined from their
// TypeScript sources and kept byte-for-byte identical in logic.
//
// ALL DATA IS SYNTHETIC. Aadhaar-like numbers fail the Verhoeff checksum by design.

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ["error"] });

// Fixed "now" so breach calculations are consistent regardless of when the seed runs.
const SEED_NOW = new Date("2026-08-24T23:59:59.000Z");

// ============================================================
// §1  VERHOEFF  (mirrors lib/registries/verhoeff.ts)
// ============================================================
const VD = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const VP = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
const VI = [0,4,3,2,1,5,6,7,8,9];

function makeSyntheticAadhaar(p11) {
  const digits = p11.split("").map(Number);
  let c = 0;
  for (let i = digits.length - 1; i >= 0; i--) c = VD[c][VP[(digits.length - i) % 8][digits[i]]];
  const validCheck = VI[c];
  const bad = (validCheck + 1) % 10;
  return p11 + String(bad);
}

// ============================================================
// §2  AADHAAR IDs
// ============================================================
const A = {};
[["SUNITA","23456789012"],["RAMESH","34567890123"],["KAMLA","45678901234"],
 ["ARJUN","56789012345"],["GANPAT","67890123456"]].forEach(([k,p]) => { A[k] = makeSyntheticAadhaar(p); });
for (let i = 1; i <= 40; i++) A[`F${String(i).padStart(2,"0")}`] = makeSyntheticAadhaar(String(10000000000 + i));

// ============================================================
// §3  REGISTRY SEEDS  (mirrors lib/registries/seeds.ts)
// ============================================================
const MA = { status:"MATCH", nameMatch:true, ageMatch:true }; // default aadhaar entry

function cSam(fid, district, ekycDate="2025-09-01", ekycAge=11) {
  return { status:"MATCH", familyId:fid, residentDistrict:district,
           ekycStatus:"PRESENT", ekycUpdatedAt:ekycDate, ekycAgeMonths:ekycAge };
}
function cleanReg(fid, district, prevIncome) {
  return { aadhaar:MA, samagra:cSam(fid,district), land:{status:"MATCH",hasHoldings:false},
           ration:{status:"MATCH",cardType:"APL"},
           priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false,lastYearDeclaredIncome:prevIncome,lastCertifiedAt:"2025-09-15"} };
}
function fvReg(fid, district, ha, estIncome, prevIncome) {
  return { aadhaar:MA, samagra:{...cSam(fid,district,"2025-08-01",12)},
           land:{status:"MATCH",hasHoldings:true,holdingHectares:ha,estAnnualIncome:estIncome},
           ration:{status:"MATCH",cardType:"APL"},
           priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false,lastYearDeclaredIncome:prevIncome} };
}
function ekycReg() {
  return { aadhaar:MA, samagra:{status:"MATCH",ekycStatus:"MISSING"},
           land:{status:"NOT_FOUND"}, ration:{status:"MATCH",cardType:"APL"},
           priorCertificate:{status:"NOT_FOUND"} };
}
function rejReg(fid, district, cardType) {
  return { aadhaar:MA, samagra:cSam(fid,district,"2025-10-01",10),
           land:{status:"MATCH",hasHoldings:false},
           ration:{status:"MATCH",cardType},
           priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false} };
}

const REG = new Map([
  [A.SUNITA, { aadhaar:MA,
    samagra:cSam("SAM-FAM-IND-001","Indore","2025-10-15",10),
    land:{status:"MATCH",hasHoldings:false}, ration:{status:"MATCH",cardType:"APL"},
    priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false,lastYearDeclaredIncome:115000,lastCertifiedAt:"2025-09-20"} }],
  [A.RAMESH, { aadhaar:MA,
    samagra:cSam("SAM-FAM-DEW-002","Dewas","2025-11-01",9),
    land:{status:"MATCH",hasHoldings:true,holdingHectares:3.5,estAnnualIncome:250000},
    ration:{status:"MATCH",cardType:"APL"},
    priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false,lastYearDeclaredIncome:76000} }],
  [A.KAMLA, { aadhaar:MA,
    samagra:cSam("SAM-FAM-SEH-003","Sehore","2025-09-01",11),
    land:{status:"MATCH",hasHoldings:true,holdingHectares:2.0,estAnnualIncome:180000},
    ration:{status:"MATCH",cardType:"APL"},
    priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false,lastYearDeclaredIncome:90000} }],
  [A.ARJUN, { aadhaar:MA,
    samagra:{status:"MATCH",familyId:"SAM-FAM-BHO-004",residentDistrict:"Bhopal",
             ekycStatus:"PRESENT",ekycUpdatedAt:"2024-06-15",ekycAgeMonths:26},
    land:{status:"NOT_FOUND"}, ration:{status:"MATCH",cardType:"APL"},
    priorCertificate:{status:"NOT_FOUND"} }],
  [A.GANPAT, { aadhaar:MA,
    samagra:cSam("SAM-FAM-UJJ-005","Ujjain","2025-11-15",9),
    land:{status:"MATCH",hasHoldings:false}, ration:{status:"MATCH",cardType:"AAY"},
    priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false} }],
  // AUTO_ISSUE fillers F01–F12, F14–F15
  [A.F01,cleanReg("SAM-FAM-JAB-F01","Jabalpur",86000)],
  [A.F02,cleanReg("SAM-FAM-GWL-F02","Gwalior",71000)],
  [A.F03,cleanReg("SAM-FAM-REW-F03","Rewa",105000)],
  [A.F04,cleanReg("SAM-FAM-SAT-F04","Satna",81000)],
  [A.F05,cleanReg("SAM-FAM-SAG-F05","Sagar",96000)],
  [A.F06,cleanReg("SAM-FAM-HOS-F06","Hoshangabad",91000)],
  [A.F07,cleanReg("SAM-FAM-NAR-F07","Narsinghpur",125000)],
  [A.F08,cleanReg("SAM-FAM-RAI-F08","Raisen",84000)],
  [A.F09,cleanReg("SAM-FAM-VID-F09","Vidisha",88000)],
  [A.F10,cleanReg("SAM-FAM-MAN-F10","Mandla",74000)],
  [A.F11,cleanReg("SAM-FAM-BAL-F11","Balaghat",100000)],
  [A.F12,cleanReg("SAM-FAM-CHH-F12","Chhindwara",78000)],
  // F13: PRIOR_SWING → FIELD_VERIFY (income 115K vs last-year 55K)
  [A.F13, { aadhaar:MA,
    samagra:cSam("SAM-FAM-KHA-F13","Khandwa","2025-09-01",11),
    land:{status:"MATCH",hasHoldings:false}, ration:{status:"MATCH",cardType:"APL"},
    priorCertificate:{status:"MATCH",hasUnexpiredThisYear:false,lastYearDeclaredIncome:55000,lastCertifiedAt:"2025-09-15"} }],
  [A.F14,cleanReg("SAM-FAM-KHG-F14","Khargone",69000)],
  [A.F15,cleanReg("SAM-FAM-DHA-F15","Dhar",94000)],
  // FIELD_VERIFY fillers F16–F27
  [A.F16,fvReg("SAM-FAM-RAJ-F16","Rajgarh",1.8,150000,67000)],
  [A.F17,fvReg("SAM-FAM-BET-F17","Betul",2.5,200000,62000)],
  [A.F18,fvReg("SAM-FAM-MOR-F18","Morena",2.2,175000,53000)],
  [A.F19,fvReg("SAM-FAM-SHE-F19","Sheopur",3.0,220000,46000)],
  [A.F20,fvReg("SAM-FAM-SHV-F20","Shivpuri",2.4,190000,58000)],
  [A.F21,fvReg("SAM-FAM-DAM-F21","Damoh",2.0,160000,69000)],
  [A.F22,fvReg("SAM-FAM-PAN-F22","Panna",2.8,210000,48000)],
  [A.F23,fvReg("SAM-FAM-TIK-F23","Tikamgarh",2.3,180000,65000)],
  [A.F24,fvReg("SAM-FAM-CHT-F24","Chhatarpur",2.5,195000,43000)],
  [A.F25,fvReg("SAM-FAM-KAT-F25","Katni",2.1,165000,55000)],
  [A.F26,fvReg("SAM-FAM-UMA-F26","Umaria",1.9,145000,77000)],
  [A.F27,fvReg("SAM-FAM-ANU-F27","Anuppur",2.4,185000,59000)],
  // NEEDS_INPUT fillers F28–F34 (eKYC missing)
  [A.F28,ekycReg()],[A.F29,ekycReg()],[A.F30,ekycReg()],[A.F31,ekycReg()],
  [A.F32,ekycReg()],[A.F33,ekycReg()],[A.F34,ekycReg()],
  // F35: DUPLICATE_ACTIVE → NEEDS_INPUT
  [A.F35, { aadhaar:MA,
    samagra:cSam("SAM-FAM-AGA-F35","Agar Malwa","2025-11-01",9),
    land:{status:"MATCH",hasHoldings:false}, ration:{status:"MATCH",cardType:"APL"},
    priorCertificate:{status:"MATCH",hasUnexpiredThisYear:true,lastCertifiedAt:"2026-04-01"} }],
  // REJECT fillers F36–F40
  [A.F36,rejReg("SAM-FAM-NIW-F36","Niwari","AAY")],
  [A.F37,rejReg("SAM-FAM-ASH-F37","Ashoknagar","BPL")],
  [A.F38,rejReg("SAM-FAM-ALI-F38","Alirajpur","AAY")],
  [A.F39,rejReg("SAM-FAM-BAR-F39","Barwani","BPL")],
  [A.F40,rejReg("SAM-FAM-JHA-F40","Jhabua","AAY")],
]);

// ============================================================
// §4  INLINE ENGINE  (mirrors lib/engine/rules.ts + index.ts)
// ============================================================
const HEADLINES = {
  AUTO_ISSUE:   { hi:"जाँच पूरी हुई — प्रमाण पत्र स्वतः जारी किया जा सकता है।",       en:"Checks complete — the certificate can be issued automatically." },
  FIELD_VERIFY: { hi:"क्षेत्रीय सत्यापन आवश्यक है — कारण नीचे दिए गए हैं।",            en:"Field verification is required — the reasons are listed below." },
  NEEDS_INPUT:  { hi:"आवेदन आगे बढ़ाने के लिए आपकी कार्रवाई आवश्यक है।",               en:"Your action is required before the application can proceed." },
  REJECT:       { hi:"रिकॉर्ड में ठोस विरोधाभास के कारण आवेदन अस्वीकृत हुआ।",          en:"The application was rejected because the records contain a hard contradiction." },
};

function engineEvaluate(app, snap) {
  const fired = [];
  const stated = app.statedAnnualIncome;
  const card = snap.ration.cardType;

  if ((card === "AAY" || card === "BPL") && stated > 100000) {
    fired.push({ kind:"hard", ruleId:"RATION_CONTRADICTION", severity:"BLOCK", weightedScore:100,
      reasonHi:`${card} राशन कार्ड का रिकॉर्ड है, लेकिन घोषित वार्षिक आय ₹${stated} BPL सीमा से अधिक है।`,
      reasonEn:`Registry shows a ${card} ration card but declared annual income INR ${stated} exceeds the INR 100000 BPL ceiling.`,
      meta:{ cardType:card, statedAnnualIncome:stated, bplBandCeiling:100000 } });
  }

  const prior = snap.priorCertificate.lastYearDeclaredIncome;
  if (prior != null) {
    const denom = Math.max(stated, prior);
    const ratio = denom === 0 ? 0 : Math.abs(stated - prior) / denom;
    if (ratio > 0.4) {
      fired.push({ kind:"soft", ruleId:"PRIOR_SWING", severity:"WARN", weightedScore:25,
        reasonHi:`घोषित आय पिछले प्रमाण पत्र की आय से ${(ratio*100).toFixed(1)}% अलग है; क्षेत्रीय सत्यापन आवश्यक है।`,
        reasonEn:`The declared income differs from last year's certificate by ${(ratio*100).toFixed(1)}%; field verification is required.`,
        meta:{ statedAnnualIncome:stated, lastYearDeclaredIncome:prior, differenceRatio:ratio } });
    }
  }

  const land = snap.land;
  if (land.hasHoldings && land.estAnnualIncome != null && land.estAnnualIncome > stated * 1.5) {
    fired.push({ kind:"soft", ruleId:"LAND_VS_INCOME", severity:"WARN", weightedScore:30,
      reasonHi:`भूमि रिकॉर्ड से अनुमानित वार्षिक आय ₹${land.estAnnualIncome} घोषित आय ₹${stated} से काफी अधिक है।`,
      reasonEn:`Estimated annual land income of INR ${land.estAnnualIncome} is substantially higher than the declared INR ${stated}.`,
      meta:{ hasHoldings:true, holdingHectares:land.holdingHectares, estimatedAnnualIncome:land.estAnnualIncome, statedAnnualIncome:stated } });
  }

  const p = app.purpose.toLowerCase();
  const cutoff = /\bews\b|e\.w\.s/.test(p) ? 800000 : /scholarship|छात्रवृत्ति/.test(p) ? 250000 : null;
  if (cutoff && stated >= cutoff * 0.98 && stated < cutoff) {
    fired.push({ kind:"soft", ruleId:"THRESHOLD_HUGGING", severity:"WARN", weightedScore:20,
      reasonHi:`घोषित आय ₹${cutoff} सीमा से 2% के भीतर ठीक नीचे है।`,
      reasonEn:`The declared income is just below and within 2% of the INR ${cutoff} cutoff.`,
      meta:{ cutoff, statedAnnualIncome:stated } });
  }

  const ekycAge = snap.samagra.ekycAgeMonths ?? 0;
  if (snap.samagra.ekycStatus === "MISSING" || ekycAge > 12) {
    fired.push({ kind:"blocking", ruleId:"EKYC_STALE", severity:"BLOCK", weightedScore:0,
      reasonHi:"समग्र e-KYC उपलब्ध नहीं है या 12 महीने से पुराना है, इसलिए आवेदन अभी आगे नहीं बढ़ सकता।",
      reasonEn:"Samagra eKYC is missing or older than 12 months, so the application cannot proceed yet.",
      requiredInputHi:"समग्र पोर्टल या अधिकृत केंद्र पर अपना e-KYC अपडेट करें और फिर आवेदन दोबारा भेजें।",
      requiredInputEn:"Update your Samagra eKYC on the Samagra portal or at an authorised centre, then resubmit.",
      meta:{ ekycStatus:snap.samagra.ekycStatus, ekycAgeMonths:snap.samagra.ekycAgeMonths } });
  }

  if (snap.aadhaar.nameMatch === false || snap.aadhaar.ageMatch === false) {
    fired.push({ kind:"blocking", ruleId:"IDENTITY_MISMATCH", severity:"BLOCK", weightedScore:0,
      reasonHi:"आधार और समग्र रिकॉर्ड में नाम या जन्मतिथि मेल नहीं खाती।",
      reasonEn:"The name or date of birth does not match between the Aadhaar and Samagra records.",
      requiredInputHi:"आधार या समग्र में गलत नाम/जन्मतिथि सुधारें, फिर आवेदन दोबारा भेजें।",
      requiredInputEn:"Correct the name or date of birth in Aadhaar or Samagra so both records match, then resubmit.",
      meta:{ nameMatch:snap.aadhaar.nameMatch, ageMatch:snap.aadhaar.ageMatch } });
  }

  if (snap.priorCertificate.hasUnexpiredThisYear === true) {
    fired.push({ kind:"blocking", ruleId:"DUPLICATE_ACTIVE", severity:"BLOCK", weightedScore:0,
      reasonHi:"इस परिवार के लिए इस वर्ष का एक वैध, अभी समाप्त न हुआ आय प्रमाण पत्र पहले से मौजूद है।",
      reasonEn:"An unexpired income certificate for this family already exists for this year.",
      requiredInputHi:"मौजूदा वैध प्रमाण पत्र का उपयोग करें; यदि रिकॉर्ड गलत है तो उसे रद्द करवाकर फिर आवेदन करें।",
      requiredInputEn:"Use the existing valid certificate; if the record is wrong, have it cancelled before reapplying.",
      meta:{ hasUnexpiredThisYear:true, lastCertifiedAt:snap.priorCertificate.lastCertifiedAt } });
  }

  if (land.hasHoldings && app.incomeSource !== "AGRICULTURE") {
    fired.push({ kind:"soft", ruleId:"SOURCE_INCOMPLETE", severity:"WARN", weightedScore:20,
      reasonHi:"भूमि रिकॉर्ड में कृषि भूमि है, लेकिन घोषित आय स्रोत में कृषि शामिल नहीं है।",
      reasonEn:"The land registry shows agricultural holdings, but agriculture is not the declared income source.",
      meta:{ hasHoldings:true, holdingHectares:land.holdingHectares, declaredIncomeSource:app.incomeSource } });
  }

  const hasHard    = fired.some(f => f.kind === "hard");
  const hasBlocking= fired.some(f => f.kind === "blocking");
  const rawScore   = fired.reduce((t, f) => t + (f.weightedScore ?? 0), 0);
  const score      = hasHard ? 100 : Math.min(60, rawScore);

  let outcome;
  if (hasHard)         outcome = "REJECT";
  else if (hasBlocking)outcome = "NEEDS_INPUT";
  else if (score >= 20)outcome = "FIELD_VERIFY";
  else                 outcome = "AUTO_ISSUE";

  const requiredInput = outcome === "NEEDS_INPUT"
    ? fired.filter(f => f.requiredInputHi).map(f => ({ hi:f.requiredInputHi, en:f.requiredInputEn }))
    : undefined;

  return { outcome, score, signals:fired, headline:HEADLINES[outcome], requiredInput };
}

// ============================================================
// §5  INLINE SLA  (mirrors lib/sla/calendar.ts + index.ts)
// ============================================================
const HOLIDAYS = new Set(["2026-01-26","2026-03-04","2026-08-15","2026-10-02","2026-11-08"]);
const MS_DAY = 86400000;

function dateKey(d) { return (d instanceof Date ? d : new Date(d)).toISOString().slice(0,10); }
function isWorkingDay(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.getUTCDay() !== 0 && !HOLIDAYS.has(dateKey(date));
}
function computeDueAt(startedAt, samadhan = false) {
  const d = new Date(startedAt instanceof Date ? startedAt.getTime() : startedAt);
  let rem = samadhan ? 1 : 3;
  while (rem > 0) { d.setUTCDate(d.getUTCDate() + 1); if (isWorkingDay(d)) rem--; }
  return d;
}
function countWorkingDays(from, to) {
  const start = new Date(from instanceof Date ? from.getTime() : from);
  const end   = new Date(to instanceof Date ? to.getTime() : to);
  if (end <= start) return 0;
  const cursor = new Date(start); let count = 0;
  while (cursor < end) { cursor.setUTCDate(cursor.getUTCDate()+1); if (cursor<=end && isWorkingDay(cursor)) count++; }
  return count;
}
function breachDaysCalc(dueAt, now) {
  const diff = (now instanceof Date ? now : new Date(now)) - (dueAt instanceof Date ? dueAt : new Date(dueAt));
  return diff <= 0 ? 0 : Math.ceil(diff / MS_DAY);
}

function computeSla(appId, startedAt, outcome, { pausedAt=null, resolvedAt=null, ownerName="नामित अधिकारी / designated officer" }={}) {
  const started = new Date(startedAt instanceof Date ? startedAt.getTime() : startedAt);
  const due     = computeDueAt(started);
  const paused  = outcome === "NEEDS_INPUT";
  const autoResolved = (outcome === "AUTO_ISSUE" || outcome === "REJECT") ? started : null;
  const resolved= resolvedAt ? new Date(resolvedAt) : autoResolved;
  const effective = resolved ?? (paused ? (pausedAt ? new Date(pausedAt) : SEED_NOW) : SEED_NOW);
  const bd      = paused ? 0 : breachDaysCalc(due, effective);
  const breached= bd > 0;

  let status = "RUNNING";
  if (resolved && !breached) status = "MET";
  if (outcome === "REJECT")  status = "CLOSED";
  if (breached)              status = "BREACHED";

  const state = {
    startedAt: started,
    dueAt: due,
    workingDaysAllowed: 3,
    workingDaysElapsed: countWorkingDays(started, effective),
    status,
    penaltyAccruedInr: bd * 250,
    breachedAt: breached ? due : null,
    appealDraftHi: breached ? `आवेदन ${appId} की वैधानिक समय-सीमा ${due.toISOString().slice(0,10)} को समाप्त हो गई। वर्तमान जिम्मेदार अधिकारी ${ownerName} के विरुद्ध प्रथम अपील का यह मसौदा प्रस्तुत है। कृपया सेवा तुरंत प्रदान करें और ₹250 प्रति विलंब-दिवस की क्षतिपूर्ति तय करें।` : null,
    appealDraftEn: breached ? `The statutory deadline for application ${appId} expired on ${due.toISOString().slice(0,10)}. This is a draft first appeal against the current responsible officer, ${ownerName}. Please deliver the service immediately and determine compensation at INR 250 per day of delay.` : null,
  };
  return { state, bd, due };
}

// ============================================================
// §6  PERSONA DATA  (mirrors data/personas.ts + seeds.ts)
// ============================================================
// Each row: [aadhaarKey, name, phone, dob, district, tehsil, address, samagraId,
//            income, source, purpose, submittedAt, lang, famId, isUrban, note]
const DEMO_ROWS = [
  [A.SUNITA,"Sunita Verma","9800000001","1985-06-15","Indore","Indore","12, Scheme 54, Vijay Nagar, Indore","SAM-MEM-IND-0001",120000,"SALARY","Scholarship for daughter's engineering admission","2026-08-24T08:00:00.000Z","hi","SAM-FAM-IND-001",true,"AUTO_ISSUE"],
  [A.RAMESH,"Ramesh Kumar","9800000002","1978-03-20","Dewas","Dewas","Ward 7, Gram Antarsali, Dewas","SAM-MEM-DEW-0002",80000,"AGRICULTURE","EWS certificate for housing scheme","2026-08-22T10:30:00.000Z","hi","SAM-FAM-DEW-002",false,"FIELD_VERIFY"],
  [A.KAMLA, "Kamla Devi","9800000003","1972-11-08","Sehore","Sehore","Gram Banjari, Tehsil Sehore, Sehore","SAM-MEM-SEH-0003",95000,"AGRICULTURE","Income certificate for ration card upgrade","2026-08-15T09:00:00.000Z","hi","SAM-FAM-SEH-003",false,"BREACH_SLA"],
  [A.ARJUN,"Arjun Sharma","9800000004","1990-07-25","Bhopal","Bhopal","H.No 45, Arera Colony, Bhopal","SAM-MEM-BHO-0004",180000,"BUSINESS","Income certificate for government tender eligibility","2026-08-23T14:00:00.000Z","en","SAM-FAM-BHO-004",false,"NEEDS_INPUT"],
  [A.GANPAT,"Ganpat Kewat","9800000005","1968-04-12","Ujjain","Ujjain","Freeganj Colony, Ujjain","SAM-MEM-UJJ-0005",420000,"BUSINESS","Income certificate for municipal contractor registration","2026-08-24T11:00:00.000Z","hi","SAM-FAM-UJJ-005",false,"REJECT"],
];

const FILLER_ROWS = [
  [A.F01,"Priya Gupta","9810000001","1990-02-14","Jabalpur","Panagar","Gram Panagar Ward 3, Jabalpur","SAM-MEM-JAB-F01",90000,"SALARY","Scholarship","2026-08-18T09:00:00.000Z","hi","SAM-FAM-JAB-F01",false,"AUTO_ISSUE"],
  [A.F02,"Suresh Singh","9810000002","1983-07-30","Gwalior","Morar","LIC Colony, Morar, Gwalior","SAM-MEM-GWL-F02",75000,"SALARY","EWS housing scheme","2026-08-19T10:00:00.000Z","hi","SAM-FAM-GWL-F02",false,"AUTO_ISSUE"],
  [A.F03,"Raju Patel","9810000003","1975-11-05","Rewa","Mauganj","Village Mauganj, Rewa","SAM-MEM-REW-F03",110000,"AGRICULTURE","Scholarship for son","2026-08-20T11:00:00.000Z","hi","SAM-FAM-REW-F03",false,"AUTO_ISSUE"],
  [A.F04,"Savita Sharma","9810000004","1992-04-18","Satna","Nagod","Nagod Town Ward 5, Satna","SAM-MEM-SAT-F04",85000,"DAILY_WAGE","Fee waiver for nursing college","2026-08-21T08:30:00.000Z","hi","SAM-FAM-SAT-F04",false,"AUTO_ISSUE"],
  [A.F05,"Mohan Verma","9810000005","1980-09-22","Sagar","Banda","Gram Banda, Tehsil Banda, Sagar","SAM-MEM-SAG-F05",100000,"AGRICULTURE","Bank loan application","2026-08-22T09:00:00.000Z","hi","SAM-FAM-SAG-F05",false,"AUTO_ISSUE"],
  [A.F06,"Geeta Yadav","9810000006","1987-03-11","Hoshangabad","Sohagpur","Sohagpur Town, Hoshangabad","SAM-MEM-HOS-F06",95000,"SALARY","Scholarship for daughter","2026-08-20T14:00:00.000Z","hi","SAM-FAM-HOS-F06",false,"AUTO_ISSUE"],
  [A.F07,"Rajesh Kumar","9810000007","1976-06-25","Narsinghpur","Gadarwara","Ward 2, Gadarwara, Narsinghpur","SAM-MEM-NAR-F07",130000,"BUSINESS","EWS certificate for admission","2026-08-23T08:00:00.000Z","hi","SAM-FAM-NAR-F07",false,"AUTO_ISSUE"],
  [A.F08,"Anita Mishra","9810000008","1993-01-08","Raisen","Bareli","Bareli Town Ward 1, Raisen","SAM-MEM-RAI-F08",88000,"SALARY","Fee concession application","2026-08-19T09:30:00.000Z","hi","SAM-FAM-RAI-F08",false,"AUTO_ISSUE"],
  [A.F09,"Dinesh Joshi","9810000009","1985-08-14","Vidisha","Ganj Basoda","Ganj Basoda, Vidisha","SAM-MEM-VID-F09",92000,"SALARY","Bank loan","2026-08-21T10:30:00.000Z","hi","SAM-FAM-VID-F09",false,"AUTO_ISSUE"],
  [A.F10,"Lata Tiwari","9810000010","1970-12-30","Mandla","Bichhia","Village Bichhia, Mandla","SAM-MEM-MAN-F10",78000,"AGRICULTURE","Scholarship application","2026-08-22T11:00:00.000Z","hi","SAM-FAM-MAN-F10",false,"AUTO_ISSUE"],
  [A.F11,"Vinod Sahu","9810000011","1988-05-17","Balaghat","Waraseoni","Waraseoni Town, Balaghat","SAM-MEM-BAL-F11",105000,"BUSINESS","EWS housing","2026-08-23T09:00:00.000Z","hi","SAM-FAM-BAL-F11",false,"AUTO_ISSUE"],
  [A.F12,"Rekha Pandey","9810000012","1995-10-03","Chhindwara","Sausar","Ward 4, Sausar, Chhindwara","SAM-MEM-CHH-F12",82000,"SALARY","College fee waiver","2026-08-20T15:00:00.000Z","hi","SAM-FAM-CHH-F12",false,"AUTO_ISSUE"],
  [A.F13,"Santosh Dubey","9810000013","1979-02-28","Khandwa","Pandhana","Village Pandhana, Khandwa","SAM-MEM-KHA-F13",115000,"AGRICULTURE","Bank loan for tractor","2026-08-24T07:30:00.000Z","hi","SAM-FAM-KHA-F13",false,"FIELD_VERIFY"],
  [A.F14,"Pushpa Pal","9810000014","1982-07-07","Khargone","Bhikangaon","Bhikangaon, Khargone","SAM-MEM-KHG-F14",72000,"DAILY_WAGE","OBC scholarship","2026-08-21T12:00:00.000Z","hi","SAM-FAM-KHG-F14",false,"AUTO_ISSUE"],
  [A.F15,"Manoj Shukla","9810000015","1984-09-19","Dhar","Badnawar","Badnawar Town Ward 6, Dhar","SAM-MEM-DHA-F15",98000,"SALARY","Scholarship","2026-08-22T08:00:00.000Z","hi","SAM-FAM-DHA-F15",false,"AUTO_ISSUE"],
  [A.F16,"Sheela Chauhan","9810000016","1974-03-05","Rajgarh","Narsinghgarh","Village Narsinghgarh, Rajgarh","SAM-MEM-RAJ-F16",70000,"AGRICULTURE","Scholarship for son","2026-08-18T10:00:00.000Z","hi","SAM-FAM-RAJ-F16",false,"FIELD_VERIFY"],
  [A.F17,"Bharat Rajput","9810000017","1969-11-11","Betul","Multai","Gram Multai, Betul","SAM-MEM-BET-F17",65000,"AGRICULTURE","EWS housing scheme","2026-08-19T09:00:00.000Z","hi","SAM-FAM-BET-F17",false,"FIELD_VERIFY"],
  [A.F18,"Rupa Malviya","9810000018","1977-08-24","Morena","Ambah","Ambah Town, Morena","SAM-MEM-MOR-F18",55000,"AGRICULTURE","Bank loan","2026-08-20T11:00:00.000Z","hi","SAM-FAM-MOR-F18",false,"FIELD_VERIFY"],
  [A.F19,"Naresh Rathore","9810000019","1971-04-16","Sheopur","Vijaypur","Village Vijaypur, Sheopur","SAM-MEM-SHE-F19",48000,"AGRICULTURE","Fee waiver","2026-08-21T09:00:00.000Z","hi","SAM-FAM-SHE-F19",false,"FIELD_VERIFY"],
  [A.F20,"Hemlata Saxena","9810000020","1986-01-29","Shivpuri","Pichhore","Village Pichhore, Shivpuri","SAM-MEM-SHV-F20",60000,"AGRICULTURE","Scholarship","2026-08-22T10:00:00.000Z","hi","SAM-FAM-SHV-F20",false,"FIELD_VERIFY"],
  [A.F21,"Satish Dwivedi","9810000021","1973-06-08","Damoh","Jabera","Gram Jabera, Damoh","SAM-MEM-DAM-F21",72000,"AGRICULTURE","EWS certificate","2026-08-23T11:00:00.000Z","hi","SAM-FAM-DAM-F21",false,"FIELD_VERIFY"],
  [A.F22,"Usha Agarwal","9810000022","1981-09-13","Panna","Pawai","Village Pawai, Panna","SAM-MEM-PAN-F22",50000,"AGRICULTURE","Scholarship for daughter","2026-08-18T13:00:00.000Z","hi","SAM-FAM-PAN-F22",false,"FIELD_VERIFY"],
  [A.F23,"Pramod Nayak","9810000023","1967-12-02","Tikamgarh","Palera","Palera Town, Tikamgarh","SAM-MEM-TIK-F23",68000,"AGRICULTURE","Bank loan for pump-set","2026-08-19T14:00:00.000Z","hi","SAM-FAM-TIK-F23",false,"FIELD_VERIFY"],
  [A.F24,"Champa Devi","9810000024","1965-05-20","Chhatarpur","Maharajpur","Maharajpur, Chhatarpur","SAM-MEM-CHT-F24",45000,"AGRICULTURE","Fee waiver for grandson","2026-08-20T10:00:00.000Z","hi","SAM-FAM-CHT-F24",false,"FIELD_VERIFY"],
  [A.F25,"Ashok Kumar","9810000025","1970-07-03","Katni","Bahoriband","Bahoriband Town, Katni","SAM-MEM-KAT-F25",58000,"AGRICULTURE","Scholarship for daughter","2026-08-21T09:30:00.000Z","hi","SAM-FAM-KAT-F25",false,"FIELD_VERIFY"],
  [A.F26,"Radha Bai","9810000026","1963-03-28","Umaria","Manpur","Village Manpur, Umaria","SAM-MEM-UMA-F26",80000,"AGRICULTURE","Bank loan","2026-08-22T08:30:00.000Z","hi","SAM-FAM-UMA-F26",false,"FIELD_VERIFY"],
  [A.F27,"Deepak Singh","9810000027","1989-10-10","Anuppur","Jaithari","Jaithari Town, Anuppur","SAM-MEM-ANU-F27",62000,"AGRICULTURE","EWS housing","2026-08-23T10:30:00.000Z","hi","SAM-FAM-ANU-F27",false,"FIELD_VERIFY"],
  [A.F28,"Saroj Sharma","9810000028","1991-08-06","Singrauli","Chitrangi","Ward 3, Singrauli","SAM-MEM-SIN-F28",140000,"SALARY","Scholarship for children","2026-08-20T09:00:00.000Z","hi","SAM-FAM-SIN-F28",false,"NEEDS_INPUT"],
  [A.F29,"Kishan Yadav","9810000029","1982-04-21","Sidhi","Rampur Naikin","Gram Rampur Naikin, Sidhi","SAM-MEM-SID-F29",95000,"AGRICULTURE","Bank loan","2026-08-21T10:00:00.000Z","hi","SAM-FAM-SID-F29",false,"NEEDS_INPUT"],
  [A.F30,"Kavita Gupta","9810000030","1988-11-15","Shahdol","Beohari","Beohari Town, Shahdol","SAM-MEM-SHA-F30",105000,"BUSINESS","EWS certificate","2026-08-22T11:00:00.000Z","hi","SAM-FAM-SHA-F30",false,"NEEDS_INPUT"],
  [A.F31,"Ramakant Verma","9810000031","1976-01-17","Dindori","Shahpura","Village Shahpura, Dindori","SAM-MEM-DIN-F31",88000,"AGRICULTURE","Scholarship","2026-08-23T09:00:00.000Z","hi","SAM-FAM-DIN-F31",false,"NEEDS_INPUT"],
  [A.F32,"Mangala Devi","9810000032","1964-06-30","Seoni","Keolari","Gram Keolari, Seoni","SAM-MEM-SEO-F32",92000,"AGRICULTURE","Bank loan for well","2026-08-24T08:00:00.000Z","hi","SAM-FAM-SEO-F32",false,"NEEDS_INPUT"],
  [A.F33,"Dheeraj Tiwari","9810000033","1994-03-09","Harda","Timarni","Timarni Town, Harda","SAM-MEM-HAR-F33",78000,"SALARY","Fee waiver","2026-08-19T15:00:00.000Z","hi","SAM-FAM-HAR-F33",false,"NEEDS_INPUT"],
  [A.F34,"Lalita Jain","9810000034","1980-09-25","Burhanpur","Nepanagar","Nepanagar, Burhanpur","SAM-MEM-BUR-F34",85000,"BUSINESS","Scholarship for son","2026-08-20T10:30:00.000Z","hi","SAM-FAM-BUR-F34",false,"NEEDS_INPUT"],
  [A.F35,"Ramesh Soni","9810000035","1972-12-19","Agar Malwa","Susner","Susner Town, Agar Malwa","SAM-MEM-AGA-F35",110000,"BUSINESS","EWS certificate","2026-08-21T11:30:00.000Z","hi","SAM-FAM-AGA-F35",false,"NEEDS_INPUT"],
  [A.F36,"Parvati Devi","9810000036","1966-07-14","Niwari","Prithvipur","Prithvipur Town, Niwari","SAM-MEM-NIW-F36",350000,"BUSINESS","Municipal contractor registration","2026-08-23T09:00:00.000Z","hi","SAM-FAM-NIW-F36",false,"REJECT"],
  [A.F37,"Ramjilal Kori","9810000037","1968-02-03","Ashoknagar","Mungaoli","Mungaoli Town, Ashoknagar","SAM-MEM-ASH-F37",420000,"BUSINESS","EWS certificate for land purchase","2026-08-22T14:00:00.000Z","hi","SAM-FAM-ASH-F37",false,"REJECT"],
  [A.F38,"Sharda Bai","9810000038","1963-10-10","Alirajpur","Jobat","Village Jobat, Alirajpur","SAM-MEM-ALI-F38",380000,"BUSINESS","Income certificate for court case","2026-08-24T07:00:00.000Z","hi","SAM-FAM-ALI-F38",false,"REJECT"],
  [A.F39,"Ganesh Barela","9810000039","1975-05-27","Barwani","Sendhwa","Sendhwa Town, Barwani","SAM-MEM-BAR-F39",450000,"BUSINESS","Scholarship for nephew","2026-08-21T13:00:00.000Z","hi","SAM-FAM-BAR-F39",false,"REJECT"],
  [A.F40,"Sunilbai Bhilala","9810000040","1960-08-18","Jhabua","Thandla","Thandla Town, Jhabua","SAM-MEM-JHA-F40",400000,"DAILY_WAGE","OBC income certificate","2026-08-20T09:30:00.000Z","hi","SAM-FAM-JHA-F40",false,"REJECT"],
];

const ALL_ROWS = [...DEMO_ROWS, ...FILLER_ROWS];

// ============================================================
// §7  SEED MAIN
// ============================================================
async function main() {
  console.log("🌱 Praman DB seed starting…");

  // ── 7a. Clear all tables (reverse dependency order) ──────────────────────
  await prisma.penaltyLedger.deleteMany();
  await prisma.appeal.deleteMany();
  await prisma.slaEvent.deleteMany();
  await prisma.slaState.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.priorCertificate.deleteMany();
  await prisma.application.deleteMany();
  await prisma.applicant.deleteMany();
  await prisma.family.deleteMany();
  await prisma.officer.deleteMany();
  // Reset the demo clock to real time (singleton row id=1).
  await prisma.demoClock.upsert({ where: { id: 1 }, create: { id: 1, simulatedNow: null }, update: { simulatedNow: null } });
  console.log("   ✓ cleared");

  // ── 7b. Seed demo officer (Patwari, Sehore — responsible for Kamla) ──────
  const officer = await prisma.officer.create({
    data: { name:"Arun Dubey", role:"PATWARI", district:"Sehore", tehsil:"Sehore" },
  });
  console.log(`   ✓ officer: ${officer.name} (${officer.role}, ${officer.tehsil})`);

  // ── 7c. Seed all 45 personas ──────────────────────────────────────────────
  const counts = { AUTO_ISSUE:0, FIELD_VERIFY:0, NEEDS_INPUT:0, REJECT:0, BREACH_SLA:0 };
  let certSeq = 1;

  for (const [aadhaarLike, fullName, phone, dob, district, tehsil, address, samagraId,
               income, source, purpose, submittedAt, lang, famId, isUrban, fixtureOutcome]
       of ALL_ROWS) {

    const snap = REG.get(aadhaarLike);
    if (!snap) throw new Error(`No registry entry for aadhaarLike: ${aadhaarLike} (${fullName})`);

    // Application object for engine
    const appObj = { id:"SEED-TMP", applicant:{aadhaarLike}, statedAnnualIncome:income,
                     incomeSource:source, purpose };
    const eng = engineEvaluate(appObj, snap);
    const outcome = eng.outcome; // actual engine outcome (may differ from BREACH_SLA fixture)

    // Determine family eKYC status
    const sam = snap.samagra;
    let famEkycStatus = "VALID";
    if (sam.ekycStatus === "MISSING") famEkycStatus = "MISSING";
    else if ((sam.ekycAgeMonths ?? 0) > 12) famEkycStatus = "STALE";

    // ── Create Family ────────────────────────────────────────────────────────
    const family = await prisma.family.create({
      data: {
        samagraFamilyId: famId,
        headName: fullName,
        district, tehsil, isUrban,
        ekycStatus: famEkycStatus,
        ekycUpdatedAt: sam.ekycUpdatedAt ? new Date(sam.ekycUpdatedAt) : null,
      },
    });

    // ── Create Applicant ─────────────────────────────────────────────────────
    const applicant = await prisma.applicant.create({
      data: { fullName, phone, aadhaarLike, samagraId, dateOfBirth:dob,
              district, tehsil, addressLine:address, familyId:family.id },
    });

    // ── Create Application ───────────────────────────────────────────────────
    const application = await prisma.application.create({
      data: { applicantId:applicant.id, statedAnnualIncome:income, incomeSource:source,
              purpose, submittedAt:new Date(submittedAt), lang },
    });
    const appId = application.id;

    // ── Create Decision + Signals ────────────────────────────────────────────
    const decidedAt = new Date(new Date(submittedAt).getTime() + 8000); // +8 seconds
    const decision = await prisma.decision.create({
      data: {
        applicationId: appId,
        outcome,
        score: eng.score,
        headlineHi: eng.headline.hi,
        headlineEn: eng.headline.en,
        requiredInput: eng.requiredInput ? JSON.stringify(eng.requiredInput) : null,
        decidedAt,
      },
    });

    if (eng.signals.length > 0) {
      await prisma.signal.createMany({
        data: eng.signals.map(s => ({
          decisionId: decision.id,
          ruleId: s.ruleId,
          severity: s.severity,
          reasonHi: s.reasonHi,
          reasonEn: s.reasonEn,
          meta: JSON.stringify(s.meta ?? {}),
        })),
      });
    }

    // ── Compute SLA ──────────────────────────────────────────────────────────
    const isKamla = aadhaarLike === A.KAMLA;
    const slaOpts = isKamla
      ? { ownerName:"Arun Dubey (Patwari, Sehore)" }
      : {};
    const { state: slaResult, bd, due } = computeSla(appId, submittedAt, outcome, slaOpts);

    await prisma.slaState.create({
      data: {
        applicationId: appId,
        startedAt:          slaResult.startedAt,
        dueAt:              slaResult.dueAt,
        workingDaysAllowed: slaResult.workingDaysAllowed,
        workingDaysElapsed: slaResult.workingDaysElapsed,
        status:             slaResult.status,
        breachedAt:         slaResult.breachedAt ?? null,
        penaltyAccruedInr:  slaResult.penaltyAccruedInr,
        appealDraftHi:      slaResult.appealDraftHi ?? null,
        appealDraftEn:      slaResult.appealDraftEn ?? null,
      },
    });

    // ── SLA Events ───────────────────────────────────────────────────────────
    const slaEvents = [
      { applicationId:appId, type:"STARTED",  at:new Date(submittedAt) },
      { applicationId:appId, type:"DUE_SET",  at:due },
    ];
    if (outcome === "NEEDS_INPUT") {
      slaEvents.push({ applicationId:appId, type:"PAUSED", at:SEED_NOW });
    }
    if (slaResult.status === "BREACHED") {
      slaEvents.push({ applicationId:appId, type:"BREACHED", at:due });
    }
    await prisma.slaEvent.createMany({ data:slaEvents });

    // ── Certificate (AUTO_ISSUE only) ────────────────────────────────────────
    if (outcome === "AUTO_ISSUE") {
      const issuedAt  = decidedAt;
      const expiresAt = new Date(issuedAt.getTime() + 365 * 24 * 3600 * 1000);
      const certNo = `PRAMAN/${new Date(submittedAt).getFullYear()}/${String(certSeq++).padStart(6,"0")}`;
      await prisma.certificate.create({
        data: { number:certNo, applicationId:appId, issuedAt, expiresAt,
                signature:`MOCK-SIG-${certNo.replace(/\//g,"-")}` },
      });
    }

    // ── Appeal + PenaltyLedger (BREACH only — Kamla) ─────────────────────────
    if (slaResult.status === "BREACHED") {
      const appealRec = await prisma.appeal.create({
        data: {
          applicationId: appId,
          tier: "FIRST", status: "DRAFT",
          reasonHi: slaResult.appealDraftHi,
          reasonEn: slaResult.appealDraftEn,
          againstOfficerId: officer.id,
        },
      });
      await prisma.penaltyLedger.create({
        data: {
          applicationId: appId,
          appealId:   appealRec.id,
          officerId:  officer.id,
          ratePerDay: 250,
          breachDays: bd,
          amountInr:  bd * 250,
          status: "ACCRUING",
        },
      });
    }

    // ── PriorCertificate DB row (for families that had a cert last year) ─────
    const pc = snap.priorCertificate;
    if (pc.status === "MATCH" && pc.lastYearDeclaredIncome != null && pc.lastCertifiedAt) {
      const certYear = new Date(pc.lastCertifiedAt).getFullYear();
      const expires  = new Date(pc.lastCertifiedAt);
      expires.setFullYear(expires.getFullYear() + 1);
      await prisma.priorCertificate.create({
        data: { familyId:family.id, year:certYear, declaredIncome:pc.lastYearDeclaredIncome, expiresAt:expires },
      });
    }
    // DUPLICATE_ACTIVE (F35): also create an active 2026 cert in PriorCertificate
    if (pc.hasUnexpiredThisYear === true && pc.lastCertifiedAt) {
      const certYear = new Date(pc.lastCertifiedAt).getFullYear();
      const expires  = new Date(pc.lastCertifiedAt);
      expires.setFullYear(expires.getFullYear() + 1);
      await prisma.priorCertificate.create({
        data: { familyId:family.id, year:certYear, declaredIncome:income, expiresAt:expires },
      });
    }

    // ── Tally ────────────────────────────────────────────────────────────────
    const tallyKey = (isKamla && slaResult.status === "BREACHED") ? "BREACH_SLA" : outcome;
    counts[tallyKey] = (counts[tallyKey] ?? 0) + 1;
  }

  // ── 7d. Summary ──────────────────────────────────────────────────────────
  const total = Object.values(counts).reduce((a,b) => a + b, 0);
  console.log(`\n✅ Seeded ${total} applications:`);
  console.log(`   AUTO_ISSUE   ${counts.AUTO_ISSUE}`);
  console.log(`   FIELD_VERIFY ${counts.FIELD_VERIFY}`);
  console.log(`   NEEDS_INPUT  ${counts.NEEDS_INPUT}`);
  console.log(`   REJECT       ${counts.REJECT}`);
  console.log(`   BREACH_SLA   ${counts.BREACH_SLA}  (Kamla Devi, Sehore — penalty ₹${counts.BREACH_SLA > 0 ? "accruing" : "none"})`);
  console.log(`\n   Kamla:  SLA BREACHED — appeal DRAFT, penalty accruing @ ₹250/day`);
  console.log(`   Arjun:  SLA RUNNING  — NEEDS_INPUT, clock paused (eKYC stale, 26 months old)`);
}

main()
  .catch(e => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
