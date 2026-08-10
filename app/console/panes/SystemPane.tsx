"use client";

import type { ReactNode } from "react";
import { SYSTEMS } from "../data";

type Sys = (typeof SYSTEMS)[keyof typeof SYSTEMS];

export default function SystemPane({
  sys,
  children,
}: {
  sys: Sys;
  children?: ReactNode;
}) {
  return (
    <div className="pane-in px-5 py-10 sm:px-8">
      <div className="flex items-center gap-2.5">
        <span
          className={`dot ${sys.state === "live" ? "dot--live" : "dot--idle"}`}
          aria-hidden
        />
        <span className="readout text-[12px] font-bold tracking-wide text-amber">
          {sys.codename}
        </span>
        <span className="lbl ml-auto">{sys.state}</span>
      </div>

      <h2 className="readout mt-4 max-w-3xl text-[24px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[34px]">
        {sys.title}
      </h2>

      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-2">
        {sys.thesis}
      </p>

      {/* readout bank */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-4">
        {sys.readouts.map((r) => (
          <div key={r.k} className="bg-panel p-4">
            <dt className="lbl">{r.k}</dt>
            <dd className="readout mt-1.5 text-[21px] font-bold text-ink">
              {r.v}
            </dd>
            <dd className="lbl mt-0.5 !text-[9px] !tracking-[0.1em]">{r.note}</dd>
          </div>
        ))}
      </dl>

      {children}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {sys.detail.map((d) => (
          <div key={d.t} className="border-t border-rule-bright pt-4">
            <h3 className="text-[14px] font-semibold leading-snug text-ink">
              {d.t}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{d.d}</p>
          </div>
        ))}
      </div>

      <p className="lbl mt-8 !normal-case !tracking-[0.05em] !text-ink-3">
        {sys.stack}
      </p>
    </div>
  );
}
