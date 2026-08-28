import type { Json } from '../types/database.types.js';

export interface MemoryItem {
  id?: number;
  guildId: string;
  userId?: string | null;
  content: string;
  category: 'preference' | 'fact' | 'context' | 'identity' | 'note';
  confidence?: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  similarity?: number;
}

export interface MemorySearchResult {
  memories: MemoryItem[];
  userMemories: MemoryItem[];
  serverMemories: MemoryItem[];
}
