-- ============================================================================
-- Migration 00005: Set Embedding Dimensions to 1536 (pgvector HNSW compatible)
-- ============================================================================

-- 1. Alter memories table embedding column to 1536 dimensions
ALTER TABLE public.memories 
    ALTER COLUMN embedding TYPE extensions.vector(1536);

-- Recreate index with HNSW
DROP INDEX IF EXISTS public.idx_memories_embedding;
CREATE INDEX idx_memories_embedding 
    ON public.memories 
    USING hnsw (embedding extensions.vector_cosine_ops);

-- 2. Update match_guild_memories function
CREATE OR REPLACE FUNCTION public.match_guild_memories(
    query_embedding extensions.vector(1536),
    filter_guild_id BIGINT,
    filter_user_id BIGINT DEFAULT NULL,
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id BIGINT,
    guild_id BIGINT,
    user_id BIGINT,
    content TEXT,
    category TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    m.id,
    m.guild_id,
    m.user_id,
    m.content,
    m.category,
    m.metadata,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM public.memories m
  WHERE m.guild_id = filter_guild_id
    AND m.deleted_at IS NULL
    AND (filter_user_id IS NULL OR m.user_id IS NULL OR m.user_id = filter_user_id)
    AND m.embedding <=> query_embedding < (1 - match_threshold)
  ORDER BY m.embedding <=> query_embedding ASC
  LIMIT LEAST(match_count, 30);
$$;

-- 3. Alter knowledge_entries table embedding column to 1536 dimensions
ALTER TABLE public.knowledge_entries 
    ALTER COLUMN embedding TYPE extensions.vector(1536);

-- Recreate index with HNSW
DROP INDEX IF EXISTS public.idx_knowledge_embedding;
CREATE INDEX idx_knowledge_embedding 
    ON public.knowledge_entries 
    USING hnsw (embedding extensions.vector_cosine_ops);

-- 4. Update match_guild_knowledge function
CREATE OR REPLACE FUNCTION public.match_guild_knowledge(
    query_embedding extensions.vector(1536),
    filter_guild_id BIGINT,
    match_threshold FLOAT DEFAULT 0.60,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id BIGINT,
    guild_id BIGINT,
    title TEXT,
    content TEXT,
    category TEXT,
    tags TEXT[],
    similarity FLOAT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    k.id,
    k.guild_id,
    k.title,
    k.content,
    k.category,
    k.tags,
    1 - (k.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_entries k
  WHERE k.guild_id = filter_guild_id
    AND k.deleted_at IS NULL
    AND k.embedding <=> query_embedding < (1 - match_threshold)
  ORDER BY k.embedding <=> query_embedding ASC
  LIMIT LEAST(match_count, 20);
$$;
