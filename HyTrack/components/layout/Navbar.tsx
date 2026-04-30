'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Home, Menu, X, Zap } from 'lucide-react';
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

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = search.trim();
    if (!trimmed || !isValidUsername(trimmed)) return;

    router.push(`/player/${trimmed}`);
    setSearch('');
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
            <Zap size={18} className="text-[var(--accent)]" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-900">
            HY<span className="text-[var(--accent)]">TRACK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'text-[var(--accent)]'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xs md:flex">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Quick search..."
              className="w-full rounded-lg border border-[var(--border)] bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[rgba(37,99,235,0.35)] focus:ring-2 focus:ring-[rgba(37,99,235,0.08)]"
            />
          </div>
        </form>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="text-slate-600 hover:text-slate-900 md:hidden"
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
            className="overflow-hidden border-t border-[var(--border)] bg-white md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search player..."
                    className="w-full rounded-lg border border-[var(--border)] bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </form>

              {/* Mobile Nav */}
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium',
                      active ? 'text-[var(--accent)]' : 'text-slate-600'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}