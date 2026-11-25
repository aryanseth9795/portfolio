"use client";

import { useState, useEffect, useCallback } from "react";

interface TerminalTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
  /** Small label before the typed text, e.g. "J.A.R.V.I.S. >". Omit for none. */
  prefix?: string;
}

export default function TerminalText({
  texts,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 1500,
  className = "",
  prefix,
}: TerminalTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = texts[textIndex];

    if (isDeleting) {
      setDisplayText(current.substring(0, displayText.length - 1));
      if (displayText.length === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      setDisplayText(current.substring(0, displayText.length + 1));
      if (displayText.length === current.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    }
  }, [displayText, isDeleting, textIndex, texts, pauseTime]);

  useEffect(() => {
    const timer = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, deleteSpeed, speed]);

  return (
    <span
      className={className}
      style={{ fontFamily: "var(--font-mono-active)" }}
    >
      {prefix && (
        <span style={{ color: "var(--accent-3, var(--accent))", opacity: 0.7 }}>
          {prefix}{" "}
        </span>
      )}
      <span style={{ color: "var(--accent)" }}>{displayText}</span>
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1.1em",
          marginLeft: 4,
          verticalAlign: "middle",
          background: "var(--accent-3, var(--accent))",
          animation: "tt-blink 1s step-end infinite",
        }}
      />
      <style jsx>{`
        @keyframes tt-blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
