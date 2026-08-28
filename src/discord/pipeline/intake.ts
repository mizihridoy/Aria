import type { Message } from 'discord.js';
import { ConversationRepository } from '../../database/repositories/conversation.js';
import { GuildRepository } from '../../database/repositories/guild.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('pipeline-intake');

export interface IntakeResult {
  accepted: boolean;
  reason?: string;
  isDm: boolean;
  cleanContent: string;
}

export class MessageIntake {
  /**
   * Evaluates incoming message, logs it into conversation history, and determines if it should enter the pipeline.
   */
  public static async process(message: Message): Promise<IntakeResult> {
    // 1. Ignore bot messages, webhook messages, and system messages
    if (message.author.bot || message.webhookId || message.system) {
      return { accepted: false, reason: 'bot_or_system', isDm: false, cleanContent: '' };
    }

    const isDm = !message.guild;
    const cleanContent = message.content.trim();

    // 2. Ensure Guild & Settings exist in DB if in a server
    if (message.guild) {
      GuildRepository.ensureGuild(
        message.guild.id,
        message.guild.name,
        message.guild.ownerId,
        message.guild.icon
      ).catch(err => {
        log.warn({ error: err, guildId: message.guild?.id }, 'Background guild ensure failed');
      });

      // 3. Passively log message to conversation history
      ConversationRepository.logMessage({
        guild_id: message.guild.id,
        channel_id: message.channelId,
        message_id: message.id,
        user_id: message.author.id,
        user_name: message.member?.displayName || message.author.username,
        content: cleanContent,
        is_aria: false,
        reply_to_message_id: message.reference?.messageId || null,
      }).catch(err => {
        log.warn({ error: err, messageId: message.id }, 'Background conversation log failed');
      });
    }

    return {
      accepted: true,
      isDm,
      cleanContent,
    };
  }
}
