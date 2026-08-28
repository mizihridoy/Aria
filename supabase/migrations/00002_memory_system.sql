-- ============================================================================
-- Migration 00002: Memory System with pgvector Semantic Search
-- ============================================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Memories table (User memories & Server memories)
CREATE TABLE IF NOT EXISTS public.memories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    guild_id BIGINT NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    user_id BIGINT,                      -- Discord User Snowflake (NULL = Server-wide memory)
    content TEXT NOT NULL,               -- The actual remembered fact/preference/detail
    category TEXT NOT NULL DEFAULT 'fact', -- 'preference', 'fact', 'context', 'identity', 'note'
    confidence FLOAT NOT NULL DEFAULT 1.0,
    embedding extensions.vector(1536),    -- 1536 dimensions for Gemini gemini-embedding-001 (HNSW index compatible)
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ DEFAULT NULL, -- Soft delete support
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_memories_guild_user_active 
    ON public.memories(guild_id, user_id) 
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_memories_guild_active 
    ON public.memories(guild_id) 
    WHERE deleted_at IS NULL;

-- HNSW Vector index for fast cosine distance semantic search
CREATE INDEX IF NOT EXISTS idx_memories_embedding 
    ON public.memories 
    USING hnsw (embedding extensions.vector_cosine_ops);

-- RLS
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access to memories" ON public.memories
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC Function for matching memories within a guild and optional user scope
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
