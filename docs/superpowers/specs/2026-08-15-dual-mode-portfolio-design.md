# Dual-Mode Portfolio — Design Spec

**Date:** 2026-08-15
**Status:** Approved
**Repo:** `D:\Desktop\Portolio` (Next.js 16, React 19, Tailwind 4, framer-motion 12, react-three-fiber 9)

## Goal

The portfolio ships with a restrained, professional **Default mode** as the landing
experience. A prominent toggle switches the entire site into **Iron Man mode** — a
richer, louder, HUD-driven treatment with a cinematic transition between the two.

Both modes present identical facts. Only palette, typography, chrome, motion, and
framing change.

## Problem with the current code

The Iron Man styling is hardcoded into every component: literal `var(--accent-gold)`
values in inline styles, `STARK.OS //` strings baked into `SectionTitle`, `hud-corners`
classes hardwired into `GlassCard`, a boot sequence embedded in `Hero`. The previous
blue/violet design was hardcoded the same way, one commit earlier.

There is no theming layer. Supporting two modes by extending the current structure
would mean either duplicating every component or scattering `mode === "ironman" ? …`
ternaries across twenty files.

## Architecture

Three tiers, each absorbing a different kind of difference.

### Tier 1 — Design tokens (`data-mode` on `<html>`)

Handles roughly 80% of the visual delta: color, type, radii, shadow, glow, spacing
rhythm. Token sets are defined in `app/globals.css` under `[data-mode="default"]` and
`[data-mode="ironman"]`. Components reference tokens only; they never name a literal
color.

| Token | Default (Editorial Dark) | Iron Man |
|---|---|---|
| `--bg` | `#0a0a0b` | `#0a0a0f` |
| `--bg-elev` | `#121214` | `#111119` |
| `--surface` | `rgba(255,255,255,0.03)` | `rgba(17,17,25,0.75)` |
| `--border` | `rgba(255,255,255,0.09)` | `rgba(255,215,0,0.12)` |
| `--text` | `#ece9e4` | `#f5f0e8` |
| `--text-dim` | `#8b8783` | `#8a8090` |
| `--accent` | `#6366f1` | `#ffd700` |
| `--accent-2` | `#818cf8` | `#e62429` |
| `--accent-3` | — | `#4fc3f7` (arc) |

Iron Man additionally enables global chrome that Default omits entirely: scanlines,
grid background, vignette, viewport corner brackets, noise at higher opacity.

### Tier 2 — Copy dictionary (`lib/copy.ts`)

Every string that differs between modes lives in one file, keyed by mode. Sections read
it through a `useCopy()` hook and never branch on mode themselves. This is the
discipline that prevents ternary sprawl.

```ts
export const copy = {
  default: { nav: {…}, hero: {…}, sections: {…}, cta: {…} },
  ironman: { nav: {…}, hero: {…}, sections: {…}, cta: {…} },
} as const;
```

Persona mapping (Iron Man): About → `OPERATOR PROFILE`, Experience → `MISSION LOG`,
Education → `TRAINING PROTOCOLS`, Skills → `ARMOR LOADOUT`, Projects → `DEPLOYED
SYSTEMS`, Contact → `OPEN COMM CHANNEL`, "Download Resume" → "Download Dossier".

### Tier 3 — Mode-aware primitives

Structural differences are absorbed by shared primitives, not by sections:

- `Panel` — quiet bordered surface in Default; HUD frame with corner brackets and
  top accent in Iron Man. Replaces `GlassCard`.
- `SectionHeading` — eyebrow + title + rule. Replaces `SectionTitle`.
- `Button` — clean hover in Default; magnetic pull + glow in Iron Man. Replaces
  `MagneticButton`.
- `AmbientBackground` — Canvas2D dot field in Default; lazy-loaded react-three-fiber
  `ParticleField` in Iron Man.
- `Reveal` — single scroll-reveal wrapper, replacing repeated `whileInView` blocks.
- Supporting: `StatCounter`, `Tag`, `ArcReactor`, `Eyebrow`.

Only components whose *structure* genuinely differs get two implementations: `Hero`,
`Navbar`, and the background layer.

## Mode state

`components/mode/ModeProvider.tsx` exposes `{ mode, setMode, toggle, isTransitioning }`.

- Persists to `localStorage["portfolio-mode"]`.
- Writes `document.documentElement.dataset.mode`.
- An inline blocking script in `app/layout.tsx` reads localStorage and stamps
  `data-mode` **before first paint**, preventing a flash of the wrong theme on reload.
- First-time visitors always get Default.

## Typography

Fonts move from the render-blocking `<link>` in `layout.tsx` to `next/font/google`.

**Default:** Bricolage Grotesque (display), Inter Tight (body), JetBrains Mono (mono),
Instrument Serif italic (single accent face, used for one word in the hero).

**Iron Man:** Orbitron (display), Rajdhani (body), Share Tech Mono (mono) — loaded with
`preload: false` so they cost nothing until the toggle fires.

## The suit-up transition

`components/mode/SuitUpSequence.tsx` — full-viewport fixed overlay, ~2.0s, five phases:

| t | Phase |
|---|---|
| 0 – 0.25s | Page desaturates and dims |
| 0.25 – 0.6s | Arc reactor SVG ignites center-screen, flickers, throws sparks |
| 0.55 – 1.3s | Shockwave ring expands past the corners; **theme flips under the flash at its peak** |
| 1.3 – 1.7s | Four HUD brackets fly to viewport corners; scanline sweeps top→bottom |
| 1.7 – 2.1s | `> J.A.R.V.I.S. ONLINE` types out; overlay dissolves |

Rules:
- Reverse (Iron Man → Default) is a shorter ~900ms power-down, no boot lines.
- Click or Esc skips to the end at any point.
- `prefers-reduced-motion` collapses the whole thing to a 250ms crossfade.
- The full sequence plays **once per session**; later toggles use an ~800ms short
  version, so the spectacle does not become a tax on every click.

## Section designs

| Section | Default (Editorial Dark) | Iron Man |
|---|---|---|
| **Nav** | Lowercase wordmark, text links, thin active underline. Mode button is the one loud element: pill with an idling arc-reactor ring that spins up on hover | `STARK.OS` + arc dot, Orbitron links in HUD brackets, live status readout; button becomes `EXIT SUIT` |
| **Hero** | Asymmetric 60/40. `AVAILABLE FOR WORK` eyebrow with live dot → large headline with one word in serif italic accent → CTAs → socials. Right: cursor-reactive dot field (Canvas2D). Slow tech ticker along the bottom | Boot sequence → arc reactor behind the name, typing roles, `DEPLOY PROJECTS` / `DOWNLOAD DOSSIER`, 3D suit-build scene |
| **About** | Two-column: pull-quote paragraph + four stat counters | HUD panel; stats as radial gauges that sweep up |
| **Experience** | Quiet vertical timeline, thin rule, tag pills | Dossier cards on an energy conduit with a travelling pulse |
| **Education** | Plain cards, highlights as bullets | HUD frames with completion bars |
| **Skills** | Categories with understated bordered pills | Each category a suit subsystem with a power bar charging on scroll |
| **Projects** (17) | Filterable by the categories already in `lib/data.ts`; featured project spans wide; image zoom on hover | Hologram cards with scanlines, tilt-on-mouse, targeting-style filter row |
| **Contact** | "Let's build something." + email as a large link with underline sweep + copy button | Terminal panel with typing prompt and comm-link buttons |
| **Footer** | Minimal; does not exist today | Same, with HUD treatment |

## Performance

- Default mode ships **no WebGL**. Ambient motion is Canvas2D and CSS only.
- react-three-fiber, three.js, and the Iron Man 3D scenes are dynamically imported and
  load only when Iron Man mode activates.
- Iron Man fonts are not preloaded.

## Data

`lib/data.ts` content is unchanged. Both modes render the same facts. The only possible
edit is adding presentation flags (e.g. `featured`) if a layout needs them.

## Accessibility

- The mode toggle is a real `<button>` with `aria-pressed` and a clear accessible name.
- `prefers-reduced-motion` is honored by the transition and all ambient motion.
- Both palettes must hit WCAG AA for body text against their background.
- The transition overlay is `aria-hidden` and must not trap focus.

## Verification

No test suite exists in this repo and the work is visual, so the evidence is:

1. `npm run lint` — clean.
2. `npm run build` — succeeds.
3. Browser pass on a dev server: toggle both directions, reload persistence, reduced
   motion, viewports at 375 / 768 / 1440, no horizontal scroll at any width.

## Out of scope

- Content/copy rewrites of the underlying facts in `lib/data.ts`.
- Adding a test framework.
- Changing deployment (`netlify.toml` stays as-is).

## Housekeeping (done)

- `public/resume.pdf` merge conflict resolved to the HEAD version (131735 B). The
  alternate 181560 B blob remains in git history at `e85d97f` if it turns out to be
  newer.
- Empty `nextjs/` directory removed.
