/* Every figure here was mined and verified from the source repos.
   Nothing is estimated. See MEMORY / the fact-mining pass for provenance. */

export type PaneId =
  | "overview"
  | "djinn"
  | "trading"
  | "hermes"
  | "fleet"
  | "career"
  | "contact";

export const RAIL: { id: PaneId; label: string; state: "live" | "idle" | "off"; meta: string }[] = [
  { id: "overview", label: "OVERVIEW", state: "off", meta: "" },
  { id: "djinn", label: "DJINN", state: "live", meta: "agent" },
  { id: "trading", label: "TRADING", state: "live", meta: "platform" },
  { id: "hermes", label: "HERMES", state: "idle", meta: "framework" },
  { id: "fleet", label: "FLEET", state: "idle", meta: "~30 shipped" },
  { id: "career", label: "CAREER", state: "off", meta: "7 years" },
  { id: "contact", label: "CONTACT", state: "off", meta: "" },
];

/* djinn's dedicated store went live 2026-06-28; the agent has run since. */
export const DJINN_EPOCH = Date.UTC(2026, 5, 28, 0, 0, 0);

export const TAPE: string[] = [
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
  "fix-train · recurring failure → issue filed",
  "github-digest · 4 repos summarised",
];

export const SYSTEMS = {
  djinn: {
    id: "djinn" as const,
    codename: "djinn",
    title: "Autonomous operations agent",
    state: "live" as const,
    thesis:
      "An AI agent that has run unattended on a cloud VM since June 2026 — reachable through Slack, supervised by pm2, responsible for real infrastructure. It watches a trading server, files nightly digests, detects incidents, and maintains its own knowledge store.",
    readouts: [
      { k: "uptime", v: "live", note: "unattended" },
      { k: "ops scripts", v: "~50", note: "each runnable dry" },
      { k: "knowledge graph", v: "90+", note: "interlinked notes" },
      { k: "human on-call", v: "0", note: "until it pages one" },
    ],
    detail: [
      {
        t: "An operations fleet, not a chatbot",
        d: "Around fifty purpose-built scripts: health doctors for remote hosts, P&L analysts, PR watchers, incident detection, nightly digests. Each one runnable dry, each reporting to Slack.",
      },
      {
        t: "A knowledge store it maintains itself",
        d: "A markdown brain of 90+ interlinked notes. The agent recalls from it, writes to it, lints it, and runs a nightly pass proposing missing links between related notes.",
      },
      {
        t: "Failure handling as a first-class feature",
        d: "Watchdogs detect incidents; a fix pipeline turns recurring failures into tracked repair work on GitHub. Per-repo deploy keys scope exactly what the agent is allowed to touch.",
      },
    ],
    stack: "Node.js · Claude Agent SDK · pm2 · Slack · Supabase · cron",
  },
  trading: {
    id: "trading" as const,
    codename: "trading-api",
    title: "Trading infrastructure for prediction markets",
    state: "live" as const,
    thesis:
      "A four-crate Rust workspace supervising fleets of trading bots, recording every fill through a contract-tested pipeline into Postgres, and serving a React 19 console over 60 REST and WebSocket routes. Live records seed the expectancy solver — so what you simulate is exactly what you launch.",
    readouts: [
      { k: "rust", v: "28,964", note: "lines · 4 crates" },
      { k: "tests", v: "373", note: "228 rust · 145 ui" },
      { k: "api routes", v: "60", note: "rest + websocket" },
      { k: "corpus", v: "45M", note: "book snapshots" },
    ],
    detail: [
      {
        t: "Engines are schemas, not integrations",
        d: "Five engine adapters self-describe their config, capabilities and presets over one endpoint; the console renders every launch form from that response. Adding an engine needs zero frontend changes.",
      },
      {
        t: "Financial-grade number discipline",
        d: "Every figure names its scope: one ledger per number, LIVE/PAPER chips, unreachable venues render unknown — never zero. Each rule exists because a subtler system would have lied, and each is pinned by a named test.",
      },
      {
        t: "Research held to a kill-standard",
        d: "A 9.2M-row orderbook corpus, 2,169 strategy configs swept with t-stats, five independent methods reconciled. No edge counts until it survives execution lag — the harness audits its own findings before they can cost money.",
      },
    ],
    stack:
      "Rust (tokio · axum · sqlx) · React 19 · TanStack Query · TradingView Charts · PostgreSQL · DuckDB/Parquet",
  },
  hermes: {
    id: "hermes" as const,
    codename: "hermes",
    title: "A Rust framework for LLM orchestration",
    state: "idle" as const,
    thesis:
      "Five AI providers behind one Rust trait with a stack-allocated core, and multi-persona orchestrators on top: teams of AI roles on different models that generate complete Next.js sites. The repo preserves 21 numbered orchestrator versions — including a QA pipeline that installs, builds and runtime-tests what it generated, then fixes what fails.",
    readouts: [
      { k: "crates", v: "11", note: "5 provider adapters" },
      { k: "versions", v: "21", note: "v9 → v31" },
      { k: "cli", v: "4,454", note: "lines · 8 commands" },
      { k: "powers", v: "~30", note: "client projects" },
    ],
    detail: [
      {
        t: "One trait, five providers",
        d: "Provider adapters are crates implementing a single executor trait — swap Claude for Groq without touching orchestration logic. Model choice becomes a per-role decision: fast models triage, strong models fix.",
      },
      {
        t: "Self-validating generation",
        d: "The Builder Trio: an orchestrator persona analyses, a speed-runner triages errors on a 30-second budget, a master builder repairs on a 90-second one. Generated projects must build and pass runtime checks before they count.",
      },
      {
        t: "Observability built for LLM work",
        d: "Structured logging with persona, flow, phase and model levels; JSON session logs; per-session dashboards; and an error database tracking recurring failure patterns across runs.",
      },
    ],
    stack: "Rust · clap · tokio · Claude / OpenAI / Gemini / Groq / Firecrawl",
  },
};

export const CAREER = [
  {
    years: "2026 —",
    company: "Supersolid",
    role: "Founder & Principal Engineer",
    note: "Autonomous agent infrastructure, a Rust trading platform, and client product work.",
    now: true,
  },
  {
    years: "2024 — 2026",
    company: "TrueML",
    role: "Senior Software Engineer II",
    note: "Platform engineering across Java, TypeScript, Scala and Go. AuthZ platform on AWS Cognito; CI/CD with Kubernetes, Helm, ArgoCD; revenue-driving payment features.",
    now: false,
  },
  {
    years: "2021 — 2024",
    company: "Expero",
    role: "Backend Developer — Rust & .NET",
    note: "Portfolio management for IHS Markit: APIs and data pipelines for capital-intensive markets, event-driven architecture.",
    now: false,
  },
  {
    years: "2022 — 2023",
    company: "Fractal Technology",
    role: "Lead Developer — Scala & Akka",
    note: "String3, a Layer 1 blockchain on the actor model. Joined as support, left as lead.",
    now: false,
  },
  {
    years: "2021",
    company: "Alma Fintech",
    role: "Full-stack Developer",
    note: "Daruma electronic wallet, end to end.",
    now: false,
  },
  {
    years: "2020 — 2021",
    company: "Tiendanube",
    role: "Backend Developer — Scala & Akka",
    note: "Reactive microservices for Latin America's largest e-commerce platform. Akka Typed, Persistence, Streams, Cluster Sharding.",
    now: false,
  },
  {
    years: "2019 — 2020",
    company: "Intive · Globant",
    role: "Java & Scala Developer",
    note: "Microservices for Disney; energy-sector services for Mosaic.",
    now: false,
  },
];
