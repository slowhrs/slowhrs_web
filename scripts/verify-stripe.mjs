#!/usr/bin/env node
import puppeteer from "puppeteer";

const URL = "https://slowhrs.com/drops?_t=stripe_verify";

const browser = await puppeteer.launch({ headless: "shell" });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("article.drop-tile", { timeout: 10000 });

  console.log("Looking for the only purchasable drop (fast life skirt)...");

  // Find the skirt tile (the only one with an enabled size).
  const skirtHandle = await page.evaluateHandle(() => {
    const tiles = Array.from(document.querySelectorAll("article.drop-tile"));
    return tiles.find((t) =>
      t.querySelector('button[role="radio"]:not([disabled])')
    );
  });

  if (!skirtHandle.asElement()) {
    throw new Error("No purchasable drop found on /drops");
  }

  // Hover the tile to expand size picker on desktop layout.
  await skirtHandle.asElement().scrollIntoView();
  await skirtHandle.asElement().hover();
  await new Promise((r) => setTimeout(r, 400));

  // Click first enabled size radio (with explicit scroll + delay to bypass any pointer hijack).
  const sizeButton = await skirtHandle
    .asElement()
    .$('button[role="radio"]:not([disabled])');
  await sizeButton.scrollIntoView();
  await sizeButton.evaluate((el) => el.click());
  console.log("Clicked enabled size radio.");
  await new Promise((r) => setTimeout(r, 600));

  const debug = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll("article.drop-tile"));
    const skirt = tiles.find((t) =>
      t.querySelector('button[role="radio"]:not([disabled])')
    );
    if (!skirt) return { found: false };
    const selectedRadio = skirt.querySelector('button[role="radio"][aria-checked="true"]');
    const form = skirt.querySelector("form[action='/api/checkout']");
    return {
      found: true,
      selected: selectedRadio?.textContent?.trim() ?? null,
      hasForm: !!form,
      buttonText: skirt.querySelector("form button[type='submit']")?.textContent?.trim() ?? null,
    };
  });
  console.log("Debug after radio click:", debug);

  // Wait for the secure-checkout submit button to appear.
  const submitSelector = "form[action='/api/checkout'] button[type='submit']";
  await page.waitForSelector(submitSelector, { timeout: 8000 });

  // Sniff the network: was /api/checkout already prefetched on hover/size-select?
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

  // Hover the submit button to trigger TLS warmup + session prefetch.
  const submitBtn = await page.$(submitSelector);
  const hoverStart = Date.now();
  await submitBtn.hover();
  // Give the in-flight fetch a moment to start.
  await new Promise((r) => setTimeout(r, 200));
  const hoverWindowEnd = Date.now();
  console.log(
    `After hover (${hoverWindowEnd - hoverStart}ms), checkout requests in flight:`,
    checkoutRequests.length
  );

  // Now click the button and watch for redirect to checkout.stripe.com.
  const clickStart = Date.now();
  const navPromise = page
    .waitForNavigation({ timeout: 15000, waitUntil: "domcontentloaded" })
    .catch(() => null);
  await submitBtn.click();
  const nav = await navPromise;
  const clickEnd = Date.now();

  const finalUrl = page.url();
  const elapsed = clickEnd - clickStart;
  console.log(`Click → navigation took ${elapsed}ms`);
  console.log(`Final URL: ${finalUrl}`);
  console.log("Total /api/checkout requests observed:", checkoutRequests.length);
  for (const req of checkoutRequests) {
    console.log(`  - ${req.method} ${req.url} (accept=${req.accept ?? "n/a"})`);
  }

  const landedOnStripe = finalUrl.startsWith("https://checkout.stripe.com/");
  if (!landedOnStripe) {
    throw new Error(`Did not land on checkout.stripe.com; got ${finalUrl}`);
  }
  console.log("✅ STRIPE CHECKOUT REACHED");
  if (elapsed < 2500) {
    console.log(`✅ FAST handoff (${elapsed}ms < 2500ms)`);
  } else {
    console.log(`⚠ Handoff slower than 2.5s (${elapsed}ms)`);
  }
} finally {
  await browser.close();
}
