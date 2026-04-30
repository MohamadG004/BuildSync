'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { isValidUsername } from '@/lib/utils';

const FEATURED_PLAYERS = ['Technoblade', 'Dream', 'Hypixel', 'Gamerboy80'];

export function HeroSection() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = username.trim();
    setError('');

    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }

    if (!isValidUsername(trimmed)) {
      setError('Invalid username. Only letters, numbers, and underscores (max 16 chars).');
      return;
    }

    setLoading(true);
    router.push(`/player/${trimmed}`);
  }

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
      <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(37,99,235,0.08)] blur-3xl" />

      <div className="w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(37,99,235,0.12)] bg-[rgba(37,99,235,0.06)] px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="font-mono text-xs tracking-wide text-[var(--accent)]">
            LIVE STATS TRACKER
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="mb-4 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          <span className="block">Track any</span>
          <span className="block text-[var(--accent)]">Hypixel</span>
          <span className="block">player.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.55 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
        >
          Real-time stats, BedWars, SkyWars, Duels, and more. Search any player to see a clean,
          detailed performance breakdown.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.24, duration: 0.45 }}
          className="mx-auto w-full max-w-xl"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 z-10 text-slate-400"
              />
              <input
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter Minecraft username..."
                autoComplete="off"
                spellCheck={false}
                disabled={loading}
                className="w-full rounded-2xl border border-[var(--border)] bg-white py-4 pl-12 pr-36 text-base text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.04)] outline-none transition-all placeholder:text-slate-400 focus:border-[rgba(37,99,235,0.35)] focus:ring-4 focus:ring-[rgba(37,99,235,0.08)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="absolute right-2 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: 'var(--accent)' }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-sm text-red-500"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Try:</span>
            {FEATURED_PLAYERS.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setUsername(name);
                  setError('');
                }}
                className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs text-slate-600 transition-all hover:border-[rgba(37,99,235,0.25)] hover:text-slate-900"
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.55 }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { value: '30M+', label: 'Players Tracked' },
            { value: '15+', label: 'Game Modes' },
            { value: 'Live', label: 'Data Updates' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
            >
              <p className="text-2xl font-semibold tracking-tight text-[var(--accent)]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}