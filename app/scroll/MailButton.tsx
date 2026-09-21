"use client";

import { useEffect, useRef, useState } from "react";

export const ADDRESS = "julian@supersolid.co";

/* ————————————————————————————————————————————————
   The one call on the page, and it was a dead end.

   Nothing was broken in the markup. Measured on the running page: the anchor
   is the top hit-test element at its own centre, `pointer-events: auto`, no
   transform offset, and the href is a valid `mailto:`. What fails is the
   handoff — `mailto:` gives the click to an OS mail handler, and a browser
   with none registered swallows it without a word. The reader clicks a button
   that says "start a conversation" and the page does nothing.

   So the click stops depending on it. The mail client still opens for readers
   who have one; everyone else gets the address on their clipboard and is told
   so. The copy is the fallback, never the action, so it can fail silently — the
   address is printed in the close either way, because a call to action that
   only works through software you may not have installed is not a call to
   action.
   ———————————————————————————————————————————————— */
export default function MailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    /* Not awaited and not allowed to cancel the navigation: the mailto is
       still the primary path for anyone who has a handler. */
    navigator.clipboard?.writeText(ADDRESS).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2600);
      },
      () => {
        /* denied, or an insecure context. The address is on screen regardless,
           so there is nothing to report and nothing to fake. */
      }
    );
  };

  return (
    <>
      <a
        className="jx-btn jx-btn--solid"
        href={`mailto:${ADDRESS}`}
        onClick={onClick}
        data-sc-magnet="0.28"
        data-sc-rise="0"
      >
        Start a conversation →
      </a>
      {/* Rendered only while it has something to say: an empty box would still
          take a gap in the flex row and push the row off centre. */}
      {copied ? (
        <span className="jx-copied" role="status">
          {ADDRESS} copied
        </span>
      ) : null}
    </>
  );
}
