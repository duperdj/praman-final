// Hindi dictionary — the DEFAULT language (Spec.txt §4, brief §2/§8).
// Every user-facing string lives here; components must not hardcode text.
// This is a minimal chrome scaffold for Wave 1; feature strings get added
// by the screens that need them, keyed the same way in en.ts.
const hi = {
  appName: "प्रमाण",
  tagline: "मध्य प्रदेश आय प्रमाण पत्र — तीन कार्यदिवस की गारंटी",
  nav: {
    apply: "प्रमाण पत्र के लिए आवेदन करें",
    status: "आवेदन की स्थिति",
    about: "यह कैसे काम करता है",
  },
  lang: {
    label: "भाषा",
    hi: "हिन्दी",
    en: "English",
  },
  common: {
    loading: "लोड हो रहा है…",
    day: "दिन",
    of: "में से",
  },
};

export default hi;
