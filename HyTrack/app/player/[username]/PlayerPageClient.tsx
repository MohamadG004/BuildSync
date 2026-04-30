'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PlayerHeader } from '@/components/player/PlayerHeader';
import { OverallStats } from '@/components/player/OverallStats';
import { BedWarsStatsComponent } from '@/components/player/BedWarsStats';
import { SkyWarsStatsComponent } from '@/components/player/SkyWarsStats';
import { DuelsStatsComponent } from '@/components/player/DuelsStats';
import {
  PlayerHeaderSkeleton,
  StatGridSkeleton,
  TabSkeleton,
} from '@/components/ui/LoadingSkeleton';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'bedwars' | 'skywars' | 'duels';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'bedwars', label: 'BedWars' },
  { id: 'skywars', label: 'SkyWars' },
  { id: 'duels', label: 'Duels' },
];

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
  stats: {
    Bedwars?: object;
    SkyWars?: object;
    Duels?: object;
    [key: string]: unknown;
  };
}

export function PlayerPageClient({ username }: { username: string }) {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  async function fetchPlayer() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/player/${encodeURIComponent(username)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch player');

      setPlayer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayer();
  }, [username]);

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <PlayerHeaderSkeleton />
        <TabSkeleton />
        <StatGridSkeleton count={6} />
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-10 shadow-sm"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={26} className="text-red-500" />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            Player not found
          </h2>

          <p className="mb-6 text-sm text-slate-500">{error}</p>

          <button
            onClick={fetchPlayer}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      {/* Header */}
      <PlayerHeader player={player} />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'bg-white text-slate-600 border border-[var(--border)] hover:text-slate-900'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'overview' && (
            <OverallStats
              stats={player.stats as any}
              level={player.level.level}
              karma={player.karma}
              achievementPoints={player.achievementPoints}
            />
          )}

          {activeTab === 'bedwars' && player.stats.Bedwars ? (
            <BedWarsStatsComponent stats={player.stats.Bedwars as any} />
          ) : activeTab === 'bedwars' ? (
            <EmptyState game="BedWars" />
          ) : null}

          {activeTab === 'skywars' && player.stats.SkyWars ? (
            <SkyWarsStatsComponent stats={player.stats.SkyWars as any} />
          ) : activeTab === 'skywars' ? (
            <EmptyState game="SkyWars" />
          ) : null}

          {activeTab === 'duels' && player.stats.Duels ? (
            <DuelsStatsComponent stats={player.stats.Duels as any} />
          ) : activeTab === 'duels' ? (
            <EmptyState game="Duels" />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ game }: { game: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white p-14 text-center"
    >
      <div className="mb-4 text-4xl">📭</div>

      <h3 className="mb-2 text-lg font-semibold text-slate-900">
        No {game} data
      </h3>

      <p className="text-sm text-slate-500">
        This player hasn’t played {game} yet, or has no recorded stats.
      </p>
    </motion.div>
  );
}