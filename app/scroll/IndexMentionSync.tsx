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
      { rootMargin: "0px 0px -38% 0px", threshold: 0.01 },
    );

    triggers.forEach((trigger) => io.observe(trigger));

    return () => {
      io.disconnect();
      section.classList.remove("jx-index-sync");
    };
  }, []);

  return null;
}
