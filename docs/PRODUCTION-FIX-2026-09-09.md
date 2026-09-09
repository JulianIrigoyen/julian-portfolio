# Repair the motion portfolio

The motion edition remains the homepage at `/`. The alternate editorial design
is outside the application in ignored local review files and is not deployed.

The September 3 production deployment used the older character animation. Its
mobile headline split “good” across two lines, and its header wrapped. The current
motion renderer groups whole words and includes the pending header, stage-padding,
and career-column fixes from the existing working tree.

This repair also aligns the practice label with the mobile reading window, gives
the icon-only CV link an accessible name, and keeps the introduction inside short
phone screens. Reduced motion now renders visible text over the still poster;
it does not require scrolling through an empty pinned intro.

The normal-motion choreography remains: the opening reveal, typed introduction,
heart hold, bloom transition, horizontal work rail, and career section. The
private console retains its existing authentication gate.

## Verification

```sh
npm run build
SCROLL_URL=http://127.0.0.1:4330 npm run test:scroll
SCROLL_URL=http://127.0.0.1:4330 npm run test:motion
```

`test:scroll` checks forward and reverse playheads, the heart hold and transition,
the index, horizontal rail, and remount behavior. `test:motion` checks readable
copy, whole-word animation, fixed header controls, horizontal overflow, theme
persistence, reduced motion, the CV download, and console authentication at
360, 390, 430, and 1440px widths. `SCROLL_URL` accepts the deployment URL for the
same checks against a hosted build.

The previous production deployment is `dpl_Akd7NuNdoAKZond12Yn5oTxB69C4`
(`julian-portfolio-10o9ckwxp-julianirigoyens-projects.vercel.app`). Keep it available
as the rollback target until the replacement passes checks on the public domain.

## Production deployment

Deployed September 9, 2026: `dpl_C9jjpsvWueaoqszEEhcrGLZBf2DE`.
Vercel reports Ready and aliases both `julianmirigoyen.online` and
`www.julianmirigoyen.online` to this deployment.

`test:motion` passed against `https://julianmirigoyen.online` at all four
viewport widths, including reduced motion, theme persistence, the PDF download,
and private console protection. Local evidence is in
`lab/motion-production-live/report.json` and the adjacent screenshots.

`test:scroll` also passed on the public domain for mobile and desktop, with no
browser console errors. Forward and reverse playback, the heart hold, bloom,
index reveals, horizontal rail, and engine remount all passed. Evidence:
`lab/portfolio-refresh/live-scroll-check.log`.

## Follow-up: returning cards, hobby projects, and career

The card disappearance was reproducible with real wheel events: the old depth
effect fed transformed bounds back into its next transform. DJINN reached 5.7
times its normal width and remained off-screen. `RailDepth.tsx` now measures
layout coordinates relative to the translated rail. The new `test:rail` failed
on the former deployment and passed on the repaired public site.

The portfolio now has nine cards in its work rail. Hobby projects appear in the
requested order: jtreks, Ascenso, Solana Sniper, IMHO, Pushy. Each carries Julian's
own reason for making it, and the illustrated chart links to all five. The career
section has nine expandable entries sourced from the existing resume and CV.
Opening entries refreshes the scroll engine's cached geometry. The misleading
section PASS counter and its badges are gone.

Final deployment: `julian-portfolio-33dearqtd-julianirigoyens-projects.vercel.app`,
aliased to `julianmirigoyen.online`. Build and scoped lint passed. The motion and
rail regression checks passed, and the hobby and career layout was checked at
390, 768, and 1440px, plus desktop dark mode. `test:hobbies` checks all five chart links,
all nine disclosures, keyboard toggling, and the closing section's geometry.
It passed on the final public deployment at 390px and 1440px; the log is
`lab/portfolio-refresh/hobbies-functional-live.log`.

## Hermes Thrice

Added hobby project 15 from Julian's description: his reason for making music
tools, library analysis and search by tone/BPM/genre, drum/beat/bassline makers,
and music-to-visual engines. A full-width feature pairs the copy with an SVG
waveform illustration. The index and chart now include six hobby projects.

Deployed as `julian-portfolio-karumpnw0-julianirigoyens-projects.vercel.app`,
aliased to `julianmirigoyen.online`. Build and scoped lint passed. Layout was
reviewed at 390, 768, and 1440px and in desktop dark mode. `test:hobbies` passed
on production at 390px and 1440px, including all six chart links and the career
disclosures. Evidence: `lab/portfolio-refresh/hermes-hobbies-live.log`.

## Final portfolio handoff

The September 9 work is complete on `redesign/scroll-and-console`. The deployed
homepage is the motion edition, with the original opening choreography and a
repaired return path through the nine work cards. The About section uses normal
sans-serif text. The fixed header contains contact/CV links, theme switching,
and scroll progress; no section counters masquerade as test results.

The six hobby stories remain ordered jtreks, Ascenso, Solana Sniper, IMHO,
Pushy, Hermes Thrice. The user's final graph order is independent: Pushy at the
bottom, then IMHO, Solana Sniper, jtreks, Ascenso; Hermes retains its existing
last position. HTML anchors give every graph point a 44px hit target. jtreks now
uses a full-bleed, visually verified photograph of Fitz Roy instead of an inset
website screenshot. Its source and public-domain release are recorded in
`public/experiments/README.md`.

Career details use native disclosures and the shared resume data. Both TrueML
roles remain separate, as do Intive and Globant. Expanding a role tells the
scroll engine to recompute the closing section's position. Hobby reasons come
from Julian's own descriptions. No star counts or performance claims were
invented; Pushy has no invented public app link, and Hermes Thrice's music tools
are not linked to the unrelated older LLM framework.

Final deployment: `julian-portfolio-c8xfg719p-julianirigoyens-projects.vercel.app`,
aliased to `https://julianmirigoyen.online`. Final build and scoped ESLint passed.
The final local hobby and rail checks passed at 390px and 1440px; the hobby check
also passed on the public domain. The photograph was inspected in its desktop
and mobile crops. Earlier motion/scroll checks and their scope are recorded above.

Local evidence lives in ignored `lab/portfolio-refresh/`: `final-build.log`,
`final-lint.log`, `final-hobbies.log`, `final-rail.log`, `final-hobbies-live.log`,
`final-photo-390.png`, `final-photo-1440.png`, and `final-portfolio-deploy.log`.
These logs are local diagnostics; the runnable verification scripts are committed.

Known boundaries: the long mobile intro is intentional and unchanged; the
console remains protected; this pass does not migrate Next's deprecated
middleware convention. Earlier deployment entries above are historical
checkpoints, not the current alias. The prior Hermes checkpoint remains
available in Vercel if a rollback is needed.

Next task: redesign the jtreks landing in an isolated worktree. The source tree
at `30+/hermes-thrice/clients/jtreks` has uncommitted Domuyo, summit, and locale
work owned by another session. It must not be edited or staged by the landing
redesign. The landing branch starts from `bdb1c6191` and will touch only its own
page/components; integration must preserve those existing changes.
