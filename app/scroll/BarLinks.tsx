"use client";

/* ————————————————————————————————————————————————
   The bar's right-hand side.

   Three clusters, hairline-separated: the work, the person, the ask. The
   restraint is deliberate — the bar is 10.5px tracked mono and it is the only
   fixed chrome on the page, so anything loud in it competes with the open.

   The project marks are rendered as CSS masks rather than <img>. That way each
   one sits in the bar's own ink at rest and takes its brand colour only on
   hover, so three logos from three different palettes read as one row instead
   of a sticker sheet.
   ———————————————————————————————————————————————— */

const WORK = [
  { href: "https://supersolid.co",     mark: "supersolid", label: "Supersolid",     tint: "#c9a961" },
  { href: "https://poorhedgefund.com", mark: "phf",        label: "Poor Hedge Fund", tint: "#c9a84c" },
  { href: "https://jtreks.co",         mark: "jtreks",     label: "jtreks",          tint: "#c96a2a" },
];

const WA = "https://wa.me/5491136639160";
const IG = "https://instagram.com/julianmirigoyen";
const X  = "https://x.com/irigoyai";

export default function BarLinks() {
  return (
    <div className="jx-bar__right">
      <nav className="jx-marks" aria-label="Projects">
        {WORK.map((w) => (
          <a
            key={w.mark}
            className="jx-mark"
            href={w.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ["--tint" as string]: w.tint }}
          >
            <i
              className="jx-mark__i"
              aria-hidden
              style={{ ["--src" as string]: `url(/marks/${w.mark}.svg)` }}
            />
            <span className="jx-mark__label">{w.label}</span>
          </a>
        ))}
      </nav>

      <i className="jx-bar__rule" aria-hidden />

      <nav className="jx-social" aria-label="Elsewhere">
        <a className="jx-soc" href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <path fill="currentColor" d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9a9.8 9.8 0 0 0 1.35 4.96L2 22l5.29-1.38a9.9 9.9 0 0 0 4.75 1.21h.01A9.9 9.9 0 0 0 22 11.93 9.9 9.9 0 0 0 12.04 2Zm5.8 14.05c-.24.68-1.4 1.3-1.94 1.35-.5.05-.98.23-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.13-.13-.19-1.12-1.49-1.12-2.84 0-1.35.7-2.01.95-2.29.25-.27.55-.34.73-.34l.52.01c.17 0 .4-.06.62.48.24.57.8 1.98.87 2.12.07.14.12.3.02.49-.1.19-.15.3-.29.47-.14.16-.3.36-.43.49-.14.14-.29.29-.13.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.28 2.29 1.42.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.37-.24.63-.14.25.09 1.65.78 1.94.92.28.14.47.21.54.33.07.11.07.66-.17 1.34Z" />
          </svg>
        </a>
        <a className="jx-soc" href={IG} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
          </svg>
        </a>
        <a className="jx-soc" href={X} target="_blank" rel="noopener noreferrer" aria-label="X">
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <path fill="currentColor" d="M17.53 3h3.02l-6.6 7.54L21.75 21h-6.09l-4.77-6.23L5.4 21H2.38l7.06-8.07L2.25 3h6.24l4.31 5.7L17.53 3Zm-1.06 16.2h1.67L7.6 4.71H5.8l10.67 14.49Z" />
          </svg>
        </a>
      </nav>

      <i className="jx-bar__rule" aria-hidden />

      <a className="jx-cv" href="/julian-irigoyen-cv.pdf" download>
        <span>Download CV</span>
        <svg viewBox="0 0 16 16" aria-hidden focusable="false">
          <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                d="M8 2v8m0 0L4.8 6.8M8 10l3.2-3.2M2.6 12.4v.4a1.2 1.2 0 0 0 1.2 1.2h8.4a1.2 1.2 0 0 0 1.2-1.2v-.4" />
        </svg>
      </a>
    </div>
  );
}
