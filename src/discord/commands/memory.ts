import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../types/command.js';
import { MemoryManager } from '../../memory/manager.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-memory');

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('memory')
    .setDescription('Manage what Aria remembers about you in this server')
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('View everything Aria currently remembers about you')
    )
    .addSubcommand(sub =>
      sub
        .setName('forget')
        .setDescription('Delete a specific memory by its ID number')
        .addIntegerOption(opt =>
          opt
            .setName('id')
            .setDescription('The ID number of the memory (found in /memory list)')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('forget-all')
        .setDescription('Completely wipe all memories Aria has about you in this server')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'The `/memory` command is only available inside servers.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      if (subcommand === 'list') {
        const memories = await MemoryManager.listUserMemories(guildId, userId);

        if (memories.length === 0) {
          await interaction.editReply({
            content: "✨ I don't have any specific memories stored for you in this server yet! As we chat, I'll naturally remember things you share with me.",
          });
          return;
        }

        let replyText = `### 🧠 Things I remember about you in **${interaction.guild.name}**:\n\n`;
        for (const m of memories) {
          replyText += `• **[ID: ${m.id}]** \`${m.category}\`: ${m.content}\n`;
        }
        replyText += `\n*You can remove any memory with \`/memory forget id:<ID>\` or clear all with \`/memory forget-all\`.*`;

        await interaction.editReply({ content: replyText });
        return;
      }

      if (subcommand === 'forget') {
        const memoryId = interaction.options.getInteger('id', true);
        const deleted = await MemoryManager.deleteMemory(memoryId, guildId, userId);

        if (deleted) {
          await interaction.editReply({
            content: `🗑️ Successfully forgotten memory **#${memoryId}**!`,
          });
        } else {
          await interaction.editReply({
            content: `⚠️ Could not find a memory with ID **#${memoryId}** belonging to you.`,
          });
        }
        return;
      }

      if (subcommand === 'forget-all') {
        const count = await MemoryManager.wipeUserMemories(guildId, userId);
        await interaction.editReply({
          content: `🧹 All clean! Removed **${count}** memory entries for you in this server.`,
        });
        return;
      }
    } catch (error) {
      log.error({ error, subcommand, userId }, 'Error executing /memory command');
      await interaction.editReply({
        content: 'An error occurred while managing your memories. Please try again later.',
      });
    }
  },
};
