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
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) with the shared `tailwind.config` defined in `/shared/tailwind-init.js`. Do not introduce a Tailwind build step or `tailwind.config.js` unless the site outgrows the CDN.
- Google Fonts: **Inter** (sans display + body) + **JetBrains Mono** (eyebrow / mono accents).

## Design system — modern dark, restrained

- Background `#0a0a0a`, surface `#121212`, border `#1f1f1f`, foreground `#ededed`, muted `#888888`, dim `#5a5a5a`.
- Single accent: ember orange `#ff7a18`, used sparingly — primary CTA, hover states, "live" status dot. Most of the page is neutral.
- No grain, no glow, no italic flourishes, no marginalia, no `§ XX` numbering, no rule-with-label dividers, no "Vol. 01" framing. Minimal animation: a single `fade-in` on each block, no stagger cascade beyond small per-element `animation-delay`.

## Directory layout

```
.
├── CNAME                 rollins.io
├── index.html            home page (page-only CSS: none beyond inline)
├── workshop/
│   └── index.html        workshop page (page-only CSS: .step, .tier, details.qa)
├── links/
│   └── index.html        linktree-style page (page-only CSS: .link-btn, .featured, .avatar)
└── shared/
    ├── tailwind-init.js  shared tailwind.config — do not duplicate
    ├── tokens.css        body bg/fg, font, ::selection
    ├── base.css          .eyebrow, .link, .row-link, .card, .fade-in / @keyframes fade-in, reduced-motion guard
    └── components.css    .btn / .btn-primary / .btn-ghost, .kv  (only link from pages that use these)
```

## Editing rules

- **Tokens, shared utilities, the fade-in animation, and the Tailwind config live in `/shared/`.** Pages own only their page-specific CSS, inlined in `<style>`.
- **Never duplicate a class definition between a page and `/shared/`.** If two pages need the same class, move it to `base.css` (always-loaded) or `components.css` (opt-in).
- Tailwind utility classes from the shared color/font config (`bg-bg`, `text-fg`, `text-muted`, `text-accent`, `border-border`, `bg-surface`, `font-mono`, etc.) are used inline in markup — that's fine.
- Cross-page links use absolute paths (`/`, `/workshop/`, `/links/`) so they work whether served from `rollins.io` root or a local `python3 -m http.server`.

## Adding a new microsite

1. Create `<slug>/index.html`.
2. In `<head>`, link the shared assets in this order:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/shared/tokens.css">
   <link rel="stylesheet" href="/shared/base.css">
   <!-- only if you use .btn / .kv -->
   <link rel="stylesheet" href="/shared/components.css">
   <script src="https://cdn.tailwindcss.com"></script>
   <script src="/shared/tailwind-init.js"></script>
   ```
3. Write only page-specific CSS in a `<style>` block.
4. Add a row to the home `Elsewhere` section linking to the new path, and link back from the new page's footer or top to `/`.

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
- `STRIPE_LINK_SUPPORTED` / `STRIPE_LINK_STANDARD` / `STRIPE_LINK_SUPPORTER` — Stripe Payment Link URLs (one per tier, generated in the Stripe Dashboard). Payment Links keep the site truly static: no Stripe keys live in the repo. Only switch to Stripe.js if a tier needs custom amounts or embedded checkout — and even then only the publishable key would be added (the secret key must never appear in this repo).

In `index.html` (home) and `links/index.html`:
- `ROLLINS_BIO` (home only)
- `WORKSHOP_DATE` (both — keep in sync with workshop page)
- `GITHUB_URL`, `WRITING_URL`, `YOUTUBE_URL`, `X_URL`, `LINKEDIN_URL`, `CAL_URL`, `EMAIL` (both)
