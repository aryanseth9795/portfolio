"use client";

import { skillIcons, monogram } from "@/lib/skillIcons";

interface SkillIconProps {
  name: string;
  size?: number;
}

/**
 * Renders in currentColor by default so the grid stays monochrome and the
 * palette stays disciplined. The brand color appears only on hover, driven by
 * the --brand custom property the chip sets.
 */
export default function SkillIcon({ name, size = 15 }: SkillIconProps) {
  const icon = skillIcons[name];

  if (!icon) {
    return (
      <span
        aria-hidden="true"
        className="mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          fontSize: size * 0.52,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          border: "1px solid currentColor",
          borderRadius: 3,
          opacity: 0.75,
          flexShrink: 0,
        }}
      >
        {monogram(name)}
      </span>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ flexShrink: 0, display: "block" }}
    >
      <path d={icon.path} />
    </svg>
  );
}
