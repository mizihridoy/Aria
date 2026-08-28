import {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../types/command.js';
import { ClashManager } from '../../clash/manager.js';
import { MemoryManager } from '../../memory/manager.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-clash');

/**
 * Truncate response safely to stay within Discord's 2000 character limit
 */
function safeDiscordLength(text: string, maxLen: number = 1950): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 4) + '...';
}

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('clash')
    .setDescription('Clash of Clans toolkit: Live player/clan stats, meta strategies, hero equipment & guides')
    // 1. LIVE PLAYER LOOKUP
    .addSubcommand(sub =>
      sub
        .setName('player')
        .setDescription('Look up live player profile, Town Hall, trophies, hero levels & equipped items')
        .addStringOption(opt =>
          opt
            .setName('tag')
            .setDescription('Player Tag (e.g. #9V8LLQP). Leave blank if you linked your tag with /clash link')
            .setRequired(false)
        )
    )
    // 2. LIVE CLAN LOOKUP
    .addSubcommand(sub =>
      sub
        .setName('clan')
        .setDescription('Look up live clan details, war record, members, and capital stats')
        .addStringOption(opt =>
          opt
            .setName('tag')
            .setDescription('Clan Tag (e.g. #2PP0JYRYP)')
            .setRequired(true)
        )
    )
    // 3. LIVE CLAN WAR
    .addSubcommand(sub =>
      sub
        .setName('war')
        .setDescription('Check live clan war state, scores, stars, and attacks remaining')
        .addStringOption(opt =>
          opt
            .setName('tag')
            .setDescription('Clan Tag (e.g. #2PP0JYRYP)')
            .setRequired(true)
        )
    )
    // 4. LINK PLAYER TAG
    .addSubcommand(sub =>
      sub
        .setName('link')
        .setDescription('Link your Discord account to your Clash of Clans player tag')
        .addStringOption(opt =>
          opt
            .setName('tag')
            .setDescription('Your Player Tag (e.g. #9V8LLQP)')
            .setRequired(true)
        )
    )
    // 5. STRATEGY LOOKUP
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
    // 6. HERO EQUIPMENT LOOKUP
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
            .setDescription('Specific equipment name (e.g. Giant Gauntlet, Fireball, Magic Mirror, Electro Boots, Fire Heart)')
            .setRequired(false)
        )
    )
    // 7. HERO PROFILE
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
    // 8. TOWNHALL GUIDE
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
      // 1. LIVE PLAYER PROFILE LOOKUP
      if (subcommand === 'player') {
        let tag = interaction.options.getString('tag');

        if (!tag) {
          // Check if user has a linked player tag in memory
          const memories = await MemoryManager.retrieveRelevantMemories(
            'linked clash tag player',
            interaction.guildId || 'DM',
            interaction.user.id,
            3
          );
          const linkMemory = memories.userMemories.find(m => m.content.includes('tag: #') || m.content.includes('#'));
          if (linkMemory) {
            const match = linkMemory.content.match(/#([A-Z0-9]+)/i);
            if (match) tag = match[0];
          }
        }

        if (!tag) {
          await interaction.editReply({
            content: '⚠️ Please specify a player tag (e.g. `/clash player tag:#9V8LLQP`) or link your account using `/clash link tag:#TAG`.',
          });
          return;
        }

        const { data: player, error } = await ClashManager.getLivePlayer(tag);
        if (error || !player) {
          await interaction.editReply({ content: `❌ **Failed to fetch player:** ${error || 'Unknown error'}` });
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle(`⚔️ ${player.name} (${player.tag})`)
          .setColor(0xE67E22)
          .setDescription(`**Town Hall ${player.townHallLevel}** ${player.townHallWeaponLevel ? `(Weapon Lv.${player.townHallWeaponLevel})` : ''} • **Exp Level**: ${player.expLevel}`)
          .addFields(
            { name: '🏆 Trophies', value: `${player.trophies.toLocaleString()} *(Best: ${player.bestTrophies.toLocaleString()})*`, inline: true },
            { name: '⭐ War Stars', value: `${player.warStars.toLocaleString()}`, inline: true },
            { name: '🛡️ Clan', value: player.clan ? `${player.clan.name} (\`${player.clan.tag}\`)` : 'No Clan', inline: true },
            { name: '⚔️ Attack Wins', value: `${player.attackWins.toLocaleString()}`, inline: true },
            { name: '🛡️ Defense Wins', value: `${player.defenseWins.toLocaleString()}`, inline: true },
            { name: '🎖️ League', value: player.league?.name || 'Unranked', inline: true }
          );

        if (player.league?.iconUrls?.medium) {
          embed.setThumbnail(player.league.iconUrls.medium);
        }

        // List Heroes with Levels and Equipped Gear
        if (player.heroes && player.heroes.length > 0) {
          const homeHeroes = player.heroes.filter(h => h.village === 'home');
          if (homeHeroes.length > 0) {
            const heroList = homeHeroes.map(h => {
              const equipStr = h.equipment && h.equipment.length > 0
                ? ` [${h.equipment.map(e => `${e.name} Lv.${e.level}`).join(', ')}]`
                : '';
              return `• **${h.name}**: Lv.${h.level}/${h.maxLevel}${equipStr}`;
            }).join('\n');

            embed.addFields({ name: '👑 Heroes & Equipped Gear', value: heroList });
          }
        }

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      // 2. LIVE CLAN LOOKUP
      if (subcommand === 'clan') {
        const tag = interaction.options.getString('tag', true);
        const { data: clan, error } = await ClashManager.getLiveClan(tag);

        if (error || !clan) {
          await interaction.editReply({ content: `❌ **Failed to fetch clan:** ${error || 'Unknown error'}` });
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle(`🛡️ ${clan.name} (${clan.tag})`)
          .setColor(0x3498DB)
          .setDescription(clan.description ? `> ${clan.description.slice(0, 250)}` : 'No description')
          .addFields(
            { name: '🏰 Clan Level', value: `Level ${clan.clanLevel}`, inline: true },
            { name: '👥 Members', value: `${clan.members}/50`, inline: true },
            { name: '🏆 Clan Points', value: `${clan.clanPoints.toLocaleString()}`, inline: true },
            { name: '⚔️ War Record', value: `🏆 ${clan.warWins}W / 💀 ${clan.warLosses ?? 0}L (Streak: ${clan.warWinStreak})`, inline: true },
            { name: '🏛️ Capital Hall', value: `Lv.${clan.capitalHallLevel ?? 'N/A'}`, inline: true },
            { name: '🎯 Required Trophies', value: `${clan.requiredTrophies.toLocaleString()}`, inline: true }
          );

        if (clan.badgeUrls?.medium) {
          embed.setThumbnail(clan.badgeUrls.medium);
        }

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      // 3. LIVE CLAN WAR
      if (subcommand === 'war') {
        const tag = interaction.options.getString('tag', true);
        const { data: war, error } = await ClashManager.getLiveCurrentWar(tag);

        if (error || !war) {
          await interaction.editReply({ content: `❌ **Failed to fetch war status:** ${error || 'Unknown error'}` });
          return;
        }

        if (war.state === 'notInWar') {
          await interaction.editReply({ content: `ℹ️ Clan \`${tag}\` is currently not in a clan war.` });
          return;
        }

        const stateDisplay = war.state === 'inWar'
          ? '🟢 **Battle Day In Progress**'
          : war.state === 'preparation'
            ? '🟡 **Preparation Day**'
            : '🏁 **War Ended**';

        const embed = new EmbedBuilder()
          .setTitle(`⚔️ Clan War: ${war.clan?.name || 'Clan'} vs ${war.opponent?.name || 'Opponent'}`)
          .setColor(war.state === 'inWar' ? 0x2ECC71 : 0xF39C12)
          .setDescription(stateDisplay)
          .addFields(
            {
              name: `🛡️ ${war.clan?.name || 'Your Clan'}`,
              value: `⭐ **Stars:** ${war.clan?.stars ?? 0}\n💥 **Destruction:** ${(war.clan?.destructionPercentage ?? 0).toFixed(2)}%\n⚔️ **Attacks Used:** ${war.clan?.attacks ?? 0}/${(war.teamSize ?? 1) * (war.attacksPerMember ?? 2)}`,
              inline: true,
            },
            {
              name: `⚔️ ${war.opponent?.name || 'Opponent'}`,
              value: `⭐ **Stars:** ${war.opponent?.stars ?? 0}\n💥 **Destruction:** ${(war.opponent?.destructionPercentage ?? 0).toFixed(2)}%\n⚔️ **Attacks Used:** ${war.opponent?.attacks ?? 0}/${(war.teamSize ?? 1) * (war.attacksPerMember ?? 2)}`,
              inline: true,
            },
            {
              name: '👥 War Format',
              value: `${war.teamSize} vs ${war.teamSize} (${war.attacksPerMember} attack(s) each)`,
              inline: false,
            }
          );

        if (war.endTime) {
          const epoch = Math.floor(new Date(war.endTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:$6Z')).getTime() / 1000);
          if (!isNaN(epoch)) {
            embed.addFields({ name: '⏳ End Time', value: `<t:${epoch}:R> (<t:${epoch}:f>)` });
          }
        }

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      // 4. LINK PLAYER TAG
      if (subcommand === 'link') {
        const rawTag = interaction.options.getString('tag', true);
        const { data: player, error } = await ClashManager.getLivePlayer(rawTag);

        if (error || !player) {
          await interaction.editReply({
            content: `⚠️ Could not verify player tag \`${rawTag}\`: ${error || 'Player not found'}. Please make sure the tag is valid.`,
          });
          return;
        }

        await MemoryManager.remember({
          guildId: interaction.guildId || 'DM',
          userId: interaction.user.id,
          content: `Linked Clash of Clans player: ${player.name} (${player.tag}), Town Hall ${player.townHallLevel}`,
          category: 'identity',
          metadata: { playerTag: player.tag, playerName: player.name },
        });

        await interaction.editReply({
          content: `✅ Successfully linked your Discord account to **${player.name}** (\`${player.tag}\`, TH${player.townHallLevel})! You can now run \`/clash player\` anytime without typing your tag.`,
        });
        return;
      }

      // 5. STRATEGY LOOKUP
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

      // 6. HERO EQUIPMENT LOOKUP
      if (subcommand === 'equipment') {
        const hero = interaction.options.getString('hero') || undefined;
        const name = interaction.options.getString('name') || undefined;

        if (!hero && !name) {
          const overview = `
## 👑 Clash of Clans Hero Equipment (2026 Meta)

Select a Hero to inspect full equipment stats, ratings, and top synergies:

* **👑 Barbarian King** (8) — \`Giant Gauntlet\`, \`Spiky Ball\`, \`Snake Bracelet\`, \`Stick Horse\`, \`Vampstache\`, etc.
* **🏹 Archer Queen** (8) — \`Magic Mirror\`, \`Frozen Arrow\`, \`Action Figure\`, \`Monolith Arrow\`, \`Healer Puppet\`, etc.
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

      // 7. HERO PROFILE
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

### 🎒 All Available Equipments (${heroEquips.length})
${equipNames}

💡 *Use \`/clash equipment hero:"${heroName}"\` to see full synergy details for every item!*
`;
        await interaction.editReply({ content: safeDiscordLength(reply.trim()) });
        return;
      }

      // 8. TOWNHALL GUIDE
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
