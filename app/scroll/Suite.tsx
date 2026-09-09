"use client";

import { useEffect, useSyncExternalStore } from "react";
import BarLinks from "./BarLinks";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme | undefined)
    ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function subscribeTheme(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  preference.addEventListener("change", notify);
  return () => {
    observer.disconnect();
    preference.removeEventListener("change", notify);
  };
}

export default function Suite() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("jx-theme", next);
    } catch {
      /* private mode: the choice lasts the session and no longer */
    }
  };

  useEffect(() => {
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
      <BarLinks />
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
