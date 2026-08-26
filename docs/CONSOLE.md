# `/console` — the instrument view

The second reading of the same material. `/` is the scroll page; `/console` is
a keyboard-driven operations console that trades spectacle for density.

**It is hidden from production** (see *Visibility* below) and is meant to be
sent as a deep link to one person at a time — a client, an interviewer — who
wants the whole picture. That sets the two design constraints it is built to:

1. **Dense.** More per screen than the scroll page, everything scannable,
   nothing that needs a click to reveal what it is.
2. **Readable cold.** The recipient has never seen it. Controls are visible
   rather than hidden, the status vocabulary is spelled out on screen, and the
   first paragraph says what the view is.

Nothing here uses the scrollcraft engine. It is plain React + Tailwind on the
tokens in `app/globals.css`.

---

## Visibility

`/console` **404s in production.** One constant drives it:

```ts
// app/console/visibility.ts
export const CONSOLE_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_CONSOLE === "1";
```

Read in three places, deliberately:

| place | effect |
|---|---|
| `app/console/page.tsx` | `notFound()` when false |
| `app/scroll/Timeline.tsx` | the link on the scroll page disappears |
| `app/robots.ts` | `Disallow: /console` on builds where it *is* on |

A hidden route with a live link pointing at it is worse than no gate, which is
why the link is gated by the same constant rather than by hand. The page also
carries `robots: { index: false, follow: false }` as belt and braces.

To switch it on in production: set `NEXT_PUBLIC_SHOW_CONSOLE=1` in the Vercel
project environment. Locally it is always on.

Verified against a real production server, not inferred from the build output —
`next build` still *lists* `/console` as a route because the 404 happens at
render:

```bash
npm run build && PORT=3100 npm run start
curl -o /dev/null -w "%{http_code}" http://localhost:3100/console   # 404
```

---

## The keyboard layer

The thing that makes it an instrument. All of it lives in `Console.tsx`, with
`Palette.tsx` and `Help.tsx` as the two overlays.

| key | does |
|---|---|
| `⌘K` / `Ctrl K` | command palette — every pane and every work, filterable |
| `1` … `9` | jump to that pane; the rail is numbered so this is discoverable |
| `j` / `k` | next / previous pane |
| `g` then a letter | jump to the pane starting with it (`g w` → works) |
| `?` | the shortcut sheet |
| `esc` | close whatever is open |

Three rules that keep it from being annoying:

- **Bare keys never fire while typing.** `typing()` in `Console.tsx` checks for
  `INPUT`, `TEXTAREA`, `SELECT` and `contentEditable`. Without it, typing
  "3jk" into the palette would navigate three times. Verified by hand with
  that exact string; there is no committed test, so re-check it if the handler
  changes.
- **`⌘K` works from inside a field**, because it is a modifier combination and
  toggling the palette shut from within it is expected.
- **The `g` chord expires** after 1.2s, so a stray `g` does not swallow the
  next keystroke.

Every shortcut is written down on screen: the trigger is a visible `SEARCH ⌘K`
button in the top strip, a `?` button sits beside it, the palette's footer
lists its own keys, and the rail carries the digit for each pane. Nothing here
has to be guessed at.

The palette's `run()` has one deliberate branch: an entry with **no public URL
does not open a window**, it navigates to `works` so the reader lands on the
entry rather than on nothing.

---

## Layout

```
app/console/
├── page.tsx          the route (404s in production)
├── visibility.ts     CONSOLE_ENABLED — the one gate
├── Console.tsx       shell: pane state, hash sync, routing, keyboard
├── Palette.tsx       the ⌘K command palette
├── Help.tsx          the ? shortcut sheet
├── Chrome.tsx        TopStrip · Rail · Tape
├── Lattice.tsx       the canvas figure on CONTACT
├── data.ts           RAIL · TAPE · SYSTEMS · CAREER · WORKS   ← single source of truth
└── panes/
    ├── Overview.tsx     the status board: all entries grouped by state
    ├── Works.tsx        the full catalogue          (13 entries)
    ├── SystemPane.tsx   renders one SYSTEMS entry
    ├── Solver.tsx       the expectancy solver, inside TRADING
    ├── Fleet.tsx        jtreks + IMHO plates, client strip
    ├── Career.tsx       the bio and the timeline
    └── Contact.tsx      Lattice + links
```

`VALID` in `Console.tsx` is now derived from `RAIL`, so adding a rail entry
wires the deep link and the digit shortcut automatically — the old failure
where a pane worked by click but not by URL is gone.

`data.ts` feeds **both routes**. The scroll page imports `CAREER` from it. Change
a figure there and it changes everywhere — which is the point.

---

## Navigation

Three mechanisms, all in `Console.tsx` and `Chrome.tsx`:

- **The rail** is the nav. Each entry is a `PaneId`; clicking swaps the pane and
  pushes a hash.
- **Hash sync.** `#works`, `#trading` and so on are shareable and the back
  button works. `VALID` gates which hashes resolve, and is derived from `RAIL`,
  so it cannot fall out of step with the visible nav.
- **Two exits to `/`.** A `← MAIN VIEW` button in the top strip, visible at every
  width including mobile, and a `← main view` entry at the top of the rail's
  links footer (desktop only, where the other links live).

The links footer renders `↗` only for `http` hrefs. That glyph means "leaves
the site"; an internal route must not carry it.

### Adding a pane

1. Add the id to the `PaneId` union in `data.ts`
2. Add a `RAIL` entry (label, state dot, meta)
3. Add the render branch in `Console.tsx`

`VALID` derives from `RAIL`, so the hash route, the digit shortcut and the
palette entry all follow from step 2.

---

## `WORKS` — the catalogue

The console's job is depth, so `WORKS` carries what the scroll page has no room
for. Thirteen entries:

| status | entries |
|---|---|
| `live` | DJINN, Supersolid, Half Productions, Trading platform, Speed Ibiza, Luxey, Outflow, IMHO, jtreks.co |
| `idle` | Hermes |
| `offline` | Pushy |
| `building` | Ascenso |
| `research` | Solana Sniper |

Shape:

```ts
{
  id, name,
  status: "live" | "idle" | "offline" | "building" | "research",
  href: string | null,
  one:    // one line, shown collapsed
  detail: // a full paragraph, shown expanded
  stack:  string[]        // rendered as chips
  facts:  { k, v }[]      // rendered as a 4-cell readout bank
}
```

### The status vocabulary is load-bearing

These five words mean different things and the pane renders a legend for them,
because collapsing them into "live" would be a lie:

| status | means |
|---|---|
| `live` | running now, openable |
| `idle` | built, not currently running |
| `offline` | it had a deployment and it is down |
| `building` | in build, never shipped |
| `research` | research, never deployed |

**`href: null` is not a gap to fill.** An entry with no public URL renders
`no public url — <reason>` instead of a link. Three entries have no URL and
`pushy.ar` is down; pointing any of them at a related site would imply
something false. Ascenso previously linked to `jtreks.co` — the two share
elevation data but the game is not playable, so the link was removed.

### Only real figures

Same rule as the scroll page: a `facts` value is a truth claim. Everything in
there was mined from the source repos or the live sites. If a number is not
verified it does not go in.

---

## Theme scoping — read this before touching CSS

`app/theme.css` styles the **scroll page only**, but it is imported in the
shared root layout, so every rule in it reaches `/console` too.

`globals.css` (the console) and `theme.css` (the scroll page) use **the same
token names** — `--ink`, `--ink-2`, `--ink-3`, `--rule` — with opposite values.
When `theme.css` declared them on a bare `:root`, it silently repainted the
console: paper-coloured tokens on a dark chrome, text at roughly 1:1 against
its own background.

The fix, and the rule:

```css
/* theme.css */
body:has(.jx-page),
.jx-page { --ink: #14171b; /* … */ }
```

`.jx-page` wraps the scroll page's root and nothing else. **Anything in
`theme.css` that is not `.jx-*`-prefixed or scoped this way will leak.** That
includes blunt resets — `* { border-radius: 0 }` flattened the console's
rounded chrome until it was scoped to `.jx-page *`.

Verify isolation after any CSS change:

```js
// on /console  → dark chrome, light ink
// on /         → paper, dark ink
getComputedStyle(document.body).backgroundColor
getComputedStyle(document.body).getPropertyValue("--ink")
```

### The one deliberate exception

```css
:root { --font-jb: var(--font-code); }
```

Unscoped on purpose. `globals.css` asks for `--font-jb` for every `.readout`
and `.lbl` in the console, and the layout exposes its mono face under a
different name. Without this alias the console loses its monospace readouts
entirely and falls back to the body face — legible, but it stops looking like
an instrument.

It is a font pointer, not a colour, so it cannot collide. **If the layout's
mono variable is ever renamed again, this line has to follow it.** It has
broken twice for exactly that reason.

---

## Known state

- Both routes return 200; `tsc --noEmit` clean.
- `/console` depends on `public/fleet/jtreks.png` and `public/fleet/imho.png`.
  These were deleted once during a scroll-page rebuild that moved screenshots to
  `public/work/`, and `/console` served 404s until they were re-captured.
  **`public/fleet/` belongs to the console — do not clean it up with the scroll
  page's assets.**
- `CAREER` says eight years. The dated rows begin 2019, which reads as seven;
  the prose is Julian's own claim and the rows are the record. If a pre-2019
  role exists it should be added rather than the number changed.
