"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMode } from "@/components/mode/ModeProvider";
import { useCopy } from "@/lib/copy";
import ArcReactor from "./ArcReactor";

/**
 * The loudest element in default mode, on purpose. Everything around it stays
 * quiet so this reads as the one thing worth touching.
 */
export default function ModeToggle() {
  const { mode, isTransitioning, toggle, reducedMotion } = useMode();
  const copy = useCopy();
  const [hovered, setHovered] = useState(false);

  const isIronMan = mode === "ironman";
  const label = isIronMan ? copy.toggle.exit : copy.toggle.enter;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={isTransitioning}
      aria-pressed={isIronMan}
      aria-label={label}
      title={copy.toggle.hint}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "7px 15px 7px 9px",
        borderRadius: 999,
        border: "1px solid var(--border-strong)",
        background: "var(--surface)",
        color: "var(--text)",
        cursor: isTransitioning ? "wait" : "pointer",
        opacity: isTransitioning ? 0.6 : 1,
        overflow: "hidden",
        fontFamily: "var(--font-ui-active)",
        fontWeight: "var(--ui-weight)" as React.CSSProperties["fontWeight"],
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        transition: "border-color 0.3s, background 0.3s",
      }}
    >
      {/* Warm bleed on hover — the reactor "warming up" behind the glass */}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 50%, rgba(255, 215, 0, 0.22), rgba(230, 36, 41, 0.1) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.span
        aria-hidden="true"
        style={{ display: "inline-flex", position: "relative" }}
        animate={
          reducedMotion
            ? undefined
            : { scale: hovered ? 1.1 : [1, 1.06, 1] }
        }
        transition={
          hovered
            ? { duration: 0.3 }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ArcReactor
          size={20}
          intensity={hovered || isIronMan ? 1 : 0.65}
          spinning={hovered && !reducedMotion}
        />
      </motion.span>

      <span style={{ position: "relative" }}>{label}</span>
    </motion.button>
  );
}
