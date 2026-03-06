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
      <motion.div
        className="mt-4 mx-auto h-[2px] w-20"
        style={{ background: "var(--gradient-main)" }}
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
}
