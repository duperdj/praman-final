import type { CSSProperties, ReactNode } from "react";

type Tone = "neutral" | "info" | "success" | "warning" | "error";

const TONES: Record<Tone, [string, string]> = {
  neutral: ["var(--ink-100)", "var(--ink-700)"],
  info: ["var(--status-info-surface)", "var(--blue-600)"],
  success: ["var(--status-success-surface)", "var(--green-600)"],
  warning: ["var(--status-warning-surface)", "var(--saffron-600)"],
  error: ["var(--status-error-surface)", "var(--red-600)"],
};

// Square uppercase tag / pill (DS Tag).
export function Tag({
  tone = "neutral",
  children,
  style,
}: {
  tone?: Tone;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const [bg, fg] = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: fg,
        font: "var(--type-eyebrow)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        padding: "4px var(--space-3)",
        borderRadius: "var(--radius-none)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
