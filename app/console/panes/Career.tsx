"use client";

import { CAREER } from "../data";

const SKILLS: { group: string; items: string[] }[] = [
  { group: "systems", items: ["Rust", "Scala", "Akka", "Java", "Go", "C#"] },
  { group: "product", items: ["TypeScript", "React", "Next.js", "Python"] },
  { group: "infra", items: ["Kubernetes", "Helm", "ArgoCD", "Docker", "AWS", "CI/CD"] },
  { group: "data", items: ["PostgreSQL", "Supabase", "DuckDB", "Neo4j", "DynamoDB"] },
  { group: "patterns", items: ["Event-driven", "Actor model", "DDD", "TDD", "Microservices"] },
];

export default function Career() {
  return (
    <div className="pane-in px-5 py-10 sm:px-8">
      <span className="lbl">career</span>
      <h2 className="readout mt-4 max-w-3xl text-[24px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[34px]">
        Seven years of distributed systems, mostly for US and UK teams
      </h2>

      <ol className="mt-9">
        {CAREER.map((r) => (
          <li
            key={r.company + r.years}
            className="grid gap-x-5 gap-y-1 border-t border-rule py-4 sm:grid-cols-[128px_1fr]"
          >
            <div className="flex items-center gap-2">
              <span
                className={`dot ${r.now ? "dot--live" : "dot--off"}`}
                aria-hidden
              />
              <span className="readout text-[11.5px] text-ink-3">{r.years}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="readout text-[14.5px] font-bold text-ink">
                  {r.company}
                </span>
                <span className="text-[13px] text-ink-2">{r.role}</span>
              </div>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
                {r.note}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10 border-t border-rule-bright pt-6">
        <span className="lbl">stack</span>
        <div className="mt-4 flex flex-col gap-3">
          {SKILLS.map((s) => (
            <div key={s.group} className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <span className="lbl w-20 shrink-0">{s.group}</span>
              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                {s.items.map((i) => (
                  <span
                    key={i}
                    className="readout rounded-sm border border-rule bg-panel px-2 py-0.5 text-[11.5px] text-ink-2"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 overflow-hidden rounded-sm border border-rule bg-panel p-5">
        <span className="lbl">working languages</span>
        <p className="mt-2.5 text-[14px] text-ink">
          English <span className="text-ink-3">bilingual</span> · Spanish{" "}
          <span className="text-ink-3">native</span>
        </p>
        <p className="mt-1 text-[14px] text-ink-2">
          Seven years remote with US and UK teams.
        </p>
      </section>
    </div>
  );
}
