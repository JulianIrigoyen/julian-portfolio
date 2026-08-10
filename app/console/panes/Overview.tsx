"use client";

import { useEffect, useState } from "react";
import { DJINN_EPOCH, SYSTEMS, type PaneId } from "../data";

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

export default function Overview({ go }: { go: (id: PaneId) => void }) {
  const tiles = [SYSTEMS.djinn, SYSTEMS.trading, SYSTEMS.hermes];

  return (
    <div className="pane-in">
      {/* the pitch — unmissable */}
      <section className="border-b border-rule px-5 py-10 sm:px-8 sm:py-14">
        <span className="lbl">operator</span>
        <h1 className="readout mt-3 text-[30px] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[46px] lg:text-[62px]">
          One engineer,
          <br />
          operating like an
          <br />
          <span className="text-amber">engineering org.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-2 sm:text-[16.5px]">
          An AI agent runs my infrastructure around the clock. A Rust framework
          ships my client work. A trading platform executes on live markets.
          Underneath all of it: seven years of distributed-systems engineering —
          Scala/Akka, Rust, TypeScript — for companies in the US and UK.
        </p>

        <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {[
            { k: "agent uptime", v: <Uptime />, note: "unattended", tone: "phosphor" },
            { k: "years shipping", v: "7", note: "US · UK · AR", tone: "ink" },
            { k: "products shipped", v: "~30", note: "client + founder", tone: "ink" },
            { k: "languages in prod", v: "8", note: "rust · scala · ts …", tone: "ink" },
          ].map((s) => (
            <div key={s.k}>
              <dt className="lbl">{s.k}</dt>
              <dd
                className={`readout mt-1.5 text-[19px] font-bold sm:text-[24px] ${
                  s.tone === "phosphor" ? "text-phosphor" : "text-ink"
                }`}
              >
                {s.v}
              </dd>
              <dd className="lbl mt-0.5 !text-[9px] !tracking-[0.1em]">{s.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* three systems, one machine */}
      <section className="px-5 py-10 sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="lbl">systems</span>
          <p className="text-[13.5px] text-ink-2">
            Not three projects — one machine.
          </p>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-3">
          {tiles.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className="group flex flex-col bg-panel p-5 text-left transition-colors hover:bg-panel-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`dot ${s.state === "live" ? "dot--live" : "dot--idle"}`}
                  aria-hidden
                />
                <span className="readout text-[12px] font-bold tracking-wide text-amber">
                  {s.codename}
                </span>
              </div>
              <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink">
                {s.title}
              </h3>
              <div className="mt-4 flex flex-col gap-1.5">
                {s.readouts.slice(0, 3).map((r) => (
                  <div key={r.k} className="flex items-baseline gap-2">
                    <span className="readout w-16 shrink-0 text-[15px] font-bold text-ink">
                      {r.v}
                    </span>
                    <span className="lbl !tracking-[0.12em]">{r.k}</span>
                  </div>
                ))}
              </div>
              <span className="lbl mt-5 !text-amber transition-transform group-hover:translate-x-0.5">
                open →
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-[13.5px] leading-relaxed text-ink-3">
          The agent operates the infrastructure. The framework ships the client
          work that funds the lab. The platform is the lab.
        </p>
      </section>
    </div>
  );
}
