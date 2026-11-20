import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { wedding } from "@/config/wedding.config";
import { PetalField } from "@/components/art/LoosePetal";
import { SvgDefs } from "@/components/art/SvgDefs";
import { coupleNames, formatDate, formatLongDate } from "@/lib/datetime";
import { publicSiteUrl } from "@/lib/site";
import "./globals.css";

/** Flowing but legible script — names and a few large accents only. */
const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script-face",
  display: "swap",
});

/** Classical capitals for titles and small caps. */
const display = Cinzel({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const serif = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = publicSiteUrl ?? "http://localhost:3000";

const title = `${coupleNames} · ${formatDate(wedding.date)}`;
const description = `${wedding.hero.openingLine}, ${coupleNames} ${wedding.hero.invitationLine} on ${formatLongDate(
  wedding.date,
)} in ${wedding.city}. Kindly reply by ${formatDate(wedding.rsvpDeadline)}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: coupleNames,
  openGraph: {
    type: "website",
    url: "/",
    siteName: coupleNames,
    title: `You're invited · ${coupleNames}`,
    description,
    locale: "en_PH",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: wedding.site.allowSearchIndexing ? undefined : { index: false, follow: false },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${script.variable} ${display.variable} ${serif.variable}`}>
      <head>
        <noscript>
          {/* Without JavaScript: skip the opening and show every section. */}
          <style>{`.intro-overlay,.scratch-cover{display:none!important}[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <div aria-hidden="true" className="pearl-bg">
          <div className="pearl-bg__drift" />
          <div className="pearl-bg__sheen" />
          <div className="pearl-bg__grain" />
        </div>
        <SvgDefs />
        <PetalField />
        {children}
      </body>
    </html>
  );
}
