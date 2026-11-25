"use client";

import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { useMode } from "@/components/mode/ModeProvider";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  download?: boolean;
  external?: boolean;
  className?: string;
}

/**
 * Magnetism (cursor-following translate) is an Iron Man behavior only — in
 * default mode the button is still and precise, which is the point of that
 * mode. Disabled under reduced motion in both.
 */
export default function Button({
  children,
  href,
  onClick,
  variant = "ghost",
  download = false,
  external = false,
  className = "",
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const { mode, reducedMotion } = useMode();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const magnetic = mode === "ironman" && !reducedMotion;

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.25,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.25,
    });
  };

  const isPrimary = variant === "primary";

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    padding: "13px 24px",
    borderRadius: "var(--radius)",
    fontFamily: "var(--font-ui-active)",
    fontSize: "var(--ui-size)",
    fontWeight: "var(--ui-weight)" as React.CSSProperties["fontWeight"],
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: isPrimary ? "1px solid transparent" : "1px solid var(--border-strong)",
    // The primary fill lives in .btn-primary: framer-motion can't resolve a
    // gradient through a CSS variable in an inline background.
    background: isPrimary ? undefined : "transparent",
    color: isPrimary ? "var(--accent-contrast)" : "var(--text)",
    boxShadow: isPrimary ? "var(--glow)" : "none",
    transition: "background 0.25s, border-color 0.25s, color 0.25s",
  };

  const motionProps = {
    ref: ref as React.Ref<never>,
    style,
    className: [isPrimary ? "btn-primary" : "", className].filter(Boolean).join(" ") || undefined,
    onMouseMove: onMove,
    onMouseLeave: () => setOffset({ x: 0, y: 0 }),
    animate: { x: offset.x, y: offset.y },
    transition: { type: "spring" as const, stiffness: 260, damping: 18 },
    whileHover: { scale: reducedMotion ? 1 : 1.02 },
    whileTap: { scale: 0.98 },
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} type="button" onClick={onClick}>
      {children}
    </motion.button>
  );
}
