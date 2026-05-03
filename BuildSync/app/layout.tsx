import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: {
    default: 'BuildSync',
    template: '%s | BuildSync',
  },
  description:
    'Track and analyze Hypixel player statistics for BedWars, SkyWars, and more. Real-time stats, charts, and player tracking.',
  keywords: ['Hypixel', 'Minecraft', 'stats', 'BedWars', 'SkyWars', 'player tracker'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Clean, modern font (consistent with rest of UI) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-body antialiased bg-[var(--bg)] text-[var(--text)]">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}