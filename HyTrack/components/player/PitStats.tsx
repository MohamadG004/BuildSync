'use client';

import { motion } from 'framer-motion';
import { Sword, Skull, Trophy, Zap, Coins, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio, abbreviate } from '@/lib/utils';
import type { PitStats } from '@/types/hypixel';

export function PitStatsComponent({ stats }: { stats: PitStats }) {
  const profile     = stats.profile ?? {};
  const ptl         = profile.pit_stats_ptl ?? {};
  const kills       = ptl.kills ?? 0;
  const deaths      = ptl.deaths ?? 0;
  const assists     = ptl.assists ?? 0;
  const cash        = profile.cash ?? 0;
  const xp          = profile.xp ?? 0;

  const kdr = parseFloat(formatRatio(kills, deaths));

  const cards = [
    { label: 'Kill/Death Ratio', value: formatRatio(kills, deaths), subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`, icon: Sword,      iconColor: 'var(--accent)', highlight: kdr >= 1 },
    { label: 'Kills',            value: abbreviate(kills),                                                                             icon: Skull,      iconColor: '#ef4444' },
    { label: 'Assists',          value: abbreviate(assists),                                                                           icon: Trophy,     iconColor: 'var(--purple)' },
    { label: 'XP',               value: abbreviate(xp),             subValue: formatNumber(xp) + ' total',                            icon: TrendingUp, iconColor: 'var(--amber)' },
    { label: 'Gold',             value: abbreviate(Math.floor(cash)), subValue: `${formatNumber(Math.floor(cash))} g`,                 icon: Coins,      iconColor: 'var(--amber)' },
    { label: 'K+A / Death',      value: formatRatio(kills + assists, deaths),                                                         icon: Zap,        iconColor: '#16a34a' },
  ];

  return (
    <div className="space-y-5">
      {/* Badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(180,83,9,0.2)', background: 'rgba(180,83,9,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--amber)' }}>
            ⚗️ The Pit
          </span>
        </div>
        <span className="text-sm text-slate-400">{abbreviate(xp)} XP</span>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Combat overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Combat Overview</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Kills',   value: abbreviate(kills),   color: '#ef4444' },
            { label: 'Deaths',  value: abbreviate(deaths),  color: 'var(--text-muted)' },
            { label: 'Assists', value: abbreviate(assists),  color: 'var(--purple)' },
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">KDR</span>
          <span className="font-mono font-bold text-sm" style={{ color: kdr >= 1 ? 'var(--green)' : '#ef4444' }}>
            {formatRatio(kills, deaths)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}