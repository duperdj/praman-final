"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

// Service / content card: hairline box with a blue top rule (DS Card).
export function Card({
  title,
  description,
  icon,
  href,
  meta,
  children,
  style,
}: {
  title?: ReactNode;
  description?: ReactNode;
  icon?: IconName | string;
  href?: string;
  meta?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const css: CSSProperties = {
    display: "block",
    background: hover && href ? "var(--ink-100)" : "var(--surface-card)",
    borderRight: "var(--border-hairline) solid var(--border-muted)",
    borderBottom: "var(--border-hairline) solid var(--border-muted)",
    borderLeft: "var(--border-hairline) solid var(--border-muted)",
    borderTop: "var(--border-rule) solid var(--blue-500)",
    padding: "var(--space-7)",
    textDecoration: "none",
    color: "var(--text-body)",
    transition: "var(--transition-state)",
    height: "100%",
    ...style,
  };
  const inner = (
    <>
      {icon ? (
        <Icon name={icon} size="lg" style={{ color: "var(--blue-500)", marginBottom: "var(--space-4)" }} />
      ) : null}
      {title ? (
        <p
          style={{
            font: "var(--type-h3)",
            margin: "0 0 var(--space-3)",
            color: href ? "var(--text-link)" : "var(--text-heading)",
            textDecoration: href ? "underline" : "none",
            textDecorationThickness: hover ? 3 : 1,
            textUnderlineOffset: 2,
          }}
        >
          {title}
        </p>
      ) : null}
      {description ? (
        <p style={{ font: "var(--type-body-sm)", margin: 0, color: "var(--ink-700)" }}>{description}</p>
      ) : null}
      {meta ? (
        <p style={{ font: "var(--type-caption)", margin: "var(--space-4) 0 0", color: "var(--text-muted)" }}>{meta}</p>
      ) : null}
      {children}
    </>
  );
  if (href) {
    return (
      <a href={href} style={css} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {inner}
      </a>
    );
  }
  return <div style={css}>{inner}</div>;
}
