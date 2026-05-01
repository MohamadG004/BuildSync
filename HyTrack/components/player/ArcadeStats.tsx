'use client';

import { motion } from 'framer-motion';
import { Trophy, Coins, Gamepad2, Star, Zap, Target } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, abbreviate } from '@/lib/utils';
import type { ArcadeStats } from '@/types/hypixel';

export function ArcadeStatsComponent({ stats }: { stats: ArcadeStats }) {
  const coins = stats.coins ?? 0;

  const cards = [
    { label: 'Coins',            value: abbreviate(coins),                                    subValue: formatNumber(coins),                      icon: Coins,    iconColor: 'var(--amber)' },
    { label: 'Galaxy Wars Wins', value: formatNumber(stats.wins_galaxy_wars ?? 0),            subValue: `${formatNumber(stats.kills_galaxy_wars ?? 0)} kills`,  icon: Star,     iconColor: 'var(--accent)' },
    { label: 'Party Games Wins', value: formatNumber((stats.wins_party_games_1 ?? 0) + (stats.wins_party_games_2 ?? 0) + (stats.wins_party_games_3 ?? 0)),  subValue: 'Across all party game types', icon: Trophy, iconColor: 'var(--purple)' },
    { label: 'Pixel Painters',   value: formatNumber(stats.wins_pixel_painters ?? 0),         icon: Gamepad2, iconColor: '#f472b6' },
    { label: 'Hypixel Says',     value: formatNumber(stats.wins_simon_says ?? 0),             icon: Zap,      iconColor: '#16a34a' },
    { label: 'Zombies Kills',    value: formatNumber(stats.zombie_kills_zombies ?? 0),        icon: Target,   iconColor: '#ef4444' },
  ];

  const miniGames = [
    { label: 'Party Games I',    value: stats.wins_party_games_1 ?? 0,    color: 'var(--accent)' },
    { label: 'Party Games II',   value: stats.wins_party_games_2 ?? 0,    color: 'var(--purple)' },
    { label: 'Party Games III',  value: stats.wins_party_games_3 ?? 0,    color: 'var(--amber)' },
    { label: 'Galaxy Wars',      value: stats.wins_galaxy_wars ?? 0,      color: '#16a34a' },
    { label: 'Pixel Painters',   value: stats.wins_pixel_painters ?? 0,   color: '#f472b6' },
    { label: 'Hypixel Says',     value: stats.wins_simon_says ?? 0,       color: '#3b82f6' },
    { label: 'Bounty Hunters',   value: stats.wins_bounty_hunters ?? 0,   color: '#f97316' },
    { label: 'Mini Walls',       value: stats.wins_mini_walls ?? 0,       color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-5">
      {/* Badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--purple)' }}>
            🎮 Arcade Games
          </span>
        </div>
        <span className="text-sm text-slate-400">{formatNumber(coins)} coins</span>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Wins per mini-game */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Wins per Mini-Game</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {miniGames.map(g => (
            <div key={g.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color: g.color }}>{formatNumber(g.value)}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{g.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}