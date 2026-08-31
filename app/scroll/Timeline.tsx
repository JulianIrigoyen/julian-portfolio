"use client";

import Image from "next/image";
import ScrollcraftMount from "./ScrollcraftMount";
import Suite, { Assert } from "./Suite";
import MarkSync from "./MarkSync";
import BloomCut from "./BloomCut";
import RailDepth from "./RailDepth";
import IndexMentionSync from "./IndexMentionSync";
import MailButton, { ADDRESS } from "./MailButton";
import dynamic from "next/dynamic";

/* ssr:false — createStage reads window and a WebGL context on construction.
   Lazy so three.js lands in its own chunk instead of the entry bundle. */
const Stage = dynamic(() => import("./Stage"), { ssr: false });
import { CAREER } from "../console/data";
import { CONSOLE_ENABLED } from "../console/visibility";

/* ————————————————————————————————————————————————
   Julian Irigoyen. The copy is his own, from the bio he wrote: plain,
   first person, specific, longer sentences than a slogan. No ITBA — he
   did not go, and it is not mentioned anywhere.

   Theme is LEDGER, deliberately not Supersolid: paper ground, sentence
   case, hairline structure, one cold accent, no texture.

   Five acts, never the same device twice in a row:
     1 scrub · scrub    the open (the Supersolid reveal, under the wheel)
     1b flow · stagger  the index
     2 pan  · pan       the current work, then the older client work
     3 pin  · reveal    the lab
     4 flow · stagger   the record
     5 pin  · magnet    the close
   ———————————————————————————————————————————————— */

/* The rail is ordered the way he would walk someone through it: the studio
   first, then the agent, then the thing the studio exists for, then the two
   products with a public face, then the app. `state` drives the dot in the
   address strip and is the page's only claim about liveness — so it has to
   stay true. live = you can open it now. private = in production, no public
   URL. build = shipped to a device, not to the web. */
const NOW: Card[] = [
  {
    n: "01",
    name: "Supersolid",
    slug: "supersolid",
    href: "https://supersolid.co",
    kicker: "the studio",
    state: "live",
    status: "live · supersolid.co",
    flag: "Where the rest of this comes from",
    cta: "Meet the studio",
    line: "The studio I started this year with Dmitry Sabanin, my former boss and mentor, and Emiliano Migliorata, my best friend. We build our own products, and we cofound with other founders on theirs.",
  },
  {
    n: "02",
    name: "DJINN",
    slug: "djinn",
    href: "https://djinn-site-teal.vercel.app",
    kicker: "autonomous agent",
    state: "live",
    status: "live · unattended and continuously developed",
    flag: "What I would show you first",
    cta: "Go see what it runs",
    line: "An open-source agentic workflow platform. In continuous development since January 2026 and running unattended on a cloud VM since June, reachable through Slack (and more channels), trusted with real infrastructure: feature development and reviews, watchdogs, nightly digests, incident detection, and a knowledge store it maintains itself.",
  },
  {
    n: "03",
    name: "Poor Hedge Fund",
    slug: "poorhedgefund",
    href: "https://poorhedgefund.com",
    kicker: "systematic · self-funded",
    /* The fund has a front door now, so the dot says live and means it. The
       engine behind it stays private, which the meta line carries — the state
       is a claim about the URL, not about the platform. */
    state: "live",
    status: "live · poorhedgefund.com",
    cta: "Read the thesis",
    meta: "Rust · React · live orderbooks · <b>engine private</b>",
    line: "A hedge fund, minus the funds. A Rust engine runs systematic strategies against live orderbooks — our own capital, our own risk, across instruments, markets and venues. Records and small positions, nobody else\u2019s. That is the poor part.",
  },
  {
    n: "04",
    name: "jtreks",
    slug: "jtreks",
    href: "https://jtreks.co",
    kicker: "trekking research",
    state: "live",
    status: "live · jtreks.co",
    cta: "Walk the 3D maps",
    line: "Trekking guides where every claim is traced back to a government portal, a park authority or a peer-reviewed paper — 32 ranges, 243 articles, 3,403 sources. 3D route maps drawn from the real satellite elevation data.",
  },
  {
    n: "05",
    name: "Keonda",
    slug: null,
    href: "https://apps.apple.com/us/app/keonda/id6785094649",
    kicker: "social marketplace",
    state: "live",
    status: "live · app store",
    cta: "Get it on iOS",
    meta: "Expo · React Native · Fastify · Postgres · <b>in production</b>",
    noShot: "iOS · on the App Store",
    line: "A social marketplace for the sea: a live chart of boats, chat between guests, captains and providers, and a marketplace underneath it. Live in the App Store.",
  },
  {
    n: "06",
    name: "Luxy",
    slug: "luxy",
    href: "https://www.ibizaluxy.online/",
    kicker: "concierge, ibiza",
    state: "live",
    status: "live · ibizaluxy.online",
    cta: "Plan a trip",
    line: "A concierge for Ibiza. A WhatsApp agent takes a request in plain language — a table, a boat, a villa — and turns it into something bookable, with checkout attached. Complementary to Keonda. Webapp live.",
  },
];

/* Client work that has been running for a while. Same rail, behind a
   divider, so the six above are not diluted by things that are simply
   done. */
const ALSO: Card[] = [
  {
    n: "07",
    name: "Half Production",
    slug: "half-productions",
    href: "https://half-productions.vercel.app",
    kicker: "events, ibiza",
    state: "live",
    status: "live · half-productions.vercel.app",
    cta: "Open the site",
    line: "A multilingual event-production site for an Argentina-to-Ibiza crew, with the public brand, Dharma, Boiler Cook, crew pages, print-ready QR assets, and an internal booking desk that turns Ibiza calendars, artist fees and warm-path relationships into a shortlist for monthly guest slots.",
  },
  {
    n: "08",
    name: "Speed Ibiza",
    slug: "speed",
    href: "https://speed-ibiza.vercel.app",
    kicker: "operations software",
    state: "live",
    status: "live · in daily use",
    line: "CRM built for a rising logistics and beverage distribution firm in Ibiza: route planning, customer records, order intake, collections, stock and invoicing. A field app for a phone in a van, an admin desk for the office.",
  },
  {
    n: "09",
    name: "Innovalport",
    slug: "innovalport",
    href: "https://www.innovalportb2b.com",
    kicker: "b2b importing",
    state: "live",
    status: "live · innovalportb2b.com",
    line: "An import platform for Argentine companies buying from international suppliers: catalogue, landed-cost simulator, wholesale orders and logistics, wired into MercadoLibre and Tiendanube.",
  },
  {
    n: "10",
    name: "Outflow",
    slug: "outflow",
    href: "https://www.outflow.com.ar",
    kicker: "buenos aires",
    state: "live",
    status: "live · outflow.com.ar",
    line: "A DJ school and sound rental house in Buenos Aires. Courses, equipment and bookings, in Spanish, for a business that lives on its reputation.",
  },
];

const LAB = [
  {
    // No public URL and no interface to photograph, so this one argues in
    // type rather than borrowing a picture of something else.
    n: "11",
    name: "Solana Sniper",
    href: null,
    meta: "Rust · Diesel · Raydium logs · <b>research</b>",
    at: null,
    line: "A Rust service that subscribes to Raydium logs, filters initialize2 events, pulls the mint out of the transaction and fetches its metadata before the token is listed anywhere useful. It also profiles holder distribution, which is the cheapest way to tell a launch from a rug. Features several integrations with data providers for deeper analysis. Open sourced.",
  },
  {
    n: "12",
    name: "IMHO",
    href: "https://imho-real-estate.vercel.app",
    meta: "Next.js · Supabase · scraper fleet · <b>live</b>",
    at: null,
    line: "AI real-estate search for Argentina. Scrapers behind rotating proxies feed a natural-language pipeline where a second judge model scores every extraction before it is allowed to count. Ongoing partnerships with real estate agencies in Mar del Plata, Argentina.",
  },
  {
    n: "13",
    name: "Pushy",
    href: null,
    meta: "Rust · Axum · Postgres · Redis · SQS · <b>offline</b>",
    at: "0.10 0.44",
    line: "An observability and notification platform built originally for crypto exchanges. Rust and Axum at the front, a background worker behind it, Postgres and Redis underneath, SQS for the queue and Contentful for the templates, so marketing ships copy without waiting on a deploy. Highly composable and scalable in design.",
  },
  {
    n: "14",
    name: "Ascenso",
    href: null,
    meta: "Unreal Engine 5 · C++ · SRTM elevation · <b>in build</b>",
    at: "0.24 0.58",
    line: "A playable climb of Volcán Lanín, 3,776m, in Unreal Engine 5. Real terrain from satellite elevation data, the real Tromen route from OpenStreetMap, and hazards taken from having actually summited it. The same elevation file feeds three things: this game, the map on jtreks.co, and a 3D-printed keyring. Complementary to jtreks, more mountains being designed now.",
  },
];

type Card = {
  n: string;
  name: string;
  slug: string | null;
  href: string | null;
  kicker: string;
  state: string;
  status: string;
  line: string;
  flag?: string;
  cta?: string;
  meta?: string;
  noUrl?: string;
  noShot?: string;
};

function WorkCard({ w }: { w: Card }) {
  return (
    <article
      className={[
        "jx-card",
        w.flag ? "jx-card--lead" : "",
        w.slug ? "" : "jx-card--type",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* the address strip. The dot is the page's liveness claim and the
          only animated thing in the whole paper half — it earns the
          headline instead of decorating it. */}
      <div className="jx-card__addr">
        <span className="jx-card__n">{w.n}</span>
        <span className="jx-card__st">
          <i className={`jx-dot jx-dot--${w.state}`} aria-hidden />
          {w.status}
        </span>
      </div>

      {w.slug ? (
        <a
          className="jx-card__shot"
          href={w.href ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* The originals are 2880x1800 PNGs and this slot is ~335px wide on
              a phone. Served raw that is 15MB of screenshots for a viewport
              that can use about 400KB of them. `fill` + `sizes` lets Next
              serve an AVIF cut to the slot; the CSS below still does the
              cover crop. */}
          <Image
            src={`/work/${w.slug}.png`}
            alt={`${w.name} — live site`}
            fill
            sizes="(max-width: 52rem) 86vw, (max-width: 90rem) 36vw, 30rem"
          />
        </a>
      ) : (
        <div className="jx-card__shot jx-card__shot--none">
          <span>{w.noShot}</span>
        </div>
      )}

      <div className="jx-card__body">
        <h3 className="jx-card__name">{w.name}</h3>
        <span className="jx-card__kick">{w.kicker}</span>
        {w.flag ? <span className="jx-flag">{w.flag}</span> : null}
        <span className="jx-card__hr" aria-hidden />
        <p className="jx-card__line">{w.line}</p>

        {/* the tail sits on a common baseline down the whole rail — a card
            with a short sentence leaves the air above its call, not below */}
        <div className="jx-card__foot">
          {w.meta ? (
            <span className="jx-meta" dangerouslySetInnerHTML={{ __html: w.meta }} />
          ) : null}
          {w.href ? (
            <a
              className={w.flag ? "jx-go jx-go--lead" : "jx-go"}
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {w.cta ?? "Open it"} →
            </a>
          ) : (
            <span className="jx-go jx-go--mute">{w.noUrl ?? "No public URL"}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Timeline() {
  return (
    <div className="jx-page">
      <Stage />
      <RailDepth />
      <ScrollcraftMount />
      <MarkSync />
      <BloomCut />
      <IndexMentionSync />
      <Suite />

      <main>
        {/* ——— 01 · the open. scrub — the anchor device, spent on the
              open exactly as devices.md says. The mark assembles ring by
                ring under the wheel, then the camera orbits so the lattice
                reads as the 3D object it is. No wordmark: this is Julian's
                page and the Supersolid lockup has no business on it.

                span 7, up from 4.6 — the clip went 200 to 560 frames, and a
                scrub maps scroll onto video time, so the old span would have
                raced through 2.8x the footage over the same distance. ——— */}
        <section
          className="jx-act jx-open"
          data-sc-act="scrub"
          data-sc-span="12.2"
          data-sc-span-mobile="20"
          data-sc-dwell="0.55"
          data-sc-clip-map="travel"
          data-sc-clip-hold-at="0.70"
          data-sc-clip-hold-for="0.24"
        >
          <div data-sc-stage>
            {/* the poster holds the frame until a real video frame paints —
                iOS keeps a seeked-but-never-played muted video blank */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="sc-stage__poster"
              src="/reveal/mark-poster.jpg"
              alt=""
            />
            <video
              data-sc-scrub
              data-sc-src="/reveal/mark.mp4"
              data-sc-src-mobile="/reveal/mark-m.mp4"
              data-sc-lerp="0.36"
              playsInline
              muted
            />
            <div className="sc-scrim" />

            <div className="sc-copy sc-copy--lead">
              {/* The sticky bar already carries "Julian Irigoyen · Buenos Aires"
                  on every screen, so repeating it here said nothing twice. The
                  eyebrow now spends its line on the practice instead. */}
              <span className="jx-lbl" data-sc-cue="0 0.74 0">
                Backend <b>·</b> Full-stack <b>·</b> DevOps <b>·</b> Agentic AI
              </span>
              {/* The first frame belongs to the mark alone. The headline enters
                  only once the reader starts the scrub, then finishes before
                  the bloom is allowed to fire. */}
              <h1
                className="sc-display sc-display--xl jx-code-title jx-type"
                data-sc-cue="0.12 0.96 0.32 0"
                data-sc-kinetic="type"
                style={{ marginTop: "0.9rem" }}
              >
                I love a good challenge.
              </h1>

              {/* The body types itself out. Same mono face as the headline, so
                  the whole lead reads as one terminal buffer being written
                  rather than a heading in code and prose underneath it.

                  The two paragraphs carry separate cue ramps that overlap
                  slightly, so the second starts before the first has finished
                  — a continuous stream, not two blocks taking turns. The
                  caret sits after the last character and blinks on its own. */}
              <div style={{ marginTop: "1.6rem" }}>
                <span className="jx-openrule" />
                <p
                  className="sc-body jx-typed"
                  data-sc-cue="0.28 0.90 0.58 0"
                  data-sc-kinetic="type"
                  style={{ marginTop: "1.1rem" }}
                >
                  I&apos;m a 31-year-old engineer from Argentina. I&apos;ve spent
                  the last eight years building applications for a wide variety
                  of companies: large consulting firms, software factories,
                  small startups and well established product companies.
                </p>
                <p
                  className="sc-body jx-typed"
                  data-sc-cue="0.48 0.96 0.70 0"
                  data-sc-kinetic="type"
                  style={{ marginTop: "0.9rem" }}
                >
                  From backend — Java and C# on the object-oriented side,
                  Scala and Rust on the more functional one — to full stack
                  (vanilla, React, Vue), DevOps with AWS/GCP/K8s, and AI
                  engineering with Claude Code, Codex, and more. I&apos;ve
                  refactored large monolithic applications into
                  microservice-oriented systems, built full-stack web
                  applications from scratch, and set up productive agentic
                  workflows for large corporations and small businesses.
                  <span className="jx-caret" aria-hidden="true" />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ——— 01b · the index. A quiet paper landing after the cut, so the
              dark act has somewhere to resolve to. The bio closes on the
              index, and the index hands off to the rail. ——— */}
        <section
          className="jx-act jx-index-act"
          style={{ padding: "clamp(3.5rem, 8vw, 7rem) 0" }}
        >
          <div className="sc-wrap" data-sc-in data-sc-stagger="60" style={{ maxWidth: "72rem" }}>
            <div className="jx-about">
              {/* The portrait and the title are one unit. Stacked, they sit
                  side by side so the photo never strands itself next to a wall
                  of empty space; at width they separate into two columns and
                  the title moves over the prose it introduces. */}
              <figure className="jx-about__fig">
                <Image
                  className="jx-portrait"
                  src="/julian.png"
                  alt="Julian Irigoyen"
                  width={800}
                  height={800}
                  sizes="(max-width: 52rem) 40vw, 18rem"
                />
                <figcaption className="jx-portrait__cap">
                  Julian Irigoyen <b>·</b> Buenos Aires
                </figcaption>
              </figure>

              <div className="jx-about__head">
                <div className="jx-head">
                  <span className="jx-lbl">About</span>
                  <h2 className="sc-display sc-display--md">Hi</h2>
                </div>
              </div>

              <div className="jx-about__body">
                <span className="jx-openrule jx-about__rule" />

                {/* Julian's own words, restored from 83862ea^. The commit that
                    replaced them was called "a shorter bio" and it did shorten
                    them — into someone else's register. "an amazing, 2 year
                    long experience" became "after two years", "the founder
                    journey" went, and the whole paragraph on how he actually
                    works was cut. The conviction still leads at display weight,
                    because that placement was a good call; the sentences under
                    it are his again, punctuation and all. Do not smooth these. */}
                <p className="jx-about__lede">
                  The world has changed. The complexity in engineering has
                  shifted, and what actually makes a difference now are the{" "}
                  <strong>people</strong> behind ideas and business processes.
                </p>

                <p className="sc-body" style={{ marginTop: "1.1rem", maxWidth: "62ch" }}>
                  After an amazing, 2 year long experience working at TrueML, I
                  started the founder journey with{" "}
                  <a
                    href="https://supersolid.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jx-link"
                  >
                    Supersolid
                  </a>
                  , together with my former boss and mentor Dmitry Sabanin and
                  my best friend Emiliano Migliorata. We&apos;re building in
                  fintech and quantitative trading, and we work with other
                  founders as a cofounding team on their ideas.
                </p>

                <p className="sc-body" style={{ marginTop: "0.9rem", maxWidth: "62ch" }}>
                  I tackle problems methodically, and I make a point of relying
                  on my team to move forward efficiently and effectively. I&apos;m
                  a big fan of failing fast, through automated TDD and CI/CD
                  pipelines, and of delivering small concrete iterations. I&apos;m
                  interested in simple and complex problems alike. A lot more so
                  in the person and the idea behind each problem.
                </p>

                <p className="sc-body" style={{ marginTop: "0.9rem", maxWidth: "62ch" }}>
                  My goal as an engineer is to bridge the gap between the idea
                  and its implementation as swiftly, elegantly and robustly as
                  possible, to bring amazing products and services, and thus the
                  future, to life. That is why this page moves through{" "}
                  <span data-jx-index-trigger="now">what I&apos;m building now</span>,{" "}
                  <span data-jx-index-trigger="shipped">the client work already shipped</span>,{" "}
                  <span data-jx-index-trigger="lab">the lab pieces</span>, and{" "}
                  <span data-jx-index-trigger="path">the eight-year path behind it</span>.
                </p>

                <div className="jx-index">
                  {[
                    { key: "now", n: "01—06", t: "Now", st: "live · in build" },
                    { key: "shipped", n: "07—10", t: "Also shipped", st: "client work" },
                    { key: "lab", n: "11—14", t: "The lab", st: "fintech · web3" },
                    { key: "path", n: "—", t: "My path", st: "eight years" },
                  ].map(({ key, n, t, st }) => (
                    <div className="jx-index__row" data-jx-index-row={key} key={key}>
                      <span className="jx-index__n">{n}</span>
                      <span className="jx-index__t">{t}</span>
                      <span className="jx-index__lead" aria-hidden />
                      <span className="jx-index__s">{st}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "1.6rem" }}>
                  <Assert name="intro" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— 02 · the rail. Lateral: breadth reads sideways. Six current
              things, a divider, then the client work that is simply done.
              Span is 8.2 because the rail got wider — the engine
              maps the whole scrollWidth onto the span, so more cards at the
              same span means a faster pan. ——— */}
        <section className="jx-act" data-sc-act="pan" data-sc-span="8.2">
          <div data-sc-stage>
            <div className="jx-rail" data-sc-pan="0.05">
              <div className="jx-rail__lead">
                <span className="jx-lbl">
                  Now <b>·</b> 01—06
                </span>
                <h2 className="sc-display sc-display--md" style={{ marginTop: "0.8rem" }}>
                  Being built or running as you read this.
                </h2>
                <p className="sc-body" style={{ marginTop: "0.9rem", fontSize: "0.94rem" }}>
                  Check any link to find out more!
                </p>

                <div className="jx-legend">
                  <span>
                    <i className="jx-dot jx-dot--live" aria-hidden /> live
                  </span>
                  <span>
                    <i className="jx-dot jx-dot--private" aria-hidden /> private
                  </span>
                  <span>
                    <i className="jx-dot jx-dot--build" aria-hidden /> in build
                  </span>
                </div>

                <div style={{ marginTop: "1.2rem" }}>
                  <Assert name="live work" />
                </div>
              </div>

              {NOW.map((w) => (
                <WorkCard w={w} key={w.name} />
              ))}

              <div className="jx-rail__div">
                <span className="jx-lbl">
                  Also shipped <b>·</b> 07—10
                </span>
                <p>
                  Client work. Finished, handed over, up and running.
                </p>
              </div>

              {ALSO.map((w) => (
                <WorkCard w={w} key={w.name} />
              ))}
            </div>
          </div>
        </section>

        {/* ——— 03 · the lab. Three of the four have no URL, so this tier
              argues in type rather than pictures. ——— */}
        <section className="jx-act jx-lab-act" data-sc-act="pin" data-sc-span="3.2">
          <div data-sc-stage>
            <div className="sc-wrap" style={{ width: "100%", maxWidth: "76rem" }}>
              <div data-sc-cue="0 0.30 0">
                <span className="jx-lbl">
                  The lab <b>·</b> 11—14
                </span>
                <h2 className="sc-display sc-display--md" style={{ marginTop: "0.7rem" }}>
                  The more you f around... the more you find out.
                </h2>
              </div>

              <div className="jx-lab" style={{ marginTop: "clamp(18px, 2.6vw, 32px)" }}>
                {LAB.map((l) => (
                  <div
                    className="jx-lab__cell"
                    key={l.name}
                    {...(l.at
                      ? { "data-sc-reveal": "up", "data-sc-reveal-at": l.at }
                      : {})}
                  >
                    <span className="jx-lbl">{l.n}</span>
                    <h3 className="jx-lab__name">{l.name}</h3>
                    <p className="jx-lab__line">{l.line}</p>
                    <span
                      className="jx-meta"
                      dangerouslySetInnerHTML={{ __html: l.meta }}
                    />
                    {l.href && (
                      <a
                        className="jx-go"
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginTop: "10px" }}
                      >
                        Open →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ——— 04 · the record ——— */}
        <section
          className="jx-act"
          style={{ background: "var(--paper-2)", padding: "clamp(3.5rem, 7vw, 7rem) 0" }}
        >
          <div
            className="sc-wrap"
            data-sc-in
            data-sc-stagger="50"
            style={{ maxWidth: "72rem" }}
          >
            <span className="jx-lbl">The path that brought me here</span>
            <h2 className="sc-display sc-display--md" style={{ marginTop: "0.7rem" }}>
              Consulting firms, software factories, startups, product companies from Argentina, US and Europe.
            </h2>
            <div style={{ marginTop: "2rem" }}>
              {CAREER.map((c) => (
                <div className="jx-row" key={`${c.company}-${c.years}`}>
                  <div className="jx-row__top">
                    <span className="jx-row__yr">{c.years}</span>
                    <span className="jx-row__co">{c.company}</span>
                    <span className="jx-row__rl">{c.role}</span>
                  </div>
                  <p className="jx-row__nt">{c.note}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.6rem" }}>
              <Assert name="the record" />
            </div>
          </div>
        </section>

        {/* ——— 05 · the close. Last act: its cue greets and holds. ——— */}
        <section className="jx-act" data-sc-act="pin" data-sc-span="2">
          <div data-sc-stage>
            <div className="sc-copy sc-copy--center" data-sc-cue="0 1 0 0">
              <span className="jx-lbl">Available</span>
              <h2 className="sc-display sc-display--lg" style={{ marginTop: "0.8rem" }}>
                Tell me what has to work.
              </h2>
              <p
                className="sc-body"
                style={{ marginTop: "1rem", marginInline: "auto", maxWidth: "48ch" }}
              >
                Backend, platform, or an agent that has to hold down the fort.
                I&apos;m in Buenos Aires and I&apos;ve worked remotely with US and
                European teams for most of eight years.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <MailButton />
                <a
                  className="jx-btn"
                  href="https://github.com/JulianIrigoyen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="jx-btn"
                  href="https://linkedin.com/in/julianirigoyen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>

              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                <Assert name="close" />
              </div>

              {/* The address in plain sight. The button above is the fast path;
                  this is the one that cannot fail. */}
              <p className="jx-lbl" style={{ marginTop: "1.6rem" }}>
                <a href={`mailto:${ADDRESS}`} style={{ color: "var(--accent)" }}>
                  {ADDRESS}
                </a>{" "}
                · Buenos Aires · Remote US / EU ·{" "}
                {CONSOLE_ENABLED && (
                  <a href="/console" style={{ color: "var(--accent)" }}>
                    Console
                  </a>
                )}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
