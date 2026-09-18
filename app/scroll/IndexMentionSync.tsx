"use client";

import { useEffect } from "react";

const ROWS = ["now", "shipped", "lab", "path"] as const;

export default function IndexMentionSync() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".jx-index-act");
    if (!section) return;

    const reveal = (key: string) => {
      section
        .querySelector<HTMLElement>(`[data-jx-index-row="${key}"]`)
        ?.classList.add("jx-index__row--shown");
    };

    section.classList.add("jx-index-sync");

    const triggers = Array.from(
      section.querySelectorAll<HTMLElement>("[data-jx-index-trigger]"),
    );

    if (!("IntersectionObserver" in window) || !triggers.length) {
      ROWS.forEach(reveal);
      return () => section.classList.remove("jx-index-sync");
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const keys =
            entry.target
              .getAttribute("data-jx-index-trigger")
              ?.split(/\s+/)
              .filter(Boolean) ?? [];
          keys.forEach(reveal);
          io.unobserve(entry.target);
        });
      },
      // A mention reveals its row once it is in the top 30% of the viewport,
      // i.e. when the reader has reached it. The About copy got shorter in
      // September 2026, so with the old 62% band the mentions were already
      // inside it the moment the section scrolled in, and every row showed
      // at once before the paragraph had been read.
      { rootMargin: "0px 0px -70% 0px", threshold: 0.01 },
    );

    triggers.forEach((trigger) => io.observe(trigger));

    return () => {
      io.disconnect();
      section.classList.remove("jx-index-sync");
    };
  }, []);

  return null;
}
