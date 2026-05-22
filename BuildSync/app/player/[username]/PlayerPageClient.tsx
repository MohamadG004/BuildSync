'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PlayerHeader } from '@/components/player/PlayerHeader';
import { OverallStats } from '@/components/player/OverallStats';
import { BedWarsStatsComponent } from '@/components/player/BedWarsStats';
import { SkyWarsStatsComponent } from '@/components/player/SkyWarsStats';
import { DuelsStatsComponent } from '@/components/player/DuelsStats';
import { BuildBattleStatsComponent } from '@/components/player/BuildBattleStats';
import { MurderMysteryStatsComponent } from '@/components/player/MurderMysteryStats';
import { TNTGamesStatsComponent } from '@/components/player/TNTGamesStats';
import {
  PlayerHeaderSkeleton,
  StatGridSkeleton,
  TabSkeleton,
} from '@/components/ui/LoadingSkeleton';
import { cn } from '@/lib/utils';

type Tab =
  | 'overview'
  | 'bedwars'
  | 'skywars'
  | 'duels'
  | 'buildbattle'
  | 'murdermystery'
  | 'tntgames';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',      label: 'Overview' },
  { id: 'bedwars',       label: 'BedWars' },
  { id: 'skywars',       label: 'SkyWars' },
  { id: 'duels',         label: 'Duels' },
  { id: 'buildbattle',   label: 'Build Battle' },
  { id: 'murdermystery', label: 'Murder Mystery' },
  { id: 'tntgames',      label: 'TNT Games' },
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
  guild: {
    name: string | null;
    tag: string | null;
    rank: string | null;
  } | null;
  stats: {
    Bedwars?: object;
    SkyWars?: object;
    Duels?: object;
    BuildBattle?: object;
    MurderMystery?: object;
    TNTGames?: object;
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
      const res  = await fetch(`/api/player/${encodeURIComponent(username)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch player');
      setPlayer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPlayer(); }, [username]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
        <PlayerHeaderSkeleton />
        <TabSkeleton />
        <StatGridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-10 shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Player not found</h2>
          <p className="mb-7 text-sm text-slate-400">{error}</p>
          <button
            onClick={fetchPlayer}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-dim)] active:scale-95"
          >
            <RefreshCw size={13} />
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <PlayerHeader player={player} />

      {/* Tab bar — horizontally scrollable on mobile */}
      <div className="flex justify-center gap-1.5 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1 scrollbar-hide">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
        >
          {activeTab === 'overview' && (
            <OverallStats
              stats={player.stats as any}
              level={player.level.level}
              karma={player.karma}
              achievementPoints={player.achievementPoints}
            />
          )}
          {activeTab === 'bedwars' && (
            player.stats.Bedwars
              ? <BedWarsStatsComponent stats={player.stats.Bedwars as any} />
              : <EmptyState game="BedWars" />
          )}
          {activeTab === 'skywars' && (
            player.stats.SkyWars
              ? <SkyWarsStatsComponent stats={player.stats.SkyWars as any} />
              : <EmptyState game="SkyWars" />
          )}
          {activeTab === 'duels' && (
            player.stats.Duels
              ? <DuelsStatsComponent stats={player.stats.Duels as any} />
              : <EmptyState game="Duels" />
          )}
          {activeTab === 'buildbattle' && (
            player.stats.BuildBattle
              ? <BuildBattleStatsComponent stats={player.stats.BuildBattle as any} />
              : <EmptyState game="Build Battle" />
          )}
          {activeTab === 'murdermystery' && (
            player.stats.MurderMystery
              ? <MurderMysteryStatsComponent stats={player.stats.MurderMystery as any} />
              : <EmptyState game="Murder Mystery" />
          )}
          {activeTab === 'tntgames' && (
            player.stats.TNTGames
              ? <TNTGamesStatsComponent stats={player.stats.TNTGames as any} />
              : <EmptyState game="TNT Games" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ game }: { game: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white p-16 text-center"
    >
      <div className="mb-4 text-4xl">📭</div>
      <h3 className="mb-2 text-base font-semibold text-slate-900">No {game} data</h3>
      <p className="text-sm text-slate-400">
        This player hasn't played {game} yet, or has no recorded stats.
      </p>
    </motion.div>
  );
}