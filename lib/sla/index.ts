import type { Bilingual, Outcome, SlaState } from "../contracts";
import {
  MP_HOLIDAYS,
  breachDaysBetween,
  computeDueAt,
  countWorkingDays,
  penaltyFor,
  type Holiday,
} from "./calendar";

export interface SlaEvaluationInput {
  applicationId: string;
  startedAt: string | Date;
  now: string | Date;
  isUrban?: boolean;
  isSamadhanEkDin?: boolean;
  holidays?: readonly Holiday[];
  /** NEEDS_INPUT and AWAITING_CITIZEN both pause breach detection. */
  outcome?: Outcome;
  awaitingCitizen?: boolean;
  /** When the citizen-wait began; defaults to startedAt when omitted. */
  pausedAt?: string | Date;
  /** Set when service was delivered; AUTO_ISSUE defaults this to startedAt. */
  resolvedAt?: string | Date;
  /** Use for a rejected, withdrawn, or administratively closed application. */
  closed?: boolean;
  /** Included in the citizen's auto-drafted appeal on breach. */
  currentOwner?: string;
}

function validDate(value: string | Date): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid date: ${String(value)}`);
  return date;
}

function appeal(applicationId: string, dueAt: string, owner: string): Bilingual {
  return {
    hi: `आवेदन ${applicationId} की वैधानिक समय-सीमा ${dueAt} को समाप्त हो गई। वर्तमान जिम्मेदार अधिकारी ${owner} के विरुद्ध प्रथम अपील का यह मसौदा प्रस्तुत है। कृपया सेवा तुरंत प्रदान करें और ₹250 प्रति विलंब-दिवस की क्षतिपूर्ति तय करें।`,
    en: `The statutory deadline for application ${applicationId} expired on ${dueAt}. This is a draft first appeal against the current responsible officer, ${owner}. Please deliver the service immediately and determine compensation at INR 250 per day of delay.`,
  };
}

/** Pure statutory-clock evaluation. All time, completion, and owner data is supplied by the caller. */
export function evaluateSla(input: SlaEvaluationInput): SlaState {
  const holidays = input.holidays ?? MP_HOLIDAYS;
  const started = validDate(input.startedAt);
  const now = validDate(input.now);
  const allowed = input.isSamadhanEkDin ? 1 : 3;
  const due = computeDueAt(started, input.isUrban ?? false, input.isSamadhanEkDin ?? false, holidays);
  const dueAt = due.toISOString();
  const paused = input.awaitingCitizen === true || input.outcome === "NEEDS_INPUT";
  const autoResolved = input.outcome === "AUTO_ISSUE" || input.outcome === "REJECT"
    ? started
    : undefined;
  const resolved = input.resolvedAt ? validDate(input.resolvedAt) : autoResolved;
  const closed = input.closed === true || input.outcome === "REJECT";
  const effective = resolved ?? (paused ? validDate(input.pausedAt ?? started) : now);
  const breachDays = paused ? 0 : breachDaysBetween(due, effective);
  const breached = breachDays > 0;

  let status: SlaState["status"] = "RUNNING";
  if (closed) status = "CLOSED";
  else if (breached) status = "BREACHED";
  else if (resolved) status = "MET";

  const state: SlaState = {
    applicationId: input.applicationId,
    startedAt: started.toISOString(),
    dueAt,
    workingDaysAllowed: allowed,
    workingDaysElapsed: countWorkingDays(started, effective, holidays),
    status,
    ...(paused ? { paused: true } : {}),
    penaltyAccruedInr: penaltyFor(breachDays),
  };

  if (breached) {
    state.breachedAt = dueAt;
    state.appealDraft = appeal(input.applicationId, dueAt, input.currentOwner ?? "नामित अधिकारी / designated officer");
  }

  return state;
}

/** Familiar short name for callers that model the clock as a state reducer. */
export const slaState = evaluateSla;

export {
  MP_HOLIDAYS,
  breachDaysBetween,
  computeDueAt,
  countWorkingDays,
  isWorkingDay,
  penaltyFor,
  type Holiday,
} from "./calendar";
