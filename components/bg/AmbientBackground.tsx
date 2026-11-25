"use client";

import dynamic from "next/dynamic";
import { useMode } from "@/components/mode/ModeProvider";
import DotField from "./DotField";

/**
 * The three.js particle field is reachable only from here, and only when Iron
 * Man mode is active — that is what keeps WebGL out of the default bundle.
 */
const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), {
  ssr: false,
});

export default function AmbientBackground() {
  const { mode } = useMode();
  return mode === "ironman" ? <ParticleField /> : <DotField />;
}
