/* Spectrum wave. Drives the page palette through the colour spectrum in a
   rolling, organically-random wave that travels down the layout.

   The animated values are written as inline CSS custom properties onto the
   matched elements and onto <body> (ambient glow). They are NEVER written to
   <html>, because aurora-live.js reads its colours from
   getComputedStyle(document.documentElement) at startup / on resize — so the
   asteroid field, ship, and explosion debris keep the static white from
   tokens.css while everything readable rides the wave.

   No UI, no localStorage. prefers-reduced-motion freezes on one static
   spectral frame. */

(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // hue (any deg), s/l in % → [r, g, b] 0..255
    function hsl(h, s, l) {
        h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r, g, b;
        if (h < 60)       [r, g, b] = [c, x, 0];
        else if (h < 120) [r, g, b] = [x, c, 0];
        else if (h < 180) [r, g, b] = [0, c, x];
        else if (h < 240) [r, g, b] = [0, x, c];
        else if (h < 300) [r, g, b] = [x, 0, c];
        else              [r, g, b] = [c, 0, x];
        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255),
        ];
    }

    // Structural blocks + shared component surfaces. Selecting both the
    // containers and the components inside them gives dense vertical sample
    // points, so the spectrum visibly rolls down the column on every page
    // without any per-page markup.
    const SEL = 'nav, header, .avatar, section, .eyebrow, .bullet, .featured, '
              + '.tier, .step, .card, .kv, .row-link, .link-btn, details.qa, footer';

    let nodes = [];
    function reindex() {
        const docH = document.documentElement.scrollHeight || 1;
        nodes = [...document.querySelectorAll(SEL)].map(el => {
            const r = el.getBoundingClientRect();
            return {
                el,
                y: (r.top + scrollY + r.height / 2) / docH, // 0..1 down the page
                wob: Math.random() * Math.PI * 2,
            };
        });
    }

    // Random phases → the roll wanders organically and never cleanly loops.
    const p1 = Math.random() * 6.28, p2 = Math.random() * 6.28, p3 = Math.random() * 6.28;
    const SPREAD = 150; // degrees of spectrum visible across the page at once

    function frame(now) {
        const t = now / 1000;
        // steady forward roll + three slow random sines = rolling random wave
        const base = t * 16
                   + 58 * Math.sin(t * 0.13 + p1)
                   + 34 * Math.sin(t * 0.29 + p2)
                   + 19 * Math.sin(t * 0.07 + p3);

        for (const n of nodes) {
            const h  = base + n.y * SPREAD + 14 * Math.sin(t * 0.5 + n.wob);
            const a  = hsl(h,      88, 64);
            const a2 = hsl(h + 38, 90, 72);
            const st = n.el.style;
            st.setProperty('--accent',      `rgb(${a[0]} ${a[1]} ${a[2]})`);
            st.setProperty('--accent2',     `rgb(${a2[0]} ${a2[1]} ${a2[2]})`);
            st.setProperty('--accent-rgb',  `${a[0]} ${a[1]} ${a[2]}`);
            st.setProperty('--accent2-rgb', `${a2[0]} ${a2[1]} ${a2[2]}`);
            st.setProperty('--head',  `rgb(${hsl(h, 88, 82).join(' ')})`);
            // text rides the wave at full chroma so it reads as colour, never
            // white — clearly separated from the white asteroids behind it.
            // High lightness keeps it legible on the near-black bg.
            st.setProperty('--fg',    `rgb(${hsl(h, 72, 78).join(' ')})`);
            st.setProperty('--muted', `rgb(${hsl(h, 50, 62).join(' ')})`);
            st.setProperty('--rule',  `rgb(${hsl(h, 42, 20).join(' ')})`);
        }

        // ambient backdrop glow (#aurora-root is a child of <body>) rolls with
        // the mid-page hue. Set on <body>, never <html>.
        const g  = hsl(base + 0.5 * SPREAD,      85, 62);
        const g2 = hsl(base + 0.5 * SPREAD + 38, 88, 70);
        document.body.style.setProperty('--accent-rgb',  `${g[0]} ${g[1]} ${g[2]}`);
        document.body.style.setProperty('--accent2-rgb', `${g2[0]} ${g2[1]} ${g2[2]}`);
    }

    let raf;
    function loop(now) { frame(now); raf = requestAnimationFrame(loop); }

    function init() {
        reindex();
        addEventListener('resize', () => { reindex(); if (reduce) frame(performance.now()); });
        addEventListener('load', reindex);
        setTimeout(reindex, 400); // settle after web-font swap reflow
        document.addEventListener('toggle', reindex, true); // <details> open/close

        if (reduce) {
            frame(performance.now()); // one static spectral frame, no motion
        } else {
            raf = requestAnimationFrame(loop);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
