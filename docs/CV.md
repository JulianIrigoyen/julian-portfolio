# The CV

`public/julian-irigoyen-cv.pdf` — two pages of A4, linked from the bar's
**Download CV** button and served at
`https://julianmirigoyen.online/julian-irigoyen-cv.pdf`.

It is generated. Do not edit the PDF.

---

## Rebuild it

```sh
cd ~/code/supersolid/julian-portfolio
python3 scripts/build-cv.py                       # writes /tmp/cv.html
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --virtual-time-budget=6000 \
  --no-pdf-header-footer --print-to-pdf=/tmp/cv.pdf /tmp/cv.html
cp /tmp/cv.pdf public/julian-irigoyen-cv.pdf
npx vercel --prod
```

`--virtual-time-budget=6000` matters. The stylesheet pulls Archivo and
JetBrains Mono from Google Fonts, and Chrome will print before the fonts land
without it. The result is a silent fallback to Helvetica — the PDF renders, it
just isn't the right document.

---

## Where the content lives

Two sources, split on purpose.

**`scripts/build-cv.py`** holds the prose: the summary, every role, every
bullet, and the education list. These are hand-written and edited in the
script. They are not in `resume.json` because the CV is an edited two-page cut,
not a dump of the record.

**`resume.json`** (`~/code/30+/hermes-thrice/clients/julianmirigoyen/`) supplies
only **skills** and **languages**. It is JSON Resume schema v1.0.0 and it also
feeds the hermes-thrice portfolio at `clients/julianmirigoyen`.

Consequence: adding a skill means editing `resume.json`; changing a bullet means
editing the script. Changing a fact — a date, a title, a claim — means editing
**both**, because the two documents can be read side by side.

---

## The layout

One grid runs the whole document:

```
[ 92px rail ][ 1px spine ][ content ]
```

Everything lands in it. Dates, section labels and skill-group names sit in the
monospace rail; entries, the summary and skill lists sit in the content column.
Every line in the CV shares the same two vertical edges. This is the reason the
skills block reads as part of the document rather than an appendix — before, it
was a separate two-column grid with a dangling cell.

Each entry carries a 4px accent square on the spine, level with the company
name. Section headings are a rail label plus a rule running the content column.

Two typefaces, both from the site: **Archivo** for text, **JetBrains Mono** for
the rail, contact row and footer. One accent, `#1f4fd8`, used on the spine nodes
and on the agentic-workflows-team line — nowhere else.

Dates break at the em dash only when the range exceeds 12 characters, so
`2022 — 2023` keeps one line while `Mar 2025 — Aug 2026` splits cleanly instead
of orphaning a bare year.

---

## Verify before shipping

Rendering green is not the same as reading right. Rasterise and look:

```sh
pdftoppm -png -r 110 /tmp/cv.pdf /tmp/pg
```

Then check three things by measurement, not by eye:

**Page fill.** Both pages should land in the 80–95% band. A page-two that stops
at 66% reads as unfinished.

```sh
for f in /tmp/pg-*.png; do
  H=$(magick identify -format "%h" "$f")
  B=$(magick "$f" -bordercolor white -border 1 -trim -format "%[fx:page.y+h]" info:)
  echo "$f $(python3 -c "print(f'{100*$B/$H:.0f}%')")"
done
```

**Text extraction.** The PDF must stay machine-readable or an ATS drops it.
Chrome emits Type 3 fonts, which sounds alarming but extracts fine — confirm it
rather than assume it:

```sh
pdftotext /tmp/cv.pdf - | wc -c     # ~4800 chars is right
```

**Content.** Grep the extracted text for what must be present and what must be
gone. Facts get removed on request and then reappear from a second copy you did
not know about — that is exactly how WorkFusion survived its first deletion.

---

## Traps hit

**An unscoped `li::before` leaked into the header.** The entry-bullet rule was
written as bare `li::before`, so the contact row rendered a small dash in front
of every item — including in front of each separator. Now scoped to `.v ul li`.
Nothing in the build failed; it only showed up on a zoomed crop of the render.

**Fonts fail silently.** Without a virtual time budget Chrome prints before
Google Fonts resolve, and the PDF is quietly set in the fallback stack. Check
with `pdffonts /tmp/cv.pdf` — Archivo and JetBrains Mono must both appear.

**A fact can live in two places.** WorkFusion was in `resume.json` twice: the
`certificates` array and a Globant highlight. Clearing the array left the bullet
standing. Grep the whole file, not the field you expect.

---

## Decisions worth remembering

**DJINN carries two dates.** In continuous development since January 2026;
running unattended on a cloud VM since June. Both are true and they mean
different things. Collapsing them into "since June" throws away five months;
collapsing them into "since January" overclaims the unattended part. The same
wording is used on the rail card in `app/scroll/Timeline.tsx` and in
`app/console/data.ts`.

**The agentic workflows team is on both TrueML entries, in the accent colour.**
It is the thread connecting TrueML to the agent work at Supersolid. Without it
the CV reads as two unrelated careers. It was previously invisible inside a grey
run of four dot-separated clauses.

**No certificates section.** WorkFusion was the only entry and it was dropped,
so the heading went with it.

**jtreks is not on the CV.** Removed on request.

---

## Open

**The TrueML achievement split is a judgement call.** `resume.json` originally
attributed the authZ platform, partial payments and the collector shim to the
**Senior Software Engineer** period (Mar 2024 – Mar 2025). The CV puts them on
**Senior Software Engineer II**. The files now agree, because the CV's version
came from Julian answering questions directly and `resume.json` was generated
from LinkedIn earlier. Nobody has confirmed the real split.

**Trinity College has no start year and an assumed location.** End year 2012 is
confirmed. "Buenos Aires" is not.

**LinkedIn is stale.** It still shows TrueML as current, has no Supersolid
entry, and lists the WorkFusion certificate. Only Julian can change it.
