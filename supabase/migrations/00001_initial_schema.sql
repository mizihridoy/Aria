-- ============================================================================
-- Migration 00001: Initial Schema (Guilds and Guild Settings)
-- ============================================================================

-- Ensure uuid extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Guilds (Tenants)
CREATE TABLE IF NOT EXISTS public.guilds (
    id BIGINT PRIMARY KEY, -- Discord Guild Snowflake ID
    name TEXT NOT NULL,
    icon_hash TEXT,
    owner_id BIGINT,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_guilds_active ON public.guilds(id) WHERE is_active = true;

-- 2. Guild Settings & Feature Configuration
CREATE TABLE IF NOT EXISTS public.guild_settings (
    guild_id BIGINT PRIMARY KEY REFERENCES public.guilds(id) ON DELETE CASCADE,
    ai_channels BIGINT[] NOT NULL DEFAULT '{}', -- Channels where Aria automatically participates
    personality_notes TEXT,                     -- Server-specific personality tweaks (e.g. "We are a friendly Clash clan")
    auto_respond_enabled BOOLEAN NOT NULL DEFAULT true,
    memory_enabled BOOLEAN NOT NULL DEFAULT true,
    knowledge_enabled BOOLEAN NOT NULL DEFAULT true,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Row Level Security (RLS)
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_settings ENABLE ROW LEVEL SECURITY;

-- Note: The bot daemon uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
-- These RLS policies are for authenticated dashboard access via Supabase Auth.
CREATE POLICY "Allow service role full access to guilds" ON public.guilds
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to guild_settings" ON public.guild_settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);
