import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getDropById } from '@/lib/data/drops';
import type { Size } from '@/lib/data/drops';

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for a drop purchase.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const product_id = formData.get('product_id') as string;
    const size = formData.get('size') as Size;
    const stripe_price_id = formData.get('stripe_price_id') as string;

    const drop = getDropById(product_id);
    if (!drop) {
      return NextResponse.redirect(new URL('/?error=product_not_found', req.url));
    }

    if (!drop.available_sizes.includes(size)) {
      return NextResponse.redirect(new URL('/?error=size_unavailable', req.url));
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || !stripe_price_id) {
      console.error('[checkout] Stripe not configured. STRIPE_SECRET_KEY:', Boolean(stripeKey), 'price_id:', stripe_price_id);
      const inquiryUrl = new URL('/', req.url);
      inquiryUrl.hash = `inquiry?subject=order&product=${encodeURIComponent(product_id)}&size=${encodeURIComponent(size)}`;
      return NextResponse.redirect(inquiryUrl);
    }

    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: stripe_price_id,
          quantity: 1,
        },
      ],
      metadata: {
        product_id,
        size,
        drop_title: drop.title,
      },
      success_url: `${req.nextUrl.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/#drops`,
    });

    if (!session.url) {
      throw new Error('Stripe session URL not returned');
    }

    return NextResponse.redirect(session.url);
  } catch (err) {
    console.error('[checkout] error:', err);
    return NextResponse.redirect(new URL('/?error=checkout_failed', req.url));
  }
}
