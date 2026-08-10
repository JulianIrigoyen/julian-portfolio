/* The lattice: Supersolid's namesake — a crystal that flows.
   Ordered dot grid, one continuous line passing through it. */
function Lattice() {
  const dots: React.ReactElement[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 22; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={20 + c * 26}
          cy={16 + r * 24}
          r={1.6}
          fill="var(--ink-3)"
          opacity={0.5}
        />,
      );
    }
  }
  return (
    <svg
      viewBox="0 0 586 128"
      className="pointer-events-none w-full"
      aria-hidden
      role="presentation"
    >
      {dots}
      <path
        d="M 0 64 C 80 64, 100 28, 170 28 S 280 100, 360 100 S 500 40, 586 40"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        opacity={0.8}
      />
    </svg>
  );
}

export default function Contact() {
  return (
    <section className="border-t border-line" id="contact">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <Lattice />
        <h2 className="mt-10 font-mono text-[24px] font-semibold tracking-tight sm:text-4xl">
          Order and flow, at the same time.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] text-ink-2">
          A supersolid is matter that is crystalline and frictionless at once —
          rigid structure, zero-resistance flow. It is also a fair description
          of good infrastructure. That is the standard I build to.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="mailto:martinirigoyenj17@gmail.com"
            className="inline-flex w-fit items-center gap-2.5 rounded-md bg-accent px-5 py-2.5 font-mono text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
          >
            martinirigoyenj17@gmail.com
          </a>
          <p className="text-[13.5px] text-ink-2">
            Open to senior AI/agent and Rust engineering roles — and select
            consulting through Supersolid.
          </p>
        </div>
        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[12px] text-ink-3">
          <span>© {new Date().getFullYear()} Julian Irigoyen · Buenos Aires</span>
          <span className="flex gap-5">
            <a
              className="transition-colors hover:text-ink-2"
              href="https://github.com/JulianIrigoyen"
              target="_blank"
              rel="noopener noreferrer"
            >
              github
            </a>
            <a
              className="transition-colors hover:text-ink-2"
              href="https://linkedin.com/in/julianirigoyen"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </span>
        </footer>
      </div>
    </section>
  );
}
