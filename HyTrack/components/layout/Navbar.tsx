'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Menu, X, Activity, Hammer } from 'lucide-react';
import { cn, isValidUsername } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',                 label: 'Home',            icon: Home   },
  { href: '/guess-the-build',  label: 'Guess the Build', icon: Hammer },
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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] shadow-sm">
            <Activity size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-slate-900">
            Hy<span className="text-[var(--accent)]">Track</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-72 md:flex">
          <div className="relative w-full">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search player…"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] py-2 pl-8.5 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[var(--accent-border)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </div>
        </form>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden transition-colors"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-[var(--border)] bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search player…"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-8.5 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </form>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <Icon size={15} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}