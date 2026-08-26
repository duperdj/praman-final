import type { CSSProperties } from "react";
import type { SlaState, SlaStatus, Lang } from "@/lib/contracts";
import { pick, bi } from "@/components/ui/lang";
import { formatDate, inr } from "@/components/ui/format";

// The signature element (Spec §10). A horizontal track of exactly N segments —
// one per statutory working day (3, or 1 for Samadhan Ek Din). Segments fill as
// days pass; the track turns `breach` red and a rupee penalty appears once the
// deadline is overrun. Driven entirely off SlaState.
const HUE: Record<SlaStatus, { solid: string; soft: string; border: string; text: string }> = {
  RUNNING: { solid: "var(--saffron-500)", soft: "var(--saffron-50)", border: "var(--saffron-200)", text: "var(--saffron-600)" },
  MET: { solid: "var(--green-500)", soft: "var(--green-50)", border: "var(--border-default)", text: "var(--green-600)" },
  BREACHED: { solid: "var(--red-500)", soft: "var(--red-50)", border: "var(--red-500)", text: "var(--red-600)" },
  CLOSED: { solid: "var(--ink-500)", soft: "var(--ink-50)", border: "var(--border-default)", text: "var(--ink-600)" },
};

const STATUS_LABEL: Record<SlaStatus, { label: ReturnType<typeof bi> }> = {
  RUNNING: { label: bi("चालू", "Running") },
  MET: { label: bi("पूर्ण", "Met") },
  BREACHED: { label: bi("उल्लंघन", "Breached") },
  CLOSED: { label: bi("बंद", "Closed") },
};

export function ClockTrack({ sla, height = 12 }: { sla: SlaState; height?: number }) {
  const hue = HUE[sla.status] ?? HUE.RUNNING;
  const total = Math.max(1, sla.workingDaysAllowed || 3);
  const elapsed = Math.max(0, sla.workingDaysElapsed || 0);
  const floor = Math.floor(elapsed);
  const frac = elapsed - floor;
  return (
    <div className="clock-track" role="img" aria-label={`${elapsed} / ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        let fill = 0;
        if (sla.status === "BREACHED") fill = 1;
        else if (i < floor) fill = 1;
        else if (i === floor && sla.status !== "MET") fill = frac;
        const segStyle: CSSProperties = {
          flex: 1,
          height,
          background: fill >= 1 ? hue.solid : hue.soft,
          border: `1px solid ${fill >= 1 ? hue.solid : hue.border}`,
          position: "relative",
          overflow: "hidden",
        };
        return (
          <div key={i} style={segStyle}>
            {fill > 0 && fill < 1 ? (
              <div style={{ position: "absolute", inset: 0, width: `${Math.round(fill * 100)}%`, background: hue.solid }} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function StatutoryClock({
  sla,
  lang,
  style,
}: {
  sla: SlaState;
  lang: Lang;
  style?: CSSProperties;
}) {
  const hue = HUE[sla.status] ?? HUE.RUNNING;
  const total = Math.max(1, sla.workingDaysAllowed || 3);
  const elapsed = Math.max(0, sla.workingDaysElapsed || 0);
  const breached = sla.status === "BREACHED";
  const paused = sla.paused;

  return (
    <div
      style={{
        background: "var(--ink-0)",
        borderRight: `var(--border-hairline) solid ${breached ? "var(--red-500)" : hue.border}`,
        borderBottom: `var(--border-hairline) solid ${breached ? "var(--red-500)" : hue.border}`,
        borderLeft: `var(--border-hairline) solid ${breached ? "var(--red-500)" : hue.border}`,
        borderTop: `var(--border-rule) solid ${hue.solid}`,
        padding: "18px",
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, font: "var(--type-caption)", fontFamily: "var(--font-mono)", color: hue.text }}>
        <span style={{ letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" }}>
          {pick(lang, bi("वैधानिक घड़ी", "Statutory clock"))} · {pick(lang, STATUS_LABEL[sla.status].label)}
          {paused ? " · " + pick(lang, bi("रुकी", "Paused")) : ""}
        </span>
        <span>
          {pick(lang, bi("दिन", "Day"))} {Math.min(Math.ceil(elapsed) || (breached ? total : 1), total)} / {total}
        </span>
      </div>

      <div style={{ marginTop: 14 }}>
        <ClockTrack sla={sla} />
      </div>

      <div style={{ font: "var(--type-body-sm)", color: "var(--ink-700)", marginTop: 14 }}>
        {breached ? (
          <>
            {pick(lang, bi("अंतिम तिथि बीत गई", "The deadline has passed"))}{" "}
            <span className="mono" style={{ color: "var(--ink-900)" }}>{formatDate(sla.dueAt, lang)}</span>.{" "}
            <b style={{ color: "var(--red-600)" }}>
              {pick(lang, bi("₹ 250/दिन जुर्माना — अब तक", "₹250/day penalty — so far"))} {inr(sla.penaltyAccruedInr)}
            </b>{" "}
            {pick(lang, bi("आपके पक्ष में।", "in your favour."))}
          </>
        ) : paused ? (
          <>{pick(lang, bi("घड़ी रुकी है — आपकी कार्रवाई की प्रतीक्षा में। पुनः जमा करने पर फिर से चलेगी।", "The clock is paused — waiting on you. It resumes when you resubmit."))}</>
        ) : sla.status === "MET" ? (
          <>{pick(lang, bi("समय-सीमा के भीतर निर्णय", "Decided within the deadline"))} · <span className="mono" style={{ color: "var(--ink-900)" }}>{formatDate(sla.dueAt, lang)}</span></>
        ) : (
          <>
            {pick(lang, bi("निर्णय की अंतिम तिथि", "Decision due by"))}{" "}
            <span className="mono" style={{ color: "var(--ink-900)" }}>{formatDate(sla.dueAt, lang)}</span>.{" "}
            {pick(lang, bi("इसके बाद ₹ 250 प्रतिदिन जुर्माना आपके पक्ष में।", "After that, ₹250/day penalty in your favour."))}
          </>
        )}
      </div>
    </div>
  );
}
