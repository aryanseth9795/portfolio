"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMode } from "@/components/mode/ModeProvider";
import ArcReactor from "./ArcReactor";

type Phase = "idle" | "dim" | "ignite" | "shockwave" | "assemble" | "boot";

interface Timeline {
  /** ms offsets from sequence start. */
  marks: { phase: Phase; at: number }[];
  commitAt: number;
  endAt: number;
}

/* Entering Iron Man for the first time this session — the full show. */
const FULL_ENTER: Timeline = {
  marks: [
    { phase: "dim", at: 0 },
    { phase: "ignite", at: 250 },
    { phase: "shockwave", at: 550 },
    { phase: "assemble", at: 1300 },
    { phase: "boot", at: 1700 },
  ],
  commitAt: 950,
  endAt: 2050,
};

/* Every later activation — same gesture, no ceremony. */
const SHORT_ENTER: Timeline = {
  marks: [
    { phase: "dim", at: 0 },
    { phase: "shockwave", at: 150 },
  ],
  commitAt: 350,
  endAt: 800,
};

/* Powering down. */
const EXIT: Timeline = {
  marks: [
    { phase: "dim", at: 0 },
    { phase: "shockwave", at: 100 },
  ],
  commitAt: 450,
  endAt: 900,
};

/* prefers-reduced-motion: a plain crossfade. */
const REDUCED: Timeline = {
  marks: [{ phase: "dim", at: 0 }],
  commitAt: 125,
  endAt: 250,
};

const BOOT_LINE = "> J.A.R.V.I.S. ONLINE — WELCOME BACK, SIR.";

/** Explicitly typed so every entry shares one shape — an array literal with
 *  differing keys infers a union that TypeScript will not let us index. */
interface Corner {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  x: number;
  y: number;
  bt?: boolean;
  bb?: boolean;
  bl?: boolean;
  br?: boolean;
}

const CORNERS: Corner[] = [
  { top: 28, left: 28, x: -60, y: -60, bt: true, bl: true },
  { top: 28, right: 28, x: 60, y: -60, bt: true, br: true },
  { bottom: 28, left: 28, x: -60, y: 60, bb: true, bl: true },
  { bottom: 28, right: 28, x: 60, y: 60, bb: true, br: true },
];

export default function SuitUpSequence() {
  const {
    isTransitioning,
    pendingMode,
    sequenceLength,
    reducedMotion,
    commitMode,
    endTransition,
  } = useMode();

  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);

  // Guards: commit and end must each fire exactly once per run, even if the
  // component re-renders or the user skips mid-sequence.
  const committed = useRef(false);
  const ended = useRef(false);
  const timers = useRef<number[]>([]);

  // commitMode() flips sequenceLength to "short" mid-run. Latch the run's shape
  // at the start so the visuals do not change shape halfway through.
  const runFull = useRef(false);

  const entering = pendingMode === "ironman";

  const timeline: Timeline = reducedMotion
    ? REDUCED
    : !entering
      ? EXIT
      : sequenceLength === "full"
        ? FULL_ENTER
        : SHORT_ENTER;

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const finishNow = useCallback(() => {
    clearTimers();
    if (!committed.current) {
      committed.current = true;
      commitMode();
    }
    if (!ended.current) {
      ended.current = true;
      setPhase("idle");
      endTransition();
    }
  }, [clearTimers, commitMode, endTransition]);

  useEffect(() => {
    if (!isTransitioning) return;

    committed.current = false;
    ended.current = false;
    runFull.current =
      !reducedMotion && entering && sequenceLength === "full";
    setTyped(0);
    setPhase("dim");

    const schedule = (fn: () => void, at: number) => {
      timers.current.push(window.setTimeout(fn, at));
    };

    timeline.marks.forEach(({ phase: p, at }) => {
      if (at > 0) schedule(() => setPhase(p), at);
    });

    schedule(() => {
      if (!committed.current) {
        committed.current = true;
        commitMode();
      }
    }, timeline.commitAt);

    schedule(() => {
      if (!ended.current) {
        ended.current = true;
        setPhase("idle");
        endTransition();
      }
    }, timeline.endAt);

    return clearTimers;
    // timeline is derived from values in this dep list; recomputing it mid-run
    // is impossible because toggle() is blocked while isTransitioning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning]);

  /* Type the boot line out during the boot phase. */
  useEffect(() => {
    if (phase !== "boot") return;
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= BOOT_LINE.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [phase]);

  /* Skip on Escape. */
  useEffect(() => {
    if (!isTransitioning) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishNow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTransitioning, finishNow]);

  const showReactor =
    runFull.current &&
    (phase === "ignite" || phase === "shockwave" || phase === "assemble");

  const showWave = !reducedMotion && phase !== "idle" && phase !== "dim";

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="suitup"
          aria-hidden="true"
          onClick={finishNow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            overflow: "hidden",
            cursor: "pointer",
            backdropFilter: reducedMotion
              ? undefined
              : "saturate(0.15) brightness(0.45)",
            WebkitBackdropFilter: reducedMotion
              ? undefined
              : "saturate(0.15) brightness(0.45)",
            background: reducedMotion ? "var(--bg)" : "rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* Arc reactor ignition */}
          <AnimatePresence>
            {showReactor && (
              <motion.div
                key="reactor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.15, 1],
                  opacity: [0, 1, 0.85, 1],
                }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  translate: "-50% -50%",
                }}
              >
                <ArcReactor size={150} spinning />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparks — full entry only */}
          {showReactor &&
            phase === "ignite" &&
            Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * 260,
                    y: Math.sin(angle) * 260,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent-3, #4fc3f7)",
                    boxShadow: "0 0 8px #4fc3f7",
                  }}
                />
              );
            })}

          {/* Shockwave — the theme flips underneath this */}
          {showWave && (
            <motion.div
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100vmax",
                height: "100vmax",
                marginTop: "-50vmax",
                marginLeft: "-50vmax",
                borderRadius: "50%",
                border: "2px solid #ffd700",
                boxShadow:
                  "0 0 60px rgba(255, 215, 0, 0.5), inset 0 0 80px rgba(230, 36, 41, 0.25)",
              }}
            />
          )}

          {/* Flash that masks the palette swap */}
          {showWave && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0] }}
              transition={{ duration: 0.6, times: [0, 0.45, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background: entering ? "#ffd700" : "#ffffff",
              }}
            />
          )}

          {/* HUD brackets flying into the corners */}
          {(phase === "assemble" || phase === "boot") &&
            CORNERS.map((c, i) => (
              <motion.span
                key={i}
                initial={{ x: c.x, y: c.y, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  top: c.top,
                  left: c.left,
                  right: c.right,
                  bottom: c.bottom,
                  width: 46,
                  height: 46,
                  borderTop: c.bt ? "2px solid #ffd700" : undefined,
                  borderBottom: c.bb ? "2px solid #ffd700" : undefined,
                  borderLeft: c.bl ? "2px solid #e62429" : undefined,
                  borderRight: c.br ? "2px solid #e62429" : undefined,
                }}
              />
            ))}

          {/* Scanline sweep */}
          {phase === "assemble" && (
            <motion.div
              initial={{ y: "-10vh", opacity: 0 }}
              animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.6, ease: "linear" }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, #4fc3f7, transparent)",
                boxShadow: "0 0 20px #4fc3f7",
              }}
            />
          )}

          {/* Boot line */}
          {phase === "boot" && (
            <div
              style={{
                position: "absolute",
                bottom: "18%",
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "var(--font-mono-active), monospace",
                fontSize: 13,
                letterSpacing: "0.18em",
                color: "#4fc3f7",
                textShadow: "0 0 12px rgba(79, 195, 247, 0.6)",
              }}
            >
              {BOOT_LINE.slice(0, typed)}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ marginLeft: 2 }}
              >
                ▌
              </motion.span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
