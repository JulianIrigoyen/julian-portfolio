import SolverWidget from "./SolverWidget";

type System = {
  id: string;
  slug: string;
  title: string;
  state: string;
  story: string;
  highlights: { title: string; detail: string }[];
  metrics: string[];
  stack: string;
};

const SYSTEMS: System[] = [
  {
    id: "djinn",
    slug: "djinn",
    title: "A 24/7 autonomous ops agent",
    state: "online",
    story:
      "Djinn is an AI agent that has run unattended on a cloud VM since June 2026 — reachable through Slack, supervised by pm2, and responsible for real infrastructure. It watches a trading server, files digests every night, detects incidents, and maintains its own knowledge store. Not a demo: it has cron duties, deploy keys, and an on-call human only when it pages one.",
    highlights: [
      {
        title: "An operations fleet, not a chatbot",
        detail:
          "~50 purpose-built scripts: health doctors for remote hosts, P&L analysts, PR watchers, incident detection, nightly digests — each runnable dry, each reporting to Slack.",
      },
      {
        title: "A knowledge store it maintains itself",
        detail:
          "A markdown brain of 90+ interlinked notes. The agent recalls from it, writes to it, lints it, and runs a nightly pass that proposes missing links between related notes.",
      },
      {
        title: "Failure handling as a first-class feature",
        detail:
          "Watchdogs detect incidents; a fix pipeline turns recurring failures into tracked repair work on GitHub. Per-repo deploy keys scope what the agent can touch.",
      },
    ],
    metrics: [
      "running unattended since 06/2026",
      "~50 ops scripts",
      "90+ note knowledge graph",
      "nightly digests · watchdogs",
    ],
    stack: "Node.js · Claude Agent SDK · pm2 · Slack · Supabase · cron",
  },
  {
    id: "trading",
    slug: "trading-api",
    title: "Trading infrastructure for prediction markets",
    state: "live",
    story:
      "A four-crate Rust workspace that supervises fleets of trading bots on prediction markets, records every fill through a contract-tested pipeline into Postgres, and serves a React 19 console over 60 REST and WebSocket routes. The console closes the loop: live trade records seed a deterministic expectancy solver — closed-form EV, Kelly log-growth, seeded Monte Carlo — so what you simulate is exactly what you launch.",
    highlights: [
      {
        title: "Engines are schemas, not integrations",
        detail:
          "Five engine adapters self-describe their config, capabilities and presets over one endpoint; the console renders every launch form from that response. Adding an engine requires zero frontend changes.",
      },
      {
        title: "Financial-grade number discipline",
        detail:
          "Every figure on the console names its scope: one ledger per number, LIVE/PAPER chips, unreachable venues render unknown — never zero. Each rule exists because a subtler system would have lied, and each is pinned by a named test.",
      },
      {
        title: "Research held to a kill-standard",
        detail:
          "A 9.2M-row orderbook corpus, 2,169 strategy configs swept with t-stats, five independent methods reconciled. No edge counts until it survives execution lag — the harness audits its own findings before they can cost money.",
      },
    ],
    metrics: [
      "28,964 Rust LOC · 4 crates",
      "228 Rust tests · 145 UI tests",
      "60 API routes · 10 migrations",
      "45M orderbook snapshots · DuckDB",
    ],
    stack:
      "Rust (tokio, axum, sqlx) · React 19 · TanStack Query · TradingView Charts · PostgreSQL · DuckDB/Parquet",
  },
  {
    id: "hermes",
    slug: "hermes",
    title: "A Rust framework for LLM orchestration",
    state: "v31",
    story:
      "Hermes puts five AI providers — Claude, OpenAI, Gemini, Groq, Firecrawl — behind one Rust trait with a stack-allocated core, and builds multi-persona orchestrators on top: teams of AI roles on different models that generate complete Next.js sites. The repo preserves 21 numbered orchestrator versions, from a v9 post-mortem on why raw LLM codegen corrupts output to a three-persona QA pipeline that installs, builds, and runtime-tests what it generated — then fixes what fails.",
    highlights: [
      {
        title: "One trait, five providers",
        detail:
          "Provider adapters are crates implementing a single executor trait — swap Claude for Groq without touching orchestration logic. Model choice becomes a per-role decision: fast models triage, strong models fix.",
      },
      {
        title: "Self-validating generation",
        detail:
          "The Builder Trio: an orchestrator persona analyses, a speed-runner triages errors on a 30-second budget, a master builder repairs on a 90-second one. Generated projects must build and pass runtime checks before they count.",
      },
      {
        title: "Observability built for LLM work",
        detail:
          "Structured logging with persona/flow/phase/model levels, JSON session logs, per-session dashboards, and an error database tracking recurring failure patterns across runs.",
      },
    ],
    metrics: [
      "11 crates · 5 provider adapters",
      "21 orchestrator versions (v9→v31)",
      "4.4K-LOC CLI · 77 tests",
      "powers ~30 client projects",
    ],
    stack: "Rust · clap · tokio · Claude / OpenAI / Gemini / Groq / Firecrawl",
  },
];

export default function Systems() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <h2 className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-ink-3">
          Systems
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] text-ink-2">
          Not three projects — one machine. The agent operates the
          infrastructure, the framework ships the client work that funds the
          lab, and the platform is the lab.
        </p>
        <div className="mt-10 flex flex-col gap-16">
          {SYSTEMS.map((s) => (
            <article key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[13px] text-accent">{s.slug}</span>
                <h3 className="text-[20px] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <span className="ml-auto font-mono text-[12px] text-ink-3">
                  {s.state}
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-[14.5px] leading-relaxed text-ink-2">
                {s.story}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {s.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="rounded-lg border border-line bg-surface p-4"
                  >
                    <h4 className="text-[13.5px] font-semibold text-ink">
                      {h.title}
                    </h4>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
                      {h.detail}
                    </p>
                  </div>
                ))}
              </div>
              {s.id === "trading" && <SolverWidget />}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-ink-2">
                {s.metrics.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11.5px] text-ink-3">{s.stack}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
