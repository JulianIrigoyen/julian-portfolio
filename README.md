# julian-portfolio

Julian Irigoyen's portfolio. Next.js 16 (Turbopack) + Tailwind v4 + TypeScript.

Two builds live side by side:

| route | what |
|---|---|
| `/` | **The scroll page.** A dark filmic `scrub` open hard-cutting into a paper editorial gallery. Built on the scrollcraft engine. |
| `/console` | **The previous INSTRUMENT build** — a fixed-viewport operations console, carrying the full 13-entry catalogue in depth. Protected by the existing authentication gate; unauthenticated requests return 401. Documented in [`docs/CONSOLE.md`](docs/CONSOLE.md). |

```bash
npm run dev      # http://localhost:3000
npm run build
```

Production is live on Vercel:

| domain | status |
|---|---|
| `https://julianmirigoyen.online` | custom apex domain, verified |
| `https://www.julianmirigoyen.online` | custom `www` alias, verified |
| `https://julian-portfolio-six-omega.vercel.app` | stable Vercel alias |

Deployment, DNS, analytics, and verification details are documented in
[`docs/LAUNCH-2026-08-27.md`](docs/LAUNCH-2026-08-27.md).

---

## The scroll page

Built with **[scrollcraft](https://github.com/nateherkai/scroll-craft)** (Nate
Herk, MIT) — a Claude Code skill, not an npm package. The skill is **not
installed** as a plugin here; it was driven from a clone. To install it:

```
/plugin marketplace add nateherkai/scroll-craft
/plugin install nateherk-design
```

### The one rule

`public/scrollcraft/scrollcraft.js` and `app/scrollcraft.css` are the engine.
Treat them as vendored code with local extensions. The clip holds, dual
playheads, mobile spans, whole-word typing, and teardown behavior are documented
in [`docs/SCROLL.md`](docs/SCROLL.md). Re-vendoring must preserve those additions.
Theming lives in `app/theme.css`; hobby and career layouts use
`app/scroll/Experience.module.css`.

### Act structure

Six acts. No `data-sc-drift` anywhere — the page hard-cuts, and `devices.md`
§10 is explicit that "a cut is not an interpolation", so every section paints
its own opaque ground.

| # | act | device | content |
|---|---|---|---|
| 1 | `scrub` span 12.2 desktop / 32 mobile, dwell 0.55 | scrub | The mark reveal, full-bleed on near-black; headline reveals slowly as scroll begins |
| 2 | flow | `in` + stagger | Portrait, intro, index with dotted leaders |
| 3 | `pan` span 8.2 | pan | Nine rail cards in two tiers |
| 4 | flow | project features | Six hobby projects and their reasons |
| 5 | flow | native disclosures | Nine detailed career entries |
| 6 | `pin` span 2 | magnet | Close |

The opening and work rail keep their motion; long-form project and career details use normal document flow.

### Header and content

The fixed header carries contact links, the CV download, a theme switch, and a
thin scroll-progress line. The former “4/4 PASS” section counter was removed.

Fifteen projects, in three groups:

- **Currently working on (01–05)** — Supersolid, DJINN, Poor Hedge Fund,
  Keonda, and Luxy.
- **Also shipped (06–09)** — Half Production, Speed Ibiza, Innovalport,
  and Outflow. These follow the current work in the horizontal rail.
- **Hobby projects (10–15)** — jtreks, Ascenso, Solana Sniper, IMHO,
  Pushy, and Hermes Thrice. Each feature leads with Julian's “Why?”. jtreks and Ascenso get
  larger features, with Hermes Thrice closing on music and visuals; the
  illustrated meme chart links to all six projects. Its bottom-to-top order is
  Pushy, IMHO, Solana Sniper, Hermes Thrice, jtreks, Ascenso. The story order
  above stays independent of the graph.

`Experiments.tsx` and `Experience.module.css` own the hobby section. Product
images are in `public/work/`, `public/fleet/`, and `public/experiments/`.
Ascenso's cover is artwork from the project's own public asset collection.
jtreks uses a full-bleed photograph of Fitz Roy, visually verified against the
source. See [`public/experiments/README.md`](public/experiments/README.md) for provenance.

The nine expandable career entries come from `app/console/data.ts`, the shared
source for the public page and console. `Career.tsx` uses native details/summary
controls and refreshes scroll geometry when an entry opens or closes.

### The address strip, and the state dot

Every card in the rail opens with a mono strip: its number, a state dot, and
the real address — or the real reason there isn't one.

| state | dot | means | example |
|---|---|---|---|
| `live` | green, pulsing | openable right now | `● LIVE · SUPERSOLID.CO` |
| `private` | cobalt, still | in production, no public URL | `● PRIVATE · IN PRODUCTION` |
| `build` | hollow ring | shipped to a device, not the web | `○ TESTFLIGHT · IOS` |

The dot respects `prefers-reduced-motion`. The `state` field is a factual
claim: use `live` only for a publicly openable surface. The rail's pointer depth
effect runs only on supported desktop inputs; touch and reduced-motion readers
keep the regular rail.

A card with nothing to photograph gets a **stated placeholder panel** in the
frame where the screenshot would go — `NO PUBLIC SURFACE YET`,
`IOS · TESTFLIGHT BUILD` — never a borrowed picture. Same box, same rhythm, and
it says why it is empty.


### Voice

Julian's own, from `~/code/30+/hermes-thrice/clients/julianmirigoyen/resume.json`
plus a bio he supplied directly. Plain, first person, specific. Two hard rules:

- **Eight years**, not seven.
- **Never mention ITBA.** He did not go.

No counter-stacking. An earlier build leaned on LOC totals and test counts and
was cut for it.

---

## Assets

| path | notes |
|---|---|
| `public/reveal/mark.mp4` | Current desktop scrub clip. |
| `public/reveal/mark-m.mp4` | Current mobile scrub clip. |
| `public/reveal/mark-poster.jpg` | Current poster, holds the stage until video paints. |
| `public/reveal/supersolid.mp4` | Older scrub asset, still present but not used by the current open. |
| `public/reveal/supersolid-m.mp4` | Older mobile scrub asset, still present. |
| `public/reveal/supersolid-poster.jpg` | Older poster, still present. |
| `public/julian.png` | 800x800 portrait, supplied by Julian |
| `public/work/*.png` | the eight rail products with a screenshot |
| `public/fleet/*.png` | Console assets; IMHO also appears in the public hobby section |

### Re-encoding the reveal

Sources live in `~/code/supersolid/brand/`. **Always re-encode before using one
as a scrub clip** — the masters ship a sparse GOP (14 keyframes across 200
frames), which plays perfectly and scrubs like mud:

```bash
bash <skill>/scripts/encode.sh in.mp4 public/reveal/mark.mp4          # -g 8
bash <skill>/scripts/encode.sh in.mp4 public/reveal/mark-m.mp4 mobile # -g 4
```

That lifts it to 25 and 50 keyframes.

**Use the square 1080x1080 render for mobile, not a 720p cut of the 16:9 one.**
Cover-cropped into a 390x844 portrait the 16:9 clip shows only the lit centre
of the frame; copy over it measured 2.04:1. The square render plus a denser
bottom-up scrim measures 4.67:1.

---

## Verification

Use a production build for browser verification. The four repo-owned checks
exercise different failure modes; a build alone does not verify motion.

```bash
npm run build
npm run start -- -p 4330
# In another terminal:
SCROLL_URL=http://127.0.0.1:4330 npm run test:scroll
SCROLL_URL=http://127.0.0.1:4330 npm run test:motion
SCROLL_URL=http://127.0.0.1:4330 npm run test:rail
SCROLL_URL=http://127.0.0.1:4330 npm run test:hobbies
```

- `test:scroll`: forward/reverse playback, hold, bloom, index, rail travel, remount.
- `test:motion`: phone/desktop readability, fixed header, theme persistence,
  reduced motion, PDF download, and private console protection.
- `test:rail`: real wheel events down and back up, then every card in both
  directions. This caught the transformed-bounds feedback bug that jump tests missed.
- `test:hobbies`: separate chart/story orders, all six links, nine career
  disclosures, keyboard toggling, downstream scroll geometry, and overflow.

The browser scripts use `playwright-core` with local Chrome. Override
`CHROME_EXECUTABLE` if Chrome is installed elsewhere. `SCROLL_URL` also accepts a
hosted deployment. Screenshots and logs belong in ignored `lab/`.

The complete September 9 repair and content record is in
[`docs/PRODUCTION-FIX-2026-09-09.md`](docs/PRODUCTION-FIX-2026-09-09.md).
The following notes describe limitations of the older upstream visual harness.

### The one harness report to ignore, and why

It prints `CONTRAST FAIL 1.01:1` on the bio paragraph. That is a sampling
artifact: the harness measures at act progress 1.0, where that cue is
legitimately at **opacity 0**, so it is measuring text that is not on screen.
Measured properly — background luminance under the copy block at 11 scroll
positions, against the brightest pixel in the region — the real worst case is
**4.70:1 desktop and 4.67:1 mobile**. Both clear 4.5:1.

Do not "fix" this by holding the cue: `devices.md` is explicit that only the
last act may hold, and a held cue on a middle act stays lit through the whole
un-pin slide.

### What the harness does NOT catch

It samples **pinned acts only**, so `flow` sections get zero frames and can be
completely broken while it reports green. After any change, check by hand:

```js
// every staggered container must have picked up sc-in
[...document.querySelectorAll("[data-sc-stagger]")].map(e => e.classList.contains("sc-in"))
// the pan rail must actually travel — measure at 1920, 1440, 1280 and 390
document.querySelector(".jx-rail").scrollWidth - innerWidth   // want >= half a viewport
// nothing may stick out of the viewport
[...document.querySelectorAll("main *")].filter(e => { const r = e.getBoundingClientRect();
  return r.width && r.height && !e.closest(".jx-rail") && (r.left < -1 || r.right > innerWidth + 1); })
```

---

## Engine traps found the hard way

All six of these produce invisible or garbled content **while the harness
reports green**.

1. **`data-sc-stagger` alone does nothing.** The observer only watches
   `[data-sc-in]`, but `[data-sc-stagger] > *` is styled `opacity: 0` — so a
   container with stagger and no `data-sc-in` leaves every child permanently
   invisible. Three whole acts shipped blank this way. Always write
   `data-sc-in data-sc-stagger="70"`.
2. **`data-sc-kinetic` must sit on the same element as `data-sc-cue`.** The
   engine reads it off the cue node. A cue on a wrapper with kinetic on the
   `<h1>` inside silently does nothing — no split, no error.
3. **`.sc-copy` and `.sc-wrap` do not compose.** `.sc-copy` sizes itself from
   its insets; `.sc-wrap` forces `width: 100%` and overflows.
4. **`.sc-copy--center` breaks under 860px.** The engine's mobile block resets
   `.sc-copy`'s `inset-inline`, dropping `left: 50%`, but `translate: -50%`
   survives — dragging the block half its width off the left edge. `theme.css`
   carries the reset.
5. **`data-sc-count` only fires inside an act.** In a plain `flow` section a
   counter sits at its initial text, usually `0`.
6. **Kinetic line spans stand ~13px taller than their advance.** Any descender
   at a line *end* reappears over the line below. Use baseline punctuation
   (periods, not commas) at line ends in display type. The engine already adds
   its own descender padding; adding more deepens the overlap.

Plus one the skill's own docs warn about: **the pan-rail overflow bug survives
a green run.** Measure `scrollWidth - innerWidth` by hand.

And one found on 2026-08-26: **`data-sc-span` does not scale itself.** The
engine maps the rail's whole `scrollWidth` onto whatever span the act declares,
so adding cards at a fixed span makes the pan travel further in the same scroll
distance — it just gets faster. The rail currently uses `span 8.2` because it
carries nine cards plus a divider. Remeasure after any card is added or
removed.

---

## Design constraints

- **Contrast on the paper ground was measured, not eyeballed.** `--ink-3` must
  be `#63686f` (5.06:1) and the live-state green `#0a6b49` (5.89:1). The obvious
  lighter greys failed at 2.89:1 and 3.93:1.
- **Hobbies and career stay in document flow.** Long content must remain
  reachable on short viewports and after disclosures expand.
- **The portrait stays small** (224px desktop, 112px mobile). The scrub open is
  the page's only spectacle; a full-bleed face competes with it.
- **Only real numbers.** A counter is a truth claim with motion attached.

---

## Fingerprint registry

Shared with `djinn-site` at `~/code/supersolid/scrollcraft/FINGERPRINTS.md`,
resolved via `.scrollcraft.json` in this repo. The brief is at
`~/code/supersolid/scrollcraft/builds/julian-portfolio/BRIEF.md`.

A new scrollcraft build must differ from **every** row there on at least 4 of
6 dimensions: grammar, nav treatment, hero device, act-sequence shape, close
pattern, signature move. This build differs from `djinn-site` on 6 of 6.

---

## Design history

Three directions were built and cut before this one. The rejections are the
useful part:

1. **INSTRUMENT (amber on black, live uptime counter, scroll-as-elapsed-time).**
   Cut on tone — it proved things constantly, and the Supersolid brand voice is
   explicitly "not proving anything".
2. **Supersolid VHS (Anton, saturated red, grain, scanlines, tracking-error
   signature).** On-brand, but cut: "vary from the original supersolid theme".
3. **Plain paper.** Right direction, not enough craft — "waaaay better".

The current build keeps paper and adds the one thing that was missing: the
Blender reveal as a full-bleed scrub open.
