import type { Message, SendableChannels } from 'discord.js';
import { splitDiscordMessage } from '../utils/formatting.js';
import { ConversationRepository } from '../../database/repositories/conversation.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('pipeline-responder');

export class MessageResponder {
  /**
   * Delivers Aria's response to the Discord channel, replying inline if appropriate.
   */
  public static async reply(message: Message, content: string): Promise<void> {
    if (!content || content.trim().length === 0) return;

    const chunks = splitDiscordMessage(content);

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        let sentMessage: Message;

        if (i === 0) {
          // First chunk replies directly to user message without pinging
          sentMessage = await message.reply({
            content: chunk,
            allowedMentions: { repliedUser: false },
          });
        } else {
          // Subsequent chunks sent sequentially in channel
          if ('send' in message.channel) {
            sentMessage = await message.channel.send({
              content: chunk,
              allowedMentions: { repliedUser: false },
            });
          } else {
            sentMessage = await message.reply({
              content: chunk,
              allowedMentions: { repliedUser: false },
            });
          }
        }

        // Log Aria's message in conversation history
        if (message.guild) {
          ConversationRepository.logMessage({
            guild_id: message.guild.id,
            channel_id: message.channelId,
            message_id: sentMessage.id,
            user_id: message.client.user?.id || 'ARIA',
            user_name: 'Aria',
            content: chunk,
            is_aria: true,
            reply_to_message_id: message.id,
          }).catch(err => {
            log.warn({ error: err }, 'Failed to log Aria response message');
          });
        }
      }
    } catch (error) {
      log.error({ error, channelId: message.channelId, guildId: message.guildId }, 'Failed to deliver Discord response');
    }
  }
}
