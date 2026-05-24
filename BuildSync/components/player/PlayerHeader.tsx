'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatNumber, formatDate, timeAgo, getAvatarUrl, abbreviate } from '@/lib/utils';
import { MiniStat } from '@/components/ui/StatCard';

interface PlayerData {
  uuid: string;
  username: string;
  displayname: string;
  rank: string;
  rankColor: string;
  level: { level: number; progress: number; xp: number };
  karma: number;
  achievementPoints: number;
  firstLogin: number;
  lastLogin: number;
  online: boolean;
  totalDailyRewards: number;
  guild: {
    name: string | null;
    tag: string | null;
    rank: string | null;
  } | null;
}

export function PlayerHeader({ player }: { player: PlayerData }) {
  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  }

  const isNonRank = player.rank === 'NON';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Rank-coloured top accent strip */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-70"
        style={{ background: isNonRank ? 'var(--border-strong)' : player.rankColor }}
      />

      {/* Subtle rank glow */}
      {!isNonRank && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: player.rankColor }}
        />
      )}

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="relative h-24 w-24 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
            style={{
              border: `2px solid ${isNonRank ? 'var(--border-strong)' : player.rankColor + '50'}`,
              boxShadow: isNonRank ? 'none' : `0 0 16px ${player.rankColor}20`,
            }}
          >
            <Image
              src={getAvatarUrl(player.uuid, 256)}
              alt={`${player.username}'s avatar`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          {/* Online indicator — uses bg-[var(--bg)] instead of broken var(--void) */}
          <div
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
              player.online ? 'bg-green-400' : 'bg-slate-300'
            }`}
            title={player.online ? 'Online' : 'Offline'}
          />
        </div>

        {/* Player info */}
        <div className="min-w-0 flex-1">
          {!isNonRank && (
            <span
              className="mb-2 inline-block rounded-md px-2 py-0.5 font-mono text-xs font-bold tracking-wide"
              style={{
                color: player.rankColor,
                background: `${player.rankColor}12`,
                border: `1px solid ${player.rankColor}25`,
              }}
            >
              [{player.rank}]
            </span>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {player.displayname}
          </h1>

          {player.guild?.name && (
            <p className="mt-2 text-sm text-[#00AA00]">
              Guild{' '}
              <span className="font-semibold text-slate-900">
                {player.guild.tag ? `[${player.guild.tag}] ` : ''}
                {player.guild.name}
              </span>

              {player.guild.rank ? (
                <span className="text-slate-400">
                  {' '}· {player.guild.rank}
                </span>
              ) : null}
            </p>
          )}

          {/* Level bar */}
          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[var(--accent)]">
              ⭐ Level {player.level.level}
            </span>
            <div className="h-1.5 max-w-[140px] flex-1 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="progress-bar h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${player.level.progress * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
            <span className="font-mono text-xs text-slate-400">
              {abbreviate(player.level.xp)} XP
            </span>
          </div>

          {/* Dates */}
          <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              Joined {formatDate(player.firstLogin)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              Last seen {timeAgo(player.lastLogin)}
            </span>
          </div>

          {/* Key stats */}
          <div className="mt-5 flex flex-wrap gap-6 border-t border-[var(--border)] pt-4">
            <MiniStat label="Karma"            value={abbreviate(player.karma)}                  color="var(--accent)" />
            <MiniStat label="Achievement Pts"  value={formatNumber(player.achievementPoints)}   color="var(--purple)" />
            <MiniStat label="Daily Rewards"    value={formatNumber(player.totalDailyRewards)}   color="var(--amber)" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 sm:flex-col sm:items-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}