'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, ThumbsUp, Coins, Gamepad2, Target } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatNumber, abbreviate, formatRatio } from '@/lib/utils';
import type { BuildBattleStats } from '@/types/hypixel';

const BUILD_BATTLE_TITLES = [
  { min: 500_000, label: 'Ascended' },
  { min: 400_000, label: 'Divine' },
  { min: 300_000, label: 'Celestial' },
  { min: 200_000, label: 'Grandmaster' },
  { min: 100_000, label: 'Legend' },
  { min: 50_000,  label: 'Master' },
  { min: 30_000,  label: 'Expert' },
  { min: 20_000,  label: 'Artisan' },
  { min: 15_000,  label: 'Professional' },
  { min: 10_000,  label: 'Talented' },
  { min: 7_500,   label: 'Skilled' },
  { min: 5_000,   label: 'Trained' },
  { min: 3_500,   label: 'Seasoned' },
  { min: 2_000,   label: 'Experienced' },
  { min: 1_000,   label: 'Apprentice' },
  { min: 500,     label: 'Prospect' },
  { min: 250,     label: 'Amateur' },
  { min: 100,     label: 'Untrained' },
  { min: 0,       label: 'Rookie' },
] as const;

function getBuildBattleTitle(score: number): string {
  return BUILD_BATTLE_TITLES.find(t => score >= t.min)?.label ?? 'Rookie';
}

export function BuildBattleStatsComponent({ stats }: { stats: BuildBattleStats }) {
  const wins           = stats.wins ?? 0;
  const gamesPlayed    = stats.games_played ?? 0;
  const score          = stats.score ?? 0;
  const correctGuesses = stats.correct_guesses ?? 0;
  const totalVotes     = stats.total_votes ?? 0;
  const coins          = stats.coins ?? 0;

  const wlr   = parseFloat(formatRatio(wins, gamesPlayed - wins));
  const title = getBuildBattleTitle(score);

  const cards = [
    { label: 'Wins',             value: abbreviate(wins),                            subValue: `${formatNumber(gamesPlayed)} games played`,          icon: Trophy,   iconColor: 'var(--amber)',   highlight: wins > 100 },
    { label: 'Win Rate',         value: gamesPlayed > 0 ? `${((wins/gamesPlayed)*100).toFixed(1)}%` : '0%', subValue: `${formatNumber(wins)} wins`,   icon: Star,     iconColor: 'var(--accent)', highlight: wins/gamesPlayed > 0.3 },
    { label: 'Score',            value: abbreviate(score),                           subValue: formatNumber(score),                                  icon: Gamepad2, iconColor: 'var(--purple)' },
    { label: 'Correct Guesses',  value: abbreviate(correctGuesses),                  subValue: 'Guess the Build wins',                               icon: Target,   iconColor: '#16a34a' },
    { label: 'Total Votes Cast', value: formatNumber(totalVotes),                    subValue: 'Votes given to other builds',                        icon: ThumbsUp, iconColor: '#f472b6' },
    { label: 'Coins',            value: abbreviate(coins),                           subValue: formatNumber(coins) + ' total',                       icon: Coins,    iconColor: 'var(--amber)' },
  ];

  const modeScores = [
    { label: 'Solo Normal',     color: 'var(--accent)',  value: stats.score_solo_normal ?? 0 },
    { label: 'Solo Pro',        color: 'var(--purple)',  value: stats.score_solo_pro ?? 0 },
    { label: 'Teams Normal',    color: '#16a34a',        value: stats.score_teams_normal ?? 0 },
    { label: 'Guess the Build', color: 'var(--amber)',   value: stats.score_guess_the_build ?? 0 },
  ].filter(m => m.value > 0);

  return (
    <div className="space-y-5">
      {/* Score badge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: 'rgba(180,83,9,0.2)', background: 'rgba(180,83,9,0.07)' }}>
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--amber)' }}>
            🏗 {title} · {formatNumber(score)} Score · Build Battle
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

      {/* Score by mode */}
      {modeScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-6"
        >
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Score by Mode</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {modeScores.map(m => (
              <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
                <p className="font-mono text-lg font-bold" style={{ color: m.color }}>{abbreviate(m.value)}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wins by mode */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="rounded-2xl border border-[var(--border)] bg-white p-6"
      >
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Wins by Mode</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Solo Normal',     value: stats.wins_solo_normal ?? 0,     color: 'var(--accent)' },
            { label: 'Solo Pro',        value: stats.wins_solo_pro ?? 0,        color: 'var(--purple)' },
            { label: 'Teams Normal',    value: stats.wins_teams_normal ?? 0,    color: '#16a34a' },
            { label: 'Guess the Build', value: stats.wins_guess_the_build ?? 0, color: 'var(--amber)' },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center">
              <p className="font-mono text-lg font-bold" style={{ color: m.color }}>{formatNumber(m.value)}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}