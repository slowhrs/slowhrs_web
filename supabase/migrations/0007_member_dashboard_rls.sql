-- Approved members can read their own application row for dashboard display.
DROP POLICY IF EXISTS "members_read_own_application" ON applications;
CREATE POLICY "members_read_own_application" ON applications
FOR SELECT TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND status IN ('tier_02', 'tier_03', 'tier_04', 'tier_05')
);
