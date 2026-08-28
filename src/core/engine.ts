import { generateText, type CoreMessage } from 'ai';
import { SystemPromptBuilder } from './personality/system-prompt.js';
import { ProviderRegistry } from './providers/registry.js';
import { ToolRegistry } from './tools/registry.js';
import type { AriaEngineRequest, AriaEngineResponse } from './types.js';
import { createChildLogger } from '../services/logger.js';
import { AIProviderError } from '../utils/errors.js';

const log = createChildLogger('aria-engine');

export class AriaEngine {
  /**
   * Main AI agent reasoning cycle
   */
  public static async process(request: AriaEngineRequest): Promise<AriaEngineResponse> {
    const { prompt, context, allowTools = true } = request;

    // 1. Build dynamic system prompt
    const systemPrompt = request.systemPromptOverride || SystemPromptBuilder.build(context);

    // 2. Extract images if present
    const images = [...(context.imageUrls || []), ...(request.imageUrls || [])];

    // 3. Prepare tools (for vision analysis, tools are omitted to ensure stable single-pass vision inference)
    const tools = (allowTools && images.length === 0) ? ToolRegistry.getToolsForContext(context) : undefined;

    // 4. Resolve primary model (if images present, Gemini is vision-native)
    let providerInfo: { name: string; model: any };
    if (images.length > 0) {
      const geminiCandidate = ProviderRegistry.getAvailableProviders().find(p => p.name === 'google-gemini');
      providerInfo = geminiCandidate
        ? { name: geminiCandidate.name, model: geminiCandidate.getModel() }
        : ProviderRegistry.getPrimaryModel();
    } else {
      providerInfo = ProviderRegistry.getPrimaryModel();
    }

    try {
      return await this.executeAgentLoop(providerInfo, systemPrompt, prompt, images, tools);
    } catch (primaryError: any) {
      log.warn({ error: primaryError, provider: providerInfo.name }, 'Primary AI provider encountered an error');

      // If Rate Limit error on Groq, perform a fast retry after short backoff
      const isRateLimit = Boolean(
        primaryError?.statusCode === 429 ||
        primaryError?.message?.includes('rate_limit') ||
        primaryError?.message?.includes('Rate limit')
      );

      if (isRateLimit) {
        log.warn({ provider: providerInfo.name }, 'Rate limit reached, pausing for 2.5s before retrying...');
        await new Promise(resolve => setTimeout(resolve, 2500));
        try {
          return await this.executeAgentLoop(providerInfo, systemPrompt, prompt, images, tools);
        } catch (retryErr) {
          log.warn({ error: retryErr }, 'Retry on primary provider after rate limit also failed');
        }
      }

      // Attempt fallback model (if fallback is Gemini, run single-pass direct answer to avoid thought signature issues)
      const fallback = ProviderRegistry.getFallbackModel(providerInfo.name);
      if (fallback) {
        try {
          const fallbackTools = fallback.name === 'google-gemini' ? undefined : tools;
          return await this.executeAgentLoop(fallback, systemPrompt, prompt, images, fallbackTools);
        } catch (fallbackError) {
          log.error({ error: fallbackError, fallbackProvider: fallback.name }, 'Fallback AI provider also failed');
          throw new AIProviderError(`All AI providers failed: ${(fallbackError as Error).message}`, fallback.name, false, fallbackError);
        }
      }

      throw new AIProviderError(`AI provider ${providerInfo.name} failed: ${(primaryError as Error).message}`, providerInfo.name, false, primaryError);
    }
  }

  private static async executeAgentLoop(
    providerInfo: { name: string; model: any },
    systemPrompt: string,
    prompt: string,
    images: string[],
    tools: any
  ): Promise<AriaEngineResponse> {
    const startTime = Date.now();
    log.info(
      { provider: providerInfo.name, promptSnippet: prompt.slice(0, 80), imageCount: images.length },
      'Running Aria agent cycle'
    );

    let generateOptions: any = {
      model: providerInfo.model,
      system: systemPrompt,
      tools: tools,
      maxSteps: (images.length > 0 || !tools) ? 1 : 3,
    };

    if (images.length > 0) {
      // Build multimodal message parts
      const userContent: any[] = [
        { type: 'text', text: prompt && prompt.length > 0 ? prompt : 'Please analyze this image/screenshot in detail.' },
      ];

      for (const imgUrl of images) {
        userContent.push({
          type: 'image',
          image: new URL(imgUrl),
        });
      }

      generateOptions.messages = [
        {
          role: 'user',
          content: userContent,
        },
      ];
    } else {
      generateOptions.prompt = prompt;
    }

    const result = await generateText(generateOptions);

    const elapsed = Date.now() - startTime;
    const rawText = result.text.trim();

    // Check for decision to stay silent
    if (rawText.includes('<SILENT>')) {
      log.info({ provider: providerInfo.name, elapsedMs: elapsed }, 'Aria decided to stay SILENT');
      return {
        type: 'silent',
        providerUsed: providerInfo.name,
        modelUsed: providerInfo.name,
        toolCallsExecuted: [],
        stepsCount: result.steps.length,
      };
    }

    // Clean any accidental leftover tags
    const cleanedText = rawText.replace(/<SILENT>/g, '').trim();

    // Extract tool calls executed across all steps
    const toolCallsExecuted = result.steps.flatMap(step =>
      ((step.toolCalls || []) as any[]).map(tc => ({
        name: tc.toolName,
        args: tc.args as Record<string, unknown>,
        result: ((step.toolResults || []) as any[]).find(tr => tr.toolCallId === tc.toolCallId)?.result,
      }))
    );

    log.info(
      {
        provider: providerInfo.name,
        steps: result.steps.length,
        toolsUsed: toolCallsExecuted.length,
        elapsedMs: elapsed,
      },
      'Aria agent cycle completed'
    );

    return {
      type: 'respond',
      content: cleanedText,
      providerUsed: providerInfo.name,
      modelUsed: providerInfo.name,
      toolCallsExecuted,
      stepsCount: result.steps.length,
    };
  }
}
