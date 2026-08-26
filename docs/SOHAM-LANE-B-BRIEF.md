# Praman — Build Brief for Soham (Lane B: Experience & Demo)

> **How to use this file:** Hand this whole file to your Claude Code as the project brief.
> It has everything: what we're building, the rules we never break, the exact shared
> types your screens will consume, and a detailed, screen-by-screen spec of *your* lane
> with acceptance criteria. Build straight against the types in section 6 — they are frozen.

---

## 1. What we're building (one paragraph)

**Praman** is a re-imagined **income certificate (आय प्रमाण पत्र)** service for the
Madhya Pradesh government — the thing citizens today get from `mpedistrict.gov.in`.
A citizen applies, and instead of vanishing into a queue, the system reads the
application, checks it against (mock) government registries, and **instantly** does one
of four things: issues the certificate, sends it for a quick human check, asks the
citizen for one missing thing, or rejects it with a clear reason. A visible
**"statutory clock"** counts down the **3 working days** the office is legally allowed —
and if that time runs out, the app **auto-drafts the appeal**. Everything is explainable.
Nothing silently gets stuck. It's a hackathon entry for **BuildWhatMovesIndia**.

**Two of us are building it:**
- **Lane A — Engine & Data** (Dhananjai): the decision engine, deadline math, mock
  registries, seed data, API, tests. The "brain."
- **Lane B — Experience & Demo** (you, Soham): *everything on screen*, plus the demo.
  This document is your lane, in full.

---

## 2. The five non-negotiables (true for both lanes — do not break these)

1. **All data is synthetic.** No real Aadhaar, Samagra, or personal data anywhere.
   Aadhaar-like numbers are deliberately built to **fail the real Verhoeff checksum** so
   they can never collide with a real person. (Lane A handles this — you just display it.)
2. **Citizens never see a password or captcha.** Login is **phone number + OTP only.**
3. **Hindi is the default.** English is a toggle, not the starting point. Every user-facing
   string ships in both languages.
4. **Works on a 360px-wide phone.** Design mobile-first. If it breaks on a small screen,
   it's broken.
5. **Nothing silently pends.** Every automated decision shows a human-readable reason.

---

## 3. Tech stack (agreed — don't swap these out)

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling (design tokens in section 8)
- **Prisma + SQLite** for data (Lane A owns the schema; you read via the API)
- **Zod** for input validation on forms
- **Vitest** for tests
- **No** auth library, **no** state-management library, **no** component library
  (build the components — it's part of the point). Fonts via Google Fonts.

---

## 4. How the app decides (context you need, even though Lane A builds it)

The engine runs **8 rules** over an application + the registry data and produces exactly
**one of four outcomes**. Your UI has to render all four beautifully:

| Outcome | What it means | How the citizen should feel |
|---|---|---|
| **AUTO_ISSUE** | Everything checks out. Certificate issued immediately. | Relief — here's your document. |
| **FIELD_VERIFY** | Mostly fine, but one thing needs a human officer to eyeball. | Reassured — it's moving, clock is running. |
| **NEEDS_INPUT** | We need one specific thing from you to continue. | Clear — exactly what to fix, nothing vague. |
| **REJECT** | Can't issue, with a concrete reason. | Respected — told why, and what recourse. |

Each outcome carries a list of **signals** (the individual reasons the rules fired), and
each signal has a bilingual, human-readable reason string. **Show them.** That's the
whole thesis — no black box.

---

## 5. The signature element: the Statutory Clock 🕒

This is the visual heart of the product and it lives in **your** lane. Build it well.

- The office is legally allowed **3 working days** to decide a pending application.
- Render it as **3 segments** (one per working day) that **fill** as working days elapse.
- States you must design:
  - **RUNNING** — segments filling, gold. Show "Day X of 3" + the due date.
  - **MET** — decided in time. Segments settle to seal-green, calm "resolved" state.
  - **BREACHED** — ran out of time. Segments turn **breach-red**, and the UI surfaces
    the **auto-drafted appeal** + the accruing **₹250/day penalty**.
  - **CLOSED** — terminal/archived.
- Working *days*, not calendar days (weekends/holidays don't count — Lane A does the math;
  you render `workingDaysElapsed` / `workingDaysAllowed` and `status` from `SlaState`).

Make this the thing judges remember.

---

## 6. THE FROZEN CONTRACT — build your screens against exactly this

> This is the seam between the two lanes. **It is locked (v1).** Your API responses will
> match these shapes. Put this in `lib/contracts.ts`. If something genuinely needs to
> change, flag it — we change it together, once, not silently.

```ts
// lib/contracts.ts — FROZEN v1. Both lanes build to this.

export type Lang = "hi" | "en";
export type Bilingual = { hi: string; en: string };

// ---- Application: what the citizen submits ----
export type IncomeSource =
  | "SALARY" | "AGRICULTURE" | "BUSINESS" | "DAILY_WAGE" | "PENSION" | "OTHER";

export interface Applicant {
  fullName: string;
  phone: string;          // 10-digit, OTP-verified
  aadhaarLike: string;    // 12-digit, fails Verhoeff on purpose (synthetic)
  samagraId: string;      // MP family/member id (synthetic)
  dateOfBirth: string;    // ISO date
  district: string;
  tehsil: string;
  addressLine: string;
}

export interface Application {
  id: string;
  applicant: Applicant;
  statedAnnualIncome: number;   // INR
  incomeSource: IncomeSource;
  purpose: string;              // why the certificate is needed
  submittedAt: string;          // ISO datetime
  lang: Lang;                   // language they applied in
}

// ---- RegistrySnapshot: what the 5 mock registries return for this applicant ----
export type MatchStatus = "MATCH" | "MISMATCH" | "NOT_FOUND" | "UNAVAILABLE";

export interface RegistrySnapshot {
  aadhaar: { status: MatchStatus; nameMatch?: boolean; ageMatch?: boolean };
  samagra: { status: MatchStatus; familyId?: string; residentDistrict?: string };
  land:    { status: MatchStatus; hasHoldings?: boolean; estAnnualIncome?: number };
  ration:  { status: MatchStatus; cardType?: "APL" | "BPL" | "AAY" | null };
  tax:     { status: MatchStatus; filedReturn?: boolean; declaredIncome?: number };
  fetchedAt: string; // ISO datetime
}

// ---- Signal: one rule's finding ----
export type Severity = "OK" | "INFO" | "WARN" | "BLOCK";

export interface Signal {
  ruleId: string;        // e.g. "R3_INCOME_VS_LAND"
  severity: Severity;
  reason: Bilingual;     // human-readable, shown to citizen/officer
  meta?: Record<string, unknown>;
}

// ---- Decision: the engine's verdict ----
export type Outcome = "AUTO_ISSUE" | "FIELD_VERIFY" | "NEEDS_INPUT" | "REJECT";

export interface Decision {
  applicationId: string;
  outcome: Outcome;
  score: number;               // 0..100 confidence
  signals: Signal[];           // every check that fired, in order
  headline: Bilingual;         // one-line summary of the outcome
  requiredInput?: Bilingual[]; // for NEEDS_INPUT: what the citizen must supply
  decidedAt: string;           // ISO datetime
}

// ---- SlaState: the statutory clock ----
export type SlaStatus = "RUNNING" | "MET" | "BREACHED" | "CLOSED";

export interface SlaState {
  applicationId: string;
  startedAt: string;           // ISO — clock starts when app enters a pending state
  dueAt: string;               // ISO — startedAt + 3 working days
  workingDaysAllowed: number;  // 3
  workingDaysElapsed: number;  // 0..n
  status: SlaStatus;
  breachedAt?: string;         // ISO if breached
  penaltyAccruedInr: number;   // ₹250 * days over
  appealDraft?: Bilingual;     // auto-generated on breach
}
```

**API endpoints Lane A gives you** (shapes above; you consume, you don't build them):
- `POST /api/applications` → create an application, returns `{ application, decision, sla }`
- `GET  /api/applications/:id` → `{ application, decision, sla, registry }` (status page)
- `POST /api/dev/tick` → advances the demo clock (moves working days forward) — you'll wire
  this to a demo control so the clock visibly moves during the pitch.
- `GET  /api/officer/queue` → the FIELD_VERIFY list for the officer view.

> While Lane A is still building these, **stub them** with local fixtures matching the
> types above so you're never blocked. Swap to the real API when it lands.

---

## 7. YOUR LANE B — the full build (this is the detailed part)

Six deliverables. Roughly in build order. Each has a "done when" you can hold yourself to.

### B0 · Project foundation *(do this first — everyone builds on it)*
- Scaffold Next.js (App Router) + TypeScript + Tailwind.
- Set up the **design tokens** from section 8 (Tailwind theme extension: colors, fonts).
- Build the **i18n dictionary**: a simple `hi` / `en` string map + a `useLang()` hook and
  a language toggle in the header. **Hindi is the default.** Every screen you build reads
  strings from this dictionary — no hard-coded English.
- Drop in `lib/contracts.ts` (section 6).
- **Done when:** the app boots, renders in Hindi, the EN/HI toggle flips all chrome, and
  the tokens are usable as Tailwind classes.

### B1 · Citizen apply flow
- **Login:** phone number → OTP screen → verified. No password, no captcha, ever.
  (OTP is mocked — any 6 digits or a fixed code is fine for the demo; make it obvious.)
- **The form:** collect the `Application` fields (section 6) — name, DOB, district, tehsil,
  address, stated annual income, income source, purpose. Validate with **Zod**.
- Bilingual labels + helper text. Big tap targets, single-column, **360px-first.**
- On submit → `POST /api/applications` → route to the status page for that id.
- **Done when:** a person can log in with a phone number and file a complete application on
  a 360px screen, entirely in Hindi, and land on their status page.

### B2 · Status page + the Statutory Clock  ⭐ *(the centerpiece — spend your best time here)*
- The page for one application: shows the **outcome** (one of 4, section 4), the
  **Statutory Clock** (section 5, all states), and the **list of signals** (the reasons).
- Render `Decision.headline` big, then `Decision.signals[]` as readable rows (use
  `severity` for color: OK/INFO calm, WARN amber, BLOCK red).
- The **clock** reads entirely from `SlaState`: 3 segments, fill by `workingDaysElapsed`,
  color by `status`. On **BREACHED**, reveal the `appealDraft` and the `penaltyAccruedInr`.
- For **NEEDS_INPUT**, surface `Decision.requiredInput[]` as a clear "here's what to do next."
- **Done when:** all 4 outcomes render correctly, and the clock shows RUNNING → MET and
  RUNNING → BREACHED convincingly (drive it with `/api/dev/tick`).

### B3 · The certificate
- The final **issued document** for an AUTO_ISSUE (or an officer-approved FIELD_VERIFY).
- Official-looking, clean, **printable** (a good `@media print` stylesheet). Seal-green
  header, the applicant's details, a certificate number, issue date, a QR/seal motif.
- **Done when:** an issued application renders a certificate that looks legit and prints
  to a clean A4/Letter page.

### B4 · Officer view + dashboard
- **Officer queue:** reads `GET /api/officer/queue` — the FIELD_VERIFY applications. An
  officer can open one, see the signals + registry snapshot, and **Approve / Reject**.
  Approving an application should let it issue a certificate (B3).
- **Dashboard:** a small live stats view — counts by outcome, how many clocks are RUNNING
  vs BREACHED, total penalty accrued. Make it feel like a real ops screen (cards, a couple
  of simple charts). This sells the "system works at scale" story.
- **Done when:** an officer can clear the verify queue, and the dashboard reflects the
  seeded data at a glance.

### B5 · Demo script *(the thing that wins the room)*
- A tight **~3-minute walkthrough** of the **5 demo personas** (Lane A seeds them — each is
  built to hit a different one of the 4 outcomes, plus one that **breaches** the clock).
- Write it as: for each persona → what we click → what the judges see → the one line we say.
- Include the "watch the clock breach and auto-draft the appeal" moment — that's the kicker.
- **Done when:** we can run all 5 personas end-to-end, on a phone-sized screen, in 3 minutes,
  without touching a terminal.

---

## 8. Design system (build to this — both lanes design to the same tokens)

Feel: **government paper, without the government-website pain.** Warm, calm, official.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `ink` | `#14140F` | primary text |
| `paper` | `#FBFAF6` | background |
| `seal` (seal green) | `#1B4D3E` | brand / issued / official chrome |
| `gold` (clock gold) | `#B8860B` | the statutory clock, running state, accents |
| `breach` (breach red) | `#A32D2D` | breach / reject / penalty — **only** for these |

Build both **light and dark** themes off these tokens (dark: ink becomes the ground, paper
the text; keep contrast legible; don't just invert).

**Type**
- **Display:** `Mukta` (700/800) — headings, the big outcome headline.
- **Body:** `Noto Sans Devanagari` — carries Hindi cleanly; use for all running text.
- **Data/mono** (optional): `IBM Plex Mono` — certificate numbers, IDs, the clock's day count.

**Layout rules**
- Mobile-first, 360px minimum. Single column on phones.
- Generous spacing, real type hierarchy, tasteful — not flashy. Let the clock be the star.

---

## 9. How the two lanes meet (working agreement)

- **The contract in section 6 is the only shared surface.** You build screens against it;
  Lane A produces data in exactly that shape. Neither side waits on the other.
- **Your files vs mine:** you live in `app/` (screens/routes) + your components + the i18n
  dict. Lane A lives in `lib/` (engine, sla, registries) + `prisma/` + the API route
  handlers. We rarely touch the same file.
- **If you need the contract changed:** don't hack around it — tell Dhananjai, we update
  `lib/contracts.ts` together and both rebuild to it. Once.
- **Stub freely.** Until an endpoint exists, mock it with a fixture matching the types so
  you're always moving.

---

## 10. Definition of done (your lane)

- A citizen can log in with a phone number and apply, in Hindi, on a 360px screen.
- The status page renders **all four outcomes** with their reasons.
- The **Statutory Clock** convincingly shows RUNNING → MET and RUNNING → BREACHED
  (with the auto-drafted appeal + penalty on breach).
- An issued application produces a clean, **printable certificate**.
- An **officer** can clear the FIELD_VERIFY queue; the **dashboard** reflects the data.
- We can demo **5 personas end-to-end in ~3 minutes** without a terminal.
- Everything is **bilingual** and nothing is a silent black box.

---

*Questions on scope or the contract → ping Dhananjai (Lane A / orchestration). Build boldly.*
