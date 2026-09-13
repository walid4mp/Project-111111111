import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNav from './components/layout/BottomNav';
import ParticleBackground from './components/ui/ParticleBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WarHex - Premium Social Gaming Platform',
    template: '%s | WarHex',
  },
  description: 'Play, compete, stream, chat, and manage your gaming profile in one premium social gaming experience.',
  keywords: ['gaming', 'social gaming', 'multiplayer', 'live rooms', 'voice rooms', 'tournaments', 'gifts', 'VIP'],
  applicationName: 'WarHex',
  category: 'games',
  openGraph: {
    title: 'WarHex - Premium Social Gaming Platform',
    description: 'Play, compete, stream, chat, and manage your gaming profile in one premium social gaming experience.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WarHex - Premium Social Gaming Platform',
    description: 'Play, compete, stream, chat, and manage your gaming profile in one premium social gaming experience.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#0a0a0f] text-white`}>
        <ParticleBackground />
        <div className="relative z-10">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
