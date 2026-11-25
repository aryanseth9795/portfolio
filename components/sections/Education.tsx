"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Panel from "@/components/ui/Panel";

type Edu = (typeof education)[number];

/** "CGPA 7.73 / 10" → 77.3, "89.5%" → 89.5. Null when the grade isn't numeric. */
function gradePercent(grade?: string): number | null {
  if (!grade) return null;
  const outOf = grade.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  if (outOf) return (parseFloat(outOf[1]) / parseFloat(outOf[2])) * 100;
  const pct = grade.match(/([\d.]+)\s*%/);
  if (pct) return parseFloat(pct[1]);
  return null;
}

/** Completion bar driven by the real grade. */
function GradeBar({ grade, delay = 0 }: { grade?: string; delay?: number }) {
  const pct = gradePercent(grade);
  if (pct === null) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div
        className="mono"
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
          marginBottom: 7,
        }}
      >
        <span>{grade}</span>
        <span className="tabular" style={{ color: "var(--accent)" }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div
        aria-hidden="true"
        style={{
          height: 4,
          background: "var(--border)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: pct / 100 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            transformOrigin: "0%",
            background: "linear-gradient(90deg, var(--accent-3), var(--accent))",
          }}
        />
      </div>
    </div>
  );
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: "18px 0 0",
        padding: 0,
        listStyle: "none",
        display: "grid",
        gap: 9,
      }}
    >
      {items.map((h) => (
        <li
          key={h}
          style={{
            display: "flex",
            gap: 10,
            color: "var(--text-dim)",
            fontSize: "0.92rem",
            lineHeight: 1.55,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              marginTop: 8,
              width: 5,
              height: 5,
              transform: "rotate(45deg)",
              background: "var(--accent)",
              flexShrink: 0,
            }}
          />
          {h}
        </li>
      ))}
    </ul>
  );
}

const eyebrow: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  color: "var(--accent)",
  marginBottom: 12,
};

export default function Education() {
  // The degree leads; school records share one card so it stands out.
  const [degree, ...school] = education;
  const schoolName = school[0]?.institution;
  // Highlights repeated across school years are shown once.
  const schoolHighlights = Array.from(new Set(school.flatMap((s) => s.highlights)));

  return (
    <section id="education" className="section-padding">
      <div className="container">
        <SectionHeading section="education" />

        <div className="training-grid">
          <Reveal>
            <Panel style={{ height: "100%" }}>
              <div className="mono tabular" style={eyebrow}>
                {degree.period}
              </div>
              <h3 style={{ fontSize: "var(--step-2)", margin: "0 0 10px", lineHeight: 1.15 }}>
                {degree.institution}
              </h3>
              <p style={{ margin: 0, color: "var(--text)", fontSize: "var(--step-0)" }}>
                {degree.degree}
              </p>
              <GradeBar grade={degree.grade} />
              <Highlights items={degree.highlights} />
            </Panel>
          </Reveal>

          {schoolName && (
            <Reveal delay={0.08}>
              <Panel style={{ height: "100%" }}>
                <div className="mono tabular" style={eyebrow}>
                  {school[school.length - 1].period.split("–")[0].trim()} –{" "}
                  {school[0].period.split("–")[1]?.trim()}
                </div>
                <h3 style={{ fontSize: "var(--step-1)", margin: "0 0 4px", lineHeight: 1.2 }}>
                  {schoolName}
                </h3>

                {school.map((s: Edu, i) => (
                  <div
                    key={s.degree}
                    style={{
                      marginTop: 16,
                      paddingTop: i === 0 ? 0 : 16,
                      borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    }}
                  >
                    <p style={{ margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>
                      {s.degree}
                    </p>
                    <GradeBar grade={s.grade} delay={0.1 * (i + 1)} />
                  </div>
                ))}

                <Highlights items={schoolHighlights} />
              </Panel>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
