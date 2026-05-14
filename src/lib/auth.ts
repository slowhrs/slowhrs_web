import { cookies } from 'next/headers';

export async function verifyAdminAction() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('slowhrs_admin');

  if (!adminCookie || adminCookie.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }

  return true;
}
