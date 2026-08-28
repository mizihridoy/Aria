import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { env } from '../config/env.js';
import { createChildLogger } from '../services/logger.js';

const log = createChildLogger('embeddings');

export class EmbeddingService {
  /**
   * Generates a 1536-dimensional vector embedding for a given text snippet.
   * 1536 dimensions is optimized for pgvector HNSW indexing (under the 2000-dim limit).
   */
  public static async generateEmbedding(text: string): Promise<number[] | null> {
    if (!text || text.trim().length === 0) return null;

    try {
      const sanitized = text.slice(0, 2048); // Cap length to avoid excessive tokens
      const { embedding } = await embed({
        model: google.textEmbeddingModel(env.EMBEDDING_MODEL, {
          outputDimensionality: 1536,
        }),
        value: sanitized,
      });

      return embedding;
    } catch (error) {
      log.warn({ error, text: text.slice(0, 50) }, 'Failed to generate embedding with primary provider');
      return null;
    }
  }

  /**
   * Batch generation of embeddings with 1536 dimensions
   */
  public static async generateManyEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
    if (texts.length === 0) return [];

    try {
      const sanitized = texts.map(t => t.slice(0, 2048));
      const { embeddings } = await embedMany({
        model: google.textEmbeddingModel(env.EMBEDDING_MODEL, {
          outputDimensionality: 1536,
        }),
        values: sanitized,
      });

      return embeddings;
    } catch (error) {
      log.warn({ error, count: texts.length }, 'Failed batch embedding generation, falling back to individual');
      return Promise.all(texts.map(t => this.generateEmbedding(t)));
    }
  }
}
