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
       loc="United States · Remote", team="Agentic workflows team", note="promoted from Senior Software Engineer",
       bul=["On the agentic workflows team throughout — automating collections workflows end to end.",
            "Designed and shipped the authorization platform on AWS Cognito — adopted by the legacy estate and built into new applications and services across the company.",
            "Led the workflow engine migration from Camunda to Netflix Conductor, <b>saving $200k</b>.",
            "Built the bankruptcy monitoring system for collections compliance. The failure mode there was regulatory exposure, not cost.",
            "Designed the collector shim bridging the legacy estate to One True Platform, the next-generation system.",
            "Built the partial payments flow, which drove <b>hundreds of thousands in revenue</b> across tax season.",
            "Platform engineering across Java, TypeScript, Scala and Go; CI/CD on Kubernetes, Helm and ArgoCD."]),

  dict(co="TrueML", role="Senior Software Engineer", when="Mar 2024 — Mar 2025",
       loc="United States · Remote", team="Agentic workflows team",
       bul=["Platform and infrastructure work across the estate, leading to promotion to Senior II."]),

  dict(co="Expero", role="Backend Developer — Rust & .NET", when="Aug 2021 — Jan 2024",
       loc="Houston, Texas · Remote",
       bul=["Portfolio management for <b>IHS Markit</b>: APIs and data pipelines for capital-intensive industries and markets.",
            "Event-driven architecture; persistence and data-science-adjacent services."]),

  dict(co="Fractal Technology", role="Lead Developer — Scala & Akka", when="2022 — 2023",
       loc="Remote", note="concurrent with Expero",
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

def row(k, body, cls=""):
    return (f'<div class="row {cls}"><div class="k">{k}</div>'
            f'<div class="v">{body}</div></div>')

def when(w):
    # Break at the dash only when the range is too wide for the rail, so short
    # year-only ranges keep their single line.
    return w.replace(" — ", " —<br>") if len(w) > 12 else w

jobs = "".join(row(
    when(E(r["when"])),
    f'<h3>{E(r["co"])}<span class="role">{E(r["role"])}</span></h3>'
    f'<p class="loc">{E(r["loc"])}'
    f'{" · <em>" + E(r["team"]) + "</em>" if r.get("team") else ""}'
    f'{" — " + E(r["note"]) if r.get("note") else ""}</p>'
    f'<ul>{"".join(f"<li>{b}</li>" for b in r["bul"])}</ul>',
    "job") for r in ROLES)

# The rail is narrow, so long skill-group names get a short form. Same order as
# resume.json — the mapping only ever shortens, never renames a group.
SHORT = {"Frameworks & Libraries": "Frameworks", "Infrastructure & DevOps": "Infra/DevOps",
         "Practices & Patterns": "Practices"}
skills = "".join(row(SHORT.get(s.get("name", ""), E(s.get("name", ""))),
                     E(", ".join(s.get("keywords", []))), "kv")
                 for s in src.get("skills", []))

EDU = [
  ("2013 — 2017", "Washington &amp; Lee University",
   "Bachelor of Arts, Geology &amp; Business — Lexington, VA, United States"),
  ("2012", "Trinity College",
   "International Baccalaureate Diploma — Buenos Aires"),
]
edu = "".join(row(when(w), f'<h3>{s}</h3><p class="loc">{d}</p>', "job") for w, s, d in EDU)

langs = ", ".join(f'{E(l.get("language",""))} ({E(l.get("fluency",""))})'
                  for l in src.get("languages", []))

CONTACT = ["julian@supersolid.co", "+54 9 11 3663 9160", "julianmirigoyen.online",
           "github.com/JulianIrigoyen", "linkedin.com/in/julianirigoyen",
           "Buenos Aires · Remote US / EU"]
contact = '<li class="sep">·</li>'.join(f"<li>{E(c)}</li>" for c in CONTACT)

def head(t):
    return f'<div class="row sec"><div class="k">{t}</div><div class="v"><i></i></div></div>'

doc = f"""<!doctype html><meta charset="utf-8"><title>Julian Irigoyen — CV</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=block">
<style>
@page {{ size:A4; margin:15mm 14mm; }}
:root {{
  --ink:#14171b; --ink-2:#565b63; --ink-3:#6a6f77;
  --rule:#dcd8d1; --accent:#1f4fd8;
  --rail:92px; --gut:20px;
  --sans:"Archivo",-apple-system,"Helvetica Neue",Arial,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;
}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:var(--sans);color:var(--ink);font-size:9.3pt;line-height:1.52;
     -webkit-font-smoothing:antialiased}}

/* One grid for the whole document: a monospace rail, a hairline spine, and the
   content column. Dates, section labels and skill groups all land in the rail,
   so every line in the CV shares two vertical edges. */
.row{{display:grid;grid-template-columns:var(--rail) 1fr}}
.k{{font-family:var(--mono);font-size:7.3pt;letter-spacing:.01em;color:var(--ink-3);
    padding-right:var(--gut);padding-top:2.5px;line-height:1.42}}
.v{{border-left:1px solid var(--rule);padding-left:var(--gut);position:relative}}

/* Section label: rail text, then a rule running the width of the content column. */
.sec{{margin-top:17px}}
.sec .k{{font-size:7.1pt;letter-spacing:.19em;text-transform:uppercase;color:var(--ink-2);
         font-weight:500;padding-top:0}}
.sec .v{{padding-top:0;padding-bottom:9px}}
.sec i{{display:block;height:1px;background:var(--rule);margin-top:4.2px}}

/* Each entry gets a node on the spine, level with the company name. */
.job{{break-inside:avoid}}
.job .v{{padding-bottom:13px}}
.job .v::before{{content:"";position:absolute;left:-2.5px;top:5.5px;
                 width:4px;height:4px;background:var(--accent)}}
.kv .v{{padding-bottom:8.5px}}
/* The summary is the one block that should not run edge to edge. */
.profile .v{{padding-top:13px;padding-bottom:22px;padding-right:38px}}
.profile .k{{padding-top:13px}}

h1{{font-size:23pt;margin:0;letter-spacing:-.025em;font-weight:700;line-height:1}}
.title{{color:var(--ink-2);font-size:10.2pt;margin:6px 0 0;font-weight:400;letter-spacing:-.004em}}
.contact{{list-style:none;display:flex;flex-wrap:wrap;gap:1px 9px;margin:9px 0 0;padding:0;
          font-family:var(--mono);font-size:7.1pt;letter-spacing:.01em;color:var(--ink-3)}}
.contact li{{white-space:nowrap}}
.contact .sep{{color:#c2bdb5}}
.bar{{height:2.5px;background:var(--ink);margin:13px 0 0}}

h3{{font-size:10pt;margin:0;font-weight:600;letter-spacing:-.008em}}
.role{{font-weight:400;color:var(--ink-2);letter-spacing:0}}
.role::before{{content:"";display:inline-block;width:1px;height:8px;background:var(--rule);
               vertical-align:-1px;margin:0 7px}}
.loc{{margin:2px 0 0;color:var(--ink-3);font-size:8.1pt}}
.loc em{{color:var(--accent);font-style:normal;font-weight:500}}
/* Scoped to the entry column — an unscoped li::before also drew a dash in
   front of every contact item in the header. */
.v ul{{margin:4px 0 0;padding:0;list-style:none}}
.v ul li{{margin-bottom:2px;padding-left:12px;position:relative}}
.v ul li::before{{content:"";position:absolute;left:0;top:.52em;width:4px;height:1px;background:#aca79f}}
b{{font-weight:600;color:var(--ink)}}

.foot{{margin-top:13px}}
.foot .v{{border-left:0;padding-left:var(--gut);color:var(--ink-3);
          font-family:var(--mono);font-size:7.1pt;letter-spacing:.01em}}
.foot .v i{{display:block;height:1px;background:var(--rule);margin-bottom:7px}}
</style>

<header>
  <h1>Julian Irigoyen</h1>
  <p class="title">Senior Software Engineer — Distributed Systems, Platform &amp; AI Agent Infrastructure</p>
  <ul class="contact">{contact}</ul>
  <div class="bar"></div>
</header>
{row("Profile", E(SUMMARY), "kv profile")}
{head("Experience")}{jobs}
{head("Skills")}{skills}
{head("Education")}{edu}
<div class="row foot"><div class="k"></div><div class="v"><i></i>
Languages: {langs} &nbsp;·&nbsp; Every project listed here is running.</div></div>
"""
open("/tmp/cv.html", "w").write(doc)
print(f"built: {len(ROLES)} roles, {len(doc)} bytes")
