"use client";

import AmbientBackground from "@/components/bg/AmbientBackground";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Footer from "@/components/ui/Footer";
import SuitUpSequence from "@/components/mode/SuitUpSequence";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <AmbientBackground />

      <Navbar />
      <ScrollProgress />

      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />

      {/* Last, so the transition overlay stacks above everything. */}
      <SuitUpSequence />
    </>
  );
}
