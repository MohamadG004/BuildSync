'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sword, Skull, Bed, Trophy, Zap, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, formatRatio, abbreviate, getBedwarsLevel, getStatColor } from '@/lib/utils';
import type { BedWarsStats } from '@/types/hypixel';

const CHART_COLORS = ['var(--accent)', 'var(--purple)', 'var(--amber)', '#f472b6'];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border-strong)] bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-0.5 text-slate-400">{label}</p>
      <p className="font-mono font-bold text-[var(--accent)]">{formatNumber(payload[0]?.value)}</p>
    </div>
  );
}

export function BedWarsStatsComponent({ stats }: { stats: BedWarsStats }) {
  const bwLevel     = getBedwarsLevel(stats.Experience ?? 0);
  const wins        = stats.wins_bedwars ?? 0;
  const losses      = stats.losses_bedwars ?? 0;
  const kills       = stats.kills_bedwars ?? 0;
  const deaths      = stats.deaths_bedwars ?? 0;
  const finalKills  = stats.final_kills_bedwars ?? 0;
  const finalDeaths = stats.final_deaths_bedwars ?? 0;
  const bedsBroken  = stats.beds_broken_bedwars ?? 0;
  const bedsLost    = stats.beds_lost_bedwars ?? 0;
  const gamesPlayed = stats.games_played_bedwars ?? 0;

  const fkdr = parseFloat(formatRatio(finalKills, finalDeaths));
  const wlr  = parseFloat(formatRatio(wins, losses));
  const kdr  = parseFloat(formatRatio(kills, deaths));
  const bblr = parseFloat(formatRatio(bedsBroken, bedsLost));

  const modeData = [
    { mode: 'Solos',   wins: stats.eight_one_wins_bedwars ?? 0 },
    { mode: 'Doubles', wins: stats.eight_two_wins_bedwars ?? 0 },
    { mode: '3v3v3v3', wins: stats.four_three_wins_bedwars ?? 0 },
    { mode: '4v4v4v4', wins: stats.four_four_wins_bedwars ?? 0 },
    { mode: '4v4',     wins: stats.two_four_wins_bedwars ?? 0 },
  ];

  const cards = [
    { label: 'Final Kill/Death',  value: formatRatio(finalKills, finalDeaths), subValue: `${formatNumber(finalKills)} FK / ${formatNumber(finalDeaths)} FD`, icon: Zap,       iconColor: getStatColor(fkdr, [1,3,6]), highlight: fkdr >= 3 },
    { label: 'Win/Loss Ratio',    value: formatRatio(wins, losses),             subValue: `${formatNumber(wins)} W / ${formatNumber(losses)} L`,               icon: Trophy,    iconColor: getStatColor(wlr, [0.5,1,2]), highlight: wlr >= 1 },
    { label: 'Kill/Death Ratio',  value: formatRatio(kills, deaths),            subValue: `${formatNumber(kills)} K / ${formatNumber(deaths)} D`,               icon: Sword,     iconColor: getStatColor(kdr, [1,2,4]) },
    { label: 'Beds Broken/Lost',  value: formatRatio(bedsBroken, bedsLost),     subValue: `${formatNumber(bedsBroken)} broken / ${formatNumber(bedsLost)} lost`, icon: Bed,       iconColor: getStatColor(bblr, [0.5,1,2]) },
    { label: 'Final Kills',       value: abbreviate(finalKills),                subValue: formatNumber(finalKills),                                             icon: Skull,     iconColor: 'var(--purple)' },
    { label: 'Wins',              value: abbreviate(wins),                      subValue: `${formatNumber(gamesPlayed)} games played`,                          icon: Trophy,    iconColor: 'var(--amber)' },
    { label: 'Win Streak',        value: formatNumber(stats.winstreak ?? 0),    icon: TrendingUp, iconColor: 'var(--accent)' },
    { label: 'Beds Broken',       value: abbreviate(bedsBroken),                icon: Target,    iconColor: '#f472b6' },
  ];

  return (
    <div className="space-y-5">
      {/* Level badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2">
          <Image 
            src="/assets/icons/bed.jpg" 
            alt="BedWars" 
            width={16} 
            height={16}
            style={{ objectFit: 'contain' }}
          />
          <span className="font-mono text-sm font-bold text-[var(--accent)]">{bwLevel}★ BedWars</span>
        </div>
        <span className="text-sm text-slate-400">{formatNumber(stats.coins ?? 0)} tokens</span>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.04} />
        ))}
      </div>

      {/* Wins by mode chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-900">Wins by Mode</h3>
          <p className="mt-0.5 text-xs text-slate-400">Total wins across all BedWars game modes</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={modeData} barCategoryGap="35%">
            <XAxis
              dataKey="mode"
              tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--chart-axis)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
              width={38}
              tickFormatter={v => abbreviate(v)}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(15,23,42,0.03)', radius: 6 }} />
            <Bar dataKey="wins" radius={[5, 5, 0, 0]}>
              {modeData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Resources Collected</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Iron',    value: stats.iron_resources_collected_bedwars,    color: '#64748b' },
            { label: 'Gold',    value: stats.gold_resources_collected_bedwars,    color: '#d97706' },
            { label: 'Diamond', value: stats.diamond_resources_collected_bedwars, color: '#3b82f6' },
            { label: 'Emerald', value: stats.emerald_resources_collected_bedwars, color: '#16a34a' },
          ].map(r => (
            <div
              key={r.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center"
            >
              <p className="font-mono text-lg font-bold" style={{ color: r.color }}>
                {abbreviate(r.value ?? 0)}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">{r.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}