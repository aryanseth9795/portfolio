"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useMode } from "@/components/mode/ModeProvider";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  /** Seconds. */
  duration?: number;
}

const R = 52;
const CIRC = 2 * Math.PI * R;
const TICKS = Array.from({ length: 36 }, (_, i) => i * 10);

/**
 * Default mode: a plain counter. Iron Man mode: the same counter inside a
 * radial gauge whose arc sweeps up in step with the count — the ring tracks
 * the count-up, it does not claim a proficiency score.
 */
export default function StatCounter({
  value,
  suffix = "",
  label,
  duration = 1.6,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { mode, reducedMotion } = useMode();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setShown(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // Ease-out cubic: fast start, gentle settle.
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reducedMotion]);

  const number = (
    <div
      style={{
        fontFamily: "var(--font-display-active)",
        // Inside the gauge the number must fit a 104px ring.
        fontSize:
          mode === "ironman"
            ? `${String(value).length + suffix.length >= 4 ? 1.3 : 1.75}rem`
            : "var(--step-3)",
        fontWeight: "var(--heading-weight)",
        letterSpacing: "var(--heading-tracking)",
        color: "var(--text)",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {shown}
      <span style={{ color: "var(--accent)" }}>{suffix}</span>
    </div>
  );

  const caption = (
    <div
      className="mono"
      style={{
        marginTop: mode === "ironman" ? 12 : 8,
        fontSize: "0.72rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--text-dim)",
        textAlign: mode === "ironman" ? "center" : undefined,
      }}
    >
      {label}
    </div>
  );

  if (mode !== "ironman") {
    return (
      <div ref={ref}>
        {number}
        {caption}
      </div>
    );
  }

  const progress = value === 0 ? 1 : shown / value;
  const gradId = `gauge-${label.replace(/\W+/g, "-")}`;

  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "relative", width: 128, height: 128 }}>
        <svg
          viewBox="0 0 128 128"
          width={128}
          height={128}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent-3)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          {TICKS.map((deg) => (
            <line
              key={deg}
              x1={64}
              y1={3}
              x2={64}
              y2={deg % 90 === 0 ? 9 : 6}
              stroke="var(--accent)"
              strokeOpacity={deg % 90 === 0 ? 0.6 : 0.22}
              transform={`rotate(${deg} 64 64)`}
            />
          ))}
          <circle
            cx={64}
            cy={64}
            r={R}
            fill="none"
            stroke="var(--border)"
            strokeWidth={4}
          />
          <circle
            cx={64}
            cy={64}
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            transform="rotate(-90 64 64)"
            style={{ filter: "drop-shadow(0 0 4px rgba(79,195,247,0.5))" }}
          />
          <circle
            cx={64}
            cy={64}
            r={40}
            fill="none"
            stroke="var(--accent-3)"
            strokeOpacity={0.15}
            strokeDasharray="1 4"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          {number}
        </div>
      </div>
      {caption}
    </div>
  );
}
