import Image from "next/image";
import { CAREER } from "../console/data";
import { CopyEmail, ThemeToggle } from "./Controls";
import { CONTACT_EMAIL, EXPERIMENTS, PROJECTS, type Project } from "./projects";
import s from "./Portfolio.module.css";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/JulianIrigoyen" },
  { label: "LinkedIn", href: "https://linkedin.com/in/julianirigoyen" },
  { label: "X", href: "https://x.com/irigoyai" },
  { label: "Instagram", href: "https://instagram.com/julianmirigoyen" },
  { label: "WhatsApp", href: "https://wa.me/5491136639160" },
];

function External({ href, children, className }: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}<span aria-hidden="true"> ↗</span>
    </a>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article id={project.id} className={project.image ? s.feature : s.projectRow}>
      <div className={s.projectHeading}>
        <span className={s.number}>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>{project.name}</h3>
          <p className={s.category}>{project.category}</p>
        </div>
      </div>
      <div className={s.projectCopy}>
        <p>{project.description}</p>
        <External href={project.href} className={s.textLink}>Visit {project.name}</External>
      </div>
      {project.image && (
        <figure className={s.projectFigure}>
          <a href={project.href} target="_blank" rel="noopener noreferrer" className={s.projectImage} aria-label={`Visit ${project.name}`}>
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(max-width: 760px) 100vw, 60vw"
              className={project.image.cover ? s.cover : s.contain}
            />
          </a>
          <figcaption>{project.image.caption}</figcaption>
        </figure>
      )}
    </article>
  );
}

export default function Portfolio() {
  return (
    <div className={s.page} id="top">
      <a className={s.skip} href="#main">Skip to content</a>
      <header className={s.header}>
        <a className={s.wordmark} href="#top">Julian Irigoyen<span className={s.location}>Buenos Aires, Argentina</span></a>
        <div className={s.headerRight}>
          <nav aria-label="Main navigation">
            <a href="#work">Work</a><a href="#about">Experience</a><a href="#contact">Contact</a><ThemeToggle />
          </nav>
          <nav className={s.socials} aria-label="Elsewhere">
            {SOCIALS.map((link) => <External key={link.label} href={link.href}>{link.label}</External>)}
          </nav>
        </div>
      </header>

      <main id="main">
        <section className={s.hero} aria-labelledby="intro-title">
          <div className={s.heroMain}>
            <p className={s.eyebrow}>Software engineer · Supersolid cofounder</p>
            <h1 id="intro-title">I’m Julian.<span>I build software.</span></h1>
            {/* Julian's own words (02ac0ff). Do not smooth these. */}
            <p className={s.intro}>The world has changed. The complexity in engineering has shifted, and what actually makes a difference now are the people behind ideas and business processes.</p>
            <p className={s.intro}>My goal as an engineer is to bridge the gap between the idea and its implementation as swiftly, elegantly and robustly as possible, to bring amazing products and services, and thus the future, to life.</p>
            <a className={s.heroWorkLink} href="#work">View projects <span aria-hidden="true">↓</span></a>
          </div>
          <aside className={s.portraitBlock}>
            <div className={s.portrait}><Image src="/julian.png" alt="Julian Irigoyen" fill sizes="(max-width: 600px) 116px, (max-width: 1000px) 32vw, 340px" preload /></div>
            <a href="/julian-irigoyen-cv.pdf" download className={s.portraitDownload}>
              <span>Download CV</span>
              <span className={s.downloadMeta}>PDF <span aria-hidden="true">↓</span></span>
            </a>
          </aside>
        </section>

        <section id="work" aria-labelledby="work-title">
          <div className={s.sectionHeading}><h2 id="work-title">Projects</h2><span>Studio, products & client work</span></div>
          {PROJECTS.map((project, index) => <ProjectRow project={project} index={index} key={project.id} />)}
        </section>

        <section className={s.personal} id="lab" aria-labelledby="personal-title">
          <div className={s.sectionHeading}><h2 id="personal-title">Other projects</h2><span>Open source & personal tools</span></div>
          <div className={s.experiments}>
            {EXPERIMENTS.map(project => (
              <article key={project.id} id={`experiment-${project.id}`}>
                <h3>{project.name}</h3>
                <p className={s.category}>{project.tag}</p>
                <p>{project.text}</p>
                {project.href
                  ? <External href={project.href} className={s.textLink}>View {project.name}</External>
                  : <span className={s.personalNote}>{project.id === "pushy" ? "Used in my own projects" : "Personal toolkit"}</span>}
              </article>
            ))}
          </div>
        </section>

        <section id="about" className={s.about} aria-labelledby="about-title">
          <div className={s.aboutIntro}>
            <h2 id="about-title">Experience</h2>
            <p>I’m from Argentina and have worked with consulting firms, startups and product teams across Argentina, the US and Europe.</p>
            <p>Outside work, I spend time trekking and making music. A few of those interests have turned into projects of their own.</p>
            <a href="/julian-irigoyen-cv.pdf" download className={s.textLink}>Download the full CV <span aria-hidden="true">↓</span></a>
          </div>
          <div id="experience" className={s.career}>
            {CAREER.map(role => (
              <details key={`${role.company}-${role.dates}`} className={s.careerRow}>
                <summary>
                  <span className={s.careerYears}>{role.years}</span>
                  <span><strong>{role.company}</strong><span className={s.roleName}>{role.role}</span></span>
                  <span className={s.plus} aria-hidden="true">+</span>
                </summary>
                <div className={s.careerDetail}>
                  <p className={s.category}>{role.dates} / {role.location}</p>
                  <p>{role.note}</p>
                  <ul>{role.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className={s.contact} aria-labelledby="contact-title">
          <div><h2 id="contact-title">Get in touch</h2><p>For a project, a question, or a conversation.</p></div>
          <div className={s.contactAddress}>
            <a className={s.email} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <CopyEmail />
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <a href="#top">Julian Irigoyen <span aria-hidden="true">↑</span></a>
        <nav aria-label="Elsewhere">
          {SOCIALS.map((link) => <External key={link.label} href={link.href}>{link.label}</External>)}
        </nav>
      </footer>
    </div>
  );
}
