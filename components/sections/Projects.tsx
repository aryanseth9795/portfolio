"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/data";
import { useCopy } from "@/lib/copy";
import { useMode } from "@/components/mode/ModeProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Panel from "@/components/ui/Panel";
import Tag from "@/components/ui/Tag";

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  const copy = useCopy();
  const { mode, reducedMotion } = useMode();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const canTilt = mode === "ironman" && !reducedMotion;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 8, y: px * 8 });
  };

  const hasLink = project.link && project.link !== "#";
  const hasCode = project.github && project.github !== "#";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      // Column span comes from .project-featured, not an inline style — an
      // inline rule would beat the media query and span 2 on narrow screens too.
      style={{ perspective: 1000 }}
      className={featured ? "project-featured" : undefined}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{ height: "100%", transformStyle: "preserve-3d" }}
      >
        <Panel
          accent={project.color}
          className="project-card"
          style={{ height: "100%", padding: 0, overflow: "hidden" }}
        >
          {/* Thumbnail — .project-thumb carries the hologram treatment and the
              featured side-by-side layout (globals.css). */}
          <div
            className="project-thumb"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: featured ? "21 / 9" : "16 / 10",
              overflow: "hidden",
              borderBottom: "1px solid var(--border)",
              background: "var(--bg-elev)",
            }}
          >
            {project.image && featured && (
              /* Blurred backdrop so the full screenshot can be shown with
                 object-fit: contain instead of being cropped. */
              <Image
                src={project.image}
                alt=""
                aria-hidden="true"
                fill
                unoptimized={project.image.endsWith(".svg")}
                sizes="60px"
                style={{
                  objectFit: "cover",
                  filter: "blur(28px) brightness(0.45) saturate(1.2)",
                  transform: "scale(1.15)",
                }}
              />
            )}
            {project.image ? (
              <Image
                src={project.image}
                alt=""
                fill
                // next/image refuses to optimise SVG; serve it as-is.
                unoptimized={project.image.endsWith(".svg")}
                sizes={featured ? "(max-width: 900px) 100vw, 900px" : "(max-width: 900px) 100vw, 420px"}
                style={{
                  objectFit: featured ? "contain" : "cover",
                  padding: featured ? 18 : 0,
                }}
              />
            ) : (
              /* No screenshot yet — a tinted monogram beats a broken image. */
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  background: `radial-gradient(circle at 50% 45%, ${project.color}22, transparent 70%)`,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: featured ? "2.4rem" : "1.8rem",
                    letterSpacing: "0.1em",
                    color: project.color,
                    opacity: 0.5,
                  }}
                >
                  {project.name
                    .replace(/[^A-Za-z ]/g, "")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("")}
                </span>
              </div>
            )}

            {/* Hologram scanlines — Iron Man only, via --chrome-opacity */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                opacity: "var(--chrome-opacity)",
                transition: "opacity var(--theme-fade) var(--ease)",
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79,195,247,0.09) 2px, rgba(79,195,247,0.09) 3px)",
                mixBlendMode: "screen",
              }}
            />

            {featured && (
              <span
                className="mono"
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 2,
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  background: "var(--accent)",
                  color: "var(--accent-contrast)",
                }}
              >
                {copy.projects.featuredLabel}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="project-body" style={{ padding: 22 }}>
            <div
              className="mono"
              style={{
                fontSize: "0.66rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 9,
              }}
            >
              {project.category}
            </div>

            <h3
              style={{
                fontSize: featured ? "var(--step-2)" : "var(--step-1)",
                margin: "0 0 10px",
              }}
            >
              {project.name}
            </h3>

            <p
              style={{
                margin: "0 0 16px",
                color: "var(--text-dim)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                maxWidth: "58ch",
              }}
            >
              {project.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
                marginBottom: 18,
              }}
            >
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <div style={{ display: "flex", gap: 18 }}>
              {hasLink && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  {copy.projects.liveLabel} <ArrowUpRight size={14} />
                </a>
              )}
              {hasCode && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                  }}
                >
                  <Github size={14} /> {copy.projects.codeLabel}
                </a>
              )}
            </div>
          </div>
        </Panel>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const copy = useCopy();
  const [active, setActive] = useState<string>("__all");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [],
  );

  const visible = useMemo(
    () =>
      active === "__all"
        ? projects
        : projects.filter((p) => p.category === active),
    [active],
  );

  const filters = [{ key: "__all", label: copy.projects.all }].concat(
    categories.map((c) => ({ key: c, label: c })),
  );

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <SectionHeading section="projects" />

        {/* Filters — styled as a targeting bar in Iron Man mode */}
        <div
          className="filter-bar"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 9,
            marginBottom: 34,
          }}
        >
          {filters.map(({ key, label }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                aria-pressed={isActive}
                className="mono filter-chip"
                style={{
                  padding: "8px 15px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  background: isActive ? "var(--accent-soft)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text-dim)",
                  transition: "all 0.22s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <LayoutGroup>
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: 20,
            }}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <ProjectCard
                  key={`${project.name}-${project.image}`}
                  project={project}
                  featured={Boolean(project.featured) && active === "__all"}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
