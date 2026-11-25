"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills, projects, experiences } from "@/lib/data";
import { useCopy } from "@/lib/copy";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Panel from "@/components/ui/Panel";
import SkillChip from "@/components/ui/SkillChip";

const entries = Object.entries(skills);
/** The bar shows how many technologies sit in a category — real data, not an
 *  invented proficiency score. */
const largest = Math.max(...entries.map(([, list]) => list.length));

/** "Next.js" and "NextJS", "Socket.IO" and "socket.io" compare equal. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]/g, "");

/** Where a skill was actually used: project names and companies whose tags list it. */
function usage(skill: string): string[] {
  const key = norm(skill);
  const inProjects = projects
    .filter((p) => p.tags.some((t) => norm(t) === key))
    .map((p) => p.name);
  const inJobs = experiences
    .filter((e) => e.tags.some((t) => norm(t) === key))
    .map((e) => e.company.split(" (")[0].split(" Ltd")[0]);
  return Array.from(new Set([...inJobs, ...inProjects]));
}

function Module({
  category,
  list,
  index,
}: {
  category: string;
  list: string[];
  index: number;
}) {
  const copy = useCopy();
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const used = activeSkill ? usage(activeSkill) : null;
  const deployedCount = list.filter((sk) => usage(sk).length > 0).length;

  return (
    <Panel style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <h3 style={{ fontSize: "var(--step-0)", margin: 0 }}>
          <span
            className="hud-only mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "var(--accent-3)",
              marginRight: 10,
              verticalAlign: "middle",
            }}
          >
            MK-{String(index + 1).padStart(2, "0")}
          </span>
          {category}
        </h3>
        <span
          className="mono tabular"
          style={{
            fontSize: "0.7rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
          }}
        >
          {String(list.length).padStart(2, "0")}
        </span>
      </div>

      {/* Charge bar */}
      <div
        aria-hidden="true"
        style={{
          height: 3,
          borderRadius: 999,
          background: "var(--border)",
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: list.length / largest }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.9,
            delay: 0.1 + index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            height: "100%",
            transformOrigin: "0%",
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1, alignContent: "flex-start" }}>
        {list.map((skill) => (
          <SkillChip key={skill} name={skill} onActive={setActiveSkill} />
        ))}
      </div>

      {/* Trace readout */}
      <div
        className="mono"
        aria-live="polite"
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          letterSpacing: "0.08em",
          lineHeight: 1.6,
          minHeight: 32,
          color: "var(--text-dim)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSkill ?? "__hint"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {!activeSkill ? (
              copy.skills.traceHint
                .replace("{used}", String(deployedCount))
                .replace("{total}", String(list.length))
            ) : used && used.length > 0 ? (
              <>
                <span style={{ color: "var(--accent-3)" }}>
                  {copy.skills.usedIn} →{" "}
                </span>
                <span style={{ color: "var(--text)" }}>{used.join(" · ")}</span>
              </>
            ) : (
              copy.skills.notUsed
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Panel>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <SectionHeading section="skills" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 20,
          }}
        >
          {entries.map(([category, list], i) => (
            <Reveal key={category} delay={i * 0.05}>
              <Module category={category} list={list} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
