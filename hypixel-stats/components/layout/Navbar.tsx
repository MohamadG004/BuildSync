'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Home, Zap, Menu, X } from 'lucide-react';
import { cn, isValidUsername } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/favorites', label: 'Favorites', icon: Star },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed || !isValidUsername(trimmed)) return;
    router.push(`/player/${trimmed}`);
    setSearch('');
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(0,255,208,0.08)] bg-[rgba(5,8,16,0.85)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Zap
              size={22}
              className="text-cyan-400 transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,255,208,0.8)]"
              style={{ color: 'var(--cyan)' }}
            />
          </div>
          <span
            className="font-display text-xl font-bold tracking-widest"
            style={{ color: 'var(--cyan)' }}
          >
            HY<span className="text-white">STATS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-white'
              )}
              style={pathname === href ? { color: 'var(--cyan)' } : {}}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xs md:flex">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Quick search..."
              className="w-full rounded-lg border border-[rgba(0,255,208,0.12)] bg-[rgba(13,17,23,0.8)] py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[rgba(0,255,208,0.4)] focus:ring-1 focus:ring-[rgba(0,255,208,0.15)]"
            />
          </div>
        </form>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="text-gray-400 hover:text-white md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[rgba(0,255,208,0.08)] md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search player..."
                    className="w-full rounded-lg border border-[rgba(0,255,208,0.12)] bg-[rgba(13,17,23,0.8)] py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none"
                  />
                </div>
              </form>
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    pathname === href ? 'text-cyan-400' : 'text-gray-400'
                  )}
                  style={pathname === href ? { color: 'var(--cyan)' } : {}}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
