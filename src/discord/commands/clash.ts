import {
  SlashCommandBuilder,
  MessageFlags,
  type ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../types/command.js';
import { ClashManager } from '../../clash/manager.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-clash');

function safeDiscordLength(text: string, maxLen: number = 1950): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 4) + '...';
}

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('clash')
    .setDescription('Clash of Clans toolkit: meta strategies, hero equipment & Town Hall guides')
    // 1. STRATEGY LOOKUP
    .addSubcommand(sub =>
      sub
        .setName('strategy')
        .setDescription('Look up meta attack strategies for any Town Hall level (TH12-TH18)')
        .addIntegerOption(opt =>
          opt
            .setName('th')
            .setDescription('Town Hall level (12 to 18)')
            .setRequired(false)
            .setMinValue(12)
            .setMaxValue(18)
        )
        .addStringOption(opt =>
          opt
            .setName('archetype')
            .setDescription('Strategy playstyle filter')
            .setRequired(false)
            .addChoices(
              { name: 'Smash', value: 'Smash' },
              { name: 'Air', value: 'Air' },
              { name: 'Lalo', value: 'Lalo' },
              { name: 'Spam', value: 'Spam' },
              { name: 'QC', value: 'QC' }
            )
        )
        .addStringOption(opt =>
          opt
            .setName('name')
            .setDescription('Specific strategy name (e.g. Hydra, Fireball, Root Rider, Air Obliteration)')
            .setRequired(false)
        )
    )
    // 2. HERO EQUIPMENT LOOKUP
    .addSubcommand(sub =>
      sub
        .setName('equipment')
        .setDescription('Inspect Hero Equipment synergies, ratings, and meta pairings')
        .addStringOption(opt =>
          opt
            .setName('hero')
            .setDescription('Hero to look up')
            .setRequired(false)
            .addChoices(
              { name: 'Barbarian King', value: 'Barbarian King' },
              { name: 'Archer Queen', value: 'Archer Queen' },
              { name: 'Grand Warden', value: 'Grand Warden' },
              { name: 'Royal Champion', value: 'Royal Champion' },
              { name: 'Minion Prince', value: 'Minion Prince' },
              { name: 'Dragon Duke', value: 'Dragon Duke' }
            )
        )
        .addStringOption(opt =>
          opt
            .setName('name')
            .setDescription('Specific equipment name (e.g. Giant Gauntlet, Fireball, Magic Mirror, Electro Boots)')
            .setRequired(false)
        )
    )
    // 3. HERO PROFILE
    .addSubcommand(sub =>
      sub
        .setName('hero')
        .setDescription('Comprehensive profile & best equipment builds for any of the 6 Heroes')
        .addStringOption(opt =>
          opt
            .setName('name')
            .setDescription('Select hero to inspect')
            .setRequired(true)
            .addChoices(
              { name: 'Barbarian King', value: 'Barbarian King' },
              { name: 'Archer Queen', value: 'Archer Queen' },
              { name: 'Grand Warden', value: 'Grand Warden' },
              { name: 'Royal Champion', value: 'Royal Champion' },
              { name: 'Minion Prince', value: 'Minion Prince' },
              { name: 'Dragon Duke', value: 'Dragon Duke' }
            )
        )
    )
    // 4. TOWNHALL GUIDE
    .addSubcommand(sub =>
      sub
        .setName('townhall')
        .setDescription('View Town Hall upgrade priority order and key defense counters')
        .addIntegerOption(opt =>
          opt
            .setName('th')
            .setDescription('Town Hall level (12 to 18)')
            .setRequired(true)
            .setMinValue(12)
            .setMaxValue(18)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      // 1. STRATEGY LOOKUP
      if (subcommand === 'strategy') {
        const th = interaction.options.getInteger('th') || undefined;
        const archetype = interaction.options.getString('archetype') || undefined;
        const name = interaction.options.getString('name') || undefined;

        if (name) {
          const exact = await ClashManager.getStrategyByName(name, th);
          if (!exact) {
            await interaction.editReply({
              content: `⚠️ No attack strategy found matching **"${name}"**${th ? ` for TH${th}` : ''}.`,
            });
            return;
          }

          const army = exact.army_composition as any;
          const gear = exact.hero_equipment as any;

          let reply = `## ⚔️ [TH${exact.town_hall}] ${exact.name} (\`${exact.archetype}\`)\n\n`;
          if (army?.troops) {
            reply += `### 🛡️ Army Composition\n• **Troops**: ${army.troops.join(', ')}\n• **Spells**: ${army.spells.join(', ')}\n• **Siege**: \`${army.siege}\`\n• **CC**: ${army.cc.join(', ')}\n\n`;
          }
          if (gear) {
            reply += `### 👑 Recommended Hero Equipment (4 Active Limit)\n`;
            if (gear.BK) reply += `• **King**: \`${gear.BK}\`\n`;
            if (gear.AQ) reply += `• **Queen**: \`${gear.AQ}\`\n`;
            if (gear.GW) reply += `• **Warden**: \`${gear.GW}\`\n`;
            if (gear.RC) reply += `• **Champion**: \`${gear.RC}\`\n`;
            if (gear.Prince) reply += `• **Minion Prince**: \`${gear.Prince}\`\n`;
            if (gear.Duke) reply += `• **Dragon Duke**: \`${gear.Duke}\`\n`;
            reply += '\n';
          }
          reply += `### 📋 Step-by-Step Execution\n${exact.execution_guide}\n\n`;
          if (exact.strengths?.length) {
            reply += `**💪 Strengths**: ${exact.strengths.join(' • ')}\n`;
          }

          await interaction.editReply({ content: safeDiscordLength(reply) });
          return;
        }

        const strategies = await ClashManager.getStrategies(th, archetype);
        if (strategies.length === 0) {
          await interaction.editReply({
            content: `ℹ️ No meta strategies found${th ? ` for TH${th}` : ''}${archetype ? ` (${archetype})` : ''}.`,
          });
          return;
        }

        let reply = `## ⚔️ Meta Attack Strategies${th ? ` (Town Hall ${th})` : ''}${archetype ? ` [${archetype}]` : ''}:\n\n`;
        for (const s of strategies.slice(0, 5)) {
          reply += `### 🏆 [TH${s.town_hall}] ${s.name} (\`${s.archetype}\`)\n`;
          reply += `> ${s.execution_guide.slice(0, 120)}...\n`;
          reply += `*Type \`/clash strategy name:"${s.name}"\` for full army composition & execution plan.*\n\n`;
        }

        await interaction.editReply({ content: safeDiscordLength(reply) });
        return;
      }

      // 2. HERO EQUIPMENT LOOKUP
      if (subcommand === 'equipment') {
        const hero = interaction.options.getString('hero') || undefined;
        const name = interaction.options.getString('name') || undefined;

        if (!hero && !name) {
          const overview = `
## 👑 Clash of Clans Hero Equipment (2026 Meta)

Select a Hero to inspect full equipment stats, ratings, and top synergies:

* **👑 Barbarian King** (7) — \`Giant Gauntlet\`, \`Spiky Ball\`, \`Snake Bracelet\`, \`Stick Horse\`, \`Barbarian Puppet\`, \`Rage Vial\`, \`Earthquake Boots\`
* **🏹 Archer Queen** (8) — \`Magic Mirror\`, \`Frozen Arrow\`, \`Action Figure\`, \`Monolith Arrow\`, \`Archer Puppet\`, \`Invisibility Vial\`, \`Giant Arrow\`, \`Healer Puppet\`
* **👑 Minion Prince** (6) — \`Meteor Staff\`, \`Dark Crown\`, \`Dark Orb\`, \`Henchmen Puppet\`, \`Metal Pants\`, \`Noble Iron\`
* **✨ Grand Warden** (7) — \`Fireball\`, \`Heroic Torch\`, \`Lavaloon Puppet\`, \`Eternal Tome\`, \`Healing Tome\`, \`Rage Gem\`, \`Life Gem\`
* **🛡️ Royal Champion** (7) — \`Electro Boots\`, \`Rocket Spear\`, \`Frost Flake\`, \`Haste Vial\`, \`Seeking Shield\`, \`Hog Puppet\`, \`Royal Gem\`
* **🐉 Dragon Duke** (6) — \`Fire Heart\`, \`Flame Blower\`, \`Revenge Deck\`, \`Stun Blaster\`, \`Electro Fangs\`, \`Rocket Backpack\`

💡 *Use \`/clash equipment hero:"Dragon Duke"\` or \`/clash equipment name:"Giant Gauntlet"\` to view full synergy details!*
`;
          await interaction.editReply({ content: overview.trim() });
          return;
        }

        const equipmentList = await ClashManager.getHeroEquipment(hero, name);
        if (equipmentList.length === 0) {
          await interaction.editReply({
            content: `ℹ️ No hero equipment found${hero ? ` for **${hero}**` : ''}${name ? ` matching "${name}"` : ''}.`,
          });
          return;
        }

        let reply = `## 👑 Hero Equipment & Synergy Combos${hero ? ` (${hero})` : ''}:\n\n`;
        for (const e of equipmentList.slice(0, 6)) {
          const synergies = (e.synergy_pairs as any[]) || [];
          reply += `### 🔹 **${e.name}** (\`${e.rarity}\` • ${e.hero})\n`;
          reply += `_${e.description}_\n`;
          if (synergies.length > 0) {
            reply += `**🔥 Top Synergies**:\n`;
            for (const syn of synergies.slice(0, 2)) {
              reply += `  • **+ ${syn.pair}** [\`${syn.rating}\`]: ${syn.notes}\n`;
            }
          }
          if (e.recommended_armies?.length) {
            reply += `**🎯 Best in**: ${e.recommended_armies.join(', ')}\n`;
          }
          reply += '\n';
        }

        await interaction.editReply({ content: safeDiscordLength(reply) });
        return;
      }

      // 3. HERO PROFILE
      if (subcommand === 'hero') {
        const heroName = interaction.options.getString('name', true);
        const heroEquips = await ClashManager.getHeroEquipment(heroName);

        let builds = '';
        if (heroName === 'Barbarian King') {
          builds = `• **Best Smash Build**: \`Giant Gauntlet\` + \`Spiky Ball\` (Invincibility + 8-target ranged bounce)\n• **Anti-Hero / Heavy Core**: \`Giant Gauntlet\` + \`Snake Bracelet\`\n• **Wall Hop Dive**: \`Stick Horse\` + \`Spiky Ball\``;
        } else if (heroName === 'Archer Queen') {
          builds = `• **Universal #1 Meta**: \`Magic Mirror\` + \`Frozen Arrow\` (Triple Queen clones with multi-target slow)\n• **Anti-Monolith / Heavy Base**: \`Action Figure\` + \`Frozen Arrow\`\n• **Core Line Snipe**: \`Monolith Arrow\` + \`Magic Mirror\``;
        } else if (heroName === 'Grand Warden') {
          builds = `• **Undisputed Standard**: \`Eternal Tome\` + \`Healing Tome\` (Invulnerability + full army regen)\n• **Nuke Opener (Warden Walk)**: \`Fireball\` + \`Rage Gem\` (1-shots Monolith compartments)\n• **Speed Smash**: \`Eternal Tome\` + \`Heroic Torch\` (Invulnerable wall jumps)`;
        } else if (heroName === 'Royal Champion') {
          builds = `• **2026 Apex Meta**: \`Electro Boots\` + \`Rocket Spear\` (Long range snipe + chain lightning stuns)\n• **Blitz Defense Clear**: \`Electro Boots\` + \`Haste Vial\`\n• **Classic Sniping**: \`Rocket Spear\` + \`Seeking Shield\``;
        } else if (heroName === 'Minion Prince') {
          builds = `• **Dark Obliteration Meta**: \`Meteor Staff\` + \`Dark Crown\` (Multiplies dark troops + dark orbital blast)\n• **Swarm Pressure**: \`Henchmen Puppet\` + \`Dark Crown\`\n• **Armored Frontline**: \`Metal Pants\` + \`Noble Iron\``;
        } else if (heroName === 'Dragon Duke') {
          builds = `• **Dragon Apex Surge**: \`Fire Heart\` + \`Flame Blower\` (High heat burning aura + cone incinerator)\n• **Fleet Berserk**: \`Fire Heart\` + \`Revenge Deck\` (Enrages air fleet on hit)\n• **Disruption Dive**: \`Stun Blaster\` + \`Electro Fangs\``;
        }

        const equipNames = heroEquips.map(e => `\`${e.name}\` (${e.rarity})`).join(', ');

        const reply = `
## 👑 Hero Profile: **${heroName}**

### 🎯 Meta Equipment Builds
${builds}

### 🎒 All Available Equipment (${heroEquips.length})
${equipNames}

💡 *Use \`/clash equipment hero:"${heroName}"\` to see full synergy details for every item!*
`;
        await interaction.editReply({ content: safeDiscordLength(reply.trim()) });
        return;
      }

      // 4. TOWNHALL GUIDE
      if (subcommand === 'townhall') {
        const th = interaction.options.getInteger('th', true);
        const guide = await ClashManager.getTownHallGuide(th);

        if (!guide) {
          await interaction.editReply({
            content: `ℹ️ No specific guide stored for Town Hall ${th}.`,
          });
          return;
        }

        let reply = `## 🏰 Town Hall ${guide.town_hall} Comprehensive Guide\n`;
        reply += `**🎨 Theme**: ${guide.theme}\n\n`;
        reply += `### ⚡ Offense Upgrade Priority\n`;
        guide.offense_upgrade_priority.forEach((item, i) => {
          reply += `${i + 1}. **${item}**\n`;
        });
        reply += `\n### 🛡️ Key Defenses & Priorities\n`;
        guide.defense_upgrade_priority.forEach((item, i) => {
          reply += `${i + 1}. **${item}**\n`;
        });
        reply += `\n### 👑 Hero Milestones\n`;
        guide.hero_priorities.forEach(h => {
          reply += `• ${h}\n`;
        });
        reply += `\n**💡 Strategic Notes**:\n> ${guide.notes}`;

        await interaction.editReply({ content: safeDiscordLength(reply) });
        return;
      }
    } catch (error) {
      log.error({ error, subcommand }, 'Error executing /clash command');
      await interaction.editReply({
        content: 'An error occurred while executing the Clash of Clans command.',
      });
    }
  },
};
