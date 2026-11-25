"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { useCopy } from "@/lib/copy";

export default function Footer() {
  const copy = useCopy();
  const year = new Date().getFullYear();

  const links = [
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "36px 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          className="mono"
          style={{
            margin: 0,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            color: "var(--text-dim)",
          }}
        >
          © {year} {personalInfo.name} — {copy.footer}
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          {links.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-dim)", display: "inline-flex" }}
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
