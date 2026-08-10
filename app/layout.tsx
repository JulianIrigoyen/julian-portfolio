import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Julian Irigoyen — systems that stay in production",
  description:
    "Distributed-systems engineer (Scala/Akka, Rust, TypeScript) building autonomous AI agent systems that run in production. Principal engineer at Supersolid.",
  keywords: [
    "AI agents",
    "distributed systems",
    "Rust",
    "Scala",
    "Akka",
    "TypeScript",
    "LLM orchestration",
    "Buenos Aires",
  ],
  authors: [{ name: "Julian Irigoyen", url: "https://github.com/JulianIrigoyen" }],
  openGraph: {
    title: "Julian Irigoyen — systems that stay in production",
    description:
      "Autonomous agent systems, a Rust trading platform, and an LLM orchestration framework that shipped 30 client sites.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
