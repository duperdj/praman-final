// Demo clock — a persisted simulated "now" so POST /api/dev/tick can move the
// statutory clock forward (and breach it) during the pitch without waiting real
// days. Stored in the DemoClock table (single row, id=1) instead of memory, so
// the simulated instant survives across serverless instances / cold starts on a
// cloud deploy — every request sees the same clock. null → real wall time.
import { db } from "@/lib/db";
import { isWorkingDay, MP_HOLIDAYS } from "@/lib/sla";

async function readSimulated(): Promise<Date | null> {
  const row = await db.demoClock.findUnique({ where: { id: 1 } });
  return row?.simulatedNow ?? null;
}

async function writeSimulated(value: Date | null): Promise<void> {
  await db.demoClock.upsert({
    where: { id: 1 },
    create: { id: 1, simulatedNow: value },
    update: { simulatedNow: value },
  });
}

/** The current demo instant — the simulated now if set, otherwise real time. */
export async function demoNow(): Promise<Date> {
  const sim = await readSimulated();
  return sim ?? new Date();
}

/** True once the clock has been advanced away from real time. */
export async function isSimulated(): Promise<boolean> {
  return (await readSimulated()) != null;
}

/** Advance the demo clock by N working days (Sundays + MP holidays skipped). */
export async function advanceWorkingDays(n: number): Promise<Date> {
  const cursor = await demoNow();
  let remaining = Math.max(0, Math.floor(n));
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (isWorkingDay(cursor, MP_HOLIDAYS)) remaining -= 1;
  }
  await writeSimulated(cursor);
  return cursor;
}

/** Reset the demo clock back to real wall time. */
export async function resetClock(): Promise<void> {
  await writeSimulated(null);
}
