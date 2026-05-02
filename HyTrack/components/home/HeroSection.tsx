'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Loader2, Search, BarChart3, Zap, Shield } from 'lucide-react';
import { isValidUsername } from '@/lib/utils';

const FEATURED_PLAYERS = ['Technoblade', 'Dream', 'Hypixel', 'Gamerboy80'];

const FEATURES = [
  { icon: BarChart3, label: 'Detailed analytics', color: 'var(--accent)' },
  { icon: Zap, label: 'Live data', color: '#d97706' },
  { icon: Shield, label: 'All Stats', color: '#7c3aed' },
];

export function HeroSection() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    setError('');
    if (!trimmed) { setError('Please enter a username.'); return; }
    if (!isValidUsername(trimmed)) {
      setError('Invalid username — letters, numbers, and underscores only (max 16 chars).');
      return;
    }
    setLoading(true);
    router.push(`/player/${trimmed}`);
  }

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/60" />
      <div className="absolute inset-0 -z-10 grid-overlay opacity-60" />
      <div className="blob-1 absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2" />
      <div className="blob-2 absolute bottom-0 right-0 -z-10 h-72 w-72" />

      <div className="w-full max-w-2xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-[11px] font-medium tracking-widest text-[var(--accent)] uppercase">
              Live Stats Tracker
            </span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mb-5 text-center text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          Track any{' '}
          <span className="relative">
            <span className="text-[var(--accent)]">Hypixel</span>
          </span>
          <br />
          player.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mb-10 max-w-lg text-center text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          Real-time Hypixel stats with charts, rankings, and clean performance breakdowns.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.4 }}
        >
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center shadow-[0_4px_32px_rgba(15,23,42,0.06)] rounded-2xl">
              <Search size={17} className="pointer-events-none absolute left-4 z-10 text-slate-400" />
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter Minecraft Username…"
                autoComplete="off"
                spellCheck={false}
                disabled={loading}
                className="w-full rounded-2xl border border-[var(--border-strong)] bg-white py-4 pl-12 pr-36 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[var(--accent-border)] focus:ring-3 focus:ring-[var(--accent-soft)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="absolute right-2 flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
              >
                {loading
                  ? <><Loader2 size={13} className="animate-spin" /> Loading…</>
                  : <><span>Search</span><ArrowRight size={13} /></>
                }
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-1.5 text-sm text-red-500"
              >
                <AlertCircle size={13} />
                {error}
              </motion.p>
            )}
          </form>

          {/* Quick picks */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400">Try:</span>
            {FEATURED_PLAYERS.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => { setUsername(name); setError(''); }}
                className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-all hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-3"
        >
          {[
            { value: '30M+', label: 'Players tracked' },
            { value: '15+', label: 'Game modes' },
            { value: 'Live', label: 'Data updates' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-center shadow-sm"
            >
              <p className="text-xl font-bold tracking-tight text-[var(--accent)] sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {FEATURES.map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
            >
              <Icon size={12} style={{ color }} />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}