'use client';

import { motion } from 'framer-motion';
import { Sword, Trophy, Target, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio, getStatColor } from '@/lib/utils';
import type { DuelsStats } from '@/types/hypixel';

export function DuelsStatsComponent({ stats }: { stats: DuelsStats }) {
  const wins   = stats.wins ?? 0;
  const losses = stats.losses ?? 0;
  const kills  = stats.kills ?? 0;
  const deaths = stats.deaths ?? 0;
  const kdr    = parseFloat(formatRatio(kills, deaths));
  const wlr    = parseFloat(formatRatio(wins, losses));

  const bowAccuracy   = stats.bow_shots   ? ((stats.bow_hits  ?? 0) / stats.bow_shots   * 100).toFixed(1) : '0.0';
  const meleeAccuracy = stats.melee_swings ? ((stats.melee_hits ?? 0) / stats.melee_swings * 100).toFixed(1) : '0.0';

  const cards = [
    { label: 'Win/Loss Ratio',  value: formatRatio(wins, losses), subValue: `${formatNumber(wins)} W / ${formatNumber(losses)} L`,  icon: Trophy,    iconColor: getStatColor(wlr, [0.5,1,2]), highlight: wlr >= 1 },
    { label: 'Kill/Death',      value: formatRatio(kills, deaths), subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`, icon: Sword,     iconColor: getStatColor(kdr, [1,2,4]) },
    { label: 'Win Streak',      value: formatNumber(stats.winstreak ?? 0),                                                           icon: TrendingUp, iconColor: 'var(--accent)' },
    { label: 'Games Played',    value: formatNumber(stats.games_played_duels ?? 0),                                                  icon: Target,    iconColor: 'var(--purple)' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-5 text-sm font-semibold text-slate-900">Combat Accuracy</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Melee Accuracy', value: meleeAccuracy, hits: stats.melee_hits ?? 0, total: stats.melee_swings ?? 0, color: 'var(--accent)' },
            { label: 'Bow Accuracy',   value: bowAccuracy,   hits: stats.bow_hits ?? 0,   total: stats.bow_shots ?? 0,    color: 'var(--amber)' },
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
                <span className="font-mono text-sm font-bold" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {formatNumber(item.hits)} hits / {formatNumber(item.total)} attempts
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}