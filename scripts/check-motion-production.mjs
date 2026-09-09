#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const url = process.env.SCROLL_URL || "http://127.0.0.1:4330";
const output = process.env.MOTION_CHECK_OUTPUT || "lab/motion-production";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const results = [];

try {
  for (const viewport of [{ width: 360, height: 740 }, { width: 390, height: 844 }, { width: 430, height: 640 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.ScrollCraft?.instances?.length === 1);
    // Jump to the reading beat, without timing assertions against a smooth
    // scroll that can still be moving several thousand pixels per second.
    await page.evaluate(() => {
      const rect = document.querySelector(".jx-open").getBoundingClientRect();
      scrollTo({ top: scrollY + rect.top + (rect.height - innerHeight) * 0.92, behavior: "instant" });
    });
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".jx-open .sc-copy--lead")).opacity) >= 0.99);
    await page.waitForTimeout(800);
    const reading = await page.evaluate(() => {
      const bar = document.querySelector(".jx-bar");
      const bounds = bar.getBoundingClientRect();
      const copy = [...document.querySelectorAll(".jx-open .jx-lbl, .jx-open h1, .jx-open .jx-typed")];
      return {
        headerFixed: getComputedStyle(bar).position === "fixed" && Math.abs(bounds.top) < 1,
        headerFits: [...bar.querySelectorAll("a, button, .jx-bar__name")].every(element => {
          const r = element.getBoundingClientRect();
          return !r.width || (r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= bounds.bottom + 1);
        }),
        copy: copy.map(element => ({ text: element.textContent.slice(0, 32), opacity: Number(getComputedStyle(element).opacity), top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom })),
        wholeWords: [...document.querySelectorAll("h1 .sc-split-word")].map(word => {
          const tops = [...word.querySelectorAll(".sc-split")].map(character => character.getBoundingClientRect().top);
          return { text: word.textContent, intact: tops.length > 0 && Math.max(...tops) - Math.min(...tops) < 1 };
        }),
        barBottom: bounds.bottom,
        height: innerHeight,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    assert(reading.headerFixed && reading.headerFits, `${viewport.width}: header is misplaced or clips controls`);
    assert(reading.overflow <= 0, `${viewport.width}: horizontal overflow`);
    assert(reading.wholeWords.length === 5 && reading.wholeWords.every(word => word.intact), `${viewport.width}: animated headline breaks words`);
    for (const line of reading.copy) {
      assert(line.opacity >= .99, `${viewport.width}: invisible reading copy: ${line.text}`);
      assert(line.top >= reading.barBottom && line.bottom <= reading.height, `${viewport.width}: reading copy is clipped: ${line.text}`);
    }
    assert(await page.getByRole("link", { name: "Download Julian Irigoyen’s CV" }).isVisible());
    await page.screenshot({ path: `${output}/reading-${viewport.width}.png` });
    // A working header must remain reachable after leaving the animated intro.
    await page.evaluate(() => scrollTo({ top: document.querySelector(".jx-index-act").getBoundingClientRect().top + scrollY + 200, behavior: "instant" }));
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: /Switch to .* theme/ }).click();
    const theme = await page.locator("html").getAttribute("data-theme");
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), theme, "Theme did not persist");
    assert.deepEqual(errors, [], `${viewport.width}: browser exceptions`);
    results.push({ viewport, ...reading, themePersisted: true, errors });
    await context.close();
  }

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await reduced.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".jx-open .sc-copy--lead")).opacity) >= .99);
  await page.getByRole("heading", { name: "I love a good challenge." }).waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const letters = [...document.querySelectorAll("h1 .sc-split__i")];
    return letters.length > 0 && letters.every(letter => Number(getComputedStyle(letter).opacity) >= .99);
  });
  assert(await page.evaluate(() => document.querySelector(".jx-open").getBoundingClientRect().height < innerHeight * 2), "Reduced motion retains an empty pinned intro");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `${output}/reduced-motion.png` });
  await reduced.close();

  const request = await browser.newContext();
  const pdf = await request.request.get(new URL("/julian-irigoyen-cv.pdf", url).href);
  assert.equal(pdf.status(), 200, "CV download failed");
  assert(pdf.headers()["content-type"]?.includes("application/pdf"), "CV URL did not serve a PDF");
  const consoleResponse = await request.request.get(new URL("/console", url).href);
  assert.equal(consoleResponse.status(), 401, "Private console no longer requires authentication");
  await request.close();

  const report = { ok: true, url, results, reducedMotion: true, cvDownload: true, consoleProtected: true };
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: true, url, widths: results.map(result => result.viewport.width), checks: ["Whole-word animation", "Visible reading copy", "Fixed header and reachable controls", "No horizontal overflow", "Persisted theme", "Reduced motion", "PDF download", "Console authentication"] }, null, 2));
} finally {
  await browser.close();
}
