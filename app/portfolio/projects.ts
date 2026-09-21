// Descriptions are Julian's own lines from the scroll page (the August 26 cards,
// 53fe1e4, or his later corrections on that page), restored 2026-09-21. The
// redesign session had rewritten every one of them. Smith-Magenis has no line of
// his and keeps the redesign's. Do not rewrite these; edit only what he asks.
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
    description: "The studio I started this year with Dmitry Sabanin, my former boss and mentor, and Emiliano Migliorata, my best friend. We build our own products, and we cofound with other founders on theirs.",
    href: "https://supersolid.co",
    image: { src: "/work/supersolid.png", alt: "Supersolid’s website", caption: "Supersolid / Studio website" },
  },
  {
    id: "project-poor", name: "Poor Hedge Fund", category: "Systematic trading",
    description: "A self-funded systematic fund. An Erlang engine runs strategies against live orderbooks, every market and instrument its own actor, with a web console and a native Mac and iPhone app built to view and manage platform processes. Our own capital, our own risk.",
    href: "https://poorhedgefund.com",
    image: { src: "/work/poorhedgefund.png", alt: "Poor Hedge Fund’s public website", caption: "Poor Hedge Fund / Public website" },
  },
  {
    id: "project-djinn", name: "DJINN", category: "Autonomous agent",
    description: "An open-source agentic workflow platform. In continuous development since January 2026 and running unattended on a cloud VM since June, reachable through Slack (and more channels), trusted with real infrastructure: feature development and reviews, watchdogs, nightly digests, incident detection, and a knowledge store it maintains itself.",
    href: "https://djinn-site-teal.vercel.app",
    image: { src: "/work/djinn.png", alt: "DJINN’s public website", caption: "DJINN / Project website" },
  },
  {
    id: "experiment-jtreks", name: "jtreks", category: "Trekking guides & maps",
    description: "Trekking guides where every claim is traced back to a government portal, a park authority or a peer-reviewed paper — 32 ranges, 243 articles, 3,403 sources. The 3D route maps are drawn from the same satellite elevation data as the Lanín climb below.",
    href: "https://jtreks.co",
    image: { src: "/experiments/fitz-roy.jpg", alt: "Fitz Roy’s granite towers in Patagonia", caption: "Fitz Roy / Patagonia", cover: true },
  },
  {
    id: "experiment-ascenso", name: "Ascenso", category: "Mountain simulation · Unreal Engine 5",
    // Julian's text, September 21, reordered and tightened at his request. Do not rewrite.
    description: "Ascenso introduces fantasy, history and culture in beautiful worlds designed using real elevation data, myths and legends, and even real mountaineering skills. Through it, you’ll get an exciting glimpse into what it feels like to actually reach a summit, while learning how to do it and about the places where you’d do it on the way. It’s a complementary product to my other trekking / mountain related project, jtreks, which helps you plan trekking trips fast and easily with real, useful, properly sourced data. Currently in development, soon to release for early access.",
    href: "https://ascenso.world",
    image: { src: "/experiments/ascenso-lanin.webp", alt: "Ascenso cover artwork of Volcán Lanín", caption: "Volcán Lanín / Cover artwork", cover: true },
  },
  {
    id: "project-keonda", name: "Keonda", category: "Social marketplace",
    description: "A social marketplace for the sea: a live chart of boats, chat between guests, captains and providers, and a marketplace underneath it. Live in the App Store.",
    href: "https://apps.apple.com/us/app/keonda/id6785094649",
  },
  {
    id: "project-luxy", name: "Luxy", category: "Concierge · Ibiza",
    description: "A concierge for Ibiza. A WhatsApp agent takes a request in plain language — a table, a boat, a villa — and turns it into something bookable, with checkout attached. Complementary to Keonda. Webapp live.",
    href: "https://www.ibizaluxy.online/",
  },
  {
    id: "project-smith-magenis", name: "Smith-Magenis", category: "Awareness & family resources",
    description: "A multilingual resource site about Smith-Magenis syndrome, bringing together information, support organizations and resources for families.",
    href: "https://sms-awareness.vercel.app",
  },
  {
    id: "project-half", name: "Half Production", category: "Events · Ibiza",
    description: "A multilingual event-production site for an Argentina-to-Ibiza crew, with the public brand, Dharma, Boiler Cook, crew pages, print-ready QR assets, and an internal booking desk that turns Ibiza calendars, artist fees and warm-path relationships into a shortlist for monthly guest slots.",
    href: "https://half-productions.vercel.app",
  },
  {
    id: "project-innovalport", name: "Innovalport", category: "B2B commerce",
    description: "An import platform for Argentine companies buying from international suppliers: catalogue, landed-cost simulator, wholesale orders and logistics, wired into MercadoLibre and Tiendanube.",
    href: "https://www.innovalportb2b.com",
  },
  {
    id: "project-speed", name: "Speed Ibiza", category: "Operations software",
    description: "CRM built for a rising logistics and beverage distribution firm in Ibiza: route planning, customer records, order intake, collections, stock and invoicing. A field app for a phone in a van, an admin desk for the office.",
    href: "https://speed-ibiza.vercel.app",
  },
  {
    id: "project-outflow", name: "Outflow", category: "Music & education",
    description: "A DJ school and sound rental house in Buenos Aires. Courses, equipment and bookings, in Spanish, for a business that lives on its reputation.",
    href: "https://www.outflow.com.ar",
  },
];

export const EXPERIMENTS = [
  { id: "sniper", name: "Solana Sniper", tag: "Rust · Open source", text: "A Rust service that subscribes to Raydium logs, filters initialize2 events, pulls the mint out of the transaction and fetches its metadata before the token is listed anywhere useful. It also profiles holder distribution, which is the cheapest way to tell a launch from a rug.", href: "https://github.com/JulianIrigoyen/solana-sniper" },
  { id: "imho", name: "IMHO", tag: "Real estate · Search", text: "AI real-estate search for Argentina. Scrapers behind rotating proxies feed a natural-language pipeline where a second judge model scores every extraction before it is allowed to count. A WhatsApp agent turns free-form Spanish into structured queries. The Python backend was rewritten in TypeScript at a quarter of the size, and that cut is the part I would defend.", href: "https://imho-real-estate.vercel.app" },
  { id: "pushy", name: "Pushy", tag: "Rust · Notifications", text: "A notification system built for crypto exchanges. Rust and Axum at the front, a background worker behind it, Postgres and Redis underneath, SQS for the queue and Contentful for the templates, so marketing ships copy without waiting on a deploy.", href: null },
  { id: "hermes", name: "Hermes Thrice", tag: "Music · Audio · Visuals", text: "Hermes Thrice Worlds brings together the musical, audio, and visual tools I build for my own creative process.", href: null },
];
