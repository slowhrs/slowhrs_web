'use server';

import Stripe from 'stripe';
import { setAdminCookie, clearAdminCookie, verifyAdminAuth } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendApprovalEmail, sendOrderPaymentLinkEmail, sendRejectionEmail } from '@/lib/resend';
import { getDropById, type Size } from '@/lib/data/drops';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

function parseOrderInquiry(details: string | null) {
  if (!details) return null;

  const productMatch = details.match(/Product:\s*([^,\n]+)/i);
  const sizeMatch = details.match(/Size:\s*([A-Z0-9]+)/i);

  if (!productMatch || !sizeMatch) return null;

  return {
    productId: productMatch[1].trim(),
    size: sizeMatch[1].trim() as Size,
  };
}

function getSiteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export async function sendInquiryPaymentLink(inquiryId: string) {
  if (!await verifyAdminAuth()) {
    return { success: false, error: 'unauthorized' };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { success: false, error: 'Stripe is not configured.' };
  }

  const supabase = createAdminClient();
  const { data: inquiry, error: fetchErr } = await supabase
    .from('inquiries')
    .select('id, name, email, details, status')
    .eq('id', inquiryId)
    .single();

  if (fetchErr || !inquiry) {
    return { success: false, error: 'inquiry not found' };
  }

  const parsed = parseOrderInquiry(inquiry.details);
  if (!parsed) {
    return { success: false, error: 'order details missing product or size' };
  }

  const drop = getDropById(parsed.productId);
  if (!drop) {
    return { success: false, error: 'drop not found' };
  }

  if (!drop.available_sizes.includes(parsed.size)) {
    return { success: false, error: 'requested size is unavailable' };
  }

  const stripe = new Stripe(stripeKey);
  const siteOrigin = getSiteOrigin();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: inquiry.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: drop.price * 100,
            product_data: {
              name: `${drop.title} (${parsed.size})`,
              description: drop.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        inquiry_id: inquiry.id,
        product_id: drop.id,
        size: parsed.size,
        drop_title: drop.title,
      },
      success_url: `${siteOrigin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteOrigin}/#drops`,
    });

    if (!session.url) {
      return { success: false, error: 'Stripe did not return a checkout URL' };
    }

    await sendOrderPaymentLinkEmail({
      to: inquiry.email,
      name: inquiry.name.split(' ')[0]?.toLowerCase() || 'there',
      productTitle: drop.title,
      size: parsed.size,
      checkoutUrl: session.url,
    });

    const { error: updateErr } = await supabase
      .from('inquiries')
      .update({ status: 'replied' })
      .eq('id', inquiryId);

    if (updateErr) {
      console.error('[admin] inquiry status update failed:', updateErr);
    }

    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (err) {
    console.error('[admin] payment link send failed:', err);
    return { success: false, error: 'failed to send payment link' };
  }
}

export async function sendInquiryPaymentLinkForm(formData: FormData) {
  const inquiryId = formData.get('inquiryId');
  if (typeof inquiryId !== 'string' || inquiryId.length === 0) {
    console.error('[admin] missing inquiry id for payment link');
    return;
  }

  const result = await sendInquiryPaymentLink(inquiryId);
  if (!result.success) {
    console.error('[admin] payment link action failed:', result.error);
  }
}
