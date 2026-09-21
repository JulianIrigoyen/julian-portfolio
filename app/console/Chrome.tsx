"use client";

import { useEffect, useState } from "react";
import { DJINN_EPOCH, RAIL, TAPE, WORKS, type PaneId } from "./data";

/* ——— TopStrip: identity, the way out, live readouts, and the controls ———
   The palette trigger is visible on purpose. This view gets sent to people
   who have never seen it, and an instrument that hides its controls is a
   puzzle. */
export function TopStrip({
  onPalette,
  onHelp,
}: {
  onPalette: () => void;
  onHelp: () => void;
}) {
  const [now, setNow] = useState<number | null>(null);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setNow(Date.now());
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const clock =
    now === null
      ? "--:--:--"
      : new Date(now).toLocaleTimeString("en-GB", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour12: false,
        });

  const upDays = now === null ? null : Math.floor((now - DJINN_EPOCH) / 86400000);
  const live = WORKS.filter((w) => w.status === "live").length;

  return (
    <header className="flex shrink-0 items-center gap-x-4 gap-y-2 border-b border-rule bg-panel px-3 py-2.5 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {/* the way back to the scroll view — this console is the alternate
            reading of the same material, not a dead end */}
        <a
          href="/"
          className="flex shrink-0 items-center gap-1.5 rounded-sm border border-rule px-2 py-1 transition-colors hover:border-amber hover:text-amber"
          aria-label="Back to the main view"
        >
          <span className="readout text-[12px] leading-none">←</span>
          <span className="lbl !text-[9px] !tracking-[0.14em]">main view</span>
        </a>
        <span className="readout truncate text-[13px] font-bold tracking-tight text-ink">
          JULIAN IRIGOYEN
        </span>
        <span className="lbl hidden xl:inline">buenos aires</span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <span className="hidden items-baseline gap-1.5 xl:flex">
          <span className="lbl">live</span>
          <span className="readout text-[12px] font-medium text-phosphor">
            {live}/{WORKS.length}
          </span>
        </span>
        <span className="hidden items-baseline gap-1.5 lg:flex">
          <span className="lbl">agent</span>
          <span
            suppressHydrationWarning
            className="readout text-[12px] font-medium text-phosphor"
          >
            {upDays === null ? "—" : `${upDays}d`}
          </span>
        </span>
        <span className="hidden items-baseline gap-1.5 sm:flex">
          <span
            suppressHydrationWarning
            className="readout text-[12px] font-medium text-ink-2"
          >
            {clock}
          </span>
        </span>

        {/* the controls, stated rather than hidden */}
        <button
          onClick={onPalette}
          className="flex items-center gap-2 rounded-sm border border-rule bg-panel-2 px-2 py-1 transition-colors hover:border-amber"
          aria-label="Open the command palette"
        >
          <span className="lbl !text-[9px]">search</span>
          <span className="readout text-[10.5px] text-ink-2">
            {mac ? "⌘K" : "^K"}
          </span>
        </button>
        <button
          onClick={onHelp}
          className="hidden h-[26px] w-[26px] items-center justify-center rounded-sm border border-rule text-ink-2 transition-colors hover:border-amber hover:text-amber sm:flex"
          aria-label="Keyboard shortcuts"
        >
          <span className="readout text-[12px] leading-none">?</span>
        </button>
      </div>
    </header>
  );
}

/* ——— Rail: systems as navigation, numbered so the digit shortcuts are
   discoverable without opening the help sheet ——— */
export function Rail({
  active,
  onSelect,
}: {
  active: PaneId;
  onSelect: (id: PaneId) => void;
}) {
  return (
    <nav
      aria-label="Systems"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-rule bg-panel px-3 py-2 lg:w-56 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:px-0 lg:py-3"
    >
      <span className="lbl mb-2 hidden px-4 lg:block">panes</span>
      {RAIL.map((r, i) => {
        const on = r.id === active;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            aria-current={on ? "page" : undefined}
            className={`group flex shrink-0 items-center gap-2.5 whitespace-nowrap px-3 py-2 text-left transition-colors lg:px-4 ${
              on
                ? "bg-panel-2 text-ink lg:border-l-2 lg:border-amber lg:pl-[14px]"
                : "text-ink-2 hover:bg-panel-2 hover:text-ink lg:border-l-2 lg:border-transparent lg:pl-[14px]"
            }`}
          >
            <span
              className={`lbl hidden w-3 shrink-0 !text-[9px] lg:inline ${
                on ? "!text-amber" : ""
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`dot ${
                r.state === "live"
                  ? "dot--live"
                  : r.state === "idle"
                    ? "dot--idle"
                    : "dot--off"
              }`}
              aria-hidden
            />
            <span className="readout text-[11.5px] font-medium tracking-wide">
              {r.label}
            </span>
            {r.meta && (
              <span className="lbl ml-auto hidden !text-[9px] lg:inline">
                {r.meta}
              </span>
            )}
          </button>
        );
      })}

      {/* rail footer — links out, fills the column */}
      <div className="mt-auto hidden flex-col gap-2 border-t border-rule px-4 pt-4 lg:flex">
        <span className="lbl">links</span>
        {[
          { l: "← main view", h: "/" },
          { l: "github", h: "https://github.com/JulianIrigoyen" },
          { l: "linkedin", h: "https://linkedin.com/in/julianirigoyen" },
          { l: "email", h: "mailto:julian@supersolid.co" },
        ].map((x) => (
          <a
            key={x.l}
            href={x.h}
            target={x.h.startsWith("http") ? "_blank" : undefined}
            rel={x.h.startsWith("http") ? "noopener noreferrer" : undefined}
            className="readout text-[11px] text-ink-2 transition-colors hover:text-amber"
          >
            {x.h.startsWith("http") ? `${x.l} ↗` : x.l}
          </a>
        ))}
        <p className="lbl mt-3 !text-[8.5px] !leading-relaxed">
          buenos aires
          <br />
          remote · us / eu
        </p>
      </div>
    </nav>
  );
}

/* ——— Tape: the event stream, always running ——— */
export function Tape() {
  const line = TAPE.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-2 px-5">
      <span className="text-ink-3">·</span>
      <span>{t}</span>
    </span>
  ));
  return (
    <footer className="flex shrink-0 items-center gap-3 overflow-hidden border-t border-rule bg-panel py-2">
      <span className="lbl shrink-0 pl-4">tape</span>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="marquee readout flex w-max whitespace-nowrap text-[11px] text-ink-2">
          {line}
          {line}
        </div>
      </div>
      <span className="lbl shrink-0 pr-4 !text-[9px]">replay</span>
    </footer>
  );
}
