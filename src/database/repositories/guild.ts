import { supabase } from '../client.js';
import type { Database } from '../../types/database.types.js';
import { DatabaseError } from '../../utils/errors.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('guild-repo');

export type GuildRow = Database['public']['Tables']['guilds']['Row'];
export type GuildSettingsRow = Database['public']['Tables']['guild_settings']['Row'];

export class GuildRepository {
  /**
   * Ensures a guild and default settings exist in the database upon bot joining or message receipt.
   */
  public static async ensureGuild(
    guildId: string,
    guildName: string,
    ownerId?: string | null,
    iconHash?: string | null
  ): Promise<{ guild: GuildRow; settings: GuildSettingsRow }> {
    try {
      // 1. Upsert Guild record
      const { data: guild, error: guildError } = await supabase
        .from('guilds')
        .upsert(
          {
            id: guildId,
            name: guildName,
            owner_id: ownerId ?? null,
            icon_hash: iconHash ?? null,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (guildError) {
        log.error({ error: guildError, guildId }, 'Failed to upsert guild');
        throw new DatabaseError(`Failed to upsert guild ${guildId}: ${guildError.message}`, guildError);
      }

      // 2. Fetch or create default settings
      let { data: settings, error: settingsError } = await supabase
        .from('guild_settings')
        .select('*')
        .eq('guild_id', guildId)
        .maybeSingle();

      if (settingsError) {
        log.error({ error: settingsError, guildId }, 'Failed to fetch guild settings');
        throw new DatabaseError(`Failed to fetch settings for guild ${guildId}: ${settingsError.message}`, settingsError);
      }

      if (!settings) {
        const { data: newSettings, error: insertError } = await supabase
          .from('guild_settings')
          .insert({
            guild_id: guildId,
            ai_channels: [],
            personality_notes: null,
            auto_respond_enabled: true,
            memory_enabled: true,
            knowledge_enabled: true,
            features: {},
          })
          .select()
          .single();

        if (insertError) {
          log.error({ error: insertError, guildId }, 'Failed to create default guild settings');
          throw new DatabaseError(`Failed to create settings for guild ${guildId}: ${insertError.message}`, insertError);
        }
        settings = newSettings;
      }

      return { guild, settings: settings as GuildSettingsRow };
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError(`Unexpected error ensuring guild ${guildId}`, err);
    }
  }

  /**
   * Retrieves guild settings by guild ID
   */
  public static async getSettings(guildId: string): Promise<GuildSettingsRow | null> {
    const { data, error } = await supabase
      .from('guild_settings')
      .select('*')
      .eq('guild_id', guildId)
      .maybeSingle();

    if (error) {
      log.error({ error, guildId }, 'Failed to get guild settings');
      throw new DatabaseError(`Failed to get settings for guild ${guildId}: ${error.message}`, error);
    }

    return (data as GuildSettingsRow | null) || null;
  }

  /**
   * Updates guild settings
   */
  public static async updateSettings(
    guildId: string,
    updates: Partial<Database['public']['Tables']['guild_settings']['Update']>
  ): Promise<GuildSettingsRow> {
    const { data, error } = await supabase
      .from('guild_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('guild_id', guildId)
      .select()
      .single();

    if (error) {
      log.error({ error, guildId }, 'Failed to update guild settings');
      throw new DatabaseError(`Failed to update settings for guild ${guildId}: ${error.message}`, error);
    }

    return data as GuildSettingsRow;
  }

  /**
   * Adds or removes an AI active channel for a guild
   */
  public static async toggleAiChannel(guildId: string, channelId: string, enable: boolean): Promise<string[]> {
    const settings = await this.getSettings(guildId);
    const currentChannels = new Set(settings?.ai_channels || []);

    if (enable) {
      currentChannels.add(channelId);
    } else {
      currentChannels.delete(channelId);
    }

    const updated = Array.from(currentChannels);
    await this.updateSettings(guildId, { ai_channels: updated });
    return updated;
  }
}
