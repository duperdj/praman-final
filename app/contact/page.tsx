"use client";

import { useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const OFFICES = [
  {
    name: bi("मध्य प्रदेश लोक सेवा आयोग — मुख्यालय", "MP Public Services Commission — Head Office"),
    address: bi("वल्लभ भवन, भोपाल — 462004", "Vallabh Bhawan, Bhopal — 462004"),
    phone: "0755-2441900",
    hours: bi("सोमवार–शुक्रवार 10:00–17:30", "Mon–Fri 10:00–17:30"),
  },
  {
    name: bi("सामान्य प्रशासन विभाग", "General Administration Department"),
    address: bi("मंत्रालय, वल्लभ भवन, भोपाल — 462002", "Mantralaya, Vallabh Bhawan, Bhopal — 462002"),
    phone: "0755-2441200",
    hours: bi("सोमवार–शुक्रवार 10:00–17:30", "Mon–Fri 10:00–17:30"),
  },
  {
    name: bi("ई-डिस्ट्रिक्ट नोडल — NIC भोपाल", "e-District Nodal — NIC Bhopal"),
    address: bi("एनआईसी भवन, अरेरा हिल्स, भोपाल", "NIC Building, Arera Hills, Bhopal"),
    phone: "0755-2552011",
    hours: bi("सोमवार–शुक्रवार 09:30–18:00", "Mon–Fri 09:30–18:00"),
  },
];

export default function ContactPage() {
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Praman</div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("संपर्क करें", "Contact us"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "56ch" }}>
              {pick(lang, bi(
                "तकनीकी सहायता, फ़ीडबैक या किसी अन्य प्रश्न के लिए — हम यहाँ हैं।",
                "For technical support, feedback or any other query — we are here."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          <div className="grid grid-2" style={{ gap: "var(--space-12)", alignItems: "start" }}>

            {/* Left — helpline + offices */}
            <div>
              {/* CM Helpline callout */}
              <div style={{ background: "var(--blue-500)", color: "var(--ink-0)", padding: "var(--space-7)", marginBottom: "var(--space-8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: 8 }}>
                  <Icon name="phone" size="lg" />
                  <span style={{ font: "800 28px var(--font-sans)" }}>181</span>
                </div>
                <h2 style={{ font: "var(--type-h3)", margin: "0 0 6px", color: "var(--ink-0)" }}>
                  {pick(lang, bi("मुख्यमंत्री हेल्पलाइन", "Chief Minister Helpline"))}
                </h2>
                <p style={{ font: "var(--type-body-sm)", margin: "0 0 16px", color: "rgba(255,255,255,.9)" }}>
                  {pick(lang, bi(
                    "24×7 उपलब्ध। सरकारी सेवाओं, शिकायत निवारण और किसी भी नागरिक समस्या के लिए।",
                    "Available 24×7. For government services, grievance redress and any citizen issue."
                  ))}
                </p>
                <a href="tel:181" style={{ font: "700 16px var(--font-sans)", color: "var(--ink-0)", textDecoration: "underline" }}>
                  {pick(lang, bi("181 पर कॉल करें", "Call 181"))}
                </a>
              </div>

              <SectionHeading level={2}>{pick(lang, bi("कार्यालय पते", "Office addresses"))}</SectionHeading>
              <div style={{ display: "grid", gap: "var(--space-5)" }}>
                {OFFICES.map((o) => (
                  <div key={o.phone} className="hairline" style={{ background: "var(--ink-0)", padding: "var(--space-6)" }}>
                    <div style={{ font: "600 15px var(--font-sans)", color: "var(--ink-900)", marginBottom: 4 }}>{pick(lang, o.name)}</div>
                    <div style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", marginBottom: 4 }}>{pick(lang, o.address)}</div>
                    <div style={{ font: "var(--type-body-sm)", color: "var(--ink-700)" }}>
                      <a href={`tel:${o.phone}`} style={{ color: "var(--blue-600)" }}>{o.phone}</a>
                      {" · "}
                      {pick(lang, o.hours)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "var(--space-7)", font: "var(--type-body-sm)", color: "var(--ink-700)" }}>
                <strong>{pick(lang, bi("ईमेल:", "Email:"))}</strong>{" "}
                <a href="mailto:support@praman.mp.gov.in" style={{ color: "var(--blue-600)" }}>support@praman.mp.gov.in</a>
              </div>
            </div>

            {/* Right — contact form */}
            <div>
              <SectionHeading level={2}>{pick(lang, bi("संदेश भेजें", "Send a message"))}</SectionHeading>

              {submitted ? (
                <div style={{ background: "var(--green-50, #f0fdf4)", border: "1px solid var(--green-500)", padding: "var(--space-8)", textAlign: "center" }}>
                  <Icon name="circle-check" size="lg" style={{ color: "var(--green-500)", marginBottom: 12 }} />
                  <h3 style={{ font: "var(--type-h3)", margin: "0 0 8px" }}>{pick(lang, bi("संदेश भेजा गया!", "Message sent!"))}</h3>
                  <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 16px" }}>
                    {pick(lang, bi(
                      "आपका संदेश हमें मिल गया है। 2 कार्य दिवसों में जवाब दिया जाएगा। आपका संदर्भ नंबर: PRN-" + Math.floor(100000 + Math.random() * 900000),
                      "Your message has been received. We will respond within 2 working days. Your reference: PRN-" + Math.floor(100000 + Math.random() * 900000)
                    ))}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    {pick(lang, bi("नया संदेश", "Send another"))}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--space-5)" }}>
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
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("ईमेल", "Email"))}</span>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder={pick(lang, bi("वैकल्पिक", "Optional"))}
                      style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("विषय *", "Subject *"))}</span>
                    <select
                      name="subject" required value={form.subject} onChange={handleChange}
                      style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box", background: "var(--ink-0)" }}
                    >
                      <option value="">{pick(lang, bi("चुनें", "Select"))}</option>
                      <option value="technical">{pick(lang, bi("तकनीकी समस्या", "Technical issue"))}</option>
                      <option value="certificate">{pick(lang, bi("प्रमाण पत्र सम्बंधी", "Certificate query"))}</option>
                      <option value="feedback">{pick(lang, bi("सुझाव / फ़ीडबैक", "Feedback / suggestion"))}</option>
                      <option value="other">{pick(lang, bi("अन्य", "Other"))}</option>
                    </select>
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ font: "var(--type-label)", fontSize: "var(--text-sm)" }}>{pick(lang, bi("संदेश *", "Message *"))}</span>
                    <textarea
                      name="message" required rows={5} value={form.message} onChange={handleChange}
                      placeholder={pick(lang, bi("आपकी समस्या या सुझाव विस्तार से बताएँ", "Describe your issue or suggestion in detail"))}
                      style={{ border: "1.5px solid var(--border-default)", padding: "10px 14px", font: "var(--type-body)", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" }}
                    />
                  </label>
                  <Button type="submit" variant="primary" size="md" iconAfter="send" fullWidth>
                    {pick(lang, bi("संदेश भेजें", "Send message"))}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
