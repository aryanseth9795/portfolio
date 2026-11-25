"use client";

import { useEffect, useRef } from "react";
import { useMode } from "@/components/mode/ModeProvider";

const SPACING = 42;
const RADIUS = 190;

/**
 * Default mode's ambient layer. Canvas2D, deliberately no WebGL — default mode
 * must reach first paint without pulling in three.js.
 *
 * A sparse dot grid sits at very low alpha; a soft spotlight follows the cursor
 * and lifts the dots within RADIUS. Colors are read from the live token values
 * so the layer tracks the theme.
 */
export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999 };

    const rgb = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      return value || "#6366f1";
    };
    let accent = rgb();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS) {
            // Near the cursor: brighten toward the accent and grow slightly.
            const t = 1 - dist / RADIUS;
            ctx.globalAlpha = 0.06 + t * 0.5;
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(x, y, 1 + t * 1.4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      // One static frame, no loop and no pointer tracking.
      draw();
    } else {
      window.addEventListener("pointermove", onPointer);
      window.addEventListener("pointerleave", onLeave);
      loop();
    }

    // The accent token changes when the mode does; re-read it periodically
    // rather than on every frame.
    const tokenPoll = window.setInterval(() => {
      accent = rgb();
    }, 1000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(tokenPoll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <div className="canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
