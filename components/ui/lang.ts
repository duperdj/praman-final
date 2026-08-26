// Lane B language helper. Re-exports Lane A's useLang() (the frozen i18n state)
// and adds `pick` for choosing the right half of a bilingual value — used both
// for API Bilingual fields (Decision.headline, Signal.reason, …) and for the
// inline bilingual page copy defined alongside each screen.
export { useLang } from "@/lib/i18n/useLang";
import type { Lang, Bilingual } from "@/lib/contracts";

export type { Lang, Bilingual };

/** Pick the current language's string from a {hi, en} pair. */
export function pick(lang: Lang, s: Bilingual): string {
  return lang === "hi" ? s.hi : s.en;
}

/** Shorthand to build a bilingual pair inline. */
export function bi(hi: string, en: string): Bilingual {
  return { hi, en };
}
