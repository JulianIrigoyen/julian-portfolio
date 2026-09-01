#!/usr/bin/env node
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const URL = process.env.SCROLL_URL || "http://localhost:3312";
const CHROME_CANDIDATES = [
  process.env.CHROME_EXECUTABLE,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance;

function chromePath() {
  return CHROME_CANDIDATES.find((path) => existsSync(path));
}

function assert(ok, message, detail) {
  if (!ok) {
    const extra = detail === undefined ? "" : `\n${JSON.stringify(detail, null, 2)}`;
    throw new Error(`${message}${extra}`);
  }
}

async function sampleOpen(page) {
  return page.evaluate(() => {
    const act = document.querySelector(".jx-open");
    const stage = document.querySelector(".jx-open [data-sc-stage]");
    const video = document.querySelector(".jx-open video[data-sc-scrub]");
    const copy = document.querySelector(".jx-open .sc-copy--lead");
    const stageRect = stage.getBoundingClientRect();
    const mediaRect = video.getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const viewport = document.documentElement.clientWidth || innerWidth;
    const typeProgress = Array.from(act.querySelectorAll("[data-sc-kinetic='type']")).map((el) =>
      Number(Number(getComputedStyle(el).getPropertyValue("--sc-type") || 0).toFixed(3)),
    );

    return {
      y: Math.round(scrollY),
      p: Number(Number(getComputedStyle(act).getPropertyValue("--sc-p") || 0).toFixed(4)),
      openP: Number(Number(getComputedStyle(act).getPropertyValue("--jx-open-p") || 0).toFixed(4)),
      mark: Number(Number(getComputedStyle(act).getPropertyValue("--jx-mark") || 0).toFixed(4)),
      bloom: Number(Number(rootStyle.getPropertyValue("--jx-bloom") || 0).toFixed(4)),
      gone: Number(Number(rootStyle.getPropertyValue("--jx-gone") || 0).toFixed(4)),
      copyOpacity: Number(Number(getComputedStyle(copy).opacity).toFixed(3)),
      typeProgress,
      time: Number(video.currentTime.toFixed(3)),
      duration: Number((video.duration || 0).toFixed(3)),
      ready: video.readyState,
      hasClip: video.classList.contains("sc-has-clip"),
      stageLeft: Math.round(stageRect.left),
      stageRight: Math.round(stageRect.right),
      mediaLeft: Math.round(mediaRect.left),
      mediaRight: Math.round(mediaRect.right),
      mediaCenter: Math.round((mediaRect.left + mediaRect.right) / 2),
      scrollX: Math.round(scrollX),
      overflow: Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - viewport),
      viewport,
    };
  });
}

async function sampleIndex(page, y) {
  await page.evaluate((nextY) => scrollTo(0, nextY), y);
  await sleep(550);
  return page.evaluate(() => {
    const section = document.querySelector(".jx-index-act");
    const rows = Array.from(document.querySelectorAll(".jx-index__row"));
    const viewport = document.documentElement.clientWidth || innerWidth;
    return {
      y: Math.round(scrollY),
      p: section
        ? Number(Number(getComputedStyle(section).getPropertyValue("--sc-p") || 0).toFixed(4))
        : 0,
      rows: rows.map((row) => ({
        key: row.getAttribute("data-jx-index-row"),
        shown: row.classList.contains("jx-index__row--shown"),
        opacity: Number(Number(getComputedStyle(row).opacity).toFixed(3)),
      })),
      scrollX: Math.round(scrollX),
      overflow: Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - viewport),
    };
  });
}

async function sampleRail(page, label, y) {
  await page.evaluate((nextY) => scrollTo(0, nextY), y);
  await sleep(450);
  return page.evaluate((sampleLabel) => {
    const act = document.querySelector('[data-sc-act="pan"]');
    const rail = document.querySelector(".jx-rail");
    const rect = rail.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth || innerWidth;
    const instances = window.ScrollCraft?.instances ?? [];
    return {
      label: sampleLabel,
      y: Math.round(scrollY),
      p: Number(Number(getComputedStyle(act).getPropertyValue("--sc-p") || 0).toFixed(4)),
      railLeft: Math.round(rect.left),
      railRight: Math.round(rect.right),
      viewport,
      scrollX: Math.round(scrollX),
      overflow: Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - viewport),
      instances: instances.length,
      attached: instances.some((instance) =>
        instance.acts?.some((instanceAct) => instanceAct.el === act),
      ),
    };
  }, label);
}

function assertRailTrip(config, label, rail) {
  assert(rail[0].railLeft === 0, `${config.name}: ${label} rail does not start flush`, rail);
  assert(rail[1].railLeft < 0, `${config.name}: ${label} rail did not travel`, rail);
  assert(near(rail[2].railRight, rail[2].viewport, 2), `${config.name}: ${label} rail does not end flush`, rail);
  for (const state of rail) {
    assert(state.scrollX === 0 && state.overflow <= 0, `${config.name}: ${label} rail created horizontal overflow`, state);
    assert(state.instances === 1, `${config.name}: ${label} rail has duplicate scrollcraft instances`, rail);
    assert(state.attached, `${config.name}: ${label} rail is driven by a stale scrollcraft instance`, rail);
  }
}

async function runViewport(browser, config) {
  const page = await browser.newPage(config.context);
  const clipName = config.mobile ? "mark-m.mp4" : "mark.mp4";
  let clipRequests = 0;
  const consoleErrors = [];

  page.on("request", (request) => {
    if (request.url().includes(`/reveal/${clipName}`)) clipRequests += 1;
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForSelector(".jx-open video[data-sc-scrub]", { timeout: 15_000 });
  await page.waitForFunction(
    () => document.querySelector(".jx-open video[data-sc-scrub]")?.readyState >= 1,
    null,
    { timeout: 15_000 },
  );
  await sleep(1_000);

  const geometry = await page.evaluate(() => {
    const open = document.querySelector(".jx-open").getBoundingClientRect();
    const index = document.querySelector(".jx-index-act").getBoundingClientRect();
    const pan = document.querySelector('[data-sc-act="pan"]').getBoundingClientRect();
    return {
      vh: innerHeight,
      openTop: Math.round(open.top + scrollY),
      openHeight: Math.round(open.height),
      indexTop: Math.round(index.top + scrollY),
      indexHeight: Math.round(index.height),
      panTop: Math.round(pan.top + scrollY),
      panHeight: Math.round(pan.height),
    };
  });

  const openTravel = Math.max(geometry.openHeight - geometry.vh, 1);
  const openPositions = [
    geometry.openTop,
    geometry.openTop + openTravel * 0.42,
    geometry.openTop + openTravel * 0.62,
    geometry.openTop + openTravel * 0.8,
    geometry.openTop + openTravel * 0.92,
    geometry.openTop + geometry.openHeight - geometry.vh * 1.38,
    geometry.openTop + geometry.openHeight - geometry.vh,
  ].map(Math.round);

  const down = [];
  for (const y of openPositions) {
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await sleep(650);
    down.push(await sampleOpen(page));
  }

  for (const [index, state] of down.entries()) {
    assert(state.ready >= 1, `${config.name}: lattice video lost metadata`, { index, state });
    assert(state.duration > 10, `${config.name}: lattice video duration collapsed`, { index, state });
    assert(state.hasClip, `${config.name}: lattice never painted`, { index, state });
    assert(state.scrollX === 0, `${config.name}: page gained horizontal scroll`, { index, state });
    assert(state.overflow <= 0, `${config.name}: page has horizontal overflow`, { index, state });
    assert(state.stageLeft >= -1 && state.stageRight <= state.viewport + 1, `${config.name}: open stage escaped viewport`, {
      index,
      state,
    });
  }

  assert(down[0].copyOpacity <= 0.05, `${config.name}: copy is visible on the first open frame`, down[0]);
  assert(
    near(down[0].mediaCenter, down[0].viewport / 2, Math.max(18, down[0].viewport * 0.035)),
    `${config.name}: opening sun is not centered`,
    down[0],
  );
  if (!config.mobile) {
    assert(down[1].mediaCenter > down[0].mediaCenter + down[0].viewport * 0.08, `${config.name}: sun did not move right after scroll began`, {
      first: down[0],
      moving: down[1],
    });
  }
  assert(
    near(down[3].time, down[3].duration * 0.7, 0.65),
    `${config.name}: lattice is not holding on the completed-heart frame`,
    down[3],
  );
  assert(down[3].bloom <= 0.02, `${config.name}: flash starts during the heart hold`, down[3]);
  assert(down[4].typeProgress.at(-1) >= 0.98, `${config.name}: text is not finished during the heart hold`, down[4]);
  assert(down[4].copyOpacity >= 0.85, `${config.name}: copy is not visible after the clean heart beat`, down[4]);
  assert(down[5].openP >= 0.96, `${config.name}: open scroll progress is not late before flash`, down[5]);
  assert(down[5].typeProgress.at(-1) >= 0.98, `${config.name}: text is not finished before the flash window`, down[5]);
  assert(down[5].time >= down[5].duration * 0.78, `${config.name}: tail effect was removed before the flash`, down[5]);
  assert(down[5].bloom <= 0.02, `${config.name}: flash starts before the text/tail finish`, down[5]);
  assert(down[6].bloom >= 0.9, `${config.name}: flash does not peak at the handoff`, down[6]);

  if (config.mobile) {
    assert(geometry.openHeight >= geometry.vh * 31.5, "mobile: open act does not have enough scroll distance", geometry);
    assert(down[2].copyOpacity <= 0.05, "mobile: copy appears before the lattice has played", down[2]);
    assert(down[3].copyOpacity <= 0.12, "mobile: copy covers the clean heart beat", down[3]);
    assert(openPositions[5] - openPositions[4] >= geometry.vh * 2.0, "mobile: not enough reading distance before flash", {
      geometry,
      textDoneY: openPositions[4],
      preFlashY: openPositions[5],
    });
  }

  const indexTop = geometry.indexTop;
  const indexBefore = await sampleIndex(page, indexTop - geometry.vh * 0.08);
  assert(
    indexBefore.rows.every((row) => !row.shown && row.opacity <= 0.05),
    `${config.name}: index rows are visible before their paragraph mentions`,
    indexBefore,
  );

  const indexPositions = [
    indexTop,
    indexTop + geometry.indexHeight * 0.28,
    indexTop + geometry.indexHeight * 0.52,
    indexTop + geometry.indexHeight * 0.74,
  ].map(Math.round);
  const indexStates = [];
  for (const y of indexPositions) {
    indexStates.push(await sampleIndex(page, y));
  }
  const finalIndex = indexStates[indexStates.length - 1];
  assert(
    finalIndex.rows.every((row) => row.shown && row.opacity >= 0.98),
    `${config.name}: index rows did not reveal from paragraph mentions`,
    indexStates,
  );
  for (const state of indexStates) {
    assert(state.scrollX === 0 && state.overflow <= 0, `${config.name}: index created horizontal overflow`, state);
  }

  await page.evaluate((nextY) => scrollTo(0, nextY), geometry.panTop + geometry.vh * 2);
  await sleep(650);

  const up = [];
  for (const y of [...openPositions].reverse()) {
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await sleep(650);
    up.push(await sampleOpen(page));
  }
  up.reverse();

  for (const [index, state] of up.entries()) {
    assert(state.ready >= 1, `${config.name}: lattice video lost metadata on reverse`, { index, state });
    assert(state.duration > 10, `${config.name}: lattice video duration collapsed on reverse`, { index, state });
    assert(state.hasClip, `${config.name}: lattice never painted on reverse`, { index, state });
    assert(state.scrollX === 0, `${config.name}: page gained horizontal scroll on reverse`, { index, state });
    assert(state.overflow <= 0, `${config.name}: page has horizontal overflow on reverse`, { index, state });
    assert(state.stageLeft >= -1 && state.stageRight <= state.viewport + 1, `${config.name}: open stage escaped viewport on reverse`, {
      index,
      state,
    });
  }

  for (let i = 0; i < down.length; i += 1) {
    assert(near(down[i].time, up[i].time, 0.35), `${config.name}: reverse playhead did not return to the same frame`, {
      down: down[i],
      up: up[i],
    });
  }

  const railPositions = [
    geometry.panTop,
    geometry.panTop + geometry.panHeight * 0.5,
    geometry.panTop + geometry.panHeight - geometry.vh,
  ].map(Math.round);
  const rail = [];
  for (const [index, y] of railPositions.entries()) {
    rail.push(await sampleRail(page, `initial-${index}`, y));
  }
  assertRailTrip(config, "initial", rail);
  assert(clipRequests === 1, `${config.name}: scrub clip should load once on initial mount`, { clipName, clipRequests });

  await page.evaluate(() => {
    [...(window.ScrollCraft?.instances ?? [])].forEach((instance) => instance.destroy?.());
    window.ScrollCraft?.mount(document, { lerp: 0.22 });
  });
  await sleep(650);
  const railAfterRemount = [];
  for (const [index, y] of railPositions.entries()) {
    railAfterRemount.push(await sampleRail(page, `remount-${index}`, y));
  }
  assertRailTrip(config, "remounted", railAfterRemount);

  await page.close();
  return { name: config.name, clipName, clipRequests, down, up, indexBefore, indexStates, rail, railAfterRemount, consoleErrors };
}

const executablePath = chromePath();
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

try {
  const results = [];
  results.push(await runViewport(browser, {
    name: "mobile",
    mobile: true,
    context: {
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    },
  }));
  results.push(await runViewport(browser, {
    name: "desktop",
    mobile: false,
    context: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    },
  }));

  console.log(JSON.stringify({
    url: URL,
    ok: true,
    results: results.map((result) => ({
      name: result.name,
      clipName: result.clipName,
      clipRequests: result.clipRequests,
      open: {
        first: result.down[0],
        animationOnly: result.down[2],
        heartRead: result.down[3],
        textDone: result.down[4],
        preFlash: result.down[5],
        seam: result.down[6],
        reverseFirst: result.up[0],
      },
      index: {
        before: result.indexBefore,
        after: result.indexStates,
      },
      rail: result.rail,
      railAfterRemount: result.railAfterRemount,
      consoleErrors: result.consoleErrors.slice(0, 3),
    })),
  }, null, 2));
} finally {
  await browser.close();
}
