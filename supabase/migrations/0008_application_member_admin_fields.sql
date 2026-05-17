-- Admin-managed member dashboard stats.
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS events_attended INTEGER NOT NULL DEFAULT 0
CHECK (events_attended >= 0);
