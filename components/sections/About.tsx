"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { about, stats, personalInfo } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import StatCounter from "@/components/ui/StatCounter";
import Panel from "@/components/ui/Panel";

export default function About() {
  const [lead, ...rest] = about;
  const bioRef = useRef<HTMLDivElement>(null);
  const bioInView = useInView(bioRef, { once: true, margin: "-120px" });

  return (
    <section id="about" className="section-padding">
      <div className="container">
        <SectionHeading section="about" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 56,
            alignItems: "start",
          }}
        >
          {/* Bio — Iron Man sweeps a scan line over it once on reveal */}
          <div ref={bioRef} style={{ position: "relative" }}>
            <span
              aria-hidden="true"
              className={`scan-once hud-only${bioInView ? " run" : ""}`}
            />
            <Reveal>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--step-2)",
                  lineHeight: 1.4,
                  color: "var(--text)",
                  textWrap: "balance",
                }}
              >
                {lead}
              </p>
            </Reveal>

            {rest.map((para, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p
                  style={{
                    margin: "22px 0 0",
                    fontSize: "var(--step-0)",
                    lineHeight: 1.7,
                    color: "var(--text-dim)",
                    maxWidth: "60ch",
                  }}
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Stats */}
          <Reveal delay={0.15}>
            <Panel interactive={false}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 32,
                }}
              >
                {stats.map((stat) => (
                  <StatCounter
                    key={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                ))}
              </div>

              <div
                style={{
                  marginTop: 30,
                  paddingTop: 22,
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
                className="mono"
              >
                <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
                  {personalInfo.location}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.1em" }}>
                  {personalInfo.title}
                </span>
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
