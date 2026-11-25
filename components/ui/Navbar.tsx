"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useMode } from "@/components/mode/ModeProvider";
import { useCopy, type ModeCopy } from "@/lib/copy";
import ModeToggle from "@/components/mode/ModeToggle";

const navItems: { key: keyof ModeCopy["nav"]; href: string }[] = [
  { key: "about", href: "#about" },
  { key: "experience", href: "#experience" },
  { key: "education", href: "#education" },
  { key: "skills", href: "#skills" },
  { key: "projects", href: "#projects" },
  { key: "contact", href: "#contact" },
];

function StatusReadout() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className="mono"
      aria-hidden="true"
      style={{
        fontSize: "0.65rem",
        letterSpacing: "0.14em",
        color: "var(--accent-3, var(--accent))",
        opacity: "var(--chrome-opacity)",
        transition: "opacity var(--theme-fade) var(--ease)",
      }}
    >
      {time}
    </span>
  );
}

export default function Navbar() {
  const { mode } = useMode();
  const copy = useCopy();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      // A thin band across the middle of the viewport: whichever section
      // crosses it is active. A ratio threshold never fires for sections
      // taller than the viewport, which left the highlight stuck.
      { threshold: 0, rootMargin: "-45% 0px -55% 0px" },
    );

    navItems.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: "14px 0",
          background: scrolled ? "color-mix(in srgb, var(--bg) 88%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        <div className="container flex items-center justify-between gap-4">
          {/* Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-display-active)",
              fontSize: "0.95rem",
              fontWeight: 600,
              letterSpacing: "var(--heading-tracking)",
              textTransform: "var(--heading-transform)" as "none",
              color: "var(--text)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 10px var(--accent)",
                flexShrink: 0,
              }}
            />
            {copy.brand}
          </a>

          {/* Desktop links */}
          <ul
            className="hidden lg:flex items-center"
            style={{ gap: 28, listStyle: "none", margin: 0, padding: 0 }}
          >
            {navItems.map(({ key, href }) => {
              const active = activeSection === href.slice(1);
              return (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    style={{
                      position: "relative",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 0",
                      fontFamily: "var(--font-ui-active)",
                      fontSize: "calc(var(--ui-size) * 0.85)",
                      fontWeight: "var(--ui-weight)" as React.CSSProperties["fontWeight"],
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: active ? "var(--accent)" : "var(--text-dim)",
                      transition: "color 0.25s",
                    }}
                  >
                    {copy.nav[key]}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: -3,
                          height: 1,
                          background: "var(--accent)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center" style={{ gap: 14 }}>
            <span className="hidden lg:inline-flex">
              <StatusReadout />
            </span>
            <ModeToggle />
            {/* Display comes from the class only — an inline display here
                used to override lg:hidden and show the button on desktop. */}
            <button
              className="inline-flex lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                position: "relative",
                zIndex: 60,
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              gap: 26,
              background: "color-mix(in srgb, var(--bg) 97%, transparent)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {navItems.map(({ key, href }, i) => (
              <motion.button
                key={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display-active)",
                  fontSize: "var(--step-3)",
                  fontWeight: "var(--heading-weight)",
                  letterSpacing: "var(--heading-tracking)",
                  textTransform: "var(--heading-transform)" as "none",
                  color:
                    activeSection === href.slice(1)
                      ? "var(--accent)"
                      : "var(--text)",
                }}
              >
                {copy.nav[key]}
              </motion.button>
            ))}
            <span className="mono" style={{ marginTop: 18, fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.12em" }}>
              {mode === "ironman" ? "STARK.OS" : copy.brand}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
