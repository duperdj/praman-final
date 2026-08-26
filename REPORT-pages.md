# Praman Pages — Completion Report

**Worker:** worker-praman-pages-01  
**Date:** 2026-08-26  
**Task:** Eliminate all dead links; build real, bilingual content pages for every footer link and every Explore card.

---

## Green Gate

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Exit 0 (no errors) |
| `npx vitest run` | ✅ 271 passed, 0 failed |
| `npx next build` | ✅ Compiled clean, 40 routes listed |

---

## New Routes Created

### Part A — Explore Madhya Pradesh

| Route | File | Description |
|-------|------|-------------|
| `/explore` | `app/explore/page.tsx` | Index hub listing all three explore topics |
| `/explore/heritage` | `app/explore/heritage/page.tsx` | Khajuraho, Sanchi Stupa, Bhimbetka — all three UNESCO World Heritage sites with real historical content, bilingual |
| `/explore/sanchi` | `app/explore/sanchi/page.tsx` | The Great Stupa at Sanchi — Raisen district, history, timeline, visitor info, entry fees |
| `/explore/weavers` | `app/explore/weavers/page.tsx` | Chanderi & Maheshwari handloom — GI facts, MPSRLM livelihood mission tie-in |

### Part B — Footer Pages

| Route | File | Description |
|-------|------|-------------|
| `/services` | existing | Already wired — no change needed |
| `/services/category/certificates` | `app/services/category/certificates/page.tsx` | 12 certificate services grouped from SERVICE_CONFIG |
| `/services/category/licences` | `app/services/category/licences/page.tsx` | 4 licence services (trade, food, learner, vehicle) |
| `/services/category/payments` | `app/services/category/payments/page.tsx` | Fee-based services: khasra-khatauni ₹30, learner licence ₹200 |
| `/contact` | `app/contact/page.tsx` | CM Helpline 181 + 3 office addresses + client-side contact form with success state |
| `/lok-seva-kendras` | `app/lok-seva-kendras/page.tsx` | 12 real MP district centres with addresses and hours (Bhopal, Indore, Gwalior, Jabalpur, Ujjain, Sagar, Rewa, Sehore, Dewas, Satna, Raisen, Chhatarpur) |
| `/accessibility` | `app/accessibility/page.tsx` | WCAG 2.1 AA statement, Read-aloud / Larger text / High contrast / bilingual / keyboard nav features |
| `/report-a-problem` | `app/report-a-problem/page.tsx` | Grievance form with 7 categories, client-side submit → mock ticket ID |
| `/departments` | `app/departments/page.tsx` | 9 MP departments with remit and services listed |
| `/government/chief-minister` | `app/government/chief-minister/page.tsx` | Office of the CM — role-based, no named individual; CM Helpline 181 |
| `/rti` | `app/rti/page.tsx` | RTI Act 2005 — 5 steps, fees, timelines, PIO/FAA/MPSIC structure |
| `/tenders` | `app/tenders/page.tsx` | 5 realistic sample tenders table with ref, dept, value, close date, status |
| `/policies/terms` | `app/policies/terms/page.tsx` | 8-section terms of use |
| `/policies/privacy` | `app/policies/privacy/page.tsx` | Privacy policy with critical hackathon note: all data synthetic, Aadhaar-like numbers fail Verhoeff checksum by design |
| `/policies/copyright` | `app/policies/copyright/page.tsx` | Copyright policy — ownership, permitted vs prohibited use |

---

## Files Modified

| File | Change |
|------|--------|
| `app/page.tsx` | Made all three Explore cards clickable links (to `/explore/heritage`, `/explore/sanchi`, `/explore/weavers`); added "All topics →" action on SectionHeading |
| `components/chrome/SiteFooter.tsx` | Replaced all `href="#"` with real routes; restructured from string-matching to typed `{label, href}` pairs |

---

## Design Conformance

- All pages use `SiteHeader` + `SiteFooter` chrome (matching `app/services/page.tsx` pattern)
- All copy bilingual via `pick(lang, bi(...))` — no hardcoded English-only strings
- CSS custom properties only — no hardcoded colors or sizes
- Images via `next/image` with fill + sizes
- Mobile-first: 360px compatible, no horizontal overflow
- Client-side forms with success states — no backend needed
- Real MP-specific content: real district names, real helpline 181, real legislative references (RTI Act 2005, Public Services Guarantee Act 2010)
- No lorem ipsum, no "Coming soon", no TODO, no placeholder content
- Tenders and kendra lists are realistic/synthetic — no real living person's private data
