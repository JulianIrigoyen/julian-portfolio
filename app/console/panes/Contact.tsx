"use client";

import Lattice from "../Lattice";

export default function Contact() {
  return (
    <div className="pane-in px-5 py-10 sm:px-8">
      <span className="lbl">contact</span>

      <div className="mt-6 overflow-hidden rounded-sm border border-rule bg-panel">
        <Lattice />
      </div>

      <h2 className="readout mt-8 max-w-3xl text-[24px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[34px]">
        Order and flow, at the same time.
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2">
        A supersolid is matter that is crystalline and frictionless at once —
        rigid structure, zero-resistance flow. It is also a fair description of
        good infrastructure. That is the standard I build to.
      </p>

      <div className="mt-9 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-3">
        {[
          { k: "email", v: "julian@supersolid.co", href: "mailto:julian@supersolid.co" },
          { k: "github", v: "JulianIrigoyen", href: "https://github.com/JulianIrigoyen" },
          { k: "linkedin", v: "julianirigoyen", href: "https://linkedin.com/in/julianirigoyen" },
        ].map((c) => (
          <a
            key={c.k}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group bg-panel p-5 transition-colors hover:bg-panel-2"
          >
            <span className="lbl">{c.k}</span>
            <p className="readout mt-2 truncate text-[13px] text-ink transition-colors group-hover:text-amber">
              {c.v} ↗
            </p>
          </a>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 border-t border-rule-bright pt-6">
        <span className="dot dot--idle mt-1.5" aria-hidden />
        <p className="max-w-2xl text-[14px] leading-relaxed text-ink-2">
          <span className="text-ink">Available now.</span> Open to senior
          AI/agent engineering and Rust backend roles — remote, US or EU — and
          taking on select consulting work through Supersolid.
        </p>
      </div>

      <p className="lbl mt-10 !normal-case !tracking-[0.04em]">
        © {new Date().getFullYear()} Julian Irigoyen · Buenos Aires, Argentina
      </p>
    </div>
  );
}
