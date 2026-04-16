import type { Metadata } from "next";
import { Playfair_Display, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import siteData from "@/data/site.json";

// Display serif — huge hero headlines and section titles.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Condensed sans — eyebrows, nav, labels, micro-copy.
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-eyebrow",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Body text — long-form paragraphs and form inputs.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteData.seo?.meta_title || siteData.business?.name || "Professional Services",
  description: siteData.seo?.meta_description || "",
  openGraph: {
    title: siteData.seo?.meta_title || "",
    description: siteData.seo?.meta_description || "",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${barlow.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
