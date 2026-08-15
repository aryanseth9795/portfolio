"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-16 text-center"
    >
      {/* HUD label */}
      <motion.span
        className="inline-block text-xs tracking-[0.3em] mb-3"
        style={{
          color: "var(--accent-arc)",
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
        }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        ◆ STARK.OS // {title.toUpperCase()}
      </motion.span>

      <h2
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="gradient-text">{title}</span>
      </h2>

      {subtitle && (
        <p
          className="text-lg max-w-xl mx-auto"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {subtitle}
        </p>
      )}

      {/* Animated arc-reactor underline */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <motion.div
          className="h-[1px] bg-gradient-to-r from-transparent to-[var(--accent-red)]"
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            background: "var(--accent-arc)",
            boxShadow: "0 0 10px rgba(79, 195, 247, 0.6)",
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ scale: { duration: 0.4, delay: 0.5, type: "spring" } }}
          animate={{
            boxShadow: [
              "0 0 10px rgba(79, 195, 247, 0.4)",
              "0 0 20px rgba(79, 195, 247, 0.8)",
              "0 0 10px rgba(79, 195, 247, 0.4)",
            ],
          }}
          //@ts-ignore - framer motion types don't perfectly align here but the transition prop per-value works
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.4, delay: 0.5, type: "spring" }
          }}
        />
        <motion.div
          className="h-[1px] bg-gradient-to-l from-transparent to-[var(--accent-gold)]"
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
