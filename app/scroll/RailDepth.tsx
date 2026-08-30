"use client";

import { useEffect } from "react";

/* ————————————————————————————————————————————————
   Depth on the rail, in the DOM.

   Jesper Landberg's no-GL grid, adapted. His demo is an infinite draggable
   grid; this page already has a grammar — scrollcraft pans the rail, and the
   page's signature move is the assertion suite. So the drag and the infinite
   wrap stay out, and what comes over is the part that gives cards weight:

     · a pincushion warp solved as ONE matrix3d per card, rather than a stack
       of guessed rotations
     · a gaussian push away from the cursor, added to the corners BEFORE the
       solve so the gaps between cards stay correct under the lens
     · the shot parallaxing inside its own frame
     · distance dimming

   His performance rules are the reason this is affordable at all:
     · one rAF for everything
     · transforms written straight onto elements — never a per-frame CSS
       custom property, which invalidates style for the whole subtree
     · only cards actually on screen get written
   ———————————————————————————————————————————————— */

const BOW = 0.055;      // pincushion. Past ~0.12 the rail reads as a fisheye toy.
const BULGE = 26;       // px of push at the cursor
const REACH = 460;      // px — the lens radius
const PARALLAX = 14;    // px the shot travels inside its frame
const DIM = 0.34;       // how far the farthest card fades
const LERP = 11;        // cursor damping; higher is tighter

type Pt = { x: number; y: number };

/* Rect-to-quad. Maps a w x h box onto four corners given RELATIVE to the
   element's own origin. Keystone, skew and scale all fall out of the solve —
   which is the whole point of doing it this way instead of guessing tilts. */
function rectToQuad(w: number, h: number, tl: Pt, tr: Pt, bl: Pt, br: Pt) {
  const x0 = tl.x, y0 = tl.y;
  const x1 = tr.x, y1 = tr.y;
  const x2 = bl.x, y2 = bl.y;
  const x3 = br.x, y3 = br.y;

  const dx1 = x1 - x3, dy1 = y1 - y3;
  const dx2 = x2 - x3, dy2 = y2 - y3;
  const sx = x0 - x1 - x2 + x3;
  const sy = y0 - y1 - y2 + y3;

  const den = dx1 * dy2 - dx2 * dy1;
  const g = den ? (sx * dy2 - dx2 * sy) / den : 0;
  const k = den ? (dx1 * sy - sx * dy1) / den : 0;

  const a = x1 - x0 + g * x1;
  const b = x2 - x0 + k * x2;
  const c = y1 - y0 + g * y1;
  const d = y2 - y0 + k * y2;

  return `matrix3d(${a / w},${c / w},0,${g / w},` +
         `${b / h},${d / h},0,${k / h},` +
         `0,0,1,0,` +
         `${x0},${y0},0,1)`;
}

export default function RailDepth() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rail = document.querySelector<HTMLElement>(".jx-rail");
    if (!rail) return;

    /* Self-test: with no warp the solve must return identity. Every time I have
       got a transform wrong it was a frame or an axis mix-up that a one-line
       assertion would have caught before it reached the screen. */
    if (process.env.NODE_ENV !== "production") {
      const id = rectToQuad(100, 50,
        { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 50 }, { x: 100, y: 50 });
      // parse the ARGUMENTS only — the "3" in "matrix3d" is not a matrix entry
      const nums = id.slice(id.indexOf("(") + 1, -1).split(",").map(Number);
      const want = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
      const bad = nums.some((n, i) => Math.abs(n - want[i]) > 1e-6);
      if (bad) console.error("[RailDepth] rectToQuad is not identity at rest:", id);
    }

    const cards = Array.from(rail.querySelectorAll<HTMLElement>(".jx-card"));
    if (!cards.length) return;

    const shots = cards.map(c => c.querySelector<HTMLImageElement>(".jx-card__shot img"));
    const target = { x: -9999, y: -9999 };
    const cur = { x: -9999, y: -9999 };
    let raf = 0;
    let last = 0;
    let live = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!live) { cur.x = target.x; cur.y = target.y; live = true; }
    };
    const onLeave = () => { live = false; target.x = -9999; target.y = -9999; };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const t = 1 - Math.exp(-dt * LERP);
      cur.x += (target.x - cur.x) * t;
      cur.y += (target.y - cur.y) * t;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const reach2 = REACH * REACH;

      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        const r = el.getBoundingClientRect();

        /* Cull. A card off screen gets one parking write, then nothing —
           the rail is long and most of it is never in view. */
        if (r.right < -200 || r.left > vw + 200 || r.bottom < -200 || r.top > vh + 200) {
          if (el.dataset.parked !== "1") {
            el.style.transform = "";
            if (shots[i]) shots[i]!.style.transform = "";
            el.style.removeProperty("--dim");
            el.dataset.parked = "1";
          }
          continue;
        }
        el.dataset.parked = "0";

        const w = r.width, h = r.height;
        if (!w || !h) continue;

        /* Corners in the card's own space, warped. Both terms are applied to
           the CORNERS, before the solve — a push applied after the transform
           would tear the gaps between cards open. */
        const corner = (lx: number, ly: number): Pt => {
          const px = r.left + lx, py = r.top + ly;

          // pincushion, measured from the viewport centre
          const nx = (px - vw / 2) / (vw / 2);
          const ny = (py - vh / 2) / (vh / 2);
          const f = 1 + BOW * (nx * nx + ny * ny);
          let wx = (px - vw / 2) * f + vw / 2;
          let wy = (py - vh / 2) * f + vh / 2;

          // gaussian push away from the cursor
          const dx = px - cur.x, dy = py - cur.y;
          const push = BULGE * Math.exp(-(dx * dx + dy * dy) / reach2);
          const len = Math.hypot(dx, dy) || 1;
          wx += (dx / len) * push;
          wy += (dy / len) * push;

          return { x: wx - r.left, y: wy - r.top };
        };

        el.style.transform = rectToQuad(
          w, h, corner(0, 0), corner(w, 0), corner(0, h), corner(w, h),
        );

        /* The shot drifts against its frame. scale(1.06) in CSS is the overscan
           so the translate never reveals an edge. */
        const s = shots[i];
        if (s) {
          const cx = r.left + w / 2, cy = r.top + h / 2;
          const ix = Math.max(-1, Math.min(1, (cur.x - cx) / REACH)) * PARALLAX;
          const iy = Math.max(-1, Math.min(1, (cur.y - cy) / REACH)) * PARALLAX;
          s.style.transform = `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0) scale(1.06)`;
        }
      }
    };

    /* --dim is written on pointermove, not in the loop. A custom property
       invalidates style for the whole subtree; doing it per frame across a
       long rail is the usual reason a thing like this stutters. */
    const onDim = () => {
      const vw = window.innerWidth;
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        if (el.dataset.parked === "1") continue;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - target.x, r.top + r.height / 2 - target.y);
        const t = Math.max(0, Math.min(1, (d - REACH * 0.5) / (vw * 0.55)));
        el.style.setProperty("--dim", (DIM * (t * t * (3 - 2 * t))).toFixed(3));
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointermove", onDim, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onDim);
      window.removeEventListener("pointerleave", onLeave);
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = "";
        cards[i].style.removeProperty("--dim");
        if (shots[i]) shots[i]!.style.transform = "";
      }
    };
  }, []);

  return null;
}
