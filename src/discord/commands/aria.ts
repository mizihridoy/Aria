import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../types/command.js';
import { AriaEngine } from '../../core/engine.js';
import { MemoryManager } from '../../memory/manager.js';
import { KnowledgeManager } from '../../knowledge/manager.js';
import { ConversationRepository } from '../../database/repositories/conversation.js';
import { GuildRepository } from '../../database/repositories/guild.js';
import { splitDiscordMessage } from '../utils/formatting.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-aria');

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('aria')
    .setDescription('Ask Aria anything directly!')
    .addStringOption(option =>
      option
        .setName('prompt')
        .setDescription('Your message or question for Aria')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option
        .setName('secret')
        .setDescription('Whether the response should only be visible to you')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const prompt = interaction.options.getString('prompt') || 'Hello Aria!';
    const isSecret = interaction.options.getBoolean('secret') ?? false;

    await interaction.deferReply({
      flags: isSecret ? MessageFlags.Ephemeral : undefined,
    });

    try {
      const guildId = interaction.guildId || 'DM';
      const channelId = interaction.channelId;
      const isDm = !interaction.guild;

      // Ensure guild exists
      if (interaction.guild) {
        GuildRepository.ensureGuild(
          interaction.guild.id,
          interaction.guild.name,
          interaction.guild.ownerId,
          interaction.guild.icon
        ).catch(() => {});
      }

      // 1. Gather memories & knowledge
      const memoryResult = !isDm
        ? await MemoryManager.retrieveRelevantMemories(prompt, guildId, interaction.user.id, 4)
        : { memories: [], userMemories: [], serverMemories: [] };

      const knowledgeItems = !isDm
        ? await KnowledgeManager.searchKnowledge(prompt, guildId, 2)
        : [];

      // 2. Build context
      const context = {
        user: {
          id: interaction.user.id,
          username: interaction.user.username,
          displayName: interaction.member && 'displayName' in interaction.member ? (interaction.member as any).displayName : interaction.user.displayName,
          isAdmin: interaction.memberPermissions?.has('Administrator') ?? false,
          isOwner: interaction.guild ? interaction.guild.ownerId === interaction.user.id : false,
        },
        guild: {
          id: guildId,
          name: interaction.guild?.name || 'Direct Message',
          channelId: channelId,
          channelName: interaction.channel && 'name' in interaction.channel ? (interaction.channel as any).name : 'channel',
          isDm,
        },
        conversation: { recentMessages: [] },
        memories: memoryResult.memories,
        knowledge: knowledgeItems,
        triggerType: 'slash_command' as const,
      };

      // 3. Process via Aria Engine
      const response = await AriaEngine.process({
        prompt,
        context,
      });

      const responseText = response.content || "I'm right here! How can I help you today?";
      const chunks = splitDiscordMessage(responseText);

      // 4. Send response
      await interaction.editReply({
        content: chunks[0],
      });

      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({
          content: chunks[i],
          flags: isSecret ? MessageFlags.Ephemeral : undefined,
        });
      }
    } catch (error) {
      log.error({ error, user: interaction.user.id }, 'Error executing /aria command');
      await interaction.editReply({
        content: 'I had a little trouble thinking of an answer just now. Please try asking again in a moment!',
      });
    }
  },
};
