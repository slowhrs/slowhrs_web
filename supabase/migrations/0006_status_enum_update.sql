-- Update applications.status CHECK constraint to allow new tier convention
-- Existing values 'approved' map to 'tier_02', 'denied' maps to 'rejected'

ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Migrate any existing rows to new convention
UPDATE applications SET status = 'tier_01' WHERE status = 'pending';
UPDATE applications SET status = 'tier_02' WHERE status = 'approved';
UPDATE applications SET status = 'rejected' WHERE status = 'denied';

-- Add new CHECK constraint with tier convention
ALTER TABLE applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('tier_01', 'tier_02', 'tier_03', 'tier_04', 'tier_05', 'rejected'));
