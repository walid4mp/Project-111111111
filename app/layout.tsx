import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/layout/BottomNav";
import ParticleBackground from "./components/ui/ParticleBackground";
import { LanguageProvider } from "./components/i18n/LanguageProvider";
import AdBanner from "./components/ads/AdBanner";
import AuthGate from "./components/auth/AuthGate";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  title: "WarHex — Online Gaming Community",
  description: "Play, compete, chat, stream and connect on WarHex.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          <ParticleBackground />
          <AuthGate><div className="relative z-10">{children}</div></AuthGate>
          <AdBanner />
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
