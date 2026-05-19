#!/usr/bin/env node
/**
 * v2.4-4-velocity hero perf smoke. Navigate to the homepage and report:
 *   - time-to-poster: when the hero element is on screen with a non-empty
 *     background-image (or a poster attribute applied to a <video>).
 *   - time-to-video-playing: when a hero <video> element has currentTime > 0.
 *
 * Targets (normal connection):
 *   - poster < 1500ms
 *   - video playing < 4000ms
 * Slow-4G simulation is intentionally not in this script — the user runs that
 * manually via DevTools. We do exit non-zero if a target is missed so CI can
 * pick it up.
 *
 * Usage:
 *   node scripts/verify-hero-perf.mjs https://slowhrs-...vercel.app/
 *   PREVIEW_URL=https://... node scripts/verify-hero-perf.mjs
 */
import puppeteer from "puppeteer";

const URL =
  process.argv[2] ||
  process.env.PREVIEW_URL ||
  "https://slowhrs.com/";

const POSTER_TARGET_MS = 1500;
const PLAY_TARGET_MS = 4000;

const BYPASS = process.env.VERCEL_PROTECTION_BYPASS || "";

const browser = await puppeteer.launch({
  headless: "shell",
  args: ["--force-prefers-reduced-motion=no-preference"],
});

let exitCode = 0;
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  if (BYPASS) {
    await page.setExtraHTTPHeaders({ "x-vercel-protection-bypass": BYPASS });
  }

  const start = Date.now();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });

  const posterMs = await page.evaluate((startedAt) => {
    return new Promise((resolve) => {
      const t0 = performance.now();
      const baseline = startedAt;
      const check = () => {
        const elapsed = performance.now() - t0 + (Date.now() - baseline - performance.now());
        const candidates = Array.from(
          document.querySelectorAll("video, [style*='hero-poster']")
        );
        for (const el of candidates) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.bottom < 0 || rect.top > innerHeight) continue;
          const cs = getComputedStyle(el);
          const hasBg = cs.backgroundImage && cs.backgroundImage !== "none";
          const hasPoster =
            el.tagName === "VIDEO" && (el.poster || hasBg);
          if (hasBg || hasPoster) {
            resolve(Math.round(elapsed));
            return;
          }
        }
        if (elapsed > 8000) {
          resolve(-1);
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });
  }, start);

  const playingMs = await page.evaluate((startedAt) => {
    return new Promise((resolve) => {
      const t0 = performance.now();
      const baseline = startedAt;
      const check = () => {
        const elapsed = performance.now() - t0 + (Date.now() - baseline - performance.now());
        const videos = Array.from(document.querySelectorAll("video"));
        const playing = videos.find(
          (v) => v.currentTime > 0 && !v.paused && !v.ended
        );
        if (playing) {
          resolve(Math.round(elapsed));
          return;
        }
        if (elapsed > 12000) {
          resolve(-1);
          return;
        }
        setTimeout(check, 100);
      };
      check();
    });
  }, start);

  const wallStart = start;
  const wallNow = Date.now();
  console.log(`[hero-perf] url=${URL}`);
  console.log(`[hero-perf] navigation_total_ms=${wallNow - wallStart}`);
  console.log(`[hero-perf] poster_ms=${posterMs}`);
  console.log(`[hero-perf] playing_ms=${playingMs}`);

  if (posterMs < 0) {
    console.log("[hero-perf] FAIL — poster never observed");
    exitCode = 1;
  } else if (posterMs > POSTER_TARGET_MS) {
    console.log(`[hero-perf] WARN — poster ${posterMs}ms > target ${POSTER_TARGET_MS}ms`);
  } else {
    console.log(`[hero-perf] OK   — poster ${posterMs}ms ≤ ${POSTER_TARGET_MS}ms`);
  }

  if (playingMs < 0) {
    console.log("[hero-perf] FAIL — video never began playing");
    exitCode = 1;
  } else if (playingMs > PLAY_TARGET_MS) {
    console.log(`[hero-perf] WARN — playing ${playingMs}ms > target ${PLAY_TARGET_MS}ms`);
  } else {
    console.log(`[hero-perf] OK   — playing ${playingMs}ms ≤ ${PLAY_TARGET_MS}ms`);
  }
} catch (err) {
  console.error("[hero-perf] error", err);
  exitCode = 1;
} finally {
  await browser.close();
  process.exit(exitCode);
}
