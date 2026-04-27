import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: {
    default: 'HyStats — Hypixel Player Statistics',
    template: '%s | HyStats',
  },
  description:
    'Track and analyze Hypixel player statistics for BedWars, SkyWars, and more. Real-time stats, charts, and player tracking.',
  keywords: ['Hypixel', 'Minecraft', 'stats', 'BedWars', 'SkyWars', 'player tracker'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load custom fonts via Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <div className="relative min-h-screen bg-void text-white">
            {/* Ambient grid background */}
            <div className="grid-overlay pointer-events-none fixed inset-0 z-0" />
            {/* Ambient glow blobs */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <div className="blob-1 absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-20" />
              <div className="blob-2 absolute top-1/2 -right-40 h-80 w-80 rounded-full opacity-15" />
              <div className="blob-3 absolute -bottom-40 left-1/3 h-96 w-96 rounded-full opacity-10" />
            </div>
            <Navbar />
            <main className="relative z-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
