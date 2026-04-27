// ─────────────────────────────────────────────
// Hypixel API Client
// ─────────────────────────────────────────────

import type { HypixelAPIResponse, MojangProfile } from '@/types/hypixel';

const HYPIXEL_BASE = 'https://api.hypixel.net';
const MOJANG_BASE = 'https://api.mojang.com';

/**
 * Fetch a player's UUID from Mojang by username.
 * This is needed before querying the Hypixel API.
 */
export async function fetchUUID(username: string): Promise<MojangProfile> {
  const res = await fetch(`${MOJANG_BASE}/users/profiles/minecraft/${username}`, {
    next: { revalidate: 300 }, // cache 5 minutes
  });

  if (res.status === 404) {
    throw new Error(`Player "${username}" not found. Check the username and try again.`);
  }

  if (!res.ok) {
    throw new Error(`Mojang API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch a player's full stats from Hypixel API.
 * Uses the API key from server-side environment variable.
 */
export async function fetchHypixelPlayer(uuid: string): Promise<HypixelAPIResponse> {
  const apiKey = process.env.HYPIXEL_API_KEY;

  if (!apiKey) {
    throw new Error('Hypixel API key is not configured. Please set HYPIXEL_API_KEY in your .env.local file.');
  }

  const res = await fetch(
    `${HYPIXEL_BASE}/player?uuid=${uuid}&key=${apiKey}`,
    {
      next: { revalidate: 60 }, // cache 60 seconds
    }
  );

  // Rate limit handling
  if (res.status === 429) {
    const retryAfter = res.headers.get('RateLimit-Reset') ?? '60';
    throw new Error(`Rate limited by Hypixel. Try again in ${retryAfter} seconds.`);
  }

  if (res.status === 403) {
    throw new Error('Invalid Hypixel API key. Please check your configuration.');
  }

  if (!res.ok) {
    throw new Error(`Hypixel API error: ${res.status} ${res.statusText}`);
  }

  const data: HypixelAPIResponse = await res.json();

  if (!data.success) {
    throw new Error(data.cause ?? 'Unknown Hypixel API error');
  }

  if (!data.player) {
    throw new Error('Player has never joined Hypixel before.');
  }

  return data;
}

/**
 * Check if Hypixel API is reachable (health check)
 */
export async function checkHypixelStatus(): Promise<boolean> {
  try {
    const apiKey = process.env.HYPIXEL_API_KEY;
    if (!apiKey) return false;

    const res = await fetch(`${HYPIXEL_BASE}/key?key=${apiKey}`, {
      next: { revalidate: 30 },
    });
    return res.ok;
  } catch {
    return false;
  }
}
