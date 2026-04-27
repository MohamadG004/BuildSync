'use client';

// ─────────────────────────────────────────────
// useFavorites Hook
// Manages saved/tracked players in localStorage
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { FavoritePlayer } from '@/types/hypixel';

const STORAGE_KEY = 'hypixel-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, loaded]);

  /** Add a player to favorites */
  const addFavorite = useCallback((player: FavoritePlayer) => {
    setFavorites(prev => {
      if (prev.some(f => f.uuid === player.uuid)) return prev;
      return [{ ...player, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  /** Remove a player from favorites */
  const removeFavorite = useCallback((uuid: string) => {
    setFavorites(prev => prev.filter(f => f.uuid !== uuid));
  }, []);

  /** Check if a player is favorited */
  const isFavorite = useCallback(
    (uuid: string) => favorites.some(f => f.uuid === uuid),
    [favorites]
  );

  /** Toggle favorite status */
  const toggleFavorite = useCallback(
    (player: FavoritePlayer) => {
      if (isFavorite(player.uuid)) {
        removeFavorite(player.uuid);
        return false;
      } else {
        addFavorite(player);
        return true;
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  /** Clear all favorites */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    loaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
