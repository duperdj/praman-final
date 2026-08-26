"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLang, pick, bi } from "@/components/ui/lang";
import { FlowHeader } from "@/components/chrome/FlowHeader";
import { StatutoryClock } from "@/components/feature/StatutoryClock";
import { DecisionHero, SignalList } from "@/components/feature/Decision";
import { StatusList, type StatusItem } from "@/components/ui/StatusList";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Field } from "@/components/ui/Field";
import { getApplication, resolveApplication, type StatusResult } from "@/components/api";
import { formatDate, formatDateTime } from "@/components/ui/format";
import type { Bilingual } from "@/lib/contracts";

export default function StatusPage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [data, setData] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [appealFiled, setAppealFiled] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getApplication(id);
      setData(res);
      setError(null);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const number = data ? `MP-IC-${new Date(data.application.submittedAt).getUTCFullYear()}-${data.application.id.slice(0, 7).toUpperCase()}` : "";

  return (
    <>
      <FlowHeader title={data ? pick(lang, bi("मेरा आवेदन", "My application")) + " · " + number : pick(lang, bi("आवेदन स्थिति", "Application status"))} />
      <main id="main">
        {loading && !data ? (
          <div className="container" style={{ padding: "64px var(--gutter)" }}>
            <p className="muted">{pick(lang, bi("लोड हो रहा है…", "Loading…"))}</p>
          </div>
        ) : error ? (
          <div className="container" style={{ padding: "64px var(--gutter)", maxWidth: 560 }}>
            <Callout tone="error" title={pick(lang, bi("आवेदन नहीं मिला", "Application not found"))}>
              {pick(lang, bi("इस क्रमांक से कोई आवेदन नहीं मिला। कृपया दोबारा जाँचें।", "No application matches this reference. Please check and try again."))}
              <div className="mono" style={{ marginTop: 8, font: "var(--type-caption)", color: "var(--ink-500)" }}>{error}</div>
            </Callout>
            <div style={{ marginTop: 16 }}>
              <Button href="/" variant="outline">{pick(lang, bi("मुख पृष्ठ", "Home"))}</Button>
            </div>
          </div>
        ) : data ? (
          <Loaded data={data} lang={lang} appealFiled={appealFiled} onFileAppeal={() => setAppealFiled(true)} onResolved={setData} number={number} />
        ) : null}
      </main>
    </>
  );
}

function Loaded({
  data,
  lang,
  appealFiled,
  onFileAppeal,
  onResolved,
  number,
}: {
  data: StatusResult;
  lang: "hi" | "en";
  appealFiled: boolean;
  onFileAppeal: () => void;
  onResolved: (d: StatusResult) => void;
  number: string;
}) {
  const { application, decision, sla, registry } = data;
  const answered = [registry.aadhaar, registry.samagra, registry.land, registry.ration, registry.priorCertificate].filter(
    (r) => r.status === "MATCH" || r.status === "MISMATCH",
  ).length;

  // Build the timeline from outcome + SLA (Application carries no event log).
  const steps: StatusItem[] = [
    { label: pick(lang, bi("आवेदन प्राप्त", "Application received")), detail: formatDateTime(application.submittedAt, lang), state: "done" },
    { label: pick(lang, bi("रजिस्ट्री जाँच पूरी", "Registry check complete")), detail: pick(lang, bi(`5 में से ${answered} उत्तर मिले`, `${answered} of 5 registries answered`)), state: "done" },
  ];
  if (decision.outcome === "AUTO_ISSUE") {
    steps.push({ label: pick(lang, bi("प्रमाण पत्र जारी", "Certificate issued")), detail: formatDate(application.submittedAt, lang), state: "done" });
  } else if (decision.outcome === "FIELD_VERIFY") {
    steps.push({ label: pick(lang, bi("पटवारी क्षेत्र जाँच", "Patwari field verification")), detail: pick(lang, bi(`अंतिम तिथि ${formatDate(sla.dueAt, lang)}`, `Due ${formatDate(sla.dueAt, lang)}`)), state: sla.status === "BREACHED" ? "done" : "current" });
    steps.push({ label: pick(lang, bi("निर्णय", "Decision")), detail: sla.status === "BREACHED" ? pick(lang, bi("समय-सीमा पार", "Deadline passed")) : formatDate(sla.dueAt, lang), state: sla.status === "BREACHED" ? "current" : "todo" });
  } else if (decision.outcome === "NEEDS_INPUT") {
    steps.push({ label: pick(lang, bi("आपकी कार्रवाई आवश्यक", "Your action needed")), detail: pick(lang, bi("घड़ी रुकी है", "Clock paused")), state: "current" });
    steps.push({ label: pick(lang, bi("निर्णय", "Decision")), state: "todo" });
  } else {
    steps.push({ label: pick(lang, bi("निर्णय: अस्वीकृत", "Decision: rejected")), detail: formatDate(decision.decidedAt, lang), state: "done" });
  }

  return (
    <div className="grid grid-main-aside" style={{ gap: 0 }}>
      {/* Main column */}
      <div style={{ borderRight: "1px solid var(--ink-200)" }}>
        <div style={{ padding: "var(--gutter)" }}>
          <DecisionHero decision={decision} lang={lang} />
          <h2 style={{ margin: "26px 0 12px" }}>{pick(lang, bi("निर्णय के कारण", "Why this decision"))}</h2>
          <SignalList signals={decision.signals} lang={lang} columns={2} />

          {/* Per-outcome primary action */}
          {decision.outcome === "AUTO_ISSUE" ? (
            <div style={{ marginTop: 20 }}>
              <Button href={`/certificate/${application.id}`} size="lg" icon="download">{pick(lang, bi("प्रमाण पत्र देखें", "View certificate"))}</Button>
            </div>
          ) : null}

          {decision.outcome === "FIELD_VERIFY" && sla.status === "MET" ? (
            <div style={{ marginTop: 20 }}>
              <Callout tone="success" title={pick(lang, bi("अधिकारी ने स्वीकृत किया — प्रमाण पत्र जारी", "Approved by the officer — certificate issued"))}>
                {pick(lang, bi("पटवारी जाँच के बाद तहसीलदार ने समय-सीमा के भीतर स्वीकृति दी।", "After the Patwari check, the Tehsildar approved within the deadline."))}
              </Callout>
              <div style={{ marginTop: 12 }}>
                <Button href={`/certificate/${application.id}`} size="lg" icon="download">{pick(lang, bi("प्रमाण पत्र देखें", "View certificate"))}</Button>
              </div>
            </div>
          ) : null}

          {decision.outcome === "NEEDS_INPUT" && decision.requiredInput?.length ? (
            <FixAndRecheck
              id={application.id}
              requiredInput={decision.requiredInput}
              lang={lang}
              onResolved={onResolved}
            />
          ) : null}

          {decision.outcome === "REJECT" ? (
            <div style={{ marginTop: 20 }}>
              <Callout tone="info" title={pick(lang, bi("आपका अधिकार", "Your right"))}>
                {pick(lang, bi("30 दिन के भीतर अनुविभागीय अधिकारी के समक्ष निःशुल्क अपील करें।", "Appeal free of charge before the Sub-Divisional Officer within 30 days."))}
              </Callout>
              <div className="row" style={{ gap: 12, marginTop: 12 }}>
                <Button size="lg" onClick={onFileAppeal} disabled={appealFiled}>{appealFiled ? pick(lang, bi("अपील दर्ज", "Appeal filed")) : pick(lang, bi("अपील करें", "Appeal"))}</Button>
                <Button size="lg" variant="outline" icon="download">{pick(lang, bi("आदेश डाउनलोड", "Download order"))}</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Aside */}
      <div style={{ padding: "var(--space-8) var(--space-6)", background: "var(--ink-50)" }} className="stack">
        <div className="stack" style={{ gap: 18 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>{pick(lang, bi("आपके आवेदन की समय-सीमा", "Your deadline, by law"))}</div>
            <StatutoryClock sla={sla} lang={lang} />
            <p style={{ font: "var(--type-caption)", color: "var(--ink-500)", margin: "8px 0 0" }}>
              {pick(lang, bi("कानून से 3 कार्यदिवस · हर खंड एक दिन · लाल होने पर कार्यालय आपको ₹250/दिन देता है।", "3 working days by law · each block is one day · if it turns red the office owes you ₹250/day."))}
            </p>
          </div>

          {sla.status === "BREACHED" && sla.appealDraft ? (
            <div style={{ background: "var(--ink-0)", borderRight: "1px solid var(--red-500)", borderBottom: "1px solid var(--red-500)", borderLeft: "1px solid var(--red-500)", borderTop: "4px solid var(--red-500)", padding: 16 }}>
              <div className="eyebrow" style={{ color: "var(--red-600)" }}>{pick(lang, bi("अपील का मसौदा तैयार", "Appeal drafted"))}</div>
              <p style={{ font: "var(--type-body-sm)", color: "var(--ink-800)", margin: "10px 0 0" }}>{pick(lang, sla.appealDraft)}</p>
              <div style={{ marginTop: 12 }}>
                <Button size="md" fullWidth onClick={onFileAppeal} disabled={appealFiled}>
                  {appealFiled ? pick(lang, bi("अपील दर्ज हो गई", "Appeal filed")) : pick(lang, bi("एक टैप में अपील दर्ज करें", "File appeal in one tap"))}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="stack" style={{ background: "var(--ink-0)", border: "1px solid var(--ink-200)", padding: 16, gap: 14 }}>
            <div className="eyebrow" style={{ color: "var(--ink-500)" }}>{pick(lang, bi("प्रगति", "Progress"))}</div>
            <StatusList items={steps} />
          </div>

          <Button href="tel:181" variant="outline" size="lg" fullWidth icon="phone">{pick(lang, bi("सहायता · 181", "Help · 181"))}</Button>
        </div>
      </div>
    </div>
  );
}

/** Inline "fix the one flagged thing and re-check" — no re-filling the form.
 *  Shows exactly what needs fixing, takes the corrected detail, calls the
 *  resolve endpoint, and swaps in the new decision in place. */
function FixAndRecheck({
  id,
  requiredInput,
  lang,
  onResolved,
}: {
  id: string;
  requiredInput: Bilingual[];
  lang: "hi" | "en";
  onResolved: (d: StatusResult) => void;
}) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setFailed(false);
    setErr(null);
    try {
      const res = await resolveApplication(id, { correctedDetail: value.trim() });
      if (res.resolved) {
        onResolved(res); // clears NEEDS_INPUT → shows the new decision in place
      } else {
        setFailed(true); // still not verified — let them try again
        onResolved(res);
      }
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <Callout tone="warning" title={pick(lang, bi("आगे बढ़ने के लिए यह ठीक करें", "Fix this to continue"))}>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          {requiredInput.map((r, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{pick(lang, r)}</li>
          ))}
        </ul>
      </Callout>

      <div className="stack" style={{ marginTop: 12, background: "var(--ink-0)", border: "1px solid var(--ink-200)", padding: 16, gap: 12 }}>
        <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>
          {pick(lang, bi(
            "पूरा फ़ॉर्म दोबारा भरने की ज़रूरत नहीं — बस ठीक की गई जानकारी दें और हम तुरंत फिर से जाँच लेंगे।",
            "No need to re-fill the whole form — just give the corrected detail and we'll re-check instantly.",
          ))}
        </p>
        <Field
          label={pick(lang, bi("सुधारी गई जानकारी / संदर्भ", "Corrected detail / reference"))}
          value={value}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
          placeholder={pick(lang, bi("उदा. नया eKYC संदर्भ या सही नाम", "e.g. new eKYC reference or corrected name"))}
        />
        {failed ? (
          <Callout tone="error" title={pick(lang, bi("अभी भी सत्यापित नहीं हुआ", "Still not verified"))}>
            {pick(lang, bi("अभिलेख से मेल नहीं हुआ। कृपया सही जानकारी देकर पुनः प्रयास करें।", "That didn't match the records. Please provide the correct detail and try again."))}
          </Callout>
        ) : null}
        {err ? (
          <p style={{ font: "var(--type-caption)", color: "var(--red-600)", margin: 0 }}>{err}</p>
        ) : null}
        <div>
          <Button size="lg" iconAfter="arrow-right" onClick={submit} disabled={busy || value.trim().length === 0}>
            {busy
              ? pick(lang, bi("पुनः जाँच हो रही है…", "Re-checking…"))
              : pick(lang, bi("सुधार जमा करें और पुनः जाँचें", "Submit correction & re-check"))}
          </Button>
        </div>
      </div>
    </div>
  );
}
