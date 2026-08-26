import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_Devanagari, Roboto_Mono } from "next/font/google";
import { LangProvider } from "@/lib/i18n/useLang";
import { SessionProvider } from "@/components/ui/session";
import { AccessibilityMenu } from "@/components/feature/AccessibilityMenu";
import "./globals.css";

// Design system fonts (self-hosted by next/font — no external CDN, works on a
// slow connection). Manrope for Latin, Noto Sans Devanagari carries Hindi,
// Roboto Mono for reference numbers / dates / the statutory clock digits.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const notoDeva = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-deva",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "प्रमाण · Praman",
    template: "%s · प्रमाण Praman",
  },
  description:
    "Re-imagined Madhya Pradesh income certificate service — verified against records the state already holds, explainable, and on a visible statutory clock.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d4f91",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hi"
      className={`${manrope.variable} ${notoDeva.variable} ${robotoMono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          मुख्य सामग्री पर जाएँ / Skip to content
        </a>
        <LangProvider>
          <SessionProvider>{children}</SessionProvider>
          <AccessibilityMenu />
        </LangProvider>
      </body>
    </html>
  );
}
