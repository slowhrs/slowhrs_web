-- Add member RSVP state while preserving existing attendance history.
ALTER TABLE attendances
  ADD COLUMN IF NOT EXISTS status TEXT;

-- Rows that existed before RSVPs represented confirmed attendance.
UPDATE attendances
SET status = 'attended'
WHERE status IS NULL;

ALTER TABLE attendances
  ALTER COLUMN status SET DEFAULT 'intended',
  ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  ALTER TABLE attendances
    ADD CONSTRAINT attendances_status_check
    CHECK (status IN ('intended', 'attended', 'no_show'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE attendances
  ADD COLUMN IF NOT EXISTS rsvpd_at TIMESTAMPTZ;

UPDATE attendances
SET rsvpd_at = marked_at
WHERE rsvpd_at IS NULL
  AND status = 'intended';

CREATE INDEX IF NOT EXISTS idx_attendances_member_status
  ON attendances(member_id, status);

CREATE OR REPLACE FUNCTION recompute_member_hearts(p_member UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE members
  SET hearts = LEAST(5, (
    SELECT COUNT(*)
    FROM attendances
    WHERE member_id = p_member
      AND status = 'attended'
  ))
  WHERE user_id = p_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION on_attendance_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM recompute_member_hearts(NEW.member_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.member_id <> NEW.member_id THEN
      PERFORM recompute_member_hearts(OLD.member_id);
    END IF;
    PERFORM recompute_member_hearts(NEW.member_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM recompute_member_hearts(OLD.member_id);
    RETURN OLD;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trigger_attendance_hearts ON attendances;
CREATE TRIGGER trigger_attendance_hearts
AFTER INSERT OR UPDATE OR DELETE ON attendances
FOR EACH ROW EXECUTE FUNCTION on_attendance_change();
