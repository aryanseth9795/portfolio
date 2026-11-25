"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMode } from "@/components/mode/ModeProvider";
import { useCopy, type ModeCopy } from "@/lib/copy";
import { motionSet } from "@/lib/animations";

interface SectionHeadingProps {
  /** A key into copy.sections — never a literal title string. */
  section: keyof ModeCopy["sections"];
  align?: "left" | "center";
}

const GLYPHS = "▓▒░<>/\\|#%&$*+=?ΣΔΛΞ0123456789";

/**
 * Iron Man "target lock": the title decodes from scrambled glyphs, left to
 * right, while corner brackets close in around it. One effect, reused on every
 * section heading, so the mode reads as one system.
 */
function DecodeText({ text, run }: { text: string; run: boolean }) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const total = 22; // frames at ~35ms ≈ 0.77s
    const id = window.setInterval(() => {
      frame++;
      const settled = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) =>
            ch === " " || i < settled
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setOut(text);
      }
    }, 35);
    return () => window.clearInterval(id);
  }, [run, text]);

  return <span aria-hidden="true">{out}</span>;
}

const corner = (pos: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  width: 14,
  height: 14,
  borderColor: "var(--accent-3)",
  borderStyle: "solid",
  borderWidth: 0,
  ...pos,
});

export default function SectionHeading({
  section,
  align = "left",
}: SectionHeadingProps) {
  const { mode, reducedMotion } = useMode();
  const copy = useCopy();
  const { eyebrow, title, subtitle } = copy.sections[section];
  const variants = motionSet(mode).heading;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(titleRef, { once: true, margin: "-80px" });
  const lock = mode === "ironman" && !reducedMotion;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{
        marginBottom: 56,
        textAlign: align,
        maxWidth: align === "center" ? 640 : undefined,
        marginInline: align === "center" ? "auto" : undefined,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        {eyebrow}
      </div>

      <h2
        ref={titleRef}
        aria-label={lock ? title : undefined}
        style={{
          fontSize: "var(--title-size)",
          position: "relative",
          display: "inline-block",
        }}
      >
        {lock ? <DecodeText text={title} run={inView} /> : title}

        {/* Lock brackets — close in from wide, then settle and fade back. */}
        {lock && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.25 }}
            animate={
              inView
                ? { opacity: [0, 1, 1, 0.35], scale: [1.25, 1, 1, 1] }
                : {}
            }
            transition={{ duration: 1.4, times: [0, 0.35, 0.7, 1], ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: "-10px -16px",
              pointerEvents: "none",
            }}
          >
            <span style={corner({ top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 })} />
            <span style={corner({ top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 })} />
            <span style={corner({ bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 })} />
            <span style={corner({ bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 })} />
          </motion.span>
        )}
      </h2>

      <div
        aria-hidden="true"
        style={{
          height: 1,
          width: 64,
          marginTop: 20,
          marginInline: align === "center" ? "auto" : undefined,
          background: "linear-gradient(90deg, var(--accent), transparent)",
        }}
      />

      {subtitle && (
        <p
          style={{
            marginTop: 20,
            marginBottom: 0,
            color: "var(--text-dim)",
            fontSize: "var(--step-1)",
            maxWidth: "42ch",
            marginInline: align === "center" ? "auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
