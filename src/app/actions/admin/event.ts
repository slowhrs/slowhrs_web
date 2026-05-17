'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { fetchPartifulEvent } from '@/lib/partiful';
import { revalidatePath } from 'next/cache';
import { verifyAdminAction } from '@/lib/admin-auth';

export async function importPartifulEvent(url: string) {
  await verifyAdminAction();
  const parsed = await fetchPartifulEvent(url);
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('events')
    .insert({
      name: parsed.name,
      blurb: parsed.blurb,
      cover_image: parsed.cover_image,
      date: parsed.date ?? new Date().toISOString(),
      location: parsed.location,
      partiful_url: url,
      produced_by_slowhrs: true,
      is_public: true,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath('/events');
  revalidatePath('/admin/events');
  return data;
}

export async function createEvent(formData: FormData) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  const { error } = await supabase.from('events').insert({
    name: formData.get('name') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string || null,
    blurb: formData.get('blurb') as string || null,
    cover_video: formData.get('cover_video') as string || null,
    partiful_url: formData.get('partiful_url') as string || null,
    produced_by_slowhrs: formData.get('produced_by_slowhrs') === 'true',
    is_public: true,
  });
  if (error) throw error;
  revalidatePath('/events');
  revalidatePath('/admin/events');
  return { success: true };
}

export async function deleteEvent(eventId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase.from('events').delete().eq('id', eventId);
  revalidatePath('/events');
  revalidatePath('/admin/events');
  return { success: true };
}
