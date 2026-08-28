import { tool } from 'ai';
import { z } from 'zod';
import { ClashManager } from '../../clash/manager.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('tool-clash');

/**
 * Unified Clash of Clans Meta & Live API Tool
 * Consolidates strategy, equipment, Town Hall guides, and Supercell live player/clan/war lookups.
 */
export const clashLookupTool = tool({
  description: 'Look up Clash of Clans (TH12-TH18) meta strategies, hero equipment synergies, Town Hall guides, OR fetch live player/clan/war statistics from the official Supercell API using a player or clan tag.',
  parameters: z.object({
    type: z.enum(['strategy', 'equipment', 'townhall', 'live_player', 'live_clan', 'live_war']).describe('The type of clash information to query'),
    town_hall: z.number().int().min(12).max(18).optional().describe('Town Hall level (12 to 18)'),
    hero: z.enum(['Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Minion Prince', 'Dragon Duke']).optional().describe('Hero name filter for equipment'),
    name: z.string().optional().describe('Specific strategy or equipment name'),
    tag: z.string().optional().describe('Player or Clan Tag for live Supercell API query (e.g. "#9V8LLQP", "#2PP0JYRYP")'),
  }),
  execute: async ({ type, town_hall, hero, name, tag }) => {
    try {
      log.info({ type, town_hall, hero, name, tag }, 'Executing unified clash lookup');

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

      // 4. LIVE SUPERCELL PLAYER PROFILE
      if (type === 'live_player' && tag) {
        const { data: player, error } = await ClashManager.getLivePlayer(tag);
        if (error || !player) {
          return { type: 'live_player', found: 0, error: error || 'Player not found.' };
        }
        return {
          type: 'live_player',
          found: 1,
          player: {
            name: player.name,
            tag: player.tag,
            th: player.townHallLevel,
            trophies: player.trophies,
            warStars: player.warStars,
            clan: player.clan ? `${player.clan.name} (${player.clan.tag})` : 'None',
            heroes: player.heroes.filter(h => h.village === 'home').map(h => ({
              hero: h.name,
              level: `${h.level}/${h.maxLevel}`,
              gear: h.equipment?.map(e => `${e.name} (Lv.${e.level})`),
            })),
          },
        };
      }

      // 5. LIVE SUPERCELL CLAN
      if (type === 'live_clan' && tag) {
        const { data: clan, error } = await ClashManager.getLiveClan(tag);
        if (error || !clan) {
          return { type: 'live_clan', found: 0, error: error || 'Clan not found.' };
        }
        return {
          type: 'live_clan',
          found: 1,
          clan: {
            name: clan.name,
            tag: clan.tag,
            level: clan.clanLevel,
            members: `${clan.members}/50`,
            points: clan.clanPoints,
            warWins: clan.warWins,
            warLosses: clan.warLosses,
            streak: clan.warWinStreak,
            capitalHall: clan.capitalHallLevel,
          },
        };
      }

      // 6. LIVE SUPERCELL CLAN WAR
      if (type === 'live_war' && tag) {
        const { data: war, error } = await ClashManager.getLiveCurrentWar(tag);
        if (error || !war) {
          return { type: 'live_war', found: 0, error: error || 'War data not found.' };
        }
        return {
          type: 'live_war',
          state: war.state,
          clan: { name: war.clan?.name, stars: war.clan?.stars, destruction: war.clan?.destructionPercentage, attacks: war.clan?.attacks },
          opponent: { name: war.opponent?.name, stars: war.opponent?.stars, destruction: war.opponent?.destructionPercentage, attacks: war.opponent?.attacks },
        };
      }

      return { found: 0, message: 'Please specify valid search parameters.' };
    } catch (error) {
      log.error({ error, type, town_hall, hero, name, tag }, 'Error in clashLookupTool');
      return { error: 'Clash lookup failed.' };
    }
  },
});
