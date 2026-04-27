'use client';

import { motion } from 'framer-motion';
import { Sword, Trophy, Target, Zap, ArrowRight, Star } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio, abbreviate, getStatColor } from '@/lib/utils';
import type { SkyWarsStats } from '@/types/hypixel';

interface SkyWarsStatsProps {
  stats: SkyWarsStats;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs">
      <p className="font-mono font-bold" style={{ color: 'var(--purple)' }}>
        {payload[0]?.value?.toFixed(1)}
      </p>
    </div>
  );
}

export function SkyWarsStatsComponent({ stats }: SkyWarsStatsProps) {
  const wins = stats.wins ?? 0;
  const losses = stats.losses ?? 0;
  const kills = stats.kills ?? 0;
  const deaths = stats.deaths ?? 0;
  const gamesPlayed = stats.games_played_skywars ?? 0;

  const kdr = parseFloat(formatRatio(kills, deaths));
  const wlr = parseFloat(formatRatio(wins, losses));
  const arrowAccuracy = parseFloat(formatRatio(stats.arrows_hit, stats.arrows_shot)) * 100;

  const cards = [
    {
      label: 'Kill/Death Ratio',
      value: formatRatio(kills, deaths),
      subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`,
      icon: Sword,
      iconColor: getStatColor(kdr, [1, 2, 4]),
      highlight: kdr >= 2,
    },
    {
      label: 'Win/Loss Ratio',
      value: formatRatio(wins, losses),
      subValue: `${formatNumber(wins)} W / ${formatNumber(losses)} L`,
      icon: Trophy,
      iconColor: getStatColor(wlr, [0.5, 1, 2]),
      highlight: wlr >= 1,
    },
    {
      label: 'Wins',
      value: abbreviate(wins),
      subValue: `${formatNumber(gamesPlayed)} games`,
      icon: Star,
      iconColor: 'var(--amber)',
    },
    {
      label: 'Win Streak',
      value: formatNumber(stats.winstreak ?? 0),
      icon: Zap,
      iconColor: 'var(--cyan)',
    },
    {
      label: 'Arrow Accuracy',
      value: `${arrowAccuracy.toFixed(1)}%`,
      subValue: `${formatNumber(stats.arrows_hit ?? 0)} / ${formatNumber(stats.arrows_shot ?? 0)}`,
      icon: Target,
      iconColor: '#f472b6',
    },
    {
      label: 'Assists',
      value: formatNumber(stats.assists ?? 0),
      icon: ArrowRight,
      iconColor: 'var(--purple)',
    },
  ];

  // Radar chart data — normalized 0-100
  const normalize = (val: number, max: number) => Math.min(100, (val / max) * 100);

  const radarData = [
    { subject: 'KDR', A: normalize(kdr, 10) },
    { subject: 'WLR', A: normalize(wlr, 5) },
    { subject: 'Wins', A: normalize(wins, 5000) },
    { subject: 'Accuracy', A: arrowAccuracy },
    { subject: 'Kills', A: normalize(kills, 50000) },
    { subject: 'Assists', A: normalize(stats.assists ?? 0, 10000) },
  ];

  return (
    <div className="space-y-6">
      {/* Level */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div
          className="rounded-lg px-4 py-2 font-display text-sm font-bold"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'var(--purple)',
          }}
        >
          ✦ Level {stats.level ?? 1} SkyWars
        </div>
        <div className="text-sm text-gray-500">{formatNumber(stats.coins ?? 0)} coins</div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-1 font-display text-sm font-semibold uppercase tracking-widest text-gray-400">
          Performance Radar
        </h3>
        <p className="mb-4 text-xs text-gray-600">Normalized performance metrics (0–100)</p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="var(--purple)"
              fill="var(--purple)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Misc stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gray-400">
          Misc Statistics
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: 'Blocks Placed', value: abbreviate(stats.blocks_placed ?? 0), color: '#34d399' },
            { label: 'Blocks Broken', value: abbreviate(stats.blocks_broken ?? 0), color: '#f87171' },
            { label: 'Ender Pearls', value: formatNumber(stats.enderpearls_thrown ?? 0), color: '#a78bfa' },
            { label: 'Mob Kills', value: formatNumber(stats.mob_kills ?? 0), color: '#fb923c' },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-[rgba(255,255,255,0.03)] p-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="mt-0.5 text-xs text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
