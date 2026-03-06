"use client";

import { motion } from "framer-motion";
import { GraduationCap, School } from "lucide-react";
import { education } from "@/lib/data";
import { fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import GlassCard from "@/components/ui/GlassCard";

const icons = [GraduationCap, School];

export default function Education() {
  return (
    <section id="education" className="section-padding">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle
          title="Education"
          subtitle="The academic foundations that shaped my craft."
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {education.map((edu, i) => {
            const Icon = icons[i] || GraduationCap;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                style={{ perspective: 1000 }}
              >
                <GlassCard className="h-full">
                  {/* Floating icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(0, 212, 255, 0.1)",
                      border: "1px solid rgba(0, 212, 255, 0.2)",
                    }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Icon size={24} style={{ color: "var(--accent-blue)" }} />
                  </motion.div>

                  <span
                    className="text-xs mb-2 block"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {edu.period}
                  </span>

                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {edu.institution}
                  </h3>

                  <p
                    className="text-sm mb-4 font-medium"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {edu.degree}
                  </p>

                  <ul className="space-y-2">
                    {edu.highlights.map((h, j) => (
                      <motion.li
                        key={j}
                        className="text-sm flex items-start gap-2"
                        style={{ color: "var(--text-muted)" }}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.1 }}
                      >
                        <span
                          style={{ color: "var(--accent-green)" }}
                          className="mt-1"
                        >
                          ▸
                        </span>
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
