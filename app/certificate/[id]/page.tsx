"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLang, pick, bi } from "@/components/ui/lang";
import { FlowHeader } from "@/components/chrome/FlowHeader";
import { Certificate } from "@/components/feature/Certificate";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { getApplication, type StatusResult } from "@/components/api";

export default function CertificatePage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [data, setData] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getApplication(id).then(setData).catch((e) => setError(String(e)));
  }, [id]);

  return (
    <>
      <FlowHeader
        title={pick(lang, bi("प्रमाण पत्र", "Certificate"))}
        right={
          <span className="no-print" style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" icon="printer" onClick={() => window.print()}>
              {pick(lang, bi("प्रिंट / डाउनलोड", "Print / download"))}
            </Button>
          </span>
        }
      />
      <main id="main" className="container" style={{ padding: "32px var(--gutter) 80px", maxWidth: 640 }}>
        {error ? (
          <Callout tone="error" title={pick(lang, bi("नहीं मिला", "Not found"))}>{error}</Callout>
        ) : !data ? (
          <p className="muted">{pick(lang, bi("लोड हो रहा है…", "Loading…"))}</p>
        ) : data.decision.outcome !== "AUTO_ISSUE" && data.sla.status !== "MET" ? (
          <Callout tone="info" title={pick(lang, bi("अभी प्रमाण पत्र जारी नहीं", "Certificate not issued yet"))}>
            {pick(lang, bi("यह आवेदन अभी प्रक्रिया में है। निर्णय के बाद प्रमाण पत्र यहाँ उपलब्ध होगा।", "This application is still in process. The certificate will appear here once decided."))}
            <div style={{ marginTop: 12 }}>
              <Button href={`/status/${id}`} variant="outline">{pick(lang, bi("स्थिति देखें", "View status"))}</Button>
            </div>
          </Callout>
        ) : (
          <>
            <Certificate application={data.application} lang={lang} serviceType={data.serviceType} formData={data.formData} />
            <div className="no-print row" style={{ gap: 12, marginTop: 20 }}>
              <Button size="lg" icon="download" onClick={() => window.print()}>{pick(lang, bi("डाउनलोड", "Download"))}</Button>
              <Button size="lg" variant="outline" icon="share-2">{pick(lang, bi("भेजें", "Share"))}</Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
