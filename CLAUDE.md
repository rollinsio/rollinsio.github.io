# CLAUDE.md

Guidance for Claude Code when editing this repo.

## What this repo is

The single GitHub Pages site for `rollins.io`. The repo is `rollinsio/rollinsio.github.io` — a user-pages repo, so Pages serves its default branch (`main`) root. It hosts the personal home page at `/` and microsites at `/<slug>/`. Today there are four content pages:

- `/` — `index.html` (Michael Rollins · home)
- `/workshop/` — `workshop/index.html` (Agents Building Agents live-build session)
- `/consulting/` — `consulting/index.html` (engineering-leadership working sessions)
- `/links/` — `links/index.html` (linktree-style stacked-button page for sharing in social bios)

Plus a `/design-handoff/` directory containing a React+Babel-in-browser preview of past design variations — kept as a historical reference, not edited as part of the live site.

The legacy `workshop.rollins.io` subdomain is served by a sibling repo (`rollinsio/delta-v-workshop`) that is now just a redirect stub. Do not edit content there.

## Stack

- Pure static HTML. No build system, no package manager, no tests.
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) with the shared `tailwind.config` defined in `/shared/tailwind-init.js`. Tailwind color tokens reference CSS custom properties (`var(--bg)`, `var(--accent)`, …) so the whole utility palette retunes from a single edit to `tokens.css`. Do not introduce a Tailwind build step.
- Google Fonts: **Space Grotesk** (sans display + body) + **Geist Mono** (eyebrow / mono accents).

## Design system

A single white-on-near-black palette across every page, with a fixed-position asteroid-field canvas backdrop. The historical "Aurora Live" treatment (which used to support six palettes, two backdrops, intensity choices, and a dock for switching between them) has been collapsed to one monochromatic look — but the file names (`aurora-live.css`, `aurora-live.js`) and body class (`aurora-page`) are kept for continuity.

- **Palette (CSS custom properties on `:root`, single palette):**
  - `--bg: #08080a`, `--bg-rgb: 8 8 10`
  - `--surface: #121214`, `--rule: #1c1d24`
  - `--fg: #f1f0ff`, `--head: #ffffff`, `--muted: #9098ad`, `--dim: #5a5e80`
  - `--accent: #ffffff`, `--accent-rgb: 255 255 255`
  - `--accent2: #e2e8f0`, `--accent2-rgb: 226 232 240`
  - All defined in `shared/tokens.css`. JS does NOT manage the palette at runtime — it just reads `--bg`/`--accent`/`--head` once at startup to colour the canvas.
- **Vocabulary.** Radii **12px** (cards, rows, bullets) / **14px** (tier) / **18px** (`.featured.lg`) / **999px** (pill buttons). Surfaces are translucent (`rgb(var(--bg-rgb) / 0.62)` or `0.92`) with `backdrop-filter: blur(8–14px)` and a 1px `var(--rule)` border. **`.featured` and `.tier.featured`** use a 1px gradient *outer* (accent → accent2) wrapping a `> .inner` translucent block — **the `> .inner` wrapper is REQUIRED**, otherwise the gradient outer renders directly and text disappears against near-white. **Primary CTAs** are gradient pills (`linear-gradient(90deg, var(--accent), var(--accent2))`). **`.eyebrow`** is uppercase mono, letter-spacing 0.18em. **`.bullet`** is a translucent rounded row with an accent dot prefix.
- **Backdrop.** `<canvas>` fills the viewport, drawing a vector-style asteroid field with an auto-piloting ship. The ship has Asteroids-style physics — forward-only thrust along its facing angle, separate `vx/vy` velocity with friction (`* 0.985`/frame) and a max-speed cap, so it accelerates, coasts past targets, and curves back instead of teleporting. It rotates toward a movement target (cursor when active, lazy lissajous drift otherwise; cursor mode uses softer accel + lower max speed so it glides instead of darting), thrusts only past an arrival radius and when roughly aligned, and the thrust flame only renders when the engine is firing this frame. Shooting is opportunistic — bullets fire whenever an asteroid drifts into the forward arc. Behind the canvas: two large radial-gradient glow blurs (`mix-blend-mode: screen`) and a center vignette darken the area where copy sits.
- **Per-page backdrop config via body data attributes:**
  - `data-aurora-asteroids="N"` — asteroid count (default 6 if absent). `0` = empty field.
  - `data-aurora-ship="off"` — hide the ship entirely.
  - If both attrs leave nothing to animate, the rAF loop short-circuits and the canvas stays transparent (so the glows + vignette still show through).
  - Current page settings: home `12`, workshop `3`, consulting `1`, links `0` + `ship="off"`.
- **No dock, no palette switcher, no localStorage.** Each page declares exactly what it wants via the data attributes above; there's nothing to persist.
- **Reduced motion.** `prefers-reduced-motion: reduce` short-circuits canvas init; glows + vignette stay (static). `<html data-reduced-motion="true">` lets CSS suppress any motion.
- **Identity header.** `.avatar.sm` (80px conic-gradient ring) anchored at the same Y across every page: `<main>` uses `py-12 md:py-16`, `<nav>` has `mb-10`, and the avatar sits at the top of a `text-center` `<header>` with `mx-auto mb-3`. Don't drift these values per page — they're what keeps the avatar from jumping when you click between pages. The base `.avatar` (130px) defined in `base.css` is unused on the live pages, kept only for the design-handoff exploration files. Container width and body layout differ by page purpose:
  - **`/`** — editorial / expansive at `max-w-prose` (38rem). Centered hero with two-line h1 (line 1 plain `--fg`, line 2 surname is `.aurora-text` clipped to `accent → accent2` gradient — currently invisible because both vars are near-white; harmless), a `.bullet` list, stacked `.featured.lg` callouts for Workshop and Consulting, then `.row-link` "Elsewhere" directory.
  - **`/workshop/`** — content-dense at `max-w-3xl`. Identity header, editorial hero, curriculum (`.step`), logistics (`.kv`), requirements (`.card` grid), pricing tiers (`.tier`, Standard wrapped in `.tier.featured > .inner`), Formspree interest form (see below), FAQ (`details.qa`).
  - **`/consulting/`** — content-dense at `max-w-3xl`. Same identity-header pattern. Hero, "The shift" (3-card grid), Approach (steps 01–05 day-1 + day-divider + steps 06–07 day-2), Outcomes (4-card grid), Engagements (two `.tier` cards — Two-day uses `.tier.featured > .inner` for Recommended emphasis), Logistics `.kv` card, FAQ.
  - **`/links/`** — share-targeted at `max-w-sm` (24rem). Centered identity, stacked `.featured` Workshop + Consulting tiles, then a stack of `.link-btn` rows. Optimized for being pasted into social bios.

## Directory layout

```
.
├── CNAME                  rollins.io
├── .nojekyll              tells Pages to serve raw — no Jekyll processing (needed for design-handoff/*.jsx)
├── index.html             home page
├── workshop/index.html    workshop page (page-only CSS: .interest-form fields)
├── consulting/index.html  consulting page (page-only CSS: .day-divider)
├── links/index.html       share-targeted link landing (no page-specific CSS)
├── design-handoff/        historical design exploration — React+Babel-in-browser preview, not part of the live site
└── shared/
    ├── tailwind-init.js   shared tailwind.config — color tokens reference CSS vars
    ├── tokens.css         CSS custom properties on :root (single white palette), body bg/fg/font, ::selection
    ├── base.css           .eyebrow, .link, .row-link, .bullet, .card, .avatar (+ .sm modifier), .fade-in, reduced-motion guard
    ├── components.css     .btn / .btn-primary / .btn-ghost, .kv, .link-btn, .featured (+ .lg), .tier (+ .featured), .step, details.qa
    ├── aurora-live.css    canvas backdrop scaffold — #aurora-root, canvas, .aurora-glow-*, .aurora-vignette; body.aurora-page padding
    └── aurora-live.js     asteroid + ship draw loop, reads body data attrs for per-page config, reduced-motion guard
```

## Editing rules

- **Tokens, shared utilities, the fade-in animation, the backdrop scaffold, and the Tailwind config live in `/shared/`.** Pages should not need any inline `<style>` block by default — page-specific styles are an exception (e.g. workshop's `.interest-form` inputs, consulting's `.day-divider`).
- **Never duplicate a class definition between a page and `/shared/`.** If two pages need the same class, move it to `base.css` or `components.css`.
- Color and font tokens read from CSS custom properties (`--bg`, `--fg`, `--accent`, `--accent2`, `--muted`, etc.). Components must reference these — never hard-code hex values — so a palette retune (or future multi-palette return) works end-to-end. Tailwind utilities (`bg-bg`, `text-accent`, `text-accent2`, `border-rule`, `font-mono`, etc.) are wired to the same vars.
- **`.featured` and `.tier.featured` require a `<div class="inner">…</div>` child wrapper.** Without it the gradient outer renders directly and text vanishes against near-white. This is the highest-frequency bug.
- Cross-page links use absolute paths (`/`, `/workshop/`, `/consulting/`, `/links/`) so they work whether served from `rollins.io` root or a local `python3 -m http.server`.
- Nav order is `home · workshop · consulting · links` across every page. The current page is rendered as a plain `text-fg` span, others as `link` anchors.

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
3. Add `class="aurora-page"` to `<body>`, plus the per-page backdrop attrs you want:
   ```html
   <body class="aurora-page antialiased" data-aurora-asteroids="3">
   ```
4. Open with the shared top-nav and centered identity header so the brand reads consistently:
   ```html
   <nav class="text-center mb-10 fade-in">
       <div class="eyebrow flex justify-center items-center gap-3 flex-wrap">
           <a href="/" class="link">home</a>
           <span class="text-dim">·</span>
           <a href="/workshop/" class="link">workshop</a>
           <span class="text-dim">·</span>
           <a href="/consulting/" class="link">consulting</a>
           <span class="text-dim">·</span>
           <a href="/links/" class="link">links</a>
       </div>
   </nav>
   <header class="text-center mb-14 fade-in">
       <a href="/" aria-label="Back to rollins.io" class="avatar sm mx-auto mb-3">MR</a>
       <div class="eyebrow"><slug> · rollins.io</div>
   </header>
   ```
5. Compose body sections from the shared vocabulary — `.featured` (gradient-border + `> .inner`) for hero cards, `.bullet` for translucent bullet rows, `.link-btn` for stacked link rows, `.card` + `.kv` for key-value blocks, `.step` for numbered walkthroughs, `.tier` (+ `.tier.featured > .inner`) for pricing-or-engagement cards, `details.qa` for FAQs, `.btn-primary` (gradient pill) / `.btn-ghost` for CTAs.
6. Add `<slug>` to the top nav on the existing four pages, and add a row to home's `Elsewhere` section if it's a "real" destination.

## Preview locally

The pages use absolute paths for `/shared/*`, so `file://` previews don't work. Serve from the repo root:

```sh
cd /Users/rollins/delta-v/web-github-pages/rollins-home
python3 -m http.server 8000
```

Then open `http://localhost:8000/`, `/workshop/`, `/consulting/`, `/links/`.

## Workshop page — content sync points

When editing `workshop/index.html`:

- Sections: Hero, Curriculum (`#details`), Logistics, Requirements (`#requirements`), Pricing (`#pricing`) with three tiers (Supported $29 / Standard $99 / Supporter $199), Express interest (Formspree form, see below), FAQ. The Standard tier uses `.tier.featured > .inner` for accent border + tinted gradient and primary CTA — preserve that emphasis if restyling.
- Duration must stay aligned across: hero subhead ("Two hours, live"), Curriculum intro ("first hour … full hour"), Logistics `Format` ("60m build + 60m Q&A"), and FAQ ("60-minute Q&A").
- Times must stay consistent: hero eyebrow (currently `12:00 ET`) and the Logistics card row (`12:00 ET` + the elsewhere row showing `09:00 PT · 21:30 IST · 17:00 WAT`).
- The workshop date appears in **four** places that must update together: home page Workshop featured card, links page Workshop featured card, workshop page hero eyebrow, workshop page Logistics `Date` row.

### Express interest — Formspree form

The "Express interest" block on `workshop/index.html` is a real form, not a `mailto:`. Endpoint: `https://formspree.io/f/mqenopqj`. Fields: name, email, timezone (optional), notes (optional), plus a `_gotcha` honeypot and a `_subject` hidden input. The submit handler is inline at the bottom of the file — AJAX POST, then swap the form for an inline `#interest-success` block on success or reveal `#interest-error` (which falls back to `mailto:workshop@rollins.io`) on failure.

- Form CSS lives in a small `<style>` block on the workshop page only (`.interest-form .field`, `.lbl`, inputs, `.hp` honeypot positioning). It's the one piece of page-specific CSS this page owns.
- Hiding the form / showing success/error uses Tailwind's `.hidden` *class*, not the HTML `hidden` attribute — because the form has `display: grid` from a utility class, and `[hidden] { display: none }` is a UA-stylesheet rule that gets overridden by any explicit `display`. Always toggle the class.

### Stripe Payment Links

Payment Links keep the site truly static (no Stripe keys in the repo). Only switch to Stripe.js if a tier needs custom amounts or embedded checkout — and even then only the publishable key would be added; **the secret key must never appear in this repo**. Current links + caps (sum to a 20-seat cap, enforced via Stripe `restrictions.completed_sessions.limit`):

- Supported $29 — `plink_1TUuMdGpOisb6fvvgQcc1fHP`, cap 5, `https://buy.stripe.com/cNi4gz5Z1eED1uC5YE6c000`
- Standard $99 — `plink_1TUuMuGpOisb6fvvEr33r45w`, cap 9, `https://buy.stripe.com/8x2eVd3QT2VVgpw86M6c001`
- Supporter $199 — `plink_1TUuMzGpOisb6fvvpAXyifIL`, cap 6, `https://buy.stripe.com/4gM4gzafh1RR4GOfze6c002`

Rebalance per-link caps in the Stripe Dashboard if demand surprises us — keep the sum at 20.

## Consulting page — content sync points

When editing `consulting/index.html`:

- Sections: Hero, "The shift" (`#why`, 3-card grid), Approach (`#approach`) with Day 1 steps 01–05 + `.day-divider` + optional Day 2 steps 06–07, Outcomes (`#outcomes`, 4-card grid), Engagements (`#engage`) with two `.tier` cards (One-day plain / Two-day uses `.tier.featured > .inner` for Recommended emphasis) followed by a Logistics `.kv` card, FAQ.
- Engagement length must stay aligned across: hero subhead ("One or two days"), Approach intro ("first day stands on its own"), Engagements section copy, and FAQ ("Can you run this remotely?").
- The page is intentionally evergreen — no fixed date.
- All "Inquire" CTAs route to `mailto:contact-me@rollins.io` with engagement-specific subject lines (`Workshop interest — One-day engagement` / `… Two-day engagement`). If a dedicated `consulting@rollins.io` alias is added later, swap those mailtos in.

## Email aliases

The site uses Google Workspace aliases on `rollins.io` so no inbound mail server is needed:

- `workshop@rollins.io` — workshop fallback mailto (inside the Formspree form's error block, and as the "or email" line under the submit button).
- `contact-me@rollins.io` — general contact (`Email` row on home `Elsewhere` and on the links stack) and consulting Inquire CTAs.

Both route to the single Workspace inbox. Use Gmail filters (`to:workshop@…` → label "Workshop"; `to:contact-me@…` → label "Contact") to sort.
