import { supabase } from '../client.js';
import type { Database, Json } from '../../types/database.types.js';
import { DatabaseError } from '../../utils/errors.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('memory-repo');

export type MemoryRow = Database['public']['Tables']['memories']['Row'];
export type MemoryInsert = Database['public']['Tables']['memories']['Insert'];

export interface MatchedMemory {
  id: number;
  guild_id: string;
  user_id: string | null;
  content: string;
  category: string;
  metadata: Json;
  similarity: number;
}

export class MemoryRepository {
  /**
   * Insert a new memory record with optional vector embedding
   */
  public static async create(memory: MemoryInsert): Promise<MemoryRow> {
    const { data, error } = await supabase
      .from('memories')
      .insert(memory as any)
      .select()
      .single();

    if (error) {
      log.error({ error, memory }, 'Failed to create memory');
      throw new DatabaseError(`Failed to save memory: ${error.message}`, error);
    }

    return data as MemoryRow;
  }

  /**
   * Search for semantically similar memories in a guild (optionally scoped to a specific user or server-wide)
   */
  public static async matchMemories(
    embedding: number[],
    guildId: string,
    userId?: string | null,
    threshold: number = 0.65,
    limit: number = 10
  ): Promise<MatchedMemory[]> {
    const embeddingString = `[${embedding.join(',')}]`;

    const { data, error } = await (supabase.rpc as any)('match_guild_memories', {
      query_embedding: embeddingString,
      filter_guild_id: guildId,
      filter_user_id: userId ?? null,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      log.error({ error, guildId, userId }, 'Failed to match memories via RPC');
      throw new DatabaseError(`Failed to search memories: ${error.message}`, error);
    }

    return (data || []) as MatchedMemory[];
  }

  /**
   * List all active memories for a user in a guild
   */
  public static async listUserMemories(guildId: string, userId: string): Promise<MemoryRow[]> {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('guild_id', guildId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      log.error({ error, guildId, userId }, 'Failed to list user memories');
      throw new DatabaseError(`Failed to list memories: ${error.message}`, error);
    }

    return (data as MemoryRow[]) || [];
  }

  /**
   * Soft-delete a memory by ID (with user/guild authorization check)
   */
  public static async deleteMemory(id: number, guildId: string, userId?: string | null): Promise<boolean> {
    let query = supabase
      .from('memories')
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('id', id)
      .eq('guild_id', guildId)
      .is('deleted_at', null);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error, count } = await query;

    if (error) {
      log.error({ error, id, guildId, userId }, 'Failed to delete memory');
      throw new DatabaseError(`Failed to delete memory: ${error.message}`, error);
    }

    return (count ?? 1) > 0;
  }

  /**
   * Soft-delete all memories for a user in a guild
   */
  public static async deleteAllUserMemories(guildId: string, userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('memories')
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('guild_id', guildId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('id');

    if (error) {
      log.error({ error, guildId, userId }, 'Failed to wipe user memories');
      throw new DatabaseError(`Failed to wipe memories: ${error.message}`, error);
    }

    return data?.length || 0;
  }
}
