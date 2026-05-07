-- ============================================================================
-- SLOWHRS v2.0 schema
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- APPLICATIONS — anyone can submit, only admin reads
CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  email        TEXT NOT NULL UNIQUE,
  full_name    TEXT NOT NULL,
  instagram    TEXT,
  city         TEXT DEFAULT 'Los Angeles',
  what_you_do  TEXT,
  why_apply    TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_at  TIMESTAMPTZ,
  user_id      UUID REFERENCES auth.users(id)
);

-- MEMBERS — created on application approval
CREATE TABLE members (
  user_id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id   UUID REFERENCES applications(id),
  full_name        TEXT NOT NULL,
  instagram        TEXT,
  city             TEXT,
  member_number    INTEGER GENERATED ALWAYS AS IDENTITY,
  hearts           INTEGER DEFAULT 0,
  is_contributor   BOOLEAN DEFAULT false,
  is_architect     BOOLEAN DEFAULT false,
  joined_at        TIMESTAMPTZ DEFAULT NOW()
);

-- EVENTS — public read; admin creates by pasting Partiful URL (auto-fetched)
CREATE TABLE events (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  name                 TEXT NOT NULL,
  date                 TIMESTAMPTZ NOT NULL,
  location             TEXT,
  blurb                TEXT,
  partiful_url         TEXT UNIQUE,
  cover_image          TEXT,
  cover_video          TEXT,
  produced_by_slowhrs  BOOLEAN DEFAULT true,
  is_public            BOOLEAN DEFAULT true,
  is_upcoming          BOOLEAN GENERATED ALWAYS AS (date > NOW()) STORED
);

-- ATTENDANCES — admin marks members attended an event
CREATE TABLE attendances (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   UUID NOT NULL REFERENCES members(user_id) ON DELETE CASCADE,
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  marked_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, event_id)
);

-- BROADCASTS — admin composes, sent via Resend
CREATE TABLE broadcasts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  subject         TEXT NOT NULL,
  body            TEXT NOT NULL,
  recipient_tier  TEXT NOT NULL
                    CHECK (recipient_tier IN ('all', 'room+', 'regular+', 'inner+', 'architects')),
  sent_at         TIMESTAMPTZ,
  sent_count      INTEGER
);

-- INQUIRIES — public submits via /inquire form
CREATE TABLE inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  category     TEXT NOT NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  instagram    TEXT,
  details      TEXT,
  status       TEXT DEFAULT 'new'
                 CHECK (status IN ('new', 'replied', 'closed'))
);

-- HEARTS TRIGGER — recompute on attendance insert/delete, capped at 5
CREATE OR REPLACE FUNCTION recompute_member_hearts(p_member UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE members
  SET hearts = LEAST(5, (
    SELECT COUNT(*) FROM attendances WHERE member_id = p_member
  ))
  WHERE user_id = p_member;
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

CREATE TRIGGER trigger_attendance_hearts
AFTER INSERT OR DELETE ON attendances
FOR EACH ROW EXECUTE FUNCTION on_attendance_change();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances  ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries    ENABLE ROW LEVEL SECURITY;

-- Public can submit applications (insert only)
CREATE POLICY "anon_insert_applications"
  ON applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Public can submit inquiries (insert only)
CREATE POLICY "anon_insert_inquiries"
  ON inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Public can read public events
CREATE POLICY "public_read_public_events"
  ON events FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- Members can read their own member row
CREATE POLICY "member_read_own"
  ON members FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Members can read their own attendances
CREATE POLICY "member_read_own_attendances"
  ON attendances FOR SELECT TO authenticated
  USING (auth.uid() = member_id);

-- All admin/write operations bypass RLS via SUPABASE_SERVICE_ROLE_KEY
-- in server-only code. NEVER expose service_role to the client.
