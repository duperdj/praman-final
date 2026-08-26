# MOCKED.md — the honesty ledger

Praman is a hackathon build. **All data is synthetic.** This file lists every
mock, stub, and shortcut and what it stands in for. It is append-only: each wave
adds its entries. Later, `/about/what-is-real` renders this page for judges.

> Non-negotiable (Spec.txt §4): no real Aadhaar, Samagra, or personal data
> anywhere in the repo. Aadhaar-like numbers are built to **fail the Verhoeff
> checksum** so they can never collide with a real person.

## Wave 1 — foundation (this scaffold)

| Mock / stub | What it is | What it stands in for | Owner / status |
|---|---|---|---|
| **SQLite `prisma/dev.db`** | File-based local database | A managed Postgres in production — swap `DATABASE_URL`, no code change (Spec.txt §5) | Jim · foundation |
| **Prisma schema (5 models)** | `Applicant`, `Application`, `Decision`, `Signal`, `SlaState`, mirroring `lib/contracts.ts` | The full data model from Spec.txt §7 (Family, Certificate, Appeal, PenaltyLedger, AuditLog, Officer, …) — layered on in Lane A Phase 1 | Jim · scaffold only |
| **i18n dictionary** | `hi` (default) + `en` chrome strings in `lib/i18n/` | A complete translated string catalogue for every screen — feature strings added by the screens that use them | Jim · minimal scaffold |
| **Landing page (`app/page.tsx`)** | Placeholder proving tokens + fonts + i18n toggle work | The real citizen entry / apply flow (Lane B, later waves) | Jim · placeholder |
| **No auth yet** | — | Phone + OTP (citizens) and a separate officer login — OTP shown on-screen in dev, per Spec.txt §4 | not built |
| **No engine / SLA / registries / API** | Empty skeleton folders with `.gitkeep` notes | The decision engine (§8), SLA math (§9), 5 mock registries (§7), and API routes (brief §6) | Lane A, later waves |

## Wave 2 — API routes (T5)

| Mock / stub | What it is | What it stands in for | Owner / status |
|---|---|---|---|
| **Demo clock (`POST /api/dev/tick`)** | A process-wide simulated "now" held in memory; tick advances it by N working days, reset returns to real time | The real wall clock. Exists only so the statutory countdown can be moved (and breached) live during the pitch. Resets on server restart. | Jim · dev-only |
| **Certificate `signature`** | `MOCK-SEAL-<id>` string on AUTO_ISSUE certificates | A real cryptographic seal / digital signature from the issuing authority | Jim · synthetic |
| **`Signal.weightedScore` packing** | Stored inside `Signal.meta` JSON (no dedicated column in the frozen schema) and unpacked on read | — (faithful round-trip, not a data mock) | Jim · impl note |
| **Officer / `currentOwner`** | The Patwari who holds a flagged file is looked up from the seeded `Officer` table; returns `null` until seeded | Real officer assignment / routing. Populated by Lane A's seed (T9). | Jim · depends on seed |

## Later waves

_Registries, engine determinism, seeded personas, mock OTP, mock SMS rows,
mock certificate signature, and the downstream verifier get their entries here
as they are built._
