import type { LanguageModel } from 'ai';
import { GeminiProvider } from './gemini.js';
import { GroqProvider } from './groq.js';
import { createChildLogger } from '../../services/logger.js';
import { AIProviderError } from '../../utils/errors.js';

const log = createChildLogger('provider-registry');

export interface ProviderCandidate {
  name: string;
  getModel: () => LanguageModel;
  isAvailable: () => boolean;
}

export class ProviderRegistry {
  private static providers: ProviderCandidate[] = [
    {
      name: 'groq',
      getModel: () => GroqProvider.getModel(),
      isAvailable: () => GroqProvider.isConfigured(),
    },
    {
      name: 'google-gemini',
      getModel: () => GeminiProvider.getModel(),
      isAvailable: () => GeminiProvider.isConfigured(),
    },
  ];

  /**
   * Returns list of configured and available providers in priority order.
   */
  public static getAvailableProviders(): ProviderCandidate[] {
    return this.providers.filter(p => p.isAvailable());
  }

  /**
   * Gets the primary model for execution
   */
  public static getPrimaryModel(): { name: string; model: LanguageModel } {
    const available = this.getAvailableProviders();
    if (available.length === 0) {
      throw new AIProviderError('No AI providers configured. Please check your API keys.', 'none');
    }

    const primary = available[0];
    return { name: primary.name, model: primary.getModel() };
  }

  /**
   * Gets a fallback model if the primary model fails with rate limits or availability errors
   */
  public static getFallbackModel(failedProviderName: string): { name: string; model: LanguageModel } | null {
    const candidates = this.getAvailableProviders().filter(p => p.name !== failedProviderName);
    if (candidates.length === 0) {
      log.warn({ failedProviderName }, 'No fallback AI provider available');
      return null;
    }

    const fallback = candidates[0];
    log.info({ from: failedProviderName, to: fallback.name }, 'Routing request to fallback AI provider');
    return { name: fallback.name, model: fallback.getModel() };
  }
}
