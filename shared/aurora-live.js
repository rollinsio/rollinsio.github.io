/* Aurora Live — vanilla port of design-handoff/variations.jsx Aurora Live (#10).
   Mounts a fixed-position canvas backdrop + bottom dock onto any page that
   has <body class="aurora-page">. Persists palette / backdrop / intensity
   across pages via localStorage key `aurora-live:v1`. */

(() => {
    const STORAGE_KEY = 'aurora-live:v1';

    // ----- palettes & intensity (from variations.jsx:976-989) -----
    const PALETTES = {
        violet:  { name: 'Violet',  bg: '#0a0e1f', accent: '#a78bfa', accent2: '#22d3ee', head: '#e8defd', muted: '#8b8db0', rule: '#1f254a' },
        emerald: { name: 'Emerald', bg: '#06140f', accent: '#34d399', accent2: '#22d3ee', head: '#d8fbe9', muted: '#7fa294', rule: '#173123' },
        magenta: { name: 'Magenta', bg: '#10081a', accent: '#f472b6', accent2: '#a78bfa', head: '#fbe4f1', muted: '#a08bb0', rule: '#2a1538' },
        sunset:  { name: 'Sunset',  bg: '#180a08', accent: '#fb923c', accent2: '#f472b6', head: '#ffe1cc', muted: '#b08a7a', rule: '#3a1a14' },
        ocean:   { name: 'Ocean',   bg: '#040d1a', accent: '#22d3ee', accent2: '#60a5fa', head: '#d4f1ff', muted: '#7d99b3', rule: '#0f2538' },
        mono:    { name: 'Mono',    bg: '#0a0a0d', accent: '#cbd5e1', accent2: '#94a3b8', head: '#ffffff', muted: '#7d8390', rule: '#1f2030' },
    };
    const PALETTE_KEYS = Object.keys(PALETTES);

    const INTENSITY = [
        { name: 'Calm',  rainD: 0.55, ast: 3 },
        { name: 'Med',   rainD: 1.0,  ast: 6 },
        { name: 'Dense', rainD: 1.6,  ast: 10 },
        { name: 'Storm', rainD: 2.4,  ast: 16 },
    ];

    // ----- state -----
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = {
        paletteKey: 'violet',
        backdrop: 'rain',
        intensityIdx: 1,
    };

    // ----- helpers -----
    function hexToRgb(hex) {
        const h = hex.replace('#', '');
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return [r, g, b];
    }
    function rgbTriplet(hex) {
        const [r, g, b] = hexToRgb(hex);
        return `${r} ${g} ${b}`;
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.v === 1) {
                if (PALETTES[parsed.paletteKey]) state.paletteKey = parsed.paletteKey;
                if (parsed.backdrop === 'rain' || parsed.backdrop === 'asteroids') state.backdrop = parsed.backdrop;
                if (Number.isInteger(parsed.intensityIdx) && parsed.intensityIdx >= 0 && parsed.intensityIdx < INTENSITY.length) {
                    state.intensityIdx = parsed.intensityIdx;
                }
            }
        } catch (_) { /* ignore */ }
    }
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                v: 1,
                paletteKey: state.paletteKey,
                backdrop: state.backdrop,
                intensityIdx: state.intensityIdx,
            }));
        } catch (_) { /* ignore */ }
    }

    function applyPalette(key) {
        const p = PALETTES[key];
        if (!p) return;
        const root = document.documentElement;
        root.style.setProperty('--bg', p.bg);
        root.style.setProperty('--bg-rgb', rgbTriplet(p.bg));
        root.style.setProperty('--fg', '#f1f0ff');
        root.style.setProperty('--head', p.head);
        root.style.setProperty('--muted', p.muted);
        root.style.setProperty('--accent', p.accent);
        root.style.setProperty('--accent-rgb', rgbTriplet(p.accent));
        root.style.setProperty('--accent2', p.accent2);
        root.style.setProperty('--accent2-rgb', rgbTriplet(p.accent2));
        root.style.setProperty('--rule', p.rule);
    }

    // ----- backdrop draw loops -----

    // MatrixRain port from variations.jsx:378-484
    function startMatrixRain(canvas, palette, density) {
        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const W = cssW, H = cssH;

        const fontSize = Math.max(8, Math.round(18 / Math.max(0.4, density)));
        const cols = Math.max(1, Math.floor(W / fontSize));
        const drops = Array.from({ length: cols }, () => Math.random() * -50);
        const offsetsX = new Float32Array(cols);
        const offsetsY = new Float32Array(cols);
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789{}[]<>=+-*/$#@%&!?';
        const [r, g, b] = hexToRgb(palette.bg);

        const pointer = { x: -9999, y: -9999, active: false };
        function onMove(e) {
            const t = e.touches && e.touches[0] ? e.touches[0] : e;
            if (t.clientX === undefined) return;
            pointer.x = t.clientX;
            pointer.y = t.clientY;
            pointer.active = true;
        }
        function onLeave() { pointer.active = false; pointer.x = -9999; pointer.y = -9999; }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('touchstart', onMove, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onLeave);

        const radius = 110, strength = 70, ease = 0.18;
        let raf, prev = performance.now();

        function step(now) {
            const dt = Math.min(50, now - prev); prev = now;
            ctx.fillStyle = `rgba(${r},${g},${b},${0.07 * dt / 16})`;
            ctx.fillRect(0, 0, W, H);
            ctx.font = `${fontSize}px 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace`;
            ctx.textBaseline = 'top';

            const px = pointer.x, py = pointer.y, active = pointer.active;

            for (let i = 0; i < cols; i++) {
                const baseX = i * fontSize;
                const baseY = drops[i] * fontSize;
                let targetOX = 0, targetOY = 0;
                if (active) {
                    const dx = baseX - px;
                    const dy = baseY - py;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < radius && dist > 0.001) {
                        const force = (1 - dist / radius);
                        const eased = force * force;
                        targetOX = (dx / dist) * eased * strength;
                        targetOY = (dy / dist) * eased * strength;
                    }
                }
                offsetsX[i] += (targetOX - offsetsX[i]) * ease;
                offsetsY[i] += (targetOY - offsetsY[i]) * ease;

                const x = baseX + offsetsX[i];
                const y = baseY + offsetsY[i];
                if (y > 0 && y < H) {
                    ctx.fillStyle = palette.head;
                    ctx.shadowColor = palette.accent;
                    ctx.shadowBlur = 8;
                    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = palette.accent;
                    if (y - fontSize > 0) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);
                }
                if (baseY > H && Math.random() > 0.975) drops[i] = -Math.random() * 20;
                drops[i] += 0.45 * dt / 16;
            }
            raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('touchstart', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onLeave);
        };
    }

    // Asteroids port from variations.jsx:687-898
    function startAsteroids(canvas, palette, count) {
        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const W = cssW, H = cssH;

        const ship = { x: W / 2, y: H / 2, angle: 0, drift: Math.random() * 1000 };
        const pointer = { x: -9999, y: -9999, active: false, lastSeen: 0 };
        function onMove(e) {
            const t = e.touches && e.touches[0] ? e.touches[0] : e;
            if (t.clientX === undefined) return;
            pointer.x = t.clientX;
            pointer.y = t.clientY;
            pointer.active = true;
            pointer.lastSeen = performance.now();
        }
        function onLeave() { pointer.active = false; }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('touchstart', onMove, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onLeave);

        function makeAsteroid(size, x, y) {
            const px = x !== undefined ? x : (Math.random() < 0.5 ? -20 : W + 20);
            const py = y !== undefined ? y : Math.random() * H;
            const speed = 0.25 + Math.random() * 0.55;
            const dir = Math.random() * Math.PI * 2;
            const verts = 9 + Math.floor(Math.random() * 4);
            const radius = size === 3 ? 32 : size === 2 ? 20 : 12;
            const shape = [];
            for (let i = 0; i < verts; i++) {
                const a = (i / verts) * Math.PI * 2;
                const r = radius * (0.7 + Math.random() * 0.45);
                shape.push({ a, r });
            }
            return { x: px, y: py, vx: Math.cos(dir) * speed, vy: Math.sin(dir) * speed, rot: 0, rotSpeed: (Math.random() - 0.5) * 0.018, shape, size, radius };
        }

        let asteroids = Array.from({ length: count }, () => makeAsteroid(3));
        const bullets = [];
        let raf, prev = performance.now(), lastShot = 0;

        function step(now) {
            const dt = Math.min(50, now - prev); prev = now;
            const f = dt / 16;

            ctx.fillStyle = palette.bg;
            ctx.fillRect(0, 0, W, H);

            // AI: aim at nearest asteroid (with wrap)
            let near = null, nDist = Infinity;
            for (const a of asteroids) {
                let dx = a.x - ship.x, dy = a.y - ship.y;
                if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W;
                if (dy > H / 2) dy -= H; else if (dy < -H / 2) dy += H;
                const d = dx * dx + dy * dy;
                if (d < nDist) { nDist = d; near = { dx, dy, a }; }
            }
            if (near) {
                const target = Math.atan2(near.dy, near.dx);
                let diff = target - ship.angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                ship.angle += diff * 0.07 * f;
                if (now - lastShot > 520 && Math.abs(diff) < 0.22) {
                    bullets.push({ x: ship.x + Math.cos(ship.angle) * 16, y: ship.y + Math.sin(ship.angle) * 16, vx: Math.cos(ship.angle) * 5.5, vy: Math.sin(ship.angle) * 5.5, life: 140 });
                    lastShot = now;
                }
            }

            // ship motion
            let targetX, targetY;
            if (pointer.active && now - pointer.lastSeen < 2500) {
                targetX = pointer.x;
                targetY = pointer.y;
            } else {
                pointer.active = false;
                ship.drift += dt * 0.0014;
                targetX = W / 2 + Math.cos(ship.drift) * W * 0.38;
                targetY = H / 2 + Math.sin(ship.drift * 1.3) * H * 0.34;
            }
            const lerpAmt = Math.min(1, 0.05 * f);
            ship.x += (targetX - ship.x) * lerpAmt;
            ship.y += (targetY - ship.y) * lerpAmt;
            ship.x = Math.max(0, Math.min(W, ship.x));
            ship.y = Math.max(0, Math.min(H, ship.y));

            // asteroids
            for (const a of asteroids) {
                a.x = (a.x + a.vx * f + W) % W;
                a.y = (a.y + a.vy * f + H) % H;
                a.rot += a.rotSpeed * f;
            }

            // bullets + collisions
            for (let i = bullets.length - 1; i >= 0; i--) {
                const bu = bullets[i];
                bu.x += bu.vx * f; bu.y += bu.vy * f; bu.life -= f;
                if (bu.life <= 0 || bu.x < 0 || bu.x > W || bu.y < 0 || bu.y > H) { bullets.splice(i, 1); continue; }
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    const a = asteroids[j];
                    const dx = bu.x - a.x, dy = bu.y - a.y;
                    if (dx * dx + dy * dy < a.radius * a.radius) {
                        asteroids.splice(j, 1);
                        if (a.size > 1) {
                            for (let k = 0; k < 2; k++) asteroids.push(makeAsteroid(a.size - 1, a.x, a.y));
                        }
                        bullets.splice(i, 1);
                        break;
                    }
                }
            }

            // keep field populated
            const bigCount = asteroids.filter(a => a.size === 3).length;
            if (bigCount < count && Math.random() < 0.012 * f) asteroids.push(makeAsteroid(3));

            // draw asteroids
            ctx.strokeStyle = palette.accent;
            ctx.lineWidth = 1.4;
            ctx.shadowColor = palette.accent;
            ctx.shadowBlur = 6;
            for (const a of asteroids) {
                ctx.save();
                ctx.translate(a.x, a.y);
                ctx.rotate(a.rot);
                ctx.beginPath();
                for (let i = 0; i < a.shape.length; i++) {
                    const v = a.shape[i];
                    const x = Math.cos(v.a) * v.r, y = Math.sin(v.a) * v.r;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
            ctx.shadowBlur = 0;

            // bullets
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            for (const bu of bullets) {
                ctx.beginPath();
                ctx.arc(bu.x, bu.y, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // ship
            ctx.save();
            ctx.translate(ship.x, ship.y);
            ctx.rotate(ship.angle);
            ctx.strokeStyle = palette.head;
            ctx.lineWidth = 1.6;
            ctx.shadowColor = palette.head;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(14, 0);
            ctx.lineTo(-9, -7);
            ctx.lineTo(-5, 0);
            ctx.lineTo(-9, 7);
            ctx.closePath();
            ctx.stroke();
            if (((now / 80) | 0) % 2) {
                ctx.beginPath();
                ctx.moveTo(-5, -3);
                ctx.lineTo(-12, 0);
                ctx.lineTo(-5, 3);
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
            ctx.restore();

            raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('touchstart', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onLeave);
        };
    }

    // ----- mount root + dock -----
    let canvasEl = null;
    let stopFn = null;

    function buildRoot() {
        const root = document.createElement('div');
        root.id = 'aurora-root';
        root.setAttribute('aria-hidden', 'true');
        root.innerHTML = `
            <canvas></canvas>
            <div class="aurora-glow-a"></div>
            <div class="aurora-glow-b"></div>
            <div class="aurora-vignette"></div>
        `;
        document.body.prepend(root);
        canvasEl = root.querySelector('canvas');
    }

    function buildDock() {
        const dock = document.createElement('div');
        dock.className = 'aurora-dock';
        dock.setAttribute('role', 'toolbar');
        dock.setAttribute('aria-label', 'Aurora Live backdrop controls');

        // BACKDROP group
        const backdropGroup = document.createElement('div');
        backdropGroup.className = 'group';
        backdropGroup.innerHTML = `<div class="group-label">Backdrop</div>`;
        const backdropRow = document.createElement('div');
        backdropRow.className = 'row';
        for (const [k, label] of [['rain', 'Rain'], ['asteroids', 'Asteroids']]) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = label;
            btn.dataset.backdrop = k;
            btn.addEventListener('click', () => setBackdrop(k));
            backdropRow.appendChild(btn);
        }
        backdropGroup.appendChild(backdropRow);

        // PALETTE group
        const paletteGroup = document.createElement('div');
        paletteGroup.className = 'group group--palette';
        paletteGroup.innerHTML = `<div class="group-label">Palette</div>`;
        const paletteRow = document.createElement('div');
        paletteRow.className = 'row row--palette';
        for (const key of PALETTE_KEYS) {
            const p = PALETTES[key];
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'swatch';
            btn.title = p.name;
            btn.setAttribute('aria-label', `Palette: ${p.name}`);
            btn.dataset.palette = key;
            btn.style.setProperty('--swatch-a', p.accent);
            btn.style.setProperty('--swatch-b', p.accent2);
            btn.addEventListener('click', () => setPalette(key));
            paletteRow.appendChild(btn);
        }
        paletteGroup.appendChild(paletteRow);

        // INTENSITY group
        const intensityGroup = document.createElement('div');
        intensityGroup.className = 'group group--intensity';
        intensityGroup.innerHTML = `<div class="group-label">Intensity</div>`;
        const intensityRow = document.createElement('div');
        intensityRow.className = 'row';
        INTENSITY.forEach((lvl, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = lvl.name;
            btn.dataset.intensity = String(idx);
            btn.addEventListener('click', () => setIntensity(idx));
            intensityRow.appendChild(btn);
        });
        intensityGroup.appendChild(intensityRow);

        dock.appendChild(backdropGroup);
        dock.appendChild(paletteGroup);
        dock.appendChild(intensityGroup);
        document.body.appendChild(dock);

        return dock;
    }

    function refreshDockPressedStates() {
        document.querySelectorAll('.aurora-dock [data-backdrop]').forEach(btn => {
            btn.setAttribute('aria-pressed', String(btn.dataset.backdrop === state.backdrop));
        });
        document.querySelectorAll('.aurora-dock [data-palette]').forEach(btn => {
            btn.setAttribute('aria-pressed', String(btn.dataset.palette === state.paletteKey));
        });
        document.querySelectorAll('.aurora-dock [data-intensity]').forEach(btn => {
            btn.setAttribute('aria-pressed', String(Number(btn.dataset.intensity) === state.intensityIdx));
        });
    }

    function startBackdrop() {
        if (stopFn) { stopFn(); stopFn = null; }
        if (reducedMotion) return;
        if (!canvasEl) return;
        const palette = PALETTES[state.paletteKey];
        const intensity = INTENSITY[state.intensityIdx];
        if (state.backdrop === 'rain') {
            stopFn = startMatrixRain(canvasEl, palette, intensity.rainD);
        } else {
            stopFn = startAsteroids(canvasEl, palette, intensity.ast);
        }
    }

    function setPalette(key) {
        if (!PALETTES[key]) return;
        state.paletteKey = key;
        applyPalette(key);
        refreshDockPressedStates();
        startBackdrop();
        saveState();
    }
    function setBackdrop(mode) {
        if (mode !== 'rain' && mode !== 'asteroids') return;
        state.backdrop = mode;
        refreshDockPressedStates();
        startBackdrop();
        saveState();
    }
    function setIntensity(idx) {
        if (!Number.isInteger(idx) || idx < 0 || idx >= INTENSITY.length) return;
        state.intensityIdx = idx;
        refreshDockPressedStates();
        startBackdrop();
        saveState();
    }

    // ----- resize handling -----
    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { startBackdrop(); }, 150);
    }

    // ----- init -----
    function init() {
        if (reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        }
        loadState();
        applyPalette(state.paletteKey);
        buildRoot();
        buildDock();
        refreshDockPressedStates();
        startBackdrop();
        window.addEventListener('resize', onResize);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
