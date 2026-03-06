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
          subtitle="Where I've been building and shipping."
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
              variants={i % 2 === 0 ? fadeInUp : fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              className={`relative flex flex-col md:flex-row items-start gap-6 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[14px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full z-10 mt-8"
                style={{
                  background: "var(--accent-blue)",
                  boxShadow: "0 0 12px rgba(0, 212, 255, 0.6)",
                }}
              />

              {/* Card — full width on mobile, half on desktop */}
              <div className="pl-12 md:pl-0 md:w-1/2">
                <GlassCard>
                  <div className="flex items-center gap-2 mb-2">
                    {exp.highlight && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "rgba(0, 212, 255, 0.1)",
                          color: "var(--accent-blue)",
                          border: "1px solid rgba(0, 212, 255, 0.3)",
                        }}
                      >
                        Current
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
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {exp.role}
                  </h3>

                  <p
                    className="text-sm mb-3 font-medium"
                    style={{ color: "var(--accent-blue)" }}
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
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background: "rgba(124, 58, 237, 0.1)",
                          color: "var(--accent-violet)",
                          border: "1px solid rgba(124, 58, 237, 0.2)",
                          fontFamily: "var(--font-mono)",
                        }}
                        whileHover={{
                          background: "rgba(124, 58, 237, 0.2)",
                          borderColor: "rgba(124, 58, 237, 0.4)",
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
