"use client";

import { CAREER } from "../console/data";
import styles from "./Experience.module.css";

export default function Career() {
  return (
    <section className={styles.career} id="experience" aria-labelledby="career-title">
      <div className="sc-wrap" style={{ maxWidth: "76rem" }}>
        <div className={styles.sectionHead}>
          <div>
            <span className="jx-lbl">The path that brought me here</span>
            <h2 id="career-title">Built with good people.</h2>
          </div>
          <p>Consulting firms, software factories, startups, and product teams. Argentina, the US, and Europe. Open a role for the work behind it.</p>
        </div>
        <div className={styles.roles}>
          {CAREER.map((role) => (
            <details className={styles.role} key={`${role.company}-${role.dates}`} onToggle={() => {
              window.ScrollCraft?.instances?.forEach(instance => instance.layout?.());
            }}>
              <summary>
                <span className={styles.years}>{role.years}</span>
                <span className={styles.position}>
                  <span className={styles.company}>{role.company}{role.now && <span className={styles.current}>Current</span>}</span>
                  <span className={styles.roleName}>{role.role}</span>
                </span>
                <span className={styles.expand} aria-hidden="true"><span /><span /></span>
              </summary>
              <div className={styles.roleDetail}>
                <div className={styles.roleMeta}>
                  <span>{role.dates}</span>
                  <span>{role.location}</span>
                  {role.context && <span>{role.context}</span>}
                </div>
                <p>{role.note}</p>
                <ul>{role.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </div>
            </details>
          ))}
        </div>
        <a className={styles.cv} href="/julian-irigoyen-cv.pdf" target="_blank" rel="noopener noreferrer">The full CV <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
