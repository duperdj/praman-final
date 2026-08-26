"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLang, pick, bi } from "@/components/ui/lang";
import { StaffHeader } from "@/components/chrome/StaffHeader";
import { Button } from "@/components/ui/Button";
import {
  getDashboard,
  getDashboardList,
  tickClock,
  type DashboardStats,
  type DashboardBucket,
  type DashboardList,
} from "@/components/api";
import { inr, formatDate } from "@/components/ui/format";

function Stat({
  label,
  value,
  top,
  onClick,
  active,
}: {
  label: string;
  value: ReactNode;
  top: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const style: React.CSSProperties = {
    background: active ? "var(--ink-0)" : "var(--ink-50)",
    borderRight: "1px solid var(--ink-200)",
    borderBottom: "1px solid var(--ink-200)",
    borderLeft: active ? `1px solid ${top}` : "1px solid var(--ink-200)",
    borderTop: `4px solid ${top}`,
    padding: 20,
    textAlign: "left",
    width: "100%",
    display: "block",
  };
  const inner = (
    <>
      <div style={{ font: "var(--type-body-sm)", color: "var(--ink-600)", display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        {onClick ? <span aria-hidden="true" style={{ color: top, fontWeight: 800 }}>{active ? "▾" : "›"}</span> : null}
      </div>
      <div className="mono" style={{ font: "800 30px var(--font-mono)", color: top, marginTop: 6 }}>{value}</div>
    </>
  );
  if (!onClick) return <div style={style}>{inner}</div>;
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="stat-btn" style={{ ...style, cursor: "pointer" }}>
      {inner}
    </button>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", font: "var(--type-body-sm)", color: "var(--ink-800)" }}>
        <span>{label}</span>
        <span className="mono">{value}</span>
      </div>
      <div style={{ height: 12, background: "var(--ink-100)", marginTop: 6 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const BUCKET_LABEL: Record<DashboardBucket, { hi: string; en: string }> = {
  total: { hi: "सभी आवेदन", en: "All applications" },
  autoIssue: { hi: "तत्काल जारी आवेदन", en: "Auto-issued applications" },
  running: { hi: "चालू घड़ियाँ", en: "Applications with a live clock" },
  breached: { hi: "समय-सीमा उल्लंघन", en: "Breached applications" },
  penalty: { hi: "जुर्माना लगे आवेदन", en: "Applications accruing a penalty" },
};

export default function DashboardPage() {
  const { lang } = useLang();
  const [s, setS] = useState<DashboardStats | null>(null);
  const [openBucket, setOpenBucket] = useState<DashboardBucket | null>(null);
  const [list, setList] = useState<DashboardList | null>(null);
  const [listLoading, setListLoading] = useState(false);

  const load = () => getDashboard().then(setS).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openDrill(bucket: DashboardBucket) {
    if (openBucket === bucket) {
      setOpenBucket(null);
      setList(null);
      return;
    }
    setOpenBucket(bucket);
    setListLoading(true);
    try {
      setList(await getDashboardList(bucket));
    } catch {
      setList(null);
    } finally {
      setListLoading(false);
    }
  }

  async function advance(body: { days?: number; reset?: boolean }) {
    await tickClock(body);
    await load();
    if (openBucket) {
      // keep the open drill-down in sync with the advanced clock
      try { setList(await getDashboardList(openBucket)); } catch { /* ignore */ }
    }
  }

  const outcomeMax = s ? Math.max(s.autoIssue, s.fieldVerify, s.needsInput, s.reject, 1) : 1;
  const tehsilMax = s ? Math.max(1, ...s.byTehsil.map((b) => b.count)) : 1;

  return (
    <>
      <StaffHeader active="dashboard" />
      <main id="main" className="container" style={{ padding: "32px var(--gutter) var(--section-y)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "4px solid var(--blue-500)", paddingBottom: 16, gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ font: "800 clamp(24px,4vw,30px) var(--font-sans)", margin: 0 }}>{pick(lang, bi("जवाबदेही डैशबोर्ड", "Accountability dashboard"))}</h2>
            <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-500)", marginTop: 6 }}>
              {pick(lang, bi("स्वतः ताज़ा 60s", "Auto-refresh 60s"))}
            </div>
          </div>
          {/* Demo time-travel — staff/ops only, out of the citizen view */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px dashed var(--ink-300)", padding: "8px 12px", flexWrap: "wrap" }}>
            <span className="eyebrow" style={{ color: "var(--ink-500)" }}>{pick(lang, bi("समय नियंत्रण (परीक्षण)", "Time control (testing)"))}</span>
            <Button size="sm" variant="secondary" onClick={() => advance({ days: 1 })}>+1</Button>
            <Button size="sm" variant="secondary" onClick={() => advance({ days: 5 })}>+5 {pick(lang, bi("दिन", "days"))}</Button>
            <Button size="sm" variant="outline" onClick={() => advance({ reset: true })}>{pick(lang, bi("रीसेट", "Reset"))}</Button>
          </div>
        </div>

        {!s ? (
          <p className="muted" style={{ marginTop: 24 }}>{pick(lang, bi("लोड हो रहा है…", "Loading…"))}</p>
        ) : (
          <>
            <div className="grid grid-5" style={{ marginTop: 24 }}>
              <Stat label={pick(lang, bi("कुल आवेदन", "Total applications"))} value={s.total} top="var(--blue-500)" onClick={() => openDrill("total")} active={openBucket === "total"} />
              <Stat label={pick(lang, bi("तत्काल जारी", "Auto-issued"))} value={s.autoIssue} top="var(--green-500)" onClick={() => openDrill("autoIssue")} active={openBucket === "autoIssue"} />
              <Stat label={pick(lang, bi("चालू घड़ियाँ", "Live clocks"))} value={s.running} top="var(--saffron-500)" onClick={() => openDrill("running")} active={openBucket === "running"} />
              <Stat label={pick(lang, bi("उल्लंघन", "Breaches"))} value={s.breached} top="var(--red-500)" onClick={() => openDrill("breached")} active={openBucket === "breached"} />
              <Stat label={pick(lang, bi("संचित जुर्माना", "Penalty accrued"))} value={inr(s.penaltyInr)} top="var(--red-500)" onClick={() => openDrill("penalty")} active={openBucket === "penalty"} />
            </div>

            {openBucket ? (
              <DrillDown
                lang={lang}
                bucket={openBucket}
                list={list}
                loading={listLoading}
                onClose={() => { setOpenBucket(null); setList(null); }}
              />
            ) : null}

            <div className="grid grid-2" style={{ marginTop: 24, alignItems: "start" }}>
              <div style={{ border: "1px solid var(--ink-200)", padding: 20 }}>
                <div className="eyebrow">{pick(lang, bi("परिणाम अनुसार", "By outcome"))}</div>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  <Bar label={pick(lang, bi("तत्काल जारी", "Auto-issued"))} value={s.autoIssue} max={outcomeMax} color="var(--green-500)" />
                  <Bar label={pick(lang, bi("क्षेत्र सत्यापन", "Field verify"))} value={s.fieldVerify} max={outcomeMax} color="var(--saffron-500)" />
                  <Bar label={pick(lang, bi("जानकारी अपेक्षित", "Needs input"))} value={s.needsInput} max={outcomeMax} color="var(--blue-500)" />
                  <Bar label={pick(lang, bi("अस्वीकृत", "Rejected"))} value={s.reject} max={outcomeMax} color="var(--red-500)" />
                </div>
                <div style={{ marginTop: 16, font: "var(--type-body-sm)", color: "var(--ink-600)" }}>
                  {pick(lang, bi(`तत्काल जारी दर ${s.autoIssueRate}% — साफ़ मामले सेकंडों में निपटते हैं।`, `${s.autoIssueRate}% auto-issue rate — clean cases settle in seconds.`))}
                </div>
              </div>

              <div style={{ border: "1px solid var(--ink-200)", padding: 20 }}>
                <div className="eyebrow">{pick(lang, bi("तहसील अनुसार उल्लंघन", "Breaches by tehsil"))}</div>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  {s.byTehsil.length === 0 ? (
                    <p className="muted" style={{ margin: 0 }}>{pick(lang, bi("कोई उल्लंघन नहीं — घड़ी आगे बढ़ाकर देखें।", "No breaches yet — advance the clock to see one."))}</p>
                  ) : (
                    s.byTehsil.map((b) => (
                      <div key={b.tehsil} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 90, font: "var(--type-body-sm)", color: "var(--ink-700)" }}>{b.tehsil}</span>
                        <div style={{ flex: 1, height: 10, background: "var(--ink-100)" }}>
                          <div style={{ height: "100%", width: `${Math.round((b.count / tehsilMax) * 100)}%`, background: "var(--red-500)" }} />
                        </div>
                        <span className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-900)" }}>{b.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

const OUTCOME_LABEL: Record<string, { hi: string; en: string; color: string }> = {
  AUTO_ISSUE: { hi: "तत्काल जारी", en: "Auto-issued", color: "var(--green-500)" },
  FIELD_VERIFY: { hi: "क्षेत्र सत्यापन", en: "Field verify", color: "var(--saffron-500)" },
  NEEDS_INPUT: { hi: "जानकारी अपेक्षित", en: "Needs input", color: "var(--blue-500)" },
  REJECT: { hi: "अस्वीकृत", en: "Rejected", color: "var(--red-500)" },
};
const STATUS_LABEL: Record<string, { hi: string; en: string; color: string }> = {
  RUNNING: { hi: "चालू", en: "Running", color: "var(--saffron-500)" },
  MET: { hi: "पूर्ण", en: "Met", color: "var(--green-500)" },
  BREACHED: { hi: "उल्लंघन", en: "Breached", color: "var(--red-500)" },
  CLOSED: { hi: "बंद", en: "Closed", color: "var(--ink-500)" },
};

function DrillDown({
  lang,
  bucket,
  list,
  loading,
  onClose,
}: {
  lang: "hi" | "en";
  bucket: DashboardBucket;
  list: DashboardList | null;
  loading: boolean;
  onClose: () => void;
}) {
  const th: React.CSSProperties = { textAlign: "left", font: "700 12px/1.2 var(--font-sans)", letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-500)", padding: "10px 12px", borderBottom: "2px solid var(--ink-200)", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid var(--ink-100)", font: "var(--type-body-sm)", color: "var(--ink-800)", verticalAlign: "middle" };

  return (
    <div style={{ marginTop: 16, border: "1px solid var(--ink-200)", borderTop: "4px solid var(--blue-500)", background: "var(--ink-0)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--ink-100)", flexWrap: "wrap" }}>
        <div>
          <span style={{ font: "700 16px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, BUCKET_LABEL[bucket])}</span>
          {list ? <span className="mono" style={{ marginLeft: 10, font: "var(--type-caption)", color: "var(--ink-500)" }}>{list.count}</span> : null}
        </div>
        <Button size="sm" variant="outline" onClick={onClose}>{pick(lang, bi("बंद करें", "Close"))}</Button>
      </div>

      {loading ? (
        <p className="muted" style={{ padding: 20, margin: 0 }}>{pick(lang, bi("लोड हो रहा है…", "Loading…"))}</p>
      ) : !list || list.count === 0 ? (
        <p className="muted" style={{ padding: 20, margin: 0 }}>{pick(lang, bi("इस श्रेणी में कोई आवेदन नहीं।", "No applications in this category."))}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={th}>{pick(lang, bi("आवेदक", "Applicant"))}</th>
                <th style={th}>{pick(lang, bi("स्थान", "Location"))}</th>
                <th style={th}>{pick(lang, bi("सेवा", "Service"))}</th>
                <th style={th}>{pick(lang, bi("परिणाम", "Outcome"))}</th>
                <th style={th}>{pick(lang, bi("घड़ी", "Clock"))}</th>
                <th style={th}>{pick(lang, bi("जुर्माना", "Penalty"))}</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {list.items.map((it) => {
                const o = it.outcome ? OUTCOME_LABEL[it.outcome] : null;
                const st = it.slaStatus ? STATUS_LABEL[it.slaStatus] : null;
                return (
                  <tr key={it.id}>
                    <td style={td}>
                      <div style={{ font: "600 15px var(--font-sans)", color: "var(--ink-900)" }}>{it.name}</div>
                      <div className="mono" style={{ font: "var(--type-caption)", color: "var(--ink-400)" }}>{formatDate(it.submittedAt, lang)}</div>
                    </td>
                    <td style={td}>{it.tehsil}, {it.district}</td>
                    <td style={td}>{it.serviceType}</td>
                    <td style={td}>
                      {o ? <span style={{ display: "inline-block", font: "700 12px var(--font-sans)", color: o.color }}>● {pick(lang, o)}</span> : "—"}
                    </td>
                    <td style={td}>
                      {st ? (
                        <span style={{ color: st.color, fontWeight: 700 }}>
                          {pick(lang, st)}
                          <span className="mono" style={{ color: "var(--ink-500)", fontWeight: 400 }}> · {it.workingDaysElapsed}/{it.workingDaysAllowed}d</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td style={td} className="mono">{it.penaltyInr > 0 ? inr(it.penaltyInr) : "—"}</td>
                    <td style={td}>
                      <a href={`/status/${it.id}`} style={{ font: "600 14px var(--font-sans)", color: "var(--blue-500)", textDecoration: "none", whiteSpace: "nowrap" }}>
                        {pick(lang, bi("देखें →", "View →"))}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
