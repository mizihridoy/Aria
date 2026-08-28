import { google } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';
import { env } from '../../config/env.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('provider-gemini');

export class GeminiProvider {
  public static readonly name = 'google-gemini';

  public static isConfigured(): boolean {
    return Boolean(env.GOOGLE_GENERATIVE_AI_API_KEY && env.GOOGLE_GENERATIVE_AI_API_KEY.length > 0);
  }

  public static getModel(modelId: string = env.GEMINI_MODEL): LanguageModel {
    log.debug({ modelId }, 'Initializing Gemini LanguageModel');
    return google(modelId);
  }
}
