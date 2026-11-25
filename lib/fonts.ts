import {
  Bricolage_Grotesque,
  Inter_Tight,
  JetBrains_Mono,
  Instrument_Serif,
  Orbitron,
  Rajdhani,
  Share_Tech_Mono,
  Exo_2,
} from "next/font/google";

/* ─── Default mode faces ─── */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** Accent face. Used for exactly one word in the hero — nowhere else. */
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

/* ─── Iron Man faces ─── */
/* preload: false — these cost nothing until the mode activates. */

const displayIron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display-iron",
  display: "swap",
  preload: false,
});

const bodyIron = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-iron",
  display: "swap",
  preload: false,
});

/** Paragraph face for Iron Man mode — Rajdhani is too condensed for long text. */
const proseIron = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-prose-iron",
  display: "swap",
  preload: false,
});

const monoIron = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono-iron",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  display.variable,
  body.variable,
  mono.variable,
  serif.variable,
  displayIron.variable,
  bodyIron.variable,
  proseIron.variable,
  monoIron.variable,
].join(" ");
