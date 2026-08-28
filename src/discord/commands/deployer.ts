import { REST, Routes } from 'discord.js';
import { env } from '../../config/env.js';
import { command as ariaCommand } from './aria.js';
import { command as memoryCommand } from './memory.js';
import { command as configCommand } from './config.js';
import { command as helpCommand } from './help.js';
import { command as knowledgeCommand } from './knowledge.js';
import { command as clashCommand } from './clash.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('deploy-commands');

const commands = [
  ariaCommand.data.toJSON(),
  memoryCommand.data.toJSON(),
  configCommand.data.toJSON(),
  helpCommand.data.toJSON(),
  knowledgeCommand.data.toJSON(),
  clashCommand.data.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

export async function deployCommands(): Promise<void> {
  try {
    log.info(`Starting refresh of ${commands.length} application (/) commands...`);

    if (env.DISCORD_DEV_GUILD_ID && env.DISCORD_DEV_GUILD_ID.trim().length > 0) {
      // Instant deployment to Dev Guild
      await rest.put(
        Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_DEV_GUILD_ID),
        { body: commands }
      );
      log.info(`Successfully reloaded Guild (/) commands to dev guild: ${env.DISCORD_DEV_GUILD_ID}`);
    } else {
      // Global deployment
      await rest.put(
        Routes.applicationCommands(env.DISCORD_CLIENT_ID),
        { body: commands }
      );
      log.info('Successfully reloaded Global (/) commands across all guilds.');
    }
  } catch (error) {
    log.error({ error }, 'Error deploying slash commands');
    throw error;
  }
}

// Standalone execution if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployCommands()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
