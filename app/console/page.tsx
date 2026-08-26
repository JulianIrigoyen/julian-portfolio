import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Console from "./Console";
import { CONSOLE_ENABLED } from "./visibility";

export const metadata: Metadata = {
  title: "Julian Irigoyen — console",
  description: "The instrument-console build of this portfolio.",
  // belt and braces: even if the route is reachable, keep it out of indexes
  robots: { index: false, follow: false, nocache: true },
};

export default function ConsolePage() {
  // hidden in production unless explicitly switched on
  if (!CONSOLE_ENABLED) notFound();
  return <Console />;
}
