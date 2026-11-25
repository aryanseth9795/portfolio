"use client";

import { useMode } from "@/components/mode/ModeProvider";

/**
 * Every string that differs between modes lives here.
 *
 * Sections read this through useCopy() and never branch on mode themselves.
 * Both dictionaries satisfy one ModeCopy type, so a key added to one and
 * forgotten in the other is a compile error, not a runtime `undefined`.
 *
 * The Iron Man voice reframes. It never invents credentials — every factual
 * claim still traces to lib/data.ts.
 */

export interface SectionCopy {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export interface ModeCopy {
  brand: string;
  nav: {
    about: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    contact: string;
  };
  toggle: { enter: string; exit: string; hint: string };
  hero: {
    status: string;
    lead: string;
    headline: string;
    headlineAccent: string;
    tagline: string;
    current: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  sections: {
    about: SectionCopy;
    experience: SectionCopy;
    education: SectionCopy;
    skills: SectionCopy;
    projects: SectionCopy;
    contact: SectionCopy;
  };
  skills: {
    /** Shown in a category's footer until a skill is hovered:
     *  "{used}" and "{total}" are filled in from real tag data. */
    traceHint: string;
    /** Prefix before the list of projects/roles that use the hovered skill. */
    usedIn: string;
    /** Shown when the hovered skill appears in no project or role tags. */
    notUsed: string;
  };
  projects: {
    all: string;
    liveLabel: string;
    codeLabel: string;
    featuredLabel: string;
  };
  contact: {
    /** Iron Man terminal: title bar and typed lines. Unused in default. */
    terminalTitle: string;
    terminalLines: string[];
    heading: string;
    body: string;
    copyLabel: string;
    copiedLabel: string;
    copyFailedLabel: string;
    locationLabel: string;
  };
  footer: string;
}

const defaultCopy: ModeCopy = {
  brand: "Aryan Seth",
  nav: {
    about: "About",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Work",
    contact: "Contact",
  },
  toggle: {
    enter: "Iron Man Mode",
    exit: "Exit Iron Man Mode",
    hint: "Switch the site into Iron Man mode",
  },
  hero: {
    status: "Available for work",
    lead: "Aryan Seth",
    headline: "Full stack & GenAI",
    headlineAccent: "engineer",
    tagline: "I build AI-powered applications that run in production.",
    current:
      "Open to backend, full stack, and GenAI roles. Previously at UltraTech Cement, Aditya Birla Group.",
    ctaPrimary: "View work",
    ctaSecondary: "Download resume",
    scrollHint: "Scroll",
  },
  sections: {
    about: { eyebrow: "Background", title: "About" },
    experience: { eyebrow: "Where I work", title: "Experience" },
    education: { eyebrow: "Training", title: "Education" },
    skills: { eyebrow: "Toolkit", title: "Skills" },
    projects: {
      eyebrow: "Selected work",
      title: "Projects",
      subtitle: "Things I have designed, built, and shipped.",
    },
    contact: { eyebrow: "Get in touch", title: "Contact" },
  },
  skills: {
    traceHint: "{used} of {total} used in shipped work · hover to trace",
    usedIn: "Used in",
    notUsed: "Used across coursework and smaller builds",
  },
  projects: {
    all: "All",
    liveLabel: "Live site",
    codeLabel: "Source",
    featuredLabel: "Featured",
  },
  contact: {
    terminalTitle: "",
    terminalLines: [],
    heading: "Let's build something.",
    body: "I'm open to full-time roles and interesting problems. The fastest way to reach me is email.",
    copyLabel: "Copy email",
    copiedLabel: "Copied",
    copyFailedLabel: "Press Ctrl+C to copy",
    locationLabel: "Based in",
  },
  footer: "Built with Next.js and too much coffee.",
};

const ironManCopy: ModeCopy = {
  brand: "STARK.OS",
  nav: {
    about: "Operator",
    experience: "Missions",
    education: "Training",
    skills: "Loadout",
    projects: "Systems",
    contact: "Comms",
  },
  toggle: {
    enter: "Engage Suit",
    exit: "Exit Suit",
    hint: "Return the site to its standard appearance",
  },
  hero: {
    status: "All systems nominal",
    lead: "Operator — Aryan Seth",
    headline: "Full stack &",
    headlineAccent: "GenAI engineer",
    tagline: "Engineering the future, one deploy at a time.",
    current:
      "Standing by for deployment. Previous postings: FilFlo and UltraTech Cement (Aditya Birla Group).",
    ctaPrimary: "Deploy projects",
    ctaSecondary: "Download dossier",
    scrollHint: "Descend",
  },
  sections: {
    about: { eyebrow: "STARK.OS // PROFILE", title: "Operator Profile" },
    experience: { eyebrow: "STARK.OS // FIELD LOG", title: "Mission Log" },
    education: { eyebrow: "STARK.OS // ARCHIVE", title: "Training Protocols" },
    skills: { eyebrow: "STARK.OS // ARMORY", title: "Armor Loadout" },
    projects: {
      eyebrow: "STARK.OS // HANGAR",
      title: "Deployed Systems",
      subtitle: "Every unit below is built, shipped, and operational.",
    },
    contact: { eyebrow: "STARK.OS // UPLINK", title: "Open Comm Channel" },
  },
  skills: {
    traceHint: "{used}/{total} components field-deployed",
    usedIn: "Deployed in",
    notUsed: "Field-tested in training builds",
  },
  projects: {
    all: "All units",
    liveLabel: "Launch",
    codeLabel: "Schematics",
    featuredLabel: "Flagship",
  },
  contact: {
    terminalTitle: "comm-relay — secure",
    terminalLines: [
      "establishing uplink…",
      "handshake complete · channel encrypted",
      "operator responds fastest by email",
    ],
    heading: "Open a channel.",
    body: "Comm relay is live and monitored. Transmit via the address below for the fastest response.",
    copyLabel: "Copy address",
    copiedLabel: "Address copied",
    copyFailedLabel: "Press Ctrl+C to copy",
    locationLabel: "Operating from",
  },
  footer: "STARK.OS v4.7.1 — all systems nominal.",
};

export const copy: Record<"default" | "ironman", ModeCopy> = {
  default: defaultCopy,
  ironman: ironManCopy,
};

/**
 * Reads from `mode`, not `pendingMode` — during a transition the words change
 * at the same instant the palette does, when SuitUpSequence calls commitMode().
 */
export function useCopy(): ModeCopy {
  const { mode } = useMode();
  return copy[mode];
}
