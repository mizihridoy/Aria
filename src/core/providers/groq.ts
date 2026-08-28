import { groq } from '@ai-sdk/groq';
import type { LanguageModel } from 'ai';
import { env } from '../../config/env.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('provider-groq');

export class GroqProvider {
  public static readonly name = 'groq';

  public static isConfigured(): boolean {
    return Boolean(env.GROQ_API_KEY && env.GROQ_API_KEY.length > 0);
  }

  public static getModel(modelId: string = env.GROQ_MODEL): LanguageModel {
    log.debug({ modelId }, 'Initializing Groq LanguageModel');
    return groq(modelId);
  }
}
