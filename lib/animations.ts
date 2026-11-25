import type { Variants } from "framer-motion";
import type { Mode } from "@/components/mode/ModeProvider";

/**
 * Motion is part of the mode, not a global constant.
 *
 * Default mode moves a little and settles: short travel, no blur, no scale.
 * Iron Man mode announces itself: blur-in, lateral offset, longer stagger.
 */

export interface MotionSet {
  reveal: Variants;
  stagger: Variants;
  item: Variants;
  heading: Variants;
}

const defaultSet: MotionSet = {
  reveal: {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  heading: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
};

const ironManSet: MotionSet = {
  reveal: {
    hidden: { opacity: 0, x: -24, filter: "blur(6px)" },
    visible: (i: number = 0) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, delay: i, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  heading: {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
};

export function motionSet(mode: Mode): MotionSet {
  return mode === "ironman" ? ironManSet : defaultSet;
}

/* ─── Iron Man signature variants ─── */

export const hudFlicker: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.4, 1, 0.7, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      ease: "easeOut",
    },
  },
};

export const arcReactorPulse: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.15, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const hologramIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20, filter: "blur(6px) brightness(1.5)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px) brightness(1)",
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const letterAnimation: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};
