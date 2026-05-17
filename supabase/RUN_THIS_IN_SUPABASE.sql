-- ============================================================
-- SLOWHRS FULL DATABASE SETUP
-- Paste this ENTIRE block into Supabase SQL Editor and hit RUN
-- Consolidated from migrations 0001, 0003, 0004, 0005, and 0006
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- APPLICATION MEMBER ID SEQUENCE
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS member_id_seq START 1;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  instagram TEXT,
  city TEXT DEFAULT 'Los Angeles',
  what_you_do TEXT,
  why_apply TEXT,
  member_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'tier_01'
    CHECK (status IN ('tier_01','tier_02','tier_03','tier_04','tier_05','rejected')),
  reviewed_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS members (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id),
  full_name TEXT NOT NULL,
  instagram TEXT,
  city TEXT,
  member_number INTEGER GENERATED ALWAYS AS IDENTITY,
  hearts INTEGER DEFAULT 0,
  is_contributor BOOLEAN DEFAULT false,
  is_architect BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  blurb TEXT,
  partiful_url TEXT UNIQUE,
  cover_image TEXT,
  cover_video TEXT,
  produced_by_slowhrs BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  is_upcoming BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(user_id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, event_id)
);

CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_tier TEXT NOT NULL
    CHECK (recipient_tier IN ('all','room+','regular+','inner+','architects')),
  sent_at TIMESTAMPTZ,
  sent_count INTEGER
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT,
  details TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','replied','closed'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  instagram TEXT,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  channel TEXT NOT NULL DEFAULT 'general'
    CHECK (channel IN ('general','the-room','inner-room','architects')),
  is_pinned BOOLEAN DEFAULT false,
  pinned_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  product_title TEXT,
  size TEXT NOT NULL,
  customer_email TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'paid'
    CHECK (status IN ('paid', 'shipped', 'refunded', 'cancelled')),
  shipped_at TIMESTAMPTZ,
  tracking_number TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- ============================================================
-- APPLICATION MEMBER ID TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.member_id IS NULL THEN
    NEW.member_id := 'SH-' || LPAD(nextval('member_id_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_member_id_trigger ON applications;
CREATE TRIGGER assign_member_id_trigger
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION generate_member_id();

-- Keep existing installs aligned with the tier status convention.
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
UPDATE applications SET status = 'tier_01' WHERE status = 'pending';
UPDATE applications SET status = 'tier_02' WHERE status = 'approved';
UPDATE applications SET status = 'rejected' WHERE status = 'denied';
ALTER TABLE applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('tier_01','tier_02','tier_03','tier_04','tier_05','rejected'));

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- ============================================================
-- CHAT INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_created
  ON chat_messages (channel, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_pinned
  ON chat_messages (channel, is_pinned) WHERE is_pinned = true;

-- ============================================================
-- HEARTS TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION recompute_member_hearts(p_member UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE members SET hearts = LEAST(5, (
    SELECT COUNT(*) FROM attendances WHERE member_id = p_member
  )) WHERE user_id = p_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION on_attendance_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM recompute_member_hearts(NEW.member_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM recompute_member_hearts(OLD.member_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_attendance_hearts ON attendances;
CREATE TRIGGER trigger_attendance_hearts
AFTER INSERT OR DELETE ON attendances
FOR EACH ROW EXECUTE FUNCTION on_attendance_change();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================

DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications"
  ON applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries"
  ON inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_public_events" ON events;
CREATE POLICY "public_read_public_events"
  ON events FOR SELECT TO anon, authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "member_read_own" ON members;
CREATE POLICY "member_read_own"
  ON members FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "member_read_own_attendances" ON attendances;
CREATE POLICY "member_read_own_attendances"
  ON attendances FOR SELECT TO authenticated
  USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "members_read_chat" ON chat_messages;
CREATE POLICY "members_read_chat"
  ON chat_messages FOR SELECT TO authenticated
  USING (is_deleted = false);

DROP POLICY IF EXISTS "members_insert_chat" ON chat_messages;
CREATE POLICY "members_insert_chat"
  ON chat_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "members_delete_own_chat" ON chat_messages;
CREATE POLICY "members_delete_own_chat"
  ON chat_messages FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_deleted = true);

DROP POLICY IF EXISTS "public_read_inventory" ON inventory;
CREATE POLICY "public_read_inventory"
  ON inventory FOR SELECT TO anon, authenticated
  USING (true);

-- orders intentionally has no public policies. Webhooks and admin flows use service_role.

-- ============================================================
-- REALTIME
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END $$;

-- ============================================================
-- DONE. Fresh setup includes tier statuses, member ids, chat, orders, inventory, RLS, and realtime.
-- ============================================================
