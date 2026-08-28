import { supabase } from '../client.js';
import type { Database, Json } from '../../types/database.types.js';
import { DatabaseError } from '../../utils/errors.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('knowledge-repo');

export type KnowledgeRow = Database['public']['Tables']['knowledge_entries']['Row'];
export type KnowledgeInsert = Database['public']['Tables']['knowledge_entries']['Insert'];

export interface MatchedKnowledge {
  id: number;
  guild_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  similarity: number;
}

export class KnowledgeRepository {
  /**
   * Add a new knowledge entry to a guild
   */
  public static async create(entry: KnowledgeInsert): Promise<KnowledgeRow> {
    const { data, error } = await supabase
      .from('knowledge_entries')
      .insert(entry as any)
      .select()
      .single();

    if (error) {
      log.error({ error, entry }, 'Failed to create knowledge entry');
      throw new DatabaseError(`Failed to save knowledge entry: ${error.message}`, error);
    }

    return data as KnowledgeRow;
  }

  /**
   * Search knowledge base semantically via embeddings
   */
  public static async matchKnowledge(
    embedding: number[],
    guildId: string,
    threshold: number = 0.60,
    limit: number = 5
  ): Promise<MatchedKnowledge[]> {
    const embeddingString = `[${embedding.join(',')}]`;

    const { data, error } = await (supabase.rpc as any)('match_guild_knowledge', {
      query_embedding: embeddingString,
      filter_guild_id: guildId,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      log.error({ error, guildId }, 'Failed to match knowledge entries via RPC');
      throw new DatabaseError(`Failed to search knowledge base: ${error.message}`, error);
    }

    return (data || []) as MatchedKnowledge[];
  }

  /**
   * List all knowledge entries in a guild
   */
  public static async listGuildKnowledge(guildId: string, category?: string): Promise<KnowledgeRow[]> {
    let query = supabase
      .from('knowledge_entries')
      .select('*')
      .eq('guild_id', guildId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      log.error({ error, guildId, category }, 'Failed to list knowledge entries');
      throw new DatabaseError(`Failed to list knowledge entries: ${error.message}`, error);
    }

    return (data as KnowledgeRow[]) || [];
  }

  /**
   * Soft-delete a knowledge entry
   */
  public static async deleteKnowledge(id: number, guildId: string): Promise<boolean> {
    const { error, count } = await supabase
      .from('knowledge_entries')
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('id', id)
      .eq('guild_id', guildId)
      .is('deleted_at', null);

    if (error) {
      log.error({ error, id, guildId }, 'Failed to delete knowledge entry');
      throw new DatabaseError(`Failed to delete knowledge entry: ${error.message}`, error);
    }

    return (count ?? 1) > 0;
  }
}
