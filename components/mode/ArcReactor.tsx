"use client";

import { motion } from "framer-motion";

interface ArcReactorProps {
  size?: number;
  /** 0..1 glow strength. */
  intensity?: number;
  spinning?: boolean;
  className?: string;
}

/**
 * ECMAScript leaves Math.cos/Math.sin precision implementation-defined, so
 * Node and the browser can disagree in the last ULP — enough for React to
 * report a hydration mismatch on the rendered attribute string. Rounding to
 * three decimals (well clear of any boundary for these ten angles) makes both
 * sides emit identical markup. Computed once, since the geometry is constant.
 */
const SPOKES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const at = (r: number) => Math.round((50 + Math.cos(angle) * r) * 1000) / 1000;
  const on = (r: number) => Math.round((50 + Math.sin(angle) * r) * 1000) / 1000;
  return { x1: at(27), y1: on(27), x2: at(35), y2: on(35) };
});

/**
 * The signature element.
 *
 * Sits dormant and humming inside the mode toggle in default mode, and ignites
 * at full scale during the suit-up sequence. Same object, two states — which is
 * why it takes intensity rather than reading the mode itself.
 */
export default function ArcReactor({
  size = 64,
  intensity = 1,
  spinning = false,
  className = "",
}: ArcReactorProps) {
  const arc = "var(--accent-3, var(--accent))";

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={{
        filter: `drop-shadow(0 0 ${6 * intensity}px rgba(79, 195, 247, ${0.7 * intensity}))`,
        overflow: "visible",
      }}
      animate={spinning ? { rotate: 360 } : { rotate: 0 }}
      transition={
        spinning
          ? { duration: 6, repeat: Infinity, ease: "linear" }
          : { duration: 0.4 }
      }
    >
      {/* Outer housing */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={arc}
        strokeWidth="1.5"
        opacity={0.35 * intensity}
      />
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke={arc}
        strokeWidth="0.8"
        opacity={0.25 * intensity}
        strokeDasharray="4 6"
      />

      {/* Coil segments — ten around the ring */}
      {SPOKES.map(({ x1, y1, x2, y2 }, i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={arc}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.55 * intensity}
        />
      ))}

      {/* Inner ring */}
      <circle
        cx="50"
        cy="50"
        r="22"
        stroke={arc}
        strokeWidth="2"
        opacity={0.8 * intensity}
      />

      {/* The triangular core */}
      <path
        d="M50 34 L64 58 L36 58 Z"
        fill={arc}
        opacity={0.9 * intensity}
        style={{
          filter: `drop-shadow(0 0 ${5 * intensity}px ${arc})`,
        }}
      />
      <circle cx="50" cy="50" r="9" fill="#ffffff" opacity={0.85 * intensity} />
    </motion.svg>
  );
}
