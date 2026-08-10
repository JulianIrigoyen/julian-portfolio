import Hero from "./sections/Hero";
import Systems from "./sections/Systems";
import Fleet from "./sections/Fleet";
import Career from "./sections/Career";
import Contact from "./sections/Contact";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Systems />
      <Fleet />
      <Career />
      <Contact />
    </main>
  );
}
