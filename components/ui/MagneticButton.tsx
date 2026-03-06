"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  href?: string;
  download?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  style = {},
  onClick,
  href,
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer ${className}`}
      style={{
        fontFamily: "var(--font-body)",
        border: "1px solid rgba(0, 212, 255, 0.3)",
        color: "var(--text-primary)",
        background: "rgba(0, 212, 255, 0.05)",
        transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
        ...style,
      }}
      whileHover={{
        boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
        borderColor: "rgba(0, 212, 255, 0.6)",
        background: "rgba(0, 212, 255, 0.1)",
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={download ? undefined : "_blank"}
        rel="noopener noreferrer"
        download={download}
      >
        {inner}
      </a>
    );
  }

  return inner;
}
