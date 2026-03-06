"use client";

import { useState, useEffect, useCallback } from "react";

interface TerminalTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export default function TerminalText({
  texts,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 1500,
  className = "",
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
    <span className={className} style={{ fontFamily: "var(--font-mono)" }}>
      <span style={{ color: "var(--accent-green)" }}>{">"} </span>
      {displayText}
      <span
        className="inline-block w-[2px] h-[1.1em] ml-1 align-middle"
        style={{
          background: "var(--accent-blue)",
          animation: "blink 1s step-end infinite",
        }}
      />
      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
