"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMode } from "@/components/mode/ModeProvider";
import { motionSet } from "@/lib/animations";

interface RevealProps {
  children: ReactNode;
  /** Seconds of delay before this element animates. */
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}

/**
 * The single scroll-reveal wrapper. Sections use this instead of hand-rolling
 * initial/whileInView pairs, so reveal behavior stays consistent and changes
 * with the mode.
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: RevealProps) {
  const { mode } = useMode();
  const variants = motionSet(mode).reveal;

  const Tag =
    as === "li" ? motion.li : as === "section" ? motion.section : motion.div;

  return (
    <Tag
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Tag>
  );
}
