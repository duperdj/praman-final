# Praman engine notes

## Rule mapping and weights

| Rule | Kind | Weight | Fired result |
| --- | --- | ---: | --- |
| `RATION_CONTRADICTION` | hard | 100 | `REJECT` when an AAY/BPL card is paired with stated income over ₹1,00,000. |
| `PRIOR_SWING` | soft | 25 | `FIELD_VERIFY` when the change from last year's declared income is strictly over 40%. |
| `LAND_VS_INCOME` | soft | 30 | `FIELD_VERIFY` when estimated land income is strictly more than 1.5 times stated income. |
| `THRESHOLD_HUGGING` | soft | 20 | `FIELD_VERIFY` from 98% (inclusive) to below (exclusive) the inferred cutoff. |
| `EKYC_STALE` | blocking | 0 | `NEEDS_INPUT` with the exact eKYC update and resubmission action. |
| `IDENTITY_MISMATCH` | blocking | 0 | `NEEDS_INPUT` with the exact Aadhaar/Samagra correction and resubmission action. |
| `DUPLICATE_ACTIVE` | blocking | 0 | `NEEDS_INPUT` directing the citizen to use the active certificate or correct/cancel the record. |
| `SOURCE_INCOMPLETE` | soft | 20 | `FIELD_VERIFY` when land exists but the declared source is not `AGRICULTURE`. |

Soft scores are summed and capped at 60, keeping every soft-only decision in the specified 20–60 review band. A hard finding sets the decision score to 100 and produces `REJECT`; otherwise any blocking finding produces `NEEDS_INPUT`; otherwise a score of 20 or more produces `FIELD_VERIFY`; a score below 20 produces `AUTO_ISSUE`. Blocking findings have zero risk weight because they describe a citizen-fixable prerequisite, while their outcome override still stops issuance.

## Seeded persona expectations

| Persona | Engine result | Expected SLA story | Evidence |
| --- | --- | --- | --- |
| Sunita, Indore | `AUTO_ISSUE`, score 0 | `MET` immediately | No rule fires. |
| Ramesh, Dewas | `FIELD_VERIFY`, score 30 | Resolved within SLA | `LAND_VS_INCOME`: ₹2.5 lakh estimate versus ₹80,000 stated. |
| Kamla, Sehore | `FIELD_VERIFY`, score 30 | `BREACHED` when evaluated after the backdated deadline | `LAND_VS_INCOME`: ₹1.8 lakh estimate versus ₹95,000 stated. |
| Arjun, Bhopal | `NEEDS_INPUT`, score 0 | `RUNNING` with `paused=true` | `EKYC_STALE`: eKYC age is 26 months. |
| Ganpat, Ujjain (REJECT persona) | `REJECT`, score 100 | `CLOSED` | `RATION_CONTRADICTION`: AAY card and ₹4.2 lakh stated income. |

## Ambiguities resolved

- `Application.incomeSource` is a single frozen-contract enum, although the prose says “includes”; the rule therefore checks direct equality with `AGRICULTURE`.
- Purpose inference recognizes EWS and scholarship text (including common Hindi terms). Unknown purposes do not fire. The lower edge of the 2% band is included, while the cutoff itself is excluded because the rule says “under”.
- Missing/unavailable registry records do not fire unless an exact supplied fire-condition is true. No extra policy was invented for unavailable data.
- A hard contradiction wins if hard and blocking findings coexist. All eight rules still run and all firing signals remain attached.
- The spec does not define a soft-only total above 60. Individual weights remain visible on signals, while `Decision.score` is capped at 60 unless a hard rule fires.
- `decidedAt` uses `RegistrySnapshot.fetchedAt`, the supplied registry-read instant, so repeated evaluation of the same inputs is deterministic.
- The frozen `Application` does not carry urban/Samadhan flags, so the SLA API accepts those values separately. Urban and rural currently share the same three-day deadline.
- Saturdays count as working days because the requirement excludes Sundays (and seeded holidays), not Saturdays. Calendar comparisons use UTC date keys for timezone-independent results.
- The statutory due date skips Sundays and holidays. Once overdue, every started calendar day accrues ₹250; non-working-day exclusion was specified for the deadline calculation, not for penalty accrual.
- `NEEDS_INPUT`/`awaitingCitizen` suppresses breach and penalty accrual and sets `paused=true`. A caller may pass `pausedAt`; otherwise the pause is treated as starting with the SLA clock.
