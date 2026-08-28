import { tool } from 'ai';
import { z } from 'zod';
import type { AriaRequestContext } from '../types.js';

export function createDiscordInfoTools(context: AriaRequestContext) {
  return {
    get_channel_context: tool({
      description: 'Get metadata about the current channel.',
      parameters: z.object({}),
      execute: async () => {
        return {
          channelId: context.guild.channelId,
          channelName: context.guild.channelName,
          isDm: context.guild.isDm,
        };
      },
    }),

    get_user_info: tool({
      description: 'Get basic profile information about the current interacting user.',
      parameters: z.object({}),
      execute: async () => {
        return {
          userId: context.user.id,
          username: context.user.username,
          displayName: context.user.displayName,
          isAdmin: context.user.isAdmin ?? false,
          isOwner: context.user.isOwner ?? false,
        };
      },
    }),
  };
}
