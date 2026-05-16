-- 0005_member_id_sequence.sql

-- 1. Create the sequence
CREATE SEQUENCE IF NOT EXISTS member_id_seq START 1;

-- 2. Add the column (nullable temporarily for backfill)
ALTER TABLE applications ADD COLUMN member_id text;

-- 3. Create function to generate SH-XXXXX ID
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.member_id IS NULL THEN
    NEW.member_id := 'SH-' || LPAD(nextval('member_id_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to auto-assign on insert
CREATE TRIGGER assign_member_id_trigger
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION generate_member_id();

-- 5. Backfill existing applications if any
UPDATE applications
SET member_id = 'SH-' || LPAD(nextval('member_id_seq')::text, 5, '0')
WHERE member_id IS NULL;

-- 6. Make member_id NOT NULL and UNIQUE
ALTER TABLE applications ALTER COLUMN member_id SET NOT NULL;
ALTER TABLE applications ADD CONSTRAINT applications_member_id_key UNIQUE (member_id);

-- 7. Default status to tier_01
ALTER TABLE applications ALTER COLUMN status SET DEFAULT 'tier_01';

-- 8. Add useful indexes for the admin panel
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
