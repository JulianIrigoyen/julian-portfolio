# julian-portfolio

Dated record of what changed and why. Newest first. Design rules that outlive a
session belong in [`README.md`](README.md); this file is the log.

---

## [2026-08-26] The rail becomes a claim about now

Julian asked for three things: his new bio placed in the paper section, the
work section made "much more elegant", and the rail reordered to his own
priority. The section headline he wanted — *"being built and / or ran as you
read this"* — turned out to be the brief for the whole pass: a headline that
claims **now** has to be backed by evidence on the card, not asserted in copy.

### Copy — the bio, and the hand-off

`app/scroll/Timeline.tsx`, act 01b. His pasted bio is now three paragraphs:
team shapes and the product-owner work; the founder journey with Supersolid,
Dmitry Sabanin and Emiliano Migliorata; then the method (fail fast, automated
TDD, CI/CD, small concrete iterations). `supersolid.co` is an inline link
(`.jx-link`), not a bare sentence.

The bio hands off to the index, whose first row now reads
`01—06 · CURRENTLY WORKING ON` — the "suggestive" lead-in he asked for. Index
rows are `01—06 Currently working on / 07—09 Also shipped / 10—13 The lab / —
The record`.

Headline above it went from *"Nine things, five of them running right now"* to
**"Thirteen things, eight of them one click away."** Counted, not estimated:
seven cards in the rail carry an `href` plus IMHO in the lab.

### Structure — the order is his

Rail order, act 02: **Supersolid → DJINN → the trading platform → jtreks →
Keonda → Luxy.** Then a hairline divider panel — *"Also shipped · 07—09. Client
work. Finished, handed over, and still running without me."* — and behind it
Speed Ibiza, Innovalport, Outflow.

Two entries are new. **The trading platform** has no public surface, so its
card says so and closes on `LANDING PAGE NEXT`. **Keonda** is an iOS build on
TestFlight, not a website. Solana Sniper moved out of the rail into the lab,
which is now four cells (10–13) and fills its 2x2 grid evenly.

The divider exists so the six in front are not diluted by work that is simply
done. Without it, "currently working on" would have had to cover a DJ school's
website from last year.

### Design — the address strip

Every card now opens with a mono strip carrying its number, a state dot, and
the real address:

```
01                        ● LIVE · SUPERSOLID.CO
03                    ● PRIVATE · IN PRODUCTION
05                        ○ TESTFLIGHT · IOS
```

The `live` dot pulses. It is the only animated thing on the paper half of the
page — everything else there is still — which makes it the evidence for the
headline rather than decoration. It honours `prefers-reduced-motion`. A legend
in the lead panel states `live / private / in build` before the reader meets a
card that is not openable, so "private" is not discovered as a disappointment
two cards in.

The `state` field is now a truth claim on the same footing as a counter. `live`
means openable right now. All nine URLs were checked with `curl` before the
copy was written; all returned 200.

Other card work:

- **Stated placeholder panels** where a screenshot would be a lie —
  `NO PUBLIC SURFACE YET`, `IOS · TESTFLIGHT BUILD` — in the same frame, at the
  same aspect ratio, so the rail keeps one shape end to end. The two cards
  without shots previously had no visual at all and broke the rhythm.
- **A shared tail baseline.** `.jx-card__foot { margin-top: auto }` puts every
  tech line and every call on one line down the rail. Cards stretch to a common
  height either way; this decides where the slack goes.
- Trade kicker under each name, a short rule under it (accent on the two lead
  cards), and a hover that lifts the screenshot 3%.
- `.jx-go--mute` lost its bottom border. In a flex column it stretched to the
  full card width and read as an accidental rule.

### Mobile

At 390px the rail put two half-cards on screen and neither one read. Below
`52rem` every panel — lead, card, lead card, type card — is now
`min(86vw, 23rem)`, so one card fills the screen with a strip of the next
showing. Measured after the change: tallest card **604px in an 844px stage**,
so nothing clips inside the pinned act.

### Screenshots

Recaptured live at 1440x900 @2x with `playwright-core`.

- **Luxy** now points at `https://www.ibizaluxy.online/`, replacing
  `luxe-frontend-one.vercel.app`. New shot.
- **supersolid.co** plays a ~6s intro before its hero. The settled hero is
  white-on-white and reads as an empty card inside a white card, so the shot is
  deliberately the **intro frame at 4.5s** — the gold rosette over
  *"Let Man Know What Man Can"*. Timing is jittery; a sweep at 500ms steps
  picked the frame where the rosette has fully resolved.
- jtreks and DJINN refreshed from the same run.

### The pacing fix

`data-sc-span` on act 02 went **6 → 7.4**. The engine maps the rail's whole
`scrollWidth` onto whatever span the act declares, so four extra cards at a
fixed span do not stretch the act — they speed the pan up. Rail measures
**5362px at 1440**. Remeasure after adding or removing a card.

### Verified

`npx tsc --noEmit` clean. `npx next build` clean, five static routes. Nine pan
frames plus mobile and lab frames read back at 1440x900 and 390x844; lab grid
measured at 1280/1440/1600 and fits its stage at all three (790px content in a
900px stage at 1440).

The one `eslint` error — `set-state-in-effect` in `app/scroll/Suite.tsx` —
predates this pass and was not touched.

### Open

The trading platform card states in its own copy that it has no landing page
yet. The research for that page was not found anywhere under
`~/code/supersolid` — nothing about a landing page has been modified since
2026-08-24.
