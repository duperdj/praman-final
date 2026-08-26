// English dictionary — the toggle, not the starting point (Spec.txt §4).
// Must mirror the exact key shape of hi.ts (enforced by the Dict type below).
import type { Dict } from "./dict";

const en: Dict = {
  appName: "Praman",
  tagline: "Madhya Pradesh income certificate — a 3 working-day guarantee",
  nav: {
    apply: "Apply for certificate",
    status: "Application status",
    about: "How this works",
  },
  lang: {
    label: "Language",
    hi: "हिन्दी",
    en: "English",
  },
  common: {
    loading: "Loading…",
    day: "day",
    of: "of",
  },
};

export default en;
