"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/* ————————————————————————————————————————————————
   The signature move: the page runs its own suite.

   He designs and builds the testing frameworks around the systems he ships —
   unit, integration, load. So this page is built as one. Every section is an
   assertion sitting at `· · ·` until you actually reach it, at which point it
   resolves to PASS, and the bar keeps a running count.

   The count is real. It counts sections that have genuinely entered the
   viewport — nothing is faked, and it cannot read higher than the number of
   assertions on the page.
   ———————————————————————————————————————————————— */

export default function Suite() {
  const [passed, setPassed] = useState(0);
  const [total, setTotal] = useState(0);
  const [theme, setTheme] = useState<Theme | null>(null);

  /* Read back whatever the pre-paint script in the layout already decided,
     so the button never disagrees with the page it sits on. Null until
     mounted: the server cannot know the reader's system preference, and
     rendering a guess produces a hydration mismatch. */
  useEffect(() => {
    const root = document.documentElement;
    const chosen = root.dataset.theme as Theme | undefined;
    setTheme(
      chosen ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
    );
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("jx-theme", next);
    } catch {
      /* private mode: the choice lasts the session and no longer */
    }
    setTheme(next);
  };

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-assert]")
    );
    setTotal(nodes.length);
    if (!nodes.length) return;

    const done = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        let changed = false;
        entries.forEach((e) => {
          if (!e.isIntersecting || done.has(e.target)) return;
          done.add(e.target);
          (e.target as HTMLElement).dataset.state = "pass";
          changed = true;
          io.unobserve(e.target);
        });
        if (changed) setPassed(done.size);
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.01 }
    );
    nodes.forEach((n) => io.observe(n));

    // the bar's underline tracks real scroll position
    let raf = 0;
    const frame = () => {
      const d = document.documentElement;
      const travel = d.scrollHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, window.scrollY / travel)) : 0;
      d.style.setProperty("--jx-p", p.toFixed(4));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="jx-bar">
      <span className="jx-bar__name">Julian Irigoyen</span>
      <span className="jx-bar__sep" aria-hidden>
        ·
      </span>
      <span>Buenos Aires</span>
      <span className="jx-bar__count" suppressHydrationWarning>
        {total ? `${passed}/${total} pass` : "—"}
      </span>
      <button
        type="button"
        className="jx-theme"
        onClick={flip}
        aria-label={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
      >
        <i className="jx-theme__i" aria-hidden />
        {theme ?? "theme"}
      </button>
      <i className="jx-bar__track" aria-hidden />
    </div>
  );
}

/** One assertion. Resolves when the reader actually reaches it. */
export function Assert({ name }: { name: string }) {
  return (
    <span className="jx-assert" data-assert data-state="pending">
      {name}
    </span>
  );
}
