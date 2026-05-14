/* Asteroid backdrop. Mounts a fixed-position canvas with a vector-style
   asteroid field and self-piloting ship onto any page with
   <body class="aurora-page">. Per-page controls via data attributes:

     data-aurora-asteroids="N"  — asteroid count (default 6, 0 = none)
     data-aurora-ship="off"     — hide the ship entirely

   No palette switching, no dock, no localStorage. Each page declares
   exactly what it wants. */

(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function readPalette() {
        const cs = getComputedStyle(document.documentElement);
        return {
            bg: cs.getPropertyValue('--bg').trim() || '#08080a',
            accent: cs.getPropertyValue('--accent').trim() || '#ffffff',
            head: cs.getPropertyValue('--head').trim() || '#ffffff',
        };
    }

    function startAsteroids(canvas, palette, count, shipOff) {
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
        if (!shipOff) {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseleave', onLeave);
            window.addEventListener('touchstart', onMove, { passive: true });
            window.addEventListener('touchmove', onMove, { passive: true });
            window.addEventListener('touchend', onLeave);
        }

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

            // AI: aim ship at nearest asteroid (with wrap)
            let near = null, nDist = Infinity;
            if (!shipOff) {
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
            }

            // ship motion
            if (!shipOff) {
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

                // No asteroid to aim at? Aim the ship in its movement direction.
                if (!near) {
                    const ddx = targetX - ship.x;
                    const ddy = targetY - ship.y;
                    if (ddx * ddx + ddy * ddy > 4) {
                        const aim = Math.atan2(ddy, ddx);
                        let diff = aim - ship.angle;
                        while (diff > Math.PI) diff -= Math.PI * 2;
                        while (diff < -Math.PI) diff += Math.PI * 2;
                        ship.angle += diff * 0.05 * f;
                    }
                }

                // Pointer-tracked motion is lazier than idle drift — the ship
                // glides toward the cursor rather than chasing it.
                const lerpAmt = Math.min(1, (pointer.active ? 0.015 : 0.05) * f);
                ship.x += (targetX - ship.x) * lerpAmt;
                ship.y += (targetY - ship.y) * lerpAmt;
                ship.x = Math.max(0, Math.min(W, ship.x));
                ship.y = Math.max(0, Math.min(H, ship.y));
            }

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
            if (!shipOff) {
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
        return root.querySelector('canvas');
    }

    let canvasEl = null;
    let stopFn = null;
    let config = { count: 6, shipOff: false };

    function startBackdrop() {
        if (stopFn) { stopFn(); stopFn = null; }
        if (reducedMotion) return;
        if (!canvasEl) return;
        // Nothing to animate? Leave canvas transparent; glows + vignette stay.
        if (config.count === 0 && config.shipOff) return;
        const palette = readPalette();
        stopFn = startAsteroids(canvasEl, palette, config.count, config.shipOff);
    }

    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { startBackdrop(); }, 150);
    }

    function init() {
        if (reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        }
        const body = document.body;
        const rawCount = body.getAttribute('data-aurora-asteroids');
        if (rawCount !== null) {
            const n = parseInt(rawCount, 10);
            if (Number.isFinite(n) && n >= 0) config.count = n;
        }
        if (body.getAttribute('data-aurora-ship') === 'off') config.shipOff = true;

        canvasEl = buildRoot();
        startBackdrop();
        window.addEventListener('resize', onResize);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
