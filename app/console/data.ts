/* Every figure here was mined and verified from the source repos.
   Nothing is estimated. See MEMORY / the fact-mining pass for provenance. */

export type PaneId =
  | "overview"
  | "works"
  | "djinn"
  | "trading"
  | "hermes"
  | "fleet"
  | "career"
  | "contact";

export const RAIL: { id: PaneId; label: string; state: "live" | "idle" | "off"; meta: string }[] = [
  { id: "overview", label: "OVERVIEW", state: "off", meta: "" },
  { id: "works", label: "WORKS", state: "live", meta: "13 entries" },
  { id: "djinn", label: "DJINN", state: "live", meta: "agent" },
  { id: "trading", label: "TRADING", state: "live", meta: "platform" },
  { id: "hermes", label: "HERMES", state: "idle", meta: "framework" },
  { id: "fleet", label: "FLEET", state: "idle", meta: "~30 shipped" },
  { id: "career", label: "CAREER", state: "off", meta: "8 years" },
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
      "An open-source agentic workflow platform, in continuous development since January 2026 and running unattended on a cloud VM since June — reachable through Slack, supervised by pm2, responsible for real infrastructure. It watches a trading server, files nightly digests, detects incidents, and maintains its own knowledge store.",
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

/* ——————————————————————————————————————————————
   WORKS — the full catalogue, in more detail than the scroll view
   carries. Every figure here is mined from the source repos or the
   live sites; status is what was true on 2026-08-26.
   —————————————————————————————————————————————— */

export type WorkStatus = "live" | "idle" | "offline" | "building" | "research";

export const WORKS: {
  id: string;
  name: string;
  status: WorkStatus;
  href: string | null;
  one: string;
  detail: string;
  stack: string[];
  facts: { k: string; v: string }[];
}[] = [
  {
    id: "djinn",
    name: "DJINN",
    status: "live",
    href: "https://djinn-site.vercel.app",
    one: "Autonomous operations agent. Your company brain.",
    detail:
      "An AI agent that has run unattended on a cloud VM since 28 June 2026, reachable through Slack and supervised by pm2. Around fifty purpose-built ops scripts — health doctors for remote hosts, P&L analysts, PR watchers, incident detection, nightly digests — each runnable dry, each reporting to Slack. It keeps a markdown brain of 90+ interlinked notes: it recalls from it, writes to it, lints it, and runs a nightly pass proposing links it thinks are missing. Watchdogs turn recurring failures into tracked repair work on GitHub, and per-repo deploy keys scope exactly what it is allowed to touch.",
    stack: ["Node.js", "Claude Agent SDK", "pm2", "Slack", "Supabase", "cron", "DigitalOcean"],
    facts: [
      { k: "in development since", v: "jan 2026" },
      { k: "unattended since", v: "28 jun 2026" },
      { k: "ops scripts", v: "~50" },
      { k: "brain notes", v: "90+" },
      { k: "humans on call", v: "0" },
    ],
  },
  {
    id: "supersolid",
    name: "Supersolid",
    status: "live",
    href: "https://supersolid.co",
    one: "The studio. Let Man Know What Man Can.",
    detail:
      "Where the agent work and the client work meet, and where most of this catalogue was built. Carries its own brand system: VHS/retro-tech with modern polish, a solid red mark with a periodic glitch, Anton for display, Archivo for body, IBM Plex Mono for labels. The brand kit is a real document, not decoration — it governs colour roles, type ramp, spacing and a refuse list.",
    stack: ["Next.js", "Tailwind", "Three.js", "Vercel Analytics"],
    facts: [
      { k: "brand docs", v: "3" },
      { k: "reveal render", v: "blender" },
    ],
  },
  {
    id: "half-productions",
    name: "Half Production",
    status: "live",
    href: "https://half-productions.vercel.app",
    one: "Multilingual event-production site and internal booking desk for Ibiza.",
    detail:
      "Official public site for an Argentina-to-Ibiza event-production crew, with the brand system, Dharma residency, Boiler Food concept, HP Crew, venue history, guest DJs, partner proof, contact flows and print-ready QR assets. Behind the public site is a noindex booking desk for the monthly guest-slot problem: who is already on Ibiza, close to the lane, inside budget, and reachable through a warm relationship. The data model separates the reusable booking motor from the Half Production tenant, and it keeps source confidence, fee evidence, exclusivity radius and compliance checks visible instead of pretending the calendar is complete.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind", "Vercel", "Supabase"],
    facts: [
      { k: "locales", v: "6" },
      { k: "events indexed", v: "2,032" },
      { k: "venues", v: "92" },
      { k: "fee observations", v: "112" },
    ],
  },
  {
    id: "trading",
    name: "Trading platform",
    status: "live",
    href: null,
    one: "Trading infrastructure for prediction markets.",
    detail:
      "A four-crate Rust workspace supervising fleets of trading bots, recording every fill through a contract-tested pipeline into Postgres, and serving a React 19 console over 60 REST and WebSocket routes. Five engine adapters self-describe their config, capabilities and presets over one endpoint, so the console renders every launch form from that response and adding an engine needs zero frontend changes. Live records seed the expectancy solver, so what you simulate is exactly what you launch. Every figure names its scope: one ledger per number, LIVE/PAPER chips, and unreachable venues render unknown rather than zero.",
    stack: ["Rust", "tokio", "axum", "sqlx", "React 19", "TanStack Query", "PostgreSQL", "DuckDB/Parquet"],
    facts: [
      { k: "rust lines", v: "28,964" },
      { k: "tests", v: "373" },
      { k: "api routes", v: "60" },
      { k: "book snapshots", v: "45M" },
    ],
  },
  {
    id: "hermes",
    name: "Hermes",
    status: "idle",
    href: null,
    one: "A Rust framework for LLM orchestration.",
    detail:
      "Five AI providers behind one Rust trait with a stack-allocated core, and multi-persona orchestrators on top: teams of AI roles on different models that generate complete Next.js sites. Provider adapters are crates implementing a single executor trait, so swapping Claude for Groq never touches orchestration logic and model choice becomes a per-role decision — fast models triage, strong models fix. The repo preserves 21 numbered orchestrator versions, including a QA pipeline that installs, builds and runtime-tests what it generated, then repairs what fails.",
    stack: ["Rust", "clap", "tokio", "Claude", "OpenAI", "Gemini", "Groq", "Firecrawl"],
    facts: [
      { k: "crates", v: "11" },
      { k: "versions", v: "21" },
      { k: "cli lines", v: "4,454" },
      { k: "projects powered", v: "~30" },
    ],
  },
  {
    id: "speed",
    name: "Speed Ibiza",
    status: "live",
    href: "https://speed-ibiza.vercel.app",
    one: "Operational software for a beverage distributor.",
    detail:
      "The software the business actually runs on. Three surfaces: a desktop admin for the office (orders, customers, cobranza, stock, facturas), a mobile field app for a phone in a van (today's route, order intake, deliveries), and a customer account surface. Route planning on Leaflet/OpenStreetMap, Spanish invoice generation, and full es/en i18n.",
    stack: ["Vite", "React 19", "TypeScript", "Tailwind", "shadcn/ui", "Supabase", "react-router v7", "i18next", "Leaflet/OSM"],
    facts: [
      { k: "surfaces", v: "3" },
      { k: "locales", v: "es · en" },
    ],
  },
  {
    id: "luxy",
    name: "Luxey",
    status: "live",
    href: "https://luxey.vercel.app",
    one: "Concierge for Ibiza, through WhatsApp.",
    detail:
      "A WhatsApp agent takes a request in plain language — a table, a boat, a villa — and turns it into something bookable, with checkout attached. Ships alongside an ads generator and a catalogue system.",
    stack: ["React", "WhatsApp API", "Stripe", "Vercel"],
    facts: [{ k: "intake", v: "free-form" }],
  },
  {
    id: "outflow",
    name: "Outflow",
    status: "live",
    href: "https://www.outflow.com.ar",
    one: "DJ school and sound rental, Buenos Aires.",
    detail:
      "Courses, equipment and bookings for a business that lives on its reputation. Glassmorphic black-and-white treatment, fully in Spanish.",
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind", "Headless UI"],
    facts: [{ k: "market", v: "buenos aires" }],
  },
  {
    id: "imho",
    name: "IMHO",
    status: "live",
    href: "https://imho-real-estate.vercel.app",
    one: "AI real-estate search for Argentina.",
    detail:
      "Scrapers behind rotating proxies feed a natural-language pipeline where a second judge model confidence-scores every extraction before it is allowed to count. A WhatsApp agent parses free-form Spanish into structured queries. The schema is built to expand into legal and automotive verticals. The Python backend was rewritten in TypeScript at roughly a quarter of the size — the complexity cut is the lesson. Market watch runs always-on from the DJINN droplet.",
    stack: ["Next.js 15", "Fastify", "Supabase", "rotating proxies", "judge-LLM gating"],
    facts: [
      { k: "iterations", v: "4 in 5 weeks" },
      { k: "python → ts", v: "7.1K → 1.8K" },
      { k: "schema", v: "28 tables" },
    ],
  },
  {
    id: "pushy",
    name: "Pushy",
    status: "offline",
    href: null,
    one: "Notification system built for crypto exchanges.",
    detail:
      "Rust and Axum at the front, a background worker behind it, Postgres and Redis underneath, SQS for the queue and Contentful for the templates — so marketing ships copy without waiting on a deploy. Email and push, with template management outside the codebase. The deployment at pushy.ar is currently down.",
    stack: ["Rust", "Axum", "PostgreSQL", "Redis", "LocalStack SQS", "Contentful", "React"],
    facts: [{ k: "channels", v: "email · push" }],
  },
  {
    id: "ascenso",
    name: "Ascenso",
    status: "building",
    href: null,
    one: "A playable climb of Volcán Lanín in Unreal Engine 5.",
    detail:
      "Real terrain from satellite elevation data, the real Tromen route from OpenStreetMap, and hazards taken from having actually summited the mountain. Seven checkpoints from the ranger station at 1,200m to the crater rim at 3,600m, each a gameplay decision. The same SRTM elevation file feeds three products: this game, the 3D terrain map on jtreks.co, and a 3D-printed keyring.",
    stack: ["Unreal Engine 5", "C++", "SRTM elevation", "OpenStreetMap", "PCG", "Niagara"],
    facts: [
      { k: "summit", v: "3,776m" },
      { k: "checkpoints", v: "7" },
      { k: "heightmap", v: "505 × 505" },
    ],
  },
  {
    id: "sniper",
    name: "Solana Sniper",
    status: "research",
    href: null,
    one: "Watches Raydium for tokens before they are listed anywhere useful.",
    detail:
      "A Rust service that subscribes to logs mentioning Raydium, filters initialize2 events, pulls the mint out of the transaction and fetches its metadata. It also profiles holder distribution for a given SPL address, which is the cheapest way to tell a launch from a rug. Diesel migrations, Dockerised.",
    stack: ["Rust", "Diesel", "PostgreSQL", "Docker", "Solana RPC", "Raydium"],
    facts: [{ k: "trigger", v: "initialize2" }],
  },
  {
    id: "jtreks",
    name: "jtreks.co",
    status: "live",
    href: "https://jtreks.co",
    one: "Multilingual adventure-travel platform, built solo.",
    detail:
      "Dozens of destination regions with interactive 3D terrain maps of real mountain ranges, a guide library fully translated across 6 locales, live weather for dozens of peaks, and an LLM trip assistant grounded exclusively in the site's own content. Every hero image, frontmatter field and translation is checked by a build-time validation pipeline.",
    stack: ["Next.js", "Mapbox DEM", "Supabase", "typed i18n", "build-time validation"],
    facts: [
      { k: "loc", v: "77K" },
      { k: "locales", v: "6" },
      { k: "commits", v: "467" },
      { k: "built in", v: "4 months" },
    ],
  },
];
