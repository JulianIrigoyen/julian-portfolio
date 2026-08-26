"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: Document | Element, opts?: Record<string, unknown>) => void;
      instances?: { layout?: () => void; read?: () => void }[];
    };
    __jiScrollCraftPromise?: Promise<unknown>;
    __jiScrollCraftMounted?: boolean;
  }
}

function loadRuntime(): Promise<unknown> {
  if (window.ScrollCraft?.mount) return Promise.resolve();
  if (window.__jiScrollCraftPromise) return window.__jiScrollCraftPromise;

  window.__jiScrollCraftPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-ji-scrollcraft]");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = "/scrollcraft/scrollcraft.js";
    s.async = true;
    s.dataset.jiScrollcraft = "true";
    s.addEventListener("load", resolve, { once: true });
    s.addEventListener("error", reject, { once: true });
    document.head.appendChild(s);
  });

  return window.__jiScrollCraftPromise;
}

export default function ScrollcraftMount() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadRuntime();
      } catch (err) {
        console.error("[scrollcraft] runtime failed to load", err);
        return;
      }
      if (cancelled || !window.ScrollCraft?.mount) return;

      if (window.__jiScrollCraftMounted && window.ScrollCraft.instances?.length) {
        window.ScrollCraft.instances.forEach((i) => {
          i.layout?.();
          i.read?.();
        });
        return;
      }

      window.__jiScrollCraftMounted = true;
      window.ScrollCraft.mount(document, { lerp: 0.22 });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
