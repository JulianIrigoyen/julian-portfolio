const FLEET_METRICS = [
  "32 project directories · 40+ apps",
  "~691K first-party LOC",
  "453 test files · 90 SQL migrations",
  "Next.js 14–16 · 11 Supabase projects",
];

const OTHERS = [
  "Tour-operator platform for Egypt's White Desert — 5 locales including Arabic",
  "Aesthetic-medicine clinic, Nordelta — bilingual booking site",
  "Law-firm site, Buenos Aires",
  "Rust/Axum journaling API — 33 source files, SQL migrations, Docker",
  "Recipe & pantry platform with an Expo mobile app — ~119K LOC, versioned releases",
  "Event-production brand, Ibiza — Stripe + WhatsApp concierge integrations",
];

export default function Fleet() {
  return (
    <section className="border-t border-line" id="fleet">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <h2 className="font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-ink-3">
          Client work
        </h2>

        {/* flagship */}
        <article className="mt-10 rounded-lg border border-line bg-surface p-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[13px] text-accent">flagship</span>
            <h3 className="text-[18px] font-semibold tracking-tight">
              <a
                href="https://jtreks.co"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                jtreks.co ↗
              </a>
            </h3>
            <span className="ml-auto font-mono text-[12px] text-ink-3">
              built solo · 4 months
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-2">
            A multilingual adventure-travel platform: 36 destination regions (25
            live) with interactive 3D terrain maps of 24 real mountain ranges, a
            193-article guide library fully translated to Spanish across 6
            locales, live weather for 41 peaks, and an LLM trip assistant
            grounded exclusively in the site&apos;s own content. Every hero
            image, frontmatter field and translation is checked by a build-time
            validation pipeline.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-ink-2">
            <span>77K LOC · 467 commits</span>
            <span>36 regions · 3D terrain</span>
            <span>427 content files · 6 locales</span>
            <span>content-grounded AI assistant</span>
          </div>
        </article>

        {/* the fleet */}
        <div className="mt-8">
          <p className="max-w-3xl text-[14px] leading-relaxed text-ink-2">
            One repeatable production stack — Next.js, Tailwind, Supabase with
            real migrations, typed i18n, env-gated analytics — applied across
            ~30 client and founder projects: booking platforms, clinics, law
            firms, event brands, and heavier builds in Rust.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-ink-2">
            {FLEET_METRICS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {OTHERS.map((o) => (
              <li
                key={o}
                className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2"
              >
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink-3" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* product lab */}
        <article className="mt-10 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[13px] text-accent">product lab</span>
            <h3 className="text-[16px] font-semibold tracking-tight text-ink">
              IMHO — AI real-estate search, Argentina
            </h3>
            <span className="ml-auto font-mono text-[12px] text-ink-3">
              5 repos · 5 weeks
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-2">
            A product rebuilt four times in five weeks, each pass sharper: a
            scraper fleet for four property portals behind rotating proxies; a
            natural-language search pipeline where a second judge LLM
            confidence-scores every extraction; a WhatsApp agent parsing
            free-form Spanish into structured queries; and a 28-table schema
            built to expand into legal and automotive verticals. The Python
            backend was rewritten in TypeScript at a quarter of the size — the
            complexity cut is the lesson.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-ink-2">
            <span>133K LOC across 5 repos</span>
            <span>judge-LLM confidence gating</span>
            <span>7.1K LOC Python → 1.8K TS</span>
          </div>
        </article>
      </div>
    </section>
  );
}
