import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NeuroAI — Research Smarter. Think Deeper.",
  description:
    "AI research assistant for Indian engineering students: search papers, read summaries, and draft literature reviews with Semantic Scholar and NeuroAI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${dmMono.variable} ${syne.variable} font-sans antialiased bg-[var(--color-void)] text-[var(--text-primary)] selection:bg-[#6C63FF] selection:text-white`}
      >
        <div className="cosmic-noise"></div>
        {children}
      </body>
    </html>
  );
}
