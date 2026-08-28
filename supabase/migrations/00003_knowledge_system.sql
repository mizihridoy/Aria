-- ============================================================================
-- Migration 00003: Knowledge System with Semantic & Hybrid Search
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.knowledge_entries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    guild_id BIGINT NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'custom', -- 'faq', 'rules', 'guide', 'lore', 'custom', 'tournament'
    tags TEXT[] NOT NULL DEFAULT '{}',
    embedding extensions.vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by BIGINT,                       -- Discord User Snowflake
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_guild_active 
    ON public.knowledge_entries(guild_id) 
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_knowledge_category 
    ON public.knowledge_entries(guild_id, category) 
    WHERE deleted_at IS NULL;

-- HNSW Vector index for fast cosine distance semantic search
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding 
    ON public.knowledge_entries 
    USING hnsw (embedding extensions.vector_cosine_ops);

-- RLS
ALTER TABLE public.knowledge_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access to knowledge" ON public.knowledge_entries
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC Function for matching knowledge entries
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
