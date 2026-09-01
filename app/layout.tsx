import type { Metadata, Viewport } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import Analytics from "./analytics/Analytics";
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
  title: "Julian Irigoyen — I love a good challenge",
  description:
    "A 31-year-old engineer from Argentina. Backend, full-stack, DevOps, and AI engineering work for large corporations, small businesses, startups, and product companies.",
  authors: [{ name: "Julian Irigoyen", url: "https://github.com/JulianIrigoyen" }],
  openGraph: {
    title: "Julian Irigoyen — I love a good challenge",
    description:
      "I love a good challenge. Backend, full-stack, DevOps, and agentic AI workflows around the world.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${mono.variable} antialiased`}
    >
      <head>
        {/* Applies the reader's stored choice before first paint. Without it
            the page paints its default theme and then swaps, which reads as a
            flash of the wrong ground on every navigation. No choice stored
            means no attribute, which is what leaves the CSS free to follow
            the system preference. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('jx-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full">
        {children}
        <VercelAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
