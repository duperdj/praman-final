"use client";

import type { ReactNode } from "react";
import { LangSwitch } from "./LangSwitch";

// Compact header for task flows (apply / status / officer). Logo + a title
// slot on the left, language toggle on the right, blue bottom rule.
export function FlowHeader({ title, right }: { title?: ReactNode; right?: ReactNode }) {
  return (
    <header style={{ borderBottom: "var(--border-rule) solid var(--blue-500)", background: "var(--ink-0)" }}>
      <div
        className="container"
        style={{ padding: "var(--space-5) var(--gutter)", display: "flex", alignItems: "center", gap: "var(--space-5)" }}
      >
        <a href="/" style={{ font: "800 22px/1 var(--font-sans)", letterSpacing: "var(--tracking-tight)", color: "var(--text-body)", textDecoration: "none" }}>
          Praman
        </a>
        {title ? (
          <span style={{ flex: 1, font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--text-body)", minWidth: 0 }}>
            {title}
          </span>
        ) : (
          <span style={{ flex: 1 }} />
        )}
        {right}
        <LangSwitch />
      </div>
    </header>
  );
}
