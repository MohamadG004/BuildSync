'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart, Calendar, Clock, Trophy, Zap, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatNumber, formatDate, timeAgo, getAvatarUrl, abbreviate } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import type { FavoritePlayer } from '@/types/hypixel';
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
}

interface PlayerHeaderProps {
  player: PlayerData;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(player.uuid);

  function handleFavorite() {
    const fav: FavoritePlayer = {
      uuid: player.uuid,
      username: player.username,
      rank: player.rank,
      rankColor: player.rankColor,
      level: player.level.level,
      addedAt: new Date().toISOString(),
    };
    const added = toggleFavorite(fav);
    toast(added ? `${player.username} added to favorites!` : `${player.username} removed from favorites`, {
      icon: added ? '⭐' : '💔',
    });
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  }

  const isNonRank = player.rank === 'NON';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      {/* Background glow based on rank */}
      <div
        className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: player.rankColor }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="relative h-24 w-24 overflow-hidden rounded-2xl sm:h-32 sm:w-32"
            style={{
              border: `2px solid ${player.rankColor}50`,
              boxShadow: `0 0 20px ${player.rankColor}20`,
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
          {/* Online indicator */}
          <div
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[var(--void)] ${
              player.online ? 'bg-green-400' : 'bg-gray-600'
            }`}
            title={player.online ? 'Online' : 'Offline'}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Rank badge */}
          {!isNonRank && (
            <span
              className="mb-2 inline-block rounded px-2 py-0.5 font-mono text-xs font-bold"
              style={{
                color: player.rankColor,
                background: `${player.rankColor}15`,
                border: `1px solid ${player.rankColor}30`,
              }}
            >
              [{player.rank}]
            </span>
          )}

          {/* Username */}
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            {player.displayname}
          </h1>

          {/* Level bar */}
          <div className="mt-3 flex items-center gap-3">
            <span
              className="font-mono text-sm font-bold"
              style={{ color: 'var(--cyan)' }}
            >
              ⭐ Level {player.level.level}
            </span>
            <div className="flex-1 max-w-[160px]">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-3)]">
                <motion.div
                  className="progress-bar h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${player.level.progress * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {abbreviate(player.level.xp)} XP
            </span>
          </div>

          {/* Date info */}
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              Joined {formatDate(player.firstLogin)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Last seen {timeAgo(player.lastLogin)}
            </span>
          </div>

          {/* Key stats row */}
          <div className="mt-5 flex flex-wrap gap-6">
            <MiniStat
              label="Karma"
              value={abbreviate(player.karma)}
              color="var(--cyan)"
            />
            <MiniStat
              label="Achievement Pts"
              value={formatNumber(player.achievementPoints)}
              color="var(--purple)"
            />
            <MiniStat
              label="Daily Rewards"
              value={formatNumber(player.totalDailyRewards)}
              color="var(--amber)"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 sm:flex-col sm:items-end">
          <button
            onClick={handleFavorite}
            className={favorited ? 'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors bg-[var(--accent-soft)] border-[rgba(245,158,11,0.4)] text-[var(--amber)] hover:bg-[rgba(245,158,11,0.15)]' : 'flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[var(--surface-2)]'}
          >
            {favorited ? <Star size={14} fill="currentColor" /> : <Heart size={14} />}
            {favorited ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[var(--surface-2)]"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}
