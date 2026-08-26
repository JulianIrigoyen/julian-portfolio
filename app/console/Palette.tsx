"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RAIL, WORKS, type PaneId } from "./data";

/* ————————————————————————————————————————————————
   The command palette. ⌘K / Ctrl+K.

   This is the thing that makes the console an instrument rather than a
   brochure: every pane and all thirteen works are one keystroke and a few
   letters away, and nothing has to be hunted for in a sidebar.

   It is also built to be read cold by someone who has never seen it — the
   trigger is visible in the chrome, the hint row is always on screen, and
   the empty state says what you can type.
   ———————————————————————————————————————————————— */

type Item =
  | { kind: "pane"; id: PaneId; label: string; hint: string }
  | { kind: "work"; id: string; label: string; hint: string; href: string | null };

export default function Palette({
  open,
  onClose,
  onGo,
}: {
  open: boolean;
  onClose: () => void;
  onGo: (id: PaneId) => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items: Item[] = useMemo(() => {
    const panes: Item[] = RAIL.map((r) => ({
      kind: "pane",
      id: r.id,
      label: r.label,
      hint: r.meta || "pane",
    }));
    const works: Item[] = WORKS.map((w) => ({
      kind: "work",
      id: w.id,
      label: w.name,
      hint: `${w.status} · ${w.one}`,
      href: w.href,
    }));
    return [...panes, ...works];
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(t) || i.hint.toLowerCase().includes(t)
    );
  }, [q, items]);

  // reset whenever it opens
  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      // focus after paint, or the browser eats the first keystroke
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  // keep the highlighted row in view when arrowing past the fold
  useEffect(() => {
    listRef.current?.children[sel]?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!open) return null;

  const run = (i: Item) => {
    if (i.kind === "pane") {
      onGo(i.id);
    } else if (i.href) {
      window.open(i.href, "_blank", "noopener,noreferrer");
    } else {
      // no public url — take them to the entry in WORKS instead of nowhere
      onGo("works");
      window.location.hash = "works";
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-housing/80 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-sm border border-rule-bright bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <span className="lbl !text-amber">go to</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (results[sel]) run(results[sel]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              }
            }}
            placeholder="a pane, or any of the works…"
            className="readout min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
          />
          <span className="lbl !text-[9px] shrink-0">esc</span>
        </div>

        <ul ref={listRef} className="max-h-[46vh] overflow-y-auto">
          {results.length === 0 && (
            <li className="px-4 py-6">
              <p className="text-[13px] text-ink-2">
                Nothing matches{" "}
                <span className="readout text-ink">“{q}”</span>.
              </p>
              <p className="lbl mt-2 !normal-case !tracking-[0.04em]">
                Try a pane name, a product, or a status like “offline”.
              </p>
            </li>
          )}

          {results.map((i, n) => {
            const on = n === sel;
            return (
              <li key={`${i.kind}-${i.id}`}>
                <button
                  onMouseEnter={() => setSel(n)}
                  onClick={() => run(i)}
                  className={`flex w-full items-baseline gap-3 px-4 py-2.5 text-left ${
                    on ? "bg-panel-2" : ""
                  }`}
                >
                  <span
                    className={`lbl w-11 shrink-0 !text-[8.5px] ${
                      i.kind === "pane" ? "!text-amber" : ""
                    }`}
                  >
                    {i.kind}
                  </span>
                  <span className="readout w-[124px] shrink-0 truncate text-[12.5px] font-bold text-ink">
                    {i.label}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-ink-2">
                    {i.hint}
                  </span>
                  {i.kind === "work" && !i.href && (
                    <span className="lbl shrink-0 !text-[8.5px]">no url</span>
                  )}
                  {on && <span className="lbl shrink-0 !text-amber">↵</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2">
          {[
            ["↑ ↓", "move"],
            ["↵", "open"],
            ["esc", "close"],
            ["?", "all shortcuts"],
          ].map(([k, v]) => (
            <span key={k} className="flex items-baseline gap-1.5">
              <span className="readout text-[10px] text-ink">{k}</span>
              <span className="lbl !text-[8.5px]">{v}</span>
            </span>
          ))}
          <span className="lbl ml-auto !text-[8.5px]">
            {results.length} of {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
