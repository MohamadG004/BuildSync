// app/api/player/[username]/route.ts
// Full player data: UUID + Hypixel stats, combined into one API call

import { NextRequest, NextResponse } from 'next/server';
import { fetchUUID, fetchHypixelGuild, fetchHypixelPlayer } from '@/lib/hypixel';
import { isValidUsername, getPlayerRank, getNetworkLevel } from '@/lib/utils';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: 'Invalid username format.' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Get UUID from Mojang
    const profile = await fetchUUID(username);

    // Step 2: Get Hypixel stats
    const [playerResponse, guildResponse] = await Promise.all([
      fetchHypixelPlayer(profile.id),
      fetchHypixelGuild(profile.id).catch(() => ({ success: true, guild: null })),
    ]);

    const { player } = playerResponse;

    if (!player) {
      return NextResponse.json(
        { error: 'Player has never joined Hypixel.' },
        { status: 404 }
      );
    }

    const guild = guildResponse.guild;
    const guildMember = guild?.members?.find(member => member.uuid === profile.id);

    // Step 3: Enrich data for the frontend
    const rankInfo = getPlayerRank(player);
    const levelInfo = getNetworkLevel(player.networkExp ?? 0);

    const enriched = {
      uuid: profile.id,
      username: profile.name,
      displayname: player.displayname ?? profile.name,
      rank: rankInfo.label,
      rankColor: rankInfo.color,
      rankGradient: rankInfo.gradient,
      level: levelInfo,
      karma: player.karma ?? 0,
      achievementPoints: player.achievementPoints ?? 0,
      firstLogin: player.firstLogin,
      lastLogin: player.lastLogin,
      lastLogout: player.lastLogout,
      totalDailyRewards: player.totalDailyRewards ?? 0,
      totalRewards: player.totalRewards ?? 0,
      socialMedia: player.socialMedia?.links ?? {},
      stats: player.stats ?? {},
      // Online if logged in more recently than logged out
      online: (player.lastLogin ?? 0) > (player.lastLogout ?? 0),
      guild: guild
        ? {
            name: guild.name,
            tag: guild.tag ?? null,
            rank: guildMember?.rank ?? null,
          }
        : null,
    };

    return NextResponse.json(enriched, {
      headers: {
        // Cache player lookups for 5 minutes on the CDN / edge layer
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch player data';
    let status = 500;
    if (message.includes('not found') || message.includes('never joined')) status = 404;
    if (message.includes('Rate limited')) status = 429;
    if (message.includes('API key')) status = 503;

    return NextResponse.json({ error: message }, { status });
  }
}
