import { Children, cloneElement, Fragment, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

/* ————————————————————————————————————————————————
   Fixation reading.

   The eye does not read letter by letter. It lands on a word, takes the first
   few characters, and infers the rest — so anchoring the opening fragment of
   each word gives it a fixed target and lets the tail recede. That is the whole
   trick behind bionic reading.

   Worth knowing: the evidence that this makes anyone *measurably* faster is
   thin — the studies that have looked for a speed gain mostly did not find one.
   It reads as deliberate and it gives a wall of prose a rhythm, which is reason
   enough. Dial it back to nothing by dropping the weight in `.jx-bi`.

   The walk only ever touches text nodes. Links, <strong> and the index triggers
   keep their elements and their own colour; the anchors inside them just take
   the weight. Nothing is added to or removed from the copy — see the assertion
   in the dev block below, which fails loudly if a single character moves.
   ———————————————————————————————————————————————— */

// Letters, marks and both apostrophes. Punctuation and spacing fall through
// untouched, which is what keeps the original string recoverable.
const WORD = /[\p{L}\p{M}'’]+/gu;

/** How much of a word to anchor. Short words get one character; nothing ever
 *  gets more than five, or the effect stops being a hint and becomes bold text.
 *  Acronyms are skipped entirely — see splitText. */
function anchor(n: number): number {
  if (n <= 3) return 1;
  if (n <= 5) return 2;
  if (n <= 8) return 3;
  if (n <= 11) return 4;
  return 5;
}

function splitText(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;

  for (const m of text.matchAll(WORD)) {
    const word = m[0];
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));

    // An acronym is read as one unit, so anchoring part of it is noise:
    // TDD, CI, CD and QA stay whole.
    if (word.length > 1 && word === word.toUpperCase() && word !== word.toLowerCase()) {
      out.push(word);
      last = at + word.length;
      continue;
    }

    const n = anchor(word.length);
    out.push(
      <b className="jx-bi" key={`b${k++}`}>
        {word.slice(0, n)}
      </b>,
    );
    const tail = word.slice(n);
    if (tail) out.push(tail);
    last = at + word.length;
  }

  if (last < text.length) out.push(text.slice(last));

  if (process.env.NODE_ENV !== "production") {
    // The whole contract of this component is that it changes how the copy
    // looks and nothing about what it says. Rebuild the string from the parts
    // and shout if a character moved.
    const back = out
      .map((n) => (typeof n === "string" ? n : (n as ReactElement<{ children: string }>).props.children))
      .join("");
    if (back !== text) {
      console.error("[Bionic] copy altered\n  in:  %o\n  out: %o", text, back);
    }
  }

  return out;
}

function walk(node: ReactNode): ReactNode {
  if (typeof node === "string") return splitText(node);

  if (Array.isArray(node)) {
    return Children.map(node, (child, i) => (
      <Fragment key={i}>{walk(child)}</Fragment>
    ));
  }

  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.props.children == null) return node;
    return cloneElement(el, undefined, walk(el.props.children));
  }

  return node;
}

export default function Bionic({ children }: { children: ReactNode }) {
  return <>{walk(children)}</>;
}
