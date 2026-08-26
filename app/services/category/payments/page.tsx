"use client";

import { useLang, pick, bi } from "@/components/ui/lang";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const PAYABLE = [
  {
    icon: "tractor",
    slug: "khasra-khatauni",
    title: bi("खसरा / खतौनी की प्रति", "Khasra / Khatauni copy"),
    fee: bi("₹30 प्रति प्रति", "₹30 per copy"),
    note: bi("भू-अभिलेख की प्रमाणित प्रति। भुगतान के साथ तत्काल जारी।", "Certified copy of land record. Issued immediately on payment."),
  },
  {
    icon: "id-card",
    slug: "learner-license",
    title: bi("लर्निंग ड्राइविंग लाइसेंस", "Learner driving licence"),
    fee: bi("₹200 प्रति आवेदन", "₹200 per application"),
    note: bi("मोटरसाइकिल (MCWG) या हल्का वाहन (LMV) के लिए अस्थायी लाइसेंस।", "Temporary licence for motorcycle (MCWG) or light vehicle (LMV)."),
  },
];

const HOW_STEPS = [
  bi("सेवा चुनें और आवेदन पत्र भरें।", "Choose the service and fill the application form."),
  bi("भुगतान पृष्ठ पर UPI, नेट बैंकिंग या डेबिट कार्ड से भुगतान करें।", "On the payment page, pay via UPI, net banking or debit card."),
  bi("भुगतान की पुष्टि के बाद आवेदन प्रणाली में दर्ज हो जाता है।", "After payment confirmation, the application is recorded in the system."),
  bi("खसरा-खतौनी के लिए: तत्काल PDF डाउनलोड। लर्निंग लाइसेंस: 3 कार्य दिवसों में जारी।", "Khasra-Khatauni: instant PDF download. Learner licence: issued within 3 working days."),
  bi("रसीद और लेनदेन ID अपने पास रखें।", "Keep the receipt and transaction ID for your records."),
];

export default function PaymentsPage() {
  const { lang } = useLang();
  return (
    <>
      <SiteHeader active="services" />
      <main id="main">
        <section style={{ background: "var(--blue-500)", color: "var(--ink-0)" }}>
          <div className="container" style={{ padding: "40px var(--gutter)" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>
              <a href="/services" style={{ color: "inherit", textDecoration: "none" }}>{pick(lang, bi("सेवाएँ", "Services"))}</a>
              {" → "}
              {pick(lang, bi("भुगतान", "Payments"))}
            </div>
            <h1 className="h-page" style={{ color: "var(--ink-0)", margin: "10px 0 0" }}>
              {pick(lang, bi("शुल्क-आधारित सेवाएँ", "Fee-based services"))}
            </h1>
            <p style={{ font: "var(--type-body)", color: "rgba(255,255,255,.92)", margin: "12px 0 0", maxWidth: "60ch" }}>
              {pick(lang, bi(
                "अधिकांश सरकारी सेवाएँ निःशुल्क हैं। कुछ सेवाओं में सामान्य शुल्क लागू होता है — यहाँ सूचीबद्ध।",
                "Most government services are free of charge. A small fee applies to certain services — listed here."
              ))}
            </p>
          </div>
        </section>

        <div className="container" style={{ padding: "48px var(--gutter) 80px" }}>
          <SectionHeading>{pick(lang, bi("शुल्क-आधारित सेवाएँ", "Services with a fee"))}</SectionHeading>

          <div className="grid grid-2" style={{ gap: "var(--space-8)", marginBottom: 48 }}>
            {PAYABLE.map((p) => (
              <div key={p.slug} className="card-flat" style={{ padding: "var(--space-7)" }}>
                <Icon name={p.icon} size="lg" style={{ color: "var(--blue-500)", marginBottom: "var(--space-4)" }} />
                <h2 style={{ font: "var(--type-h3)", margin: "0 0 6px" }}>{pick(lang, p.title)}</h2>
                <p style={{ font: "600 18px var(--font-sans)", color: "var(--blue-600)", margin: "0 0 10px" }}>{pick(lang, p.fee)}</p>
                <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: "0 0 20px" }}>{pick(lang, p.note)}</p>
                <Button href={`/services/${p.slug}`} variant="primary" size="sm" iconAfter="arrow-right">
                  {pick(lang, bi("आवेदन करें", "Apply now"))}
                </Button>
              </div>
            ))}
          </div>

          <SectionHeading>{pick(lang, bi("ऑनलाइन भुगतान कैसे करें", "How online payment works"))}</SectionHeading>
          <div style={{ marginBottom: 40 }}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "var(--space-5)", marginBottom: "var(--space-6)", alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--blue-500)", color: "var(--ink-0)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 15px var(--font-sans)", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ font: "var(--type-body)", color: "var(--ink-800)", margin: "8px 0 0" }}>{pick(lang, step)}</p>
              </div>
            ))}
          </div>

          <Callout tone="info" title={pick(lang, bi("भुगतान सुरक्षा", "Payment security"))}>
            <p style={{ margin: 0 }}>
              {pick(lang, bi(
                "प्रमाण पर सभी भुगतान राज्य सरकार के सुरक्षित भुगतान गेटवे से होते हैं। UPI, नेट बैंकिंग, डेबिट कार्ड और क्रेडिट कार्ड स्वीकार किए जाते हैं। भुगतान विफल होने पर राशि स्वतः वापस होती है — कोई मैन्युअल दावा नहीं। किसी समस्या पर CM हेल्पलाइन 181 पर संपर्क करें।",
                "All payments on Praman go through the state government's secure payment gateway. UPI, net banking, debit and credit cards are accepted. On payment failure, the amount is automatically reversed — no manual claim needed. For any issue contact CM Helpline 181."
              ))}
            </p>
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
