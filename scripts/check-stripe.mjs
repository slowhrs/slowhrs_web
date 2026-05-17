import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dropsPath = path.join(repoRoot, 'src/lib/data/drops.ts');

function loadLocalEnv() {
  for (const name of ['.env.local', '.env.production', '.env']) {
    const filePath = path.join(repoRoot, name);
    if (!fs.existsSync(filePath)) continue;

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
    }
  }
}

loadLocalEnv();

const source = fs.readFileSync(dropsPath, 'utf8');

function lineFor(index) {
  return source.slice(0, index).split('\n').length;
}

function parseDrops() {
  const dropsStart = source.indexOf('export const DROPS');
  if (dropsStart === -1) {
    throw new Error('Could not find DROPS export in src/lib/data/drops.ts');
  }

  const entries = [];
  const entryRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?price:\s*(\d+)[\s\S]*?stripe_price_id:\s*(null|'([^']+)')/g;
  let match;
  while ((match = entryRegex.exec(source.slice(dropsStart)))) {
    const absoluteIndex = dropsStart + match.index;
    entries.push({
      id: match[1],
      price: Number(match[2]),
      stripePriceId: match[4] ?? null,
      line: lineFor(absoluteIndex),
    });
  }

  return entries;
}

const drops = parseDrops();
const configured = drops.filter((drop) => drop.stripePriceId);
const missing = drops.filter((drop) => !drop.stripePriceId);

if (drops.length === 0) {
  console.error('No drops found in src/lib/data/drops.ts');
  process.exit(1);
}

if (missing.length > 0) {
  for (const drop of missing) {
    console.error(`${path.relative(repoRoot, dropsPath)}:${drop.line} ${drop.id} missing stripe_price_id`);
  }
}

if (configured.length === 0) {
  console.error('No Stripe Price IDs configured. Add live price_... IDs to src/lib/data/drops.ts first.');
  process.exit(1);
}

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('STRIPE_SECRET_KEY is not set. Export it locally before running this script.');
  process.exit(1);
}

const stripe = new Stripe(stripeKey);
const failures = [];

for (const drop of configured) {
  try {
    const price = await stripe.prices.retrieve(drop.stripePriceId);
    const expectedAmount = drop.price * 100;

    if (price.unit_amount !== expectedAmount || price.currency !== 'usd') {
      failures.push(
        `${path.relative(repoRoot, dropsPath)}:${drop.line} ${drop.id} expected ${expectedAmount} usd, got ${price.unit_amount} ${price.currency}`
      );
      continue;
    }

    console.log(`valid ${drop.id}: ${drop.stripePriceId} = $${drop.price}`);
  } catch (error) {
    failures.push(
      `${path.relative(repoRoot, dropsPath)}:${drop.line} ${drop.id} could not retrieve ${drop.stripePriceId}: ${error.message}`
    );
  }
}

if (missing.length > 0) {
  failures.push(`${missing.length} drops still have null stripe_price_id`);
}

if (failures.length > 0) {
  console.error('\nStripe validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nAll ${configured.length} configured Stripe prices are valid.`);
