import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Erik Parr — Design Technologist",
  description: "Building Agentic Systems for Interactive Products. Portfolio of Erik Parr — product prototyping, systems design, AI-driven tools.",
  metadataBase: new URL("https://design.erikparr.com"),
  openGraph: {
    title: "Erik Parr — Design Technologist",
    description: "Building Agentic Systems for Interactive Products",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Erik Parr — Design Technologist",
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
        {children}
      </body>
    </html>
  );
}
