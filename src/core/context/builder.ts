import type { Message, User, Guild, GuildMember, TextBasedChannel } from 'discord.js';
import { ConversationRepository } from '../../database/repositories/conversation.js';
import { GuildRepository } from '../../database/repositories/guild.js';
import { MemoryManager } from '../../memory/manager.js';
import { KnowledgeManager } from '../../knowledge/manager.js';
import type { AriaRequestContext, AriaUserContext, AriaGuildContext, AriaConversationContext } from '../types.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('context-builder');

export class ContextBuilder {
  /**
   * Assembles context from a Discord message or interaction
   */
  public static async buildFromMessage(params: {
    message: Message;
    promptText: string;
    triggerType: AriaRequestContext['triggerType'];
  }): Promise<AriaRequestContext> {
    const { message, promptText, triggerType } = params;
    const isDm = !message.guild;
    const guildId = message.guildId || 'DM';
    const channelId = message.channelId;
    const author = message.author;
    const member = message.member;

    // 1. Build User Context
    const userContext: AriaUserContext = {
      id: author.id,
      username: author.username,
      displayName: member?.displayName || author.displayName || author.username,
      roles: member?.roles.cache.map(r => r.name) || [],
      isOwner: message.guild ? message.guild.ownerId === author.id : false,
      isAdmin: member ? member.permissions.has('Administrator') : false,
    };

    // 2. Fetch Guild Settings
    let personalityNotes: string | null = null;
    if (message.guild) {
      const settings = await GuildRepository.getSettings(message.guild.id);
      personalityNotes = settings?.personality_notes || null;
    }

    const guildContext: AriaGuildContext = {
      id: guildId,
      name: message.guild?.name || 'Direct Message',
      channelId: channelId,
      channelName: ('name' in message.channel && typeof message.channel.name === 'string') ? message.channel.name : 'dm',
      isDm,
      personalityNotes,
    };

    // 3. Extract Image Attachments (Multimodal Vision)
    const imageUrls: string[] = [];
    if (message.attachments.size > 0) {
      for (const [_, attachment] of message.attachments) {
        const isImage = attachment.contentType?.startsWith('image/') ||
          /\.(png|jpe?g|webp|gif)$/i.test(attachment.url);
        if (isImage) {
          imageUrls.push(attachment.url);
        }
      }
    }

    // 4. Fetch Recent Channel Messages (Conversation History - Token Optimized)
    let recentMessages: AriaConversationContext['recentMessages'] = [];
    if (!isDm) {
      const historyRows = await ConversationRepository.getRecentChannelMessages(guildId, channelId, 4);
      recentMessages = historyRows.slice(0, 3).map(r => ({
        userName: r.user_name,
        // Truncate verbose previous AI answers in prompt to stay well within TPM limits
        content: r.content.length > 280 ? r.content.slice(0, 280) + '... [summary]' : r.content,
        isAria: r.is_aria,
        timestamp: r.created_at,
      }));
    }

    // 5. Retrieve Relevant Memories (Semantic Search)
    const memoryResult = !isDm
      ? await MemoryManager.retrieveRelevantMemories(promptText, guildId, author.id, 2)
      : { memories: [], userMemories: [], serverMemories: [] };

    // 6. Retrieve Relevant Knowledge
    const knowledgeItems = !isDm
      ? await KnowledgeManager.searchKnowledge(promptText, guildId, 1)
      : [];

    log.debug(
      {
        guildId,
        userId: author.id,
        memoriesFound: memoryResult.memories.length,
        knowledgeFound: knowledgeItems.length,
        imagesFound: imageUrls.length,
        historyCount: recentMessages.length,
      },
      'Assembled request context'
    );

    return {
      user: userContext,
      guild: guildContext,
      conversation: { recentMessages },
      memories: memoryResult.memories,
      knowledge: knowledgeItems,
      imageUrls,
      triggerType,
    };
  }
}
