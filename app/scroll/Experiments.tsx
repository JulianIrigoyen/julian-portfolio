import Image from "next/image";
import styles from "./Experience.module.css";

const projects = [
  { id: "pushy", name: "Pushy", x: 86, y: 237 },
  { id: "imho", name: "IMHO", x: 157, y: 200 },
  { id: "sniper", name: "Solana Sniper", x: 228, y: 163 },
  { id: "hermes", name: "Hermes Thrice", x: 299, y: 125 },
  { id: "jtreks", name: "jtreks", x: 370, y: 89 },
  { id: "ascenso", name: "Ascenso", x: 441, y: 53 },
];

function CuriosityChart() {
  return (
    <figure className={styles.chart}>
      <div className={styles.chartPlot}>
      <svg viewBox="0 0 520 310" aria-labelledby="curiosity-title curiosity-description" role="img">
        <title id="curiosity-title">The more you f around, the more you find out</title>
        <desc id="curiosity-description">An illustrated take on the meme. Follow the six project links along the rising line. This is a joke, not measured project data.</desc>
        <defs>
          <pattern id="curiosity-grid" width="27" height="27" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" /></pattern>
        </defs>
        <rect x="57" y="15" width="432" height="243" fill="url(#curiosity-grid)" className={styles.chartGrid} />
        <path d="M57 17V258H495 M51 24l6-8 6 8 M487 252l8 6-8 6" className={styles.chartAxes} />
        <text x="277" y="297" textAnchor="middle" className={styles.axisLabel}>F around →</text>
        <text transform="translate(21 139) rotate(-90)" textAnchor="middle" className={styles.axisLabel}>Find out →</text>
        <path d="M65 249C177 186 322 110 458 41" className={styles.chartLine} pathLength="1" />
      </svg>
      <nav aria-label="Explore hobby projects" className={styles.chartLinks}>
        {projects.map(project => (
          <a key={project.id} href={`#experiment-${project.id}`} aria-label={`Explore ${project.name}`} className={styles.chartPoint}
            style={{ left: `${project.x / 520 * 100}%`, top: `${project.y / 310 * 100}%` }}>
            <span className={styles.chartDot} aria-hidden="true" />
            <span className={styles.chartName}>{project.name}</span>
          </a>
        ))}
      </nav>
      </div>
      <figcaption>The unofficial law of side projects. Pick a point.</figcaption>
    </figure>
  );
}

export default function Experiments() {
  return (
    <section className={styles.lab} id="lab" aria-labelledby="lab-title">
      <div className="sc-wrap" style={{ maxWidth: "76rem" }}>
        <div className={styles.labHead}>
          <div>
            <span className="jx-lbl">Hobby projects · 10—15</span>
            <h2 id="lab-title">The more you<br />f around<span className={styles.accent}>,</span><br />the more you<br />find out<span className={styles.accent}>.</span></h2>
            <p>Things I wanted to use. Problems that annoyed me. An interview challenge that got out of hand. There&apos;s a why behind every one.</p>
          </div>
          <CuriosityChart />
        </div>

        <article className={styles.feature} id="experiment-jtreks">
          <a className={styles.treks} href="https://jtreks.co" target="_blank" rel="noopener noreferrer" aria-label="Explore jtreks trekking guides and maps">
            <Image src="/experiments/fitz-roy.jpg" alt="The granite towers and snowfields of Fitz Roy in Patagonia" fill sizes="(max-width: 760px) 92vw, 60vw" />
            <span className={styles.treksCaption}>Fitz Roy · Patagonia <span aria-hidden="true">↗</span></span>
          </a>
          <div className={styles.featureBody}>
            <div className={styles.projectMeta}><span>10 / Trekking & research</span><span className={styles.live}>Live · jtreks.co</span></div>
            <h3>jtreks</h3>
            <div className={styles.why}><span>Why?</span><p>Because I like trekking. Mountains are amazing, and finding the right information to plan a hiking trip was annoyingly difficult.</p></div>
            <p>So I built trekking guides with traceable sources and 3D route maps from real satellite elevation data. The information I wanted when planning my own trips.</p>
            <div className={styles.projectFoot}><span>Research · Satellite terrain · 3D maps</span><a href="https://jtreks.co" target="_blank" rel="noopener noreferrer">Plan a trek ↗</a></div>
          </div>
        </article>

        <article className={styles.feature} id="experiment-ascenso">
          <a className={styles.mountain} href="https://ascenso.world" target="_blank" rel="noopener noreferrer" aria-label="Explore Ascenso — climb the real mountain">
            <Image src="/experiments/ascenso-lanin.webp" alt="Ascenso's cover art for Volcán Lanín" fill sizes="(max-width: 760px) 92vw, 60vw" />
            <span className={styles.mountainTitle}>ASCENSO<span>Climb the real mountain.</span></span>
            <span className={styles.mountainCaption}>Volcán Lanín · 3,776 m <span aria-hidden="true">↗</span></span>
          </a>
          <div className={styles.featureBody}>
            <div className={styles.projectMeta}><span>11 / Mountain simulation</span><span className={styles.live}>Website live</span></div>
            <h3>Ascenso</h3>
            <div className={styles.why}><span>Why?</span><p>Because it&apos;s fun. Game development exposes you to key engineering problems, but it&apos;s also an art: a way to tell a story and teach something valuable.</p></div>
            <p>A playable climb of Volcán Lanín in Unreal Engine 5. Real satellite terrain, the Tromen route, and decisions about weather, stamina, and when to turn back.</p>
            <div className={styles.projectFoot}><span>Unreal Engine 5 · C++ · SRTM</span><a href="https://ascenso.world" target="_blank" rel="noopener noreferrer">Explore Ascenso ↗</a></div>
          </div>
        </article>

        <div className={styles.experiments}>
          <article className={styles.experiment} id="experiment-sniper">
            <a className={`${styles.preview} ${styles.sniper}`} href="https://github.com/JulianIrigoyen/solana-sniper" target="_blank" rel="noopener noreferrer" aria-label="Read Solana Sniper on GitHub">
              <span className={styles.previewLabel}>Solana / event stream</span>
              <span className={styles.event}><i />Raydium logs<span>01</span></span>
              <span className={styles.event}><i />initialize2<span>02</span></span>
              <span className={styles.event}><i />Token + holder analysis<span>03</span></span>
              <span className={styles.previewNote}>Follow the event back to the source. ↗</span>
            </a>
            <div className={styles.experimentBody}>
              <div className={styles.projectMeta}><span>12 / On-chain research</span><span>Open source</span></div>
              <h3>Solana Sniper</h3>
              <div className={styles.why}><span>Why?</span><p>I wanted to apply my Rust knowledge and open-source something useful. It was surprisingly well received!</p></div>
              <p>What can the chain tell you before a token reaches a listing? A Rust service that watches Raydium events, inspects new tokens, and tracks wallets and holder distribution.</p>
              <div className={styles.projectFoot}><span>Rust · Solana RPC · Diesel</span><a href="https://github.com/JulianIrigoyen/solana-sniper" target="_blank" rel="noopener noreferrer">Read the source ↗</a></div>
            </div>
          </article>

          <article className={styles.experiment} id="experiment-imho">
            <a className={`${styles.preview} ${styles.imho}`} href="https://imho-real-estate.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Explore IMHO real estate search">
              <Image src="/fleet/imho.png" alt="IMHO real estate search interface" fill sizes="(max-width: 760px) 92vw, 33vw" />
            </a>
            <div className={styles.experimentBody}>
              <div className={styles.projectMeta}><span>13 / Real estate</span><span className={styles.live}>Live</span></div>
              <h3>IMHO</h3>
              <div className={styles.why}><span>Why?</span><p>Because searching for a home in Mar del Plata was tedious. The tools and the whole process felt archaic.</p></div>
              <p>Find a home in Argentina by describing what you want. Property scrapers feed a natural-language search, with a second model checking each extraction.</p>
              <div className={styles.projectFoot}><span>Next.js · Supabase · Fastify</span><a href="https://imho-real-estate.vercel.app" target="_blank" rel="noopener noreferrer">Explore IMHO ↗</a></div>
            </div>
          </article>

          <article className={styles.experiment} id="experiment-pushy">
            <div className={`${styles.preview} ${styles.pushy}`}>
              <span className={styles.previewLabel}>Pushy / delivery system</span>
              <div className={styles.delivery}><span>API</span><i aria-hidden="true">→</i><span>Queue</span><i aria-hidden="true">→</i><span>Worker</span></div>
              <div className={styles.channels}><span>↗ Email</span><span>↗ Push</span></div>
              <span className={styles.previewNote}>Templates live outside the codebase.</span>
            </div>
            <div className={styles.experimentBody}>
              <div className={styles.projectMeta}><span>14 / Infrastructure</span><span>Reusable library</span></div>
              <h3>Pushy</h3>
              <div className={styles.why}><span>Why?</span><p>An interview challenge I got a little carried away with. It became a library I reuse whenever a project needs notifications out of the box.</p></div>
              <p>Email and push delivery with a Rust API, queued background workers, and templates that can change without an application deploy.</p>
              <div className={styles.projectFoot}><span>Rust · Axum · Redis · SQS</span><span className={styles.archive}>Used in my own projects</span></div>
            </div>
          </article>
        </div>

        <article className={`${styles.feature} ${styles.musicFeature}`} id="experiment-hermes">
          <div className={styles.musicArtwork} aria-hidden="true">
            <span className={styles.musicLabel}>Sound / rhythm / image</span>
            <div className={styles.musicTitle}>Hermes<br />Thrice<span>Worlds</span></div>
            <svg viewBox="0 0 420 270" focusable="false">
              <path d="M0 135H420M210 0V270" className={styles.musicAxes} />
              {Array.from({ length: 13 }, (_, line) => (
                <path key={line} d={Array.from({ length: 85 }, (_, point) => {
                  const x = point * 5;
                  const envelope = Math.sin(point / 84 * Math.PI);
                  const y = 135 + Math.sin(point / 84 * Math.PI * 4 + line * .22) * envelope * (30 + line * 6);
                  return `${point ? "L" : "M"}${x} ${y.toFixed(2)}`;
                }).join(" ")} />
              ))}
            </svg>
            <span className={styles.musicCaption}>Find a sound. Make a rhythm. See where it goes.</span>
          </div>
          <div className={styles.featureBody}>
            <div className={styles.projectMeta}><span>15 / Music, audio & visuals</span><span>Personal toolkit</span></div>
            <h3>Hermes Thrice</h3>
            <div className={styles.why}><span>Why?</span><p>Music is an important pillar in my life. I like finding ways to have more fun producing music through technology.</p></div>
            <p>Hermes Thrice Worlds brings together the musical, audio, and visual tools I build for my own creative process.</p>
            <dl className={styles.musicTools}>
              <div><dt>Library analysis & search</dt><dd>Find music by tone, BPM, and genre.</dd></div>
              <div><dt>Drums, beats & basslines</dt><dd>Tools for making rhythms and basslines.</dd></div>
              <div><dt>Music to visuals</dt><dd>Engines that turn music into visuals, and more experiments in sound and image.</dd></div>
            </dl>
          </div>
        </article>
      </div>
    </section>
  );
}
