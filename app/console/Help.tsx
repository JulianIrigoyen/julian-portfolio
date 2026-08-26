"use client";

/* The shortcut sheet. `?` opens it.
   An instrument that hides its controls is just a puzzle, and this view is
   sent to people who have never seen it — so the keys are written down. */

const KEYS: { k: string; v: string }[] = [
  { k: "⌘K / Ctrl K", v: "command palette — jump to any pane or product" },
  { k: "1 … 9", v: "jump straight to that pane in the rail" },
  { k: "j / k", v: "next / previous pane" },
  { k: "g then w", v: "go to works" },
  { k: "?", v: "this sheet" },
  { k: "esc", v: "close whatever is open" },
];

export default function Help({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-housing/80 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-sm border border-rule-bright bg-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline gap-3 border-b border-rule px-4 py-3">
          <span className="lbl !text-amber">keyboard</span>
          <span className="lbl ml-auto !text-[9px]">esc to close</span>
        </div>
        <dl className="divide-y divide-rule">
          {KEYS.map((r) => (
            <div key={r.k} className="flex items-baseline gap-4 px-4 py-2.5">
              <dt className="readout w-[104px] shrink-0 text-[11.5px] text-ink">
                {r.k}
              </dt>
              <dd className="min-w-0 flex-1 text-[12.5px] text-ink-2">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
