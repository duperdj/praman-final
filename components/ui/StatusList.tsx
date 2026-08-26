import type { CSSProperties } from "react";
import { Icon } from "./Icon";

export type StatusItem = { label: string; detail?: string; state?: "done" | "current" | "todo" };

const STEP: Record<string, [string, string]> = {
  done: ["circle-check", "var(--status-success)"],
  current: ["circle-dot", "var(--blue-500)"],
  todo: ["circle", "var(--ink-300)"],
};

// Vertical stepper / timeline with a connector rule (DS StatusList).
export function StatusList({ items = [], style }: { items?: StatusItem[]; style?: CSSProperties }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, ...style }}>
      {items.map((it, i) => {
        const [icon, color] = STEP[it.state ?? "todo"] ?? STEP.todo;
        const last = i === items.length - 1;
        return (
          <li key={it.label + i} style={{ display: "flex", gap: "var(--space-5)", alignItems: "flex-start" }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
              <Icon name={icon} size="lg" style={{ color }} />
              {!last ? (
                <span style={{ flex: 1, width: 2, background: "var(--border-default)", minHeight: 24 }} />
              ) : null}
            </span>
            <span style={{ paddingBottom: last ? 0 : "var(--space-6)" }}>
              <span style={{ display: "block", font: "var(--type-label)", fontSize: "var(--text-base)" }}>{it.label}</span>
              {it.detail ? (
                <span style={{ display: "block", font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{it.detail}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
