'use client';

import { motion } from 'framer-motion';
import { Trophy, Sword, Skull, Star, Coins, Heart } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio, abbreviate } from '@/lib/utils';
import type { UHCStats } from '@/types/hypixel';

export function UHCStatsComponent({ stats }: { stats: UHCStats }) {
  const wins      = stats.wins ?? 0;
  const kills     = stats.kills ?? 0;
  const deaths    = stats.deaths ?? 0;
  const coins     = stats.coins ?? 0;
  const score     = stats.score ?? 0;
  const headsEaten= stats.heads_eaten ?? 0;

  const kdr = parseFloat(formatRatio(kills, deaths));

  const cards = [
    { label: 'Wins',             value: abbreviate(wins),          subValue: `${formatNumber(score)} score`,                          icon: Trophy,  iconColor: 'var(--amber)',   highlight: wins > 10 },
    { label: 'Kill/Death Ratio', value: formatRatio(kills, deaths), subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`, icon: Sword,   iconColor: 'var(--accent)',  highlight: kdr >= 1 },
    { label: 'Kills',            value: abbreviate(kills),                                                                            icon: Skull,   iconColor: '#ef4444' },
    { label: 'Score',            value: formatNumber(score),                                                                          icon: Star,    iconColor: 'var(--purple)' },
    { label: 'Heads Eaten',      value: formatNumber(headsEaten),                                                                     icon: Heart,   iconColor: '#f472b6' },
    { label: 'Coins',            value: abbreviate(coins),         subValue: formatNumber(coins),                                    icon: Coins,   iconColor: 'var(--amber)' },
  ];

  return (
    <div className="space-y-5">
      {/* Badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: '#ef4444' }}>
            ⚔️ UHC Champions
          </span>
        </div>
        <span className="text-sm text-slate-400">{formatNumber(score)} score</span>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Overview panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Combat Overview</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: 'Win Rate',    value: (wins + deaths) > 0 ? `${((wins/(wins+deaths))*100).toFixed(1)}%` : '0%', color: 'var(--accent)' },
            { label: 'Kills/Win',   value: wins > 0 ? (kills/wins).toFixed(1) : '0',                                color: 'var(--purple)' },
            { label: 'Heads Eaten', value: formatNumber(headsEaten),                                                 color: '#f472b6' },
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
              <p className="font-mono text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}