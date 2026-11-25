# Dual-Mode Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the portfolio with a restrained Editorial Dark default mode and a toggle that transforms the entire site into an Iron Man HUD experience via a cinematic suit-up transition.

**Architecture:** Three tiers absorb the mode delta. CSS custom properties keyed on `<html data-mode>` handle color/type/chrome. A copy dictionary (`lib/copy.ts`) holds every string that differs. Mode-aware primitives (`Panel`, `SectionHeading`, `Button`, `AmbientBackground`) absorb structural differences so section components never branch on mode. Only `Hero`, `Navbar`, and the background layer get two implementations.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, framer-motion 12, react-three-fiber 9 + three 0.183 (Iron Man only, lazy), lucide-react, `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-08-15-dual-mode-portfolio-design.md`

## Global Constraints

- **Mode values are exactly** `"default"` and `"ironman"`. No other strings.
- **localStorage key is exactly** `"portfolio-mode"`.
- **Components never name a literal color.** All color comes from CSS custom properties. The only exceptions are the token definitions in `globals.css` and WebGL/Canvas code, which cannot read CSS vars cheaply.
- **Sections never branch on mode.** No `mode === "ironman" ? … : …` inside `components/sections/*` except `Hero.tsx`, which is an explicit dispatcher. All other forking goes through tokens, `useCopy()`, or a primitive.
- **Default mode ships no WebGL.** `three` / `@react-three/*` may only be reached through `next/dynamic` with `ssr: false`, mounted only when `mode === "ironman"`.
- **`lib/data.ts` facts are unchanged.** Both modes render identical information.
- **`prefers-reduced-motion` is honored** by the transition and all ambient motion.
- **No test framework is added.** Verification is `npm run lint`, `npm run build`, and a browser pass.
- Every task ends with a commit.

## Verification Commands

Used by every task:

```bash
npm run lint     # must be clean
npm run build    # must succeed
```

Phase gates additionally run `npm run dev` and check in a browser at 375 / 768 / 1440 px.

---

## File Structure

**Create:**

| File | Responsibility |
|---|---|
| `lib/fonts.ts` | `next/font/google` declarations, exports CSS variable class names |
| `lib/copy.ts` | Per-mode string dictionary + `Copy` type |
| `components/mode/ModeProvider.tsx` | Mode state, persistence, transition choreography, `useMode()` |
| `components/mode/ModeScript.tsx` | Inline pre-paint script that stamps `data-mode` |
| `components/mode/ModeToggle.tsx` | The toggle button |
| `components/mode/ArcReactor.tsx` | Reusable arc reactor SVG |
| `components/mode/SuitUpSequence.tsx` | Full-viewport transition overlay |
| `components/ui/Reveal.tsx` | Scroll-reveal wrapper |
| `components/ui/Panel.tsx` | Mode-aware surface (replaces `GlassCard`) |
| `components/ui/SectionHeading.tsx` | Eyebrow + title + rule (replaces `SectionTitle`) |
| `components/ui/Button.tsx` | Mode-aware button/link (replaces `MagneticButton`) |
| `components/ui/Tag.tsx` | Small pill |
| `components/ui/StatCounter.tsx` | Count-up number |
| `components/ui/Footer.tsx` | Minimal footer |
| `components/bg/AmbientBackground.tsx` | Picks background layer by mode |
| `components/bg/DotField.tsx` | Canvas2D cursor-reactive dot field (default mode) |
| `components/sections/HeroDefault.tsx` | Editorial hero |
| `components/sections/HeroIronMan.tsx` | HUD hero + boot sequence |

**Rewrite:** `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `lib/animations.ts`, `components/ui/Navbar.tsx`, `components/ui/ScrollProgress.tsx`, and every file in `components/sections/`.

**Delete:** `components/ui/GlassCard.tsx`, `components/ui/SectionTitle.tsx`, `components/ui/MagneticButton.tsx`, `components/3d/FloatingOrbs.tsx` (unused after rewrite).

**Keep:** `lib/data.ts`, `components/ui/TerminalText.tsx`, `components/3d/HeroScene.tsx`, `components/3d/ParticleField.tsx`.

---

# Phase 1 — Foundation

No visible redesign yet. This phase makes the mode switch real.

### Task 1: Design tokens and fonts

**Files:**
- Create: `lib/fonts.ts`
- Rewrite: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `fontVariables: string` from `lib/fonts.ts` — a space-joined className string applied to `<html>`.
- Produces: CSS custom properties listed below, available under both `[data-mode]` values.

- [ ] **Step 1: Write `lib/fonts.ts`**

```ts
import {
  Bricolage_Grotesque,
  Inter_Tight,
  JetBrains_Mono,
  Instrument_Serif,
  Orbitron,
  Rajdhani,
  Share_Tech_Mono,
} from "next/font/google";

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

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

// Iron Man faces: not preloaded — they cost nothing until the mode activates.
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
  monoIron.variable,
].join(" ");
```

- [ ] **Step 2: Rewrite `app/globals.css` token layer**

Structure, in order: `@import "tailwindcss";` → shared tokens on `:root` → `[data-mode="default"]` → `[data-mode="ironman"]` → base/reset → utilities → reduced-motion.

Mode-specific tokens (both blocks define **every** key — never let one mode inherit a color from the other):

```css
[data-mode="default"] {
  --bg: #0a0a0b;
  --bg-elev: #121214;
  --surface: rgba(255, 255, 255, 0.03);
  --surface-hover: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.09);
  --border-strong: rgba(255, 255, 255, 0.18);
  --text: #ece9e4;
  --text-dim: #8b8783;
  --accent: #6366f1;
  --accent-2: #818cf8;
  --accent-contrast: #0a0a0b;
  --radius: 12px;
  --glow: none;
  --font-display-active: var(--font-display);
  --font-body-active: var(--font-body);
  --font-mono-active: var(--font-mono);
  --heading-transform: none;
  --heading-tracking: -0.02em;
  --chrome-opacity: 0;   /* HUD chrome hidden */
  --noise-opacity: 0.02;
}

[data-mode="ironman"] {
  --bg: #0a0a0f;
  --bg-elev: #111119;
  --surface: rgba(17, 17, 25, 0.75);
  --surface-hover: rgba(17, 17, 25, 0.9);
  --border: rgba(255, 215, 0, 0.12);
  --border-strong: rgba(255, 215, 0, 0.35);
  --text: #f5f0e8;
  --text-dim: #8a8090;
  --accent: #ffd700;
  --accent-2: #e62429;
  --accent-3: #4fc3f7;
  --accent-contrast: #0a0a0f;
  --radius: 4px;
  --glow: 0 0 20px rgba(255, 215, 0, 0.3);
  --font-display-active: var(--font-display-iron);
  --font-body-active: var(--font-body-iron);
  --font-mono-active: var(--font-mono-iron);
  --heading-transform: uppercase;
  --heading-tracking: 0.05em;
  --chrome-opacity: 1;   /* HUD chrome visible */
  --noise-opacity: 0.03;
}
```

`--accent-3` is Iron-Man-only; anything consuming it must supply a fallback:
`var(--accent-3, var(--accent))`.

Base rules use only active-font tokens:

```css
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body-active);
  transition: background-color 0.6s ease, color 0.6s ease;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display-active);
  text-transform: var(--heading-transform);
  letter-spacing: var(--heading-tracking);
  line-height: 1.05;
}
```

Chrome overlays (`.scan-lines`, `.grid-bg`, viewport corner brackets) must be driven by
`opacity: var(--chrome-opacity)` with a transition, so they fade rather than pop.

- [ ] **Step 3: Wire fonts into `app/layout.tsx`**

Remove the three `<link>` tags to `fonts.googleapis.com`. Apply `fontVariables` to `<html>`:

```tsx
import { fontVariables } from "@/lib/fonts";

<html lang="en" className={fontVariables} suppressHydrationWarning>
```

`suppressHydrationWarning` is required because the pre-paint script mutates
`data-mode` on this element before React hydrates.

- [ ] **Step 4: Verify**

```bash
npm run lint && npm run build
```

Acceptance: build succeeds; no network requests to `fonts.googleapis.com` remain in `app/`; grepping `components/` for `#` hex literals in `.tsx` returns only known WebGL/Canvas files.

- [ ] **Step 5: Commit**

```bash
git add lib/fonts.ts app/globals.css app/layout.tsx
git commit -m "feat: add dual-mode design tokens and next/font loading"
```

---

### Task 2: Mode provider and pre-paint script

**Files:**
- Create: `components/mode/ModeProvider.tsx`, `components/mode/ModeScript.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces:

```ts
export type Mode = "default" | "ironman";

export interface ModeContextValue {
  /** The theme currently applied to <html data-mode>. */
  mode: Mode;
  /** Target mode while a transition is running; null otherwise. */
  pendingMode: Mode | null;
  /** True from toggle() until endTransition(). */
  isTransitioning: boolean;
  /** Which choreography to run. "full" only on the first ironman activation. */
  sequenceLength: "full" | "short";
  /** True when the user prefers reduced motion. */
  reducedMotion: boolean;
  /** Begin a transition to the other mode. No-op while transitioning. */
  toggle: () => void;
  /** Apply pendingMode to <html>. Called by SuitUpSequence at its flash peak. */
  commitMode: () => void;
  /** Clear transition state. Called by SuitUpSequence when it finishes. */
  endTransition: () => void;
}

export function useMode(): ModeContextValue;
export default function ModeProvider(props: { children: React.ReactNode }): JSX.Element;
```

This split — `toggle` starts, `commitMode` flips, `endTransition` finishes — is what lets
the theme change *underneath* the shockwave instead of before or after it. Later tasks
depend on these exact names.

- [ ] **Step 1: Write `components/mode/ModeScript.tsx`**

```tsx
const script = `(function(){try{var m=localStorage.getItem('portfolio-mode');if(m!=='ironman'){m='default';}document.documentElement.dataset.mode=m;}catch(e){document.documentElement.dataset.mode='default';}})();`;

export default function ModeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
```

Render this as the **first child of `<head>`** so it runs before first paint. Any later
and the wrong theme flashes on reload.

- [ ] **Step 2: Write `components/mode/ModeProvider.tsx`**

Requirements:
- `"use client"`.
- Initial state reads `document.documentElement.dataset.mode` (already stamped by
  `ModeScript`), falling back to `"default"`. Read it in a `useState` initializer guarded
  by `typeof document !== "undefined"` so SSR gets `"default"`.
- `commitMode()` sets `document.documentElement.dataset.mode` **and** writes
  `localStorage["portfolio-mode"]`, wrapped in `try/catch` (private browsing throws).
- `sequenceLength` is `"full"` only when transitioning *into* `ironman` for the first time
  this session; `"short"` after. Track with a ref, not state — it must not trigger renders.
- `reducedMotion` comes from `window.matchMedia("(prefers-reduced-motion: reduce)")`, and
  subscribes to changes.
- `toggle()` returns early if `isTransitioning` is already true, so double-clicks cannot
  start overlapping sequences.

- [ ] **Step 3: Mount in `app/layout.tsx`**

`ModeScript` first in `<head>`; `ModeProvider` wrapping `{children}` in `<body>`.

- [ ] **Step 4: Verify**

```bash
npm run lint && npm run build
npm run dev
```

Acceptance, checked in the browser console:
1. `document.documentElement.dataset.mode` is `"default"` on a fresh load.
2. Running `localStorage.setItem('portfolio-mode','ironman')` then reloading shows
   `data-mode="ironman"` with **no flash** of the default palette.
3. Hard-reload with DevTools throttled to Slow 3G — still no flash.

- [ ] **Step 5: Commit**

```bash
git add components/mode/ app/layout.tsx
git commit -m "feat: add mode provider with pre-paint theme script"
```

---

### Task 3: Copy dictionary

**Files:**
- Create: `lib/copy.ts`

**Interfaces:**
- Consumes: `Mode` from `components/mode/ModeProvider`.
- Produces: `useCopy(): ModeCopy` and `type ModeCopy`.

Both mode objects must satisfy one shared `ModeCopy` type, so a key added to one and
forgotten in the other is a compile error rather than a runtime `undefined`.

- [ ] **Step 1: Define the shape**

```ts
export interface SectionCopy {
  eyebrow: string;   // small label above the heading
  title: string;     // the heading itself
  subtitle?: string;
}

export interface ModeCopy {
  brand: string;
  nav: { about: string; experience: string; education: string; skills: string; projects: string; contact: string };
  toggle: { enter: string; exit: string; hint: string };
  hero: {
    status: string;
    lead: string;        // line above the name
    tagline: string;
    current: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  sections: {
    about: SectionCopy;
    experience: SectionCopy;
    education: SectionCopy;
    skills: SectionCopy;
    projects: SectionCopy;
    contact: SectionCopy;
  };
  projects: { all: string; statusLabel: string; liveLabel: string; codeLabel: string };
  contact: { heading: string; body: string; emailLabel: string; copyLabel: string; copiedLabel: string };
  footer: string;
}
```

- [ ] **Step 2: Fill both dictionaries**

Default mode is plain and literal: `sections.about = { eyebrow: "01 — About", title: "About" }`,
`toggle.enter = "Iron Man Mode"`, `hero.ctaSecondary = "Download Resume"`.

Iron Man mode uses the persona: `sections.about = { eyebrow: "STARK.OS // 01", title: "Operator Profile" }`,
`experience.title = "Mission Log"`, `education.title = "Training Protocols"`,
`skills.title = "Armor Loadout"`, `projects.title = "Deployed Systems"`,
`contact.title = "Open Comm Channel"`, `toggle.exit = "Exit Suit"`,
`hero.ctaSecondary = "Download Dossier"`.

Persona copy reframes; it never invents credentials. Every factual claim still traces to
`lib/data.ts`.

- [ ] **Step 3: Export the hook**

```ts
export function useCopy(): ModeCopy {
  const { mode, pendingMode, isTransitioning } = useMode();
  // During a transition, show the incoming mode's words only after commitMode()
  // has flipped `mode` — otherwise text changes before the visuals catch up.
  return copy[mode];
}
```

- [ ] **Step 4: Verify**

```bash
npm run lint && npm run build
```

Acceptance: `tsc` accepts both dictionaries against `ModeCopy`. Temporarily deleting one
key from the `ironman` object produces a type error (confirm, then restore).

- [ ] **Step 5: Commit**

```bash
git add lib/copy.ts
git commit -m "feat: add per-mode copy dictionary"
```

---

### Task 4: Animation variant sets

**Files:**
- Rewrite: `lib/animations.ts`

**Interfaces:**
- Produces: `motionSet(mode: Mode)` returning `{ reveal, stagger, item, heading }` as
  framer-motion `Variants`.

Default motion is restrained: short travel (16px), 0.5s, ease-out, no blur, no scale.
Iron Man motion is dramatic: blur-in, x-offset, flicker, longer stagger. Keep the existing
`hudFlicker` / `hologramIn` / `arcReactorPulse` variants — they are good and are reused by
the Iron Man components.

Delete `cardHover` and `glowPulse` if nothing consumes them after Phase 4.

- [ ] **Step 1: Implement `motionSet`**
- [ ] **Step 2: Verify** — `npm run lint && npm run build`
- [ ] **Step 3: Commit**

```bash
git add lib/animations.ts
git commit -m "feat: split animation variants by mode"
```

---

**PHASE 1 GATE:** `data-mode` persists across reloads with no flash, both token sets
resolve, fonts load from `next/font`. The site still looks like the old Iron Man version —
that is expected and correct at this point.

---

# Phase 2 — Primitives

### Task 5: Reveal, Tag, StatCounter

**Files:**
- Create: `components/ui/Reveal.tsx`, `components/ui/Tag.tsx`, `components/ui/StatCounter.tsx`

**Interfaces:**
- Produces:

```ts
function Reveal(props: {
  children: React.ReactNode;
  delay?: number;      // seconds, default 0
  as?: "div" | "li" | "section";
  className?: string;
}): JSX.Element;

function Tag(props: { children: React.ReactNode; accent?: boolean }): JSX.Element;

function StatCounter(props: {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;   // seconds, default 1.6
}): JSX.Element;
```

`Reveal` wraps `whileInView` with `viewport={{ once: true, margin: "-80px" }}` and pulls
its variants from `motionSet(mode)`. It replaces every ad-hoc `initial`/`whileInView` pair
in the sections — those must not survive Phase 4.

`StatCounter` must count only once, on first view, and must render the final value
immediately when `reducedMotion` is true.

- [ ] **Step 1: Implement the three components**
- [ ] **Step 2: Verify** — `npm run lint && npm run build`
- [ ] **Step 3: Commit**

```bash
git add components/ui/Reveal.tsx components/ui/Tag.tsx components/ui/StatCounter.tsx
git commit -m "feat: add Reveal, Tag and StatCounter primitives"
```

---

### Task 6: Panel, SectionHeading, Button

**Files:**
- Create: `components/ui/Panel.tsx`, `components/ui/SectionHeading.tsx`, `components/ui/Button.tsx`
- Delete: `components/ui/GlassCard.tsx`, `components/ui/SectionTitle.tsx`, `components/ui/MagneticButton.tsx`

**Interfaces:**
- Consumes: `useMode`, `useCopy`, `motionSet`, `Reveal`.
- Produces:

```ts
function Panel(props: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;   // default true — lift + border brighten on hover
  accent?: string;         // CSS color for a per-card accent, e.g. project.color
}): JSX.Element;

function SectionHeading(props: {
  section: keyof ModeCopy["sections"];   // reads eyebrow/title/subtitle from useCopy()
  align?: "left" | "center";             // default "left"
}): JSX.Element;

function Button(props: {
  children: React.ReactNode;
  href?: string;            // renders <a> when present, <button> otherwise
  onClick?: () => void;
  variant?: "primary" | "ghost";   // default "ghost"
  download?: boolean;
  external?: boolean;       // adds target=_blank + rel=noopener noreferrer
}): JSX.Element;
```

`SectionHeading` takes a **section key, not a title string** — that is what stops sections
from importing copy directly and re-introducing mode branching.

`Panel` in default mode: `background: var(--surface)`, `1px solid var(--border)`,
`border-radius: var(--radius)`, hover lifts 2px and brightens the border. In Iron Man mode
it additionally renders corner brackets and a top accent line, gated on
`--chrome-opacity` so it fades in with the transition rather than popping.

`Button` magnetism (cursor-following translate) is **Iron-Man-only**, and disabled under
`reducedMotion`.

- [ ] **Step 1: Implement `Panel`**
- [ ] **Step 2: Implement `SectionHeading`**
- [ ] **Step 3: Implement `Button`**
- [ ] **Step 4: Delete the three replaced components**
- [ ] **Step 5: Verify** — `npm run lint && npm run build`

Build will fail until Phase 4 rewrites the sections that import the deleted files. If so,
leave the deletions staged and complete Task 6's build check at the end of Task 16 — note
it in the commit message rather than restoring the old files.

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: replace GlassCard/SectionTitle/MagneticButton with mode-aware primitives"
```

---

### Task 7: Ambient background

**Files:**
- Create: `components/bg/AmbientBackground.tsx`, `components/bg/DotField.tsx`

**Interfaces:**
- Produces: `AmbientBackground(): JSX.Element` — mounts `DotField` when
  `mode === "default"`, and the lazy `ParticleField` when `mode === "ironman"`.

```tsx
const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), { ssr: false });
```

`DotField` requirements — Canvas2D, **no WebGL**:
- Fixed, full-viewport, `pointer-events: none`, `z-index: 0`.
- Sparse dot grid (~40px spacing) in `--text-dim` at very low alpha.
- A soft radial spotlight follows the cursor, raising dot alpha within ~180px.
- Reads its colors from `getComputedStyle(document.documentElement)` so it tracks tokens.
- Handles DPR and `resize`; cancels its RAF loop on unmount.
- Renders one static frame and starts no loop when `reducedMotion` is true.

- [ ] **Step 1: Implement `DotField`**
- [ ] **Step 2: Implement `AmbientBackground`**
- [ ] **Step 3: Verify** — `npm run lint && npm run build`

Acceptance: in default mode, DevTools → Network filtered to JS shows **no `three` chunk**.
Toggling to Iron Man loads it on demand.

- [ ] **Step 4: Commit**

```bash
git add components/bg/
git commit -m "feat: add mode-aware ambient background with Canvas2D default"
```

---

**PHASE 2 GATE:** Primitives render in both modes. Default mode loads no `three` chunk.

---

# Phase 3 — Chrome and the transition

### Task 8: Navbar and ModeToggle

**Files:**
- Rewrite: `components/ui/Navbar.tsx`
- Create: `components/mode/ModeToggle.tsx`

**Interfaces:**
- Consumes: `useMode`, `useCopy`, `ArcReactor` (Task 9 — build `ArcReactor` first if
  working strictly in order; it is listed under Task 9 because the sequence is its main
  consumer).
- Produces: `ModeToggle(): JSX.Element`.

`ModeToggle` requirements:
- A real `<button>` with `aria-pressed={mode === "ironman"}` and an accessible name from
  `copy.toggle.enter` / `copy.toggle.exit`.
- Contains a small `ArcReactor` that idles with a slow pulse and spins up on hover.
- `disabled` while `isTransitioning`.
- This is the single loudest element in default mode — it is the hook. Give it a visible
  ring, a warm gradient bleed on hover, and a slight scale on press.

Navbar keeps its existing scroll-spy `IntersectionObserver` and mobile overlay logic —
that code is sound. What changes: labels come from `useCopy()`, colors from tokens, the
brand renders `copy.brand`, and Iron Man mode adds a status readout. Active-link
indicator keeps `layoutId="nav-indicator"`.

- [ ] **Step 1: Implement `ModeToggle`**
- [ ] **Step 2: Rewrite `Navbar`**
- [ ] **Step 3: Verify** — `npm run lint && npm run build`

Acceptance: keyboard `Tab` reaches the toggle; `Enter` and `Space` both fire it; screen
reader announces pressed state.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Navbar.tsx components/mode/ModeToggle.tsx
git commit -m "feat: add mode toggle and rewrite navbar against tokens"
```

---

### Task 9: Arc reactor and suit-up sequence

**Files:**
- Create: `components/mode/ArcReactor.tsx`, `components/mode/SuitUpSequence.tsx`

**Interfaces:**
- Consumes: `useMode` — specifically `isTransitioning`, `pendingMode`, `sequenceLength`,
  `reducedMotion`, `commitMode`, `endTransition`.
- Produces:

```ts
function ArcReactor(props: {
  size?: number;        // px, default 64
  intensity?: number;   // 0..1 glow strength, default 1
  spinning?: boolean;   // default false
}): JSX.Element;

function SuitUpSequence(): JSX.Element | null;   // null when !isTransitioning
```

**Choreography — full, entering Iron Man (~2.05s):**

| Start | End | Phase | What happens |
|---|---|---|---|
| 0.00 | 0.25 | DIM | Overlay fades in; `backdrop-filter: saturate(0.15) brightness(0.45)` |
| 0.25 | 0.60 | IGNITE | `ArcReactor` scales 0→1 with a flicker; 8–12 sparks fly outward |
| 0.55 | 1.30 | SHOCKWAVE | Ring scales past the corners; **`commitMode()` fires at 0.95s**, masked by a 15% gold flash |
| 1.30 | 1.70 | ASSEMBLE | Four corner brackets fly in; scanline sweeps top→bottom |
| 1.70 | 2.05 | BOOT | `> J.A.R.V.I.S. ONLINE` types out; overlay fades; `endTransition()` |

**Short version (~0.8s):** DIM 0–0.15, SHOCKWAVE 0.15–0.55 with `commitMode()` at 0.35,
fade out to 0.8. No sparks, no boot text.

**Exiting Iron Man (~0.9s):** reactor dims and collapses, brackets retract,
`commitMode()` at 0.45, fade out. No boot lines.

**Reduced motion:** render a plain 250ms opacity crossfade; call `commitMode()` at 125ms
and `endTransition()` at 250ms. No reactor, no sparks, no scanline.

Hard requirements:
- `commitMode()` and `endTransition()` fire **exactly once** per run. Drive them from a
  timeline of `setTimeout`s created in one `useEffect`, and clear every timer in the
  cleanup — a re-render mid-sequence must not double-fire them.
- Skip on click anywhere or `Escape`: clear pending timers, then call `commitMode()` (if
  not already called) and `endTransition()` immediately.
- Overlay is `aria-hidden="true"`, `pointer-events: auto` while running (to catch the skip
  click), and must not move focus. Focus stays on the toggle throughout.
- `position: fixed; inset: 0; z-index: 10000` — above the noise and scanline overlays.

- [ ] **Step 1: Implement `ArcReactor`** — concentric SVG rings, a triangular core, and an
  animated glow. Colors from tokens with fallbacks so it also renders in default mode
  (the toggle uses it there).
- [ ] **Step 2: Implement the full-entry timeline**
- [ ] **Step 3: Add the short and exit variants**
- [ ] **Step 4: Add the reduced-motion path and the skip handler**
- [ ] **Step 5: Verify** — `npm run lint && npm run build`

Acceptance, in the browser:
1. Toggle to Iron Man — full sequence plays; theme visibly flips *during* the shockwave,
   not before or after.
2. Toggle back — power-down plays, ~0.9s.
3. Toggle to Iron Man again — short version, ~0.8s.
4. Click mid-sequence — jumps to the end cleanly, no stuck overlay.
5. Emulate `prefers-reduced-motion: reduce` — plain crossfade, no reactor.
6. Double-click the toggle rapidly — one sequence, never two.

- [ ] **Step 6: Commit**

```bash
git add components/mode/ArcReactor.tsx components/mode/SuitUpSequence.tsx
git commit -m "feat: add arc reactor and suit-up transition sequence"
```

---

### Task 10: Global chrome, ScrollProgress, Footer

**Files:**
- Rewrite: `components/ui/ScrollProgress.tsx`
- Create: `components/ui/Footer.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`

Global chrome (noise, scanlines, grid, vignette, viewport corner brackets) lives in
`layout.tsx` and is driven entirely by `--chrome-opacity` / `--noise-opacity`, so it fades
with the mode rather than mounting and unmounting.

`Footer` shows the name, `copy.footer`, and social links. Minimal in both modes.

- [ ] **Step 1: Rewrite `ScrollProgress` against tokens**
- [ ] **Step 2: Implement `Footer`**
- [ ] **Step 3: Move chrome overlays into a single `<GlobalChrome/>` block in `layout.tsx`**
- [ ] **Step 4: Verify** — `npm run lint && npm run build`
- [ ] **Step 5: Commit**

```bash
git add components/ui/ScrollProgress.tsx components/ui/Footer.tsx app/layout.tsx app/globals.css
git commit -m "feat: add token-driven global chrome and footer"
```

---

**PHASE 3 GATE:** The toggle works end to end, in both directions, with all three
choreographies and reduced motion. This is the demo-able milestone.

---

# Phase 4 — Sections

Each task follows the same shape: rewrite the section against primitives, remove every
inline hex color and ad-hoc `whileInView`, source all strings from `useCopy()`, verify,
commit. Sections **must not** branch on mode (except `Hero`, the dispatcher).

Design direction per section is specified in the spec's section table. These tasks
intentionally specify **contract and acceptance criteria rather than literal JSX** — the
layout work is visual and is done at the keyboard with the `frontend-design` skill loaded.

### Task 11: Hero

**Files:**
- Rewrite: `components/sections/Hero.tsx` (dispatcher only)
- Create: `components/sections/HeroDefault.tsx`, `components/sections/HeroIronMan.tsx`

`Hero.tsx` is a three-line dispatcher: read `mode`, render one of the two. The Iron Man
boot sequence currently living in `Hero.tsx` moves into `HeroIronMan.tsx` unchanged in
behavior. `HeroScene` stays lazy and Iron-Man-only.

`HeroDefault` requirements: asymmetric 60/40 layout; eyebrow with a live status dot;
headline at `clamp(2.75rem, 8vw, 6rem)` with exactly one word in `var(--font-serif)`
italic and `var(--accent)`; two CTAs; social row; slow tech ticker along the bottom. No
WebGL.

Acceptance: the boot sequence plays **only** in Iron Man mode; default hero reaches
first contentful paint with no `three` chunk requested.

- [ ] **Step 1: Extract the boot sequence into `HeroIronMan`**
- [ ] **Step 2: Build `HeroDefault`**
- [ ] **Step 3: Reduce `Hero.tsx` to the dispatcher**
- [ ] **Step 4: Verify** — lint, build, and check both modes at 375 / 768 / 1440
- [ ] **Step 5: Commit** — `git commit -m "feat: split hero into default and iron man variants"`

### Task 12: About

Two-column in default: pull-quote paragraph + four `StatCounter`s from `stats` in
`lib/data.ts`. Iron Man: same content in a `Panel` with stats as radial gauges.

- [ ] **Step 1: Rewrite** — [ ] **Step 2: Verify** — [ ] **Step 3: Commit**

### Task 13: Experience and Education

Both are timeline/list shapes and share layout logic; do them together. Default: thin
vertical rule, role/company/period, `Tag` pills. Iron Man: dossier cards on an energy
conduit with a travelling pulse; Education gains completion bars.

- [ ] **Step 1: Rewrite Experience** — [ ] **Step 2: Rewrite Education** — [ ] **Step 3: Verify** — [ ] **Step 4: Commit**

### Task 14: Skills

Default: categories with understated bordered pills. Iron Man: each category a suit
subsystem with a power bar that charges when scrolled into view. Data is the `skills`
object in `lib/data.ts` — six categories.

- [ ] **Step 1: Rewrite** — [ ] **Step 2: Verify** — [ ] **Step 3: Commit**

### Task 15: Projects

The largest section — 17 entries. Filter by the `category` values already in
`lib/data.ts` (`Full Stack Web App`, `Mobile App`, `Frontend App`, `Website App`,
`Applications`), plus an "All" default from `copy.projects.all`. The `featured` entry
spans wide. Cards use `Panel` with `accent={project.color}`.

Filtering must use `layout` animations so cards move rather than pop. Iron Man adds
hologram scanlines and tilt-on-mouse.

Note: `lib/data.ts` contains two near-duplicate SSJ entries and two News entries with the
same `link`. Leave the data alone — flag it to the user at the end rather than editing
facts unasked.

- [ ] **Step 1: Build the filter row** — [ ] **Step 2: Build the card grid** — [ ] **Step 3: Add Iron Man hologram treatment** — [ ] **Step 4: Verify** — [ ] **Step 5: Commit**

### Task 16: Contact

Default: large statement, email as an oversized link with an underline sweep, copy-to-
clipboard button using `copy.contact.copiedLabel` for feedback, socials, location. Iron
Man: terminal panel with a typing prompt.

Clipboard write must be wrapped in `try/catch` — it rejects on insecure origins.

- [ ] **Step 1: Rewrite** — [ ] **Step 2: Verify** — [ ] **Step 3: Commit**

---

**PHASE 4 GATE:** All sections render correctly in both modes at all three breakpoints.

---

# Phase 5 — Integration

### Task 17: Wire up and prune

**Files:**
- Rewrite: `app/page.tsx`
- Delete: `components/3d/FloatingOrbs.tsx` and any other now-unreferenced file

`page.tsx` composes `AmbientBackground`, `Navbar`, `ScrollProgress`, the sections,
`Footer`, and `SuitUpSequence`. `SuitUpSequence` renders last so it stacks above
everything.

- [ ] **Step 1: Rewrite `page.tsx`**
- [ ] **Step 2: Delete unreferenced components**
- [ ] **Step 3: Confirm nothing imports the deleted files**

```bash
grep -rn "GlassCard\|SectionTitle\|MagneticButton\|FloatingOrbs" app components lib
```

Expected: no matches.

- [ ] **Step 4: Verify** — `npm run lint && npm run build`
- [ ] **Step 5: Commit** — `git commit -m "feat: wire dual-mode page and remove dead components"`

### Task 18: Full verification pass

- [ ] **Step 1: Clean build**

```bash
rm -rf .next && npm run build
```

- [ ] **Step 2: Browser matrix** — for each of 375 / 768 / 1440 px, in **both** modes:
  - No horizontal scrollbar.
  - Nav, hero, all six sections, and footer render correctly.
  - No text overlaps or clips; the hero headline never overflows.

- [ ] **Step 3: Mode behavior**
  - Toggle both directions; full → short sequence progression.
  - Reload in each mode: correct theme, no flash.
  - Reduced motion: crossfade only, and no ambient animation loops running.

- [ ] **Step 4: Accessibility**
  - Body text hits WCAG AA against `--bg` in both modes. Default: `#ece9e4` on `#0a0a0b`.
    Check `--text-dim` (`#8b8783` on `#0a0a0b`) — if it lands under 4.5:1, lighten it and
    update the token.
  - Toggle is keyboard reachable and announces its pressed state.
  - Focus is never trapped by the transition overlay.

- [ ] **Step 5: Performance** — default mode requests no `three` chunk; Iron Man fonts are
  not fetched until the mode activates.

- [ ] **Step 6: Commit any fixes**

---

## Self-Review

**Spec coverage:** Tokens → Task 1. Copy dictionary → Task 3. Primitives → Tasks 5–6.
Mode state and no-flash → Task 2. Suit-up transition (all four choreographies) → Task 9.
Typography → Task 1. Per-section designs → Tasks 11–16. Footer → Task 10. Performance
constraints → Tasks 7, 11, 18. Accessibility → Tasks 8, 9, 18. Housekeeping → already
done before this plan. No gaps.

**Placeholder scan:** No TBDs. Section tasks (11–16) deliberately carry contracts and
acceptance criteria instead of literal JSX; this is called out in the Phase 4 preamble and
is a considered decision for creative layout work, not an omission.

**Type consistency:** `Mode`, `ModeContextValue`, `useMode`, `useCopy`, `ModeCopy`,
`SectionCopy`, `motionSet`, `Panel`, `SectionHeading`, `Button`, `Reveal`, `Tag`,
`StatCounter`, `ArcReactor`, `SuitUpSequence`, `AmbientBackground`, `DotField` are each
defined once and referenced consistently. The `toggle` / `commitMode` / `endTransition`
triple is defined in Task 2 and consumed with those exact names in Task 9.
