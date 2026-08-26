import type { CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

const fieldShell: CSSProperties = {
  width: "100%",
  font: "var(--type-body)",
  color: "var(--text-body)",
  padding: "8px var(--space-4)",
  minHeight: "var(--touch-min)",
  border: "var(--border-thick) solid var(--ink-900)",
  borderRadius: "var(--radius-none)",
  background: "var(--ink-0)",
};

type Common = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  id?: string;
  style?: CSSProperties;
};

function slug(s: string) {
  return s.toLowerCase().replace(/\W+/g, "-");
}

// Text input / textarea with label, hint, fix-oriented error, optional prefix
// (DS Input). Border thickens + turns red on error.
export function Field({
  label,
  hint,
  error,
  prefix,
  id,
  textarea,
  rows = 5,
  style,
  ...rest
}: Common & {
  textarea?: boolean;
  rows?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, "prefix">) {
  const uid = id || "in-" + slug((rest.name as string) || (typeof label === "string" ? label : "field"));
  const inputStyle: CSSProperties = {
    ...fieldShell,
    borderColor: error ? "var(--status-error)" : "var(--ink-900)",
    borderWidth: error ? "var(--border-rule)" : "var(--border-thick)",
  };
  return (
    <div style={{ marginBottom: "var(--space-7)", ...style }}>
      {label ? (
        <label
          htmlFor={uid}
          style={{ display: "block", font: "var(--type-label)", fontSize: "var(--text-base)", marginBottom: hint ? "var(--space-1)" : "var(--space-3)" }}
        >
          {label}
        </label>
      ) : null}
      {hint ? (
        <p style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-3)" }}>{hint}</p>
      ) : null}
      {error ? (
        <p style={{ font: "var(--type-label)", fontSize: "var(--text-sm)", color: "var(--status-error)", margin: "0 0 var(--space-3)" }}>
          {error}
        </p>
      ) : null}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {prefix ? (
          <span
            style={{
              display: "grid",
              placeItems: "center",
              padding: "0 var(--space-4)",
              background: "var(--ink-100)",
              border: "var(--border-thick) solid var(--ink-900)",
              borderRight: 0,
              font: "var(--type-body)",
            }}
          >
            {prefix}
          </span>
        ) : null}
        {textarea ? (
          <textarea id={uid} rows={rows} style={inputStyle} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input id={uid} style={inputStyle} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
        )}
      </div>
    </div>
  );
}
