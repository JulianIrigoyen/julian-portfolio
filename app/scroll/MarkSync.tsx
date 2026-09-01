"use client";

import { useEffect } from "react";

/* ————————————————————————————————————————————————
   Two playheads for the open act.

   `--jx-mark` is the clip's actual playhead, including decoder lag and the
   authored heart hold. `--jx-open-p` is the section's scroll progress. Layout
   uses the second one, because the open clip can pause on the completed heart
   and then resume through its tail effect.

   Fallback matters more than it looks. If the clip never loads — a blocked
   range request, a codec the browser refuses — reading `currentTime` forever
   returns 0. So a missing or unready clip falls back to the act's own geometry,
   which is the same number the engine would have used.
   ———————————————————————————————————————————————— */
export default function MarkSync() {
  useEffect(() => {
    const act = document.querySelector<HTMLElement>(".jx-open");
    if (!act) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      act.style.setProperty("--jx-mark", "1");
      act.style.setProperty("--jx-open-p", "1");
      return;
    }

    let raf = 0;
    let last = -1;
    let lastOpen = -1;

    const frame = () => {
      const v = act.querySelector<HTMLVideoElement>("video[data-sc-scrub]");
      const r = act.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const openP = travel > 0 ? -r.top / travel : 0;
      let p: number;

      if (v && Number.isFinite(v.duration) && v.duration > 0) {
        p = v.currentTime / v.duration;
      } else {
        p = openP;
      }

      p = Math.min(1, Math.max(0, p));
      const q = Math.min(1, Math.max(0, openP));
      if (p !== last) {
        last = p;
        act.style.setProperty("--jx-mark", p.toFixed(4));
      }
      if (q !== lastOpen) {
        lastOpen = q;
        act.style.setProperty("--jx-open-p", q.toFixed(4));
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
