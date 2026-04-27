'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle, Sword, Shield, Star } from 'lucide-react';
import { isValidUsername } from '@/lib/utils';

const FEATURED_PLAYERS = ['Technoblade', 'Dream', 'Hypixel', 'Gamerboy80'];

const FLOATING_STATS = [
  { label: 'BedWars FKDR', value: '12.4', icon: Sword, color: 'var(--cyan)' },
  { label: 'Network Level', value: '847★', icon: Star, color: 'var(--purple)' },
  { label: 'Win Rate', value: '68.2%', icon: Shield, color: 'var(--amber)' },
];

export function HeroSection() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
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
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
      {/* Decorative floating stat cards */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
            style={{
              position: 'absolute',
              top: `${30 + i * 20}%`,
              left: i === 1 ? undefined : i === 0 ? '5%' : '5%',
              right: i === 1 ? '5%' : i === 2 ? undefined : undefined,
            }}
            className="glass-card rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <stat.icon size={14} style={{ color: stat.color }} />
              <span className="text-xs text-gray-500 font-body">{stat.label}</span>
            </div>
            <p className="mt-1 font-mono text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,208,0.2)] bg-[rgba(0,255,208,0.05)] px-4 py-1.5"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--cyan)]" />
        <span className="font-mono text-xs text-[var(--cyan)]">LIVE STATS TRACKER</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-display mb-4 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl"
      >
        <span className="block text-white">Track Any</span>
        <span
          className="block neon-cyan"
          style={{ color: 'var(--cyan)' }}
        >
          Hypixel
        </span>
        <span className="block text-white">Player.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-10 max-w-lg text-base text-gray-400 sm:text-lg"
      >
        Real-time stats, BedWars, SkyWars, Duels, and more.
        Search any player to see their full performance breakdown.
      </motion.p>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-gray-500 pointer-events-none z-10"
            />
            <input
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter Minecraft username..."
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              className="w-full rounded-2xl border border-[rgba(0,255,208,0.15)] bg-[rgba(13,17,23,0.9)] py-4 pl-12 pr-36 text-base text-white placeholder-gray-600 outline-none transition-all focus:border-[rgba(0,255,208,0.5)] focus:ring-2 focus:ring-[rgba(0,255,208,0.1)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="absolute right-2 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-body"
              style={{ background: 'var(--cyan)' }}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-sm text-red-400"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </form>

        {/* Quick search examples */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-600">Try:</span>
          {FEATURED_PLAYERS.map(name => (
            <button
              key={name}
              onClick={() => { setUsername(name); setError(''); }}
              className="rounded-full border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-gray-400 transition-all hover:border-[rgba(0,255,208,0.3)] hover:text-white"
            >
              {name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center"
      >
        {[
          { value: '30M+', label: 'Players Tracked' },
          { value: '15+', label: 'Game Modes' },
          { value: 'Live', label: 'Data Updates' },
        ].map(stat => (
          <div key={stat.label}>
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--cyan)' }}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
