// ─────────────────────────────────────────────
// Hypixel API Type Definitions
// ─────────────────────────────────────────────

export interface MojangProfile {
  id: string;   // UUID without dashes
  name: string; // Minecraft username
}

export interface HypixelPlayer {
  _id: string;
  uuid: string;
  displayname: string;
  playername: string;
  firstLogin: number;
  lastLogin: number;
  lastLogout: number;
  networkExp: number;
  karma: number;
  achievementPoints: number;
  totalDailyRewards: number;
  totalRewards: number;
  newPackageRank?: string;
  rankPlusColor?: string;
  prefix?: string;
  monthlyPackageRank?: string;
  rank?: string;
  stats?: HypixelStats;
  achievements?: Record<string, number>;
  quests?: Record<string, unknown>;
  socialMedia?: {
    links?: Record<string, string>;
  };
}

export interface HypixelStats {
  Bedwars?: BedWarsStats;
  SkyWars?: SkyWarsStats;
  Duels?: DuelsStats;
  BuildBattle?: BuildBattleStats;
  MurderMystery?: MurderMysteryStats;
  TNTGames?: TNTGamesStats;
}

export interface BedWarsStats {
  Experience?: number;
  coins?: number;
  wins_bedwars?: number;
  losses_bedwars?: number;
  kills_bedwars?: number;
  deaths_bedwars?: number;
  final_kills_bedwars?: number;
  final_deaths_bedwars?: number;
  beds_broken_bedwars?: number;
  beds_lost_bedwars?: number;
  games_played_bedwars?: number;
  winstreak?: number;
  eight_one_wins_bedwars?: number;
  eight_two_wins_bedwars?: number;
  four_three_wins_bedwars?: number;
  four_four_wins_bedwars?: number;
  two_four_wins_bedwars?: number;
  eight_one_kills_bedwars?: number;
  eight_two_kills_bedwars?: number;
  four_three_kills_bedwars?: number;
  four_four_kills_bedwars?: number;
  resources_collected_bedwars?: number;
  iron_resources_collected_bedwars?: number;
  gold_resources_collected_bedwars?: number;
  diamond_resources_collected_bedwars?: number;
  emerald_resources_collected_bedwars?: number;
}

export interface SkyWarsStats {
  wins?: number;
  losses?: number;
  kills?: number;
  deaths?: number;
  games_played_skywars?: number;
  winstreak?: number;
  coins?: number;
  // NOTE: The Hypixel API does NOT return a `level` field for SkyWars.
  // Use `skywars_experience` and calculate the level with getSkyWarsLevel().
  skywars_experience?: number;
  heads?: number;
  assists?: number;
  souls_gathered?: number;
  soul_well?: number;
  blocks_placed?: number;
  blocks_broken?: number;
  arrows_shot?: number;
  arrows_hit?: number;
  egg_thrown?: number;
  enderpearls_thrown?: number;
  mob_kills?: number;
}

export interface DuelsStats {
  wins?: number;
  losses?: number;
  kills?: number;
  deaths?: number;
  games_played_duels?: number;
  winstreak?: number;
  coins?: number;
  bow_shots?: number;
  bow_hits?: number;
  melee_swings?: number;
  melee_hits?: number;
}

export interface BuildBattleStats {
  wins?: number;
  games_played?: number;
  score?: number;
  coins?: number;
  correct_guesses?: number;
  total_votes?: number;
  // Wins by mode
  wins_solo_normal?: number;
  wins_solo_pro?: number;
  wins_teams_normal?: number;
  wins_guess_the_build?: number;
  // Score by mode
  score_solo_normal?: number;
  score_solo_pro?: number;
  score_teams_normal?: number;
  score_guess_the_build?: number;
  // Supervoter
  supervoter?: boolean;
}

export interface MurderMysteryStats {
  wins?: number;
  games?: number;
  kills?: number;
  deaths?: number;
  coins?: number;
  murders?: number;
  murderer_wins?: number;
  detective_wins?: number;
  was_detective?: number;
  was_murderer?: number;
  coins_pickedup?: number;
  bow_kills?: number;
  knife_kills?: number;
  thrown_knife_kills?: number;
  arrow_kills?: number;
  can_die_to_detective_bow?: boolean;
}

export interface TNTGamesStats {
  wins_tntrun?: number;
  deaths_tntrun?: number;
  record_tntrun?: number;
  wins_pvprun?: number;
  deaths_pvprun?: number;
  kills_pvprun?: number;
  wins_bowspleef?: number;
  deaths_bowspleef?: number;
  wins_capture?: number;
  kills_capture?: number;
  deaths_capture?: number;
  kills_tntag?: number;
  wins_tntag?: number;
  coins?: number;
}

export interface HypixelAPIResponse {
  success: boolean;
  player: HypixelPlayer | null;
  cause?: string;
}

// ─────────────────────────────────────────────
// Processed / UI-friendly types
// ─────────────────────────────────────────────

export interface PlayerLevel {
  level: number;
  prestige: number;
  xp: number;
  xpForNext: number;
  progress: number; // 0-1
}

export interface ProcessedPlayer {
  uuid: string;
  username: string;
  displayname: string;
  rank: string | null;
  rankColor: string;
  level: PlayerLevel;
  karma: number;
  achievementPoints: number;
  firstLogin: Date;
  lastLogin: Date;
  stats: HypixelStats;
  online: boolean;
  socialMedia?: Record<string, string>;
}