"use client";

import { useMode } from "@/components/mode/ModeProvider";
import HeroDefault from "./HeroDefault";
import HeroIronMan from "./HeroIronMan";

/**
 * The one section allowed to branch on mode. The two heroes differ in
 * structure, not just styling, so they are separate components rather than one
 * component full of conditionals.
 */
export default function Hero() {
  const { mode } = useMode();
  return mode === "ironman" ? <HeroIronMan /> : <HeroDefault />;
}
