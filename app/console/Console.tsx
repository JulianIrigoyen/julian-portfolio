"use client";

import { useCallback, useEffect, useState } from "react";
import { Rail, Tape, TopStrip } from "./Chrome";
import { SYSTEMS, type PaneId } from "./data";
import Overview from "./panes/Overview";
import SystemPane from "./panes/SystemPane";
import Solver from "./panes/Solver";
import Fleet from "./panes/Fleet";
import Career from "./panes/Career";
import Contact from "./panes/Contact";

const VALID: PaneId[] = [
  "overview",
  "djinn",
  "trading",
  "hermes",
  "fleet",
  "career",
  "contact",
];

export default function Console() {
  const [pane, setPane] = useState<PaneId>("overview");

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

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      <TopStrip />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Rail active={pane} onSelect={go} />
        <main
          id="stage"
          className="stage min-w-0 flex-1 lg:overflow-y-auto"
          aria-live="polite"
        >
          <div className="mx-auto max-w-5xl">
            {pane === "overview" && <Overview go={go} />}
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
    </div>
  );
}
