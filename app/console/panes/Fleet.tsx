"use client";

const OTHERS = [
  { t: "Tour-operator platform, Egypt", d: "5 locales including Arabic · tours, booking, maps" },
  { t: "Aesthetic-medicine clinic, Nordelta", d: "bilingual booking site" },
  { t: "Law firm, Buenos Aires", d: "multi-practice content site" },
  { t: "Dream-journal API", d: "Rust/Axum · 33 source files · SQL migrations · Docker" },
  { t: "Recipe & pantry platform", d: "web + Expo mobile · ~119K LOC · versioned releases" },
  { t: "Event-production brand, Ibiza", d: "Stripe + WhatsApp concierge" },
];

export default function Fleet() {
  return (
    <div className="pane-in px-5 py-10 sm:px-8">
      <span className="lbl">fleet</span>
      <h2 className="readout mt-4 max-w-3xl text-[24px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[34px]">
        ~30 products shipped on one repeatable stack
      </h2>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-4">
        {[
          { k: "project dirs", v: "32", note: "40+ deployable apps" },
          { k: "first-party loc", v: "691K", note: "vendored excluded" },
          { k: "test files", v: "453", note: "across the fleet" },
          { k: "sql migrations", v: "90", note: "11 supabase projects" },
        ].map((r) => (
          <div key={r.k} className="bg-panel p-4">
            <dt className="lbl">{r.k}</dt>
            <dd className="readout mt-1.5 text-[21px] font-bold text-ink">{r.v}</dd>
            <dd className="lbl mt-0.5 !text-[9px] !tracking-[0.1em]">{r.note}</dd>
          </div>
        ))}
      </dl>

      {/* flagship */}
      <section className="mt-10 border-t border-rule-bright pt-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="lbl !text-amber">flagship</span>
          <a
            href="https://jtreks.co"
            target="_blank"
            rel="noopener noreferrer"
            className="readout text-[17px] font-bold text-ink transition-colors hover:text-amber"
          >
            jtreks.co ↗
          </a>
          <span className="lbl ml-auto">built solo · 4 months · 467 commits</span>
        </div>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-2">
          A multilingual adventure-travel platform: 36 destination regions with
          interactive 3D terrain maps of 24 real mountain ranges, a 193-article
          guide library fully translated to Spanish across 6 locales, live
          weather for 41 peaks, and an LLM trip assistant grounded exclusively in
          the site&apos;s own content. Every hero image, frontmatter field and
          translation is checked by a build-time validation pipeline.
        </p>
        <div className="readout mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[11.5px] text-ink-3">
          <span>77K LOC</span>
          <span>36 regions · 25 live</span>
          <span>427 content files</span>
          <span>6 locales</span>
          <span>3D terrain · Mapbox DEM</span>
        </div>
      </section>

      {/* the rest */}
      <section className="mt-10 border-t border-rule-bright pt-6">
        <span className="lbl">selected</span>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
          {OTHERS.map((o) => (
            <li key={o.t} className="bg-panel px-4 py-3">
              <p className="text-[13.5px] font-medium text-ink">{o.t}</p>
              <p className="lbl mt-1 !normal-case !tracking-[0.04em]">{o.d}</p>
            </li>
          ))}
        </ul>
        <p className="lbl mt-4 !normal-case !tracking-[0.04em]">
          Client names withheld where the work is private. House stack: Next.js
          14–16 · Tailwind · Supabase with real migrations · typed i18n ·
          env-gated analytics.
        </p>
      </section>

      {/* product lab */}
      <section className="mt-10 border-t border-rule-bright pt-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="lbl !text-amber">product lab</span>
          <span className="readout text-[15px] font-bold text-ink">
            IMHO — AI real-estate search, Argentina
          </span>
          <span className="lbl ml-auto">5 repos · 5 weeks</span>
        </div>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-2">
          Four product iterations shipped in five weeks, each one sharper: a
          scraper fleet for four property portals behind rotating proxies; a
          natural-language search pipeline where a second judge LLM
          confidence-scores every extraction; a WhatsApp agent parsing free-form
          Spanish into structured queries; and a 28-table schema built to expand
          into legal and automotive verticals. The Python backend was rewritten
          in TypeScript at a quarter of the size — the complexity cut is the
          lesson.
        </p>
        <div className="readout mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[11.5px] text-ink-3">
          <span>133K LOC · 5 repos</span>
          <span>judge-LLM confidence gating</span>
          <span>7.1K Python → 1.8K TS</span>
        </div>
      </section>
    </div>
  );
}
