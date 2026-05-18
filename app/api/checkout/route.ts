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

function getCheckoutOrigin(req: NextRequest) {
  const configuredOrigin = normalizeProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configuredOrigin) return configuredOrigin;

  const requestOrigin = normalizeProductionOrigin(req.nextUrl.origin);
  if (requestOrigin) return requestOrigin;

  return 'https://slowhrs.com';
}

function normalizeProductionOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function isMissingStripePriceError(error: unknown) {
  if (!error || typeof error !== 'object') return false;

  const stripeError = error as { code?: string; param?: string; message?: string; type?: string };
  return (
    stripeError.code === 'resource_missing' ||
    stripeError.param === 'line_items[0][price]' ||
    /no such price|price.*does not exist|similar object exists in test mode|similar object exists in live mode/i.test(
      stripeError.message ?? ''
    )
  );
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
    if (!stripeKey) {
      return checkoutNotConfigured(req, product_id, size);
    }

    const stripe = new Stripe(stripeKey);
    const origin = getCheckoutOrigin(req);
    const baseSessionParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        product_id,
        size,
        drop_title: drop.title,
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#drops`,
    } satisfies Stripe.Checkout.SessionCreateParams;

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        ...baseSessionParams,
        line_items: [
          drop.stripe_price_id
            ? {
                price: drop.stripe_price_id,
                quantity: 1,
              }
            : {
                price_data: {
                  currency: 'usd',
                  unit_amount: drop.price * 100,
                  product_data: {
                    name: `${drop.title} (${size})`,
                    description: drop.description,
                  },
                },
                quantity: 1,
              },
        ],
      });
    } catch (error) {
      if (!drop.stripe_price_id || !isMissingStripePriceError(error)) {
        throw error;
      }

      console.error('[checkout] configured Stripe price failed, retrying with inline price_data', {
        product_id,
        size,
        stripe_price_id: drop.stripe_price_id,
      });

      session = await stripe.checkout.sessions.create({
        ...baseSessionParams,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: drop.price * 100,
              product_data: {
                name: `${drop.title} (${size})`,
                description: drop.description,
              },
            },
            quantity: 1,
          },
        ],
      });
    }

    if (!session.url) {
      throw new Error('Stripe session URL not returned');
    }

    return NextResponse.redirect(session.url);
  } catch (err) {
    console.error('[checkout] error:', err);
    return checkoutError(req, 500, 'checkout_failed', 'checkout failed');
  }
}
