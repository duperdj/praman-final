"use client";

import { useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { useSession } from "@/components/ui/session";
import { FlowHeader } from "@/components/chrome/FlowHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Tag } from "@/components/ui/Tag";
import { Icon } from "@/components/ui/Icon";
import { lookupByPhone, type LookupResult } from "@/components/api";
import { DEMO_PERSONAS } from "@/components/demo";
import { formatDate } from "@/components/ui/format";

const OUTCOME_TONE: Record<string, "success" | "warning" | "info" | "error" | "neutral"> = {
  AUTO_ISSUE: "success",
  FIELD_VERIFY: "warning",
  NEEDS_INPUT: "info",
  REJECT: "error",
};

export default function TrackPage() {
  const { lang } = useLang();
  const { signIn } = useSession();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [results, setResults] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    if (otp && otpInput.trim() !== otp) return;
    try {
      const r = await lookupByPhone(phone);
      setResults(r);
      setError(null);
      signIn({ phone: phone.replace(/\D/g, "").slice(0, 10), name: r.results[0]?.fullName ?? "आवेदक" });
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }

  return (
    <>
      <FlowHeader title={pick(lang, bi("आवेदन की स्थिति", "Track application"))} />
      <main id="main" className="container" style={{ padding: "40px var(--gutter) 80px", maxWidth: 560 }}>
        {!results ? (
          <>
            <h1 className="h-page">{pick(lang, bi("अपने आवेदन देखें", "See your applications"))}</h1>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", marginTop: 12 }}>
              {pick(lang, bi("मोबाइल नंबर और OTP से। कोई पासवर्ड नहीं।", "With your mobile number and an OTP. No password."))}
            </p>

            <div style={{ marginTop: 20 }}>
              <div className="eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>{pick(lang, bi("नमूना खाता (मूल्यांकन)", "Sample accounts (evaluation)"))}</div>
              <div className="row wrap-gap">
                {DEMO_PERSONAS.map((p) => (
                  <button key={p.key} type="button" onClick={() => setPhone(p.phone)} style={{ padding: "6px 10px", cursor: "pointer", border: "2px solid var(--ink-900)", background: phone === p.phone ? "var(--blue-50)" : "transparent", font: "600 12px var(--font-sans)", color: "var(--ink-900)" }}>
                    {pick(lang, p.label)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Field label={pick(lang, bi("मोबाइल नंबर", "Mobile number"))} prefix="+91" inputMode="numeric" value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} placeholder="9xxxxxxxxx" />
            </div>

            {otp ? (
              <>
                <Callout tone="info" style={{ marginBottom: 16 }}>
                  {pick(lang, bi("OTP आपके फ़ोन पर भेजा गया। ", "An OTP was sent to your phone. "))}
                  <span className="muted" style={{ fontSize: 13 }}>{pick(lang, bi("मूल्यांकन कोड:", "Evaluation code:"))} <b className="mono">{otp}</b></span>
                </Callout>
                <Field label={pick(lang, bi("OTP दर्ज करें", "Enter OTP"))} inputMode="numeric" value={otpInput} onChange={(e) => setOtpInput((e.target as HTMLInputElement).value)} placeholder="0000" />
                <Button size="lg" fullWidth onClick={verify} iconAfter="arrow-right">{pick(lang, bi("आवेदन देखें", "View applications"))}</Button>
              </>
            ) : (
              <Button size="lg" fullWidth onClick={() => setOtp(String(Math.floor(1000 + Math.random() * 9000)))} disabled={phone.replace(/\D/g, "").length < 10}>
                {pick(lang, bi("OTP भेजें", "Send OTP"))}
              </Button>
            )}
            {error ? <Callout tone="error" style={{ marginTop: 16 }}>{error}</Callout> : null}
          </>
        ) : (
          <>
            <h1 className="h-page">{pick(lang, bi("आपके आवेदन", "Your applications"))}</h1>
            {results.results.length === 0 ? (
              <Callout tone="info" style={{ marginTop: 16 }} title={pick(lang, bi("कोई आवेदन नहीं मिला", "No applications found"))}>
                {pick(lang, bi("इस नंबर से कोई आवेदन दर्ज नहीं है। नया आवेदन करें।", "No applications on this number yet. Start a new one."))}
                <div style={{ marginTop: 12 }}><Button href="/apply">{pick(lang, bi("नया आवेदन", "New application"))}</Button></div>
              </Callout>
            ) : (
              <div className="stack" style={{ gap: 12, marginTop: 20 }}>
                {results.results.map((r) => (
                  <a key={r.id} href={`/status/${r.id}`} className="hairline" style={{ background: "var(--ink-0)", padding: 16, textDecoration: "none", color: "var(--text-body)", display: "block" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <span style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{r.purpose}</span>
                      {r.outcome ? <Tag tone={OUTCOME_TONE[r.outcome] ?? "neutral"}>{r.outcome}</Tag> : null}
                    </div>
                    <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                      <span className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-500)" }}>{formatDate(r.submittedAt, lang)}</span>
                      <span className="row" style={{ gap: 6, font: "var(--type-body-sm)", color: "var(--blue-600)" }}>{pick(lang, bi("देखें", "View"))} <Icon name="arrow-right" size="sm" /></span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
