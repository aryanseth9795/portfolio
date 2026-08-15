"use client";

import { motion } from "framer-motion";
import { experiences } from "@/lib/data";
import { fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import GlassCard from "@/components/ui/GlassCard";

export default function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle
          title="Experience"
          subtitle="Deployment history and active missions."
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <motion.div
            className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]"
            style={{ background: "var(--gradient-main)" }}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className={`relative flex flex-col md:flex-row items-start gap-6 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot — arc reactor style */}
              <motion.div
                className="absolute left-[14px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full z-10 mt-8"
                style={{
                  background: "var(--accent-gold)",
                  boxShadow:
                    "0 0 12px rgba(255, 215, 0, 0.6), 0 0 24px rgba(230, 36, 41, 0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 12px rgba(255, 215, 0, 0.4), 0 0 24px rgba(230, 36, 41, 0.2)",
                    "0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(230, 36, 41, 0.4)",
                    "0 0 12px rgba(255, 215, 0, 0.4), 0 0 24px rgba(230, 36, 41, 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Card */}
              <div className="pl-12 md:pl-0 md:w-1/2">
                <GlassCard>
                  <div className="flex items-center gap-2 mb-2">
                    {exp.highlight && (
                      <span
                        className="text-[10px] px-2.5 py-0.5 rounded-sm font-bold uppercase tracking-widest"
                        style={{
                          background: "rgba(230, 36, 41, 0.1)",
                          color: "var(--accent-red)",
                          border: "1px solid rgba(230, 36, 41, 0.3)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        ● Active
                      </span>
                    )}
                    <span
                      className="text-xs"
                      style={{
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold mb-1 tracking-wider"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                      fontSize: 15,
                    }}
                  >
                    {exp.role}
                  </h3>

                  <p
                    className="text-sm mb-3 font-medium"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {exp.company}
                  </p>

                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-sm"
                        style={{
                          background: "rgba(255, 215, 0, 0.06)",
                          color: "var(--accent-gold)",
                          border: "1px solid rgba(255, 215, 0, 0.15)",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.05em",
                          fontSize: 10,
                        }}
                        whileHover={{
                          background: "rgba(255, 215, 0, 0.12)",
                          borderColor: "rgba(255, 215, 0, 0.3)",
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
