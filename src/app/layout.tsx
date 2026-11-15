import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brandHex, site } from "@/content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/providers/Transition";
import { Nav } from "@/components/ui/Nav";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { BgFields } from "@/components/ui/BgFields";
import { Footer } from "@/components/sections/Footer";
import "lenis/dist/lenis.css";
import "./globals.css";

const clash = localFont({
  src: [
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600" },
    { path: "./fonts/ClashDisplay-700.woff2", weight: "700" },
  ],
  variable: "--font-clash",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "sans-serif"],
  adjustFontFallback: "Arial",
});

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-400.woff2", weight: "400" },
    { path: "./fonts/Satoshi-500.woff2", weight: "500" },
    { path: "./fonts/Satoshi-700.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Boost, ${site.tagline.toLowerCase().replace(/\.$/, "")}`, template: "%s at Boost" },
  description: site.description,
  openGraph: { title: "Boost", description: site.description, type: "website", siteName: "Boost" },
  twitter: { card: "summary_large_image", title: "Boost", description: site.description },
};

export const viewport: Viewport = {
  themeColor: brandHex.ink,
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks the page as scripted before first paint, so JS-only states never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
      </head>
      <body>
        <SmoothScroll>
          <TransitionProvider>
            <Nav />
            {children}
            <Footer />
            <BgFields />
            <Cursor />
            <Grain />
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
