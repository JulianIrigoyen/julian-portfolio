/* ————————————————————————————————————————————————
   Whether /console exists at all.

   One rule, read by three places: the route itself (which 404s when this is
   false), the link on the scroll page (which disappears), and robots.txt.
   Keeping it in one constant is the point — a hidden route with a live link
   pointing at it is worse than no gate.

   NODE_ENV and NEXT_PUBLIC_* are both inlined at build time, so this is safe
   to read from a client component.

   To see it in production, set NEXT_PUBLIC_SHOW_CONSOLE=1 in the Vercel
   project's environment. Locally it is always on.
   ———————————————————————————————————————————————— */

export const CONSOLE_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_CONSOLE === "1";
