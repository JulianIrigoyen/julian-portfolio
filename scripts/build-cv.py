import json, html
E = html.escape
src = json.load(open("/Users/iri369/code/30+/hermes-thrice/clients/julianmirigoyen/resume.json"))

SUMMARY = ("Senior engineer, eight years building distributed systems and platforms in Scala/Akka, "
           "Rust, Java, TypeScript and Go — and two years building autonomous AI agent systems that "
           "run in production. Founded Supersolid in 2026 and still ship as principal engineer on it. "
           "Backend, platform and DevOps; comfortable owning a system from design through to the "
           "on-call that follows.")

ROLES = [
  dict(co="Supersolid", role="Founder & Principal Engineer", when="Mar 2026 — present",
       loc="Buenos Aires · Remote",
       bul=["Cofounded with Dmitry Sabanin and Emiliano Migliorata. Own products in fintech and quantitative trading; cofounding engineering for other founders.",
            "A Rust engine running strategies against live order books, on our own capital.",
            "DJINN, an open-source agentic workflow platform — in continuous development since January 2026 and running unattended on a cloud VM since June, reachable through Slack, supervised by pm2 and trusted with real infrastructure: watchdogs, nightly digests, incident detection and a knowledge store it maintains itself."]),

  dict(co="TrueML", role="Senior Software Engineer II", when="Mar 2025 — Aug 2026",
       loc="United States · Remote", note="Agentic workflows team · promoted from Senior Software Engineer.",
       bul=["On the agentic workflows team throughout — automating collections workflows end to end.",
            "Designed and shipped the authorization platform on AWS Cognito — adopted by the legacy estate and built into new applications and services across the company.",
            "Led the workflow engine migration from Camunda to Netflix Conductor, <b>saving $200k</b>.",
            "Built the bankruptcy monitoring system for collections compliance. The failure mode there was regulatory exposure, not cost.",
            "Designed the collector shim bridging the legacy estate to One True Platform, the next-generation system.",
            "Built the partial payments flow, which drove <b>hundreds of thousands in revenue</b> across tax season.",
            "Platform engineering across Java, TypeScript, Scala and Go; CI/CD on Kubernetes, Helm and ArgoCD."]),

  dict(co="TrueML", role="Senior Software Engineer", when="Mar 2024 — Mar 2025",
       loc="United States · Remote", note="Agentic workflows team.",
       bul=["Platform and infrastructure work across the estate, leading to promotion to Senior II."]),

  dict(co="Expero", role="Backend Developer — Rust & .NET", when="Aug 2021 — Jan 2024",
       loc="Houston, Texas · Remote",
       bul=["Portfolio management for <b>IHS Markit</b>: APIs and data pipelines for capital-intensive industries and markets.",
            "Event-driven architecture; persistence and data-science-adjacent services."]),

  dict(co="Fractal Technology", role="Lead Developer — Scala & Akka", when="2022 — 2023",
       loc="Remote · concurrent with Expero",
       bul=["String3, a Layer 1 blockchain built on the actor model. Joined as support, left as lead.",
            "Led four engineers alongside the CEO and product owner."]),

  dict(co="Alma Fintech", role="Full-stack Developer — React & Scala", when="Jan 2021 — Sep 2021",
       loc="Buenos Aires",
       bul=["Daruma, an electronic wallet, end to end — design, front end, back end and QA — working directly with the client to define each feature.",
            "Maintained legacy code and carried production support."]),

  dict(co="Tiendanube", role="Backend Developer — Scala & Akka", when="Sep 2020 — Jan 2021",
       loc="Argentina",
       bul=["Refactored the <b>orders system</b> — the critical bottleneck every other service depended on — at pace, in a genuinely agile team.",
            "Reactive microservices on the actor model for Latin America's largest e-commerce platform: Akka Typed, Persistence, Projection, Streams and Cluster Sharding.",
            "Domain-driven design and TDD enforced throughout."]),

  dict(co="intive", role="Scala Developer", when="Oct 2019 — Sep 2020", loc="Buenos Aires",
       bul=["Mosaic Energy account: service development and quality assurance in Scala and Java 8.",
            "Feature definition, code maintenance, QA, and production troubleshooting."]),

  dict(co="Globant", role="Java Developer", when="Feb 2019 — Sep 2019", loc="Buenos Aires",
       bul=["Disney account: microservice development in Java 8, Spring, Spring Boot and Spring Integration, on MariaDB and DynamoDB.",
            "Robotic process automation and web automation with Selenium."]),
]

jobs = "".join(f"""<article class="job">
  <div class="when">{E(r['when'])}</div>
  <div class="what">
    <h3>{E(r['co'])} <span class="role">{E(r['role'])}</span></h3>
    <p class="loc">{E(r['loc'])}{' · ' + E(r['note']) if r.get('note') else ''}</p>
    <ul>{''.join(f'<li>{b}</li>' for b in r['bul'])}</ul>
  </div></article>""" for r in ROLES)

skills = "".join(f"<div class='skill'><h4>{E(s.get('name',''))}</h4><p>{E(', '.join(s.get('keywords',[])))}</p></div>"
                 for s in src.get("skills", []))
EDU = [
  dict(when="2013 — 2017", school="Washington &amp; Lee University",
       what="Bachelor of Arts, Geology &amp; Business — Lexington, VA, United States"),
  dict(when="— 2013", school="Trinity College",
       what="International Baccalaureate Diploma — Buenos Aires"),
]
edu = "".join(f"<article class='job'><div class='when'>{e['when']}</div>"
              f"<div class='what'><h3>{e['school']}</h3>"
              f"<p class='loc'>{e['what']}</p></div></article>" for e in EDU)
certs = ""  # the only entry was the WorkFusion cert, which Julian asked to drop
langs = ", ".join(f"{E(l.get('language',''))} ({E(l.get('fluency',''))})" for l in src.get("languages", []))

doc = f"""<!doctype html><meta charset="utf-8"><title>Julian Irigoyen — CV</title>
<style>
@page {{ size:A4; margin:14mm 13mm; }}
*{{box-sizing:border-box}}
body{{margin:0;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;color:#14171b;font-size:8.9pt;line-height:1.46}}
h1{{font-size:20pt;margin:0;letter-spacing:-.022em;font-weight:800}}
.label{{color:#565b63;font-size:9.4pt;margin:3px 0 0}}
.meta{{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:7.4pt;letter-spacing:.045em;color:#63686f;margin-top:7px}}
.rule{{height:2px;background:#14171b;margin:10px 0 5px}}
.sum{{margin:8px 0 0;max-width:62em}}
h2{{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:7.4pt;letter-spacing:.17em;text-transform:uppercase;color:#63686f;margin:14px 0 7px;padding-bottom:4px;border-bottom:1px solid #dcdcd8}}
.job{{display:grid;grid-template-columns:19% 1fr;gap:12px;margin-bottom:8px;break-inside:avoid}}
.when{{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:7.2pt;color:#63686f;padding-top:2px}}
h3{{font-size:9.6pt;margin:0;font-weight:700}}
.role{{font-weight:400;color:#565b63}}
.loc{{margin:1px 0 0;color:#63686f;font-size:7.9pt}}
ul{{margin:.3em 0 0;padding-left:1.02em}}
li{{margin-bottom:.15em}}
b{{font-weight:700;color:#14171b}}
.skills{{display:grid;grid-template-columns:1fr 1fr;gap:5px 22px}}
.skill h4{{margin:0;font-size:8.4pt}} .skill p{{margin:0;color:#565b63}}
.foot{{margin-top:12px;padding-top:7px;border-top:1px solid #dcdcd8;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:7pt;letter-spacing:.045em;color:#63686f}}
</style>
<header>
  <h1>Julian Irigoyen</h1>
  <p class="label">Senior Software Engineer — Distributed Systems, Platform &amp; AI Agent Infrastructure</p>
  <p class="meta">dev@supersolid.co &nbsp;·&nbsp; +54 9 11 3663 9160 &nbsp;·&nbsp; julianmirigoyen.online &nbsp;·&nbsp; github.com/JulianIrigoyen &nbsp;·&nbsp; linkedin.com/in/julianirigoyen &nbsp;·&nbsp; Buenos Aires · Remote US / EU</p>
  <div class="rule"></div>
  <p class="sum">{E(SUMMARY)}</p>
</header>
<h2>Experience</h2>{jobs}
<h2>Skills</h2><div class="skills">{skills}</div>
<h2>Education</h2>{edu}
{f'<h2>Certificates</h2><ul>{certs}</ul>' if certs else ''}
<p class="foot">Languages: {langs} &nbsp;·&nbsp; Every project listed is running — julianmirigoyen.online</p>
"""
open("/tmp/cv.html","w").write(doc)
print(f"built: {len(ROLES)} roles, {len(doc)} bytes")
