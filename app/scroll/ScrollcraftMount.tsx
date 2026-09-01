"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: Document | Element, opts?: Record<string, unknown>) => ScrollCraftInstance | void;
      instances?: ScrollCraftInstance[];
    };
    __jiScrollCraftPromise?: Promise<unknown>;
  }
}

type ScrollCraftInstance = {
  acts?: { el?: Element }[];
  layout?: () => void;
  read?: () => void;
  destroy?: () => void;
};

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
    let instance: ScrollCraftInstance | undefined;

    const ownsCurrentDom = (candidate: ScrollCraftInstance) =>
      candidate.acts?.some((act) => act.el && document.contains(act.el)) ?? false;

    const refresh = () => {
      instance?.layout?.();
      instance?.read?.();
    };

    (async () => {
      try {
        await loadRuntime();
      } catch (err) {
        console.error("[scrollcraft] runtime failed to load", err);
        return;
      }
      if (cancelled || !window.ScrollCraft?.mount) return;

      const instances = window.ScrollCraft.instances ?? [];
      instance = instances.find(ownsCurrentDom);

      if (instance) {
        refresh();
      } else {
        instances
          .filter((candidate) => !ownsCurrentDom(candidate))
          .forEach((candidate) => candidate.destroy?.());
        instance = window.ScrollCraft.mount(document, { lerp: 0.22 }) ?? undefined;
      }

      window.addEventListener("pageshow", refresh, { passive: true });
      document.addEventListener("visibilitychange", refresh, { passive: true });
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
      if (instance?.destroy) {
        instance.destroy();
        return;
      }
    };
  }, []);

  return null;
}
