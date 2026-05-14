'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendDenial } from '@/lib/resend';
import { revalidatePath } from 'next/cache';
import { verifyAdminAction } from '@/lib/auth';

export async function approveApplication(applicationId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();

  // Get application
  const { data: app, error: fetchErr } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (fetchErr || !app) throw new Error('Application not found');

  // Invite user via Supabase Auth (sends magic link)
  const { data: authData, error: authErr } = await supabase.auth.admin.inviteUserByEmail(app.email);
  if (authErr) throw new Error(`Auth invite failed: ${authErr.message}`);

  const userId = authData.user.id;

  // Create member row
  await supabase.from('members').insert({
    user_id: userId,
    application_id: app.id,
    full_name: app.full_name,
    instagram: app.instagram,
    city: app.city,
  });

  // Update application
  await supabase
    .from('applications')
    .update({ status: 'approved', reviewed_at: new Date().toISOString(), user_id: userId })
    .eq('id', applicationId);

  revalidatePath('/admin/applications');
  revalidatePath('/admin/members');
  return { success: true };
}

export async function denyApplication(applicationId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();

  const { data: app } = await supabase
    .from('applications')
    .select('full_name, email')
    .eq('id', applicationId)
    .single();

  if (!app) throw new Error('Application not found');

  await supabase
    .from('applications')
    .update({ status: 'denied', reviewed_at: new Date().toISOString() })
    .eq('id', applicationId);

  // Send denial email
  await sendDenial(app.email, app.full_name.split(' ')[0].toLowerCase());

  revalidatePath('/admin/applications');
  return { success: true };
}
