'use server';

import { setAdminCookie, clearAdminCookie, verifyAdminAuth } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/resend';
import { redirect } from 'next/navigation';

export async function adminLogin(formData: FormData) {
  const password = formData.get('password') as string;
  const adminSecret = process.env.ADMIN_PASSWORD || 'default_insecure_secret_do_not_use_in_prod';
  
  if (password === adminSecret) {
    await setAdminCookie();
    redirect('/admin');
  } else {
    return { success: false, error: 'invalid password' };
  }
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect('/admin/login');
}

export async function reviewApplication(id: string, newStatus: 'tier_02' | 'rejected') {
  if (!await verifyAdminAuth()) {
    return { success: false, error: 'unauthorized' };
  }

  const supabase = createAdminClient();

  // Get application email & name to send notification
  const { data: application, error: fetchErr } = await supabase
    .from('applications')
    .select('email, full_name, status')
    .eq('id', id)
    .single();

  if (fetchErr || !application) {
    return { success: false, error: 'application not found' };
  }

  if (application.status !== 'tier_01') {
    return { success: false, error: `application already reviewed (status: ${application.status})` };
  }

  // Update status
  const { error: updateErr } = await supabase
    .from('applications')
    .update({ 
      status: newStatus,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id);

  if (updateErr) {
    console.error('[admin] update failed:', updateErr);
    return { success: false, error: 'database update failed' };
  }

  // Send email based on status
  const firstName = application.full_name.split(' ')[0].toLowerCase();
  
  try {
    if (newStatus === 'tier_02') {
      await sendApprovalEmail(application.email, firstName);
    } else if (newStatus === 'rejected') {
      await sendRejectionEmail(application.email, firstName);
    }
  } catch (err) {
    console.error('[admin] email send failed:', err);
    // don't fail the action if email fails
  }

  return { success: true };
}
