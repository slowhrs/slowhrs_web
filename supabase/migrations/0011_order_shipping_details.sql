-- Persist Stripe Checkout shipping details for merch fulfillment.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_phone TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address JSONB;

