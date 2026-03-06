"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      {/* Global 3D background */}
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      {/* Navbar + scroll progress */}
      <Navbar />
      <ScrollProgress />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
