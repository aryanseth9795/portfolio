"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { personalInfo, skills, experiences, stats } from "@/lib/data";
import { useCopy } from "@/lib/copy";
import { useMode } from "@/components/mode/ModeProvider";
import Button from "@/components/ui/Button";

const stack = Object.values(skills).flat();

function Ticker() {
  const { reducedMotion } = useMode();
  const items = [...stack, ...stack]; // duplicated so the loop is seamless

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
        borderTop: "1px solid var(--border)",
        padding: "12px 0",
        maskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          width: "max-content",
          animation: reducedMotion ? undefined : "marquee 44s linear infinite",
        }}
      >
        {items.map((tech, i) => (
          <span
            key={i}
            className="mono"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              whiteSpace: "nowrap",
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The right column. Real content from lib/data — it balances the composition
 *  by saying something, not by filling space. */
function CurrentlyCard() {
  const role = experiences[0];
  const headline = stats.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        background: "var(--surface)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: 26,
      }}
    >
      <div
        className="mono"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.66rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
          }}
        />
        Currently
      </div>

      <h2
        style={{
          fontSize: "var(--step-1)",
          margin: "0 0 6px",
          lineHeight: 1.25,
        }}
      >
        {role.role}
      </h2>
      <p style={{ margin: "0 0 4px", color: "var(--text)", fontSize: "0.92rem" }}>
        {role.company}
      </p>
      <p
        className="mono"
        style={{
          margin: 0,
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          color: "var(--text-dim)",
        }}
      >
        {role.period} · {role.location}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          margin: "20px 0",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
        }}
      >
        {role.tags.map((tag) => (
          <span
            key={tag}
            className="mono"
            style={{
              fontSize: "0.66rem",
              letterSpacing: "0.06em",
              padding: "3px 8px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
        }}
      >
        {headline.map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontFamily: "var(--font-display-active)",
                fontSize: "var(--step-2)",
                lineHeight: 1,
                color: "var(--text)",
              }}
            >
              {stat.value}
              <span style={{ color: "var(--accent)" }}>{stat.suffix}</span>
            </div>
            <div
              className="mono"
              style={{
                marginTop: 6,
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                lineHeight: 1.4,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HeroDefault() {
  const copy = useCopy();

  const socials = [
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        paddingTop: 96,
        paddingBottom: 72,
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div className="hero-grid">
          {/* ─── Left ─── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px #4ade80",
                  animation: "arc-pulse 2.4s ease-in-out infinite",
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                }}
              >
                {copy.hero.status}
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 1,
                  height: 12,
                  background: "var(--border-strong)",
                  margin: "0 2px",
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                {copy.hero.lead}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(2.4rem, 4.6vw, 4.1rem)",
                lineHeight: 1.02,
                margin: 0,
                textWrap: "balance",
              }}
            >
              {copy.hero.headline}{" "}
              <span className="accent-serif">{copy.hero.headlineAccent}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              style={{ marginTop: 26, maxWidth: "44ch" }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--step-1)",
                  color: "var(--text)",
                  lineHeight: 1.5,
                }}
              >
                {copy.hero.tagline}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "var(--step-0)",
                  color: "var(--text-dim)",
                }}
              >
                {copy.hero.current}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 32,
              }}
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
              <Button href={personalInfo.resumeUrl} download>
                <Download size={15} /> {copy.hero.ctaSecondary}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                display: "flex",
                gap: 20,
                marginTop: 30,
                alignItems: "center",
              }}
            >
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ color: "var(--text-dim)", display: "inline-flex" }}
                >
                  <Icon size={18} />
                </a>
              ))}
              <span
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(90deg, var(--border), transparent)",
                  maxWidth: 160,
                }}
              />
            </motion.div>
          </div>

          {/* ─── Right ─── */}
          <CurrentlyCard />
        </div>
      </div>

      <Ticker />
    </section>
  );
}
