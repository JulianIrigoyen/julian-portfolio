#!/usr/bin/env node
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const url = process.env.SCROLL_URL || "http://127.0.0.1:4330";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 500, hasTouch: width < 500 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.ScrollCraft?.instances?.length === 1);
    await page.mouse.move(width / 2, 400);
    const geometry = await page.evaluate(() => {
      const act = document.querySelector('[data-sc-act="pan"]');
      const rail = act.querySelector(".jx-rail");
      return {
        top: act.getBoundingClientRect().top + scrollY,
        travel: act.offsetHeight - innerHeight,
        over: rail.offsetWidth - innerWidth,
        extra: Number(rail.dataset.scPan),
        cards: [...rail.querySelectorAll(".jx-card")].map(card => ({ name: card.querySelector("h3").textContent, center: card.offsetLeft + card.offsetWidth / 2 })),
      };
    });
    assert.equal(geometry.cards.length, 9);

    // Real wheel events expose the feedback loop that instant jumps missed:
    // cards warp on every frame while they leave the viewport and re-enter it.
    await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), geometry.top - 300);
    for (const direction of [1, -1]) {
      for (let step = 0; step < 20; step++) {
        await page.mouse.wheel(0, direction * 550);
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(300);
    }

    for (const direction of ["forward", "reverse"]) {
      if (direction === "reverse") {
        await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), geometry.top + geometry.travel + 1800);
        await page.waitForTimeout(600);
      }
      for (const card of direction === "forward" ? geometry.cards : [...geometry.cards].reverse()) {
        const distance = Math.max(0, Math.min(geometry.over, card.center - width / 2));
        const progress = distance / (geometry.over * (1 + geometry.extra));
        await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), geometry.top + geometry.travel * progress);
        await page.waitForTimeout(200);
        const state = await page.evaluate(name => {
          const card = [...document.querySelectorAll(".jx-card")].find(card => card.querySelector("h3").textContent === name);
          const rect = card.getBoundingClientRect();
          const x = Math.max(1, Math.min(innerWidth - 1, rect.left + rect.width / 2));
          const y = Math.max(60, Math.min(innerHeight - 1, rect.top + rect.height / 2));
          return {
            visible: rect.right > 0 && rect.left < innerWidth && rect.bottom > 60 && rect.top < innerHeight,
            hittable: document.elementsFromPoint(x, y).some(element => element === card || card.contains(element)),
            widthRatio: rect.width / card.offsetWidth,
            heightRatio: rect.height / card.offsetHeight,
          };
        }, card.name);
        assert(state.visible && state.hittable && state.widthRatio < 1.5 && state.heightRatio < 1.5,
          `${width}: ${card.name} did not return intact on ${direction} scroll: ${JSON.stringify(state)}`);
      }
    }
    console.log(JSON.stringify({ width, ok: true, cards: geometry.cards.length, checked: "wheel traversal, leave section, forward and reverse return" }));
    await page.close();
  }
} finally {
  await browser.close();
}
