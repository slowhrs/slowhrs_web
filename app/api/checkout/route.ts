import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { ALL_SIZES, getDropById } from '@/lib/data/drops';
import type { Size } from '@/lib/data/drops';

const MIN_CHECKOUT_QUANTITY = 1;
const MAX_CHECKOUT_QUANTITY = 2;

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

function normalizeStripeSecretKey(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  const assignmentMatch = trimmed.match(/^STRIPE_SECRET_KEY\s*=\s*(['"]?)(.+?)\1$/);

  return assignmentMatch ? assignmentMatch[2].trim() : trimmed;
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

function parseCheckoutQuantity(value: FormDataEntryValue | null): number | null {
  if (value === null) return MIN_CHECKOUT_QUANTITY;
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return MIN_CHECKOUT_QUANTITY;

  const quantity = Number(trimmed);
  if (!Number.isInteger(quantity)) return null;
  if (quantity < MIN_CHECKOUT_QUANTITY || quantity > MAX_CHECKOUT_QUANTITY) return null;

  return quantity;
}

function checkoutUnavailable(
  req: NextRequest,
  code: string,
  message: string,
  productId: string,
  size: string
) {
  if (wantsJson(req)) {
    return NextResponse.json({ error: code, message }, { status: 503 });
  }

  const inquiryUrl = new URL('/', req.url);
  inquiryUrl.hash = `inquiry?subject=order&product=${encodeURIComponent(productId)}&size=${encodeURIComponent(size)}`;
  return NextResponse.redirect(inquiryUrl);
}

function stripeCheckoutError(req: NextRequest, error: unknown, productId?: string, size?: string) {
  if (!error || typeof error !== 'object') {
    return checkoutError(req, 500, 'checkout_failed', 'checkout failed');
  }

  const stripeError = error as { code?: string; message?: string; statusCode?: number; type?: string };
  const message = stripeError.message ?? '';

  if (
    stripeError.type === 'StripeAuthenticationError' ||
    stripeError.statusCode === 401 ||
    /invalid api key|expired api key|no api key/i.test(message)
  ) {
    console.error('[checkout] Stripe authentication failed. Check STRIPE_SECRET_KEY in Vercel.');
    if (productId && size) {
      return checkoutUnavailable(
        req,
        'stripe_auth_failed',
        'Stripe checkout is not configured correctly.',
        productId,
        size
      );
    }

    return checkoutError(req, 503, 'stripe_auth_failed', 'Stripe checkout is not configured correctly.');
  }

  if (
    stripeError.type === 'StripePermissionError' ||
    stripeError.statusCode === 403 ||
    /permission|not authorized|restricted api key/i.test(message)
  ) {
    console.error('[checkout] Stripe permission failed. Check STRIPE_SECRET_KEY permissions in Vercel.');
    if (productId && size) {
      return checkoutUnavailable(
        req,
        'stripe_permission_failed',
        'Stripe checkout is missing permission.',
        productId,
        size
      );
    }

    return checkoutError(req, 503, 'stripe_permission_failed', 'Stripe checkout is missing permission.');
  }

  if (/account.*not.*activated|charges.*disabled|not currently able to make live charges/i.test(message)) {
    console.error('[checkout] Stripe account cannot create live charges yet.');
    if (productId && size) {
      return checkoutUnavailable(
        req,
        'stripe_account_inactive',
        'Stripe account is not ready for live checkout.',
        productId,
        size
      );
    }

    return checkoutError(req, 503, 'stripe_account_inactive', 'Stripe account is not ready for live checkout.');
  }

  console.error('[checkout] error:', error);
  return checkoutError(req, 500, 'checkout_failed', 'checkout failed');
}

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for a drop purchase.
 */
export async function POST(req: NextRequest) {
  let submittedProductId: string | undefined;
  let submittedSize: string | undefined;

  try {
    const formData = await req.formData();
    const product_id = formData.get('product_id') as string;
    const size = formData.get('size') as Size;
    const quantity = parseCheckoutQuantity(formData.get('quantity'));
    submittedProductId = product_id;
    submittedSize = size;

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

    if (!quantity) {
      return checkoutError(req, 400, 'invalid_quantity', 'invalid quantity');
    }

    const stripeKey = normalizeStripeSecretKey(process.env.STRIPE_SECRET_KEY);
    if (!stripeKey) {
      return checkoutNotConfigured(req, product_id, size);
    }

    const stripe = new Stripe(stripeKey);
    const origin = getCheckoutOrigin(req);
    const baseSessionParams = {
      mode: 'payment',
      metadata: {
        product_id,
        size,
        quantity: String(quantity),
        drop_title: drop.title,
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#drops`,
    } satisfies Stripe.Checkout.SessionCreateParams;
    const quantityParams = {
      quantity,
      adjustable_quantity: {
        enabled: true,
        minimum: MIN_CHECKOUT_QUANTITY,
        maximum: MAX_CHECKOUT_QUANTITY,
      },
    };

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        ...baseSessionParams,
        line_items: [
          drop.stripe_price_id
            ? {
                price: drop.stripe_price_id,
                ...quantityParams,
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
                ...quantityParams,
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
            ...quantityParams,
          },
        ],
      });
    }

    if (!session.url) {
      throw new Error('Stripe session URL not returned');
    }

    return NextResponse.redirect(session.url);
  } catch (err) {
    return stripeCheckoutError(req, err, submittedProductId, submittedSize);
  }
}
