import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";
import { getBranding } from "@/lib/collections";

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-plex-thai",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "PPSESPORT",
    "Phichit Pittayakom School",
    "โรงเรียนพิจิตรพิทยาคม",
    "อีสปอร์ต",
    "esports",
    "Arena of Valor",
    "RoV",
    "Free Fire",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#142B50",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const branding = await getBranding();

  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${plexThai.variable}`}
    >
      <body className="min-h-screen bg-white antialiased">
        {/*
          Progressive enhancement: without JavaScript the scroll-reveal
          animations never run, so the initial inline `opacity: 0` styles
          would leave whole sections invisible. This resets them.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                '[style*="opacity: 0"]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <Navbar branding={branding} />
        <main id="main-content" className="pt-[68px] lg:pt-[76px]">
          {children}
        </main>
        <Footer branding={branding} />
      </body>
    </html>
  );
}
