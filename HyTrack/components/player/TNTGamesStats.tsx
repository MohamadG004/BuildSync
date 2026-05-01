'use client';

import { motion } from 'framer-motion';
import { Trophy, Skull, Timer, Coins, Target, Zap } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio } from '@/lib/utils';
import type { TNTGamesStats } from '@/types/hypixel';

function formatRecord(seconds: number | undefined): string {
  if (!seconds) return 'N/A';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function TNTGamesStatsComponent({ stats }: { stats: TNTGamesStats }) {
  const coins = stats.coins ?? 0;

  const totalWins =
    (stats.wins_tntrun ?? 0) +
    (stats.wins_pvprun ?? 0) +
    (stats.wins_bowspleef ?? 0) +
    (stats.wins_capture ?? 0) +
    (stats.wins_tntag ?? 0);

  const cards = [
    { label: 'Total Wins',       value: formatNumber(totalWins),                                                                                                         icon: Trophy,  iconColor: 'var(--amber)',   highlight: totalWins > 100 },
    { label: 'TNT Run Wins',     value: formatNumber(stats.wins_tntrun ?? 0),       subValue: `Best run: ${formatRecord(stats.record_tntrun)}`,                          icon: Timer,   iconColor: 'var(--accent)' },
    { label: 'PVP Run',          value: formatNumber(stats.wins_pvprun ?? 0),       subValue: `${formatNumber(stats.kills_pvprun ?? 0)} kills`,                          icon: Zap,     iconColor: '#ef4444' },
    { label: 'TNT Tag Wins',     value: formatNumber(stats.wins_tntag ?? 0),        subValue: `${formatNumber(stats.kills_tntag ?? 0)} tags`,                            icon: Target,  iconColor: 'var(--purple)' },
    { label: 'Bow Spleef Wins',  value: formatNumber(stats.wins_bowspleef ?? 0),    subValue: `${formatNumber(stats.deaths_bowspleef ?? 0)} deaths`,                     icon: Skull,   iconColor: '#16a34a' },
    { label: 'Coins',            value: formatNumber(coins),                                                                                                             icon: Coins,   iconColor: 'var(--amber)' },
  ];

  const modes = [
    { label: 'TNT Run',   wins: stats.wins_tntrun ?? 0,    deaths: stats.deaths_tntrun ?? 0,    color: 'var(--accent)' },
    { label: 'PVP Run',   wins: stats.wins_pvprun ?? 0,    deaths: stats.deaths_pvprun ?? 0,    color: '#ef4444' },
    { label: 'Bow Spleef',wins: stats.wins_bowspleef ?? 0, deaths: stats.deaths_bowspleef ?? 0, color: '#16a34a' },
    { label: 'TNT Capture',wins: stats.wins_capture ?? 0,  deaths: stats.deaths_capture ?? 0,  color: 'var(--purple)' },
    { label: 'TNT Tag',   wins: stats.wins_tntag ?? 0,     deaths: undefined,                   color: 'var(--amber)' },
  ];

  return (
    <div className="space-y-5">
      {/* Badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: '#ef4444' }}>
            💥 TNT Games
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

      {/* Mode breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Mode Breakdown</h3>
        <div className="space-y-3">
          {modes.map(m => (
            <div key={m.label} className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
              <div className="w-28 shrink-0">
                <p className="text-xs font-semibold text-slate-700">{m.label}</p>
              </div>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (m.wins / Math.max(totalWins, 1)) * 100)}%`, background: m.color }}
                  />
                </div>
              </div>
              <p className="font-mono text-sm font-bold shrink-0" style={{ color: m.color }}>
                {formatNumber(m.wins)} W
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}