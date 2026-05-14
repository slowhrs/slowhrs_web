-- ============================================================================
-- SLOWHRS v2.1 — Community Chat
-- ============================================================================

-- CHAT MESSAGES — real-time community feed
CREATE TABLE chat_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_name  TEXT NOT NULL,
  instagram    TEXT,
  content      TEXT NOT NULL CHECK (char_length(content) <= 500),
  channel      TEXT NOT NULL DEFAULT 'general'
                 CHECK (channel IN ('general', 'the-room', 'inner-room', 'architects')),
  is_pinned    BOOLEAN DEFAULT false,
  pinned_at    TIMESTAMPTZ,
  is_deleted   BOOLEAN DEFAULT false
);

-- Index for fast real-time queries
CREATE INDEX idx_chat_messages_channel_created
  ON chat_messages (channel, created_at DESC);

CREATE INDEX idx_chat_messages_pinned
  ON chat_messages (channel, is_pinned) WHERE is_pinned = true;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Members can read messages in any channel (UI enforces tier gating)
CREATE POLICY "members_read_chat"
  ON chat_messages FOR SELECT TO authenticated
  USING (is_deleted = false);

-- Members can insert their own messages
CREATE POLICY "members_insert_chat"
  ON chat_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Members can soft-delete their own messages
CREATE POLICY "members_delete_own_chat"
  ON chat_messages FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_deleted = true);

-- Admin operations (pin, delete) bypass RLS via service_role key

-- ============================================================================
-- Enable Realtime on chat_messages
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
