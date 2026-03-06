"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { letterAnimation, fadeInUp } from "@/lib/animations";
import TerminalText from "@/components/ui/TerminalText";
import MagneticButton from "@/components/ui/MagneticButton";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin"
        style={{
          borderColor: "var(--accent-blue)",
          borderTopColor: "transparent",
        }}
      />
    </div>
  ),
});

export default function Hero() {
  const nameChars = personalInfo.name.split("");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: 80 }}
    >
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div
        className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 px-6"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Text side */}
        <div className="flex-1 text-center lg:text-left">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] mb-4"
            style={{
              color: "var(--accent-blue)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Hey, I&apos;m
          </motion.p>

          {/* Name — letter by letter */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-none"
            style={{
              fontFamily: "var(--font-display)",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {nameChars.map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterAnimation}
                initial="hidden"
                animate="visible"
                className={char === " " ? "inline-block w-4" : "inline-block"}
                style={{
                  background: i < 5 ? "var(--gradient-main)" : undefined,
                  WebkitBackgroundClip: i < 5 ? "text" : undefined,
                  WebkitTextFillColor:
                    i < 5 ? "transparent" : "var(--text-primary)",
                  backgroundClip: i < 5 ? "text" : undefined,
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          {/* Typing role */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="text-lg md:text-xl mb-6"
          >
            <TerminalText texts={personalInfo.roles} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={7}
            className="text-base md:text-lg max-w-xl mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Building production-grade AI-powered applications.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={8}
            className="text-sm md:text-base max-w-xl mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Currently @ UltraTech Cement (Aditya Birla Group).
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={9}
            className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start"
          >
            <MagneticButton
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                background: "var(--gradient-main)",
                border: "none",
                color: "#050508",
                fontWeight: 700,
              }}
            >
              View My Work <ArrowDown size={16} />
            </MagneticButton>
            <MagneticButton href={personalInfo.resumeUrl} download>
              <Download size={16} /> Download Resume
            </MagneticButton>
          </motion.div>

          {/* Social */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={11}
            className="flex gap-4 justify-center lg:justify-start"
          >
            {[
              { icon: Github, href: personalInfo.github, label: "GitHub" },
              {
                icon: Linkedin,
                href: personalInfo.linkedin,
                label: "LinkedIn",
              },
              {
                icon: Mail,
                href: `mailto:${personalInfo.email}`,
                label: "Email",
              },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid rgba(0, 212, 255, 0.2)",
                  color: "var(--text-muted)",
                  transition: "all 0.3s",
                }}
                whileHover={{
                  scale: 1.15,
                  borderColor: "rgba(0, 212, 255, 0.6)",
                  color: "#00d4ff",
                  boxShadow: "0 0 15px rgba(0, 212, 255, 0.3)",
                }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-1 w-full h-[400px] md:h-[500px] lg:h-[600px] hidden sm:block"
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown
          size={20}
          style={{ color: "var(--accent-blue)", opacity: 0.6 }}
        />
      </motion.div>
    </section>
  );
}
