import { SlashCommandBuilder, MessageFlags, ChannelType, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../types/command.js';
import { GuildRepository } from '../../database/repositories/guild.js';
import { isGuildAdmin } from '../utils/permissions.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-config');

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure Aria for your server (Admin only)')
    .addSubcommandGroup(group =>
      group
        .setName('channels')
        .setDescription('Manage channels where Aria actively participates')
        .addSubcommand(sub =>
          sub
            .setName('add')
            .setDescription('Add a channel where Aria will automatically respond and chat')
            .addChannelOption(opt =>
              opt
                .setName('channel')
                .setDescription('The channel to enable')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName('remove')
            .setDescription('Remove a channel from Aria auto-chat')
            .addChannelOption(opt =>
              opt
                .setName('channel')
                .setDescription('The channel to remove')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName('list')
            .setDescription('List all currently active auto-chat channels')
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('personality')
        .setDescription('Set custom personality context for Aria in this server')
        .addStringOption(opt =>
          opt
            .setName('prompt')
            .setDescription('E.g. "We are a friendly Clash of Clans clan focused on CWL strategy"')
            .setRequired(false)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'The `/config` command is only available inside servers.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!isGuildAdmin(interaction)) {
      await interaction.reply({
        content: '⚠️ You need `Manage Server` or `Administrator` permissions to use this command.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const guildId = interaction.guild.id;
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    try {
      if (group === 'channels') {
        if (subcommand === 'add') {
          const targetChannel = interaction.options.getChannel('channel', true);
          const updated = await GuildRepository.toggleAiChannel(guildId, targetChannel.id, true);

          await interaction.editReply({
            content: `✅ Successfully added <#${targetChannel.id}> to Aria's active channels!\nI will now participate in conversations there.`,
          });
          return;
        }

        if (subcommand === 'remove') {
          const targetChannel = interaction.options.getChannel('channel', true);
          const updated = await GuildRepository.toggleAiChannel(guildId, targetChannel.id, false);

          await interaction.editReply({
            content: `✅ Removed <#${targetChannel.id}> from active channels. I'll now only respond when directly @mentioned or replied to there.`,
          });
          return;
        }

        if (subcommand === 'list') {
          const settings = await GuildRepository.getSettings(guildId);
          const channels = settings?.ai_channels || [];

          if (channels.length === 0) {
            await interaction.editReply({
              content: 'ℹ️ No active auto-chat channels configured. I only respond when directly mentioned or replied to.',
            });
            return;
          }

          const channelList = channels.map(id => `• <#${id}>`).join('\n');
          await interaction.editReply({
            content: `### 💬 Configured Auto-Chat Channels:\n${channelList}`,
          });
          return;
        }
      }

      if (subcommand === 'personality') {
        const prompt = interaction.options.getString('prompt');

        if (prompt === null || prompt.trim().length === 0) {
          // Clear personality
          await GuildRepository.updateSettings(guildId, { personality_notes: null });
          await interaction.editReply({
            content: '🔄 Server personality customization reset to default.',
          });
          return;
        }

        await GuildRepository.updateSettings(guildId, { personality_notes: prompt.trim() });
        await interaction.editReply({
          content: `✨ Server personality context updated!\n> "${prompt.trim()}"`,
        });
        return;
      }
    } catch (error) {
      log.error({ error, guildId, group, subcommand }, 'Error executing /config command');
      await interaction.editReply({
        content: 'An error occurred while updating server configuration.',
      });
    }
  },
};
