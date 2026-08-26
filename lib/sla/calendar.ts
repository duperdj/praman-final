const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Seeded statutory holidays used by the demo clock (YYYY-MM-DD, UTC calendar). */
export const MP_HOLIDAYS = [
  "2026-01-26", // Republic Day
  "2026-03-04", // Holi
  "2026-08-15", // Independence Day
  "2026-10-02", // Gandhi Jayanti
  "2026-11-08", // Diwali
] as const;

export type Holiday = string | Date;

function asDate(value: string | Date): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid date: ${String(value)}`);
  return date;
}

export function dateKey(value: string | Date): string {
  return asDate(value).toISOString().slice(0, 10);
}

function holidayKeys(holidays: readonly Holiday[]): Set<string> {
  return new Set(holidays.map(dateKey));
}

export function isWorkingDay(
  value: string | Date,
  holidays: readonly Holiday[] = MP_HOLIDAYS
): boolean {
  const date = asDate(value);
  return date.getUTCDay() !== 0 && !holidayKeys(holidays).has(dateKey(date));
}

/**
 * Adds the statutory allowance after submission. `isUrban` is intentionally
 * accepted because the published API includes it; both urban and rural use the
 * same deadline under the current MP rule.
 */
export function computeDueAt(
  submittedAt: string | Date,
  _isUrban: boolean,
  isSamadhanEkDin: boolean,
  holidays: readonly Holiday[] = MP_HOLIDAYS
): Date {
  const due = asDate(submittedAt);
  let remaining = isSamadhanEkDin ? 1 : 3;
  while (remaining > 0) {
    due.setUTCDate(due.getUTCDate() + 1);
    if (isWorkingDay(due, holidays)) remaining -= 1;
  }
  return due;
}

/** Counts working calendar days after `from`, up to and including `to`. */
export function countWorkingDays(
  from: string | Date,
  to: string | Date,
  holidays: readonly Holiday[] = MP_HOLIDAYS
): number {
  const start = asDate(from);
  const end = asDate(to);
  if (end.getTime() <= start.getTime()) return 0;

  const cursor = new Date(start.getTime());
  let count = 0;
  while (cursor.getTime() < end.getTime()) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (cursor.getTime() <= end.getTime() && isWorkingDay(cursor, holidays)) count += 1;
  }
  return count;
}

/** A started calendar day beyond the due instant accrues one penalty day. */
export function breachDaysBetween(dueAt: string | Date, now: string | Date): number {
  const due = asDate(dueAt).getTime();
  const current = asDate(now).getTime();
  return current <= due ? 0 : Math.ceil((current - due) / MS_PER_DAY);
}

export function penaltyFor(breachDays: number): number {
  if (!Number.isFinite(breachDays)) throw new RangeError("breachDays must be finite");
  return Math.max(0, Math.floor(breachDays)) * 250;
}
