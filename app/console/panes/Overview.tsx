"use client";

import { useEffect, useState } from "react";
import { DJINN_EPOCH, SYSTEMS, WORKS, type PaneId, type WorkStatus } from "../data";

function Uptime() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <span suppressHydrationWarning>—</span>;
  const s = Math.floor((now - DJINN_EPOCH) / 1000);
  const d = Math.floor(s / 86400);
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return (
    <span suppressHydrationWarning>
      {d}d {h}:{m}:{sec}
    </span>
  );
}

const DOT: Record<WorkStatus, string> = {
  live: "dot--live",
  idle: "dot--idle",
  offline: "dot--off",
  building: "dot--idle",
  research: "dot--off",
};

const ORDER: WorkStatus[] = ["live", "building", "idle", "offline", "research"];
const GROUP_NOTE: Record<WorkStatus, string> = {
  live: "running now — every one of these opens",
  building: "in build, not shipped",
  idle: "built, not currently running",
  offline: "had a deployment, it is down",
  research: "research, never deployed",
};

export default function Overview({ go }: { go: (id: PaneId) => void }) {
  const counts = ORDER.map((s) => ({
    s,
    n: WORKS.filter((w) => w.status === s).length,
  })).filter((c) => c.n > 0);

  return (
    <div className="pane-in">
      {/* what this is — a stranger lands here cold */}
      <section className="border-b border-rule px-5 py-7 sm:px-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="lbl !text-amber">console</span>
          <p className="text-[13.5px] text-ink-2">
            The dense view of everything Julian has built. Not indexed, not
            linked from the public page.
          </p>
        </div>
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-3">
          Every entry states whether it is actually running. Where something has
          no public URL it says so instead of pointing you somewhere else. Press{" "}
          <span className="readout text-ink">⌘K</span> to jump anywhere,{" "}
          <span className="readout text-ink">?</span> for the rest of the keys.
        </p>
      </section>

      {/* the board */}
      <section className="px-5 py-7 sm:px-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="lbl">status board</span>
          {counts.map((c) => (
            <span key={c.s} className="flex items-center gap-1.5">
              <span className={`dot ${DOT[c.s]}`} aria-hidden />
              <span className="readout text-[12px] font-bold text-ink">{c.n}</span>
              <span className="lbl !text-[9px]">{c.s}</span>
            </span>
          ))}
          <button
            onClick={() => go("works")}
            className="lbl ml-auto !text-amber hover:underline"
          >
            open in detail →
          </button>
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule">
          {ORDER.filter((s) => WORKS.some((w) => w.status === s)).map((s) => (
            <div key={s} className="bg-panel">
              <div className="flex items-baseline gap-2.5 border-b border-rule px-4 py-2">
                <span className={`dot ${DOT[s]}`} aria-hidden />
                <span className="lbl !text-[9px] !text-ink-2">{s}</span>
                <span className="lbl !text-[8.5px] !normal-case !tracking-[0.04em]">
                  {GROUP_NOTE[s]}
                </span>
              </div>
              <ul className="grid sm:grid-cols-2 xl:grid-cols-3">
                {WORKS.filter((w) => w.status === s).map((w) => (
                  <li key={w.id} className="min-w-0 border-b border-rule px-4 py-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="readout truncate text-[12.5px] font-bold text-ink">
                        {w.name}
                      </span>
                      {w.href ? (
                        <a
                          href={w.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lbl shrink-0 !text-[8.5px] !text-amber hover:underline"
                        >
                          open ↗
                        </a>
                      ) : (
                        <span className="lbl shrink-0 !text-[8.5px]">no url</span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11.5px] text-ink-3">
                      {w.one}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* the three systems that carry their own pane */}
      <section className="border-t border-rule px-5 py-7 sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="lbl">deep dives</span>
          <p className="text-[13px] text-ink-2">
            Three of them have a pane of their own.
          </p>
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-3">
          {[SYSTEMS.djinn, SYSTEMS.trading, SYSTEMS.hermes].map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className="group flex flex-col bg-panel p-4 text-left transition-colors hover:bg-panel-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`dot ${s.state === "live" ? "dot--live" : "dot--idle"}`}
                  aria-hidden
                />
                <span className="readout text-[11.5px] font-bold tracking-wide text-amber">
                  {s.codename}
                </span>
              </div>
              <h3 className="mt-2.5 text-[14px] font-semibold leading-snug text-ink">
                {s.title}
              </h3>
              <div className="mt-3 flex flex-col gap-1">
                {s.readouts.slice(0, 3).map((r) => (
                  <div key={r.k} className="flex items-baseline gap-2">
                    <span className="readout w-16 shrink-0 text-[14px] font-bold text-ink">
                      {r.v}
                    </span>
                    <span className="lbl !text-[8.5px] !tracking-[0.1em]">{r.k}</span>
                  </div>
                ))}
              </div>
              <span className="lbl mt-4 !text-amber transition-transform group-hover:translate-x-0.5">
                open →
              </span>
            </button>
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-4">
          {[
            { k: "agent uptime", v: <Uptime />, tone: "phosphor" },
            { k: "years shipping", v: "8", tone: "ink" },
            { k: "entries here", v: String(WORKS.length), tone: "ink" },
            { k: "languages in prod", v: "8", tone: "ink" },
          ].map((s) => (
            <div key={s.k} className="bg-panel p-4">
              <dt className="lbl">{s.k}</dt>
              <dd
                className={`readout mt-1.5 text-[17px] font-bold sm:text-[20px] ${
                  s.tone === "phosphor" ? "text-phosphor" : "text-ink"
                }`}
              >
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
