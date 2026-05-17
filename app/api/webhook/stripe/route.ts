import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/webhook/stripe
 * Handles Stripe webhook events for completed checkouts.
 */
export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('[stripe-webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { product_id, size, drop_title } = session.metadata || {};

    console.log('[stripe-webhook] checkout completed:', {
      session_id: session.id,
      product_id,
      size,
      customer_email: session.customer_details?.email,
      amount: session.amount_total,
    });

    try {
      const supabase = createAdminClient();
      const { error: dbError } = await supabase.from('orders').insert({
        stripe_session_id: session.id,
        product_id,
        size,
        product_title: drop_title,
        customer_email: session.customer_details?.email || null,
        amount_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'paid',
      });

      if (dbError) {
        console.error('[stripe-webhook] failed to write order:', JSON.stringify(dbError));
      }
    } catch (dbErr) {
      console.error('[stripe-webhook] supabase error:', dbErr);
    }

    try {
      const { sendOrderNotification } = await import('@/lib/resend');
      await sendOrderNotification({
        productTitle: drop_title || product_id || 'unknown',
        size: size || 'unknown',
        customerEmail: session.customer_details?.email || 'unknown',
        amount: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'unknown',
      });
    } catch (emailErr) {
      console.error('[stripe-webhook] notification email failed:', emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
