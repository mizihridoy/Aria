import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  Events,
} from 'discord.js';
import type { Command } from './types/command.js';
import { loadCommands } from './commands/loader.js';
import { event as readyEvent } from './events/ready.js';
import { event as interactionEvent } from './events/interaction-create.js';
import { event as messageCreateEvent } from './events/message-create.js';
import { createChildLogger } from '../services/logger.js';

const log = createChildLogger('discord-client');

export class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
      ],
    });
  }

  public async initialize(): Promise<void> {
    log.info('Initializing Discord ExtendedClient...');

    // 1. Load Slash Commands
    this.commands = loadCommands();

    // 2. Register Gateway Events
    this.once(readyEvent.name, (...args) => readyEvent.execute(...args));
    this.on(interactionEvent.name, (...args) => interactionEvent.execute(...args));
    this.on(messageCreateEvent.name, (...args) => messageCreateEvent.execute(...args));

    log.info('Registered Discord Gateway event listeners');
  }
}
