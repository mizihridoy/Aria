import { tool } from 'ai';
import { z } from 'zod';
import { KnowledgeManager } from '../../knowledge/manager.js';
import type { AriaRequestContext } from '../types.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('tool-knowledge');

export function createKnowledgeTools(context: AriaRequestContext) {
  return {
    search_knowledge: tool({
      description: 'Search the server knowledge base for official FAQs, rules, guidelines, tournament procedures, or custom documents.',
      parameters: z.object({
        query: z.string().describe('Search terms or questions regarding server guides or FAQs'),
      }),
      execute: async ({ query }) => {
        log.info({ query, guildId: context.guild.id }, 'AI executing search_knowledge tool');
        const results = await KnowledgeManager.searchKnowledge(query, context.guild.id, 3);

        return {
          foundCount: results.length,
          articles: results.map(k => ({
            title: k.title,
            category: k.category,
            content: k.content,
            tags: k.tags,
          })),
        };
      },
    }),
  };
}
