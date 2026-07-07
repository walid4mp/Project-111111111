import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/layout/BottomNav";
import ParticleBackground from "./components/ui/ParticleBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WarHex - Premium Social Gaming Platform",
  description: "Play, Stream, Connect - The Ultimate Gaming Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ParticleBackground />
        <div className="relative z-10">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
