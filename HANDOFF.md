# Praman — Lane A → Lane B Handoff (for Soham)

**Repo:** `duperdj/praman` · **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind + Prisma/SQLite + Zod + Vitest

This is everything you need to build **Lane B (the UI)** on top of the finished
**Lane A (the backend)**. The backend is done, tested (270 passing), and running.
Your job is the citizen + officer screens — built **inside this repo**, calling the
real API. Your Claude Design mockups are the visual spec; this doc is the wiring.

---

## 1. Get it running (5 minutes)

```bash
git clone https://github.com/duperdj/praman.git
cd praman
npm install                 # postinstall runs `prisma generate`
npx prisma migrate deploy   # create the SQLite DB
node prisma/seed.mjs        # seed 45 applications (5 demo personas + 40 filler)
npm run dev                 # → http://localhost:3000
```

Other commands:
- `npm test` — the Vitest suite (should be **270 passing**)
- `npm run build` — production build (must stay green)
- `npm run db:reset` — wipe + re-migrate + re-seed the DB

> If `npm run db:reset` ever refuses on your machine, use:
> `rm prisma/dev.db && npx prisma migrate deploy && node prisma/seed.mjs`

---

## 2. Who owns what (so we never conflict)

| You build (Lane B) | Already done — **do not edit** (Lane A) |
| --- | --- |
| `app/` pages & routes (citizen flow, status, officer, dashboard) | `lib/engine`, `lib/sla` (the engine) |
| `components/` (your UI components) | `lib/registries`, `data/personas.ts` |
| styling within the existing tokens | `app/api/**` (the API routes) |
| | `lib/contracts.ts` (the shared types — **frozen**) |
| | `prisma/` (schema, seed, migrations) |

**Golden rules:**
1. **Do NOT re-scaffold.** The Next app, Tailwind, tokens, fonts, i18n, and Prisma are
   already set up. Running `create-next-app` or changing configs will break the backend.
   Just add pages/components under `app/` and `components/`.
2. **Import types from `lib/contracts.ts`** — never redefine them. If you think a type
   needs to change, ping Dhananjai; we change it together, once.
3. **Talk to the backend only through the 4 API routes** (section 4). Don't import
   `lib/engine` etc. directly into UI — call the endpoints.
4. Work on a **branch**, not `main` (section 7).

---

## 3. The types your UI consumes

All defined in **`lib/contracts.ts`** (v1.1, frozen). The two you'll use most:

```ts
type Outcome = "AUTO_ISSUE" | "FIELD_VERIFY" | "NEEDS_INPUT" | "REJECT";
type Bilingual = { hi: string; en: string };

interface Decision {
  applicationId: string;
  outcome: Outcome;
  score: number;               // 0..100
  signals: Signal[];           // the reasons — show these
  headline: Bilingual;         // one-line summary of the outcome
  requiredInput?: Bilingual[]; // for NEEDS_INPUT: the exact fix(es) to show the citizen
  decidedAt: string;
}

interface Signal {
  ruleId: string;              // e.g. "LAND_VS_INCOME"
  severity: "OK" | "INFO" | "WARN" | "BLOCK";  // color your rows by this
  reason: Bilingual;           // human-readable, show hi or en per language
  weightedScore?: number;
}

// The Statutory Clock — drive your 3-segment clock entirely off this:
type SlaStatus = "RUNNING" | "MET" | "BREACHED" | "CLOSED";
interface SlaState {
  startedAt: string;
  dueAt: string;               // startedAt + 3 working days
  workingDaysAllowed: number;  // 3
  workingDaysElapsed: number;  // 0..n  → fill your segments from this
  status: SlaStatus;           // color: RUNNING gold, MET green, BREACHED red
  paused?: boolean;            // true while NEEDS_INPUT (citizen action pending)
  breachedAt?: string;
  penaltyAccruedInr: number;   // ₹250 × days over — show on breach
  appealDraft?: Bilingual;     // auto-drafted appeal — reveal on breach
}
```

(Full `Application`, `Applicant`, `RegistrySnapshot` shapes are in the same file.)

---

## 4. The API (this is your contract)

Base URL in dev: `http://localhost:3000`

### `POST /api/applications` — file an application
Body:
```json
{
  "applicant": {
    "fullName": "Ramesh Kumar",
    "phone": "9876543210",
    "aadhaarLike": "345678901239",
    "samagraId": "SMG-R",
    "dateOfBirth": "1985-04-12",
    "district": "Dewas",
    "tehsil": "Dewas",
    "addressLine": "Ward 4"
  },
  "statedAnnualIncome": 80000,
  "incomeSource": "AGRICULTURE",
  "purpose": "EWS certificate",
  "lang": "hi"
}
```
→ **201** `{ application, decision, sla }` (validated with Zod; bad body → **400**).

### `GET /api/applications/:id` — the status page data
→ `{ application, decision, sla, registry }`. SLA is recomputed live against the demo
clock so the countdown is always current. Unknown id → **404**.

### `POST /api/dev/tick` — advance the demo clock (for the demo!)
Body: `{ "days": 5 }` moves the clock forward N working days and recomputes every
non-terminal application's SLA (so the clock visibly runs down and **breaches** on stage).
`{ "reset": true }` restores real time.

### `GET /api/officer/queue` — the officer's work list
→ the `FIELD_VERIFY` applications, each with their `signals` + live `sla` + `currentOwner`.

---

## 5. The 5 demo personas (use these `aadhaarLike` keys to test)

Send `POST /api/applications` with these to hit each outcome. (All Aadhaar-likes fail the
Verhoeff checksum by design — they're synthetic and can never be real.)

| Persona | `aadhaarLike` | Outcome | What the UI shows |
| --- | --- | --- | --- |
| Sunita, Indore | `234567890125` | **AUTO_ISSUE** | instant certificate |
| Ramesh, Dewas | `345678901239` | **FIELD_VERIFY** | routed to officer, reason shown, clock running |
| Kamla, Sehore | `456789012342` | **FIELD_VERIFY → BREACH** | clock runs out → red, penalty + appeal appear |
| Arjun, Bhopal | `567890123459` | **NEEDS_INPUT** | "update your eKYC" fix, clock **paused** |
| Ganpat, Ujjain | `678901234561` | **REJECT** | contradiction shown, can appeal |

> For Ramesh/Kamla to land exactly on `LAND_VS_INCOME`, send `statedAnnualIncome` ~80000–95000
> and `incomeSource: "AGRICULTURE"`. The seed already has all 45 in the DB, so the officer
> queue + dashboard are populated the moment you seed.

**Demo flow that wins the room:** apply as Arjun (NEEDS_INPUT, paused clock) or Sunita
(instant issue) → then `POST /api/dev/tick {days:5}` → watch Kamla breach: red clock,
₹1250+ penalty, auto-drafted appeal. That's the enforcement story.

---

## 6. Design system — already wired, just use it

- **Colors (Tailwind classes):** `bg-paper` `text-ink` `text-seal` (issued/official green)
  `text-gold` (the clock) `text-breach` (breach/reject). Light + dark both defined.
- **Fonts:** `font-display` (Mukta — headings), `font-body` (Noto Sans Devanagari — carries
  Hindi), `font-mono` (IBM Plex Mono — IDs/clock digits).
- **Language (Hindi default):** use the `useLang()` hook from `lib/i18n/useLang.tsx` and the
  `<LanguageToggle />` component (`components/LanguageToggle.tsx`). Add your strings to
  `lib/i18n/hi.ts` + `lib/i18n/en.ts`. **Never hard-code English** — read from the dict.
- **Must work at 360px wide.** Mobile-first. Hindi is the default, English is a toggle.

`app/page.tsx` is a placeholder landing page proving tokens + fonts + the toggle work —
use it as your reference, then replace/extend it.

---

## 7. Git workflow (so merging is painless)

```bash
git checkout -b lane-b-ui          # work on your own branch
# ...build your app/ pages + components...
git add -A
git commit -m "Lane B: citizen apply flow + status page"
git push -u origin lane-b-ui       # push your branch
```
Then open a Pull Request on GitHub (or tell Dhananjai). Because you only touch `app/`
pages + `components/` and we own `lib/`/`prisma/`/`app/api/`, the merge is clean.

---

## 8. Your Lane B checklist (from the design brief)

- [ ] Citizen apply flow — phone + OTP (mocked), bilingual form, 360px-first
- [ ] Status page + **Statutory Clock** (3 segments, all states — RUNNING/MET/BREACHED)
- [ ] The issued certificate (printable)
- [ ] Officer view (clear the FIELD_VERIFY queue) + dashboard
- [ ] Everything bilingual, nothing a silent black box

Questions on the API or types → ping Dhananjai. Build boldly. 🛠️
