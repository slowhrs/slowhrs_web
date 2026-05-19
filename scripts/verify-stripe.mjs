#!/usr/bin/env node
/**
 * Headless smoke test for the /drops Stripe checkout speed optimization.
 * - Confirms the size-select handler pre-creates the Stripe session via JSON endpoint.
 * - Confirms click → checkout.stripe.com happens within ~1s (since the session URL is cached).
 */
import puppeteer from "puppeteer";

const URL = "https://slowhrs.com/drops?_t=stripe_verify";

const browser = await puppeteer.launch({ headless: "shell" });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const checkoutRequests = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/checkout")) {
      checkoutRequests.push({
        url: req.url(),
        method: req.method(),
        accept: req.headers().accept,
        ts: Date.now(),
      });
    }
  });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("article.drop-tile", { timeout: 10000 });
  // Give React time to hydrate fully so the size button click is reactive.
  await new Promise((r) => setTimeout(r, 3000));

  const skirtHandle = await page.evaluateHandle(() => {
    const tiles = Array.from(document.querySelectorAll("article.drop-tile"));
    return tiles.find((t) =>
      t.querySelector('button[role="radio"]:not([disabled])')
    );
  });

  if (!skirtHandle.asElement()) {
    throw new Error("No purchasable drop found on /drops");
  }

  const skirt = skirtHandle.asElement();
  await skirt.scrollIntoView();
  await skirt.hover();
  await new Promise((r) => setTimeout(r, 200));

  const sizeButton = await skirt.$('button[role="radio"]:not([disabled])');
  await sizeButton.scrollIntoView();
  // Dispatch a full pointer/mouse/click sequence so React picks it up reliably.
  await sizeButton.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const opts = {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      button: 0,
      buttons: 1,
    };
    el.dispatchEvent(new PointerEvent("pointerdown", opts));
    el.dispatchEvent(new MouseEvent("mousedown", opts));
    el.dispatchEvent(new PointerEvent("pointerup", opts));
    el.dispatchEvent(new MouseEvent("mouseup", opts));
    el.dispatchEvent(new MouseEvent("click", opts));
  });
  await new Promise((r) => setTimeout(r, 600));

  const submitSelector = "form[action='/api/checkout'] button[type='submit']";
  await page.waitForSelector(submitSelector, { timeout: 8000 });

  const prefetched = checkoutRequests.length;
  console.log(`Prefetched /api/checkout requests after size-select: ${prefetched}`);
  if (prefetched < 1) {
    throw new Error("Expected at least one prefetched /api/checkout request before click");
  }

  const submitBtn = await page.$(submitSelector);
  await submitBtn.hover();
  await new Promise((r) => setTimeout(r, 200));

  const clickStart = Date.now();
  const navPromise = page
    .waitForNavigation({ timeout: 15000, waitUntil: "domcontentloaded" })
    .catch(() => null);
  await submitBtn.click();
  await navPromise;
  const elapsed = Date.now() - clickStart;
  const finalUrl = page.url();

  console.log(`Click → checkout.stripe.com navigation: ${elapsed}ms`);
  console.log(`Final URL: ${finalUrl}`);
  console.log(`Total /api/checkout requests: ${checkoutRequests.length}`);
  for (const req of checkoutRequests) {
    console.log(`  ${req.method} ${req.url} (accept=${req.accept ?? "n/a"})`);
  }

  const landedOnStripe = finalUrl.startsWith("https://checkout.stripe.com/");
  if (!landedOnStripe) {
    throw new Error(`Did not land on checkout.stripe.com; got ${finalUrl}`);
  }
  console.log("✅ STRIPE CHECKOUT REACHED");
  if (elapsed < 1500) {
    console.log(`✅ FAST handoff (${elapsed}ms < 1500ms)`);
  } else if (elapsed < 2500) {
    console.log(`⚠ Acceptable handoff (${elapsed}ms < 2500ms)`);
  } else {
    throw new Error(`Handoff too slow: ${elapsed}ms`);
  }
} finally {
  await browser.close();
}
