import type { CSSProperties } from "react";
import type { Decision, Signal, Severity, Outcome, Lang } from "@/lib/contracts";
import { pick, bi } from "@/components/ui/lang";

// ---- Severity → colour (used by signal rows, both citizen + officer views) ----
const SEV: Record<Severity, { solid: string; soft: string; text: string }> = {
  OK: { solid: "var(--green-500)", soft: "var(--ink-0)", text: "var(--green-600)" },
  INFO: { solid: "var(--ink-300)", soft: "var(--ink-0)", text: "var(--ink-500)" },
  WARN: { solid: "var(--saffron-500)", soft: "var(--saffron-50)", text: "var(--saffron-600)" },
  BLOCK: { solid: "var(--red-500)", soft: "var(--red-50)", text: "var(--red-600)" },
};

export function SignalRow({ signal, lang }: { signal: Signal; lang: Lang }) {
  const c = SEV[signal.severity] ?? SEV.INFO;
  return (
    <div style={{ display: "flex", gap: 11, padding: 15, background: c.soft, borderTop: "1px solid var(--ink-200)", borderRight: "1px solid var(--ink-200)", borderBottom: "1px solid var(--ink-200)", borderLeft: `10px solid ${c.solid}` }}>
      <span className="mono" style={{ flex: "none", font: "700 10px var(--font-mono)", letterSpacing: ".08em", color: c.text, paddingTop: 3 }}>
        {signal.severity}
      </span>
      <div>
        <div style={{ font: "700 15px var(--font-sans)", color: "var(--ink-900)" }}>{pick(lang, signal.reason)}</div>
      </div>
    </div>
  );
}

export function SignalList({ signals, lang, columns = 2 }: { signals: Signal[]; lang: Lang; columns?: 1 | 2 }) {
  if (!signals.length) return null;
  return (
    <div className={columns === 2 ? "grid grid-2" : "grid"} style={{ gap: 12 }}>
      {signals.map((s, i) => (
        <SignalRow key={s.ruleId + i} signal={s} lang={lang} />
      ))}
    </div>
  );
}

// ---- Confidence bar (100 − risk score) ----
export function ConfidenceBar({ score, onDark = false, accent }: { score: number; onDark?: boolean; accent?: string }) {
  const confidence = Math.max(0, Math.min(100, Math.round(100 - score)));
  const track = onDark ? "rgba(255,255,255,.25)" : "var(--ink-100)";
  const fill = accent ?? (onDark ? "var(--ink-0)" : "var(--blue-500)");
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", font: "var(--type-caption)", fontFamily: "var(--font-mono)", color: onDark ? "rgba(255,255,255,.8)" : "var(--ink-500)" }}>
        <span>CONFIDENCE</span>
        <span>{confidence} / 100</span>
      </div>
      <div style={{ height: 8, background: track, marginTop: 6 }}>
        <div style={{ height: "100%", width: `${confidence}%`, background: fill }} />
      </div>
    </div>
  );
}

// ---- Decision hero band (per outcome) ----
type HeroLook = { bg: string; fg: string; eyebrow: string; accent?: string; bottom?: string };

const LOOK: Record<Outcome, HeroLook> = {
  AUTO_ISSUE: { bg: "var(--blue-500)", fg: "var(--ink-0)", eyebrow: "rgba(255,255,255,.8)" },
  FIELD_VERIFY: { bg: "var(--ink-900)", fg: "var(--ink-0)", eyebrow: "var(--saffron-400)", accent: "var(--saffron-500)" },
  NEEDS_INPUT: { bg: "var(--ink-900)", fg: "var(--ink-0)", eyebrow: "var(--blue-200)", accent: "var(--blue-300)" },
  REJECT: { bg: "var(--blue-500)", fg: "var(--ink-0)", eyebrow: "rgba(255,255,255,.8)", bottom: "8px solid var(--red-500)" },
};

const SUB: Record<Outcome, ReturnType<typeof bi>> = {
  AUTO_ISSUE: bi("सभी अभिलेख मेल खाते हैं। कार्यालय जाने की आवश्यकता नहीं।", "All records match. No office visit needed."),
  FIELD_VERIFY: bi("एक विरोधाभास मिला है, इसलिए पटवारी मौके पर जाँच करेंगे। आपको कुछ नहीं करना है।", "A discrepancy was found, so a Patwari will verify on the ground. You need do nothing."),
  NEEDS_INPUT: bi("आगे बढ़ने के लिए एक चीज़ ठीक करनी है। घड़ी तब तक रुकी रहेगी।", "One thing needs fixing before we can proceed. The clock stays paused until then."),
  REJECT: bi("आपकी आय पात्रता सीमा से अधिक पाई गई।", "Your income was found to exceed the eligibility limit."),
};

const TAG: Record<Outcome, ReturnType<typeof bi>> = {
  AUTO_ISSUE: bi("तत्काल निर्णय", "Instant decision"),
  FIELD_VERIFY: bi("मानवीय जाँच", "Human review"),
  NEEDS_INPUT: bi("जानकारी चाहिए", "Input needed"),
  REJECT: bi("निर्णय", "Decision"),
};

export function DecisionHero({ decision, lang, style }: { decision: Decision; lang: Lang; style?: CSSProperties }) {
  const look = LOOK[decision.outcome];
  return (
    <div style={{ background: look.bg, color: look.fg, padding: "26px 28px", borderBottom: look.bottom, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 26, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 560 }}>
          <div className="mono" style={{ font: "700 12px var(--font-mono)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: look.eyebrow }}>
            {decision.outcome} · {pick(lang, TAG[decision.outcome])}
          </div>
          <h1 style={{ font: "800 clamp(28px,4vw,40px)/1.08 var(--font-sans)", color: look.fg, margin: "10px 0 0" }}>
            {pick(lang, decision.headline)}
          </h1>
          <p style={{ font: "var(--type-body-sm)", color: "rgba(255,255,255,.85)", margin: "10px 0 0" }}>
            {pick(lang, SUB[decision.outcome])}
          </p>
        </div>
        <div style={{ width: 160, flex: "none" }}>
          <ConfidenceBar score={decision.score} onDark accent={look.accent ?? "var(--ink-0)"} />
        </div>
      </div>
    </div>
  );
}
