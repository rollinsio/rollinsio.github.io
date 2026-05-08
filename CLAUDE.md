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
- Card / button / featured radius is **6px** site-wide. Interactive cards (`a.card`, `.link-btn`, `.featured`, `.btn`) lift `translateY(-1px)` on hover with an ember border accent. Non-interactive cards just shift to a slightly lighter border on hover.
- All three pages share the same identity header: a centered `.avatar` gradient circle with "MR" initials over a small `eyebrow` mark. The container width and body layout differ by page purpose:
  - **`/`** — editorial / expansive at `max-w-prose` (38rem). Big left-aligned `text-4xl md:text-5xl` h1, multi-paragraph hero, ember-tinted `.featured.lg` workshop callout, then a `.row-link` directory of "Elsewhere" links. This is the front door — generous spacing, breathing room.
  - **`/links/`** — share-targeted at `max-w-sm` (24rem). Centered identity, ember-tinted `.featured` workshop tile, then a stack of `.link-btn` rows. Optimized for being pasted into social bios.
  - **`/workshop/`** — content-dense at `max-w-3xl`. Same centered `.avatar` identity header (the avatar is the back-link to `/`), then editorial hero, curriculum, logistics, requirements, pricing tiers, FAQ.
- No grain, no glow, no italic flourishes, no marginalia, no `§ XX` numbering, no rule-with-label dividers, no "Vol. 01" framing. Minimal animation: a single `fade-in` on each block, no stagger cascade beyond small per-element `animation-delay`.

## Directory layout

```
.
├── CNAME                 rollins.io
├── index.html            home page (no page-specific CSS — all from /shared/)
├── workshop/
│   └── index.html        workshop page (page-only CSS: .step, .tier, details.qa)
├── links/
│   └── index.html        share-targeted link landing (no page-specific CSS — all from /shared/)
└── shared/
    ├── tailwind-init.js  shared tailwind.config — do not duplicate
    ├── tokens.css        body bg/fg, font, ::selection
    ├── base.css          .eyebrow, .link, .row-link, .card (+ a.card lift hover), .fade-in / @keyframes fade-in, reduced-motion guard
    └── components.css    .btn / .btn-primary / .btn-ghost, .kv, .link-btn, .featured (+ .featured.lg modifier), .avatar
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
   <link rel="stylesheet" href="/shared/components.css">
   <script src="https://cdn.tailwindcss.com"></script>
   <script src="/shared/tailwind-init.js"></script>
   ```
3. Open with the shared centered identity header so the brand reads consistently:
   ```html
   <header class="text-center mb-9 fade-in">
       <a href="/" aria-label="Back to rollins.io" class="avatar mx-auto mb-3">MR</a>
       <div class="eyebrow"><slug> · rollins.io</div>
   </header>
   ```
4. Compose body sections from the shared vocabulary — `.featured` for ember-accented hero cards, `.link-btn` for stacked link rows, `.card` + `.kv` for key-value blocks, `.btn` / `.btn-primary` / `.btn-ghost` for CTAs. Write only genuinely page-specific CSS in a `<style>` block.
5. Add a row to the home `Elsewhere` link stack pointing at the new path.

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
