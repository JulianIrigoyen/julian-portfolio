export const CONTACT_EMAIL = "julian@supersolid.co";

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  image?: { src: string; alt: string; caption: string; cover?: boolean };
};

// The order is Julian's, shared by the featured rows and the compact list.
export const PROJECTS: Project[] = [
  {
    id: "project-supersolid", name: "Supersolid", category: "Studio · Cofounder",
    description: "The studio I started with Dmitry Sabanin, my former boss and mentor, and Emiliano Migliorata, my best friend. We build our own products and cofound with other founders on theirs.",
    href: "https://supersolid.co",
    image: { src: "/work/supersolid.png", alt: "Supersolid’s website", caption: "Supersolid / Studio website" },
  },
  {
    id: "project-poor", name: "Poor Hedge Fund", category: "Systematic trading",
    description: "Our self-funded systematic trading project. An Erlang engine, a web console, and native Mac and iPhone apps for managing the platform. Our own capital, our own risk. The engine is private.",
    href: "https://poorhedgefund.com",
    image: { src: "/work/poorhedgefund.png", alt: "Poor Hedge Fund’s public website", caption: "Poor Hedge Fund / Public website" },
  },
  {
    id: "project-djinn", name: "DJINN", category: "Autonomous agent",
    description: "An agent we’re building at Supersolid for development tasks, infrastructure monitoring and shared knowledge. It runs on a cloud VM, takes requests through Slack, and uses memory, tools and review to carry out its work.",
    href: "https://djinn-site-teal.vercel.app",
    image: { src: "/work/djinn.png", alt: "DJINN’s public website", caption: "DJINN / Project website" },
  },
  {
    id: "experiment-jtreks", name: "jtreks", category: "Trekking guides & maps",
    description: "I like trekking. Finding reliable information to plan a trip was annoyingly difficult. So I built trekking guides with traceable sources and 3D route maps from real satellite elevation data.",
    href: "https://jtreks.co",
    image: { src: "/experiments/fitz-roy.jpg", alt: "Fitz Roy’s granite towers in Patagonia", caption: "Fitz Roy / Patagonia", cover: true },
  },
  {
    id: "experiment-ascenso", name: "Ascenso", category: "Mountain simulation · Unreal Engine 5",
    // Julian's line, August 26 (53fe1e4). Do not rewrite.
    description: "A playable climb of Volcán Lanín, 3,776m, in Unreal Engine 5. Real terrain from satellite elevation data, the real Tromen route from OpenStreetMap, and hazards taken from having actually summited it. The same elevation file feeds three things: this game, the map on jtreks.co, and a 3D-printed keyring.",
    href: "https://ascenso.world",
    image: { src: "/experiments/ascenso-lanin.webp", alt: "Ascenso cover artwork of Volcán Lanín", caption: "Volcán Lanín / Cover artwork", cover: true },
  },
  {
    id: "project-keonda", name: "Keonda", category: "Social marketplace",
    description: "A marketplace for the sea: boats on a live chart, chat between guests, captains and providers, and bookings. Available on the App Store.",
    href: "https://apps.apple.com/us/app/keonda/id6785094649",
  },
  {
    id: "project-luxy", name: "Luxy", category: "Concierge · Ibiza",
    description: "A WhatsApp concierge that turns a request for a table, a boat or a villa into something bookable, with checkout attached.",
    href: "https://www.ibizaluxy.online/",
  },
  {
    id: "project-smith-magenis", name: "Smith-Magenis", category: "Awareness & family resources",
    description: "A multilingual resource site about Smith-Magenis syndrome, bringing together information, support organizations and resources for families.",
    href: "https://sms-awareness.vercel.app",
  },
  {
    id: "project-half", name: "Half Production", category: "Events · Ibiza",
    description: "A multilingual event-production site and an internal booking desk for an Argentina-to-Ibiza crew.",
    href: "https://half-productions.vercel.app",
  },
  {
    id: "project-innovalport", name: "Innovalport", category: "B2B commerce",
    description: "An import platform for Argentine companies: catalogue, landed-cost simulation, wholesale orders and logistics, connected to MercadoLibre and Tiendanube.",
    href: "https://www.innovalportb2b.com",
  },
  {
    id: "project-speed", name: "Speed Ibiza", category: "Operations software",
    description: "Route planning, orders, collections, stock and invoicing for a beverage distributor. A field app for the drivers and an admin desk for the office.",
    href: "https://speed-ibiza.vercel.app",
  },
  {
    id: "project-outflow", name: "Outflow", category: "Music & education",
    description: "Courses, equipment and bookings for a DJ school and sound rental house in Buenos Aires.",
    href: "https://www.outflow.com.ar",
  },
];

export const EXPERIMENTS = [
  { id: "sniper", name: "Solana Sniper", tag: "Rust · Open source", text: "I wanted to put my Rust knowledge to use and open-source something useful. A service for watching Raydium events, inspecting tokens and tracking wallets.", href: "https://github.com/JulianIrigoyen/solana-sniper" },
  { id: "imho", name: "IMHO", tag: "Real estate · Search", text: "Looking for a home in Mar del Plata was tedious. I built a search that starts with what you want, backed by property scrapers and checked extractions.", href: "https://imho-real-estate.vercel.app" },
  { id: "pushy", name: "Pushy", tag: "Rust · Notifications", text: "An interview challenge I got carried away with. Now a library I reuse for email and push delivery, with queued workers and templates outside the codebase.", href: null },
  { id: "hermes", name: "Hermes Thrice", tag: "Music · Audio · Visuals", text: "Tools for my own music-making: searching by tone and BPM, making drums and basslines, and turning sound into visuals.", href: null },
];
