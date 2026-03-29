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
  title: "NeuroAI - AI-powered research assistant",
  description: "Search papers, get insights, and explore the latest research in neuroscience and AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`${dmMono.variable} ${syne.variable} font-sans antialiased bg-[#050508] text-[#F0F0FF] selection:bg-[#6C63FF] selection:text-white`}>
        <div className="cosmic-noise"></div>
        {children}
      </body>
    </html>
  );
}
