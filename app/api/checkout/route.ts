import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { ALL_SIZES, getDropById } from '@/lib/data/drops';
import type { Size } from '@/lib/data/drops';

function wantsJson(req: NextRequest) {
  return req.headers.get('accept')?.includes('application/json');
}

function checkoutError(req: NextRequest, status: number, code: string, message: string) {
  if (wantsJson(req)) {
    return NextResponse.json({ error: code, message }, { status });
  }

  const url = new URL('/', req.url);
  url.searchParams.set('error', code);
  return NextResponse.redirect(url);
}

function checkoutNotConfigured(req: NextRequest, productId: string, size: string) {
  console.error('[checkout] checkout not configured', { product_id: productId, size });

  if (wantsJson(req)) {
    return NextResponse.json(
      { error: 'checkout_not_configured', message: 'checkout not configured' },
      { status: 503 }
    );
  }

  const inquiryUrl = new URL('/', req.url);
  inquiryUrl.hash = `inquiry?subject=order&product=${encodeURIComponent(productId)}&size=${encodeURIComponent(size)}`;
  return NextResponse.redirect(inquiryUrl);
}

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for a drop purchase.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const product_id = formData.get('product_id') as string;
    const size = formData.get('size') as Size;

    const drop = getDropById(product_id);
    if (!drop) {
      return checkoutError(req, 404, 'product_not_found', 'product not found');
    }

    if (!ALL_SIZES.includes(size)) {
      return checkoutError(req, 400, 'invalid_size', 'invalid size');
    }

    if (drop.sold_out_sizes.includes(size)) {
      return checkoutError(req, 400, 'size_sold_out', 'size sold out');
    }

    if (!drop.available_sizes.includes(size)) {
      return checkoutError(req, 400, 'size_unavailable', 'size unavailable');
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || !drop.stripe_price_id) {
      return checkoutNotConfigured(req, product_id, size);
    }

    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: drop.stripe_price_id,
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
    return checkoutError(req, 500, 'checkout_failed', 'checkout failed');
  }
}
