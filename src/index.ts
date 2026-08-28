import { ExtendedClient } from './discord/client.js';
import { env } from './config/env.js';
import { logger } from './services/logger.js';
import { deployCommands } from './discord/commands/deployer.js';

async function bootstrap() {
  logger.info('=============================================');
  logger.info('🌸 Starting Aria — Discord AI Agent');
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Primary AI Model: ${env.GEMINI_MODEL}`);
  if (env.GROQ_API_KEY) {
    logger.info(`Fallback AI Model: ${env.GROQ_MODEL} (Groq)`);
  }
  logger.info('=============================================');

  // Auto-deploy slash commands in development or if DEV_GUILD_ID is provided
  if (env.DISCORD_DEV_GUILD_ID || env.NODE_ENV === 'development') {
    try {
      logger.info('Syncing application slash commands...');
      await deployCommands();
    } catch (err) {
      logger.warn({ error: err }, 'Could not auto-deploy slash commands on startup');
    }
  }

  const client = new ExtendedClient();
  await client.initialize();

  // Handle process shutdown
  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down Aria gracefully...`);
    client.destroy();
    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled Rejection at Promise');
  });

  process.on('uncaughtException', (error) => {
    logger.error({ error }, 'Uncaught Exception thrown');
  });

  // Login to Discord
  try {
    await client.login(env.DISCORD_TOKEN);
  } catch (error) {
    logger.fatal({ error }, 'Failed to login to Discord');
    process.exit(1);
  }
}

bootstrap().catch(err => {
  logger.fatal({ error: err }, 'Fatal bootstrap error');
  process.exit(1);
});
