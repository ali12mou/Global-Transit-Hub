import { Navbar } from "../components/layout/Navbar";
import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Regions } from "../components/sections/Regions";
import { Business } from "../components/sections/Business";
import { Clients } from "../components/sections/Clients";
import { Partners } from "../components/sections/Partners";
import { Projects } from "../components/sections/Projects";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Regions />
      <Business />
      <Partners />
      <Clients />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}