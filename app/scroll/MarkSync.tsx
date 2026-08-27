"use client";

import { useEffect } from "react";

/* ————————————————————————————————————————————————
   One playhead for the open act.

   The mark assembles under the wheel and the greet line assembles with it.
   Rather than run the type off raw scroll — which drifts, because the engine
   lerps the clip and CSS would not — this reads the clip's own playhead and
   publishes it as `--jx-mark` on the act. Whatever the video is showing, the
   type is showing the same amount of it.

   Fallback matters more than it looks. If the clip never loads — a blocked
   range request, a codec the browser refuses — reading `currentTime` forever
   returns 0 and the headline would sit at 0.16 opacity for the whole scroll.
   So a missing or unready clip falls back to the act's own geometry, which is
   the same number the engine would have used.
   ———————————————————————————————————————————————— */
export default function MarkSync() {
  useEffect(() => {
    const act = document.querySelector<HTMLElement>(".jx-open");
    if (!act) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      act.style.setProperty("--jx-mark", "1");
      return;
    }

    let raf = 0;
    let last = -1;

    const frame = () => {
      const v = act.querySelector<HTMLVideoElement>("video[data-sc-scrub]");
      let p: number;

      if (v && Number.isFinite(v.duration) && v.duration > 0) {
        p = v.currentTime / v.duration;
      } else {
        // act geometry: how far the pinned stage has travelled
        const r = act.getBoundingClientRect();
        const travel = r.height - window.innerHeight;
        p = travel > 0 ? -r.top / travel : 0;
      }

      p = Math.min(1, Math.max(0, p));
      if (p !== last) {
        last = p;
        act.style.setProperty("--jx-mark", p.toFixed(4));
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
