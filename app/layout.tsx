import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const mono = GeistMono;

export const metadata: Metadata = {
  title: "Erik Parr — Design Engineer",
  description: "Building Agentic Systems for Interactive Products. Portfolio of Erik Parr — product prototyping, systems design, AI-driven tools.",
  metadataBase: new URL("https://design.erikparr.com"),
  openGraph: {
    title: "Erik Parr — Design Engineer",
    description: "Building Agentic Systems for Interactive Products",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Erik Parr — Design Engineer",
    description: "Building Agentic Systems for Interactive Products",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteNav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
