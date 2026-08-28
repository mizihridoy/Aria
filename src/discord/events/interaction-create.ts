import { Events, MessageFlags, type Interaction } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { ExtendedClient } from '../client.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('event-interaction');

export const event: BotEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const client = interaction.client as ExtendedClient;

    // Handle Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        log.warn({ commandName: interaction.commandName }, 'Command not found in registry');
        return;
      }

      try {
        log.info(
          { commandName: interaction.commandName, user: interaction.user.tag, guildId: interaction.guildId },
          'Executing slash command'
        );
        await command.execute(interaction);
      } catch (error) {
        log.error({ error, commandName: interaction.commandName }, 'Error handling slash command');

        const errorPayload = {
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral as any,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorPayload).catch(() => {});
        } else {
          await interaction.reply(errorPayload).catch(() => {});
        }
      }
      return;
    }

    // Handle Autocomplete
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          log.error({ error, commandName: interaction.commandName }, 'Error handling autocomplete');
        }
      }
    }
  },
};
