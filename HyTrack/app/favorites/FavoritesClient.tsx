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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Favorites
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {favorites.length === 0
              ? 'No saved players yet'
              : `${favorites.length} player${favorites.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        )}
      </motion.div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white p-16 text-center"
        >
          <Star size={36} className="mb-4 text-slate-300" />
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            No favorites yet
          </h2>
          <p className="mb-6 max-w-xs text-sm text-slate-500">
            Search for a player and save them to quickly access their stats later.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            <Search size={14} />
            Search players
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-[var(--border)]">
          <Image
            src={getAvatarUrl(player.uuid, 64)}
            alt={player.username}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {!isNonRank && (
            <span className="mb-1 inline-block rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)]">
              [{player.rank}]
            </span>
          )}

          <p className="truncate text-sm font-semibold text-slate-900">
            {player.username}
          </p>

          <p className="text-xs text-slate-500">Level {player.level}</p>
        </div>

        {/* Remove */}
        <button
          onClick={e => {
            e.preventDefault();
            onRemove(player);
          }}
          className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <Clock size={10} />
          Saved {formatDate(new Date(player.addedAt).getTime())}
        </span>

        <Link
          href={`/player/${player.username}`}
          className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
        >
          View
          <ExternalLink size={10} />
        </Link>
      </div>
    </motion.div>
  );
}