-- ============================================================================
-- SLOWHRS v2.0-stocked — Orders + Inventory
-- ============================================================================

-- ORDERS — written by Stripe webhook, read by admin
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  product_id       TEXT NOT NULL,
  product_title    TEXT,
  size             TEXT NOT NULL,
  customer_email   TEXT,
  amount_cents     INTEGER NOT NULL DEFAULT 0,
  currency         TEXT NOT NULL DEFAULT 'usd',
  status           TEXT NOT NULL DEFAULT 'paid'
                     CHECK (status IN ('paid', 'shipped', 'refunded', 'cancelled')),
  shipped_at       TIMESTAMPTZ,
  tracking_number  TEXT,
  notes            TEXT
);

-- RLS: service role only (webhook writes, admin reads)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- No public policies = only service_role can access

-- ============================================================================
-- INVENTORY — optional real-time stock tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS inventory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  TEXT NOT NULL,
  size        TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Public can read inventory (to show real-time stock on frontend)
CREATE POLICY "public_read_inventory"
  ON inventory FOR SELECT TO anon, authenticated
  USING (true);
