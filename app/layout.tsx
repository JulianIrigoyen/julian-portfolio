import type { Metadata } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "./globals.css";

const jb = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Julian Irigoyen — systems that stay in production",
  description:
    "One engineer operating like an engineering org: a 24/7 autonomous agent, a Rust LLM orchestration framework, and a trading platform on live markets. Seven years of distributed systems — Scala/Akka, Rust, TypeScript.",
  authors: [{ name: "Julian Irigoyen", url: "https://github.com/JulianIrigoyen" }],
  openGraph: {
    title: "Julian Irigoyen — systems that stay in production",
    description:
      "An operations console for one engineer. Autonomous agents, Rust infrastructure, ~30 shipped products.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jb.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
