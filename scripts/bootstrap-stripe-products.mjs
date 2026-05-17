import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dropsPath = path.join(repoRoot, 'src/lib/data/drops.ts');
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('STRIPE_SECRET_KEY is not set. Export it locally; do not paste it into chat or commit it.');
  process.exit(1);
}

const stripe = new Stripe(stripeKey);
const source = fs.readFileSync(dropsPath, 'utf8');

function parseStringField(block, field) {
  return block.match(new RegExp(`${field}:\\s*'([^']+)'`))?.[1] ?? '';
}

function parseNumberField(block, field) {
  const value = block.match(new RegExp(`${field}:\\s*(\\d+)`))?.[1];
  return value ? Number(value) : 0;
}

function parseDrops() {
  const entries = [];
  const entryRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?stripe_price_id:\s*(?:null|'[^']+'),\s*\}/g;
  let match;
  while ((match = entryRegex.exec(source))) {
    const block = match[0];
    entries.push({
      id: match[1],
      title: parseStringField(block, 'title'),
      description: parseStringField(block, 'description'),
      price: parseNumberField(block, 'price'),
    });
  }
  return entries;
}

async function findProduct(drop) {
  const products = await stripe.products.search({
    query: `metadata['slowhrs_drop_id']:'${drop.id}'`,
    limit: 1,
  });
  return products.data[0] ?? null;
}

async function ensureProduct(drop) {
  const existing = await findProduct(drop);
  if (existing) {
    return existing;
  }

  return stripe.products.create({
    name: drop.title,
    description: drop.description,
    metadata: {
      slowhrs_drop_id: drop.id,
    },
  });
}

async function ensurePrice(drop, product) {
  const expectedAmount = drop.price * 100;
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 100,
  });

  const existing = prices.data.find(
    (price) =>
      price.currency === 'usd' &&
      price.unit_amount === expectedAmount &&
      price.type === 'one_time'
  );

  if (existing) {
    return existing;
  }

  return stripe.prices.create({
    product: product.id,
    currency: 'usd',
    unit_amount: expectedAmount,
    metadata: {
      slowhrs_drop_id: drop.id,
    },
  });
}

function writePriceIds(priceIdsByDropId) {
  let nextSource = source;

  for (const [dropId, priceId] of priceIdsByDropId.entries()) {
    const blockRegex = new RegExp(
      `(\\{\\s*id:\\s*'${dropId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?stripe_price_id:\\s*)(null|'[^']+')`,
      'm'
    );
    nextSource = nextSource.replace(blockRegex, `$1'${priceId}'`);
  }

  fs.writeFileSync(dropsPath, nextSource);
}

const drops = parseDrops();
if (drops.length === 0) {
  console.error('No drops found in src/lib/data/drops.ts');
  process.exit(1);
}

const priceIdsByDropId = new Map();

for (const drop of drops) {
  const product = await ensureProduct(drop);
  const price = await ensurePrice(drop, product);
  priceIdsByDropId.set(drop.id, price.id);
  console.log(`${drop.id}: ${price.id} ($${drop.price})`);
}

writePriceIds(priceIdsByDropId);
console.log(`\nWired ${priceIdsByDropId.size} Stripe Price IDs into src/lib/data/drops.ts.`);
