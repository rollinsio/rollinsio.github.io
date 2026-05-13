# CLAUDE.md

Guidance for Claude Code when editing this repo.

## What this repo is

The single GitHub Pages site for `rollins.io`. It hosts the personal home page at `/` and microsites at `/<slug>/`. Today there are three pages:

- `/` — `index.html` (Michael Rollins · home)
- `/workshop/` — `workshop/index.html` (Agents Building Agents live-build session)
- `/links/` — `links/index.html` (linktree-style stacked-button page for sharing in social bios)

The legacy `workshop.rollins.io` subdomain is served by a sibling repo (`rollinsio/delta-v-workshop`) that is now just a redirect stub. Do not edit content there.

## Stack

- Pure static HTML. No build system, no package manager, no tests.
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) with the shared `tailwind.config` defined in `/shared/tailwind-init.js`. The Tailwind color tokens reference CSS custom properties (`var(--bg)`, `var(--accent)`, …) so palette swaps reactively retune every utility class. Do not introduce a Tailwind build step.
- Google Fonts: **Space Grotesk** (sans display + body) + **Geist Mono** (eyebrow / mono accents).

## Design system — Aurora Live

The site is themed by the **Aurora Live** treatment (variation #10 in `/design-handoff/`): a fixed-position canvas backdrop with a glassmorphic content layer on top and a docked control bar at the bottom. The chrome is identical on every page; pages own only their content.

- **Palette (CSS custom properties on `:root`, six options at runtime):**
  - `violet` (default) — bg `#0a0e1f`, accent `#a78bfa`, accent2 `#22d3ee`
  - `emerald`, `magenta`, `sunset`, `ocean`, `mono`
  - All vars: `--bg`, `--bg-rgb`, `--surface`, `--rule`, `--fg`, `--head`, `--muted`, `--dim`, `--accent`, `--accent-rgb`, `--accent2`, `--accent2-rgb`.
  - JS swaps all of these on palette change. Every surface (h1 gradient, avatar ring, bullet dots, featured borders, buttons, dock accent) retunes in lockstep.
- **Vocabulary.** Radii **12px** (cards, rows, bullets) / **14px** (tier, dock) / **18px** (`.featured.lg`) / **999px** (pill buttons). Surfaces are translucent (`rgb(var(--bg-rgb) / 0.62)` or `0.92`) with `backdrop-filter: blur(8–14px)` and a 1px `var(--rule)` border. **Featured / `.tier.featured`** use a 1px gradient *outer* (accent → accent2) wrapping a `> .inner` translucent block — preserve the `> .inner` wrapper when restyling. **Primary CTAs** are gradient pills (`linear-gradient(90deg, var(--accent), var(--accent2))`). **`.eyebrow`** is uppercase mono, letter-spacing 0.18em. **`.bullet`** is a translucent rounded row with an accent dot prefix.
- **Backdrop.** `<canvas>` fills the viewport; runtime toggles between **Matrix rain** (with cursor repulsion) and **Asteroids** (self-playing vector ship — auto-aims, asteroid splits on hit). Two large radial-gradient glow blurs (`mix-blend-mode: screen`) and a center vignette darken the area where copy sits.
- **Dock.** Fixed bottom, max-width 920px centered, translucent + accent-tinted, `backdrop-filter: blur(14px)`. Three groups: **Backdrop** (Rain / Asteroids), **Palette** (6 gradient swatches), **Intensity** (Calm / Med / Dense / Storm — drives Matrix density and asteroid count). Mobile collapses to a 3-row stack. Content `<main>` is `padding-bottom: 140px` (200px on mobile) to clear the dock.
- **Persistence.** Choices survive navigation across all three pages via `localStorage` key `aurora-live:v1` with shape `{v:1, paletteKey, backdrop, intensityIdx}`.
- **Reduced motion.** `prefers-reduced-motion: reduce` short-circuits canvas init. Glows + vignette + dock remain (static); `<html data-reduced-motion="true">` lets CSS suppress any dock pulse.
- **All three pages share the centered identity header** — `.avatar` (130px conic-gradient ring + bg-color inner + mono initials) on home, `.avatar.sm` (80px) on workshop / links. The container width and body layout differ by page purpose:
  - **`/`** — editorial / expansive at `max-w-prose` (38rem). Centered hero with two-line h1 (line 1 plain `--fg`, line 2 surname clipped to `accent → accent2` gradient via `.aurora-text`), then a `.bullet` list, then a single gradient-bordered `.featured.lg` workshop callout, then `.row-link` directory of "Elsewhere" links.
  - **`/links/`** — share-targeted at `max-w-sm` (24rem). Centered identity, `.featured` workshop tile, then a stack of `.link-btn` rows. Optimized for being pasted into social bios.
  - **`/workshop/`** — content-dense at `max-w-3xl`. Same centered `.avatar.sm` identity header (the avatar is the back-link to `/`), then editorial hero, curriculum (`.step`), logistics (`.kv`), requirements (`.card` grid), pricing tiers (`.tier`, featured wrapped in `> .inner`), FAQ (`details.qa`).

## Directory layout

```
.
├── CNAME                 rollins.io
├── index.html            home page (no page-specific CSS — all from /shared/)
├── workshop/
│   └── index.html        workshop page (no page-specific CSS — .step, .tier, details.qa live in /shared/components.css)
├── links/
│   └── index.html        share-targeted link landing (no page-specific CSS)
└── shared/
    ├── tailwind-init.js  shared tailwind.config — color tokens reference CSS vars so palette swaps reactively retune Tailwind utilities
    ├── tokens.css        CSS custom properties on :root (default violet palette), body bg/fg/font, ::selection
    ├── base.css          .eyebrow, .link, .row-link, .bullet, .card, .avatar (+ .sm modifier), .fade-in, reduced-motion guard
    ├── components.css    .btn / .btn-primary / .btn-ghost, .kv, .link-btn, .featured (+ .lg), .tier (+ .featured), .step, details.qa
    ├── aurora-live.css   backdrop scaffold — #aurora-root, canvas, .aurora-glow-*, .aurora-vignette, .aurora-dock; body.aurora-page padding
    └── aurora-live.js    palette/intensity constants, MatrixRain + Asteroids draw loops, dock builder, localStorage persistence (aurora-live:v1), reduced-motion guard
```

## Editing rules

- **Tokens, shared utilities, the fade-in animation, the Aurora Live scaffold, and the Tailwind config live in `/shared/`.** Pages should not need any inline `<style>` block at all — page-specific styles are an exception, not the default.
- **Never duplicate a class definition between a page and `/shared/`.** If two pages need the same class, move it to `base.css` or `components.css`.
- Color and font tokens read from CSS custom properties (`--bg`, `--fg`, `--accent`, `--accent2`, `--muted`, etc.). Components must reference these — never hard-code hex values — so palette swaps work end-to-end. Tailwind utilities (`bg-bg`, `text-accent`, `text-accent2`, `border-rule`, `font-mono`, etc.) are wired to the same vars and follow palette changes automatically.
- The `.featured` and `.tier.featured` classes require a `> .inner` child wrapper to render their gradient-border treatment. Always include `<div class="inner">…</div>` inside.
- Cross-page links use absolute paths (`/`, `/workshop/`, `/links/`) so they work whether served from `rollins.io` root or a local `python3 -m http.server`.

## Adding a new microsite

1. Create `<slug>/index.html`.
2. In `<head>`, link the shared assets in this order:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/shared/tokens.css">
   <link rel="stylesheet" href="/shared/base.css">
   <link rel="stylesheet" href="/shared/components.css">
   <link rel="stylesheet" href="/shared/aurora-live.css">
   <script src="https://cdn.tailwindcss.com"></script>
   <script src="/shared/tailwind-init.js"></script>
   <script defer src="/shared/aurora-live.js"></script>
   ```
3. Add `class="aurora-page"` to `<body>` so the backdrop, glows, vignette, and dock mount correctly and the main content gets the right bottom padding to clear the dock.
4. Open with the shared centered identity header so the brand reads consistently. Use the large `.avatar` on the home-style front door, `.avatar.sm` on dense content pages:
   ```html
   <header class="flex flex-col items-center text-center mb-9 fade-in">
       <a href="/" aria-label="Back to rollins.io" class="avatar sm mb-4">MR</a>
       <div class="eyebrow"><slug> · rollins.io</div>
   </header>
   ```
5. Compose body sections from the shared vocabulary — `.featured` (gradient-border + `> .inner`) for hero cards, `.bullet` for translucent bullet rows, `.link-btn` for stacked link rows, `.card` + `.kv` for key-value blocks, `.btn-primary` (gradient pill) / `.btn-ghost` for CTAs. Surname-style gradient text uses `linear-gradient(90deg, var(--accent), var(--accent2))` clipped to text (see `.aurora-text` on `/`).
6. Add a row to the home `Elsewhere` link stack pointing at the new path.

## Preview locally

The pages use absolute paths for `/shared/*`, so `file://` previews don't work. Serve from the repo root:

```sh
cd /Users/rollins/delta-v/web-github-pages/rollins-home
python3 -m http.server 8000
```

Then open `http://localhost:8000/`, `http://localhost:8000/workshop/`, and `http://localhost:8000/links/`.

## Workshop page — content sync points

When editing `workshop/index.html`:

- Sections: Hero, Curriculum (`#details`), Logistics, Requirements (`#requirements`), Pricing (`#pricing`) with three tiers (Supported $29 / Standard $99 / Supporter $199), Express interest, FAQ. The Standard tier uses `.tier.featured` for accent border + tinted gradient and primary CTA — preserve that emphasis if restyling.
- Duration must stay aligned across: hero subhead ("Two hours, live"), Curriculum intro ("first hour … full hour"), Logistics `Format` ("60m build + 60m Q&A"), and FAQ ("60-minute Q&A").
- Times must stay consistent: hero eyebrow ("09:00 PT") and Logistics card ("09:00 PT · 12:00 ET / 17:00 UK · 21:30 IST").
- `WORKSHOP_DATE` appears in **four** places that all must update together: home page workshop card, home page (none other), links page featured card, workshop page hero eyebrow + Logistics + (none in footer currently).

## Placeholders to fill before launch

In `workshop/index.html`:
- `WORKSHOP_DATE` — hero eyebrow, Logistics card.
- `WORKSHOP_EMAIL` — "Express interest" `mailto:` link, the plain-text fallback, copy button. Should be a Google Workspace alias on `rollins.io` (no inbound server needed — site stays static).

Stripe Payment Links are live — Payment Links keep the site truly static (no Stripe keys in the repo). Only switch to Stripe.js if a tier needs custom amounts or embedded checkout — and even then only the publishable key would be added (the secret key must never appear in this repo). Current links + caps (sum to a 20-seat cap, enforced via Stripe `restrictions.completed_sessions.limit`):
  - Supported $29 — `plink_1TUuMdGpOisb6fvvgQcc1fHP`, cap 5, `https://buy.stripe.com/cNi4gz5Z1eED1uC5YE6c000`
  - Standard $99 — `plink_1TUuMuGpOisb6fvvEr33r45w`, cap 9, `https://buy.stripe.com/8x2eVd3QT2VVgpw86M6c001`
  - Supporter $199 — `plink_1TUuMzGpOisb6fvvpAXyifIL`, cap 6, `https://buy.stripe.com/4gM4gzafh1RR4GOfze6c002`
  Rebalance per-link caps in the Stripe Dashboard if demand surprises us — keep the sum at 20.

In `index.html` (home) and `links/index.html`:
- `ROLLINS_BIO` (home only)
- `WORKSHOP_DATE` (both — keep in sync with workshop page)
- `GITHUB_URL`, `WRITING_URL`, `YOUTUBE_URL`, `X_URL`, `LINKEDIN_URL`, `CAL_URL`, `EMAIL` (both)
