"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Rail, Tape, TopStrip } from "./Chrome";
import Palette from "./Palette";
import Help from "./Help";
import { RAIL, SYSTEMS, type PaneId } from "./data";
import Overview from "./panes/Overview";
import Works from "./panes/Works";
import SystemPane from "./panes/SystemPane";
import Solver from "./panes/Solver";
import Fleet from "./panes/Fleet";
import Career from "./panes/Career";
import Contact from "./panes/Contact";

const VALID: PaneId[] = RAIL.map((r) => r.id);

/** true when focus is somewhere that swallows single-key shortcuts */
function typing(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export default function Console() {
  const [pane, setPane] = useState<PaneId>("overview");
  const [palette, setPalette] = useState(false);
  const [help, setHelp] = useState(false);
  const chord = useRef<string | null>(null);

  // hash sync — links are shareable, back button works
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "") as PaneId;
      if (VALID.includes(h)) setPane(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const go = useCallback((id: PaneId) => {
    setPane(id);
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
    document.getElementById("stage")?.scrollTo({ top: 0 });
  }, []);

  // ——— the keyboard layer ———
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      // palette works from anywhere, including inside a field
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setHelp(false);
        setPalette((p) => !p);
        return;
      }
      if (e.key === "Escape") {
        setPalette(false);
        setHelp(false);
        chord.current = null;
        return;
      }
      // everything below is a bare key, so never steal it from a field
      if (typing(e.target) || meta || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setHelp((h) => !h);
        return;
      }

      // `g` then a letter
      if (chord.current === "g") {
        chord.current = null;
        const hit = VALID.find((v) => v.startsWith(e.key.toLowerCase()));
        if (hit) {
          e.preventDefault();
          go(hit);
        }
        return;
      }
      if (e.key.toLowerCase() === "g") {
        chord.current = "g";
        window.setTimeout(() => (chord.current = null), 1200);
        return;
      }

      // digits jump the rail
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= VALID.length) {
        e.preventDefault();
        go(VALID[n - 1]);
        return;
      }

      // j / k walk it
      if (e.key === "j" || e.key === "k") {
        e.preventDefault();
        const i = VALID.indexOf(pane);
        const next =
          e.key === "j"
            ? Math.min(i + 1, VALID.length - 1)
            : Math.max(i - 1, 0);
        go(VALID[next]);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pane, go]);

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      <TopStrip onPalette={() => setPalette(true)} onHelp={() => setHelp(true)} />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Rail active={pane} onSelect={go} />
        <main
          id="stage"
          className="stage min-w-0 flex-1 lg:overflow-y-auto"
          aria-live="polite"
        >
          <div className="mx-auto max-w-5xl">
            {pane === "overview" && <Overview go={go} />}
            {pane === "works" && <Works />}
            {pane === "djinn" && <SystemPane sys={SYSTEMS.djinn} />}
            {pane === "trading" && (
              <SystemPane sys={SYSTEMS.trading}>
                <Solver />
              </SystemPane>
            )}
            {pane === "hermes" && <SystemPane sys={SYSTEMS.hermes} />}
            {pane === "fleet" && <Fleet />}
            {pane === "career" && <Career />}
            {pane === "contact" && <Contact />}
          </div>
        </main>
      </div>
      <Tape />

      <Palette open={palette} onClose={() => setPalette(false)} onGo={go} />
      <Help open={help} onClose={() => setHelp(false)} />
    </div>
  );
}
