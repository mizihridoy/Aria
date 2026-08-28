import { Events, type Message } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import { MessageIntake } from '../pipeline/intake.js';
import { ShouldRespondGate } from '../pipeline/should-respond.js';
import { ContextBuilder } from '../../core/context/builder.js';
import { AriaEngine } from '../../core/engine.js';
import { MessageResponder } from '../pipeline/responder.js';
import { InMemoryRateLimiter } from '../../utils/rate-limiter.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('event-message-create');
const rateLimiter = new InMemoryRateLimiter({ windowMs: 60_000, maxRequests: 30 });

export const event: BotEvent<Events.MessageCreate> = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    try {
      // 1. Intake and passive logging
      const intake = await MessageIntake.process(message);
      if (!intake.accepted) {
        return;
      }

      // 2. Intelligence gate: determine if Aria should respond
      const gateResult = await ShouldRespondGate.evaluate(message, message.client);
      if (!gateResult.shouldRespond || !gateResult.triggerType) {
        return;
      }

      // 3. Rate limiting protection (bypassed for owners and administrators)
      const isOwnerOrAdmin = message.guild
        ? message.guild.ownerId === message.author.id || message.member?.permissions.has('Administrator')
        : true;

      if (!isOwnerOrAdmin) {
        const rateLimitKey = `${message.author.id}:${message.channelId}`;
        const { limited, retryAfterMs } = rateLimiter.isRateLimited(rateLimitKey);
        if (limited) {
          log.warn({ user: message.author.tag, retryAfterMs }, 'User hit temporary rate limit');
          return;
        }
      }

      // 4. Send typing indicator
      if ('sendTyping' in message.channel) {
        await message.channel.sendTyping().catch(() => {});
      }

      const promptText = gateResult.cleanPrompt || message.content;

      // 5. Assemble context
      const context = await ContextBuilder.buildFromMessage({
        message,
        promptText,
        triggerType: gateResult.triggerType,
      });

      // 6. Process through Aria AI Engine
      const aiResponse = await AriaEngine.process({
        prompt: promptText,
        context,
      });

      // 7. Handle response outcome
      if (aiResponse.type === 'respond' && aiResponse.content) {
        await MessageResponder.reply(message, aiResponse.content);
      } else if (aiResponse.type === 'silent') {
        log.debug({ channelId: message.channelId }, 'Aria stayed silent as decided by AI');
      }
    } catch (error) {
      log.error({ error, messageId: message.id, author: message.author.tag }, 'Error in message processing pipeline');
    }
  },
};
