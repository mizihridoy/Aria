import { env } from '../config/env.js';
import { createChildLogger } from '../services/logger.js';

const log = createChildLogger('coc-api-client');

export interface CocHeroEquipment {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
  rarity?: string;
}

export interface CocHero {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
  equipment?: CocHeroEquipment[];
}

export interface CocPlayer {
  tag: string;
  name: string;
  townHallLevel: number;
  townHallWeaponLevel?: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel?: number;
  builderBaseTrophies?: number;
  clan?: {
    tag: string;
    name: string;
    clanLevel: number;
    badgeUrls: { small: string; large: string; medium: string };
  };
  league?: {
    id: number;
    name: string;
    iconUrls: { small: string; tiny: string; medium: string };
  };
  heroes: CocHero[];
  troops: Array<{ name: string; level: number; maxLevel: number; village: string }>;
  spells: Array<{ name: string; level: number; maxLevel: number; village: string }>;
}

export interface CocClanMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  league?: { name: string; iconUrls: { small: string } };
  trophies: number;
  clanRank: number;
  donations: number;
  donationsReceived: number;
}

export interface CocClan {
  tag: string;
  name: string;
  type: string;
  description: string;
  location?: { id: number; name: string; isCountry: boolean };
  badgeUrls: { small: string; large: string; medium: string };
  clanLevel: number;
  clanPoints: number;
  clanCapitalPoints?: number;
  capitalHallLevel?: number;
  requiredTrophies: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  warTies?: number;
  warLosses?: number;
  isWarLogPublic: boolean;
  members: number;
  memberList: CocClanMember[];
}

export interface CocWarClan {
  tag: string;
  name: string;
  badgeUrls: { small: string; large: string; medium: string };
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
}

export interface CocCurrentWar {
  state: 'inWar' | 'preparation' | 'warEnded' | 'notInWar';
  teamSize?: number;
  attacksPerMember?: number;
  battleModifier?: string;
  startTime?: string;
  endTime?: string;
  preparationStartTime?: string;
  clan?: CocWarClan;
  opponent?: CocWarClan;
}

export class ClashApiClient {
  private static baseUrl = env.COC_API_BASE_URL.replace(/\/+$/, '');

  /**
   * Normalizes Clash of Clans tags (adds # if missing and converts to uppercase)
   */
  public static normalizeTag(rawTag: string): string {
    let clean = rawTag.trim().toUpperCase();
    if (!clean.startsWith('#')) {
      clean = `#${clean}`;
    }
    return clean;
  }

  /**
   * Encodes a tag for safe URL transmission (# -> %23)
   */
  private static encodeTag(tag: string): string {
    return encodeURIComponent(this.normalizeTag(tag));
  }

  /**
   * Makes an authenticated request to the Supercell API
   */
  private static async request<T>(endpoint: string): Promise<{ data: T | null; error: string | null; status: number }> {
    const token = env.COC_API_TOKEN;
    if (!token) {
      return {
        data: null,
        error: 'Supercell API Token is not configured. Set `COC_API_TOKEN` in your `.env` file (get one free at https://developer.clashofclans.com/).',
        status: 401,
      };
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        return { data: json as T, error: null, status: response.status };
      }

      if (response.status === 404) {
        return { data: null, error: 'Resource not found. Please double-check the player or clan tag.', status: 404 };
      }

      if (response.status === 403) {
        return {
          data: null,
          error: 'Supercell API Access Denied (403). Your API Key IP address whitelist may need updating on https://developer.clashofclans.com/.',
          status: 403,
        };
      }

      if (response.status === 503) {
        return { data: null, error: 'Clash of Clans servers are currently undergoing maintenance. Please try again shortly.', status: 503 };
      }

      const text = await response.text();
      log.warn({ status: response.status, body: text, url }, 'Supercell API error response');
      return { data: null, error: `Supercell API error (${response.status}): ${response.statusText}`, status: response.status };
    } catch (err: any) {
      log.error({ err, url }, 'Failed to fetch from Supercell API');
      return { data: null, error: `Network error connecting to Supercell API: ${err.message}`, status: 500 };
    }
  }

  /**
   * Fetches detailed player profile
   */
  public static async getPlayer(playerTag: string) {
    const encoded = this.encodeTag(playerTag);
    return this.request<CocPlayer>(`/players/${encoded}`);
  }

  /**
   * Fetches clan details & roster
   */
  public static async getClan(clanTag: string) {
    const encoded = this.encodeTag(clanTag);
    return this.request<CocClan>(`/clans/${encoded}`);
  }

  /**
   * Fetches ongoing clan war status
   */
  public static async getCurrentWar(clanTag: string) {
    const encoded = this.encodeTag(clanTag);
    return this.request<CocCurrentWar>(`/clans/${encoded}/currentwar`);
  }

  /**
   * Fetches clan war log history
   */
  public static async getWarLog(clanTag: string) {
    const encoded = this.encodeTag(clanTag);
    return this.request<{ items: any[] }>(`/clans/${encoded}/warlog`);
  }
}
