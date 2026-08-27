"use client";

import { useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { sendMessage } from "@/components/api";

const CATEGORIES = [
  bi("सेवा उपलब्ध नहीं / तकनीकी खराबी", "Service unavailable / technical fault"),
  bi("भुगतान की समस्या", "Payment issue"),
  bi("आवेदन में देरी / SLA उल्लंघन", "Application delay / SLA breach"),
  bi("अधिकारी का अनुचित व्यवहार", "Officer misconduct"),
  bi("प्रमाण पत्र में त्रुटि", "Error in certificate"),
  bi("सुगम्यता की समस्या", "Accessibility problem"),
  bi("अन्य", "Other"),
];

export default function ReportProblemPage() {
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ category: "", description: "", name: "", phone: "", consent: false });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const r = await sendMessage({
        kind: "GRIEVANCE",
        name: form.name,
        phone: form.phone,
        subject: form.category,
        body: form.description,
      });
      setTicketId(r.reference);
      setSubmitted(true);
    } catch {
      setError(pick(lang, bi("शिकायत दर्ज नहीं हो सकी। कृपया पुनः प्रयास करें।", "Could not file the grievance. Please try again.")));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Praman</div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("समस्या बताएँ", "Report a problem"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "56ch" }}>
              {pick(lang, bi(
                "सरकारी सेवा में किसी समस्या का सामना करना पड़ा? यहाँ शिकायत दर्ज करें — आपको एक संदर्भ नंबर मिलेगा।",
                "Encountered a problem with a government service? File your grievance here — you will receive a reference number."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px", maxWidth: 800 }}>
          {/* CM Helpline notice */}
          <Callout tone="info" title={pick(lang, bi("त्वरित समाधान: CM हेल्पलाइन 181", "Quick resolution: CM Helpline 181"))} style={{ marginBottom: 36 }}>
            {pick(lang, bi(
              "किसी भी सरकारी सेवा में समस्या के लिए 24×7 CM हेल्पलाइन 181 पर कॉल करें। फ़ोन पर तुरंत शिकायत दर्ज होती है और लाइव ट्रैकिंग मिलती है।",
              "For any government service problem call CM Helpline 181 — available 24×7. Grievance is recorded instantly over the phone with live tracking."
            ))}
          </Callout>

          <SectionHeading>{pick(lang, bi("ऑनलाइन शिकायत फ़ॉर्म", "Online grievance form"))}</SectionHeading>

          {submitted ? (
            <div style={{ background: "var(--surface-muted)", border: "1px solid var(--border-default)", padding: "var(--space-9)", textAlign: "center" }}>
              <Icon name="circle-check" size="lg" style={{ color: "var(--green-500)", marginBottom: 14 }} />
              <h2 style={{ font: "var(--type-h2)", margin: "0 0 8px" }}>{pick(lang, bi("शिकायत दर्ज हो गई", "Grievance filed"))}</h2>
              <p style={{ font: "var(--type-body)", color: "var(--ink-700)", margin: "0 0 6px" }}>
                {pick(lang, bi("आपका शिकायत नंबर:", "Your grievance number:"))}
              </p>
              <div style={{ font: "800 22px var(--font-sans)", color: "var(--blue-600)", margin: "0 0 16px", letterSpacing: 1 }}>{ticketId}</div>
              <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 24px", maxWidth: "48ch", marginLeft: "auto", marginRight: "auto" }}>
                {pick(lang, bi(
                  "इस नंबर को नोट करें। शिकायत की स्थिति CM हेल्पलाइन 181 पर या प्रमाण ट्रैक पृष्ठ पर जानें।",
                  "Note this number. Track your grievance status via CM Helpline 181 or the Praman track page."
                ))}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Button href="/track" variant="primary" size="sm">{pick(lang, bi("आवेदन ट्रैक करें", "Track application"))}</Button>
                <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setForm({ category: "", description: "", name: "", phone: "", consent: false }); }}>
                  {pick(lang, bi("नई शिकायत", "New grievance"))}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--space-6)" }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("समस्या की श्रेणी *", "Problem category *"))}</span>
                <select
                  name="category" required value={form.category} onChange={handleChange}
                  style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box", background: "var(--ink-0)" }}
                >
                  <option value="">{pick(lang, bi("चुनें", "Select a category"))}</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.en} value={c.en}>{pick(lang, c)}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("समस्या का विवरण *", "Problem description *"))}</span>
                <textarea
                  name="description" required rows={5} value={form.description} onChange={handleChange}
                  placeholder={pick(lang, bi("समस्या का विस्तृत विवरण दें — सेवा का नाम, आवेदन ID (यदि हो), और क्या हुआ।", "Describe the problem in detail — service name, application ID (if any), and what happened."))}
                  style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("नाम *", "Name *"))}</span>
                  <input
                    name="name" required value={form.name} onChange={handleChange}
                    placeholder={pick(lang, bi("आपका नाम", "Your name"))}
                    style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
                  />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("मोबाइल *", "Mobile *"))}</span>
                  <input
                    name="phone" required type="tel" value={form.phone} onChange={handleChange}
                    placeholder="9XXXXXXXXX"
                    style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
                  />
                </label>
              </div>

              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox" name="consent" required checked={form.consent} onChange={handleChange}
                  style={{ marginTop: 4, flexShrink: 0, width: 18, height: 18, cursor: "pointer" }}
                />
                <span style={{ font: "var(--type-body-sm)", color: "var(--ink-700)" }}>
                  {pick(lang, bi(
                    "मैं प्रमाणित करता/करती हूँ कि उपरोक्त जानकारी सत्य है और इस शिकायत की जाँच हेतु विभाग मुझसे संपर्क कर सकता है।",
                    "I certify that the above information is true and the department may contact me for investigation of this grievance."
                  ))}
                </span>
              </label>

              {error ? (
                <div role="alert" style={{ font: "var(--type-body-sm)", color: "var(--red-600, #c0392b)" }}>{error}</div>
              ) : null}
              <Button type="submit" variant="primary" size="md" iconAfter="send" fullWidth disabled={busy}>
                {busy ? pick(lang, bi("दर्ज हो रही है…", "Filing…")) : pick(lang, bi("शिकायत दर्ज करें", "File grievance"))}
              </Button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
