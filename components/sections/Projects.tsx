"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ExternalLink, Github, Zap, Shield } from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/data";
import { fadeInUp, hologramIn } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";

const categories = [
  "All",
  "Full Stack Web App",
  "Frontend App",
  "Mobile App",
  "Applications",
];

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: (typeof projects)[0];
  index: number;
  featured?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  const statusLabel = project.link !== "#" ? "DEPLOYED" : "CLASSIFIED";
  const statusColor = project.link !== "#" ? "var(--accent-arc)" : "var(--accent-gold)";

  return (
    <motion.div
      ref={cardRef}
      variants={hologramIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index % 6}
      className={`relative group ${featured ? "md:col-span-2" : ""}`}
      style={{ perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        resetMouse();
      }}
    >
      <motion.div
        className="glass hud-corners h-full rounded-2xl relative overflow-hidden"
        style={{
          rotateX,
          rotateY,
          border: `1px solid rgba(255, 215, 0, 0.08)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Red top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{
            background: `linear-gradient(90deg, transparent, var(--accent-red), var(--accent-gold), transparent)`,
            opacity: hovered ? 1 : 0.3,
            transition: "opacity 0.3s",
          }}
        />

        {/* Scan line animation on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--accent-arc), transparent)",
                  boxShadow: "0 0 10px rgba(79, 195, 247, 0.3)",
                }}
                initial={{ top: 0 }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Screenshot */}
        {project.image && (
          <div
            className="relative w-full overflow-hidden"
            style={{ height: featured ? 260 : 200 }}
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 100vw, 50vw"
              }
            />
            {/* HUD overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.6) 60%, var(--bg-primary) 100%)`,
              }}
            />
            {/* HUD targeting brackets overlay */}
            <div className="absolute inset-4 pointer-events-none" style={{ opacity: hovered ? 0.6 : 0 , transition: "opacity 0.3s" }}>
              <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: "1px solid var(--accent-arc)", borderLeft: "1px solid var(--accent-arc)" }} />
              <div className="absolute top-0 right-0 w-4 h-4" style={{ borderTop: "1px solid var(--accent-arc)", borderRight: "1px solid var(--accent-arc)" }} />
              <div className="absolute bottom-0 left-0 w-4 h-4" style={{ borderBottom: "1px solid var(--accent-arc)", borderLeft: "1px solid var(--accent-arc)" }} />
              <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: "1px solid var(--accent-arc)", borderRight: "1px solid var(--accent-arc)" }} />
            </div>

            {/* Status badge top-left */}
            <span
              className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-sm font-semibold z-10 flex items-center gap-1.5 uppercase tracking-widest"
              style={{
                background: "rgba(10, 10, 15, 0.8)",
                backdropFilter: "blur(8px)",
                color: statusColor,
                border: `1px solid ${statusColor}40`,
                fontFamily: "var(--font-mono)",
              }}
            >
              {project.link !== "#" ? <Zap size={10} /> : <Shield size={10} />}
              {statusLabel}
            </span>

            {/* Category badge top-right */}
            <span
              className="absolute top-3 right-3 text-[9px] px-2 py-1 rounded-sm font-medium z-10 uppercase tracking-wider"
              style={{
                background: "rgba(10, 10, 15, 0.7)",
                backdropFilter: "blur(8px)",
                color: "var(--accent-gold)",
                border: "1px solid rgba(255, 215, 0, 0.2)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {project.category}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`${featured ? "text-xl" : "text-base"} font-bold tracking-wider`}
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {project.name}
            </h3>
            <div className="flex gap-2">
              {project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.name}`}
                  className="w-7 h-7 rounded-sm flex items-center justify-center transition-all duration-300"
                  style={{
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-gold)";
                    e.currentTarget.style.color = "var(--accent-gold)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 215, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.2)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <ExternalLink size={12} />
                </a>
              )}
              {project.github !== "#" && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub for ${project.name}`}
                  className="w-7 h-7 rounded-sm flex items-center justify-center transition-all duration-300"
                  style={{
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-gold)";
                    e.currentTarget.style.color = "var(--accent-gold)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 215, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.2)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Github size={12} />
                </a>
              )}
            </div>
          </div>

          <p
            className="text-xs mb-3 leading-relaxed line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {project.description}
          </p>

          {/* Tech tags as HUD data readouts */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-sm"
                style={{
                  background: "rgba(255, 215, 0, 0.06)",
                  color: "var(--accent-gold)",
                  border: "1px solid rgba(255, 215, 0, 0.15)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.04), transparent 70%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const featured = filtered.filter((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="section-padding">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle
          title="Projects"
          subtitle="Deployed systems and classified prototypes."
        />

        {/* Category filter — HUD toggle switches */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-[11px] px-4 py-2 rounded-sm font-semibold transition-all duration-300 tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                background:
                  activeCategory === cat
                    ? "var(--gradient-main)"
                    : "rgba(255, 215, 0, 0.04)",
                color:
                  activeCategory === cat ? "#0a0a0f" : "var(--text-muted)",
                border:
                  activeCategory === cat
                    ? "none"
                    : "1px solid rgba(255, 215, 0, 0.12)",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {featured.map((project, i) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={i}
                featured
              />
            ))}
            {others.map((project, i) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={i + featured.length}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
