import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./scrollcraft.css";
import "./theme.css";

const mono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Julian Irigoyen — systems that stay in production",
  description:
    "A 30-year-old engineer from Argentina. Backend, full-stack, DevOps, and AI engineering work for large corporations, small businesses, startups, and product companies.",
  authors: [{ name: "Julian Irigoyen", url: "https://github.com/JulianIrigoyen" }],
  openGraph: {
    title: "Julian Irigoyen — systems that stay in production",
    description:
      "I love a good challenge. Backend, full-stack, DevOps, and agentive AI workflows out of Buenos Aires.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
