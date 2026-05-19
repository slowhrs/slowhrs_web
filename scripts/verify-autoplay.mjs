#!/usr/bin/env node
import puppeteer from "puppeteer";

const RAW_URL =
  process.argv[2] ||
  process.env.PREVIEW_URL ||
  "https://slowhrs.com/";
const u = new URL(RAW_URL);
u.searchParams.set("_t", "verify_pup");
u.hash = "#archive";
const TARGET = u.toString();

const browser = await puppeteer.launch({
  headless: "shell",
  args: ["--force-prefers-reduced-motion=no-preference"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  console.log(`[verify-autoplay] target=${TARGET}`);
  await page.goto(TARGET, { waitUntil: "domcontentloaded", timeout: 60000 });

  await page.waitForSelector('[aria-roledescription="carousel"]', { timeout: 10000 });

  const sample = async () => {
    return page.evaluate(() => {
      const regions = Array.from(
        document.querySelectorAll('[aria-roledescription="carousel"]')
      );
      return regions.map((el) => {
        const counter = el.querySelector('[aria-live="polite"]');
        return counter ? counter.textContent.trim() : "(no counter)";
      });
    });
  };

  // Scroll the carousels into view so IntersectionObserver fires
  await page.evaluate(() => {
    const headings = document.querySelectorAll("h4");
    for (const h of headings) {
      if (h.textContent && h.textContent.includes("Harbarium")) {
        h.scrollIntoView({ block: "center" });
        break;
      }
    }
  });

  const samples = [];
  for (let t = 0; t <= 9000; t += 1000) {
    if (t > 0) await new Promise((r) => setTimeout(r, 1000));
    const labels = await sample();
    samples.push({ t, labels });
    console.log(`t=${t}ms:`, labels);
  }

  const first = samples[0].labels;
  const last = samples[samples.length - 1].labels;
  const allAdvanced = first.every((label, i) => label !== last[i]);
  console.log(allAdvanced ? "✅ AUTOPLAY OK — every carousel advanced" : "❌ AUTOPLAY STUCK — some carousel didn't advance");
  process.exitCode = allAdvanced ? 0 : 1;
} finally {
  await browser.close();
}
