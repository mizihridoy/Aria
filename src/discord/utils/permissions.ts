import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export function isGuildAdmin(interaction: ChatInputCommandInteraction): boolean {
  if (!interaction.inGuild() || !interaction.member) {
    return false;
  }

  const member = interaction.member as GuildMember;
  return member.permissions.has('Administrator') || member.permissions.has('ManageGuild');
}
