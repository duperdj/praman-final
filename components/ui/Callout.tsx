import type { CSSProperties, ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "error" | "neutral";

const TONES: Record<Tone, string> = {
  info: "var(--blue-500)",
  success: "var(--green-500)",
  warning: "var(--saffron-500)",
  error: "var(--red-500)",
  neutral: "var(--ink-900)",
};

// Left-marker callout (DS Callout). Marker colour states the tone.
export function Callout({
  tone = "info",
  title,
  children,
  style,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        borderLeft: `var(--border-marker) solid ${TONES[tone] ?? TONES.info}`,
        background: "var(--surface-muted)",
        padding: "var(--space-6) var(--space-7)",
        ...style,
      }}
    >
      {title ? <p style={{ font: "var(--type-h3)", margin: "0 0 var(--space-3)" }}>{title}</p> : null}
      <div style={{ font: "var(--type-body)", maxWidth: "var(--measure)" }}>{children}</div>
    </div>
  );
}
