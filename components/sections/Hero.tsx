"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { letterAnimation, fadeInUp } from "@/lib/animations";
import TerminalText from "@/components/ui/TerminalText";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroScene from "@/components/3d/HeroScene";


const bootLines = [
  "INITIALIZING STARK.OS v4.7.1 ...",
  "LOADING ARC REACTOR CORE ...........",
  "J.A.R.V.I.S. NEURAL LINK .... ONLINE",
  "SYSTEM STATUS: ALL SYSTEMS NOMINAL",
];

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= bootLines.length) {
      setTimeout(onComplete, 600);
      return;
    }

    const line = bootLines[currentLine];
    if (currentChar < line.length) {
      const speed = line[currentChar] === "." ? 30 : 25;
      const timer = setTimeout(() => setCurrentChar((c) => c + 1), speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, line]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div
        className="max-w-lg w-full px-8"
        style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
      >
        {/* Corner brackets */}
        <div className="relative p-6">
          <div
            className="absolute top-0 left-0 w-6 h-6"
            style={{
              borderTop: "1px solid var(--accent-gold)",
              borderLeft: "1px solid var(--accent-gold)",
              opacity: 0.5,
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6"
            style={{
              borderBottom: "1px solid var(--accent-red)",
              borderRight: "1px solid var(--accent-red)",
              opacity: 0.5,
            }}
          />

          {/* Completed lines */}
          {lines.map((line, i) => (
            <div key={i} className="mb-1" style={{ color: "var(--accent-arc)", opacity: 0.6 }}>
              <span style={{ color: "var(--accent-gold)", opacity: 0.5 }}>
                [{String(i + 1).padStart(2, "0")}]{" "}
              </span>
              {line}
              <span style={{ color: "var(--accent-gold)" }}> ✓</span>
            </div>
          ))}

          {/* Current typing line */}
          {currentLine < bootLines.length && (
            <div style={{ color: "var(--accent-arc)" }}>
              <span style={{ color: "var(--accent-gold)", opacity: 0.5 }}>
                [{String(currentLine + 1).padStart(2, "0")}]{" "}
              </span>
              {bootLines[currentLine].substring(0, currentChar)}
              {showCursor && (
                <span
                  className="inline-block w-[7px] h-[14px] ml-[1px] align-middle"
                  style={{ background: "var(--accent-arc)" }}
                />
              )}
            </div>
          )}

          {/* Progress bar */}
          <div
            className="mt-6 h-[2px] rounded-full overflow-hidden"
            style={{ background: "rgba(79, 195, 247, 0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-arc)" }}
              initial={{ width: "0%" }}
              animate={{
                width: `${(currentLine / bootLines.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [booted, setBooted] = useState(false);
  const nameChars = personalInfo.name.split("");

  return (
    <>
      {/* Boot Sequence */}
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

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
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 flex justify-center lg:justify-start"
            >
              <span className="status-badge">System Online</span>
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{
                color: "var(--accent-gold)",
                fontFamily: "var(--font-mono)",
              }}
            >
              ◆ Designation
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
                  animate={booted ? "visible" : "hidden"}
                  className={char === " " ? "inline-block w-4" : "inline-block"}
                  style={{
                    background:
                      i < 5 ? "var(--gradient-main)" : undefined,
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
              animate={booted ? "visible" : "hidden"}
              custom={5}
              className="text-lg md:text-xl mb-6"
            >
              <TerminalText texts={personalInfo.roles} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={7}
              className="text-base md:text-lg max-w-xl mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Engineering the future, one deploy at a time.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={8}
              className="text-sm md:text-base max-w-xl mb-8"
              style={{ color: "var(--text-muted)" }}
            >
              Currently deployed @{" "}
              <span className="gradient-text font-semibold">
                UltraTech Cement (Aditya Birla Group)
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
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
                  color: "#0a0a0f",
                  fontWeight: 700,
                }}
              >
                Deploy Projects <ArrowDown size={16} />
              </MagneticButton>
              <MagneticButton href={personalInfo.resumeUrl} download>
                <Download size={16} /> Download Dossier
              </MagneticButton>
            </motion.div>

            {/* Social */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
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
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    color: "var(--text-muted)",
                    transition: "all 0.3s",
                  }}
                  whileHover={{
                    scale: 1.15,
                    borderColor: "rgba(255, 215, 0, 0.6)",
                    color: "#ffd700",
                    boxShadow:
                      "0 0 15px rgba(255, 215, 0, 0.3), 0 0 30px rgba(230, 36, 41, 0.15)",
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Iron Man Suit Build Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={booted ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-1 w-full h-[400px] md:h-[500px] lg:h-[600px] hidden sm:block"
          >
            <HeroScene />
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
            style={{ color: "var(--accent-gold)", opacity: 0.6 }}
          />
        </motion.div>
      </section>
    </>
  );
}
