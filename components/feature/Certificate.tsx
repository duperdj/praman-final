import type { Application, Lang } from "@/lib/contracts";
import { pick, bi } from "@/components/ui/lang";
import { inr, formatDate } from "@/components/ui/format";
import { INCOME_SOURCES } from "@/components/demo";
import { configFor } from "@/components/catalog";

// The issued certificate — official-looking, printable, and service-aware: the
// heading, the certifying sentence and the facts all come from the service
// config + the applicant's answers. The number mirrors Lane A's store and the
// seal string matches the mocked signature; validity is one year.
export function Certificate({
  application,
  lang,
  serviceType = "income-certificate",
  formData,
}: {
  application: Application;
  lang: Lang;
  serviceType?: string;
  formData?: Record<string, string> | null;
}) {
  const cfg = configFor(serviceType);
  const year = new Date(application.submittedAt).getUTCFullYear();
  const number = `MP-${serviceType.slice(0, 3).toUpperCase()}-${year}-${application.id.slice(0, 8).toUpperCase()}`;
  const expires = new Date(application.submittedAt);
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const a = application.applicant;
  const isIncome = serviceType === "income-certificate";
  const src = INCOME_SOURCES.find((s) => s.value === application.incomeSource);

  // Facts: income for income services, otherwise the service's own fields.
  const facts: { k: { hi: string; en: string }; v: string; mono?: boolean }[] = [];
  if (isIncome) {
    facts.push({ k: bi("वार्षिक आय", "Annual income"), v: inr(application.statedAnnualIncome) });
    if (src) facts.push({ k: bi("स्रोत", "Source"), v: pick(lang, src.label) });
  } else if (formData) {
    for (const f of cfg.fields) {
      const val = formData[f.name];
      if (!val || f.name === "purpose") continue;
      facts.push({ k: f.label, v: f.type === "money" ? inr(Number(val)) : val });
    }
  }
  facts.push({ k: bi("समग्र आईडी", "Samagra ID"), v: a.samagraId, mono: true });
  facts.push({ k: bi("जारी दिनांक", "Issued"), v: formatDate(application.submittedAt, lang), mono: true });
  facts.push({ k: bi("वैध until", "Valid until"), v: formatDate(expires.toISOString(), lang), mono: true });

  const sentence = isIncome
    ? bi(
        `प्रमाणित किया जाता है कि ${a.fullName}, निवासी ${a.tehsil}, ${a.district} की वार्षिक आय ${inr(application.statedAnnualIncome)} है।`,
        `This certifies that ${a.fullName}, resident of ${a.tehsil}, ${a.district}, has an annual income of ${inr(application.statedAnnualIncome)}.`,
      )
    : bi(
        `प्रमाणित किया जाता है कि ${a.fullName}, निवासी ${a.tehsil}, ${a.district} को यह ${pick("hi", cfg.certTitle)} जारी किया जाता है।`,
        `This certifies that ${a.fullName}, resident of ${a.tehsil}, ${a.district}, is issued this ${pick("en", cfg.certTitle)}.`,
      );

  return (
    <div style={{ border: "1px solid var(--ink-900)", background: "var(--ink-0)" }}>
      <div style={{ background: "var(--blue-500)", color: "var(--ink-0)", padding: 16, textAlign: "center" }}>
        <div style={{ font: "600 15px var(--font-sans)" }}>{pick(lang, bi("मध्य प्रदेश शासन", "Government of Madhya Pradesh"))}</div>
        <div style={{ font: "800 20px var(--font-sans)", marginTop: 8 }}>{pick(lang, cfg.certTitle)}</div>
        <div className="mono" style={{ font: "var(--type-eyebrow)", letterSpacing: "var(--tracking-caps)", color: "rgba(255,255,255,.85)", marginTop: 2 }}>
          {pick(lang, cfg.certTitle).toUpperCase()}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", font: "var(--type-caption)", color: "var(--ink-500)", borderBottom: "1px solid var(--ink-200)", paddingBottom: 8 }}>
          <span>{pick(lang, bi("क्रमांक", "No."))}</span>
          <span style={{ color: "var(--ink-900)" }}>{number}</span>
        </div>
        <p style={{ font: "var(--type-body-sm)", color: "var(--ink-900)", margin: "14px 0 0" }}>{pick(lang, sentence)}</p>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {facts.map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", font: "var(--type-body-sm)", color: "var(--ink-600)", borderBottom: "1px solid var(--ink-100)", paddingBottom: 6 }}>
              <span>{pick(lang, row.k)}</span>
              <span className={row.mono ? "mono" : undefined} style={{ color: "var(--ink-900)" }}>{row.v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div aria-hidden style={{ width: 64, height: 64, background: "repeating-conic-gradient(var(--ink-900) 0 25%, var(--ink-0) 0 50%) 0 0/14px 14px", border: "3px solid var(--ink-900)" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ font: "var(--type-caption)", color: "var(--ink-600)" }}>{pick(lang, bi("डिजिटल हस्ताक्षरित", "Digitally signed"))}</div>
            <div style={{ font: "700 14px var(--font-sans)", color: "var(--ink-900)", marginTop: 4 }}>{pick(lang, bi("सक्षम अधिकारी", "Competent Authority"))}</div>
            <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-400)", marginTop: 2 }}>MP-SEAL-{application.id.slice(0, 12)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
