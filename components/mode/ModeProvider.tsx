"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Mode = "default" | "ironman";

const STORAGE_KEY = "portfolio-mode";

export interface ModeContextValue {
  /** The theme currently applied to <html data-mode>. */
  mode: Mode;
  /** Target mode while a transition is running; null otherwise. */
  pendingMode: Mode | null;
  /** True from toggle() until endTransition(). */
  isTransitioning: boolean;
  /** Which choreography to run. "full" only on the first ironman activation. */
  sequenceLength: "full" | "short";
  /** True when the user prefers reduced motion. */
  reducedMotion: boolean;
  /** Begin a transition to the other mode. No-op while already transitioning. */
  toggle: () => void;
  /** Apply pendingMode to <html>. Called by SuitUpSequence at its flash peak. */
  commitMode: () => void;
  /** Clear transition state. Called by SuitUpSequence when it finishes. */
  endTransition: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}

function readStampedMode(): Mode {
  return document.documentElement.dataset.mode === "ironman"
    ? "ironman"
    : "default";
}

/** useLayoutEffect on the client (runs before paint), a no-op on the server. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ModeProvider({ children }: { children: ReactNode }) {
  // Always start as "default" so the first client render matches the server
  // HTML. Reading the stamped mode during render caused a hydration mismatch
  // for returning Iron Man visitors; React then rebuilt <html> and dropped
  // data-mode, leaving every token undefined.
  const [mode, setModeState] = useState<Mode>("default");
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Refs, not state: flipping these must never trigger a re-render mid-sequence.
  const hasPlayedFull = useRef(false);
  const pendingRef = useRef<Mode | null>(null);
  const sequenceLength: "full" | "short" = hasPlayedFull.current
    ? "short"
    : "full";

  // Sync to what ModeScript stamped, before the first paint.
  useIsoLayoutEffect(() => {
    const stamped = readStampedMode();
    // Re-stamp defensively in case anything cleared the attribute.
    document.documentElement.dataset.mode = stamped;
    if (stamped !== "default") setModeState(stamped);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    // Guard: a double-click must not start two overlapping sequences.
    if (isTransitioning) return;
    const next: Mode = mode === "ironman" ? "default" : "ironman";
    pendingRef.current = next;
    setPendingMode(next);
    setIsTransitioning(true);
  }, [isTransitioning, mode]);

  // Reads the target from a ref rather than a state updater — an updater must
  // be pure, and strict mode double-invokes it.
  const commitMode = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    setModeState(pending);
    document.documentElement.dataset.mode = pending;
    try {
      localStorage.setItem(STORAGE_KEY, pending);
    } catch {
      // Private browsing can reject writes. The mode still applies for this
      // session; it just will not survive a reload.
    }
    if (pending === "ironman") hasPlayedFull.current = true;
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setPendingMode(null);
    pendingRef.current = null;
  }, []);

  return (
    <ModeContext.Provider
      value={{
        mode,
        pendingMode,
        isTransitioning,
        sequenceLength,
        reducedMotion,
        toggle,
        commitMode,
        endTransition,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}
