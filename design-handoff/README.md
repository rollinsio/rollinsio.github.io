# Handoff: rollins.io — homepage variations

## Overview

Nine alternate visual treatments of the rollins.io homepage, varying color, mood, type, and (for three of them) live canvas backdrops. The goal is to let you pick a direction — or combine pieces — and reimplement it in the production rollins.io repo, which is plain HTML.

## About the design files

The two files in this folder are **design references**, not production code:

- `Variations.html` — a host page that loads React + Babel from CDN and mounts the prototype.
- `variations.jsx` — all nine variations as inline-JSX React components, using a `<DesignCanvas>` wrapper for side-by-side comparison.

**Do not ship these as-is.** The React/Babel runtime is in there purely so multiple options could share state and live on one canvas. For production, port the variation(s) you choose into rollins.io's existing plain-HTML structure (or add a small bit of vanilla JS where canvas backdrops require it). Every variation's chrome — type, color, layout, bullets, workshop card — is straight HTML + CSS once you strip the React wrapper.

## Fidelity

**High-fidelity.** All colors, fonts, sizes, spacings, borders, and animations are locked in. Recreate pixel-for-pixel using the exact tokens listed below. Where a variation imports a Google Font, link it from the production `<head>`.

## The nine variations

Open `Variations.html` to see them on a pannable canvas, or scroll to the matching `function NAME()` block in `variations.jsx` for the source. All share the same content (`BIO` constant at the top of `variations.jsx`).

### 1. Midnight Amber (baseline — matches the original screenshot)
- **Mood:** Dark, technical, focused.
- **Fonts:** `Inter` (sans, body + headings), `JetBrains Mono` (nav, kicker, domain).
- **Tokens:** `bg #0a0a0a` · `fg #f4f4f4` · `muted #8a8a8a` · `dim #5a5a5a` · `accent #e8782e` · `accentDim #7a3a14` · `card #0f0f0f`.
- **Avatar:** 110px circle, `radial-gradient(circle at 35% 30%, #e8782e, #6a2810 70%, #1a0a04)`.
- **Headline:** 56px / 1.02 / -1.5 letter-spacing / weight 600.

### 2. Paper Editorial
- **Mood:** Warm cream + oxblood, magazine letterhead, italic serif drop-cap.
- **Fonts:** `Newsreader` (serif), `IBM Plex Mono` (mono).
- **Tokens:** `bg #f3eee5` · `fg #1a1612` · `muted #6b5d4f` · `accent #8a2a1f` · `rule #cdc2ad` · `card #ebe4d4`.
- **Headline:** italic + roman pair, 76px / 0.95 / weight 400.
- **Workshop card:** Tab-tag at top-left ("UPCOMING"), 1px rule borders.

### 3. Lab Mono
- **Mood:** Brutalist, terminal, all-monospace.
- **Fonts:** `JetBrains Mono` (everything).
- **Tokens:** `bg #f4f1ea` · `fg #0a0a0a` · `muted #5a5550` · `accent #b3d600` (acid lime) · `rule #c8c2b6`.
- **Headline:** 48px monospace, no anti-aliased serifs. Heavy hairline grid, dotted rules between bullets.

### 4. Aurora
- **Mood:** Deep navy with violet/cyan glow, gradient surname.
- **Fonts:** `Space Grotesk` (sans), `Geist Mono` (mono).
- **Tokens:** `bg #0a0d18` · `fg #ecedf5` · `muted #8b8fa6` · `accent #a78bfa` (violet) · `accent2 #38bdf8` (cyan).
- **Avatar:** 110px conic-gradient ring → solid inner.
- **Surname:** clipped to a violet→cyan linear-gradient.
- **Workshop card:** glassy `rgba(255,255,255,0.04)` + 1px gradient border.

### 5. Sandstone
- **Mood:** Tan + vermillion, italic serif field guide.
- **Fonts:** `Instrument Serif` (display + body), `Geist Mono` (mono).
- **Tokens:** `bg #e8dfce` · `fg #1f1a14` · `muted #6a5d48` · `accent #c4421a`.

### 6. Frost
- **Mood:** Soft white + cobalt gradient, airy product page.
- **Fonts:** `Manrope` (sans), `JetBrains Mono` (mono).
- **Tokens:** `bg #f7f8fb` · `fg #0e1422` · `muted #6a7188` · `accent #1f6feb` · `accent2 #5b8def`.

### 7. Matrix (live canvas)
- **Mood:** Phosphor terminal, full-bleed falling katakana/digit rain.
- **Type:** All-monospace (`JetBrains Mono`).
- **Recolorable.** Six built-in palettes (Classic green, Amber, Ice, Blood, Violet, Bone) — each retunes head color, trail color, glow, headers, and CTA together. Source is in the `Matrix()` component, palette table is the `MATRIX_PALETTES` constant near it.
- **Cursor interaction:** Each rain column has a soft repulsion field around the pointer (radius ~110px, squared falloff) so streams curve around the cursor and spring back.
- **Implementation:** vanilla `<canvas>` + `requestAnimationFrame` — **no React dependency in the loop**. The component just mounts the canvas; the draw function is pure JS. You can lift it directly into a `<script>` block in plain HTML.

### 8. Aurora Rain (live canvas, polished)
- **Mood:** The Aurora chrome on top of Matrix-style rain dimmed to ~55% opacity, with a radial vignette pulling darkness toward the center so type stays crisp.
- **Controls:** Palette (Violet, Emerald, Magenta, Sunset, Ocean, Mono) + Density (Sparse / Medium / Dense / Storm — drives canvas font size 33px → 8px).

### 9. Asteroids (live canvas)
- **Mood:** Vector arcade, self-playing.
- **Behavior:** A vector ship wanders the field on a figure-8 orbit when there's no input; if the cursor enters the artboard, the ship eases toward the cursor; 2.5s after the last pointer event it resumes wandering. Auto-aims at the nearest rock and fires; hits split asteroids into two smaller pieces; the field auto-replenishes when emptied. Score in HUD top-left.
- **Controls:** Palette (Phosphor green, Amber, Ice, Blood, Violet, Bone) + Field (Calm 3 / Field 6 / Belt 10 / Swarm 16 max large asteroids).
- **Implementation:** vanilla `<canvas>` + `requestAnimationFrame`, same as Matrix.

### 10. Aurora Live (combined)
- The Aurora chrome with a docked bottom bar that lets the visitor toggle Rain ↔ Asteroids backdrop, swap palette, and change intensity. Use this if you want the homepage to feel alive and configurable.

## Shared content (BIO)

```
nav: ["home", "workshop", "links"]
domain: "rollins.io"
initials: "MR"
name: "Michael Rollins"
tagline: "Pragmatic engineer and CTO shaping best practices for agentic engineering."
bullets:
  - "Scaled Flurry by Yahoo to 5 billion daily sessions"
  - "Now: agentic systems at Rellify and FD"
  - "Early AI at Outlier"
  - "iOS, Android, backend, frontend, infrastructure"
closer: "Builder, engineer, and host of the Δ-V live-build workshop."
workshop:
  kicker: "UPCOMING WORKSHOP"
  date:   "Thursday, May 14"
  title:  "Agents building Agents"
  body:   "Two hours, live. 60 minutes of coding on screen — Build an agent with Python — then 60 minutes of deep Q&A."
```

## Layout (shared structure for the static variations 1–6)

Vertical column, max-width ~720–760px, centered, padding ~48–56px:

1. **Top nav** — three lowercase mono links separated by `·`, centered.
2. **Avatar block** — 110px circle (gradient or conic), `MR` initials in mono inside, `rollins.io` domain caption directly below in mono/muted.
3. **Headline** — `Michael Rollins`, large display weight (sizes vary per variation).
4. **Tagline** — single sentence, body size, slightly muted.
5. **Bullet list** — four items with a leading `—` or numeric tick (Paper Editorial uses `01..04` mono ticks; Lab Mono uses `>`).
6. **Closer** — single italicized/muted line.
7. **Workshop card** — bordered block, kicker dot + date in mono, h2 title, muted body, `→` CTA top-right.

## Interactions & behavior

- **Static variations (1–6):** none beyond standard link hover. Optional: subtle 1.4× weight transition on nav links.
- **Matrix / Aurora Rain / Asteroids:** live `<canvas>` filling the artboard, see `Matrix`, `AuroraRain`, `Asteroids`, `AuroraLive` components in `variations.jsx`. The draw loops are framework-agnostic — copy the canvas setup + `requestAnimationFrame` body into vanilla JS.
- **Pointer rules for Matrix:** soft repulsion. For Asteroids: easing toward cursor when seen within last 2.5 s, otherwise figure-8 wander.
- **Aurora Live controls:** localStorage-free; current state lives in component state. If you want the chosen palette/intensity to persist across visits, save to `localStorage` on change.

## Design tokens (consolidated)

| Variation | bg | fg | accent | accent2 | font sans/serif | font mono |
|---|---|---|---|---|---|---|
| Midnight Amber | `#0a0a0a` | `#f4f4f4` | `#e8782e` | — | Inter | JetBrains Mono |
| Paper Editorial | `#f3eee5` | `#1a1612` | `#8a2a1f` | — | Newsreader | IBM Plex Mono |
| Lab Mono | `#f4f1ea` | `#0a0a0a` | `#b3d600` | — | JetBrains Mono | JetBrains Mono |
| Aurora | `#0a0d18` | `#ecedf5` | `#a78bfa` | `#38bdf8` | Space Grotesk | Geist Mono |
| Sandstone | `#e8dfce` | `#1f1a14` | `#c4421a` | — | Instrument Serif | Geist Mono |
| Frost | `#f7f8fb` | `#0e1422` | `#1f6feb` | `#5b8def` | Manrope | JetBrains Mono |

Spacing scale used across variations: `8 / 12 / 16 / 18 / 20 / 24 / 28 / 32 / 36 / 48 / 56 / 60` px. Border radii: `12 / 14` for cards, `50%` for avatar, `0` for Lab Mono and Paper Editorial. Shadows: only Aurora variants use them — soft glow halos via `box-shadow: 0 0 60px <accent>33`.

## Assets

No external assets. All visuals are CSS gradients, SVG-free vector drawing on canvas, and Google Fonts.

## Files

- `Variations.html` — host page (loads React + Babel, mounts the canvas).
- `variations.jsx` — all variations and their components.

## Recommended porting steps for a plain-HTML repo

1. Pick one variation (or commit to Aurora Live as the new homepage).
2. Open the matching `function <Name>()` in `variations.jsx`. Each component is one big JSX tree — translate it directly to HTML, replacing `style={{ ... }}` with inline `style="..."` or (preferred) classes in your stylesheet.
3. Add the Google Fonts `<link>` to `<head>`.
4. For canvas variations, copy the canvas-mounting code and the inner draw functions into a `<script>` block — they don't depend on React; the component body is mostly DOM glue you can replace with `document.getElementById` + `addEventListener`.
5. Drop the `<DesignCanvas>` wrapper. The variation is the page.
