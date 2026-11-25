"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Github, Linkedin, Check, Copy, MapPin, Phone } from "lucide-react";
import { useMode } from "@/components/mode/ModeProvider";
import { personalInfo } from "@/lib/data";
import { useCopy } from "@/lib/copy";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Panel from "@/components/ui/Panel";

type CopyState = "idle" | "copied" | "failed";

/** Types the terminal lines once, when the panel scrolls into view. */
function useTypedLines(lines: string[], start: boolean, instant: boolean) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!start || instant) return;
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    const t =
      charIdx < line.length
        ? window.setTimeout(() => setCharIdx((c) => c + 1), 24)
        : window.setTimeout(() => {
            setLineIdx((l) => l + 1);
            setCharIdx(0);
          }, 260);
    return () => window.clearTimeout(t);
  }, [start, instant, lines, lineIdx, charIdx]);

  // Reduced motion: everything is shown at once, no typing.
  if (instant) return { lineIdx: lines.length, charIdx: 0, done: true };
  return { lineIdx, charIdx, done: lineIdx >= lines.length };
}

export default function Contact() {
  const copy = useCopy();
  const { mode, reducedMotion } = useMode();
  const isIron = mode === "ironman";
  const [state, setState] = useState<CopyState>("idle");
  // Observed on the <section>, which exists in both modes. A ref on the
  // terminal itself missed its element: the page first renders in default
  // mode, so the observer attached before the terminal existed.
  const sectionRef = useRef<HTMLElement>(null);
  const termInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const typed = useTypedLines(
    copy.contact.terminalLines,
    isIron && termInView,
    reducedMotion,
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setState("copied");
    } catch {
      // Clipboard rejects on insecure origins and when permission is denied.
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2200);
  };

  const label =
    state === "copied"
      ? copy.contact.copiedLabel
      : state === "failed"
        ? copy.contact.copyFailedLabel
        : copy.contact.copyLabel;

  const details = [
    {
      icon: MapPin,
      label: copy.contact.locationLabel,
      value: personalInfo.location,
      href: undefined,
    },
    {
      icon: Phone,
      label: "Phone",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "aryanseth9795",
      href: personalInfo.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "aryanseth9795",
      href: personalInfo.linkedin,
    },
  ];

  const emailRow = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 18,
      }}
    >
      <a
        href={`mailto:${personalInfo.email}`}
        className="email-link"
        style={{
          fontFamily: isIron ? "var(--font-mono-active)" : "var(--font-display-active)",
          fontSize: "var(--step-2)",
          letterSpacing: isIron ? "0.02em" : "var(--heading-tracking)",
          color: isIron ? "var(--accent)" : "var(--text)",
          position: "relative",
          paddingBottom: 4,
          wordBreak: "break-word",
        }}
      >
        {personalInfo.email}
      </a>

      <button
        onClick={copyEmail}
        className="mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 14px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          background: "transparent",
          color: state === "copied" ? "var(--accent)" : "var(--text-dim)",
          cursor: "pointer",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "color 0.2s, border-color 0.2s",
        }}
      >
        {state === "copied" ? <Check size={14} /> : <Copy size={14} />}
        {label}
      </button>
    </div>
  );

  const detailLabel = (Icon: (typeof details)[number]["icon"], l: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        marginBottom: 9,
        color: "var(--accent)",
      }}
    >
      <Icon size={15} />
      <span
        className="mono"
        style={{
          fontSize: "0.66rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {l}
      </span>
    </div>
  );

  /* ─── Iron Man: comm terminal ─── */
  if (isIron) {
    return (
      <section id="contact" ref={sectionRef} className="section-padding">
        <div className="container">
          <SectionHeading section="contact" />

          <Reveal>
            <div>
              <Panel interactive={false} style={{ padding: 0 }}>
                {/* Title bar */}
                <div
                  className="mono"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 18px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                  }}
                >
                  {["var(--accent-2)", "var(--accent)", "var(--accent-3)"].map((c) => (
                    <span
                      key={c}
                      aria-hidden="true"
                      style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }}
                    />
                  ))}
                  <span style={{ marginLeft: 8 }}>{copy.contact.terminalTitle}</span>
                </div>

                <div style={{ padding: "26px 24px 30px" }}>
                  {/* Typed lines */}
                  <div
                    className="mono"
                    aria-label={copy.contact.terminalLines.join(". ")}
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.9,
                      color: "var(--accent-3)",
                      minHeight: `${copy.contact.terminalLines.length * 1.9}em`,
                      marginBottom: 22,
                    }}
                  >
                    {copy.contact.terminalLines.map((line, i) => {
                      if (i > typed.lineIdx) return null;
                      const text = i < typed.lineIdx ? line : line.slice(0, typed.charIdx);
                      return (
                        <div key={line} aria-hidden="true">
                          <span style={{ color: "var(--accent)" }}>&gt; </span>
                          {text}
                          {i === typed.lineIdx && !typed.done && (
                            <span
                              style={{
                                display: "inline-block",
                                width: 8,
                                height: "1em",
                                marginLeft: 2,
                                verticalAlign: "text-bottom",
                                background: "var(--accent-3)",
                                animation: "hud-flicker 1s steps(2) infinite",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      opacity: typed.done ? 1 : 0.15,
                      transition: "opacity 0.5s var(--ease)",
                    }}
                  >
                    {emailRow}
                  </div>
                </div>
              </Panel>
            </div>
          </Reveal>

          {/* Comm links as one connected strip */}
          <Reveal delay={0.1}>
            <div className="comm-strip" style={{ marginTop: 18 }}>
              {details.map(({ icon: Icon, label: l, value, href }) =>
                href ? (
                  <a
                    key={l}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ color: "var(--text)", wordBreak: "break-word" }}
                  >
                    {detailLabel(Icon, l)}
                    {value}
                  </a>
                ) : (
                  <div key={l} style={{ color: "var(--text)" }}>
                    {detailLabel(Icon, l)}
                    {value}
                  </div>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  /* ─── Default ─── */
  return (
    <section id="contact" ref={sectionRef} className="section-padding">
      <div className="container">
        <SectionHeading section="contact" />

        <Reveal>
          <h3
            style={{
              fontSize: "var(--step-4)",
              margin: "0 0 18px",
              maxWidth: "16ch",
              lineHeight: 1.02,
            }}
          >
            {copy.contact.heading}
          </h3>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            style={{
              margin: "0 0 40px",
              maxWidth: "50ch",
              color: "var(--text-dim)",
              fontSize: "var(--step-1)",
              lineHeight: 1.6,
            }}
          >
            {copy.contact.body}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div style={{ marginBottom: 44 }}>{emailRow}</div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: 16,
          }}
        >
          {details.map(({ icon: Icon, label: l, value, href }, i) => (
            <Reveal key={l} delay={0.06 * i}>
              <Panel style={{ height: "100%" }}>
                {detailLabel(Icon, l)}
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ color: "var(--text)", wordBreak: "break-word" }}
                  >
                    {value}
                  </a>
                ) : (
                  <span style={{ color: "var(--text)" }}>{value}</span>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
