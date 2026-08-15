"use client";

import { motion } from "framer-motion";

/*  ───────────────────────────────────────────────────
    Iron Man Helmet  –  SVG "suit-build" animation
    
    The helmet is drawn stroke-by-stroke, HUD brackets
    & data readouts fade in around it, and the eyes
    ignite at the end.
    ─────────────────────────────────────────────────── */

const draw = (delay: number, dur = 1.8) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration: dur, ease: "easeInOut" }, opacity: { delay, duration: 0.3 } },
  },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay, duration: 0.5 } },
});

const slideIn = (delay: number, x = 0, y = 0) => ({
  hidden: { opacity: 0, x, y },
  visible: { opacity: 1, x: 0, y: 0, transition: { delay, duration: 0.6, ease: "easeOut" } },
});

export default function HeroScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-[340px] h-[340px] md:w-[440px] md:h-[440px] rounded-full"
        style={{
          border: "1px solid rgba(255, 215, 0, 0.08)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {/* Tick marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-[1px] h-3"
            style={{
              background: "var(--accent-gold)",
              opacity: 0.3,
              top: 0,
              left: "50%",
              transformOrigin: "50% calc(170px)",
              transform: `rotate(${deg}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner rotating ring (opposite direction) */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[390px] md:h-[390px] rounded-full"
        style={{
          border: "1px dashed rgba(79, 195, 247, 0.1)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />

      {/* ── SVG Helmet ── */}
      <motion.svg
        viewBox="0 0 300 340"
        className="w-[240px] h-[280px] md:w-[300px] md:h-[340px] relative z-10"
        initial="hidden"
        animate="visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ─── Outer helmet shell ─── */}
        <motion.path
          d="M150 20 C80 20, 30 80, 30 160 C30 220, 55 260, 90 290 L120 310 L150 320 L180 310 L210 290 C245 260, 270 220, 270 160 C270 80, 220 20, 150 20Z"
          stroke="var(--accent-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={draw(0.5, 2.5)}
        />

        {/* ─── Faceplate divider ─── */}
        <motion.path
          d="M90 180 L120 200 L150 210 L180 200 L210 180"
          stroke="var(--accent-red)"
          strokeWidth="1.2"
          strokeLinecap="round"
          variants={draw(1.2, 1.5)}
        />

        {/* ─── Forehead plate ─── */}
        <motion.path
          d="M100 100 L150 70 L200 100 L190 140 L150 155 L110 140Z"
          stroke="var(--accent-gold)"
          strokeWidth="1"
          strokeLinecap="round"
          variants={draw(1.5, 1.8)}
        />

        {/* ─── Left cheek plate ─── */}
        <motion.path
          d="M50 150 L75 120 L110 140 L100 180 L70 190Z"
          stroke="var(--accent-gold)"
          strokeWidth="0.8"
          strokeLinecap="round"
          variants={draw(1.8, 1.5)}
        />

        {/* ─── Right cheek plate ─── */}
        <motion.path
          d="M250 150 L225 120 L190 140 L200 180 L230 190Z"
          stroke="var(--accent-gold)"
          strokeWidth="0.8"
          strokeLinecap="round"
          variants={draw(1.8, 1.5)}
        />

        {/* ─── Chin / jaw ─── */}
        <motion.path
          d="M100 220 L120 240 L150 250 L180 240 L200 220"
          stroke="var(--accent-red)"
          strokeWidth="1"
          strokeLinecap="round"
          variants={draw(2.2, 1.5)}
        />

        {/* ─── Jaw side lines ─── */}
        <motion.path
          d="M70 190 L90 220 L100 250 L120 270"
          stroke="var(--accent-gold)"
          strokeWidth="0.7"
          strokeLinecap="round"
          variants={draw(2.5, 1.2)}
        />
        <motion.path
          d="M230 190 L210 220 L200 250 L180 270"
          stroke="var(--accent-gold)"
          strokeWidth="0.7"
          strokeLinecap="round"
          variants={draw(2.5, 1.2)}
        />

        {/* ─── Center line (symmetry) ─── */}
        <motion.line
          x1="150" y1="70" x2="150" y2="250"
          stroke="rgba(79, 195, 247, 0.15)"
          strokeWidth="0.5"
          strokeDasharray="3 4"
          variants={draw(1, 2)}
        />

        {/* ─── Left eye ─── */}
        <motion.path
          d="M100 158 L115 148 L140 155 L130 168 L105 168Z"
          stroke="var(--accent-arc)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="rgba(79, 195, 247, 0.0)"
          variants={draw(3, 0.8)}
        />
        {/* Left eye IGNITE */}
        <motion.path
          d="M100 158 L115 148 L140 155 L130 168 L105 168Z"
          fill="rgba(79, 195, 247, 0.25)"
          stroke="none"
          variants={fadeIn(3.8)}
          style={{ filter: "blur(2px)" }}
        />

        {/* ─── Right eye ─── */}
        <motion.path
          d="M200 158 L185 148 L160 155 L170 168 L195 168Z"
          stroke="var(--accent-arc)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="rgba(79, 195, 247, 0.0)"
          variants={draw(3, 0.8)}
        />
        {/* Right eye IGNITE */}
        <motion.path
          d="M200 158 L185 148 L160 155 L170 168 L195 168Z"
          fill="rgba(79, 195, 247, 0.25)"
          stroke="none"
          variants={fadeIn(3.8)}
          style={{ filter: "blur(2px)" }}
        />

        {/* ─── Arc reactor chest hint ─── */}
        <motion.circle
          cx="150" cy="330"
          r="12"
          stroke="var(--accent-arc)"
          strokeWidth="1"
          variants={draw(3.5, 1)}
        />
        <motion.circle
          cx="150" cy="330"
          r="6"
          fill="rgba(79, 195, 247, 0.3)"
          stroke="none"
          variants={fadeIn(4.2)}
          style={{ filter: "blur(3px)" }}
        />

        {/* ─── Detail panel lines ─── */}
        <motion.line x1="75" y1="120" x2="55" y2="100" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" variants={draw(2.8, 0.8)} />
        <motion.line x1="225" y1="120" x2="245" y2="100" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" variants={draw(2.8, 0.8)} />
        <motion.line x1="110" y1="140" x2="90" y2="130" stroke="rgba(255,215,0,0.2)" strokeWidth="0.4" variants={draw(2.9, 0.6)} />
        <motion.line x1="190" y1="140" x2="210" y2="130" stroke="rgba(255,215,0,0.2)" strokeWidth="0.4" variants={draw(2.9, 0.6)} />
      </motion.svg>

      {/* ── HUD Data Readouts ── */}

      {/* Top-left bracket + label */}
      <motion.div
        className="absolute top-[10%] left-[5%] md:left-[8%]"
        variants={slideIn(2.5, -30, 0)}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-start gap-2">
          <div style={{ borderLeft: "1px solid var(--accent-arc)", borderTop: "1px solid var(--accent-arc)", width: 16, height: 16, opacity: 0.5 }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent-arc)", opacity: 0.7, lineHeight: 1.6 }}>
            <div>MARK LXXXV</div>
            <div style={{ color: "var(--accent-gold)" }}>NANO-TECH</div>
          </div>
        </div>
      </motion.div>

      {/* Top-right bracket + label */}
      <motion.div
        className="absolute top-[10%] right-[5%] md:right-[8%] text-right"
        variants={slideIn(2.7, 30, 0)}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-start justify-end gap-2">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent-arc)", opacity: 0.7, lineHeight: 1.6 }}>
            <div>STATUS: <span style={{ color: "var(--accent-gold)" }}>ASSEMBLING</span></div>
            <div>INTEGRITY: 100%</div>
          </div>
          <div style={{ borderRight: "1px solid var(--accent-arc)", borderTop: "1px solid var(--accent-arc)", width: 16, height: 16, opacity: 0.5 }} />
        </div>
      </motion.div>

      {/* Bottom-left data */}
      <motion.div
        className="absolute bottom-[12%] left-[5%] md:left-[8%]"
        variants={slideIn(3.2, -20, 10)}
        initial="hidden"
        animate="visible"
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", opacity: 0.5, lineHeight: 1.8 }}>
          <div>PWR ████████ <span style={{ color: "var(--accent-gold)" }}>98%</span></div>
          <div>SYS ██████░░ <span style={{ color: "var(--accent-arc)" }}>76%</span></div>
        </div>
      </motion.div>

      {/* Bottom-right targeting */}
      <motion.div
        className="absolute bottom-[12%] right-[5%] md:right-[8%] text-right"
        variants={slideIn(3.4, 20, 10)}
        initial="hidden"
        animate="visible"
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", opacity: 0.5, lineHeight: 1.8 }}>
          <div>LAT: 26.8467°N</div>
          <div>LON: 80.9462°E</div>
        </div>
      </motion.div>

      {/* ── Eye ignition glow effect ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 0.5 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[120px] h-[40px] md:w-[150px] md:h-[50px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(79,195,247,0.15) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />
      </motion.div>

      {/* ── Scanning lines that animate after build ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <motion.div
          className="absolute left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent 10%, var(--accent-arc) 50%, transparent 90%)",
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 4.5 }}
        />
      </motion.div>
    </div>
  );
}
