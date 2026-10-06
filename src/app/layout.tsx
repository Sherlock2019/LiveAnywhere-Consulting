import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Relocate Anywhere Network | LiveAnywhere Consulting", template: "%s | Relocate Anywhere Network" },
  description: "Plan an international move from visa strategy to your new front door. Start with USA and Vietnam.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Relocate Anywhere Network by LiveAnywhere Consulting",
    description: "International relocation planning and coordination services.",
    areaServed: ["United States", "Vietnam"],
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteShell>{children}</SiteShell>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
