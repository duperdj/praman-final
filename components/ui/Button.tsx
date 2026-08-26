"use client";

import { useState, type CSSProperties, type ReactNode, type MouseEventHandler } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "inverse";
type Size = "sm" | "md" | "lg";

const BASE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--space-3)",
  font: "var(--type-label)",
  fontSize: "var(--text-base)",
  border: "var(--border-thick) solid transparent",
  borderRadius: "var(--radius-xs)",
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
  transition: "var(--transition-state)",
};

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: "6px var(--space-4)", fontSize: "var(--text-sm)", minHeight: 36 },
  md: { padding: "10px var(--space-6)", minHeight: "var(--touch-min)" },
  lg: { padding: "14px var(--space-8)", fontSize: "var(--text-lg)", minHeight: 56 },
};

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: { background: "var(--action-primary)", color: "var(--text-inverse)", boxShadow: "0 var(--border-thick) 0 0 var(--blue-700)" },
  secondary: { background: "var(--action-secondary)", color: "var(--text-body)", boxShadow: "0 var(--border-thick) 0 0 var(--ink-300)" },
  outline: { background: "transparent", color: "var(--action-primary)", borderColor: "currentColor" },
  ghost: { background: "transparent", color: "var(--action-primary)" },
  destructive: { background: "var(--action-destructive)", color: "var(--text-inverse)", boxShadow: "0 var(--border-thick) 0 0 var(--red-600)" },
  inverse: { background: "var(--ink-0)", color: "var(--blue-600)" },
};

const HOVER: Record<Variant, string> = {
  primary: "var(--action-primary-hover)",
  secondary: "var(--action-secondary-hover)",
  outline: "var(--blue-50)",
  ghost: "var(--blue-50)",
  destructive: "var(--action-destructive-hover)",
  inverse: "var(--ink-100)",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  fullWidth,
  disabled,
  href,
  onClick,
  type = "button",
  children,
  style,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  icon?: IconName | string;
  iconAfter?: IconName | string;
  fullWidth?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const v = VARIANTS[variant];
  const css: CSSProperties = {
    ...BASE,
    ...SIZES[size],
    ...v,
    width: fullWidth ? "100%" : undefined,
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? "none" : undefined,
    background: hover && !disabled ? HOVER[variant] : v.background,
    transform: active ? "translateY(2px)" : undefined,
    boxShadow: active ? "none" : v.boxShadow,
    ...style,
  };
  const content = (
    <>
      {icon ? <Icon name={icon} size="sm" /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size="sm" /> : null}
    </>
  );
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setActive(false); },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
  };
  if (href) {
    return (
      <a href={href} aria-disabled={disabled || undefined} style={css} {...handlers} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={css} {...handlers} {...rest}>
      {content}
    </button>
  );
}
