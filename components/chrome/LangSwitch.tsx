"use client";

import { useLang } from "@/components/ui/lang";

// Boxed हिं / EN toggle from the design. `compact` uses the short labels used
// in headers; the long form (हिंदी / English) is used in hero/help contexts.
export function LangSwitch({
  compact = true,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  const { lang, setLang } = useLang();
  const border = onDark ? "rgba(255,255,255,.4)" : "var(--ink-900)";
  return (
    <div role="group" aria-label="भाषा / Language" style={{ display: "flex", border: `2px solid ${border}` }}>
      {(["hi", "en"] as const).map((code) => {
        const activeCode = lang === code;
        const label = code === "hi" ? (compact ? "हिं" : "हिंदी") : compact ? "EN" : "English";
        const bg = activeCode ? (onDark ? "var(--ink-0)" : "var(--ink-900)") : "transparent";
        const fg = activeCode
          ? onDark
            ? "var(--ink-900)"
            : "var(--ink-0)"
          : onDark
            ? "var(--ink-0)"
            : "var(--ink-900)";
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={activeCode}
            style={{
              border: 0,
              cursor: "pointer",
              padding: compact ? "6px 12px" : "8px 16px",
              font: `700 ${compact ? 13 : 14}px var(--font-sans)`,
              background: bg,
              color: fg,
              minHeight: 36,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
