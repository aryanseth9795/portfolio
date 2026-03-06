"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/data";
import { fadeInUp } from "@/lib/animations";
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
  const rotateX = useSpring(useTransform(y, [-100, 100], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-6, 6]), {
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

  return (
    <motion.div
      ref={cardRef}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index % 6}
      className={`relative group ${featured ? "md:col-span-2 lg:col-span-2" : ""}`}
      style={{ perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        resetMouse();
      }}
    >
      <motion.div
        className="glass h-full rounded-2xl relative overflow-hidden"
        style={{
          rotateX,
          rotateY,
          border: `1px solid ${project.color}20`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Gradient top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
            opacity: hovered ? 1 : 0.3,
            transition: "opacity 0.3s",
          }}
        />

        {/* Project Screenshot */}
        {project.image && (
          <div
            className="relative w-full overflow-hidden"
            style={{ height: featured ? 240 : 180 }}
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
            />
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 40%, ${project.color}10 70%, var(--bg-primary) 100%)`,
              }}
            />
            {/* Category badge */}
            <span
              className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-semibold z-10"
              style={{
                background: "rgba(5, 5, 8, 0.7)",
                backdropFilter: "blur(8px)",
                color: project.color,
                border: `1px solid ${project.color}40`,
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
              className={`${featured ? "text-xl" : "text-base"} font-bold`}
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
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    border: `1px solid ${project.color}30`,
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = project.color;
                    e.currentTarget.style.color = project.color;
                    e.currentTarget.style.boxShadow = `0 0 12px ${project.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${project.color}30`;
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
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    border: `1px solid ${project.color}30`,
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = project.color;
                    e.currentTarget.style.color = project.color;
                    e.currentTarget.style.boxShadow = `0 0 12px ${project.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${project.color}30`;
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

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: `${project.color}10`,
                  color: project.color,
                  border: `1px solid ${project.color}20`,
                  fontFamily: "var(--font-mono)",
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
            background: `radial-gradient(circle at 50% 50%, ${project.color}06, transparent 70%)`,
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
          subtitle="Things I've built that I'm proud of."
        />

        {/* Category filter */}
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
              className="text-xs px-4 py-2 rounded-full font-medium transition-all duration-300"
              style={{
                fontFamily: "var(--font-mono)",
                background:
                  activeCategory === cat
                    ? "var(--gradient-main)"
                    : "rgba(0, 212, 255, 0.05)",
                color: activeCategory === cat ? "#050508" : "var(--text-muted)",
                border:
                  activeCategory === cat
                    ? "none"
                    : "1px solid rgba(0, 212, 255, 0.15)",
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
