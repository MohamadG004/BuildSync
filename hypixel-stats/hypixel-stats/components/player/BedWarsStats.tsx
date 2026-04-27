'use client';

import { motion } from 'framer-motion';
import {
  Sword, Shield, Skull, Bed, Trophy, Zap, Target, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import {
  formatNumber, formatRatio, abbreviate, getBedwarsLevel, getStatColor
} from '@/lib/utils';
import type { BedWarsStats } from '@/types/hypixel';

interface BedWarsStatsProps {
  stats: BedWarsStats;
}

const CHART_COLORS = ['var(--cyan)', 'var(--purple)', 'var(--amber)', '#f472b6'];

// Custom tooltip for recharts
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="font-mono font-bold" style={{ color: 'var(--cyan)' }}>
        {formatNumber(payload[0]?.value)}
      </p>
    </div>
  );
}

export function BedWarsStatsComponent({ stats }: BedWarsStatsProps) {
  const bwLevel = getBedwarsLevel(stats.Experience ?? 0);

  const wins = stats.wins_bedwars ?? 0;
  const losses = stats.losses_bedwars ?? 0;
  const kills = stats.kills_bedwars ?? 0;
  const deaths = stats.deaths_bedwars ?? 0;
  const finalKills = stats.final_kills_bedwars ?? 0;
  const finalDeaths = stats.final_deaths_bedwars ?? 0;
  const bedsBroken = stats.beds_broken_bedwars ?? 0;
  const bedsLost = stats.beds_lost_bedwars ?? 0;
  const gamesPlayed = stats.games_played_bedwars ?? 0;

  const fkdr = parseFloat(formatRatio(finalKills, finalDeaths));
  const wlr = parseFloat(formatRatio(wins, losses));
  const kdr = parseFloat(formatRatio(kills, deaths));
  const bblr = parseFloat(formatRatio(bedsBroken, bedsLost));

  // Mode-based wins data for chart
  const modeData = [
    { mode: 'Solos', wins: stats.eight_one_wins_bedwars ?? 0 },
    { mode: 'Doubles', wins: stats.eight_two_wins_bedwars ?? 0 },
    { mode: '3v3v3v3', wins: stats.four_three_wins_bedwars ?? 0 },
    { mode: '4v4v4v4', wins: stats.four_four_wins_bedwars ?? 0 },
    { mode: '4v4', wins: stats.two_four_wins_bedwars ?? 0 },
  ];

  const cards = [
    {
      label: 'Final Kill/Death Ratio',
      value: formatRatio(finalKills, finalDeaths),
      subValue: `${formatNumber(finalKills)} FK / ${formatNumber(finalDeaths)} FD`,
      icon: Zap,
      iconColor: getStatColor(fkdr, [1, 3, 6]),
      highlight: fkdr >= 3,
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
      label: 'Kill/Death Ratio',
      value: formatRatio(kills, deaths),
      subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`,
      icon: Sword,
      iconColor: getStatColor(kdr, [1, 2, 4]),
    },
    {
      label: 'Beds Broken/Lost',
      value: formatRatio(bedsBroken, bedsLost),
      subValue: `${formatNumber(bedsBroken)} broken / ${formatNumber(bedsLost)} lost`,
      icon: Bed,
      iconColor: getStatColor(bblr, [0.5, 1, 2]),
    },
    {
      label: 'Final Kills',
      value: abbreviate(finalKills),
      subValue: formatNumber(finalKills),
      icon: Skull,
      iconColor: 'var(--purple)',
    },
    {
      label: 'Wins',
      value: abbreviate(wins),
      subValue: `${formatNumber(gamesPlayed)} games played`,
      icon: Trophy,
      iconColor: 'var(--amber)',
    },
    {
      label: 'Win Streak',
      value: formatNumber(stats.winstreak ?? 0),
      icon: TrendingUp,
      iconColor: 'var(--cyan)',
    },
    {
      label: 'Beds Broken',
      value: abbreviate(bedsBroken),
      icon: Target,
      iconColor: '#f472b6',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Level badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <div
          className="rounded-lg px-4 py-2 font-display text-sm font-bold"
          style={{
            background: 'rgba(0,255,208,0.1)',
            border: '1px solid rgba(0,255,208,0.2)',
            color: 'var(--cyan)',
          }}
        >
          ✦ {bwLevel}★ BedWars
        </div>
        <div className="text-sm text-gray-500">
          {abbreviate(stats.Experience ?? 0)} XP
        </div>
      </motion.div>

      {/* Stat cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* Wins by mode chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-1 font-display text-sm font-semibold uppercase tracking-widest text-gray-400">
          Wins by Mode
        </h3>
        <p className="mb-5 text-xs text-gray-600">
          Total wins across all BedWars game modes
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={modeData} barCategoryGap="35%">
            <XAxis
              dataKey="mode"
              tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={v => abbreviate(v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="wins" radius={[4, 4, 0, 0]}>
              {modeData.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Resources collected */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gray-400">
          Resources Collected
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Iron', value: stats.iron_resources_collected_bedwars, color: '#e5e7eb' },
            { label: 'Gold', value: stats.gold_resources_collected_bedwars, color: '#f59e0b' },
            { label: 'Diamond', value: stats.diamond_resources_collected_bedwars, color: '#60a5fa' },
            { label: 'Emerald', value: stats.emerald_resources_collected_bedwars, color: '#34d399' },
          ].map(r => (
            <div
              key={r.label}
              className="rounded-xl bg-[rgba(255,255,255,0.03)] p-3 text-center"
              style={{ border: `1px solid ${r.color}20` }}
            >
              <p className="font-mono text-lg font-bold" style={{ color: r.color }}>
                {abbreviate(r.value ?? 0)}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">{r.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
