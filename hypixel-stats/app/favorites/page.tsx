import type { Metadata } from 'next';
import { FavoritesClient } from './FavoritesClient';

export const metadata: Metadata = {
  title: 'Favorites',
  description: 'Your saved Hypixel players.',
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
