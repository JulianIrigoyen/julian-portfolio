#!/usr/bin/env node
import { chromium } from "playwright-core";
import assert from "node:assert/strict";

const url = process.env.SCROLL_URL || "http://127.0.0.1:4330";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.setDefaultTimeout(10_000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.ScrollCraft?.instances?.length === 1);

    assert.deepEqual(await page.locator("#lab article h3").allTextContents(), ["jtreks", "Ascenso", "Solana Sniper", "IMHO", "Pushy", "Hermes Thrice"]);
    assert.equal(await page.locator(".jx-card").count(), 9);
    assert.equal(await page.locator(".jx-about .jx-bi, .jx-bar__count, [data-assert]").count(), 0);
    assert.equal((await page.locator("#lab").innerText()).match(/Why\?/g)?.length, 6);

    const navigation = page.getByRole("navigation", { name: "Explore hobby projects" });
    assert.deepEqual(await navigation.locator("a").allTextContents(), ["Pushy", "IMHO", "Solana Sniper", "jtreks", "Ascenso", "Hermes Thrice"]);
    for (const id of ["jtreks", "ascenso", "sniper", "imho", "pushy", "hermes"]) {
      await navigation.evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 120, behavior: "instant" }));
      await navigation.locator(`a[href="#experiment-${id}"]`).click();
      await page.waitForFunction(id => {
        const top = document.getElementById(`experiment-${id}`).getBoundingClientRect().top;
        return top >= 50 && top <= 130;
      }, id);
    }

    const roles = page.locator("#experience details");
    assert.equal(await roles.count(), 9);
    for (let index = 0; index < 9; index++) {
      const role = roles.nth(index);
      await role.locator("summary").click();
      assert(await role.evaluate(element => element.open));
      assert(await role.locator("li").count() > 0);
    }
    await page.waitForFunction(() => {
      const close = window.ScrollCraft.instances[0].acts.at(-1);
      return Math.abs(close.top - (close.el.getBoundingClientRect().top + scrollY)) < 2;
    });
    await roles.first().locator("summary").focus();
    await page.keyboard.press("Enter");
    assert(!(await roles.first().evaluate(element => element.open)));

    await page.getByRole("button", { name: /Switch to .* theme/ }).click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ url, width, projects: 6, why: 6, chartLinks: 6, roles: 9, keyboard: true, noOverflow: true, errors }));
    await page.close();
  }
} finally {
  await browser.close();
}
