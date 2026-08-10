"use client";

import { useEffect, useState } from "react";

const PROCESSES = [
  {
    name: "djinn-slack",
    state: "online",
    live: true,
    desc: "autonomous ops agent · Slack · running unattended",
    href: "#djinn",
  },
  {
    name: "trading-api",
    state: "live",
    live: true,
    desc: "Rust trading infrastructure · prediction markets · live execution",
    href: "#trading",
  },
  {
    name: "hermes",
    state: "v31",
    live: false,
    desc: "Rust LLM orchestration framework · powers ~30 client projects",
    href: "#hermes",
  },
] as const;

/* Real event types from the systems above — cosmetic replay, no live wire. */
const TAPE: string[] = [
  "watchdog · all processes healthy",
  "digest-nightly · posted to #ops",
  "brain-weave · 2 missing links proposed",
  "recorder · fill event → postgres ✓",
  "ec2-doctor · venues reachable · latency ok",
  "pr-watch · 1 open PR triaged",
  "solver · EV +0.0925 @ seed 1337",
  "hermes · build + runtime QA green",
  "content-validate · 427 files ✓",
  "incident-watch · nothing to report",
];

/* djinn's dedicated store went live 2026-06-28; the agent has run since. */
const DJINN_EPOCH = Date.UTC(2026, 5, 28, 0, 0, 0);

function fmtUptime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `up ${d}d ${h}:${m}:${sec}`;
}

export default function StatusBoard() {
  // null until mounted — server and first client render agree, no hydration drift
  const [now, setNow] = useState<number | null>(null);
  const [tapeI, setTapeI] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    const tape = setInterval(() => setTapeI((i) => (i + 1) % TAPE.length), 2800);
    return () => {
      clearInterval(t);
      clearInterval(tape);
    };
  }, []);

  return (
    <div className="mt-14 overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[12px] text-ink-3">
        <span>supersolid · systems</span>
        <span suppressHydrationWarning className="tabular-nums">
          {now === null ? "state" : fmtUptime(now - DJINN_EPOCH)}
        </span>
      </div>
      {PROCESSES.map((p, i) => (
        <a
          key={p.name}
          href={p.href}
          style={{ "--boot-i": i } as React.CSSProperties}
          className="boot group flex items-center gap-4 border-b border-line px-5 py-4 transition-colors hover:bg-surface-2"
        >
          <span
            className={`dot ${p.live ? "dot--live" : "dot--accent"} shrink-0`}
            aria-hidden
          />
          <span className="w-32 shrink-0 font-mono text-[14px] font-medium text-ink sm:w-36">
            {p.name}
          </span>
          <span className="hidden flex-1 truncate text-[13.5px] text-ink-2 sm:block">
            {p.desc}
          </span>
          <span className="ml-auto shrink-0 font-mono text-[12px] text-ink-3 transition-colors group-hover:text-accent">
            {p.state} →
          </span>
        </a>
      ))}
      {/* event tape — replayed samples of real system events */}
      <div className="flex items-center gap-3 px-5 py-2.5 font-mono text-[11.5px]">
        <span className="shrink-0 text-ink-3">tape</span>
        <span
          key={tapeI}
          className="boot truncate text-ink-2"
          style={{ "--boot-i": 0 } as React.CSSProperties}
          aria-live="off"
        >
          {TAPE[tapeI]}
        </span>
        <span className="ml-auto shrink-0 text-[10.5px] uppercase tracking-wider text-ink-3">
          replay
        </span>
      </div>
    </div>
  );
}
