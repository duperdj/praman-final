import type { RegistrySnapshot, MatchStatus, Lang } from "@/lib/contracts";
import { pick, bi } from "@/components/ui/lang";
import { inr } from "@/components/ui/format";

const STATUS_LOOK: Record<MatchStatus, { bg: string; fg: string }> = {
  MATCH: { bg: "var(--green-50)", fg: "var(--green-600)" },
  MISMATCH: { bg: "var(--red-50)", fg: "var(--red-600)" },
  NOT_FOUND: { bg: "var(--ink-100)", fg: "var(--ink-600)" },
  UNAVAILABLE: { bg: "var(--ink-100)", fg: "var(--ink-600)" },
};

function Chip({ status }: { status: MatchStatus }) {
  const l = STATUS_LOOK[status] ?? STATUS_LOOK.NOT_FOUND;
  return (
    <span className="mono" style={{ font: "var(--type-eyebrow)", letterSpacing: "var(--tracking-caps)", color: l.fg, background: l.bg, padding: "5px 8px" }}>
      {status}
    </span>
  );
}

// The five mock registries as an officer-readable snapshot (Spec §7).
export function RegistryTable({ registry, lang }: { registry: RegistrySnapshot; lang: Lang }) {
  const rows: { name: string; detail: string; status: MatchStatus }[] = [
    {
      name: pick(lang, bi("आधार", "Aadhaar")),
      detail:
        registry.aadhaar.status === "MATCH"
          ? pick(lang, bi("नाम व जन्मतिथि मेल", "Name & DOB match"))
          : pick(lang, bi("उपलब्ध नहीं", "Not available")),
      status: registry.aadhaar.status,
    },
    {
      name: pick(lang, bi("समग्र", "Samagra")),
      detail:
        registry.samagra.ekycStatus === "MISSING"
          ? pick(lang, bi("eKYC पूर्ण नहीं", "eKYC not completed"))
          : registry.samagra.ekycAgeMonths != null
            ? pick(lang, bi(`eKYC ${registry.samagra.ekycAgeMonths} माह पुराना`, `eKYC ${registry.samagra.ekycAgeMonths} months old`))
            : registry.samagra.familyId ?? "—",
      status: registry.samagra.status,
    },
    {
      name: pick(lang, bi("भू-अभिलेख", "Land record")),
      detail: registry.land.hasHoldings
        ? pick(lang, bi(`${registry.land.holdingHectares ?? "?"} हे · अनुमानित ${inr(registry.land.estAnnualIncome ?? 0)}`, `${registry.land.holdingHectares ?? "?"} ha · est. ${inr(registry.land.estAnnualIncome ?? 0)}`))
        : pick(lang, bi("कोई भूमि नहीं", "No holdings")),
      status: registry.land.status,
    },
    {
      name: pick(lang, bi("राशन", "Ration")),
      detail: registry.ration.cardType ? pick(lang, bi(`श्रेणी ${registry.ration.cardType}`, `${registry.ration.cardType} card`)) : "—",
      status: registry.ration.status,
    },
    {
      name: pick(lang, bi("पूर्व प्रमाण पत्र", "Prior certificate")),
      detail: registry.priorCertificate.hasUnexpiredThisYear
        ? pick(lang, bi("इस वर्ष वैध प्रमाण पत्र मौजूद", "Unexpired certificate this year"))
        : registry.priorCertificate.lastYearDeclaredIncome != null
          ? pick(lang, bi(`पिछले वर्ष ${inr(registry.priorCertificate.lastYearDeclaredIncome)}`, `Last year ${inr(registry.priorCertificate.lastYearDeclaredIncome)}`))
          : pick(lang, bi("कोई पूर्व प्रमाण पत्र नहीं", "No prior certificate")),
      status: registry.priorCertificate.status,
    },
  ];

  return (
    <div style={{ border: "1px solid var(--ink-200)" }}>
      {rows.map((r, i) => (
        <div
          key={r.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid var(--ink-200)" : undefined,
            background: r.status === "MISMATCH" ? "var(--red-50)" : "var(--ink-0)",
          }}
        >
          <div>
            <div style={{ font: "700 15px var(--font-sans)", color: "var(--ink-900)" }}>{r.name}</div>
            <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-500)" }}>{r.detail}</div>
          </div>
          <Chip status={r.status} />
        </div>
      ))}
    </div>
  );
}
