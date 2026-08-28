-- ============================================================================
-- Migration 00004: Conversation Context Logging
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    guild_id BIGINT NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    channel_id BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_aria BOOLEAN NOT NULL DEFAULT false,
    reply_to_message_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Index for fast channel context retrieval
CREATE INDEX IF NOT EXISTS idx_conv_channel_created 
    ON public.conversation_messages(guild_id, channel_id, created_at DESC);

-- Unique constraint on message_id to prevent duplicate indexing
CREATE UNIQUE INDEX IF NOT EXISTS idx_conv_message_unique 
    ON public.conversation_messages(message_id);

-- RLS
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access to conversation_messages" 
    ON public.conversation_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Function to prune old messages (retention window, e.g. keep last 14 days)
CREATE OR REPLACE FUNCTION public.purge_old_conversation_messages(retention_days INT DEFAULT 14)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.conversation_messages
    WHERE created_at < timezone('utc', now()) - (retention_days || ' days')::INTERVAL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;
