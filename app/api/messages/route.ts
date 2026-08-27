// POST /api/messages — persists a citizen submission from the Contact form
// (kind=CONTACT) or the Report-a-problem grievance form (kind=GRIEVANCE), and
// returns a REAL, unique reference number. No mock: the row is stored and the
// reference the citizen sees is the reference on record.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Body = {
  kind?: string;
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  body?: string;
};

const cap = (s: string, n: number) => s.trim().slice(0, n);

function makeReference(kind: "CONTACT" | "GRIEVANCE"): string {
  const prefix = kind === "GRIEVANCE" ? "GRV" : "MSG";
  const n = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `PRN-${prefix}-${n}`;
}

export async function POST(req: Request) {
  let raw: Body = {};
  try {
    raw = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const kind = raw.kind === "GRIEVANCE" ? "GRIEVANCE" : raw.kind === "CONTACT" ? "CONTACT" : null;
  const name = (raw.name ?? "").trim();
  const phone = (raw.phone ?? "").trim();
  const subject = (raw.subject ?? "").trim();
  const body = (raw.body ?? "").trim();
  const email = (raw.email ?? "").trim();

  if (!kind) return NextResponse.json({ error: "kind must be CONTACT or GRIEVANCE" }, { status: 400 });
  if (!name || !phone || !subject || !body) {
    return NextResponse.json({ error: "name, phone, subject and body are required" }, { status: 400 });
  }

  // Retry a couple of times on the (rare) reference collision.
  for (let attempt = 0; attempt < 4; attempt++) {
    const reference = makeReference(kind);
    try {
      const row = await db.message.create({
        data: {
          kind,
          reference,
          name: cap(name, 120),
          phone: cap(phone, 20),
          email: email ? cap(email, 160) : null,
          subject: cap(subject, 160),
          body: cap(body, 4000),
        },
        select: { reference: true, createdAt: true },
      });
      return NextResponse.json({ reference: row.reference, createdAt: row.createdAt }, { status: 201 });
    } catch (e: unknown) {
      // P2002 = unique-constraint clash on reference → try another number.
      if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") continue;
      return NextResponse.json({ error: "Could not save the message" }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Could not allocate a reference, please retry" }, { status: 503 });
}
