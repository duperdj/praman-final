"use client";

import { useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Icon } from "@/components/ui/Icon";
import { verifyIncome, type VerifyResult } from "@/components/api";
import { DEMO_PERSONAS } from "@/components/demo";

export default function VerifyPage() {
  const { lang } = useLang();
  const [phone, setPhone] = useState("9800000001");
  const [threshold, setThreshold] = useState("250000");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await verifyIncome({ phone, threshold: Number(threshold) });
      setResult(r);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader active="services" />
      <main id="main" className="container" style={{ padding: "40px var(--gutter) 80px", maxWidth: 820 }}>
        <div className="eyebrow" style={{ color: "var(--blue-500)" }}>{pick(lang, bi("प्रमाण पत्र = डेटा", "Certificate as data"))}</div>
        <h1 className="h-page" style={{ marginTop: 8 }}>{pick(lang, bi("प्रमाण, कागज़ नहीं", "A proof, not paper"))}</h1>
        <p style={{ font: "var(--type-body)", color: "var(--ink-800)", marginTop: 12, maxWidth: "66ch" }}>
          {pick(lang, bi("एक छात्रवृत्ति पोर्टल PDF अपलोड करवाने के बजाय सीधे पूछ सकता है — “क्या यह परिवार सीमा से नीचे है?” — और प्रमाण जारी करने वाले से हस्ताक्षरित हाँ/नहीं पा सकता है। वास्तविक आय कभी उजागर नहीं होती।", "Instead of a PDF upload, a scholarship portal can ask directly — 'is this family under the limit?' — and get a signed yes/no from the issuer. The actual income is never disclosed."))}
        </p>

        {/* Mock external portal */}
        <div style={{ border: "1px solid var(--ink-300)", marginTop: 24 }}>
          <div className="mono" style={{ background: "var(--ink-100)", color: "var(--ink-700)", padding: "8px 16px", font: "var(--type-caption)", display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="landmark" size="sm" /> scholarships.mp.gov.in — {pick(lang, bi("उदाहरण उपभोक्ता पोर्टल", "example consumer portal"))}
          </div>
          <div style={{ padding: 24 }}>
            <div className="eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>{pick(lang, bi("आवेदक चुनें", "Choose an applicant"))}</div>
            <div className="row wrap-gap" style={{ marginBottom: 16 }}>
              {DEMO_PERSONAS.map((p) => (
                <button key={p.key} type="button" onClick={() => setPhone(p.phone)} style={{ padding: "6px 10px", cursor: "pointer", border: "2px solid var(--ink-900)", background: phone === p.phone ? "var(--blue-50)" : "transparent", font: "600 12px var(--font-sans)", color: "var(--ink-900)" }}>
                  {pick(lang, p.label)}
                </button>
              ))}
            </div>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <Field label={pick(lang, bi("मोबाइल नंबर", "Mobile number"))} prefix="+91" value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} />
              <Field label={pick(lang, bi("आय सीमा (₹)", "Income threshold (₹)"))} prefix="₹" inputMode="numeric" value={threshold} onChange={(e) => setThreshold((e.target as HTMLInputElement).value.replace(/[^\d]/g, ""))} />
            </div>
            <Button size="lg" onClick={ask} disabled={busy} iconAfter="arrow-right">
              {busy ? pick(lang, bi("पूछ रहे हैं…", "Asking…")) : pick(lang, bi("प्रमाण से पूछें", "Ask the issuer"))}
            </Button>

            {error ? <Callout tone="error" style={{ marginTop: 20 }} title={pick(lang, bi("कोई प्रमाण पत्र नहीं", "No certificate"))}>{error}</Callout> : null}

            {result ? (
              <div style={{ marginTop: 24, borderRight: `1px solid ${result.answer ? "var(--green-500)" : "var(--red-500)"}`, borderBottom: `1px solid ${result.answer ? "var(--green-500)" : "var(--red-500)"}`, borderLeft: `1px solid ${result.answer ? "var(--green-500)" : "var(--red-500)"}`, borderTop: `4px solid ${result.answer ? "var(--green-500)" : "var(--red-500)"}`, padding: 20 }}>
                <div className="row" style={{ gap: 12 }}>
                  <Icon name={result.answer ? "circle-check" : "triangle-alert"} size="xl" style={{ color: result.answer ? "var(--green-600)" : "var(--red-600)" }} />
                  <div>
                    <div style={{ font: "800 24px var(--font-sans)", color: result.answer ? "var(--green-600)" : "var(--red-600)" }}>
                      {result.answer ? pick(lang, bi("हाँ — सीमा से नीचे", "YES — under the limit")) : pick(lang, bi("नहीं — सीमा से ऊपर", "NO — over the limit"))}
                    </div>
                    <div style={{ font: "var(--type-body-sm)", color: "var(--ink-600)" }}>{pick(lang, bi("प्रश्न", "Question"))}: <span className="mono">{result.question}</span></div>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: "grid", gap: 8, font: "var(--type-body-sm)" }}>
                  <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--ink-100)", paddingBottom: 6 }}>
                    <span className="muted">{pick(lang, bi("संदर्भ", "Reference"))}</span><span className="mono" style={{ color: "var(--ink-900)" }}>{result.reference}</span>
                  </div>
                  <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--ink-100)", paddingBottom: 6 }}>
                    <span className="muted">{pick(lang, bi("हस्ताक्षरित उत्तर", "Signed answer"))}</span><span className="mono" style={{ color: "var(--ink-900)", wordBreak: "break-all", textAlign: "right", maxWidth: "60%" }}>{result.signed}</span>
                  </div>
                </div>
                <Callout tone="success" style={{ marginTop: 16 }}>{pick(lang, bi("कोई PDF नहीं, कोई अपलोड नहीं — और वास्तविक आय कभी साझा नहीं हुई।", "No PDF, no upload — and the actual income was never shared."))}</Callout>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
