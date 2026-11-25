"use client";

import { experiences } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Panel from "@/components/ui/Panel";
import Tag from "@/components/ui/Tag";

/**
 * Two-column cards: the story on the left, the facts (period, location,
 * stack) on the right — so wide screens no longer leave the right 40% of
 * every card empty.
 *
 * Iron Man adds a mission header strip per card and a pulse travelling down
 * the conduit. Both are .hud-only, so this file never branches on mode.
 */
export default function Experience() {
  const total = experiences.length;

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <SectionHeading section="experience" />

        <div style={{ position: "relative", paddingLeft: 30 }}>
          {/* Conduit */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 6,
              bottom: 6,
              width: 1,
              background:
                "linear-gradient(180deg, var(--accent), var(--border), transparent)",
            }}
          >
            <span className="conduit-pulse hud-only" />
          </div>

          <div style={{ display: "grid", gap: 26 }}>
            {experiences.map((exp, i) => {
              // Missions are numbered oldest-first; the list is newest-first.
              const missionNo = String(total - i).padStart(2, "0");
              return (
                <Reveal key={exp.company} delay={i * 0.08}>
                  <div style={{ position: "relative" }}>
                    {/* Node */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: -35,
                        top: 26,
                        width: 11,
                        height: 11,
                        transform: "rotate(45deg)",
                        border: "1px solid var(--accent)",
                        background: i === 0 ? "var(--accent)" : "var(--bg)",
                        boxShadow: i === 0 ? "0 0 12px var(--accent)" : "none",
                      }}
                    />

                    <Panel>
                      {/* Mission strip — Iron Man only */}
                      <div
                        className="hud-only mono"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          margin: "-24px -24px 22px",
                          padding: "9px 24px",
                          borderBottom: "1px solid var(--border)",
                          background:
                            "linear-gradient(90deg, var(--accent-soft), transparent 70%)",
                          fontSize: 11,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                        }}
                      >
                        <span style={{ color: "var(--accent)" }}>
                          Mission {missionNo}
                          {exp.highlight && (
                            <span style={{ color: "var(--accent-2)", marginLeft: 14 }}>
                              ◆ Priority
                            </span>
                          )}
                        </span>
                        <span
                          style={{
                            color: "var(--accent-3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--accent-3)",
                            }}
                          />
                          Status: complete
                        </span>
                      </div>

                      <div className="mission-grid">
                        {/* Story */}
                        <div>
                          <h3
                            style={{
                              fontSize: "var(--step-1)",
                              margin: "0 0 8px",
                              lineHeight: 1.2,
                            }}
                          >
                            {exp.role}
                          </h3>
                          <div
                            style={{
                              fontSize: "var(--step-0)",
                              color: "var(--text)",
                              fontWeight: 600,
                              marginBottom: 14,
                            }}
                          >
                            {exp.company}
                          </div>
                          <p
                            style={{
                              margin: 0,
                              color: "var(--text-dim)",
                              lineHeight: 1.75,
                              maxWidth: "68ch",
                            }}
                          >
                            {exp.description}
                          </p>
                        </div>

                        {/* Facts */}
                        <dl
                          className="mission-meta"
                          style={{
                            margin: 0,
                            display: "grid",
                            gap: 16,
                            alignContent: "start",
                          }}
                        >
                          {[
                            { k: "Period", v: exp.period, accent: true },
                            { k: "Location", v: exp.location },
                          ].map(({ k, v, accent }) => (
                            <div key={k}>
                              <dt
                                className="mono"
                                style={{
                                  fontSize: 11,
                                  letterSpacing: "0.18em",
                                  textTransform: "uppercase",
                                  color: "var(--text-dim)",
                                  marginBottom: 4,
                                }}
                              >
                                {k}
                              </dt>
                              <dd
                                className="tabular"
                                style={{
                                  margin: 0,
                                  color: accent ? "var(--accent)" : "var(--text)",
                                  fontFamily: accent
                                    ? "var(--font-mono-active)"
                                    : undefined,
                                  fontSize: accent ? "0.82rem" : "0.95rem",
                                  letterSpacing: accent ? "0.06em" : undefined,
                                }}
                              >
                                {v}
                              </dd>
                            </div>
                          ))}
                          <div>
                            <dt
                              className="mono"
                              style={{
                                fontSize: 11,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "var(--text-dim)",
                                marginBottom: 8,
                              }}
                            >
                              Stack
                            </dt>
                            <dd
                              style={{
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 7,
                              }}
                            >
                              {exp.tags.map((tag) => (
                                <Tag key={tag} accent={exp.highlight}>
                                  {tag}
                                </Tag>
                              ))}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </Panel>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
