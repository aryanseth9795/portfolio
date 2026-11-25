"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { personalInfo, projects, experiences } from "@/lib/data";
import { useMode } from "@/components/mode/ModeProvider";

/*  ───────────────────────────────────────────────────
    Hero emblem — an original arc-reactor reticle that
    carries the "AS" monogram.

    Assembles ring by ring: outer scale, coil segments
    locking in one at a time, then the core ignites.
    Layers sit at different depths and drift with the
    cursor. When the primary CTA is hovered the outer
    ring tightens and goes red: target locked.

    Client-only (dynamically imported with ssr:false),
    so trig here can't cause hydration mismatches.
    ─────────────────────────────────────────────────── */

const C = 200; // centre of the 400×400 viewBox
const ARC = "var(--accent-3, #4fc3f7)";
const GOLD = "var(--accent, #e8b23a)";
const RED = "var(--accent-2, #c8102e)";

const round = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))] as const;
};

/** One trapezoidal coil segment between two radii and two angles. */
function segmentPath(r1: number, r2: number, a1: number, a2: number) {
  const [x1, y1] = polar(r2, a1);
  const [x2, y2] = polar(r2, a2);
  const [x3, y3] = polar(r1, a2);
  const [x4, y4] = polar(r1, a1);
  return `M${x1} ${y1} A${r2} ${r2} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 0 0 ${x4} ${y4}Z`;
}

/** An open arc of radius r from a1 to a2 degrees. */
function arcPath(r: number, a1: number, a2: number) {
  const [x1, y1] = polar(r, a1);
  const [x2, y2] = polar(r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const COILS = Array.from({ length: 12 }, (_, i) => {
  const start = i * 30 + 3;
  return { d: segmentPath(118, 146, start, start + 24), i };
});

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const deg = i * 6;
  const major = i % 5 === 0;
  const [x1, y1] = polar(major ? 178 : 183, deg);
  const [x2, y2] = polar(190, deg);
  return { x1, y1, x2, y2, major, key: i };
});

/* ─── Readouts ─── */

const readouts = [
  {
    pos: { top: 0, left: 0 },
    align: "left" as const,
    label: "Systems deployed",
    value: String(projects.length).padStart(2, "0"),
  },
  {
    pos: { top: 0, right: 0 },
    align: "right" as const,
    label: "Last mission",
    value: experiences[0].company,
  },
  {
    pos: { bottom: 0, left: 0 },
    align: "left" as const,
    label: "Base",
    value: personalInfo.location.split(",")[0] + ", IN",
  },
  {
    pos: { bottom: 0, right: 0 },
    align: "right" as const,
    label: "Status",
    value: "Open to roles",
    live: true,
  },
];

function Readout({
  r,
  delay,
}: {
  r: (typeof readouts)[number];
  delay: number;
}) {
  const left = r.align === "left";
  return (
    <motion.div
      className="mono"
      initial={{ opacity: 0, x: left ? -14 : 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      style={{
        position: "absolute",
        ...r.pos,
        textAlign: r.align,
        fontSize: 11,
        lineHeight: 1.5,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: left ? "10px 0 10px 14px" : "10px 14px 10px 0",
        borderLeft: left ? `1px solid ${GOLD}` : undefined,
        borderRight: left ? undefined : `1px solid ${GOLD}`,
        maxWidth: 200,
      }}
    >
      <div style={{ color: "var(--text-dim)" }}>{r.label}</div>
      <div
        style={{
          color: r.live ? ARC : "var(--text)",
          display: "flex",
          alignItems: "center",
          gap: 7,
          justifyContent: left ? "flex-start" : "flex-end",
        }}
      >
        {r.live && (
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: ARC,
              boxShadow: `0 0 8px ${ARC}`,
              animation: "arc-pulse 2s ease-in-out infinite",
            }}
          />
        )}
        {r.value}
      </div>
    </motion.div>
  );
}

/* ─── Parallax layer ─── */

function Layer({
  depth,
  mx,
  my,
  children,
}: {
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.g style={{ x, y }}>
      {children}
    </motion.g>
  );
}

export default function HeroScene({ locked = false }: { locked?: boolean }) {
  const { reducedMotion } = useMode();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, rawX, rawY]);

  const spin = (duration: number, dir = 1) =>
    reducedMotion
      ? {}
      : {
          animate: { rotate: 360 * dir },
          transition: { duration, repeat: Infinity, ease: "linear" as const },
        };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {readouts.map((r, i) => (
        <Readout key={r.label} r={r} delay={1.6 + i * 0.12} />
      ))}

      {/* Target-lock label */}
      <motion.div
        className="mono"
        initial={false}
        animate={{ opacity: locked ? 1 : 0, y: locked ? 0 : 6 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% + min(23vw, 230px)))",
          fontSize: 11,
          letterSpacing: "0.3em",
          color: RED,
          whiteSpace: "nowrap",
        }}
      >
        TARGET LOCKED
      </motion.div>

      <svg
        viewBox="0 0 400 400"
        style={{
          width: "min(100%, 440px)",
          height: "auto",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="emblem-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7dc8a" />
            <stop offset="0.38" stopColor="#e8b23a" />
            <stop offset="0.66" stopColor="#9e6d1c" />
            <stop offset="1" stopColor="#f0c860" />
          </linearGradient>
          <radialGradient id="emblem-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e9f9ff" />
            <stop offset="0.35" stopColor="#4fc3f7" stopOpacity="0.85" />
            <stop offset="0.75" stopColor="#0d4f6e" stopOpacity="0.55" />
            <stop offset="1" stopColor="#08090d" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id="emblem-bleed" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#4fc3f7" stopOpacity="0.22" />
            <stop offset="0.5" stopColor="#c8102e" stopOpacity="0.08" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="emblem-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient bleed */}
        <motion.circle
          cx={C}
          cy={C}
          r={200}
          fill="url(#emblem-bleed)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.4 }}
        />

        {/* Outer scale — tightens and turns red on target lock */}
        <Layer depth={14} mx={mx} my={my}>
          <motion.g
            style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: locked ? 0.93 : 1 }}
            transition={{ duration: locked ? 0.25 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.g
              style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
              {...spin(80)}
            >
              <circle
                cx={C}
                cy={C}
                r={190}
                fill="none"
                stroke={locked ? RED : GOLD}
                strokeOpacity={locked ? 0.7 : 0.22}
                style={{ transition: "stroke 0.25s, stroke-opacity 0.25s" }}
              />
              {TICKS.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={locked ? RED : GOLD}
                  strokeOpacity={t.major ? 0.7 : 0.3}
                  strokeWidth={t.major ? 1.4 : 1}
                  style={{ transition: "stroke 0.25s" }}
                />
              ))}
            </motion.g>
          </motion.g>
        </Layer>

        {/* Cyan sweep arcs */}
        <Layer depth={9} mx={mx} my={my}>
          <motion.g
            style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.g
              style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
              {...spin(36, -1)}
            >
              {[0, 120, 240].map((a) => (
                <path
                  key={a}
                  d={arcPath(165, a, a + 72)}
                  fill="none"
                  stroke={ARC}
                  strokeOpacity={0.55}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              ))}
              <circle
                cx={C}
                cy={C}
                r={165}
                fill="none"
                stroke={ARC}
                strokeOpacity={0.12}
                strokeDasharray="2 6"
              />
            </motion.g>
          </motion.g>
        </Layer>

        {/* Coil ring — segments lock in one by one */}
        <Layer depth={5} mx={mx} my={my}>
          <motion.g
            style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
            {...spin(120)}
          >
            {COILS.map(({ d, i }) => (
              <motion.path
                key={i}
                d={d}
                fill="url(#emblem-gold)"
                stroke="#08090d"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ originX: "200px", originY: "200px" }}
                transition={{
                  delay: 0.6 + i * 0.06,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </motion.g>
          <circle
            cx={C}
            cy={C}
            r={112}
            fill="#0b0c12"
            stroke={GOLD}
            strokeOpacity={0.35}
          />
        </Layer>

        {/* Core + monogram */}
        <Layer depth={2} mx={mx} my={my}>
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1, 0.8, 1] }}
            transition={{
              delay: 1.5,
              duration: 1.1,
              times: [0, 0.18, 0.32, 0.52, 0.72, 1],
            }}
          >
            <circle
              cx={C}
              cy={C}
              r={96}
              fill="url(#emblem-core)"
              filter="url(#emblem-glow)"
            />
            <circle
              cx={C}
              cy={C}
              r={96}
              fill="none"
              stroke={ARC}
              strokeOpacity={0.8}
              strokeWidth={1.5}
            />
            <circle
              cx={C}
              cy={C}
              r={72}
              fill="none"
              stroke="#e9f9ff"
              strokeOpacity={0.25}
              strokeDasharray="1 5"
            />
            <text
              x={C}
              y={C + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f4fcff"
              filter="url(#emblem-glow)"
              style={{
                fontFamily: "var(--font-display-active)",
                fontWeight: 800,
                fontSize: 64,
                letterSpacing: 4,
              }}
            >
              AS
            </text>
            <text
              x={C}
              y={C + 50}
              textAnchor="middle"
              fill="#0b2433"
              style={{
                fontFamily: "var(--font-mono-active)",
                fontSize: 10,
                letterSpacing: 4,
              }}
            >
              SETH · 01
            </text>
          </motion.g>
        </Layer>
      </svg>
    </div>
  );
}
