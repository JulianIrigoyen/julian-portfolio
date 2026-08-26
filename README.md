# julian-portfolio

Julian Irigoyen's portfolio. Next.js 16 (Turbopack) + Tailwind v4 + TypeScript.

Two builds live side by side:

| route | what |
|---|---|
| `/` | **The scroll page.** A dark filmic `scrub` open hard-cutting into a paper editorial gallery. Built on the scrollcraft engine. |
| `/console` | **The previous INSTRUMENT build** — a fixed-viewport operations console, carrying the full 13-entry catalogue in depth. Kept reachable rather than deleted. Documented in [`docs/CONSOLE.md`](docs/CONSOLE.md). |

```bash
npm run dev      # http://localhost:3000
npm run build
```

A `.vercel` link for project `julian-portfolio` appeared in the working tree on
2026-08-26 (another session in this shared checkout). Whether anything has been
promoted to production has not been checked from here.

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
They are vendored **byte-identical to upstream and are never edited**. All
theming lives in `app/theme.css`: the engine's six colour roles, two font
families, and page-owned `jx-` classes. `djinn-site` vendors the same engine
the same way.

### Act structure

Six acts, ~17.7 viewport-heights. No `data-sc-drift` anywhere — the page hard
-cuts, and `devices.md` §10 is explicit that "a cut is not an interpolation",
so every section paints its own opaque ground.

| # | act | device | content |
|---|---|---|---|
| 1 | `scrub` span 2.8, dwell 0.35 | scrub | The Supersolid Blender reveal, full-bleed on near-black |
| 2 | flow | `in` + stagger | Portrait, intro, index with dotted leaders |
| 3 | `pan` span 7.4 | pan | Nine products in two tiers, lateral — breadth reads sideways |
| 4 | `pin` span 3.2 | reveal | The lab: four pieces, typographic |
| 5 | flow | `in` + stagger | The record — eight years, hung year column |
| 6 | `pin` span 2 | magnet | Close |

Never the same device twice in a row. Six device families in play.

### The signature move

**The page runs its own test suite.** Every section carries an assertion that
sits pending until the reader actually reaches it, then resolves to `PASS`;
the fixed runner bar keeps a live count (`4/4 PASS`). Drawn from Julian's own
bio — he builds the testing frameworks around what he ships. The count is
real and cannot read higher than the number of assertions on the page.

Implementation: `app/scroll/Suite.tsx`.

### Content

Thirteen pieces, in three tiers. The order in the rail is Julian's own — the
studio first, then the agent, then the thing the studio exists for.

- **Currently working on (01–06)** — Supersolid, DJINN, the trading platform,
  jtreks, Keonda, Luxy. The act headline is *"Being built, or running, as you
  read this"*, so this tier is a claim about **now** and only holds work that
  is live or in active build.
- **Also shipped (07–09)** — Speed Ibiza, Innovalport, Outflow. Finished client
  work, behind a hairline divider panel in the same rail. The divider exists so
  the six in front are not diluted by things that are simply done.
- **The lab (10–13)** — Solana Sniper, IMHO, Pushy, Ascenso. Deliberately
  **typographic, no screenshots**: three have no public URL and `pushy.ar` is
  offline, so a gallery there would be faking it.

Screenshots live in `public/work/`, captured live with `playwright-core` at
1440x900 @2x. Every link opens the running product.

The career rows come from `app/console/data.ts`, which is still the single
source of truth for both routes.

### The address strip, and the state dot

Every card in the rail opens with a mono strip: its number, a state dot, and
the real address — or the real reason there isn't one.

| state | dot | means | example |
|---|---|---|---|
| `live` | green, pulsing | openable right now | `● LIVE · SUPERSOLID.CO` |
| `private` | cobalt, still | in production, no public URL | `● PRIVATE · IN PRODUCTION` |
| `build` | hollow ring | shipped to a device, not the web | `○ TESTFLIGHT · IOS` |

**The pulsing dot is the only animated thing on the paper half of the page.**
It is what earns the headline instead of decorating it, which means the `state`
field is a truth claim on the same footing as a counter — it does not get set
to `live` for something you cannot open. It respects
`prefers-reduced-motion`.

A card with nothing to photograph gets a **stated placeholder panel** in the
frame where the screenshot would go — `NO PUBLIC SURFACE YET`,
`IOS · TESTFLIGHT BUILD` — never a borrowed picture. Same box, same rhythm, and
it says why it is empty.

Card tails (tech line and call) share one baseline across the whole rail via
`.jx-card__foot { margin-top: auto }`. Cards stretch to a common height either
way; this only decides where the slack goes.

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
| `public/reveal/supersolid.mp4` | 1920x1080, 200f. The scrub clip. |
| `public/reveal/supersolid-m.mp4` | 720x720 **square** render for portrait |
| `public/reveal/supersolid-poster.jpg` | frame 0, holds the stage until video paints |
| `public/julian.png` | 800x800 portrait, supplied by Julian |
| `public/work/*.png` | the seven products with a public URL |
| `public/fleet/*.png` | jtreks + IMHO — **used by `/console` only** |

### Re-encoding the reveal

Sources live in `~/code/supersolid/brand/`. **Always re-encode before using one
as a scrub clip** — the masters ship a sparse GOP (14 keyframes across 200
frames), which plays perfectly and scrubs like mud:

```bash
bash <skill>/scripts/encode.sh in.mp4 public/reveal/supersolid.mp4          # -g 8
bash <skill>/scripts/encode.sh in.mp4 public/reveal/supersolid-m.mp4 mobile # -g 4
```

That lifts it to 25 and 50 keyframes.

**Use the square 1080x1080 render for mobile, not a 720p cut of the 16:9 one.**
Cover-cropped into a 390x844 portrait the 16:9 clip shows only the lit centre
of the frame; copy over it measured 2.04:1. The square render plus a denser
bottom-up scrim measures 4.67:1.

---

## Verification

The skill ships a headless-Chrome harness that walks the finished page and
reports dead scroll, cues that never reach full opacity, per-line contrast on
the composited page, and frozen scrub clips.

```bash
node <skill>/scripts/shoot.mjs --url http://localhost:3000 --out lab/desktop --per-act 6
node <skill>/scripts/shoot.mjs --url http://localhost:3000 --width 390 --height 844 --out lab/mobile --per-act 5
node <skill>/scripts/shoot.mjs --url http://localhost:3000 --reduced-motion --out lab/reduced --per-act 4
```

Current state: **no dead scroll**, **clip keeps moving**, zero overflowing
elements, rail travels at every width, `4/4 PASS`.

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
distance — it just gets faster. The rail measures **5362px at 1440**, which is
why the act is `span 7.4` and not the 6 it carried with four fewer cards. Remeasure
after any card is added or removed.

---

## Design constraints

- **Contrast on the paper ground was measured, not eyeballed.** `--ink-3` must
  be `#63686f` (5.06:1) and the pass-green `#0a6b49` (5.89:1). The obvious
  lighter greys failed at 2.89:1 and 3.93:1.
- **The lab act stops pinning under 52rem.** Stacked at 390px its grid measures
  1209px inside an 844px stage — 477px simply unreachable, with no way to
  scroll inside a clipped stage.
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
