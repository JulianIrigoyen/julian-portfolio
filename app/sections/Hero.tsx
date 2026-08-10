const PROCESSES = [
  {
    name: "djinn-slack",
    state: "online",
    live: true,
    desc: "autonomous ops agent · Slack · running unattended since June 2026",
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

export default function Hero() {
  return (
    <header className="mx-auto w-full max-w-4xl px-6 pt-20 pb-24 sm:pt-28">
      <nav className="mb-16 flex items-center justify-between font-mono text-[13px] text-ink-2">
        <span className="text-ink">julian irigoyen</span>
        <div className="flex gap-6">
          <a
            className="transition-colors hover:text-ink"
            href="https://github.com/JulianIrigoyen"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <a
            className="transition-colors hover:text-ink"
            href="https://linkedin.com/in/julianirigoyen"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>
          <a
            className="transition-colors hover:text-ink"
            href="mailto:martinirigoyenj17@gmail.com"
          >
            email
          </a>
        </div>
      </nav>

      <h1 className="font-mono text-[27px] font-semibold leading-[1.15] tracking-tight min-[440px]:text-4xl sm:text-[54px] sm:leading-[1.12]">
        I build autonomous systems
        <br />
        that <span className="text-accent">stay in production</span>.
      </h1>

      <p className="mt-7 max-w-xl text-[16px] text-ink-2">
        Distributed-systems engineer — Scala/Akka, Rust, TypeScript. Seven years
        building platforms for US and UK companies; the last two building AI
        agent systems that run unattended, not in demos. Principal engineer at
        Supersolid, Buenos Aires.
      </p>

      {/* the status board — what's actually running */}
      <div className="mt-14 overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[12px] text-ink-3">
          <span>supersolid · systems</span>
          <span>state</span>
        </div>
        {PROCESSES.map((p, i) => (
          <a
            key={p.name}
            href={p.href}
            style={{ "--boot-i": i } as React.CSSProperties}
            className="boot group flex items-center gap-4 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-surface-2"
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
      </div>
    </header>
  );
}
