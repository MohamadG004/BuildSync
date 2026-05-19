'use client';

import { motion } from 'framer-motion';
import { Sword, Trophy, Star, Zap, Shield, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
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

function buildLevelProgressionData(currentLevel: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const lvl = Math.max(1, currentLevel - 9 + i);
    return { level: `${lvl}`, xp: Math.floor(lvl * lvl * 1250 + Math.random() * 5000) };
  });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border-strong)] bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-0.5 text-slate-400">Level {label}</p>
      <p className="font-mono font-bold text-[var(--accent)]">{formatNumber(payload[0]?.value)} XP</p>
    </div>
  );
}

export function OverallStats({ stats, level, karma, achievementPoints }: OverallStatsProps) {
  const bwFinalKills = stats.Bedwars?.final_kills_bedwars ?? 0;
  const swKills      = stats.SkyWars?.kills ?? 0;
  const duelsKills   = stats.Duels?.kills ?? 0;
  const totalKills   = bwFinalKills + swKills + duelsKills;

  const bwWins    = stats.Bedwars?.wins_bedwars ?? 0;
  const swWins    = stats.SkyWars?.wins ?? 0;
  const duelsWins = stats.Duels?.wins ?? 0;
  const totalWins = bwWins + swWins + duelsWins;

  const bwLosses    = stats.Bedwars?.losses_bedwars ?? 0;
  const swLosses    = stats.SkyWars?.losses ?? 0;
  const duelsLosses = stats.Duels?.losses ?? 0;
  const totalLosses = bwLosses + swLosses + duelsLosses;

  const chartData = buildLevelProgressionData(level);

  const cards = [
    { label: 'Network Level',    value: `${level}★`,                         icon: Star,      iconColor: 'var(--accent)', highlight: true },
    { label: 'Total Wins',       value: abbreviate(totalWins),                subValue: formatRatio(totalWins, totalLosses) + ' W/L', icon: Trophy,    iconColor: 'var(--amber)' },
    { label: 'Combined Kills',   value: abbreviate(totalKills),               subValue: 'Across all games', icon: Sword,     iconColor: 'var(--purple)' },
    { label: 'Achievement Pts',  value: formatNumber(achievementPoints),       icon: Zap,       iconColor: 'var(--accent)' },
    { label: 'BedWars Wins',     value: `${bwWins} W`,                        subValue: `FKDR ${formatRatio(stats.Bedwars?.final_kills_bedwars, stats.Bedwars?.final_deaths_bedwars)}`, icon: Shield,    iconColor: '#f472b6' },
    { label: 'SkyWars Wins',     value: abbreviate(swWins),                   subValue: `KDR ${formatRatio(stats.SkyWars?.kills, stats.SkyWars?.deaths)}`, icon: TrendingUp, iconColor: '#34d399' },
  ];

  // Build a list of known games and extract wins/losses/kills/plays where available.
  // Use explicit `games_played` fields when present, otherwise fall back to wins+losses or wins as a proxy.
  const bwPlays = stats.Bedwars?.games_played_bedwars ?? ((stats.Bedwars?.wins_bedwars ?? 0) + (stats.Bedwars?.losses_bedwars ?? 0));
  const swPlays = stats.SkyWars?.games_played_skywars ?? ((stats.SkyWars?.wins ?? 0) + (stats.SkyWars?.losses ?? 0));
  const duelsPlays = stats.Duels?.games_played_duels ?? ((stats.Duels?.wins ?? 0) + (stats.Duels?.losses ?? 0));
  const bbPlays = stats.BuildBattle?.games_played ?? (stats.BuildBattle?.wins ?? 0);
  const mmPlays = stats.MurderMystery?.games ?? (stats.MurderMystery?.wins ?? 0);
  const tntStats = stats.TNTGames ?? {} as any;
  const tntWins = (tntStats.wins_tntrun ?? 0) + (tntStats.wins_pvprun ?? 0) + (tntStats.wins_bowspleef ?? 0) + (tntStats.wins_capture ?? 0) + (tntStats.wins_tntag ?? 0);
  const tntDeaths = (tntStats.deaths_tntrun ?? 0) + (tntStats.deaths_pvprun ?? 0) + (tntStats.deaths_bowspleef ?? 0) + (tntStats.deaths_capture ?? 0);
  const tntKills = (tntStats.kills_pvprun ?? 0) + (tntStats.kills_capture ?? 0) + (tntStats.kills_tntag ?? 0);
  const tntPlays = tntWins + tntDeaths;

  const allGames = [
    { game: 'BedWars', key: 'Bedwars', wins: bwWins,    losses: bwLosses,    kills: bwFinalKills, color: 'var(--accent)', plays: bwPlays },
    { game: 'SkyWars', key: 'SkyWars', wins: swWins,    losses: swLosses,    kills: swKills,      color: 'var(--purple)', plays: swPlays },
    { game: 'Duels',   key: 'Duels',   wins: duelsWins, losses: duelsLosses, kills: duelsKills,   color: 'var(--amber)', plays: duelsPlays },
    { game: 'Build Battle', key: 'BuildBattle', wins: stats.BuildBattle?.wins ?? 0, losses: 0, kills: 0, color: '#60a5fa', plays: bbPlays },
    { game: 'Murder Mystery', key: 'MurderMystery', wins: stats.MurderMystery?.wins ?? 0, losses: stats.MurderMystery?.deaths ?? 0, kills: stats.MurderMystery?.kills ?? 0, color: '#f97316', plays: mmPlays },
    { game: 'TNT Games', key: 'TNTGames', wins: tntWins, losses: tntDeaths, kills: tntKills, color: '#ef4444', plays: tntPlays },
  ];

  // Sort by plays descending and take top 3. If all plays are zero, fall back to BedWars/SkyWars/Duels.
  const sortedByPlays = allGames.slice().sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
  const topGames = (sortedByPlays.length && sortedByPlays[0].plays > 0)
    ? sortedByPlays.slice(0, 3)
    : [allGames[0], allGames[1], allGames[2]];

  return (
    <div className="space-y-5">
      {/* Stat grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.05} />
        ))}
      </div>

      {/* XP Progression chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <SectionHeader title="XP Progression" subtitle="Estimated cumulative XP over recent network levels" />
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="level"
              tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--chart-axis)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false} tickLine={false}
              width={48}
              tickFormatter={v => abbreviate(v)}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="var(--accent)"
              fill="url(#xpGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Game summary table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <SectionHeader title="Game Summary" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Game', 'Wins', 'Losses', 'W/L', 'Kills'].map(col => (
                  <th key={col} className="pb-3 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {topGames.map(row => (
                <tr key={row.game} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="py-3 font-semibold" style={{ color: row.color }}>{row.game}</td>
                  <td className="py-3 font-mono text-slate-900">{formatNumber(row.wins)}</td>
                  <td className="py-3 font-mono text-slate-400">{formatNumber(row.losses)}</td>
                  <td className="py-3 font-mono font-semibold" style={{ color: row.color }}>
                    {formatRatio(row.wins, row.losses)}
                  </td>
                  <td className="py-3 font-mono text-slate-400">{abbreviate(row.kills)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Reusable section header ─── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}