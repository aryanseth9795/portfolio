"use client";

import { motion } from "framer-motion";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Lift and brighten on hover. */
  interactive?: boolean;
  /** Per-card accent, e.g. a project's brand color. */
  accent?: string;
}

/**
 * The shared surface. Quiet bordered card in default mode; HUD frame in Iron
 * Man mode.
 *
 * The corner brackets and top accent are always in the DOM and are revealed by
 * --chrome-opacity, so this component never branches on mode and the chrome
 * fades in with the transition instead of popping.
 */
export default function Panel({
  children,
  className = "",
  style,
  interactive = true,
  accent,
}: PanelProps) {
  // Cursor position for the hover spotlight, written straight to CSS
  // variables so tracking the pointer never re-renders the panel.
  const onPointerMove = interactive
    ? (e: PointerEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    : undefined;

  return (
    <motion.div
      className={`panel ${interactive ? "panel-interactive" : ""} ${className}`}
      style={
        {
          ...(accent ? { "--panel-accent": accent } : {}),
          ...style,
        } as CSSProperties
      }
      onPointerMove={onPointerMove}
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="panel-chrome" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {children}
    </motion.div>
  );
}
