"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { fadeInUp, scaleIn } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";

const categoryColors: Record<string, string> = {
  Frontend: "#ffd700",
  Backend: "#e62429",
  Databases: "#4fc3f7",
  "DevOps / Cloud": "#ff6b35",
  "AI / ML": "#ffa726",
  Tools: "#ef5350",
};

export default function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle
          title="Skills"
          subtitle="Arsenal of technologies and tools."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items], i) => {
            const color = categoryColors[category] || "#ffd700";
            return (
              <motion.div
                key={category}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                className="glass hud-corners red-top-accent p-6 rounded-2xl"
                style={{
                  border: `1px solid ${color}15`,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: color,
                      boxShadow: `0 0 8px ${color}80`,
                    }}
                  />
                  <h3
                    className="text-sm font-bold tracking-widest uppercase"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: color,
                    }}
                  >
                    {category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map((skill, j) => (
                    <motion.span
                      key={skill}
                      variants={scaleIn}
                      custom={j}
                      className="text-xs px-3 py-1.5 rounded-sm font-medium cursor-default"
                      style={{
                        background: `${color}10`,
                        color: color,
                        border: `1px solid ${color}25`,
                        fontFamily: "var(--font-mono)",
                        transition: "all 0.3s",
                        letterSpacing: "0.03em",
                      }}
                      whileHover={{
                        background: `${color}20`,
                        borderColor: `${color}50`,
                        boxShadow: `0 0 12px ${color}30`,
                        scale: 1.05,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
