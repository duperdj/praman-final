"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLang, pick, bi } from "@/components/ui/lang";
import { useSession } from "@/components/ui/session";
import { FlowHeader } from "@/components/chrome/FlowHeader";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Icon } from "@/components/ui/Icon";
import { applyToService } from "@/components/api";
import { configFor, type Field as CfgField } from "@/components/catalog";
import { serviceBySlug } from "@/components/services";
import { DEMO_PERSONAS } from "@/components/demo";
import { inr } from "@/components/ui/format";

type Step = 1 | 2 | 3;
type Identity = { fullName: string; phone: string; aadhaarLike: string; samagraId: string; dateOfBirth: string; district: string; tehsil: string; addressLine: string };
const EMPTY: Identity = { fullName: "", phone: "", aadhaarLike: "", samagraId: "", dateOfBirth: "", district: "", tehsil: "", addressLine: "" };

export default function ApplyServicePage() {
  const { lang } = useLang();
  const { signIn } = useSession();
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug as string) || "income-certificate";
  const cfg = configFor(slug);
  const meta = serviceBySlug(slug);
  const serviceTitle = meta ? pick(lang, meta.service.title) : pick(lang, cfg.certTitle);

  const [step, setStep] = useState<Step>(1);
  const [otp, setOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [id, setId] = useState<Identity>(EMPTY);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  function setIdField(k: keyof Identity, v: string) { setId((p) => ({ ...p, [k]: v })); }
  function setFormField(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  function useSample(p: (typeof DEMO_PERSONAS)[number]) {
    setId({ ...p.applicant });
    if (slug === "income-certificate" || cfg.strategy === "income-threshold") {
      setForm({ annualIncome: String(p.statedAnnualIncome), incomeSource: p.incomeSource, purpose: p.purpose });
    } else {
      setForm({});
    }
    setShowSamples(false);
  }

  function verifyOtp() {
    if (otp && otpInput.trim() !== otp) return;
    signIn({ phone: id.phone.replace(/\D/g, "").slice(0, 10) || "0000000000", name: id.fullName || pick(lang, bi("आवेदक", "Applicant")) });
    setStep(2);
  }

  function validateDetails(): boolean {
    const e: Record<string, string> = {};
    (["fullName", "dateOfBirth", "district", "tehsil", "samagraId"] as (keyof Identity)[]).forEach((k) => {
      if (!id[k]?.trim()) e[k] = pick(lang, bi("यह आवश्यक है", "This is required"));
    });
    if (!/^\d{12}$/.test(id.aadhaarLike)) e.aadhaarLike = pick(lang, bi("12 अंक आवश्यक", "12 digits required"));
    for (const f of cfg.fields) {
      if (!f.required) continue;
      const v = (form[f.name] ?? "").trim();
      if (!v) e[f.name] = pick(lang, bi("यह आवश्यक है", "This is required"));
      else if ((f.type === "money" || f.type === "number") && !(Number(v) > 0)) e[f.name] = pick(lang, bi("0 से अधिक होना चाहिए", "Must be more than 0"));
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await applyToService(slug, {
        applicant: { ...id, phone: id.phone.replace(/\D/g, "").slice(0, 10).padEnd(10, "0"), addressLine: id.addressLine || "—" },
        form,
        lang,
      });
      signIn({ phone: id.phone.replace(/\D/g, "").slice(0, 10) || "0000000000", name: id.fullName });
      router.push(`/status/${res.application.id}`);
    } catch (err) {
      setSubmitError(String(err instanceof Error ? err.message : err));
      setSubmitting(false);
    }
  }

  const steps = useMemo(() => [bi("पहचान · OTP", "Identity · OTP"), bi("जानकारी", "Details"), bi("जाँच व जमा", "Review & submit")], []);

  return (
    <>
      <FlowHeader title={pick(lang, bi(`${serviceTitle} · चरण ${step}/3`, `${serviceTitle} · Step ${step}/3`))} />
      <main id="main" className="container" style={{ padding: "40px var(--gutter) 80px" }}>
        {/* STEP 1 — identity */}
        {step === 1 && (
          <div style={{ maxWidth: 460 }}>
            <h1 className="h-page">{pick(lang, bi("आवेदन शुरू करें", "Start your application"))}</h1>
            <p style={{ font: "var(--type-body)", color: "var(--ink-800)", marginTop: 12 }}>
              {pick(lang, bi("अपना मोबाइल नंबर दर्ज करें। हम एक OTP भेजेंगे। कोई पासवर्ड नहीं, कोई कैप्चा नहीं।", "Enter your mobile number. We'll send an OTP. No password, no captcha."))}
            </p>
            <div style={{ marginTop: 20 }}>
              <Field label={pick(lang, bi("मोबाइल नंबर", "Mobile number"))} prefix="+91" inputMode="numeric" value={id.phone} onChange={(e) => setIdField("phone", (e.target as HTMLInputElement).value)} placeholder="9xxxxxxxxx" />
            </div>
            {otp ? (
              <>
                <Callout tone="info" style={{ marginBottom: 16 }}>
                  {pick(lang, bi("OTP आपके फ़ोन पर भेजा गया।", "An OTP was sent to your phone."))}{" "}
                  <span className="muted" style={{ fontSize: 13 }}>{pick(lang, bi("मूल्यांकन बिल्ड कोड:", "Evaluation build code:"))} <b className="mono">{otp}</b></span>
                </Callout>
                <Field label={pick(lang, bi("OTP दर्ज करें", "Enter OTP"))} inputMode="numeric" value={otpInput} onChange={(e) => setOtpInput((e.target as HTMLInputElement).value)} placeholder="0000" />
                <Button size="lg" fullWidth onClick={verifyOtp} iconAfter="arrow-right">{pick(lang, bi("सत्यापित करें", "Verify"))}</Button>
              </>
            ) : (
              <Button size="lg" fullWidth onClick={() => setOtp(String(Math.floor(1000 + Math.random() * 9000)))} disabled={id.phone.replace(/\D/g, "").length < 10}>
                {pick(lang, bi("OTP भेजें", "Send OTP"))}
              </Button>
            )}

            {/* Evaluation helper — sample accounts, clearly labelled */}
            <div style={{ marginTop: 28, borderTop: "1px solid var(--ink-200)", paddingTop: 16 }}>
              <button type="button" onClick={() => setShowSamples((s) => !s)} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--ink-500)", font: "var(--type-body-sm)", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
                <Icon name={showSamples ? "chevron-down" : "chevron-right"} size="sm" />
                {pick(lang, bi("मूल्यांकन के लिए नमूना खाता उपयोग करें", "Use a sample account (for evaluation)"))}
              </button>
              {showSamples ? (
                <div className="row wrap-gap" style={{ marginTop: 12 }}>
                  {DEMO_PERSONAS.map((p) => (
                    <button key={p.key} type="button" onClick={() => useSample(p)} style={{ padding: "6px 10px", cursor: "pointer", border: "2px solid var(--ink-300)", background: "transparent", font: "600 12px var(--font-sans)", color: "var(--ink-700)" }}>
                      {pick(lang, p.label)}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* STEP 2 — details */}
        {step === 2 && (
          <div style={{ maxWidth: 640 }}>
            <h1 className="h-page">{pick(lang, bi("आवेदक की जानकारी", "Applicant details"))}</h1>
            {Object.keys(errors).length ? <Callout tone="error" title={pick(lang, bi("कृपया त्रुटियाँ सुधारें", "Please fix the errors"))} style={{ margin: "16px 0" }} /> : null}
            <div className="grid grid-2" style={{ gap: 16, marginTop: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}><Field label={pick(lang, bi("पूरा नाम", "Full name"))} value={id.fullName} onChange={(e) => setIdField("fullName", (e.target as HTMLInputElement).value)} error={errors.fullName} /></div>
              <Field label={pick(lang, bi("जन्म तिथि", "Date of birth"))} value={id.dateOfBirth} onChange={(e) => setIdField("dateOfBirth", (e.target as HTMLInputElement).value)} placeholder="YYYY-MM-DD" error={errors.dateOfBirth} />
              <Field label={pick(lang, bi("समग्र सदस्य आईडी", "Samagra member ID"))} value={id.samagraId} onChange={(e) => setIdField("samagraId", (e.target as HTMLInputElement).value)} error={errors.samagraId} />
              <Field label={pick(lang, bi("जिला", "District"))} value={id.district} onChange={(e) => setIdField("district", (e.target as HTMLInputElement).value)} error={errors.district} />
              <Field label={pick(lang, bi("तहसील", "Tehsil"))} value={id.tehsil} onChange={(e) => setIdField("tehsil", (e.target as HTMLInputElement).value)} error={errors.tehsil} />
              <div style={{ gridColumn: "1 / -1" }}><Field label={pick(lang, bi("आधार संख्या", "Aadhaar number"))} inputMode="numeric" value={id.aadhaarLike} onChange={(e) => setIdField("aadhaarLike", (e.target as HTMLInputElement).value.replace(/\D/g, ""))} error={errors.aadhaarLike} /></div>
              <div style={{ gridColumn: "1 / -1" }}><Field label={pick(lang, bi("पता", "Address"))} value={id.addressLine} onChange={(e) => setIdField("addressLine", (e.target as HTMLInputElement).value)} /></div>
            </div>

            {cfg.fields.length ? (
              <>
                <h2 style={{ margin: "24px 0 12px" }}>{serviceTitle}</h2>
                <div className="grid grid-2" style={{ gap: 16 }}>
                  {cfg.fields.map((f) => (
                    <div key={f.name} style={{ gridColumn: f.type === "select" || f.name === "purpose" ? "1 / -1" : undefined }}>
                      <DynField f={f} lang={lang} value={form[f.name] ?? ""} onChange={(v) => setFormField(f.name, v)} error={errors[f.name]} />
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <Button size="lg" onClick={() => { if (validateDetails()) setStep(3); }} iconAfter="arrow-right">{pick(lang, bi("आगे बढ़ें", "Continue"))}</Button>
              <Button size="lg" variant="outline" onClick={() => setStep(1)}>{pick(lang, bi("वापस", "Back"))}</Button>
            </div>
          </div>
        )}

        {/* STEP 3 — review */}
        {step === 3 && (
          <div style={{ maxWidth: 640 }}>
            <h1 className="h-page">{pick(lang, bi("जाँचें और जमा करें", "Review & submit"))}</h1>
            <div className="hairline" style={{ background: "var(--ink-0)", marginTop: 16 }}>
              {[
                { k: bi("सेवा", "Service"), v: serviceTitle },
                { k: bi("नाम", "Name"), v: id.fullName },
                { k: bi("जिला · तहसील", "District · Tehsil"), v: `${id.district} · ${id.tehsil}` },
                ...cfg.fields.map((f) => ({ k: f.label, v: form[f.name] || "—" })),
                { k: bi("शुल्क", "Fee"), v: cfg.feeInr ? inr(cfg.feeInr) : pick(lang, bi("नि:शुल्क", "Free")) },
                { k: bi("समय-सीमा", "Deadline"), v: pick(lang, bi(`${cfg.slaDays} कार्य-दिवस`, `${cfg.slaDays} working days`)) },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--ink-100)" : undefined }}>
                  <span style={{ font: "var(--type-body-sm)", color: "var(--ink-600)" }}>{pick(lang, row.k)}</span>
                  <span style={{ font: "600 15px var(--font-sans)", color: "var(--ink-900)", textAlign: "right" }}>{row.v}</span>
                </div>
              ))}
            </div>
            <Callout tone="info" title={pick(lang, bi("स्व-घोषणा", "Self-declaration"))} style={{ marginTop: 16 }}>
              {pick(lang, bi("मैं घोषित करता/करती हूँ कि दी गई जानकारी सत्य है।", "I declare that the information provided is true."))}
            </Callout>
            {submitError ? <Callout tone="error" title={pick(lang, bi("जमा नहीं हो सका", "Could not submit"))} style={{ marginTop: 12 }}>{submitError}</Callout> : null}
            <div className="row" style={{ gap: 12, marginTop: 16 }}>
              <Button size="lg" onClick={submit} disabled={submitting} iconAfter={submitting ? undefined : "arrow-right"}>{submitting ? pick(lang, bi("जमा हो रहा है…", "Submitting…")) : pick(lang, bi("आवेदन जमा करें", "Submit application"))}</Button>
              <Button size="lg" variant="outline" onClick={() => setStep(2)} disabled={submitting}>{pick(lang, bi("वापस", "Back"))}</Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function DynField({ f, lang, value, onChange, error }: { f: CfgField; lang: "hi" | "en"; value: string; onChange: (v: string) => void; error?: string }) {
  const label = pick(lang, f.label);
  if (f.type === "select") {
    return (
      <div style={{ marginBottom: "var(--space-7)" }}>
        <label style={{ display: "block", font: "var(--type-label)", fontSize: "var(--text-base)", marginBottom: "var(--space-3)" }}>{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", font: "var(--type-body)", color: "var(--text-body)", padding: "8px var(--space-4)", minHeight: "var(--touch-min)", border: `2px solid ${error ? "var(--status-error)" : "var(--ink-900)"}`, borderRadius: 0, background: "var(--ink-0)" }}>
          <option value="">{pick(lang, bi("चुनें", "Select"))}</option>
          {f.options?.map((o) => <option key={o.value} value={o.value}>{pick(lang, o.label)}</option>)}
        </select>
        {error ? <p style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--status-error)", margin: "6px 0 0" }}>{error}</p> : null}
      </div>
    );
  }
  return (
    <Field
      label={label}
      prefix={f.prefix}
      inputMode={f.type === "money" || f.type === "number" ? "numeric" : f.type === "tel" ? "tel" : undefined}
      value={value}
      onChange={(e) => {
        const raw = (e.target as HTMLInputElement).value;
        onChange(f.type === "money" || f.type === "number" ? raw.replace(/[^\d]/g, "") : raw);
      }}
      placeholder={f.placeholder ? pick(lang, f.placeholder) : f.type === "date" ? "YYYY-MM-DD" : undefined}
      error={error}
    />
  );
}
