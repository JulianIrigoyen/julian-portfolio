import StatusBoard from "./StatusBoard";

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
        One engineer, operating like an engineering org: an AI agent runs my
        infrastructure around the clock, a Rust framework ships my client work,
        and a trading platform executes on live markets. Underneath: seven years
        of distributed-systems work — Scala/Akka, Rust, TypeScript — for US and
        UK companies. Supersolid, Buenos Aires.
      </p>

      <StatusBoard />
    </header>
  );
}
