import type { Config } from "tailwindcss";

// Design tokens — Spec.txt §10 / docs/SOHAM-LANE-B-BRIEF.md §8.
// 5 tokens, no gradients, high contrast. The CSS variables are declared in
// app/globals.css so both light and dark themes resolve off the same names.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)", // #14140F — text and rules
        paper: "var(--paper)", // #FBFAF6 — page
        seal: "var(--seal)", // #1B4D3E — institutional deep green
        gold: "var(--gold)", // #B8860B — the statutory clock in progress
        breach: "var(--breach)", // #A32D2D — deadline passed
      },
      fontFamily: {
        // Display: Mukta 700 — headings and the reference number
        display: ["var(--font-mukta)", "system-ui", "sans-serif"],
        // Body: Noto Sans Devanagari — carries Hindi cleanly
        body: ["var(--font-noto-deva)", "system-ui", "sans-serif"],
        // Data/mono: certificate numbers, IDs, the clock's day count
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
