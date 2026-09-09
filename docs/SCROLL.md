# The scroll page

`/` combines scrollcraft acts with normal-flow hobby stories and career
disclosures. The engine owns act timing; companion effects have their own
requestAnimationFrame callbacks. Rail depth also reads pointer position.

Files that matter:

| file | what it is |
| --- | --- |
| `public/scrollcraft/scrollcraft.js` | the engine |
| `app/scroll/Timeline.tsx` | the acts and all the copy |
| `app/scroll/RailDepth.tsx` | the project rail's warp and lens |
| `app/scroll/BloomCut.tsx` | the flash at the end of the open |
| `app/scroll/ScrollcraftMount.tsx` | mounts the engine, owns the instance |
| `app/scroll/MarkSync.tsx` | publishes the open act's two playheads |
| `app/scroll/IndexMentionSync.tsx` | links the prose mentions to the index |
| `scripts/check-scroll-page.mjs` | the harness, 40 assertions |

---

## The engine is vendored, and it has been extended

scrollcraft is copied in, not installed. The rule was that it is never edited —
that rule is now broken on purpose, and the additions are documented in its own
header block rather than here, so the engine stays readable on its own terms.

What was added:

- `data-sc-clip-end` — map a clip's last frame to an earlier act progress,
  leaving authored scroll left over for a hold.
- `data-sc-clip-to` — map the clip's final scroll position to an earlier point
  in the media, then hold. For source files with teardown frames after the beat.
- `data-sc-clip-hold-at` / `data-sc-clip-hold-for` — pause on a source-frame
  fraction, then resume.
- `data-sc-span-mobile` — override the act's span on touch and small screens.
- `type` as a `data-sc-kinetic` mode, alongside `lines | words | chars`.
- Teardown. Listeners register through a cleanup list, and a `destroyed` flag
  stops frames that were already queued.
- Viewport width now reads `document.documentElement.clientWidth`, falling back
  to `innerWidth`. On iOS those two disagree and the rail measured wrong.

Anything upstream will not have these. Re-vendoring means re-applying them.

---

## The open act

```jsx
<section
  className="jx-act jx-open"
  data-sc-act="scrub"
  data-sc-span="12.2"
  data-sc-span-mobile="32"
  data-sc-dwell="0.55"
  data-sc-clip-map="travel"
  data-sc-clip-hold-at="0.70"
  data-sc-clip-hold-for="0.20"
>
```

The clip runs to 70% of its footage, holds there for 20% of the act, then
finishes. The hold is the beat where the heart is complete and the copy finishes
typing. Mobile gets 32 viewport-heights against desktop's 12.2 — the same
footage over far more scroll, because a phone thumb covers a viewport in a
fraction of the gesture a mouse wheel does.

### Two playheads, and why

`MarkSync` publishes both on the act:

- `--jx-mark` — the clip's **actual** playhead, including decoder lag and the
  authored hold.
- `--jx-open-p` — the section's **scroll** progress.

Layout reads `--jx-open-p`. Type reads `--jx-mark`.

They are not interchangeable. During the hold, scroll keeps advancing while the
video does not, so anything positioned off `--jx-mark` freezes mid-page. And
anything timed off `--jx-open-p` drifts away from what the video is actually
showing, because the engine lerps the clip and CSS does not.

When the clip is missing or not ready, `currentTime / duration` is 0 — which
would pin the headline at 0.16 opacity for the whole scroll. Both fall back to
the act's own geometry, which is the number the engine would have used anyway.

### The flash

`BloomCut` keys the bloom off **geometry**, not off video events. `RISE = 0.32`.
Geometry keeps the flash continuous through forward *and* reverse scroll; video
seek events are async and fire in an order that reverse scrolling scrambles.

---

## The rail

`RailDepth` warps the project rail: a pincushion bow, a cursor-following bulge,
parallax inside each frame, and a depth dim. Constants at the top of the file:

```
BOW 0.055   past ~0.12 it reads as a fisheye toy
BULGE 26px  push at the cursor
REACH 460px the lens radius
PARALLAX 14px travel inside the frame
DIM 0.34    how far the farthest card fades
LERP 11     cursor damping; higher is tighter
```

**Card geometry must come from layout.** The old depth effect measured
`getBoundingClientRect()` on already-transformed cards, then used those bounds
to compute the next transform and decide whether a card was off-screen. Real
wheel traversal compounded the warp: DJINN reached 5.7 times its layout width
and stayed parked after reverse scrolling. Instant-jump rail tests missed this.

The rail is now a positioned containing block. Card bounds come from its
translated rectangle plus each card's `offsetLeft`, `offsetTop`, `offsetWidth`,
and `offsetHeight`. Both distortion and culling use those stable bounds. Touch
and reduced-motion readers skip the pointer depth effect.

`node scripts/check-rail-return.mjs` exercises real wheel traversal, leaving the
section, and every card in both directions on desktop and mobile. It failed on
the prior production build and passed after this repair.

---

## Mounting

`ScrollcraftMount` holds the instance and, before reusing one, checks it still
owns nodes in the current document. The previous version tracked mounts with a
`window.__jiScrollCraftMounted` boolean, which survived a remount — so a stale
instance could keep driving a rail that no longer existed. The harness asserts
against exactly this: `instances === 1` and `attached`.

---

## The harness

```sh
npx next build && npx next start -p 3312     # in one shell
npm run test:scroll                          # in another
```

`SCROLL_URL` overrides the target. It drives real Chrome through Playwright at
two sizes — mobile 390×844 at DPR 2, desktop 1440×900 — and prints JSON with a
top-level `ok`. Exit 0 means every assertion held.

Forty assertions. The ones worth knowing:

- The page never gains horizontal scroll or overflow, at either width.
- The rail starts flush, travels, and ends flush.
- Exactly one scrollcraft instance, and it is attached to live DOM.
- The scrub clip is requested **once** — `mark.mp4` on desktop, `mark-m.mp4` on
  mobile. Two requests means the video is being re-fetched on remount.
- Video metadata survives a remount: `readyState >= 1`, duration > 10s.
- Copy is invisible on the first open frame and visible after the heart beat.
- The flash does **not** fire during the heart hold.
- Type has finished by the time it does.

A green `next build` proves none of this. Every one of these failure modes
leaves the build passing and the page broken.

**Expected noise:** one console 404 for `/_vercel/insights/script.js`. That
route only exists when Vercel serves the page.

---

## Traps

**Deploys ship the working tree.** `vercel --prod` uploads the working
directory, not HEAD. This masked a real defect for days: `Timeline.tsx` imported
`IndexMentionSync` while the file was untracked, so HEAD could not build from a
clean clone and nothing noticed. Read `git status --short` before deploying, and
check untracked entries against imports — not just modified files.

**The viewport meta lives in its own export.** Next moved it out of `metadata`.
While nothing exported `viewport`, phones laid the page out at desktop width and
scaled it down, which made every mobile measurement meaningless.

**A scrub clip's poster is frame 1, never a hero frame.** A poster cut from the
middle of the clip shows the resolved end state on every page load, before
scroll has started.

**A grouped `position` rule can un-fix the fixed chrome.** `.jx-page > main`
carries `position: relative; z-index: 1` so the page sits above the WebGL
canvas. `.jx-bar` was in the same selector, which overrode its own
`position: fixed` at theme.css:176 — so the bar scrolled away after 52px and
was never seen again across 25,288px of desktop page, taking the former PASS
count, the CV button, the marks, the theme switch and the progress track with
it. The comment above that rule already records the identical bug on
`.jx-bloom`. A fixed element at `z-index: 50` clears a canvas at `z-index: 0`
on its own; it does not belong in that selector. Check it with
`getComputedStyle(document.querySelector(".jx-bar")).position` at scroll, not
at the top of the page — it looks right there either way.

**Fixed chrome means pinned acts centre in `100vh - bar`.** A pinned stage is
the whole viewport, so centring in the raw box puts content behind the bar. It
cost the rail the top 12px of every address strip. `.jx-bar-h` on `.jx-page`
carries the height (52px, 48px under 46rem) and every pinned stage but the open
pads by it. The open is excluded on purpose: its mark is centred in the full
frame with the bar over it as translucent chrome, and its copy is
bottom-anchored.

**Grid placement only reaches direct children.** The record's hung year column
(`.jx-row__yr { grid-column: 1 }`, min-width 62rem) never fired, because the
year sat inside `.jx-row__top`, a flex row. The 9rem column rendered empty and
the company names ragged across 50px, since "2021" and "2021 — 2024" are not
the same width. The year is now a direct child of `.jx-row`.

**The mobile open shows no words for twenty-six screens, and that is asserted.**
`--jx-mobile-copy` starts the lead at 0.82 of the open act. Against
`data-sc-span-mobile="32"` that is 22,146px at 390x844 with the eyebrow, the
headline and both bio paragraphs at opacity 0, then about three screens of
readable page before the cut. Two harness assertions hold it there —
`copy appears before the lattice has played` (opacity <= 0.05 at 0.62) and
`copy covers the clean heart beat` (<= 0.12 at 0.80). Moving the window means
moving those two assertions and the mobile span together.

## Hobby projects and career — September 9, 2026

The hobby section is ordinary document flow, so every project remains reachable
at every viewport height. `Experiments.tsx` presents jtreks, Ascenso, Solana
Sniper, IMHO, Pushy, and Hermes Thrice in that order, each with Julian's own
reason for building it. The graph ascends through Pushy, IMHO, Solana Sniper,
Hermes Thrice, jtreks, and Ascenso. Its HTML links have 44px hit targets over
the SVG illustration. Its axes carry no
invented metrics. The work rail now contains nine projects, numbered 01–09.

`Career.tsx` renders nine native disclosures from the shared `CAREER` data. The
fuller entries were sourced from the existing resume and CV: both TrueML roles
and separate Intive and Globant positions are retained. Opening a role refreshes
the scroll engine's layout because the closing section moves with the content.

The 4/4 PASS counter and section assertions were removed. They counted sections
seen, not tests passed. Theme controls and the thin scroll-progress line remain.

### Hermes Thrice

Hermes Thrice follows Pushy as hobby project 15. It presents Julian's musical,
audio, and visual tools with his reason for building them, then library analysis
and search by tone/BPM/genre, drum/beat/bassline makers, and music-to-visual
engines. The waveform is an illustration, not a recording or playback control.
This music collection is distinct from the older Hermes LLM framework entry in
the private console. No public URL was inferred from that framework.
