import type { Lang } from "@/lib/contracts";

// Indian-grouped rupee amount, e.g. 120000 → "₹ 1,20,000".
export function inr(n: number): string {
  return "₹ " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

// Localised long date, e.g. "24 अगस्त 2026" / "24 Aug 2026".
export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: lang === "hi" ? "long" : "short",
    year: "numeric",
  }).format(d);
}

// Short date + time for event logs.
export function formatDateTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
