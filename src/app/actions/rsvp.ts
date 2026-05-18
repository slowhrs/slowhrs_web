'use server';

import { revalidatePath } from 'next/cache';
import { requireMember } from '@/lib/auth/member';
import { createAdminClient } from '@/lib/supabase/admin';

type RsvpResult = {
  success: boolean;
  error?: string;
};

export async function rsvpToEvent(formData: FormData): Promise<RsvpResult> {
  const eventId = formData.get('event_id');
  if (typeof eventId !== 'string' || eventId.length === 0) {
    return { success: false, error: 'missing signal.' };
  }

  const member = await requireMember();
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from('attendances').upsert(
    {
      member_id: member.user_id,
      event_id: eventId,
      status: 'intended',
      rsvpd_at: now,
    },
    { onConflict: 'member_id,event_id' }
  );

  if (error) {
    console.error('[rsvp] upsert failed:', error);
    return {
      success: false,
      error: 'rsvp ledger is not ready yet. try again later.',
    };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function rsvpToEventForm(formData: FormData) {
  const result = await rsvpToEvent(formData);
  if (!result.success) {
    console.error('[rsvp] form action failed:', result.error);
  }
}
