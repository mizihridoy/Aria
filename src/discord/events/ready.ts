import { Events, type Client, ActivityType } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('event-ready');

export const event: BotEvent<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client<true>) {
    log.info(`🌸 Aria is online and ready! Logged in as ${client.user.tag} (ID: ${client.user.id})`);
    log.info(`Connected to ${client.guilds.cache.size} server(s)`);

    // Set custom activity status
    client.user.setPresence({
      activities: [
        {
          name: 'conversations | @Aria',
          type: ActivityType.Listening,
        },
      ],
      status: 'online',
    });
  },
};
