import { supabase } from '../client.js';
import type { Database } from '../../types/database.types.js';
import { DatabaseError } from '../../utils/errors.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('clash-repo');

export type ClashStrategyRow = Database['public']['Tables']['clash_strategies']['Row'];
export type HeroEquipmentRow = Database['public']['Tables']['hero_equipment']['Row'];
export type TownHallGuideRow = Database['public']['Tables']['town_hall_guides']['Row'];

/**
 * Normalizes user input hero name aliases
 */
function normalizeHeroAlias(hero?: string): string | undefined {
  if (!hero) return undefined;
  const h = hero.toLowerCase().trim();
  if (h.includes('king') || h === 'bk') return 'Barbarian King';
  if (h.includes('queen') || h === 'aq') return 'Archer Queen';
  if (h.includes('warden') || h === 'gw') return 'Grand Warden';
  if (h.includes('champion') || h === 'rc') return 'Royal Champion';
  if (h.includes('prince') || h === 'minion') return 'Minion Prince';
  if (h.includes('duke') || h === 'dragon') return 'Dragon Duke';
  return hero.trim();
}

/**
 * Normalizes user input equipment name aliases
 */
function normalizeEquipmentAlias(name?: string): string | undefined {
  if (!name) return undefined;
  let n = name.trim();
  if (n.toLowerCase().includes('bagpack')) {
    n = n.replace(/bagpack/gi, 'Backpack');
  }
  if (n.toLowerCase().includes('sheild')) {
    n = n.replace(/sheild/gi, 'Shield');
  }
  return n;
}

export class ClashRepository {
  /**
   * Retrieves strategies for a Town Hall level, optionally filtered by archetype.
   */
  public static async getStrategies(townHall?: number, archetype?: string): Promise<ClashStrategyRow[]> {
    try {
      let query = supabase
        .from('clash_strategies')
        .select('*')
        .eq('is_active', true)
        .order('town_hall', { ascending: false });

      if (townHall != null) {
        query = query.eq('town_hall', townHall);
      }

      if (archetype != null && archetype.trim().length > 0) {
        query = query.ilike('archetype', `%${archetype.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        log.error({ error, townHall, archetype }, 'Failed to fetch clash strategies');
        throw new DatabaseError(`Failed to fetch clash strategies: ${error.message}`, error);
      }

      return data || [];
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError('Unexpected error fetching clash strategies', err);
    }
  }

  /**
   * Retrieves a strategy by name (fuzzy match)
   */
  public static async getStrategyByName(name: string, townHall?: number): Promise<ClashStrategyRow | null> {
    try {
      let query = supabase
        .from('clash_strategies')
        .select('*')
        .ilike('name', `%${name.trim()}%`)
        .eq('is_active', true);

      if (townHall != null) {
        query = query.eq('town_hall', townHall);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (error) {
        log.error({ error, name }, 'Failed to fetch clash strategy by name');
        throw new DatabaseError(`Failed to fetch clash strategy: ${error.message}`, error);
      }

      return data || null;
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError('Unexpected error fetching strategy by name', err);
    }
  }

  /**
   * Retrieves Hero Equipment, optionally filtered by Hero and/or Equipment Name.
   */
  public static async getHeroEquipment(hero?: string, name?: string): Promise<HeroEquipmentRow[]> {
    try {
      const cleanHero = normalizeHeroAlias(hero);
      const cleanName = normalizeEquipmentAlias(name);

      let query = supabase
        .from('hero_equipment')
        .select('*')
        .order('hero', { ascending: true });

      if (cleanHero != null && cleanHero.length > 0) {
        query = query.ilike('hero', `%${cleanHero}%`);
      }

      if (cleanName != null && cleanName.length > 0) {
        query = query.ilike('name', `%${cleanName}%`);
      }

      const { data, error } = await query;

      if (error) {
        log.error({ error, hero, name }, 'Failed to fetch hero equipment');
        throw new DatabaseError(`Failed to fetch hero equipment: ${error.message}`, error);
      }

      return data || [];
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError('Unexpected error fetching hero equipment', err);
    }
  }

  /**
   * Retrieves a Town Hall guide for a specific Town Hall level.
   */
  public static async getTownHallGuide(townHall: number): Promise<TownHallGuideRow | null> {
    try {
      const { data, error } = await supabase
        .from('town_hall_guides')
        .select('*')
        .eq('town_hall', townHall)
        .maybeSingle();

      if (error) {
        log.error({ error, townHall }, 'Failed to fetch town hall guide');
        throw new DatabaseError(`Failed to fetch town hall guide: ${error.message}`, error);
      }

      return data || null;
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError('Unexpected error fetching town hall guide', err);
    }
  }
}
