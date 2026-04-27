'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, ExternalLink, Search, Clock } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { getAvatarUrl, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { FavoritePlayer } from '@/types/hypixel';

export function FavoritesClient() {
  const { favorites, loaded, removeFavorite, clearFavorites } = useFavorites();

  function handleRemove(player: FavoritePlayer) {
    removeFavorite(player.uuid);
    toast(`${player.username} removed from favorites`, { icon: '🗑️' });
  }

  function handleClearAll() {
    if (!confirm('Remove all favorite players?')) return;
    clearFavorites();
    toast('All favorites cleared.', { icon: '🗑️' });
  }

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            <span style={{ color: 'var(--amber)' }}>★</span> Favorites
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {favorites.length === 0
              ? 'No saved players yet'
              : `${favorites.length} player${favorites.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.05)] px-3 py-2 text-sm text-red-400 transition-all hover:bg-[rgba(239,68,68,0.1)]"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </motion.div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card flex flex-col items-center justify-center rounded-2xl p-20 text-center"
        >
          <Star size={40} className="mb-4 text-gray-700" />
          <h2 className="font-display text-lg font-bold text-white mb-2">No favorites yet</h2>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Search for a player and click the Save button to add them to your favorites.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-black"
            style={{ background: 'var(--cyan)' }}
          >
            <Search size={14} />
            Search Players
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {favorites.map((player, i) => (
              <FavoriteCard
                key={player.uuid}
                player={player}
                index={i}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function FavoriteCard({
  player,
  index,
  onRemove,
}: {
  player: FavoritePlayer;
  index: number;
  onRemove: (p: FavoritePlayer) => void;
}) {
  const isNonRank = player.rank === 'NON' || !player.rank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card group relative overflow-hidden rounded-2xl p-4"
    >
      {/* Glow */}
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-20 pointer-events-none"
        style={{ background: player.rankColor ?? 'var(--cyan)' }}
      />

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="relative h-14 w-14 overflow-hidden rounded-xl flex-shrink-0"
          style={{
            border: `1px solid ${(player.rankColor ?? 'var(--cyan)')}40`,
          }}
        >
          <Image
            src={getAvatarUrl(player.uuid, 64)}
            alt={player.username}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {!isNonRank && (
            <span
              className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold mb-1"
              style={{
                color: player.rankColor,
                background: `${player.rankColor}15`,
                border: `1px solid ${player.rankColor}30`,
              }}
            >
              [{player.rank}]
            </span>
          )}
          <p className="font-display text-sm font-bold text-white truncate">
            {player.username}
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--cyan)' }}>
            ⭐ {player.level}
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={e => { e.preventDefault(); onRemove(player); }}
          className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-gray-600 transition-all hover:bg-[rgba(239,68,68,0.1)] hover:text-red-400"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-3">
        <span className="flex items-center gap-1 text-[10px] text-gray-600">
          <Clock size={9} />
          Saved {formatDate(new Date(player.addedAt).getTime())}
        </span>
        <Link
          href={`/player/${player.username}`}
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-white"
          style={{ color: 'var(--cyan)' }}
        >
          View Stats
          <ExternalLink size={10} />
        </Link>
      </div>
    </motion.div>
  );
}
