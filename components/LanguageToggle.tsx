"use client";

import { useLang } from "@/lib/i18n/useLang";

// Minimal HI/EN toggle for the header chrome. Tap target ≥48px (brief §4).
export function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t.lang.label}
      className="inline-flex overflow-hidden rounded-md border border-ink/20"
    >
      {(["hi", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`min-h-12 px-4 text-sm font-medium tabular ${
            lang === code ? "bg-seal text-paper" : "bg-transparent text-ink"
          }`}
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  );
}
