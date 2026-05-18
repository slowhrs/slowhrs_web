-- Supabase advisor hardening: fixed search paths, restricted helper execution, and FK indexes.
ALTER FUNCTION public.generate_member_id() SET search_path = public, pg_temp;
ALTER FUNCTION public.on_attendance_change() SET search_path = public, pg_temp;
ALTER FUNCTION public.recompute_member_hearts(uuid) SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.recompute_member_hearts(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_member_hearts(uuid) FROM PUBLIC;

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_attendances_event_id ON attendances(event_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
