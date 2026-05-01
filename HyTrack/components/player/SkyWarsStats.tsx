'use client';

import { motion } from 'framer-motion';
import { Sword, Trophy, Target, Zap, ArrowRight, Star } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio, abbreviate, getStatColor } from '@/lib/utils';
import type { SkyWarsStats } from '@/types/hypixel';

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border-strong)] bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-mono font-bold text-[var(--purple)]">{payload[0]?.value?.toFixed(1)}</p>
    </div>
  );
}

export function SkyWarsStatsComponent({ stats }: { stats: SkyWarsStats }) {
  const wins        = stats.wins ?? 0;
  const losses      = stats.losses ?? 0;
  const kills       = stats.kills ?? 0;
  const deaths      = stats.deaths ?? 0;
  const gamesPlayed = stats.games_played_skywars ?? 0;

  const kdr           = parseFloat(formatRatio(kills, deaths));
  const wlr           = parseFloat(formatRatio(wins, losses));
  const arrowAccuracy = parseFloat(formatRatio(stats.arrows_hit, stats.arrows_shot)) * 100;

  const cards = [
    { label: 'Kill/Death Ratio', value: formatRatio(kills, deaths), subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`, icon: Sword,     iconColor: getStatColor(kdr, [1,2,4]), highlight: kdr >= 2 },
    { label: 'Win/Loss Ratio',   value: formatRatio(wins, losses),  subValue: `${formatNumber(wins)} W / ${formatNumber(losses)} L`,  icon: Trophy,    iconColor: getStatColor(wlr, [0.5,1,2]), highlight: wlr >= 1 },
    { label: 'Wins',             value: abbreviate(wins),           subValue: `${formatNumber(gamesPlayed)} games`,                   icon: Star,      iconColor: 'var(--amber)' },
    { label: 'Win Streak',       value: formatNumber(stats.winstreak ?? 0),                                                           icon: Zap,       iconColor: 'var(--accent)' },
    { label: 'Arrow Accuracy',   value: `${arrowAccuracy.toFixed(1)}%`, subValue: `${formatNumber(stats.arrows_hit ?? 0)} / ${formatNumber(stats.arrows_shot ?? 0)}`, icon: Target, iconColor: '#f472b6' },
    { label: 'Assists',          value: formatNumber(stats.assists ?? 0),                                                             icon: ArrowRight, iconColor: 'var(--purple)' },
  ];

  const normalize = (val: number, max: number) => Math.min(100, (val / max) * 100);
  const radarData = [
    { subject: 'KDR',      A: normalize(kdr, 10) },
    { subject: 'WLR',      A: normalize(wlr, 5) },
    { subject: 'Wins',     A: normalize(wins, 5000) },
    { subject: 'Accuracy', A: arrowAccuracy },
    { subject: 'Kills',    A: normalize(kills, 50000) },
    { subject: 'Assists',  A: normalize(stats.assists ?? 0, 10000) },
  ];

  return (
    <div className="space-y-5">
      {/* Level badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--purple)' }}>
            ✦ Level {stats.level ?? 1} SkyWars
          </span>
        </div>
        <span className="text-sm text-slate-400">{formatNumber(stats.coins ?? 0)} coins</span>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Performance Radar</h3>
          <p className="mt-0.5 text-xs text-slate-400">Normalized metrics (0–100)</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            {/* Light-mode grid strokes */}
            <PolarGrid stroke="var(--chart-grid)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="var(--purple)"
              fill="var(--purple)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Tooltip content={<ChartTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Misc stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Misc Statistics</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Blocks Placed', value: abbreviate(stats.blocks_placed ?? 0),       color: '#16a34a' },
            { label: 'Blocks Broken', value: abbreviate(stats.blocks_broken ?? 0),       color: '#ef4444' },
            { label: 'Ender Pearls',  value: formatNumber(stats.enderpearls_thrown ?? 0), color: '#8b5cf6' },
            { label: 'Mob Kills',     value: formatNumber(stats.mob_kills ?? 0),          color: '#f97316' },
          ].map(item => (
            <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}