"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  glowColor?: string;
}

export default function GlassCard({
  children,
  className = "",
  style = {},
  hover = true,
  glowColor,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${hover ? "glass-hover gradient-border" : ""} ${className}`}
      style={{
        padding: "24px",
        ...style,
        ...(glowColor ? ({ "--glow-color": glowColor } as CSSProperties) : {}),
      }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
