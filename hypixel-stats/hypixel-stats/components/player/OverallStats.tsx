'use client';

import { motion } from 'framer-motion';
import { Sword, Trophy, Star, Zap, Shield, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, abbreviate, formatRatio } from '@/lib/utils';
import type { HypixelStats } from '@/types/hypixel';

interface OverallStatsProps {
  stats: HypixelStats;
  level: number;
  karma: number;
  achievementPoints: number;
}

// Simulated level progression data for the chart
function buildLevelProgressionData(currentLevel: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const lvl = Math.max(1, currentLevel - 9 + i);
    return {
      level: `${lvl}`,
      xp: Math.floor(lvl * lvl * 1250 + Math.random() * 5000),
    };
  });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">Level {label}</p>
      <p className="font-mono font-bold" style={{ color: 'var(--cyan)' }}>
        {formatNumber(payload[0]?.value)} XP
      </p>
    </div>
  );
}

export function OverallStats({ stats, level, karma, achievementPoints }: OverallStatsProps) {
  // Aggregate kills/wins across games
  const bwFinalKills = stats.Bedwars?.final_kills_bedwars ?? 0;
  const swKills = stats.SkyWars?.kills ?? 0;
  const duelsKills = stats.Duels?.kills ?? 0;
  const totalKills = bwFinalKills + swKills + duelsKills;

  const bwWins = stats.Bedwars?.wins_bedwars ?? 0;
  const swWins = stats.SkyWars?.wins ?? 0;
  const duelsWins = stats.Duels?.wins ?? 0;
  const totalWins = bwWins + swWins + duelsWins;

  const bwLosses = stats.Bedwars?.losses_bedwars ?? 0;
  const swLosses = stats.SkyWars?.losses ?? 0;
  const duelsLosses = stats.Duels?.losses ?? 0;
  const totalLosses = bwLosses + swLosses + duelsLosses;

  const chartData = buildLevelProgressionData(level);

  const cards = [
    {
      label: 'Network Level',
      value: `${level}★`,
      icon: Star,
      iconColor: 'var(--cyan)',
      highlight: true,
    },
    {
      label: 'Total Wins',
      value: abbreviate(totalWins),
      subValue: formatRatio(totalWins, totalLosses) + ' W/L',
      icon: Trophy,
      iconColor: 'var(--amber)',
    },
    {
      label: 'Combined Kills',
      value: abbreviate(totalKills),
      subValue: 'Across all games',
      icon: Sword,
      iconColor: 'var(--purple)',
    },
    {
      label: 'Achievement Pts',
      value: formatNumber(achievementPoints),
      icon: Zap,
      iconColor: 'var(--cyan)',
    },
    {
      label: 'BedWars Stars',
      value: `${stats.Bedwars?.wins_bedwars ?? 0} W`,
      subValue: `FKDR ${formatRatio(stats.Bedwars?.final_kills_bedwars, stats.Bedwars?.final_deaths_bedwars)}`,
      icon: Shield,
      iconColor: '#f472b6',
    },
    {
      label: 'SkyWars Wins',
      value: abbreviate(swWins),
      subValue: `KDR ${formatRatio(stats.SkyWars?.kills, stats.SkyWars?.deaths)}`,
      icon: TrendingUp,
      iconColor: '#34d399',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.06} />
        ))}
      </div>

      {/* XP Progression Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-1 font-display text-sm font-semibold uppercase tracking-widest text-gray-400">
          XP Progression
        </h3>
        <p className="mb-5 text-xs text-gray-600">Estimated cumulative XP over recent network levels</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="level"
              tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={v => abbreviate(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="var(--cyan)"
              fill="url(#xpGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--cyan)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Game summary table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gray-400">
          Game Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                {['Game', 'Wins', 'Losses', 'W/L', 'Kills'].map(col => (
                  <th key={col} className="pb-3 text-left font-mono text-xs text-gray-600 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {[
                {
                  game: 'BedWars',
                  wins: bwWins,
                  losses: bwLosses,
                  kills: bwFinalKills,
                  color: 'var(--cyan)',
                },
                {
                  game: 'SkyWars',
                  wins: swWins,
                  losses: swLosses,
                  kills: swKills,
                  color: 'var(--purple)',
                },
                {
                  game: 'Duels',
                  wins: duelsWins,
                  losses: duelsLosses,
                  kills: duelsKills,
                  color: 'var(--amber)',
                },
              ].map(row => (
                <tr key={row.game} className="group hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 font-medium" style={{ color: row.color }}>
                    {row.game}
                  </td>
                  <td className="py-3 font-mono text-white">{formatNumber(row.wins)}</td>
                  <td className="py-3 font-mono text-gray-500">{formatNumber(row.losses)}</td>
                  <td className="py-3 font-mono" style={{ color: row.color }}>
                    {formatRatio(row.wins, row.losses)}
                  </td>
                  <td className="py-3 font-mono text-gray-300">{abbreviate(row.kills)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
