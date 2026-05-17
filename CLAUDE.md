# CLAUDE.md

Guidance for Claude Code when editing this repo.

## What this repo is

The single GitHub Pages site for `rollins.io`. The repo is `rollinsio/rollinsio.github.io` — a user-pages repo, so Pages serves its default branch (`main`) root. It hosts the landing page at `/` and microsites at `/<slug>/`. Today there are four content pages plus one redirect stub:

- `/` — `index.html` (**Agents Building Agents** live-build workshop — this *is* the home/landing page)
- `/about/` — `about/index.html` (Michael Rollins · personal bio + the "Elsewhere" directory; this was the old `/` home)
- `/consulting/` — `consulting/index.html` (engineering-leadership working sessions)
- `/links/` — `links/index.html` (linktree-style stacked-button page for sharing in social bios)
- `/workshop/` — `workshop/index.html` is a **redirect stub → `/`** (meta-refresh + JS, preserves `#hash`). Kept so previously-shared `rollins.io/workshop/` links don't 404. There is no standalone workshop page anymore — the workshop content lives at `/`.

Plus a `/design-handoff/` directory containing a React+Babel-in-browser preview of past design variations — kept as a historical reference, not edited as part of the live site.

The legacy `workshop.rollins.io` subdomain is served by a sibling repo (`rollinsio/delta-v-workshop`) that is now just a redirect stub. Do not edit content there.

## Stack

- Pure static HTML. No build system, no package manager, no tests.
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) with the shared `tailwind.config` defined in `/shared/tailwind-init.js`. Tailwind color tokens reference CSS custom properties (`var(--bg)`, `var(--accent)`, …) so the whole utility palette retunes from a single edit to `tokens.css`. Do not introduce a Tailwind build step.
- Google Fonts: **Space Grotesk** (sans display + body) + **Geist Mono** (eyebrow / mono accents).

## Design system

A static white-on-near-black token base, animated at runtime into a rolling spectrum wave on every page, over a fixed-position asteroid-field canvas backdrop. The historical "Aurora Live" treatment (which used to support six palettes, two backdrops, intensity choices, and a dock) has been collapsed to a single token set — but the file names (`aurora-live.css`, `aurora-live.js`) and body class (`aurora-page`) are kept for continuity.

**The html/body split is load-bearing.** `tokens.css` defines the static white palette on `:root`/`html`. `shared/spectrum-wave.js` animates the palette at runtime by writing inline custom-property overrides (`--accent`, `--accent2`, their `-rgb` triples, `--head`, `--fg`, `--muted`, `--rule`) onto `<body>` and onto structural/component elements — **never onto `<html>`**. `aurora-live.js` reads its colours from `getComputedStyle(document.documentElement)`, so the asteroid field, ship, and explosion debris stay static white while everything readable rides the spectrum. Do not move the wave vars onto `:root`/`html`, and do not move aurora-live's reads to `body` — that decoupling is the only thing keeping the asteroids white.

- **Palette (CSS custom properties on `:root`, single palette):**
  - `--bg: #08080a`, `--bg-rgb: 8 8 10`
  - `--surface: #121214`, `--rule: #1c1d24`
  - `--fg: #f1f0ff`, `--head: #ffffff`, `--muted: #9098ad`, `--dim: #5a5e80`
  - `--accent: #ffffff`, `--accent-rgb: 255 255 255`
  - `--accent2: #e2e8f0`, `--accent2-rgb: 226 232 240`
  - These are the **static base** in `shared/tokens.css` (still what the canvas/asteroids read). On the live pages `spectrum-wave.js` overrides the accent/text/glow vars every frame on `<body>` + components — see the html/body split above. A retune of `tokens.css` still recolours the asteroid field and is the fallback shown under `prefers-reduced-motion`.
- **Vocabulary.** Radii **12px** (cards, rows, bullets) / **14px** (tier) / **18px** (`.featured.lg`) / **999px** (pill buttons). Surfaces are translucent with `backdrop-filter: blur(8–14px)` and a 1px `var(--rule)` border. **`.card`** is intentionally light — `rgb(var(--bg-rgb) / 0.25)` — so it reads as a frosted veil over the backdrop (the blur, not the fill, does the legibility work); `.kv`/`.tier` base stay heavier at `0.78` (hover `0.9`) and `.featured` / `.tier.featured > .inner` at `0.96` for emphasis. **`.featured` and `.tier.featured`** use a 1px gradient *outer* (accent → accent2) wrapping a `> .inner` translucent block — **the `> .inner` wrapper is REQUIRED**, otherwise the gradient outer renders directly and text disappears against near-white. **Primary CTAs** are gradient pills (`linear-gradient(90deg, var(--accent), var(--accent2))`). **`.eyebrow`** is uppercase mono, letter-spacing 0.18em. **`.bullet`** is a translucent rounded row with an accent dot prefix.
- **Backdrop.** `<canvas>` fills the viewport, drawing one of **two self-playing vector games** (see the mode toggle below). **Asteroids:** a drifting asteroid field with an auto-piloting ship. The ship has Asteroids-style physics — forward-only thrust along its facing angle, separate `vx/vy` velocity with friction (`* 0.985`/frame) and a max-speed cap, so it accelerates, coasts past targets, and curves back instead of teleporting. It rotates toward a movement target (cursor when active, lazy lissajous drift otherwise; cursor mode uses softer accel + lower max speed so it glides instead of darting), thrusts only past an arrival radius and when roughly aligned, and the thrust flame only renders when the engine is firing this frame. Shooting is opportunistic — bullets fire whenever an asteroid drifts into the forward arc. **If the ship contacts an asteroid** (within `radius + 8px`) it bursts into ~24 spinning debris shards drawn in `--head` (white), stops flying/shooting, and ~0.9s after the debris fades the field resets — ship recentred at rest, a fresh asteroid field spawned from the screen edges so it can't instantly re-collide. **Missile Command:** faithful to the 1980 arcade economy — **3 bases** (left/centre/right, white `--head`) with **10 missiles each = 30 per wave**, the **centre base firing fast** interceptors and the sides slow; two clusters of vector cities sit between them. Missiles streak down from the top (`--accent`) at the cities + bases; an auto-AI fires from the nearest base-with-ammo at the lowest threat, the expanding/contracting blast ring clearing — and chain-detonating — any missile inside its radius. **A mouse click (or tap) commands a strike on that exact spot** from the nearest base with ammo (listener on `window` since `#aurora-root` is `pointer-events:none`; never `preventDefault`s, so links/buttons still work — the strike is purely additive); the AI keeps firing otherwise. Discrete **waves**: a quota of incoming, then a ~1.1s pause and bases **revive + rearm** (cities persist across waves). A base hit by an incoming missile dies and loses its ammo until the next wave. **Game over = all cities gone** → ~1.2s pause then the whole field rebuilds (wave 1). Missile-command "intensity" (spawn rate, wave quota, city count) scales off the same `data-aurora-asteroids` number. Behind the canvas: two large radial-gradient glow blurs (`mix-blend-mode: screen`) and a center vignette darken the area where copy sits.
- **Per-page backdrop config via body data attributes:**
  - `data-aurora-asteroids="N"` — asteroid count (default 6 if absent). `0` = empty field.
  - `data-aurora-ship="off"` — hide the ship entirely (asteroids mode only).
  - `data-aurora-mode="missile"` — initial game; default (absent / `"asteroids"`) is the asteroid field. The number from `data-aurora-asteroids` doubles as the missile-command intensity, so per-page density carries across both games.
  - If asteroids mode is left with nothing to animate (`0` asteroids + `ship="off"`, i.e. the links page), the rAF loop short-circuits, the canvas stays transparent (glows + vignette still show through), **and no toggle is rendered**. Missile mode always has something to animate.
  - Current page settings: home (`/`, the former workshop file) `3`, about `3`, consulting `1`, links `0` + `ship="off"`. (Cap: no page should exceed `3` asteroids.) None set `data-aurora-mode`, so all default to asteroids. The `/workshop/` redirect stub has no backdrop.
- **One backdrop toggle, no dock, no palette switcher, no localStorage.** A single small `.aurora-toggle` button (fixed bottom-right, `aurora-live.css`) swaps asteroids ⇄ missile command at runtime; it's appended to `<body>` *outside* `#aurora-root` (which is `aria-hidden` + `pointer-events:none`) so it stays clickable, and it's token-driven so it rides the spectrum wave. The switch is **runtime-only — nothing is persisted** (no localStorage; reload/navigation returns to the page's `data-aurora-mode` default). Hidden entirely under reduced motion. Each page still declares its own defaults via the data attributes above.
- **Reduced motion.** `prefers-reduced-motion: reduce` short-circuits canvas init; glows + vignette stay (static). `<html data-reduced-motion="true">` lets CSS suppress any motion.
- **Identity header.** `.avatar.sm` (80px conic-gradient ring) anchored at the same Y across every page: `<main>` uses `py-12 md:py-16`, `<nav>` has `mb-10`, and the avatar sits at the top of a `text-center` `<header>` with `mx-auto mb-3`. Don't drift these values per page — they're what keeps the avatar from jumping when you click between pages. The base `.avatar` (130px) defined in `base.css` is unused on the live pages, kept only for the design-handoff exploration files. Container width and body layout differ by page purpose:
  - **`/` (home — the workshop)** — content-dense at `max-w-3xl`. Identity header using the **home convention** (non-link avatar `<div>` + plain `rollins.io` eyebrow), editorial hero, curriculum (`.step`), logistics (`.kv`), requirements (`.card` grid), pricing tiers (`.tier`, Standard wrapped in `.tier.featured > .inner`), Formspree interest form (see below), FAQ (`details.qa`).
  - **`/about/`** — editorial / expansive at `max-w-prose` (38rem). Subpage convention: linked avatar back to `/` + `about · rollins.io` eyebrow. Centered hero with two-line h1 (line 1 plain `--fg`, line 2 surname is `.aurora-text` clipped to the `accent → accent2` gradient — now visibly chromatic under the spectrum wave), a `.bullet` list, stacked `.featured.lg` callouts (the Workshop one links to `/`, Consulting to `/consulting/`), then the `.row-link` **"Elsewhere"** directory — this is the only place that directory lives now.
  - **`/consulting/`** — content-dense at `max-w-3xl`. Same identity-header pattern. Hero, "The shift" (3-card grid), Approach (steps 01–05 day-1 + day-divider + steps 06–07 day-2), Outcomes (4-card grid), Engagements (two `.tier` cards — Two-day uses `.tier.featured > .inner` for Recommended emphasis), Logistics `.kv` card, FAQ.
  - **`/links/`** — share-targeted at `max-w-sm` (24rem). Centered identity, stacked `.featured` Workshop (→ `/`) + Consulting tiles, then a stack of `.link-btn` rows. Optimized for being pasted into social bios.

## Directory layout

```
.
├── CNAME                  rollins.io
├── .nojekyll              tells Pages to serve raw — no Jekyll processing (needed for design-handoff/*.jsx)
├── index.html             home / landing = the Agents Building Agents workshop (page-only CSS: .interest-form fields)
├── about/index.html       personal bio + "Elsewhere" directory (was the old / home)
├── workshop/index.html    redirect stub → / (meta-refresh + JS, preserves #hash; not a content page)
├── consulting/index.html  consulting page (page-only CSS: .day-divider)
├── links/index.html       share-targeted link landing (no page-specific CSS)
├── design-handoff/        historical design exploration — React+Babel-in-browser preview, not part of the live site
└── shared/
    ├── tailwind-init.js   shared tailwind.config — color tokens reference CSS vars
    ├── tokens.css         CSS custom properties on :root (static white base), body bg/fg/font, ::selection
    ├── base.css           .eyebrow, .link, .row-link, .bullet, .card, .avatar (+ .sm modifier), .fade-in, reduced-motion guard
    ├── components.css     .btn / .btn-primary / .btn-ghost, .kv, .link-btn, .featured (+ .lg), .tier (+ .featured), .step, details.qa
    ├── aurora-live.css    canvas backdrop scaffold — #aurora-root, canvas, .aurora-glow-*, .aurora-vignette, .aurora-toggle; body.aurora-page padding
    ├── aurora-live.js     asteroids + missile-command draw loops + corner mode toggle, reads body data attrs, reduced-motion guard
    └── spectrum-wave.js   runtime rolling-spectrum palette — writes inline vars onto <body> + components, never <html>; reduced-motion = one static frame
```

## Editing rules

- **Tokens, shared utilities, the fade-in animation, the backdrop scaffold, and the Tailwind config live in `/shared/`.** Pages should not need any inline `<style>` block by default — page-specific styles are an exception (e.g. workshop's `.interest-form` inputs, consulting's `.day-divider`).
- **Never duplicate a class definition between a page and `/shared/`.** If two pages need the same class, move it to `base.css` or `components.css`.
- Color and font tokens read from CSS custom properties (`--bg`, `--fg`, `--accent`, `--accent2`, `--muted`, etc.). Components must reference these — never hard-code hex values — so a palette retune (or future multi-palette return) works end-to-end. Tailwind utilities (`bg-bg`, `text-accent`, `text-accent2`, `border-rule`, `font-mono`, etc.) are wired to the same vars.
- **`.featured` and `.tier.featured` require a `<div class="inner">…</div>` child wrapper.** Without it the gradient outer renders directly and text vanishes against near-white. This is the highest-frequency bug.
- Cross-page links use absolute paths (`/`, `/about/`, `/consulting/`, `/links/`) so they work whether served from `rollins.io` root or a local `python3 -m http.server`. Link to the workshop as **`/`**, never `/workshop/` — that's just the legacy redirect stub.
- Nav order is `home · consulting · links · about` across every page — `about` sits far right (`home` → `/`, `about` → `/about/`). The current page is rendered as a plain `text-fg` span, others as `link` anchors.

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
   <script defer src="/shared/spectrum-wave.js"></script>
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
           <a href="/consulting/" class="link">consulting</a>
           <span class="text-dim">·</span>
           <a href="/links/" class="link">links</a>
           <span class="text-dim">·</span>
           <a href="/about/" class="link">about</a>
       </div>
   </nav>
   <header class="text-center mb-14 fade-in">
       <a href="/" aria-label="Back to rollins.io" class="avatar sm mx-auto mb-3">MR</a>
       <div class="eyebrow"><slug> · rollins.io</div>
   </header>
   ```
5. Compose body sections from the shared vocabulary — `.featured` (gradient-border + `> .inner`) for hero cards, `.bullet` for translucent bullet rows, `.link-btn` for stacked link rows, `.card` + `.kv` for key-value blocks, `.step` for numbered walkthroughs, `.tier` (+ `.tier.featured > .inner`) for pricing-or-engagement cards, `details.qa` for FAQs, `.btn-primary` (gradient pill) / `.btn-ghost` for CTAs.
6. Add `<slug>` to the top nav on the existing pages, and add a row to the **`/about/`** page's `Elsewhere` section if it's a "real" destination (that directory moved off `/` when the workshop became home).

## Preview locally

The pages use absolute paths for `/shared/*`, so `file://` previews don't work. Serve from the repo root:

```sh
cd /Users/rollins/delta-v/web-github-pages/rollins-home
python3 -m http.server 8000
```

Then open `http://localhost:8000/` (the workshop/home), `/about/`, `/consulting/`, `/links/`. `/workshop/` should bounce you to `/`.

## Home page (the workshop) — content sync points

The workshop **is** the home page now: edit `index.html` (repo root). It was formerly `workshop/index.html`; `/workshop/` is just a redirect stub.

- Sections: Hero, Curriculum (`#details`), Logistics, Requirements (`#requirements`), Pricing (`#pricing`) with three tiers (Supported $29 / Standard $99 / Supporter $199), Express interest (Formspree form, see below), FAQ. The Standard tier uses `.tier.featured > .inner` for accent border + tinted gradient and primary CTA — preserve that emphasis if restyling.
- Duration must stay aligned across: hero subhead ("Two hours, live"), Curriculum intro ("first hour … full hour"), Logistics `Format` ("60m build + 60m Q&A"), and FAQ ("60-minute Q&A").
- Times must stay consistent: hero eyebrow (currently `12:00 ET`) and the Logistics card row (`12:00 ET` + the elsewhere row showing `09:00 PT · 21:30 IST · 17:00 WAT`).
- The workshop date appears in **four** places that must update together: the `/about/` page Workshop featured card, the `/links/` page Workshop featured card, the home (`/`) hero eyebrow, and the home (`/`) Logistics `Date` row.

### Express interest — Formspree form

The "Express interest" block on `index.html` (the home/workshop page) is a real form, not a `mailto:`. Endpoint: `https://formspree.io/f/mqenopqj`. Fields: name, email, timezone (optional), notes (optional), plus a `_gotcha` honeypot and a `_subject` hidden input. The submit handler is inline at the bottom of the file — AJAX POST, then swap the form for an inline `#interest-success` block on success or reveal `#interest-error` (which falls back to `mailto:workshop@rollins.io`) on failure.

**This is the site's single contact funnel.** Every off-page contact CTA links to `/?for=<ctx>#interest`. The inline script reads the `for` query param and rewrites the hidden `_subject` plus the form's eyebrow/heading/blurb (ids `interest-subject` / `interest-eyebrow` / `interest-heading` / `interest-blurb`), then smooth-scrolls to `#interest`. Recognised contexts: `contact` (generic — from `/about/` Elsewhere + the `/links/` stack), `consulting-one-day`, `consulting-two-day` (from the consulting Inquire CTAs). No `for` param = the workshop default copy + subject. The only `mailto:` left anywhere on the site is the `#interest-error` failure fallback.

- Form CSS lives in a small `<style>` block on the home page (`index.html`) only (`.interest-form .field`, `.lbl`, inputs, `.hp` honeypot positioning). It's the one piece of page-specific CSS this page owns.
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
- Both "Inquire" CTAs route to the home contact form: `/?for=consulting-one-day#interest` and `/?for=consulting-two-day#interest`. The form derives `_subject` (`Consulting interest — One-day engagement` / `… Two-day engagement`) and its framing from that context — see the Express-interest section. No `mailto:` here anymore.

## Email aliases

The site uses Google Workspace aliases on `rollins.io` so no inbound mail server is needed:

- `workshop@rollins.io` — now used **only** as the Formspree form's `#interest-error` failure fallback. (The "or email" alternative line under the submit button was removed; all contact funnels through the form.)
- `contact-me@rollins.io` — still a valid alias but **no longer linked anywhere on the site**. The old `Email` rows (`/about/` Elsewhere, the `/links/` stack) and the consulting Inquire CTAs now point to the contact form (`/?for=contact#interest`, etc.). Wire it back only if a non-form contact path is reintroduced.

Both route to the single Workspace inbox. Use Gmail filters (`to:workshop@…` → label "Workshop"; `to:contact-me@…` → label "Contact") to sort.

## Session log

- **2026-05-16** — (1) Added the runtime rolling-spectrum palette: new `shared/spectrum-wave.js`, wired into all four pages after `aurora-live.js`. (2) Asteroids/ship/debris deliberately stay white via the html/body var split (see Design system). (3) Card surfaces made more opaque in shared CSS (`0.62→0.78`, hover `0.78→0.9`, `.featured`/`.tier.featured > .inner` `0.92→0.96`). (4) Ship now explodes into debris and the field resets on asteroid contact (`aurora-live.js`). (5) **IA move:** workshop became the home page (`workshop/index.html` → root `index.html`); old home became `/about/` (`index.html` → `about/index.html`); `/workshop/` is now a redirect stub → `/`; nav re-labelled `home · about · consulting · links` site-wide; meta/og + identity-header conventions updated per page. The throwaway `/palettes/` preview was removed.
- **2026-05-16 (cont.)** — Consolidated all contact into a single funnel: every off-page contact CTA links to the home interest form via `/?for=<ctx>#interest` (`contact`, `consulting-one-day`, `consulting-two-day`); the form sets subject + framing from that context. The form's "or email" alternative line was removed (mailto remains only as the `#interest-error` fallback). Nav reordered to `home · consulting · links · about` (about far right) site-wide. Committed + pushed to `main` (a live deploy of rollins.io) at the user's explicit request.
- **2026-05-16 (cont. 2)** — Added a second self-playing backdrop game, **Missile Command**, alongside Asteroids in `shared/aurora-live.js` (new `startMissileCommand()`: auto-battery + city line, downward missiles, lead-targeted interceptors with expanding/chaining blast rings, ~1.2s field rebuild on wipe). New `data-aurora-mode="missile|asteroids"` body attr sets the initial game (default asteroids); missile intensity scales off `data-aurora-asteroids`. New `.aurora-toggle` corner button (`shared/aurora-live.css`) swaps games at runtime — appended outside `#aurora-root` so it's clickable, token-driven (rides the spectrum), hidden under reduced motion, not rendered on backdrop-less pages (links). Runtime-only switch, nothing persisted (consistent with the no-localStorage rule). No page HTML changed; shared JS/CSS + this doc only. Committed + pushed to `main` (live rollins.io deploy, commit `0d5b29f`) at the user's explicit request.
- **2026-05-16 (cont. 3)** — Reworked Missile Command toward the real 1980 arcade economy: replaced the single auto-battery with **3 bases** (left/centre/right), **10 missiles each (30/wave)**, **centre base fast / sides slow**; cities split into two clusters between the bases and now **persist across waves**. Added discrete **waves** (spawn quota → ~1.1s pause → bases revive + rearm) and **game over = all cities gone** → full rebuild at wave 1. A downed base loses its ammo until next wave. Added **click/tap-to-strike**: a `window` `click` listener fires a player-directed interceptor at the cursor from the nearest base with ammo (no `preventDefault`, so page links/buttons keep working; ignored during the inter-wave / game-over pauses); the AI still auto-fires otherwise. Listener removed in the teardown fn. `shared/aurora-live.js` + this doc only. Committed + pushed to `main` (live rollins.io deploy) at the user's explicit request, as the second of two commits this session.
- **2026-05-16 (cont. 4)** — Capped backdrop asteroid density at **3 per page**: `/about/` `data-aurora-asteroids` 12→3 (home already 3, consulting 1, links 0 + `ship="off"`); added the 3-asteroid cap note to the Design-system doc. Committed (`31b1fdf`) + pushed to `main` (live rollins.io deploy) at the user's explicit request, as a separate commit ahead of the cont. 3 Missile Command rework.
- **2026-05-16 (cont. 5)** — Home (`/`) hero `<header>` and Curriculum `<section id="details">` wrapped in `.card p-8 md:p-10` so the moving backdrop stops drifting through that copy. Dropped the shared **`.card`** base alpha `0.78 → 0.25` (frosted veil; the `blur(12px)` carries legibility) — site-wide, so all `.card` blocks (incl. `/about/`, `/consulting/`) lighten; `.tier`/`.featured` emphasis surfaces left heavier. `index.html` + `shared/base.css` + this doc. Committed + pushed to `main` (live rollins.io deploy) at the user's explicit request.
- **2026-05-16 (cont. 6)** — Copy-tightening pass across all four content pages (visible prose: index `701→~501`, about `188→149`, consulting `968→700`, links `103→91`) plus the user's own parallel hand-edits (hero h1 → "Build an Agent", terser subhead, step-01 title → "Execution Environment", links Workshop title → "Build an Agent"). Shared **`.card`** alpha set to **`0`** per the user (fully transparent fill — border + `blur(12px)` only; overrides the cont. 5 `0.25`). **Open caveat (not yet reconciled):** the home hero subhead no longer contains the literal "Two hours, live" sync token, while the home `<meta>`/og description and the `/about/` Workshop card still read "Two hours, live: 60m building a Python agent on screen, then 60m of deep Q&A." — the documented duration sync points (hero / Curriculum "first hour…full hour" / Logistics "60m build + 60m Q&A" / FAQ "60-minute Q&A") drifted and need a follow-up reconcile. Committed + pushed to `main` (live rollins.io deploy) at the user's explicit "commit everything and push".
