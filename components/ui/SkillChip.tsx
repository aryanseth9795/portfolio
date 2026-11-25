"use client";

import { useState } from "react";
import { skillIcons, displayHex } from "@/lib/skillIcons";
import SkillIcon from "./SkillIcon";

/**
 * Styled inline rather than via a class. The chips are the densest layout on
 * the page and must not depend on a stylesheet chunk arriving — a stale CSS
 * build collapsed them once already.
 */
export default function SkillChip({
  name,
  onActive,
}: {
  name: string;
  /** Called with the name on hover/focus and null on leave/blur. */
  onActive?: (name: string | null) => void;
}) {
  const [hover, setHover] = useState(false);
  const on = () => {
    setHover(true);
    onActive?.(name);
  };
  const off = () => {
    setHover(false);
    onActive?.(null);
  };
  const icon = skillIcons[name];
  const color = icon ? displayHex(icon.hex) : "var(--accent)";

  return (
    <span
      onMouseEnter={on}
      onMouseLeave={off}
      onFocus={onActive ? on : undefined}
      onBlur={onActive ? off : undefined}
      tabIndex={onActive ? 0 : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 11px",
        fontFamily: "var(--font-mono-active)",
        fontSize: "0.74rem",
        lineHeight: 1,
        letterSpacing: "0.02em",
        borderRadius: "calc(var(--radius) / 2)",
        border: `1px solid ${hover ? "var(--border-strong)" : "var(--border)"}`,
        background: hover ? "var(--surface-hover)" : "transparent",
        color: hover ? "var(--text)" : "var(--text-dim)",
        whiteSpace: "nowrap",
        transition:
          "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          color,
          transition: "color 0.2s ease",
        }}
      >
        <SkillIcon name={name} />
      </span>
      {name}
    </span>
  );
}
