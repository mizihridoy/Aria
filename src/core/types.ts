import type { CoreMessage } from 'ai';
import type { MemoryItem } from '../memory/types.js';
import type { KnowledgeItem } from '../knowledge/types.js';

export interface AriaUserContext {
  id: string;
  username: string;
  displayName: string;
  roles?: string[];
  isOwner?: boolean;
  isAdmin?: boolean;
}

export interface AriaGuildContext {
  id: string;
  name: string;
  channelId: string;
  channelName: string;
  isDm: boolean;
  personalityNotes?: string | null;
}

export interface AriaConversationContext {
  recentMessages: {
    userName: string;
    content: string;
    isAria: boolean;
    timestamp?: string;
  }[];
}

export interface AriaRequestContext {
  user: AriaUserContext;
  guild: AriaGuildContext;
  conversation: AriaConversationContext;
  memories?: MemoryItem[];
  knowledge?: KnowledgeItem[];
  imageUrls?: string[];
  triggerType: 'mention' | 'reply' | 'channel_auto' | 'slash_command' | 'dm';
}

export interface AriaEngineRequest {
  prompt: string;
  context: AriaRequestContext;
  imageUrls?: string[];
  systemPromptOverride?: string;
  allowTools?: boolean;
}

export interface AriaEngineResponse {
  type: 'respond' | 'silent' | 'action';
  content?: string;
  reasoning?: string;
  providerUsed: string;
  modelUsed: string;
  toolCallsExecuted: {
    name: string;
    args: Record<string, unknown>;
    result: unknown;
  }[];
  stepsCount: number;
}
