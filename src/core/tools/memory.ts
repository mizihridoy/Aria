import { tool } from 'ai';
import { z } from 'zod';
import { MemoryManager } from '../../memory/manager.js';
import type { AriaRequestContext } from '../types.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('tool-memory');

export function createMemoryTools(context: AriaRequestContext) {
  return {
    remember: tool({
      description: 'Store a lasting fact or preference about the user or entire server.',
      parameters: z.object({
        fact: z.string().describe('Clear fact to remember (e.g. "Main army is Hydra", "Town Hall 15")'),
        target: z.enum(['user', 'server']).default('user').describe('Whether this is for the interacting user or whole server'),
      }),
      execute: async ({ fact, target }) => {
        log.info({ userId: context.user.id, fact, target }, 'AI saving memory');
        const saved = await MemoryManager.remember({
          guildId: context.guild.id,
          userId: target === 'user' ? context.user.id : null,
          content: fact,
          category: 'fact',
          metadata: { storedVia: 'tool_call', channelId: context.guild.channelId },
        });

        return { success: true, message: `Remembered: "${fact}"` };
      },
    }),

    recall_memories: tool({
      description: 'Search past stored memories about the user or server.',
      parameters: z.object({
        query: z.string().describe('Search query for memories'),
      }),
      execute: async ({ query }) => {
        const results = await MemoryManager.retrieveRelevantMemories(
          query,
          context.guild.id,
          context.user.id,
          3
        );

        return {
          found: results.memories.length,
          memories: results.memories.map(m => m.content),
        };
      },
    }),
  };
}
