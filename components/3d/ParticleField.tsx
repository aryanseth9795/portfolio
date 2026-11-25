"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMode } from "@/components/mode/ModeProvider";

/**
 * Ambient particle field for Iron Man mode.
 *
 * - Round sprites: plain GL points render as squares, and the ones close to
 *   the camera became large squares scattered over the page.
 * - Depth is kept well behind the camera (z ≤ 6) for the same reason.
 * - ~1100 particles on desktop, ~500 on small screens (was 2000 everywhere).
 * - The render loop stops while the tab is hidden, and the field is static
 *   under prefers-reduced-motion.
 */

const Z_NEAR = 6;
const Z_FAR = -30;

/** Client-only module (dynamically imported with ssr:false), so window exists. */
function useParticleCount() {
  const [count] = useState(() =>
    window.matchMedia("(max-width: 768px)").matches ? 500 : 1100,
  );
  return count;
}

/** A soft round dot, drawn once into a canvas texture. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Particles({ count, animate }: { count: number; animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const dot = useDotTexture();

  const [positions, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    // Colour roles: mostly gold structure, cyan light, a little red.
    const gold = [0.91, 0.7, 0.23];
    const red = [0.78, 0.06, 0.18];
    const arc = [0.31, 0.76, 0.97];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      spd[i] = Math.random() * 0.006 + 0.002;

      const r = Math.random();
      const c = r < 0.5 ? gold : r < 0.85 ? arc : red;
      col.set(c, i * 3);
    }
    return [pos, col, spd];
  }, [count]);

  useFrame(() => {
    if (!animate || !ref.current) return;
    const posAttr = ref.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 30) arr[i * 3 + 1] = -30;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={dot}
        alphaTest={0.01}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  const { reducedMotion } = useMode();
  const count = useParticleCount();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const animate = visible && !reducedMotion;

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: "transparent" }}
        // "demand" renders once and then only on invalidate — i.e. frozen.
        frameloop={animate ? "always" : "demand"}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <Particles count={count} animate={animate} />
      </Canvas>
    </div>
  );
}
