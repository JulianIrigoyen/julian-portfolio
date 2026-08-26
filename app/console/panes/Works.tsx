"use client";

import { useState } from "react";
import { WORKS, type WorkStatus } from "../data";

const DOT: Record<WorkStatus, string> = {
  live: "dot--live",
  idle: "dot--idle",
  offline: "dot--off",
  building: "dot--idle",
  research: "dot--off",
};

const STATUS_NOTE: Record<WorkStatus, string> = {
  live: "running now",
  idle: "built, not currently running",
  offline: "deployment is down",
  building: "in build",
  research: "research, never deployed",
};

export default function Works() {
  const [open, setOpen] = useState<string | null>(WORKS[0].id);

  return (
    <div className="pane-in px-5 py-10 sm:px-8">
      <span className="lbl">works</span>
      <h2 className="readout mt-4 max-w-3xl text-[24px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[34px]">
        Everything, with the detail the scroll view leaves out
      </h2>
      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-2">
        Thirteen entries. Status is what was true on 26 August 2026 — where a
        thing is offline or unbuilt, it says so rather than implying a link.
      </p>

      {/* status legend */}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {(Object.keys(STATUS_NOTE) as WorkStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-2">
            <span className={`dot ${DOT[s]}`} aria-hidden />
            <span className="lbl !text-[9px]">
              {s} — {STATUS_NOTE[s]}
            </span>
          </span>
        ))}
      </div>

      <ul className="mt-8 overflow-hidden rounded-sm border border-rule">
        {WORKS.map((w, i) => {
          const on = open === w.id;
          return (
            <li
              key={w.id}
              className={`border-rule ${i > 0 ? "border-t" : ""} ${on ? "bg-panel-2" : "bg-panel"}`}
            >
              <button
                onClick={() => setOpen(on ? null : w.id)}
                aria-expanded={on}
                className="flex w-full items-baseline gap-3 px-4 py-3.5 text-left transition-colors hover:bg-panel-2"
              >
                <span className={`dot ${DOT[w.status]} translate-y-[-2px]`} aria-hidden />
                <span className="readout w-[112px] shrink-0 text-[13px] font-bold text-ink">
                  {w.name}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">
                  {w.one}
                </span>
                <span className="lbl ml-auto hidden shrink-0 !text-[9px] sm:inline">
                  {w.status}
                </span>
                <span className="lbl shrink-0 !text-amber">{on ? "−" : "+"}</span>
              </button>

              {on && (
                <div className="border-t border-rule px-4 pb-5 pt-4">
                  <p className="max-w-3xl text-[13.5px] leading-relaxed text-ink-2">
                    {w.detail}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-4">
                    {w.facts.map((f) => (
                      <div key={f.k} className="bg-panel p-3">
                        <dt className="lbl !text-[9px]">{f.k}</dt>
                        <dd className="readout mt-1 text-[15px] font-bold text-ink">
                          {f.v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {w.stack.map((s) => (
                      <span
                        key={s}
                        className="lbl !text-[9px] rounded-sm border border-rule px-1.5 py-0.5 !tracking-[0.06em]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    {w.href ? (
                      <a
                        href={w.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="readout text-[11.5px] text-amber hover:underline"
                      >
                        {w.href.replace(/^https?:\/\//, "")} ↗
                      </a>
                    ) : (
                      <span className="lbl !text-[9px]">
                        no public url — {STATUS_NOTE[w.status]}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
