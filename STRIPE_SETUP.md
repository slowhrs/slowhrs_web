# Stripe Setup — SLOWHRS

## 1. Create Stripe Account

If you don't have one: [dashboard.stripe.com/register](https://dashboard.stripe.com/register)

## 2. Create Products

In Stripe Dashboard → Products, create one product per garment:

| Product Name | Price | Notes |
|---|---|---|
| SPIDER HOODIE | $100.00 | Currently sold out — create anyway for archive |
| FRONT HOODIE | $50.00 | Currently sold out |
| CROP HOODIE | $40.00 | Currently sold out |
| FAST LIFE SKIRT | $50.00 | **2 LEFT — active** |
| FLARE PANTS | $50.00 | Currently sold out |
| FAST LIFE PANTS | $50.00 | Currently sold out |
| FAST LIFE PANT 002 | $50.00 | Currently sold out |
| FAST LIFE TEE | $20.00 | Currently sold out |
| FAST LIFE SHORTS | $30.00 | Currently sold out |

For each product:
1. Set price as **one-time** payment
2. Copy the **Price ID** (starts with `price_`)
3. Paste it into `src/lib/data/drops.ts` in the `stripe_price_id` field

## 3. Set Up Webhook

1. Go to Developers → Webhooks
2. Add endpoint: `https://slowhrs.com/api/webhook/stripe`
3. Select event: `checkout.session.completed`
4. Copy the **Webhook Signing Secret** (starts with `whsec_`)

## 4. Get API Keys

Go to Developers → API Keys:
- Copy **Publishable key** (starts with `pk_live_` or `pk_test_`)
- Copy **Secret key** (starts with `sk_live_` or `sk_test_`)

## 5. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

Also add to `.env.local` for local development (use test keys):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 6. Test Locally

Use Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Test card: `4242 4242 4242 4242` (any future expiry, any CVC)

## 7. Before Going Live

- [ ] Replace test keys with live keys in Vercel
- [ ] Verify webhook endpoint is receiving events
- [ ] Place a test order and check Supabase `orders` table
- [ ] Verify order notification email arrives

## Fallback Behavior

Until Stripe is configured, the "SECURE PIECE" button shows "MESSAGE TO ORDER" and routes to the inquiry form with product context pre-filled. No checkout will fail silently.
