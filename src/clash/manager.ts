import {
  ClashRepository,
  type ClashStrategyRow,
  type HeroEquipmentRow,
  type TownHallGuideRow,
} from '../database/repositories/clash.js';
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
}
