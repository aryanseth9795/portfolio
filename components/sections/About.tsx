"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";
import { stats } from "@/lib/data";
import { fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const rounded = useTransform(spring, (v: number) => Math.round(v));

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
    return unsub;
  }, [rounded, suffix]);

  return (
    <span
      ref={ref}
      className="text-4xl md:text-5xl font-bold gradient-text"
      style={{ fontFamily: "var(--font-display)" }}
    >
      0{suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle title="About Me" />

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Bio */}
          <motion.div
            className="flex-1"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div
              className="space-y-5 text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <motion.p variants={fadeInUp} custom={0}>
                I&apos;m a B.Tech ECE graduate from IIIT Bhagalpur (2025), now
                working as a GenAI & Full Stack SDE intern at{" "}
                <span className="gradient-text font-semibold">
                  UltraTech Cement, Aditya Birla Group
                </span>
                .
              </motion.p>
              <motion.p variants={fadeInUp} custom={1}>
                I specialize in building intelligent, production-grade
                applications that sit at the intersection of modern web and AI.
                I&apos;m obsessed with clean architecture, beautiful UIs, and
                software that actually ships.
              </motion.p>
              <motion.p variants={fadeInUp} custom={2}>
                Long-term, I&apos;m building toward launching my own tech
                startup.
              </motion.p>
            </div>

            {/* Quote */}
            <motion.blockquote
              variants={fadeInUp}
              custom={3}
              className="mt-8 pl-4 text-lg italic"
              style={{
                borderLeft: "2px solid var(--accent-blue)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              &quot;I don&apos;t just write code — I craft experiences.&quot;
            </motion.blockquote>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            className="flex-1 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  custom={i}
                  className="glass text-center p-6 rounded-2xl"
                  style={{ border: "1px solid var(--border-glow)" }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p
                    className="mt-2 text-sm"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
