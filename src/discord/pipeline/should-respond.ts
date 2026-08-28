import type { Message, Client } from 'discord.js';
import { GuildRepository } from '../../database/repositories/guild.js';
import type { AriaRequestContext } from '../../core/types.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('should-respond-gate');

export interface ShouldRespondResult {
  shouldRespond: boolean;
  triggerType?: AriaRequestContext['triggerType'];
  cleanPrompt?: string;
  reason?: string;
}

export class ShouldRespondGate {
  /**
   * Determines if Aria should actively process and respond to an incoming message.
   */
  public static async evaluate(message: Message, client: Client): Promise<ShouldRespondResult> {
    const botUser = client.user;
    if (!botUser) {
      return { shouldRespond: false, reason: 'bot_user_unavailable' };
    }

    // 1. Direct Messages
    if (!message.guild) {
      return {
        shouldRespond: true,
        triggerType: 'dm',
        cleanPrompt: message.content.trim(),
        reason: 'direct_message',
      };
    }

    // 2. Direct Mention (@Aria)
    const isDirectlyMentioned = message.mentions.has(botUser, { ignoreEveryone: true, ignoreRoles: true });
    if (isDirectlyMentioned) {
      const mentionRegex = new RegExp(`<@!?${botUser.id}>`, 'g');
      const cleanPrompt = message.content.replace(mentionRegex, '').trim();

      return {
        shouldRespond: true,
        triggerType: 'mention',
        cleanPrompt: cleanPrompt.length > 0 ? cleanPrompt : 'Hello Aria!',
        reason: 'direct_mention',
      };
    }

    // 3. Reply to Aria's message
    if (message.reference && message.reference.messageId) {
      try {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        if (referencedMessage && referencedMessage.author.id === botUser.id) {
          return {
            shouldRespond: true,
            triggerType: 'reply',
            cleanPrompt: message.content.trim(),
            reason: 'reply_to_aria',
          };
        }
      } catch (err) {
        log.debug({ error: err, refId: message.reference.messageId }, 'Could not fetch referenced reply message');
      }
    }

    // 4. Configured AI Channels
    const settings = await GuildRepository.getSettings(message.guild.id);
    if (settings && settings.auto_respond_enabled && settings.ai_channels.includes(message.channelId)) {
      return {
        shouldRespond: true,
        triggerType: 'channel_auto',
        cleanPrompt: message.content.trim(),
        reason: 'ai_configured_channel',
      };
    }

    // 5. Default: Stay silent
    return {
      shouldRespond: false,
      reason: 'untriggered_channel_message',
    };
  }
}
