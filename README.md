<div align="center">

# प्रमाण · Praman

**A re‑imagined Madhya Pradesh public‑services portal that actually keeps the promises the law already makes.**

Apply for a government certificate with just a phone number — and get an instant, explainable decision, verified against records the state already holds, on a visible statutory clock.

`Next.js 15` · `React 19` · `TypeScript` · `Prisma + PostgreSQL` · `Tailwind CSS` · `Zod` · `Vitest` · `Vercel`

</div>

---

## The idea

Getting an income certificate in Madhya Pradesh is, by law, a **3‑working‑day guarantee** under the Lok Seva Guarantee Act — and if the office is late, the responsible officer owes the citizen **₹250 for every day of delay**. In practice, the promise is invisible and unenforced: every application — even the obviously honest ones — waits behind a manual field visit to "verify" a document that was only ever the applicant's own word.

**Praman flips the model.** Instead of sending a human to every case, it checks each claim against government records that already exist, **auto‑issues the clean cases in seconds**, sends a person **only to the genuine anomalies — with the reason attached**, and makes the **statutory clock a first‑class, enforced object** so the deadline, the penalty, and the appeal all happen automatically.

> Verify against data the state already has → issue the clean cases instantly → send a human only to the anomalies → and keep the legal clock front and centre.

---

## Features

### For the citizen
- **Passwordless access** — phone number + OTP only. No passwords, no captcha.
- **Bilingual by default** — Hindi first, English a toggle away; every screen, in both.
- **A short, honest form** — a self‑declaration of income is the only input required.
- **An instant, explainable decision** — never a silent "pending"; every outcome carries a plain‑language reason in Hindi *and* English.
- **The statutory clock** — a live, 3‑segment countdown showing each working day, the officer currently holding the file, and — on a breach — a red clock with a running ₹250/day penalty and a **one‑tap, auto‑drafted appeal**.
- **A printable certificate** and a **track‑your‑application** flow.

### The decision engine — four outcomes
Every application is scored by **8 deterministic rules** against **5 government registries** and lands on one of four doors, each fully explained:

| Outcome | When | What the citizen sees |
|---|---|---|
| ✅ **Auto‑issue** | All records line up | Certificate issued in seconds |
| 👤 **Field verify** | A soft flag (e.g. land vs. income) | Routed to an officer *with the reason* |
| ✏️ **Needs input** | A fixable gap (e.g. stale eKYC) | The exact fix; the clock pauses |
| ⛔ **Reject** | A hard contradiction (e.g. AAY ration card + high income) | The contradiction shown; appeal or correct |

**Verified against 5 registries** — Aadhaar (identity), Samagra (family & eKYC), Land records, Ration category, and Prior certificates — each behind a **swappable adapter**, so the built‑in sample data is replaced by the real government APIs on deployment with no engine change.

### The statutory‑clock (SLA) engine
A separate, **pure‑function** module that turns the legal guarantee into enforced software: working‑day math (skips Sundays and the MP holiday list), breach detection, the ₹250/day penalty ledger, an auto‑drafted appeal routed to the assigned Patwari, and pause/resume while waiting on the citizen.

### For government staff
- **Officer console** — a restricted queue showing **only the flagged cases**, each with its reason, the registry evidence, and its own countdown; approve or return‑with‑reason.
- **Accountability dashboard** — breach rate by tehsil, auto‑issue rate, median decision time, and penalties accrued.

### Certificate‑as‑data
A downstream service (e.g. a scholarship portal) can ask a **threshold question** and receive a **signed yes/no** — data minimisation instead of a PDF upload, and a few hundred bytes instead of megabytes.

### Built for low‑bandwidth & accessibility
- **Works on 2G/3G and older phones** — server‑side rendering, **AVIF** images (a 1.4 MB hero photo ships as ~19 KB), lazy loading, and self‑hosted `display:swap` fonts.
- **Responsive down to 320 px**, one‑handed, ≥48 px tap targets.
- **Built‑in accessibility widget** — read‑aloud, larger text, and high‑contrast modes.

### One engine, every service
The same config‑driven engine powers **25 services across 6 departments** — income & domicile certificates, caste/EWS, pensions, land records, registrations, licences, and more. Adding a new service is **configuration, not code**.

---

## Tech stack

| Layer | Technology | Role |
|---|---|---|
| **Framework** | Next.js 15 (App Router) · React 19 | SSR, routing, and API routes in one codebase |
| **Language** | TypeScript | End‑to‑end, including the pure‑function engine |
| **Styling** | Tailwind CSS + a custom design system | Flat, square, gov‑grade UI; light/dark, bilingual type |
| **Data** | Prisma 6 + PostgreSQL | Neon in production; a real local Postgres via `embedded-postgres` (no Docker) |
| **Validation** | Zod | Every API input is schema‑validated |
| **Testing** | Vitest | **271 passing** unit tests over the engine, SLA and registries |
| **Hosting** | Vercel | Zero‑config deploy; images optimised at the edge |
| **Fonts / media** | `next/font` (self‑hosted) · AVIF | Low‑bandwidth performance |

**Design & AI collaboration:** the interface was drafted in **Claude Design** (inspired by UK/US government design systems), and the decision & SLA engine was built in TypeScript with **OpenAI Codex** as the co‑pilot — every rule reviewed, tuned to the MP Act, and covered by tests.

---

## Architecture at a glance

```
app/            # pages (citizen, officer, staff) + API routes
components/      # UI system, feature components, the service catalog + config
lib/
  engine/       # the decision engine — 8 pure rules → 4 outcomes (no I/O)
  sla/          # the statutory clock — working-day math, breach, penalty (pure)
  registries/   # 5 mock government registries behind clean interfaces
  contracts.ts  # the frozen shared types
prisma/         # schema, migrations, seed, and the local Postgres launcher
```

The core (`lib/engine`, `lib/sla`) is written as **pure functions** — no database, no network, the clock passed in as an argument — which is exactly what makes it fully testable and demonstrable.

---

## Deployment

Deployed on **Vercel** with a **Neon** PostgreSQL database.

- Set the Vercel project's **Root Directory** to `praman-final-main` (the app lives in a subfolder of the repo).
- Provide the Neon connection strings as environment variables (`POSTGRES_PRISMA_URL`, `DATABASE_URL_UNPOOLED`).
- The build runs migrations and seeds an empty database automatically (see `vercel.json`).

---

## Data & privacy

**All data in this build is synthetic.** There is no real Aadhaar, Samagra, or personal information anywhere — the Aadhaar‑like numbers are deliberately generated to **fail the real Verhoeff checksum**, so they can never collide with a real person. The registries are pluggable adapters that a production deployment swaps for the real government APIs, behind explicit citizen consent. See the in‑app honesty page at `/about/what-is-real`.

---

## Credits

Built for the **BuildWhatMovesIndia** hackathon. UI drafted in Claude Design; the decision & SLA engine built with OpenAI Codex; see `CREDITS.md`.

<div align="center">

*The state already promises this certificate in 3 days and already owes ₹250/day if it's late.*
**Praman is the software that finally keeps that promise — and proves it.**

</div>
