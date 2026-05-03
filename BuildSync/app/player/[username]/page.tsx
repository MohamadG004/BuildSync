import type { Metadata } from 'next';
import { PlayerPageClient } from './PlayerPageClient';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: username,
    description: `View ${username}'s Hypixel stats — BedWars, SkyWars, Duels, and more.`,
  };
}

export default async function PlayerPage({ params }: Props) {
  const { username } = await params;
  return <PlayerPageClient username={username} />;
}
