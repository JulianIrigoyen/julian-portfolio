import Portfolio from "./portfolio/Portfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Julian Irigoyen — Engineer & cofounder",
  description: "Engineer and Supersolid cofounder in Buenos Aires. Autonomous agents, software for real businesses, and personal projects in mountains and music.",
  openGraph: {
    title: "Julian Irigoyen — Engineer & cofounder",
    description: "Selected work, ongoing projects, and eight years of building software. Based in Buenos Aires, Argentina.",
    type: "website",
  },
};

export default function Home() {
  return <Portfolio />;
}
