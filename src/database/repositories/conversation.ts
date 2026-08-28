import { supabase } from '../client.js';
import type { Database } from '../../types/database.types.js';
import { DatabaseError } from '../../utils/errors.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('conversation-repo');

export type ConversationMessageRow = Database['public']['Tables']['conversation_messages']['Row'];
export type ConversationMessageInsert = Database['public']['Tables']['conversation_messages']['Insert'];

export class ConversationRepository {
  /**
   * Log a message in the channel conversation context
   */
  public static async logMessage(msg: ConversationMessageInsert): Promise<void> {
    const { error } = await supabase
      .from('conversation_messages')
      .upsert(msg as any, { onConflict: 'message_id' });

    if (error) {
      log.warn({ error, messageId: msg.message_id }, 'Failed to log message to conversation history');
      // We don't throw to avoid failing the main bot flow on optional history logging
    }
  }

  /**
   * Retrieve recent conversation history for a channel (chronologically ordered)
   */
  public static async getRecentChannelMessages(
    guildId: string,
    channelId: string,
    limit: number = 10
  ): Promise<ConversationMessageRow[]> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('guild_id', guildId)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      log.error({ error, guildId, channelId }, 'Failed to fetch conversation history');
      return [];
    }

    // Reverse to get chronological order (oldest -> newest)
    return ((data as ConversationMessageRow[]) || []).reverse();
  }
}
