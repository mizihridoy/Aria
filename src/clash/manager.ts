import {
  ClashRepository,
  type ClashStrategyRow,
  type HeroEquipmentRow,
  type TownHallGuideRow,
} from '../database/repositories/clash.js';
import {
  ClashApiClient,
  type CocPlayer,
  type CocClan,
  type CocCurrentWar,
} from './coc-api-client.js';
import { createChildLogger } from '../services/logger.js';

const log = createChildLogger('clash-manager');

export class ClashManager {
  /**
   * Look up dynamic meta strategies for a given Town Hall
   */
  public static async getStrategies(townHall?: number, archetype?: string): Promise<ClashStrategyRow[]> {
    return ClashRepository.getStrategies(townHall, archetype);
  }

  /**
   * Look up a specific strategy by name
   */
  public static async getStrategyByName(name: string, townHall?: number): Promise<ClashStrategyRow | null> {
    return ClashRepository.getStrategyByName(name, townHall);
  }

  /**
   * Look up dynamic Hero Equipment synergies and combos
   */
  public static async getHeroEquipment(hero?: string, name?: string): Promise<HeroEquipmentRow[]> {
    return ClashRepository.getHeroEquipment(hero, name);
  }

  /**
   * Look up dynamic Town Hall guide
   */
  public static async getTownHallGuide(townHall: number): Promise<TownHallGuideRow | null> {
    return ClashRepository.getTownHallGuide(townHall);
  }

  // --- LIVE SUPERCELL OFFICIAL API METHODS ---

  /**
   * Fetches real-time player data from Supercell API
   */
  public static async getLivePlayer(playerTag: string) {
    return ClashApiClient.getPlayer(playerTag);
  }

  /**
   * Fetches real-time clan data from Supercell API
   */
  public static async getLiveClan(clanTag: string) {
    return ClashApiClient.getClan(clanTag);
  }

  /**
   * Fetches real-time clan war state from Supercell API
   */
  public static async getLiveCurrentWar(clanTag: string) {
    return ClashApiClient.getCurrentWar(clanTag);
  }

  /**
   * Fetches clan war log history from Supercell API
   */
  public static async getLiveWarLog(clanTag: string) {
    return ClashApiClient.getWarLog(clanTag);
  }
}
