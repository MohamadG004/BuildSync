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

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'overview', label: 'Overview', color: 'var(--cyan)' },
  { id: 'bedwars', label: 'BedWars', color: '#f472b6' },
  { id: 'skywars', label: 'SkyWars', color: 'var(--purple)' },
  { id: 'duels', label: 'Duels', color: 'var(--amber)' },
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

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
        <PlayerHeaderSkeleton />
        <TabSkeleton />
        <StatGridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10"
        >
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-2">Player Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchPlayer}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-black"
            style={{ background: 'var(--cyan)' }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!player) return null;

  const activeTabColor = TABS.find(t => t.id === activeTab)?.color ?? 'var(--cyan)';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
      {/* Player header */}
      <PlayerHeader player={player} />

      {/* Tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex-shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              )}
              style={
                isActive
                  ? {
                      background: `${tab.color}15`,
                      border: `1px solid ${tab.color}40`,
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }
              }
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: `${tab.color}08` }}
                />
              )}
              <span className="relative" style={isActive ? { color: tab.color } : {}}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
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

function EmptyState({ game }: { game: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card flex flex-col items-center justify-center rounded-2xl p-16 text-center"
    >
      <div
        className="mb-4 text-5xl"
        role="img"
        aria-label="ghost"
      >
        👻
      </div>
      <h3 className="font-display text-lg font-bold text-white mb-2">No {game} Data</h3>
      <p className="text-sm text-gray-500">
        This player hasn't played {game} yet, or has no recorded stats.
      </p>
    </motion.div>
  );
}
