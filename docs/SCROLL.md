# The scroll page

`/` is one stack of scrollcraft acts. Scroll position is the only input; every
motion on the page is a pure function of it. There is one rAF loop.

Files that matter:

| file | lines | what it is |
| --- | --- | --- |
| `public/scrollcraft/scrollcraft.js` | 1300 | the engine |
| `app/scroll/Timeline.tsx` | 734 | the acts and all the copy |
| `app/scroll/RailDepth.tsx` | 221 | the project rail's warp and lens |
| `app/scroll/BloomCut.tsx` | 115 | the flash at the end of the open |
| `app/scroll/ScrollcraftMount.tsx` | 95 | mounts the engine, owns the instance |
| `app/scroll/MarkSync.tsx` | 64 | publishes the open act's two playheads |
| `app/scroll/IndexMentionSync.tsx` | 54 | links the prose mentions to the index |
| `scripts/check-scroll-page.mjs` | 369 | the harness, 40 assertions |

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

**The cull bug, because it will look tempting to simplify.** The cull measures
`getBoundingClientRect()` on the **already-warped** element. The old code
cleared the transform when parking a card — which moved that same rectangle back
inside the threshold, so the card unparked, warped out, and parked again. Once
per frame. The cull decision was reading a rectangle the cull decision had just
changed.

The fix is two things together: the warp is **not** cleared on park, and the
thresholds have hysteresis — `PARK_OUT = 420`, `PARK_IN = 220`. Removing either
brings the flicker back.

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
