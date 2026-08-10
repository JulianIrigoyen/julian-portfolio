"use client";

import { useEffect, useState } from "react";
import { DJINN_EPOCH, RAIL, TAPE, type PaneId } from "./data";

/* ——— TopStrip: identity + live readouts ——— */
export function TopStrip() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
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

  return (
    <header className="flex shrink-0 items-center gap-x-6 gap-y-2 border-b border-rule bg-panel px-4 py-2.5 sm:px-5">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="readout truncate text-[13px] font-bold tracking-tight text-ink">
          JULIAN IRIGOYEN
        </span>
        <span className="lbl hidden sm:inline">buenos aires</span>
      </div>

      <div className="ml-auto flex items-center gap-4 sm:gap-6">
        <span className="hidden items-baseline gap-1.5 md:flex">
          <span className="lbl">uptime</span>
          <span
            suppressHydrationWarning
            className="readout text-[12px] font-medium text-phosphor"
          >
            {upDays === null ? "—" : `${upDays}d`}
          </span>
        </span>
        <span className="hidden items-baseline gap-1.5 sm:flex">
          <span className="lbl">local</span>
          <span
            suppressHydrationWarning
            className="readout text-[12px] font-medium text-ink-2"
          >
            {clock}
          </span>
        </span>
        <a
          href="#contact"
          className="flex items-center gap-2 rounded-sm border border-amber/40 bg-amber-dim px-2.5 py-1 transition-colors hover:bg-amber hover:text-housing"
        >
          <span className="dot dot--idle" aria-hidden />
          <span className="lbl !text-[9.5px] !text-amber transition-colors hover:!text-housing">
            available
          </span>
        </a>
      </div>
    </header>
  );
}

/* ——— Rail: systems as navigation ——— */
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
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-rule bg-panel px-3 py-2 lg:w-52 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:px-0 lg:py-3"
    >
      <span className="lbl mb-2 hidden px-4 lg:block">systems</span>
      {RAIL.map((r) => {
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
          { l: "github", h: "https://github.com/JulianIrigoyen" },
          { l: "linkedin", h: "https://linkedin.com/in/julianirigoyen" },
          { l: "email", h: "mailto:martinirigoyenj17@gmail.com" },
        ].map((x) => (
          <a
            key={x.l}
            href={x.h}
            target={x.h.startsWith("http") ? "_blank" : undefined}
            rel={x.h.startsWith("http") ? "noopener noreferrer" : undefined}
            className="readout text-[11px] text-ink-2 transition-colors hover:text-amber"
          >
            {x.l} ↗
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
