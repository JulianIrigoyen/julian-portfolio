# julian-portfolio

Dated record of what changed and why. Newest first. Design rules that outlive a
session belong in [`README.md`](README.md); this file is the log.

---

## [2026-09-21] Socials in the header

GitHub, LinkedIn, X, Instagram and WhatsApp now also sit in the header, after the
page nav behind a hairline divider on desktop and as a row under the nav on
phones. One `SOCIALS` list feeds both the header and the footer so the two cannot
drift. Phone landing re-measured: the portrait is still fully above the fold.

## [2026-09-21] Phone landing: the portrait no longer straddles the fold

On a phone the redesign's full-width 5:4 portrait began at about 535px, and
Safari's first screen ends near 660px, so the fold cut the face in half on
arrival. Below 600px the portrait now leads the hero as a 116px square beside
the CV link (`order: -1` on `.portraitBlock`), with the headline and intro under
it. Reproduced and verified at 390×664 and 390×844 with `lab/shot-mobile.mjs`,
before and after, and again on the production domain after deploy.

The redesign itself (`app/portfolio/`, `app/page.tsx` mounting it,
`docs/REDESIGN-2026-09-17.md`, the console email fixes, the corrected CV) had
been live since September 18 without ever being committed; it is committed in
the same commit as this fix, `ff8613d`, exactly as deployed, so the repository
matches production again.

## [2026-09-17/18] About and Ascenso: Julian's words back; About column aligned

Commits on `redesign/scroll-and-console`, each deployed to production with
`vercel deploy --prod --yes` and verified on `julianmirigoyen.online`.

- **About, his words.** The September 15 commits (`d1fe566`, `8c076de`, `3a49a3f`)
  replaced the bio with an "approved" rewrite that was not his. His text, as it stood
  in `02ac0ff`, is back verbatim: the lede ("The world has changed. The complexity in
  engineering has shifted…") and the goal paragraph ("…as swiftly, elegantly and
  robustly as possible, to bring amazing products and services, and thus the future,
  to life."). Two paragraphs he cut himself on September 17 (TrueML/Supersolid; working
  style) stay out. The comment above the block says "do not smooth these"; mean it.
- **Ascenso, his line.** A September 9 session (`511c53d`) trimmed his August 26
  description to two sentences. The August 26 line is back in `Experiments.tsx`:
  altitude, elevation and route sources, hazards from having summited it, and the one
  elevation file feeding the game, the jtreks map and a 3D-printed keyring.
- **About column aligned.** Lede, body and index shared three different widths; they
  now share one 40rem measure (`--about-measure` in `theme.css`). The gold rule sits
  0.6rem under "Hi" instead of 1.6rem plus the grid gap. With the shorter copy the
  index mentions were already in the reveal band as the section arrived, so every row
  showed at once; `IndexMentionSync` now reveals a row when its mention reaches the
  top 30% of the viewport. All four page checks pass.
- **Deploying from this folder is unsafe while a redesign is in progress.** A second
  session left uncommitted work here (`app/portfolio/`, a modified `app/page.tsx` that
  mounts it, `docs/REDESIGN-2026-09-17.md`). `vercel deploy` uploads the working tree,
  not HEAD, so it would ship that redesign. The last two deploys were made from a
  clean `git worktree` of the commit (`npm ci`, `npm run build`, then deploy); do the
  same until that work is either committed on purpose or removed. Its Ascenso and
  About copy were rewritten without review; nothing from it is live.

## [2026-09-09] Poor Hedge Fund card rewritten

Commit `389f781` on `redesign/scroll-and-console`. The card's line is now the
sentence the fund uses everywhere: "A self-funded systematic fund. An Erlang
engine runs strategies against live orderbooks, every market and instrument its
own actor, with a web console and a native Mac and iPhone app built to view and
manage platform processes. Our own capital, our own risk." The meta line went
from "Rust · React" to "Erlang/OTP · React · SwiftUI", matching the rebuilt
platform. "Minus the funds", "that is the poor part" and "nobody else's" are
gone at Julian's request; the same wording shipped to supersolid.co and
poorhedgefund.com the same day.

## [2026-08-27] Custom domain launch and open retiming

The portfolio was deployed to Vercel production and attached to Julian's DonWeb
domain. The handoff lives in
[`docs/LAUNCH-2026-08-27.md`](docs/LAUNCH-2026-08-27.md), including exact DNS
records, Vercel project IDs, deployment ID, verification commands, and analytics
notes.

### Launch

Vercel project: `julianirigoyens-projects/julian-portfolio`.

Production aliases verified with `curl -I`:

- `https://julianmirigoyen.online`
- `https://www.julianmirigoyen.online`
- `https://julian-portfolio-six-omega.vercel.app`

DonWeb DNS stayed authoritative. The apex domain resolves to Vercel's
`76.76.21.21`, and `www` resolves to `cname.vercel-dns-0.com`.

### Analytics

Installed `@vercel/analytics` and mounted
`Analytics as VercelAnalytics` from `@vercel/analytics/next` in
`app/layout.tsx`. The existing env-gated analytics wrapper in
`app/analytics/Analytics.tsx` remains separate and only loads Clarity or GA4
when its public env var is present.

### Open

The opening headline changed from **"Eight years, every size of company."** to
**"I love a good challenge."** The line now uses the code face and a
scroll-driven character reveal:

- open act: `data-sc-span="7"`, `data-sc-dwell="0.55"`
- headline cue: `data-sc-cue="0 0.92 0.48 0.10"`
- headline kinetic: `data-sc-kinetic="chars"`
- body cue: `data-sc-cue="0.18 1 0.26 0.08"`

The nav treatment was checked in the dark open state, and the reveal media uses
the subtle `jx-open-float` animation. `agentive` was corrected to `agentic`.
The hand-off wording now says **"Currently working on"**.

### Verified

`npm run build` passed locally. A headless Chrome check against
`http://127.0.0.1:3002` confirmed the headline is hidden at `scrollY=0`, begins
appearing after scroll starts, the body copy follows during the same act, and
the media animation is active. The production deployment was then inspected as
`Ready`.

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
