import { Collection } from 'discord.js';
import type { Command } from '../types/command.js';
import { command as ariaCommand } from './aria.js';
import { command as memoryCommand } from './memory.js';
import { command as configCommand } from './config.js';
import { command as helpCommand } from './help.js';
import { command as knowledgeCommand } from './knowledge.js';
import { command as clashCommand } from './clash.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-loader');

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>();

  const registeredCommands: Command[] = [
    ariaCommand,
    memoryCommand,
    configCommand,
    helpCommand,
    knowledgeCommand,
    clashCommand,
  ];

  for (const cmd of registeredCommands) {
    commands.set(cmd.data.name, cmd);
    log.debug({ name: cmd.data.name }, 'Registered command');
  }

  log.info({ count: commands.size }, 'All application slash commands loaded');
  return commands;
}
