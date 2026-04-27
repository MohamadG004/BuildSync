// app/api/uuid/[username]/route.ts
// Proxies Mojang UUID lookup to keep things server-side

import { NextRequest, NextResponse } from 'next/server';
import { fetchUUID } from '@/lib/hypixel';
import { isValidUsername } from '@/lib/utils';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Validate username format
  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: 'Invalid username. Must be 1-16 characters (letters, numbers, underscores).' },
      { status: 400 }
    );
  }

  try {
    const profile = await fetchUUID(username);
    return NextResponse.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch UUID';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
