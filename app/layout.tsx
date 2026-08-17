import type { Metadata } from "next";
import {
  Marcellus,
  Cormorant_Garamond,
  Jost,
  Petit_Formal_Script,
  Anton,
  Playfair_Display,
  Caveat,
} from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-quote",
  display: "swap",
});

const jost = Jost({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const petitFormal = Petit_Formal_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

// Used by the editorial-styled sections (Services, Featured, Studio,
// Process, Philosophy, Testimonials, Insta, Reels, Enquire, Footer) —
// previously each of those components loaded these via a duplicated
// `@import url(fonts.googleapis.com...)` in its own <style> tag, which
// meant up to 10 redundant, render-blocking font requests on every page
// load. Loading them once here via next/font (self-hosted, no runtime
// request, no layout shift) fixes that.
const playfair = Playfair_Display({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const caveat = Caveat({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Storytelling Wedding Photographer",
  description:
    "Marigold & Co. is an editorial wedding photography studio — candid, warm, and full of light.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${cormorant.variable} ${jost.variable} ${petitFormal.variable} ${anton.variable} ${playfair.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
