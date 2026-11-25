"use client";

import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  /** Renders in the accent color instead of the muted default. */
  accent?: boolean;
}

export default function Tag({ children, accent = false }: TagProps) {
  return (
    <span
      className="mono"
      style={{
        display: "inline-block",
        padding: "3px 9px",
        fontSize: "0.7rem",
        letterSpacing: "0.06em",
        borderRadius: "calc(var(--radius) / 2)",
        border: `1px solid ${accent ? "var(--border-strong)" : "var(--border)"}`,
        background: accent ? "var(--accent-soft)" : "transparent",
        color: accent ? "var(--accent)" : "var(--text-dim)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
