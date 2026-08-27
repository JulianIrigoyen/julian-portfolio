"use client";

import { useEffect } from "react";

/* ————————————————————————————————————————————————
   The cut between the open act and the index.

   The open act ends the way a pinned act always ends: the stage unsticks and
   the next section slides up behind it. That seam is the one place on the page
   where nothing is happening — the reader has just watched the mark assemble
   for seven viewport-heights, and the reward is a scroll join.

   So the seam gets a light. A bloom rises through the last stretch of the pin,
   blows the open act out from the inside, and falls away to leave the index
   standing in it. One number drives all of it, published on the root as
   `--jx-bloom`, so the act that leaves and the section that arrives are reading
   the same clock and cannot drift apart.

   Geometry rather than IntersectionObserver: the value has to be continuous
   through the join, and an observer only reports crossings.

     d = act.bottom - viewportHeight

   `d` counts down to 0 across the pin and goes negative as the act scrolls
   away. RISE is how much of the pin's tail the bloom takes to reach full, FALL
   is how far past the join it takes to clear. Both are fractions of a viewport,
   so the effect covers the same distance on a laptop and on a phone.
   ———————————————————————————————————————————————— */

const RISE = 0.62;
const FALL = 0.8;

/* Smoothstep. A linear ramp reads as a light switch; the ease is what makes it
   a bloom. */
const ease = (t: number) => t * t * (3 - 2 * t);

export default function BloomCut() {
  useEffect(() => {
    const act = document.querySelector<HTMLElement>(".jx-open");
    if (!act) return;

    const root = document.documentElement;

    /* Reduced motion keeps the cut, drops the flash: the sections still hand
       over, they just do it without a full-screen light. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.setProperty("--jx-bloom", "0");
      return;
    }

    let raf = 0;
    let last = -1;

    const frame = () => {
      const vh = window.innerHeight;
      const d = act.getBoundingClientRect().bottom - vh;

      let b: number;
      if (d > RISE * vh) {
        b = 0; // still inside the act proper
      } else if (d > 0) {
        b = ease(1 - d / (RISE * vh)); // the tail of the pin: light coming up
      } else if (d > -FALL * vh) {
        b = ease(1 + d / (FALL * vh)); // past the join: light falling away
      } else {
        b = 0; // the index owns the screen
      }

      if (b !== last) {
        last = b;
        root.style.setProperty("--jx-bloom", b.toFixed(4));
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      root.style.removeProperty("--jx-bloom");
    };
  }, []);

  return <div className="jx-bloom" aria-hidden="true" />;
}
