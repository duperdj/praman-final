import type { CSSProperties, ReactNode } from "react";

// H2 + trailing hairline + optional action link (DS SectionHeading).
export function SectionHeading({
  children,
  action,
  actionHref,
  level = 2,
  style,
}: {
  children: ReactNode;
  action?: ReactNode;
  actionHref?: string;
  level?: 2 | 3;
  style?: CSSProperties;
}) {
  const H = (`h${level}` as unknown) as "h2";
  return (
    <div className="sec-head" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", margin: "0 0 var(--space-7)", ...style }}>
      <H style={{ font: "var(--type-h2)", whiteSpace: "nowrap" }}>{children}</H>
      <span className="sec-rule" style={{ flex: 1, height: "var(--border-hairline)", background: "var(--border-default)" }} />
      {action ? (
        <a
          href={actionHref || "#"}
          style={{
            font: "var(--type-eyebrow)",
            letterSpacing: "var(--tracking-caps)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {action}
        </a>
      ) : null}
    </div>
  );
}
