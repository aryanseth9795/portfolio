"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { useCopy } from "@/lib/copy";
import { useMode } from "@/components/mode/ModeProvider";
import { letterAnimation, fadeInUp } from "@/lib/animations";
import TerminalText from "@/components/ui/TerminalText";
import Button from "@/components/ui/Button";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: "2px solid var(--accent)",
          borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  ),
});

const bootLines = [
  "INITIALIZING STARK.OS v4.7.1 ...",
  "LOADING ARC REACTOR CORE ...........",
  "J.A.R.V.I.S. NEURAL LINK .... ONLINE",
  "SYSTEM STATUS: ALL SYSTEMS NOMINAL",
];

/**
 * Module-level, so toggling back and forth within a session does not replay the
 * boot every time. Resets on a full page load, which is when it earns its place.
 */
let bootPlayed = false;

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= bootLines.length) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }

    const line = bootLines[currentLine];
    if (currentChar < line.length) {
      const timer = setTimeout(() => setCurrentChar((c) => c + 1), 22);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setLines((prev) => [...prev, line]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 180);
    return () => clearTimeout(timer);
  }, [currentLine, currentChar, onComplete]);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--bg)" }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
    >
      <div
        className="mono"
        style={{ maxWidth: 520, width: "100%", padding: "0 32px", fontSize: 13 }}
      >
        <div style={{ position: "relative", padding: 24 }}>
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 22,
              height: 22,
              borderTop: "1px solid var(--accent)",
              borderLeft: "1px solid var(--accent)",
              opacity: 0.5,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderBottom: "1px solid var(--accent-2)",
              borderRight: "1px solid var(--accent-2)",
              opacity: 0.5,
            }}
          />

          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                marginBottom: 4,
                color: "var(--accent-3, var(--accent))",
                opacity: 0.6,
              }}
            >
              <span style={{ color: "var(--accent)", opacity: 0.5 }}>
                [{String(i + 1).padStart(2, "0")}]{" "}
              </span>
              {line}
              <span style={{ color: "var(--accent)" }}> ✓</span>
            </div>
          ))}

          {currentLine < bootLines.length && (
            <div style={{ color: "var(--accent-3, var(--accent))" }}>
              <span style={{ color: "var(--accent)", opacity: 0.5 }}>
                [{String(currentLine + 1).padStart(2, "0")}]{" "}
              </span>
              {bootLines[currentLine].substring(0, currentChar)}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 14,
                    marginLeft: 1,
                    verticalAlign: "middle",
                    background: "var(--accent-3, var(--accent))",
                  }}
                />
              )}
            </div>
          )}

          <div
            style={{
              marginTop: 24,
              height: 2,
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(79, 195, 247, 0.1)",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, var(--accent-3, var(--accent)), var(--accent))",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${(currentLine / bootLines.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroIronMan() {
  const copy = useCopy();
  const { reducedMotion, isTransitioning } = useMode();
  // When the hero mounts mid suit-up, SuitUpSequence is already the boot —
  // playing this one too stacked a second boot under the overlay.
  const [booted, setBooted] = useState(
    () => bootPlayed || reducedMotion || isTransitioning,
  );
  // Split by word, not by character. Each word is its own nowrap box, so the
  // line can only break in the gaps — a per-character map lets the browser
  // break mid-word ("ARYAN SET / H").
  const nameWords = personalInfo.name.split(" ");
  const wordStart = nameWords.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + nameWords[i - 1].length);
    return acc;
  }, []);

  const [locked, setLocked] = useState(false);

  const handleBooted = () => {
    bootPlayed = true;
    setBooted(true);
  };

  // reducedMotion resolves after mount, so the initializer above can miss it.
  useEffect(() => {
    if (reducedMotion && !booted) handleBooted();
  }, [reducedMotion, booted]);

  const socials = [
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSequence onComplete={handleBooted} />}
      </AnimatePresence>

      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          paddingTop: 100,
          overflow: "hidden",
        }}
      >
        <div className="absolute inset-0 grid-bg" aria-hidden="true" />

        <div
          className="container relative z-10 flex flex-col lg:flex-row items-center"
          style={{ gap: 32 }}
        >
          {/* min-w-0: without it a wide child (the identity plate) sets the
              column's min-content width and pushes the hero past a phone screen. */}
          <div className="flex-1 min-w-0 w-full text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{ marginBottom: 18 }}
            >
              <span
                className="mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 13px",
                  borderRadius: 999,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(79, 195, 247, 0.3)",
                  background: "rgba(79, 195, 247, 0.08)",
                  color: "var(--accent-3, var(--accent))",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--accent-3, var(--accent))",
                    animation: "arc-pulse 2s ease-in-out infinite",
                  }}
                />
                {copy.hero.status}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mono"
              style={{
                margin: "0 0 14px",
                fontSize: "0.78rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              ◆ {copy.hero.lead}
            </motion.p>

            <h1
              style={{
                fontSize: "var(--step-4)",
                margin: "0 0 18px",
                lineHeight: 1.03,
              }}
            >
              {nameWords.map((word, wi) => {
                const gilded = wi === 0;
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      marginRight: wi < nameWords.length - 1 ? "0.28em" : 0,
                    }}
                  >
                    {word.split("").map((char, ci) => {
                      const i = wordStart[wi] + ci;
                      return (
                        <motion.span
                          key={ci}
                          custom={i}
                          variants={letterAnimation}
                          initial="hidden"
                          animate={booted ? "visible" : "hidden"}
                          style={{
                            display: "inline-block",
                            background: gilded ? "var(--gold-metal)" : undefined,
                            WebkitBackgroundClip: gilded ? "text" : undefined,
                            WebkitTextFillColor: gilded
                              ? "transparent"
                              : "var(--text)",
                            backgroundClip: gilded ? "text" : undefined,
                          }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                );
              })}
            </h1>

            {/* The equation the whole mode is built on. */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={4}
              className="mono"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                padding: "9px 16px 9px 14px",
                marginBottom: 24,
                overflow: "hidden",
                border: "1px solid rgba(255, 215, 0, 0.28)",
                borderLeft: "2px solid var(--accent)",
                background:
                  "linear-gradient(90deg, rgba(255,215,0,0.12), rgba(230,36,41,0.07) 55%, transparent)",
                maxWidth: "100%",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {/* Scan sweep — the plate reading him. */}
              {!reducedMotion && (
                <motion.span
                  aria-hidden="true"
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    repeatDelay: 2.6,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: 60,
                    background:
                      "linear-gradient(90deg, transparent, rgba(79,195,247,0.28), transparent)",
                    pointerEvents: "none",
                  }}
                />
              )}

              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent-3, var(--accent))",
                  boxShadow: "0 0 8px var(--accent-3, var(--accent))",
                  animation: "arc-pulse 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "var(--text-dim)", position: "relative" }}>
                Identity confirmed
              </span>
              <span
                aria-hidden="true"
                style={{ color: "var(--text-dim)", position: "relative" }}
              >
                ·
              </span>
              <strong
                className="gold-text"
                style={{
                  position: "relative",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                }}
              >
                {personalInfo.title}
              </strong>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={5}
              style={{ fontSize: "var(--step-1)", marginBottom: 22 }}
            >
              <TerminalText texts={personalInfo.roles} prefix="J.A.R.V.I.S. >" />
            </motion.div>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={7}
              className="mx-auto lg:mx-0"
              style={{
                marginTop: 0,
                marginBottom: 8,
                maxWidth: "44ch",
                color: "var(--text-dim)",
                fontSize: "var(--step-1)",
              }}
            >
              {copy.hero.tagline}
            </motion.p>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={8}
              className="mx-auto lg:mx-0"
              style={{
                marginTop: 0,
                marginBottom: 32,
                maxWidth: "44ch",
                color: "var(--text-dim)",
                fontSize: "var(--step-0)",
              }}
            >
              {copy.hero.current}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={9}
              className="flex flex-wrap justify-center lg:justify-start"
              style={{ gap: 14, marginBottom: 32 }}
            >
              {/* Hovering the primary CTA locks the emblem's reticle onto it. */}
              <span
                onMouseEnter={() => setLocked(true)}
                onMouseLeave={() => setLocked(false)}
                onFocus={() => setLocked(true)}
                onBlur={() => setLocked(false)}
                style={{ display: "inline-flex" }}
              >
                <Button
                  variant="primary"
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {copy.hero.ctaPrimary} <ArrowDown size={15} />
                </Button>
              </span>
              <Button href={personalInfo.resumeUrl} download>
                <Download size={15} /> {copy.hero.ctaSecondary}
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={booted ? "visible" : "hidden"}
              custom={11}
              className="flex justify-center lg:justify-start"
              style={{ gap: 14 }}
            >
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--border)",
                    color: "var(--text-dim)",
                  }}
                  whileHover={{
                    scale: 1.12,
                    borderColor: "var(--border-strong)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={booted ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex-1 w-full hidden sm:block"
            style={{ height: "min(60vh, 560px)" }}
          >
            <HeroScene locked={locked} />
          </motion.div>
        </div>
      </section>
    </>
  );
}
