import { MemoryRepository, type MatchedMemory, type MemoryRow } from '../database/repositories/memory.js';
import { EmbeddingService } from './embeddings.js';
import type { MemoryItem, MemorySearchResult } from './types.js';
import { createChildLogger } from '../services/logger.js';
import type { Json } from '../types/database.types.js';

const log = createChildLogger('memory-manager');

export class MemoryManager {
  /**
   * Remember a fact or preference about a user or the server.
   */
  public static async remember(params: {
    guildId: string;
    userId?: string | null;
    content: string;
    category?: 'preference' | 'fact' | 'context' | 'identity' | 'note';
    confidence?: number;
    metadata?: Record<string, unknown>;
  }): Promise<MemoryRow | null> {
    const { guildId, userId, content, category = 'fact', confidence = 1.0, metadata = {} } = params;

    try {
      // 1. Generate embedding for semantic search
      const embedding = await EmbeddingService.generateEmbedding(content);
      const embeddingString = embedding ? `[${embedding.join(',')}]` : null;

      // 2. Check if a very similar memory already exists to avoid exact duplicate bloat
      if (embedding) {
        const existing = await MemoryRepository.matchMemories(embedding, guildId, userId, 0.92, 1);
        if (existing.length > 0) {
          log.info({ existingId: existing[0].id, content }, 'Memory already closely exists, skipping duplicate insertion');
          return null;
        }
      }

      // 3. Store the new memory
      const saved = await MemoryRepository.create({
        guild_id: guildId,
        user_id: userId ?? null,
        content: content.trim(),
        category,
        confidence,
        embedding: embeddingString,
        metadata: metadata as Json,
      });

      log.info({ memoryId: saved.id, guildId, userId, category }, 'Stored new memory');
      return saved;
    } catch (error) {
      log.error({ error, guildId, userId, content }, 'Failed to store memory');
      return null;
    }
  }

  /**
   * Semantically retrieve relevant memories for a prompt/query within a server and user context.
   */
  public static async retrieveRelevantMemories(
    queryText: string,
    guildId: string,
    userId?: string | null,
    limit: number = 6
  ): Promise<MemorySearchResult> {
    try {
      const embedding = await EmbeddingService.generateEmbedding(queryText);

      if (!embedding) {
        return { memories: [], userMemories: [], serverMemories: [] };
      }

      const matches = await MemoryRepository.matchMemories(embedding, guildId, userId, 0.65, limit);

      const items: MemoryItem[] = matches.map(m => ({
        id: m.id,
        guildId: m.guild_id,
        userId: m.user_id,
        content: m.content,
        category: m.category as MemoryItem['category'],
        metadata: m.metadata as Record<string, unknown>,
        similarity: m.similarity,
      }));

      const userMemories = items.filter(m => m.userId != null);
      const serverMemories = items.filter(m => m.userId == null);

      return {
        memories: items,
        userMemories,
        serverMemories,
      };
    } catch (error) {
      log.error({ error, queryText, guildId, userId }, 'Failed to retrieve memories');
      return { memories: [], userMemories: [], serverMemories: [] };
    }
  }

  /**
   * List all memories for a user
   */
  public static async listUserMemories(guildId: string, userId: string): Promise<MemoryItem[]> {
    const rows = await MemoryRepository.listUserMemories(guildId, userId);
    return rows.map(r => ({
      id: r.id,
      guildId: r.guild_id,
      userId: r.user_id,
      content: r.content,
      category: r.category as MemoryItem['category'],
      metadata: r.metadata as Record<string, unknown>,
      createdAt: r.created_at,
    }));
  }

  /**
   * Delete a specific memory
   */
  public static async deleteMemory(id: number, guildId: string, userId?: string | null): Promise<boolean> {
    return MemoryRepository.deleteMemory(id, guildId, userId);
  }

  /**
   * Wipe all memories for a user in a guild
   */
  public static async wipeUserMemories(guildId: string, userId: string): Promise<number> {
    return MemoryRepository.deleteAllUserMemories(guildId, userId);
  }
}
