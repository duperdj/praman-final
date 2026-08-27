"use client";

import { useCallback, useEffect, useState } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { StaffHeader } from "@/components/chrome/StaffHeader";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ConfidenceBar, SignalList } from "@/components/feature/Decision";
import { RegistryTable } from "@/components/feature/RegistryTable";
import { ClockTrack } from "@/components/feature/StatutoryClock";
import { officerQueue, officerDecision, getApplication, type OfficerCase, type StatusResult } from "@/components/api";
import { inr } from "@/components/ui/format";

export default function OfficerConsole() {
  const { lang } = useLang();
  const [cases, setCases] = useState<OfficerCase[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<StatusResult | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await officerQueue();
      setCases(q.queue);
      setOwner(q.queue[0]?.currentOwner ?? "पटवारी");
      setSelectedId((prev) => prev ?? q.queue[0]?.application.id ?? null);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  useEffect(() => {
    if (!selectedId) { setDetail(null); return; }
    getApplication(selectedId).then(setDetail).catch(() => setDetail(null));
    setNote("");
  }, [selectedId]);

  const decide = useCallback(async (approve: boolean) => {
    if (!selectedId) return;
    await officerDecision(selectedId, approve, note);
    setCases((prev) => {
      const remaining = prev.filter((c) => c.application.id !== selectedId);
      setSelectedId(remaining[0]?.application.id ?? null);
      return remaining;
    });
  }, [selectedId, note]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) return;
      if (e.key === "a" || e.key === "A") decide(true);
      if (e.key === "r" || e.key === "R") decide(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decide]);

  const breaches = cases.filter((c) => c.sla.status === "BREACHED").length;

  return (
    <>
      <StaffHeader active="queue" officer={owner} />

      <main id="main" className="container" style={{ padding: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "16px var(--gutter)", borderBottom: "1px solid var(--ink-200)" }}>
          <h1 style={{ font: "var(--type-h2)", margin: 0 }}>{pick(lang, bi("क्षेत्र सत्यापन कतार", "Field-verification queue"))}</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tag tone="warning">{pick(lang, bi("चालू", "Open"))} {cases.length}</Tag>
            <Tag tone="error">{pick(lang, bi("उल्लंघन", "Breach"))} {breaches}</Tag>
          </div>
        </div>
        <div className="grid grid-queue" style={{ gap: 0, minHeight: 560 }}>
          {/* Queue list */}
          <div style={{ borderRight: "1px solid var(--ink-200)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {loading ? (
              <p className="muted">{pick(lang, bi("लोड हो रहा है…", "Loading…"))}</p>
            ) : error ? (
              <div className="stack" style={{ gap: 12 }}>
                <p style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", margin: 0 }}>
                  {pick(lang, bi("कतार लोड नहीं हो सकी। कृपया जाँचें कि डेटाबेस कनेक्ट है।", "Couldn't load the queue. Check that the database is connected."))}
                </p>
                <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-500)", wordBreak: "break-word" }}>{error}</div>
                <Button size="sm" variant="outline" onClick={loadQueue}>{pick(lang, bi("पुनः प्रयास करें", "Retry"))}</Button>
              </div>
            ) : cases.length === 0 ? (
              <p className="muted">{pick(lang, bi("कतार खाली है — सभी मामले निपट गए।", "Queue is clear — all cases handled."))}</p>
            ) : (
              cases.map((c) => {
                const on = c.application.id === selectedId;
                const breach = c.sla.status === "BREACHED";
                const bw = on ? "2px" : "1px";
                const bc = on ? "var(--blue-500)" : "var(--ink-200)";
                return (
                  <button
                    key={c.application.id}
                    type="button"
                    onClick={() => setSelectedId(c.application.id)}
                    style={{
                      textAlign: "left", cursor: "pointer", padding: "14px 16px",
                      borderTop: `${bw} solid ${bc}`,
                      borderRight: `${bw} solid ${bc}`,
                      borderBottom: `${bw} solid ${bc}`,
                      borderLeft: breach ? "10px solid var(--red-500)" : `${bw} solid ${bc}`,
                      background: on ? "var(--blue-50)" : "var(--ink-0)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{c.application.applicant.fullName}</span>
                      <span className="mono" style={{ font: "var(--type-caption)", color: breach ? "var(--red-500)" : "var(--saffron-600)" }}>
                        {breach ? pick(lang, bi("उल्लंघन", "breach")) : `${pick(lang, bi("दिन", "day"))} ${Math.min(Math.ceil(c.sla.workingDaysElapsed) || 1, c.sla.workingDaysAllowed)}/${c.sla.workingDaysAllowed}`}
                      </span>
                    </div>
                    <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-500)", marginTop: 4 }}>{c.application.applicant.district} · {c.application.incomeSource}</div>
                    <div style={{ marginTop: 10 }}><ClockTrack sla={c.sla} height={8} /></div>
                  </button>
                );
              })
            )}
          </div>

          {/* Detail */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {!detail ? (
              <div style={{ padding: 32 }}>
                <p className="muted">{cases.length ? pick(lang, bi("बाईं ओर से कोई मामला चुनें।", "Select a case from the left.")) : pick(lang, bi("कतार खाली है।", "The queue is clear."))}</p>
              </div>
            ) : (
              <>
                <div style={{ padding: "24px var(--gutter)", borderBottom: "1px solid var(--ink-200)", display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ margin: 0 }}>{detail.application.applicant.fullName}</h2>
                    <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-500)", marginTop: 6 }}>
                      {detail.application.applicant.district} · {detail.application.incomeSource} · {inr(detail.application.statedAnnualIncome)}
                    </div>
                  </div>
                  <div style={{ width: 200 }}><ConfidenceBar score={detail.decision.score} /></div>
                </div>

                <div className="grid grid-2" style={{ gap: 32, padding: "24px var(--gutter)", alignItems: "start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 12px" }}>{pick(lang, bi("रजिस्ट्री स्नैपशॉट", "Registry snapshot"))}</h3>
                    <RegistryTable registry={detail.registry} lang={lang} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 12px" }}>{pick(lang, bi("संकेत", "Signals"))}</h3>
                    <SignalList signals={detail.decision.signals} lang={lang} columns={1} />
                    <div style={{ marginTop: 20 }}>
                      <Field
                        label={pick(lang, bi("टिप्पणी (आवेदक को दिखेगी)", "Note (visible to the applicant)"))}
                        textarea
                        rows={3}
                        value={note}
                        onChange={(e) => setNote((e.target as HTMLTextAreaElement).value)}
                        placeholder={pick(lang, bi("मौके पर क्या पाया गया", "What was found on the ground"))}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "auto", padding: "20px var(--gutter)", borderTop: "1px solid var(--ink-200)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ font: "var(--type-body-sm)", color: "var(--ink-600)" }}>
                    {pick(lang, bi("कीबोर्ड:", "Keyboard:"))} <span className="mono" style={{ color: "var(--ink-900)" }}>A</span> {pick(lang, bi("स्वीकृत", "approve"))} · <span className="mono" style={{ color: "var(--ink-900)" }}>R</span> {pick(lang, bi("अस्वीकृत", "return"))}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <Button variant="destructive" onClick={() => decide(false)}>{pick(lang, bi("वापस भेजें", "Return"))}</Button>
                    <Button variant="primary" onClick={() => decide(true)}>{pick(lang, bi("स्वीकृत करें", "Approve"))}</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
