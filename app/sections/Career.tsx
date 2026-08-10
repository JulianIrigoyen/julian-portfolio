const ROLES = [
  {
    years: "2026 —",
    company: "Supersolid",
    role: "Founder & Principal Engineer",
    note: "Autonomous agent infrastructure, a Rust trading platform, and client product work.",
  },
  {
    years: "2024 — 2026",
    company: "TrueML",
    role: "Senior Software Engineer II",
    note: "Platform engineering across Java, TypeScript, Scala and Go. AuthZ platform on AWS Cognito; CI/CD with Kubernetes, Helm, ArgoCD; revenue-driving payment features.",
  },
  {
    years: "2021 — 2024",
    company: "Expero",
    role: "Backend Developer — Rust & .NET",
    note: "Portfolio management for IHS Markit: APIs and data pipelines for capital-intensive markets, event-driven architecture.",
  },
  {
    years: "2022 — 2023",
    company: "Fractal Technology",
    role: "Lead Developer — Scala & Akka",
    note: "String3, a Layer 1 blockchain built on the actor model. Joined as support, left as lead.",
  },
  {
    years: "2021",
    company: "Alma Fintech",
    role: "Full-stack Developer",
    note: "Daruma electronic wallet, end to end.",
  },
  {
    years: "2020 — 2021",
    company: "Tiendanube",
    role: "Backend Developer — Scala & Akka",
    note: "Reactive microservices for Latin America's largest e-commerce platform. Akka Typed, Persistence, Streams, Cluster Sharding.",
  },
  {
    years: "2019 — 2020",
    company: "Intive · Globant",
    role: "Java & Scala Developer",
    note: "Microservices for Disney; energy-sector services for Mosaic.",
  },
] as const;

export default function Career() {
  return (
    <section className="mx-auto w-full max-w-4xl border-t border-line px-6 py-20" id="career">
      <h2 className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-ink-3">
        Career
      </h2>
      <div className="mt-8 border-l border-line">
        {ROLES.map((r, i) => (
          <div key={r.company + r.years} className="relative pb-9 pl-7 last:pb-0">
            <span
              className={`absolute left-0 top-[7px] h-[7px] w-[7px] -translate-x-1/2 rounded-full ${
                i === 0 ? "bg-accent" : "border border-ink-3 bg-bg"
              }`}
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-[12.5px] text-ink-3">{r.years}</span>
              <span className="text-[15px] font-semibold text-ink">{r.company}</span>
              <span className="text-[13.5px] text-ink-2">{r.role}</span>
            </div>
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-2">
              {r.note}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink-3">
            Education
          </h3>
          <p className="mt-3 text-[14px] text-ink">
            MSc FinTech — ITBA, Buenos Aires{" "}
            <span className="text-ink-3">(in progress)</span>
          </p>
          <p className="mt-1.5 text-[14px] text-ink-2">
            BA — Washington &amp; Lee University, Virginia
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink-3">
            Working languages
          </h3>
          <p className="mt-3 text-[14px] text-ink">
            English <span className="text-ink-3">bilingual</span> · Spanish{" "}
            <span className="text-ink-3">native</span>
          </p>
          <p className="mt-1.5 text-[14px] text-ink-2">
            Seven years remote with US and UK teams.
          </p>
        </div>
      </div>
    </section>
  );
}
