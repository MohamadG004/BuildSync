// ─────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx';
import type { HypixelPlayer, PlayerLevel } from '@/types/hypixel';

/** Combine class names (clsx wrapper) */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format large numbers with commas */
export function formatNumber(n: number | undefined | null): string {
  if (n == null || isNaN(n)) return '0';
  return n.toLocaleString();
}

/** Format a ratio to 2 decimal places */
export function formatRatio(a: number | undefined, b: number | undefined): string {
  const num = a ?? 0;
  const den = b ?? 0;
  if (den === 0) return num > 0 ? '∞' : '0.00';
  return (num / den).toFixed(2);
}

/** Format percentage */
export function formatPercent(value: number | undefined, total: number | undefined): string {
  const v = value ?? 0;
  const t = total ?? 0;
  if (t === 0) return '0%';
  return ((v / t) * 100).toFixed(1) + '%';
}

/** Calculate Hypixel network level from XP */
export function getNetworkLevel(xp: number): PlayerLevel {
  const BASE = 10000;
  const GROWTH = 2500;
  const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
  const REVERSE_CONST = REVERSE_PQ_PREFIX ** 2;
  const GROWTH_DIVIDES_2 = 2 / GROWTH;

  const safeXp = Math.max(0, xp);
  const level = Math.floor(
    1 +
      REVERSE_PQ_PREFIX +
      Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * safeXp)
  );

  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const xpInLevel = safeXp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return {
    level,
    prestige: Math.floor(level / 100),
    xp: safeXp,
    xpForNext: xpNeeded,
    progress: Math.min(1, xpInLevel / xpNeeded),
  };
}

function getXpForLevel(level: number): number {
  if (level === 0) return 0;
  const BASE = 10000;
  const GROWTH = 2500;
  const reverse = level - 2;
  return Math.floor(BASE * reverse + (GROWTH * reverse * (reverse - 1)) / 2);
}

/** Get BedWars level (star) from XP — CORRECT */
export function getBedwarsLevel(xp: number): number {
  const EASY_LEVELS = [500, 1000, 2000, 3500]; // levels 0→4
  const EASY_TOTAL = 7000;
  const XP_PER_LEVEL = 5000;
  const XP_PER_PRESTIGE = 487000; // 100 levels total

  let remaining = Math.max(0, xp);
  let level = 0;

  // Handle prestiges (each 100 levels)
  const prestiges = Math.floor(remaining / XP_PER_PRESTIGE);
  level += prestiges * 100;
  remaining -= prestiges * XP_PER_PRESTIGE;

  // Handle first 4 levels
  for (let i = 0; i < EASY_LEVELS.length; i++) {
    if (remaining < EASY_LEVELS[i]) return level + i;
    remaining -= EASY_LEVELS[i];
  }

  level += 4;

  // Handle remaining levels (constant XP)
  level += Math.floor(remaining / XP_PER_LEVEL);

  return level;
}

/** Optional: BedWars progress (useful for UI bars) */
export function getBedwarsProgress(xp: number) {
  const EASY_LEVELS = [500, 1000, 2000, 3500];
  const EASY_TOTAL = 7000;
  const XP_PER_LEVEL = 5000;
  const XP_PER_PRESTIGE = 487000;

  let remaining = Math.max(0, xp);

  // Remove prestiges
  remaining = remaining % XP_PER_PRESTIGE;

  // Early levels
  for (let i = 0; i < EASY_LEVELS.length; i++) {
    if (remaining < EASY_LEVELS[i]) {
      return {
        level: i,
        progress: remaining,
        needed: EASY_LEVELS[i],
      };
    }
    remaining -= EASY_LEVELS[i];
  }

  // After level 4
  return {
    level: 4 + Math.floor(remaining / XP_PER_LEVEL),
    progress: remaining % XP_PER_LEVEL,
    needed: XP_PER_LEVEL,
  };
}

/**
 * Calculate SkyWars level (star) from skywars_experience.
 * The Hypixel API does NOT return a level field — only skywars_experience.
 *
 * Cumulative XP to reach each level (verified against Posey's table):
 *   L1:0  L2:20  L3:70  L4:150  L5:250  L6:500
 *   L7:1000  L8:2000  L9:3500  L10:6000  L11:10000  L12:15000
 * Level 12+: flat 10,000 XP per level.
 */
export function getSkyWarsLevel(xp: number): number {
  const xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
  if (xp >= 15000) {
    return Math.floor((xp - 15000) / 10000 + 12);
  }
  for (let i = 0; i < xps.length; i++) {
    if (xp < xps[i]) {
      return i;
    }
  }
  return 12;
}

/**
 * Calculate exact (decimal) SkyWars level for progress bars.
 * e.g. 4.5 means halfway through level 4 → 5.
 */
export function getSkyWarsLevelExact(xp: number): number {
  const xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
  if (xp >= 15000) {
    return (xp - 15000) / 10000 + 12;
  }
  for (let i = 0; i < xps.length; i++) {
    if (xp < xps[i]) {
      return i + (xp - xps[i - 1]) / (xps[i] - xps[i - 1]);
    }
  }
  return 12;
}

/** Format date to readable string */
export function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format relative time */
export function timeAgo(timestamp: number | undefined): string {
  if (!timestamp) return 'Never';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Get player rank display info */
export function getPlayerRank(player: HypixelPlayer): { label: string; color: string; gradient: string } {
  if (player.rank === 'YOUTUBER') {
    return { label: 'YOUTUBE', color: '#FF0000', gradient: 'from-red-500 to-red-700' };
  }
  if (player.rank && player.rank !== 'NORMAL') {
    return { label: player.rank, color: '#FF5555', gradient: 'from-red-400 to-rose-600' };
  }
  if (player.monthlyPackageRank === 'SUPERSTAR') {
    return { label: 'MVP++', color: '#FFAA00', gradient: 'from-amber-400 to-orange-500' };
  }

  const rank = player.newPackageRank;
  switch (rank) {
    case 'MVP_PLUS':
      return { label: 'MVP+', color: '#00AAAA', gradient: 'from-cyan-400 to-teal-500' };
    case 'MVP':
      return { label: 'MVP', color: '#00AAAA', gradient: 'from-cyan-400 to-teal-500' };
    case 'VIP_PLUS':
      return { label: 'VIP+', color: '#55FF55', gradient: 'from-green-400 to-emerald-500' };
    case 'VIP':
      return { label: 'VIP', color: '#55FF55', gradient: 'from-green-400 to-emerald-500' };
    default:
      return { label: 'NON', color: '#AAAAAA', gradient: 'from-gray-400 to-gray-500' };
  }
}

/** Validate Minecraft username */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{1,16}$/.test(username);
}

/** Get Minecraft avatar URL */
export function getAvatarUrl(uuid: string, size = 128): string {
  return `https://crafatar.com/avatars/${uuid}?size=${size}&overlay=true`;
}

/** Get 3D render URL */
export function getRenderUrl(uuid: string): string {
  return `https://crafatar.com/renders/body/${uuid}?overlay=true&scale=3`;
}

/** Abbreviate large numbers (e.g. 1.2M) */
export function abbreviate(n: number | undefined): string {
  if (n == null) return '0';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

/** Pick a color based on value range (for stat indicators) */
export function getStatColor(value: number, thresholds: [number, number, number]): string {
  if (value >= thresholds[2]) return '#00ffd0';
  if (value >= thresholds[1]) return '#a855f7';
  if (value >= thresholds[0]) return '#f59e0b';
  return '#ef4444';
}