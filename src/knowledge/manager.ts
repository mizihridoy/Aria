import { KnowledgeRepository, type KnowledgeRow } from '../database/repositories/knowledge.js';
import { EmbeddingService } from '../memory/embeddings.js';
import type { KnowledgeItem } from './types.js';
import { createChildLogger } from '../services/logger.js';
import type { Json } from '../types/database.types.js';

const log = createChildLogger('knowledge-manager');

export class KnowledgeManager {
  /**
   * Add or update a knowledge item for a guild.
   */
  public static async addKnowledge(item: KnowledgeItem): Promise<KnowledgeRow | null> {
    try {
      const fullTextToEmbed = `${item.title}: ${item.content}`;
      const embedding = await EmbeddingService.generateEmbedding(fullTextToEmbed);
      const embeddingString = embedding ? `[${embedding.join(',')}]` : null;

      const saved = await KnowledgeRepository.create({
        guild_id: item.guildId,
        title: item.title.trim(),
        content: item.content.trim(),
        category: item.category,
        tags: item.tags || [],
        embedding: embeddingString,
        metadata: (item.metadata || {}) as Json,
        created_by: item.createdBy ?? null,
      });

      log.info({ knowledgeId: saved.id, guildId: item.guildId, title: item.title }, 'Added knowledge entry');
      return saved;
    } catch (error) {
      log.error({ error, item }, 'Failed to add knowledge entry');
      return null;
    }
  }

  /**
   * Search knowledge base semantically for relevant articles/guides/FAQs.
   */
  public static async searchKnowledge(
    queryText: string,
    guildId: string,
    limit: number = 4
  ): Promise<KnowledgeItem[]> {
    try {
      const embedding = await EmbeddingService.generateEmbedding(queryText);
      if (!embedding) return [];

      const matches = await KnowledgeRepository.matchKnowledge(embedding, guildId, 0.60, limit);

      return matches.map(k => ({
        id: k.id,
        guildId: k.guild_id,
        title: k.title,
        content: k.content,
        category: k.category as KnowledgeItem['category'],
        tags: k.tags,
        similarity: k.similarity,
      }));
    } catch (error) {
      log.error({ error, queryText, guildId }, 'Failed to search knowledge base');
      return [];
    }
  }

  /**
   * List all knowledge entries for a guild
   */
  public static async listKnowledge(guildId: string, category?: string): Promise<KnowledgeItem[]> {
    const rows = await KnowledgeRepository.listGuildKnowledge(guildId, category);
    return rows.map(r => ({
      id: r.id,
      guildId: r.guild_id,
      title: r.title,
      content: r.content,
      category: r.category as KnowledgeItem['category'],
      tags: r.tags,
      metadata: r.metadata as Record<string, unknown>,
      createdBy: r.created_by,
      createdAt: r.created_at,
    }));
  }

  /**
   * Delete a knowledge item
   */
  public static async deleteKnowledge(id: number, guildId: string): Promise<boolean> {
    return KnowledgeRepository.deleteKnowledge(id, guildId);
  }
}
