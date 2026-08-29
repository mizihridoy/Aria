import { tool } from 'ai';
import { z } from 'zod';
import { ClashManager } from '../../clash/manager.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('tool-clash');

/**
 * Unified Clash of Clans Meta Tool
 * Database-powered strategy, equipment, and Town Hall guide lookups.
 */
export const clashLookupTool = tool({
  description: 'Look up Clash of Clans (TH12-TH18) meta attack strategies, hero equipment synergies (across BK, AQ, GW, RC, Minion Prince, Dragon Duke), or Town Hall upgrade priority guides.',
  parameters: z.object({
    type: z.enum(['strategy', 'equipment', 'townhall']).describe('The type of clash information to query'),
    town_hall: z.number().int().min(12).max(18).optional().describe('Town Hall level (12 to 18)'),
    hero: z.enum(['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Minion Prince', 'Dragon Duke']).optional().describe('Hero name filter for equipment'),
    name: z.string().optional().describe('Specific strategy or equipment name (e.g. "Hydra", "Root Rider", "Giant Gauntlet", "Fireball", "Magic Mirror", "Electro Boots", "Fire Heart", "Meteor Staff")'),
  }),
  execute: async ({ type, town_hall, hero, name }) => {
    try {
      log.info({ type, town_hall, hero, name }, 'Executing clash lookup');

      // 1. STRATEGY LOOKUP
      if (type === 'strategy') {
        if (name) {
          const exact = await ClashManager.getStrategyByName(name, town_hall);
          if (exact) {
            return {
              type: 'strategy',
              found: 1,
              results: [{
                th: exact.town_hall,
                name: exact.name,
                archetype: exact.archetype,
                army: exact.army_composition,
                active_heroes_4: exact.hero_equipment,
                execution: exact.execution_guide,
              }],
            };
          }
        }

        const list = await ClashManager.getStrategies(town_hall);
        return {
          type: 'strategy',
          found: list.length,
          results: list.slice(0, 3).map(s => ({
            th: s.town_hall,
            name: s.name,
            archetype: s.archetype,
            active_heroes_4: s.hero_equipment,
            execution: s.execution_guide.slice(0, 160) + '...',
          })),
        };
      }

      // 2. HERO EQUIPMENT LOOKUP
      if (type === 'equipment') {
        const list = await ClashManager.getHeroEquipment(hero, name);
        return {
          type: 'equipment',
          found: list.length,
          results: list.slice(0, 6).map(e => ({
            hero: e.hero,
            name: e.name,
            rarity: e.rarity,
            top_synergies: (e.synergy_pairs as any[] || []).slice(0, 2),
            best_in: e.recommended_armies,
          })),
        };
      }

      // 3. TOWN HALL GUIDE LOOKUP
      if (type === 'townhall' && town_hall) {
        const guide = await ClashManager.getTownHallGuide(town_hall);
        if (!guide) {
          return { type: 'townhall', found: 0, message: `No guide found for TH${town_hall}` };
        }
        return {
          type: 'townhall',
          found: 1,
          results: [{
            th: guide.town_hall,
            offense_priority: guide.offense_upgrade_priority,
            defense_priority: guide.defense_upgrade_priority,
            hero_priorities: guide.hero_priorities,
            notes: guide.notes,
          }],
        };
      }

      return { found: 0, message: 'Please specify valid search parameters.' };
    } catch (error) {
      log.error({ error, type, town_hall, hero, name }, 'Error in clashLookupTool');
      return { error: 'Database query failed.' };
    }
  },
});
