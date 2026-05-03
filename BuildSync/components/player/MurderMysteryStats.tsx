'use client';

import { motion } from 'framer-motion';
import { Skull, Shield, Trophy, Sword, Coins, Eye } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, abbreviate, formatRatio } from '@/lib/utils';
import type { MurderMysteryStats } from '@/types/hypixel';

export function MurderMysteryStatsComponent({ stats }: { stats: MurderMysteryStats }) {
  const wins           = stats.wins ?? 0;
  const games          = stats.games ?? 0;
  const kills          = stats.kills ?? 0;
  const deaths         = stats.deaths ?? 0;
  const murdererWins   = stats.murderer_wins ?? 0;
  const detectiveWins  = stats.detective_wins ?? 0;
  const coins          = stats.coins ?? 0;

  const kdr = parseFloat(formatRatio(kills, deaths));

  const cards = [
    { label: 'Total Wins',       value: abbreviate(wins),          subValue: `${formatNumber(games)} games played`,                   icon: Trophy,  iconColor: 'var(--amber)',   highlight: wins > 100 },
    { label: 'Kill/Death Ratio', value: formatRatio(kills, deaths), subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`, icon: Sword,   iconColor: 'var(--accent)',  highlight: kdr >= 1 },
    { label: 'Murderer Wins',    value: formatNumber(murdererWins),  subValue: `${stats.was_murderer ?? 0} times as murderer`,         icon: Skull,   iconColor: '#ef4444' },
    { label: 'Detective Wins',   value: formatNumber(detectiveWins), subValue: `${stats.was_detective ?? 0} times as detective`,       icon: Eye,     iconColor: 'var(--purple)' },
    { label: 'Bow Kills',        value: formatNumber(stats.bow_kills ?? 0),                                                            icon: Shield,  iconColor: 'var(--green)' },
    { label: 'Coins',            value: abbreviate(coins),                                                                             icon: Coins,   iconColor: 'var(--amber)' },
  ];

  const killTypes = [
    { label: 'Knife Kills',        value: stats.knife_kills ?? 0,         color: '#ef4444' },
    { label: 'Thrown Knife Kills', value: stats.thrown_knife_kills ?? 0,  color: '#f97316' },
    { label: 'Bow Kills',          value: stats.bow_kills ?? 0,           color: '#3b82f6' },
    { label: 'Arrow Kills',        value: stats.arrow_kills ?? 0,         color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-5">
      {/* Badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: '#ef4444' }}>
            🔪 Murder Mystery
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

      {/* Kill types */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Kill Breakdown</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {killTypes.map(k => (
            <div key={k.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color: k.color }}>{formatNumber(k.value)}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{k.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Role breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Role Breakdown</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Murderer',   wins: murdererWins,  timesAs: stats.was_murderer ?? 0,  color: '#ef4444' },
            { label: 'Detective',  wins: detectiveWins, timesAs: stats.was_detective ?? 0, color: 'var(--purple)' },
          ].map(r => (
            <div key={r.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <p className="text-xs font-medium text-slate-400 mb-2">{r.label}</p>
              <p className="font-mono text-2xl font-bold mb-1" style={{ color: r.color }}>{formatNumber(r.wins)}</p>
              <p className="text-xs text-slate-400">wins · {formatNumber(r.timesAs)} games as role</p>
              <p className="text-xs font-medium mt-1" style={{ color: r.color }}>
                {r.timesAs > 0 ? `${((r.wins / r.timesAs) * 100).toFixed(1)}% win rate` : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}