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
    toast(`${player.username} removed`, { icon: '🗑️' });
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
            <div key={i} className="h-28 rounded-2xl border border-[var(--border)] skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-end justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Favorites
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {favorites.length === 0
              ? 'No saved players yet'
              : `${favorites.length} player${favorites.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={13} />
            Clear all
          </button>
        )}
      </motion.div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-8 py-20 text-center shadow-sm"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
            <Star size={24} className="text-slate-300" />
          </div>
          <h2 className="mb-2 text-base font-semibold text-slate-900">No favorites yet</h2>
          <p className="mb-7 max-w-xs text-sm text-slate-400">
            Search for a player and save them to quickly access their stats later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-dim)] active:scale-95"
          >
            <Search size={13} />
            Search players
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {favorites.map((player, i) => (
              <FavoriteCard key={player.uuid} player={player} index={i} onRemove={handleRemove} />
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04 }}
      className="group rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[var(--border)] flex-shrink-0">
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
            <span className="mb-1 inline-block rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--accent)]">
              [{player.rank}]
            </span>
          )}
          <p className="truncate text-sm font-semibold text-slate-900">{player.username}</p>
          <p className="text-xs text-slate-400">Level {player.level}</p>
        </div>

        {/* Remove button */}
        <button
          onClick={e => { e.preventDefault(); onRemove(player); }}
          className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock size={10} />
          Saved {formatDate(new Date(player.addedAt).getTime())}
        </span>
        <Link
          href={`/player/${player.username}`}
          className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition hover:underline"
        >
          View
          <ExternalLink size={10} />
        </Link>
      </div>
    </motion.div>
  );
}