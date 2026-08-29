"use client";

import { useEffect, useRef } from "react";
import { createStage } from "../lib/stage";

/* ————————————————————————————————————————————————
   The WebGL field behind the page.

   scrollcraft stays in charge of acts, pins, cues and grammar. This takes
   three numbers and draws — `autoScroll` because the engine publishes no
   global progress and no velocity anywhere, so reading `window.scrollY` is
   the honest source.

   `groundVar` is the part worth having: the shader's ink follows
   `--sc-canvas`, so when the page cuts from the near-black open to paper the
   field cuts with it instead of sitting underneath as one flat tone.

   Intensity is per act. The open is dark and the field is built for dark, so
   it runs loud there. The paper acts are where the copy has to carry weight
   against measured contrast, so it drops to a whisper — texture, not a
   feature. `data-stage-intensity` on any act overrides.
   ———————————————————————————————————————————————— */
export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* The field is a five-octave fbm with two domain-warp passes, and its
       cost is entirely in pixels shaded — the stagecraft notes put DPR as the
       whole performance budget. The default 1.5 cap is right for a laptop; a
       phone is running this behind a scrubbing video and scrollcraft's own
       loop, on a GPU an order of magnitude smaller. 1.25 is a quarter fewer
       pixels and the contour lines are soft enough that nobody can tell. */
    const phone = window.matchMedia("(max-width: 52rem), (pointer: coarse)").matches;

    const stage = createStage({
      canvas: ref.current,
      palette: { ink: "#0a0a0b", accent: "#c9a961" },
      autoScroll: true,
      groundVar: "--sc-canvas",
      mark: false, // the 3D brand mark is djinn-site's signature, not this page's
      dpr: phone ? 1.25 : 1.5,
    });

    /* No WebGL context — an old browser, a blocked GPU, a headless run. The
       page keeps its opaque grounds via the class below and loses nothing but
       the texture. */
    if (!stage) {
      document.documentElement.classList.add("jx-no-stage");
      return;
    }

    const onWaypoint = (e: Event) => {
      const d = (e as CustomEvent).detail ?? {};
      const seg: HTMLElement | null = d.el ?? (e.target as HTMLElement);
      const act = seg?.closest<HTMLElement>(".jx-act");
      const explicit = act?.dataset.stageIntensity;
      const i = explicit !== undefined
        ? Number(explicit)
        : act?.classList.contains("jx-open")
          ? 0.85
          : 0.16;
      stage.setIntensity(Number.isFinite(i) ? i : 0.16);
    };

    document.addEventListener("sc:waypoint", onWaypoint);
    stage.setIntensity(0.85); // the open owns the first screen

    return () => {
      document.removeEventListener("sc:waypoint", onWaypoint);
      stage.destroy();
    };
  }, []);

  return <canvas ref={ref} className="jx-stage" aria-hidden="true" />;
}
