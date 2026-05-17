/* Self-playing arcade backdrop. Mounts a fixed-position canvas onto any
   page with <body class="aurora-page">, plus a small corner button that
   toggles between two vector games:

     • asteroids        — drifting field + auto-piloting ship
     • missile command  — 3 bases (auto + click-to-strike) vs missiles

   Per-page controls via data attributes:

     data-aurora-asteroids="N"  — asteroid count (default 6, 0 = none);
                                  also scales missile-command intensity
     data-aurora-ship="off"     — hide the ship entirely
     data-aurora-mode="missile" — initial game (default "asteroids")

   The toggle is a runtime switch only — no localStorage, nothing
   persisted. Each page declares exactly what it wants. Both games read
   their colours from getComputedStyle(documentElement) so the field
   stays static white while readable chrome rides the spectrum wave. */

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

        const ship = { x: W / 2, y: H / 2, angle: 0, vx: 0, vy: 0, thrusting: false, drift: Math.random() * 1000 };
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
        let particles = [];           // explosion debris
        let dead = false, deadAt = 0; // ship destroyed → awaiting respawn
        let raf, prev = performance.now(), lastShot = 0;

        function step(now) {
            const dt = Math.min(50, now - prev); prev = now;
            const f = dt / 16;

            ctx.fillStyle = palette.bg;
            ctx.fillRect(0, 0, W, H);

            // Ship: rotate toward a movement target, then apply forward-only
            // thrust scaled by alignment. Friction + max-speed cap give it
            // inertia; the ship coasts past targets and curves back instead
            // of teleporting.
            if (!shipOff && !dead) {
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

                const ddx = targetX - ship.x;
                const ddy = targetY - ship.y;
                const distSq = ddx * ddx + ddy * ddy;
                const aim = Math.atan2(ddy, ddx);
                let diff = aim - ship.angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                ship.angle += diff * 0.06 * f;

                // Forward thrust only when (a) we're past the arrival radius
                // and (b) we're roughly pointed at the target. Misaligned ⇒
                // coast and turn first. Pointer mode ramps accel + max speed
                // with distance — gentle when the cursor is close, charging
                // across the screen when it's far away.
                const arrival = 60;
                const align = Math.max(0, Math.cos(diff));
                let maxSpeed, accel;
                if (pointer.active) {
                    const dist = Math.sqrt(distSq);
                    const farRange = Math.min(W, H) * 0.6;
                    const t = Math.max(0, Math.min(1, (dist - arrival) / farRange));
                    accel = 0.025 + t * 0.055;
                    maxSpeed = 0.9 + t * 1.1;
                } else {
                    accel = 0.045;
                    maxSpeed = 1.7;
                }
                const thrust = distSq > arrival * arrival ? accel * align : 0;
                ship.thrusting = thrust > 0.005;
                ship.vx += Math.cos(ship.angle) * thrust * f;
                ship.vy += Math.sin(ship.angle) * thrust * f;

                const fric = Math.pow(0.985, f);
                ship.vx *= fric;
                ship.vy *= fric;

                const sp = Math.hypot(ship.vx, ship.vy);
                if (sp > maxSpeed) {
                    ship.vx = ship.vx / sp * maxSpeed;
                    ship.vy = ship.vy / sp * maxSpeed;
                }

                ship.x += ship.vx * f;
                ship.y += ship.vy * f;
                if (ship.x < 0) { ship.x = 0; if (ship.vx < 0) ship.vx = 0; }
                else if (ship.x > W) { ship.x = W; if (ship.vx > 0) ship.vx = 0; }
                if (ship.y < 0) { ship.y = 0; if (ship.vy < 0) ship.vy = 0; }
                else if (ship.y > H) { ship.y = H; if (ship.vy > 0) ship.vy = 0; }

                // Opportunistic shooting: fire if any asteroid is in the forward arc.
                if (now - lastShot > 520) {
                    for (const a of asteroids) {
                        let dax = a.x - ship.x, day = a.y - ship.y;
                        if (dax > W / 2) dax -= W; else if (dax < -W / 2) dax += W;
                        if (day > H / 2) day -= H; else if (day < -H / 2) day += H;
                        let d2 = Math.atan2(day, dax) - ship.angle;
                        while (d2 > Math.PI) d2 -= Math.PI * 2;
                        while (d2 < -Math.PI) d2 += Math.PI * 2;
                        if (Math.abs(d2) < 0.22) {
                            bullets.push({
                                x: ship.x + Math.cos(ship.angle) * 16,
                                y: ship.y + Math.sin(ship.angle) * 16,
                                vx: Math.cos(ship.angle) * 5.5 + ship.vx,
                                vy: Math.sin(ship.angle) * 5.5 + ship.vy,
                                life: 140,
                            });
                            lastShot = now;
                            break;
                        }
                    }
                }

                // Ship vs. asteroid: blow the ship into spinning debris.
                for (const a of asteroids) {
                    const cx = a.x - ship.x, cy = a.y - ship.y;
                    if (cx * cx + cy * cy < (a.radius + 8) * (a.radius + 8)) {
                        dead = true;
                        deadAt = now;
                        ship.thrusting = false;
                        for (let i = 0; i < 24; i++) {
                            const pa = Math.random() * Math.PI * 2;
                            const ps = 1 + Math.random() * 3.6;
                            const life = 34 + Math.random() * 30;
                            particles.push({
                                x: ship.x, y: ship.y,
                                vx: Math.cos(pa) * ps + ship.vx * 0.4,
                                vy: Math.sin(pa) * ps + ship.vy * 0.4,
                                ang: Math.random() * Math.PI * 2,
                                va: (Math.random() - 0.5) * 0.35,
                                len: 4 + Math.random() * 7,
                                life, maxLife: life,
                            });
                        }
                        break;
                    }
                }
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
            if (!shipOff && !dead) {
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
                if (ship.thrusting && ((now / 80) | 0) % 2) {
                    ctx.beginPath();
                    ctx.moveTo(-5, -3);
                    ctx.lineTo(-12, 0);
                    ctx.lineTo(-5, 3);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
                ctx.restore();
            }

            // explosion debris — short shards that spin out and fade
            if (particles.length) {
                ctx.strokeStyle = palette.head;
                ctx.lineWidth = 1.6;
                ctx.shadowColor = palette.head;
                ctx.shadowBlur = 8;
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx * f;
                    p.y += p.vy * f;
                    const pf = Math.pow(0.97, f);
                    p.vx *= pf;
                    p.vy *= pf;
                    p.ang += p.va * f;
                    p.life -= f;
                    if (p.life <= 0) { particles.splice(i, 1); continue; }
                    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.ang);
                    ctx.beginPath();
                    ctx.moveTo(-p.len / 2, 0);
                    ctx.lineTo(p.len / 2, 0);
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }

            // once the debris clears, respawn a fresh field + ship
            if (dead && now - deadAt > 900 && particles.length === 0) {
                ship.x = W / 2;
                ship.y = H / 2;
                ship.vx = 0;
                ship.vy = 0;
                ship.angle = 0;
                ship.thrusting = false;
                ship.drift = Math.random() * 1000;
                asteroids = Array.from({ length: count }, () => makeAsteroid(3));
                bullets.length = 0;
                dead = false;
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

    // Self-playing Missile Command, faithful to the 1980 arcade economy:
    // three bases (left / centre / right) with 10 missiles each — 30 per
    // wave — refilled and revived at the start of every wave; the centre
    // base fires fast interceptors, the sides slow. Cities persist across
    // waves (game over = all cities gone → full rebuild). An auto-AI fires
    // at the lowest threat; **a mouse click commands a strike on that
    // exact spot** from the nearest base with ammo, otherwise the AI
    // fires as it sees fit. Friendly structures + explosions draw in
    // palette.head (white), incoming in palette.accent.
    function startMissileCommand(canvas, palette, intensity) {
        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const W = cssW, H = cssH;
        const groundY = H - 14;
        const AMMO = 10; // per base, per wave — 3 bases ⇒ 30 per wave

        const nCities = Math.max(3, Math.min(6, 3 + Math.round(intensity / 3)));
        let cities, bases;
        function spread(k, a, b) {
            const xs = [];
            for (let i = 0; i < k; i++) xs.push(k === 1 ? (a + b) / 2 : a + (b - a) * i / (k - 1));
            return xs;
        }
        // Bases at the edges + centre; cities in two clusters between them
        // (the classic base · city·city·city · base · city·city·city · base).
        function buildBases() {
            bases = [
                { x: Math.max(24, W * 0.06), ammo: AMMO, alive: true, fast: false },
                { x: W * 0.5, ammo: AMMO, alive: true, fast: true },
                { x: Math.min(W - 24, W * 0.94), ammo: AMMO, alive: true, fast: false },
            ];
        }
        function buildDefenses() {
            const lN = Math.ceil(nCities / 2), rN = nCities - lN;
            cities = spread(lN, W * 0.17, W * 0.40).concat(spread(rN, W * 0.60, W * 0.83))
                .map(x => ({ x, alive: true }));
            buildBases();
        }
        buildDefenses();

        const incoming = [], friendly = [], blasts = [];
        let particles = [];
        let dead = false, deadAt = 0;
        let raf, prev = performance.now();
        const spawnEvery = Math.max(700, 2600 / (0.6 + intensity * 0.28));
        const maxIncoming = Math.max(3, Math.min(14, 2 + Math.round(intensity)));
        let nextSpawn = performance.now() + 500, lastAI = 0;

        // Discrete waves: a fixed quota of incoming, then bases revive +
        // rearm. Ammo (30/wave) and AI cadence pace things — no concurrency cap.
        let wave = 1, waveSpawned = 0;
        const quotaFor = w => Math.min(22, 4 + Math.round(intensity) + (w - 1));
        let waveQuota = quotaFor(1);
        let interWave = false, interWaveAt = 0;

        function aliveTargets() {
            const t = cities.filter(c => c.alive).map(c => c.x);
            for (const b of bases) if (b.alive) t.push(b.x);
            return t;
        }
        function spawnIncoming() {
            const tgts = aliveTargets();
            if (!tgts.length) return;
            const ox = 20 + Math.random() * (W - 40);
            const tx = tgts[(Math.random() * tgts.length) | 0] + (Math.random() - 0.5) * 16;
            const ang = Math.atan2(groundY - (-12), tx - ox);
            const sp = 0.42 + Math.random() * 0.34 + intensity * 0.012;
            incoming.push({
                ox, oy: -12, x: ox, y: -12,
                vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                alive: true, targeted: false, targetUntil: 0,
            });
        }
        function detonate(x, y) {
            blasts.push({ x, y, r: 0, maxR: 24 + Math.random() * 16, phase: 0 });
        }
        function sparks(x, y, n, big) {
            for (let i = 0; i < n; i++) {
                const a = Math.random() * Math.PI * 2;
                const s = (big ? 1.4 : 0.8) + Math.random() * (big ? 3.4 : 2.2);
                const life = 22 + Math.random() * 26;
                particles.push({
                    x, y,
                    vx: Math.cos(a) * s, vy: Math.sin(a) * s - (big ? 0.6 : 0),
                    ang: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 0.4,
                    len: 3 + Math.random() * 5, life, maxLife: life,
                });
            }
        }
        // Nearest alive base with ammo to a target x (null if none can fire).
        function pickBase(x) {
            let best = null, bd = Infinity;
            for (const b of bases) {
                if (!b.alive || b.ammo <= 0) continue;
                const d = Math.abs(b.x - x);
                if (d < bd) { bd = d; best = b; }
            }
            return best;
        }
        function launch(base, dx, dy) {
            base.ammo--;
            const sp = base.fast ? 5.6 : 3.4; // centre base is the fast one
            const ang = Math.atan2(dy - groundY, dx - base.x);
            friendly.push({
                ox: base.x, oy: groundY, x: base.x, y: groundY,
                vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, tx: dx, ty: dy,
            });
        }
        function aiFire(now) {
            if (friendly.length >= 24) return; // array safety bound only
            // Most threatening untargeted incoming = the one closest to ground.
            let best = null, bestProg = -1;
            for (const m of incoming) {
                if (!m.alive || (m.targeted && now < m.targetUntil)) continue;
                const prog = (m.y + 12) / (groundY + 12);
                if (prog > bestProg) { bestProg = prog; best = m; }
            }
            if (!best) return;
            // Detonate ahead of it, clamped to an altitude band so the
            // blast meets the missile well above the cities.
            const dy = Math.max(H * 0.32, Math.min(groundY - 46, best.y + best.vy * 46));
            const k = best.vy !== 0 ? (dy - best.y) / best.vy : 0;
            const dx = Math.max(16, Math.min(W - 16, best.x + best.vx * k));
            const base = pickBase(dx);
            if (!base) return; // every base dead or out of ammo
            launch(base, dx, dy);
            best.targeted = true;
            best.targetUntil = now + 1600;
        }

        // A click (or tap) commands a strike on that exact point — fired
        // from the nearest base with ammo. Listens on window because
        // #aurora-root is pointer-events:none; we never preventDefault, so
        // links/buttons keep working — the strike is purely additive.
        function onCommand(e) {
            if (dead || interWave) return;
            const t = e.touches && e.touches[0] ? e.touches[0] : e;
            if (t.clientX === undefined) return;
            const dx = Math.max(8, Math.min(W - 8, t.clientX));
            const dy = Math.max(H * 0.1, Math.min(groundY - 12, t.clientY));
            const base = pickBase(dx);
            if (base) launch(base, dx, dy);
        }
        window.addEventListener('click', onCommand);

        function step(now) {
            const dt = Math.min(50, now - prev); prev = now;
            const f = dt / 16;

            ctx.fillStyle = palette.bg;
            ctx.fillRect(0, 0, W, H);

            if (!dead && !interWave) {
                if (waveSpawned < waveQuota && now >= nextSpawn && incoming.length < maxIncoming) {
                    spawnIncoming();
                    waveSpawned++;
                    nextSpawn = now + spawnEvery * (0.7 + Math.random() * 0.9);
                }
                if (now - lastAI > 300) { aiFire(now); lastAI = now; }
            }

            // incoming missiles
            for (let i = incoming.length - 1; i >= 0; i--) {
                const m = incoming[i];
                m.x += m.vx * f; m.y += m.vy * f;
                if (m.y >= groundY) {
                    m.alive = false;
                    detonate(m.x, groundY);
                    sparks(m.x, groundY, 14, true);
                    let hit = null, hd = 26;
                    for (const c of cities) {
                        if (!c.alive) continue;
                        const d = Math.abs(c.x - m.x);
                        if (d < hd) { hd = d; hit = c; }
                    }
                    for (const b of bases) {
                        if (!b.alive) continue;
                        const d = Math.abs(b.x - m.x);
                        if (d < hd) { hd = d; hit = b; }
                    }
                    if (hit) hit.alive = false; // a downed base loses its ammo until next wave
                    incoming.splice(i, 1);
                }
            }

            // interceptors → detonate at their aim point
            for (let i = friendly.length - 1; i >= 0; i--) {
                const fr = friendly[i];
                fr.x += fr.vx * f; fr.y += fr.vy * f;
                if (Math.hypot(fr.x - fr.tx, fr.y - fr.ty) < 6 || fr.y <= fr.ty) {
                    detonate(fr.tx, fr.ty);
                    friendly.splice(i, 1);
                    continue;
                }
                if (fr.y < -20 || fr.x < -20 || fr.x > W + 20) friendly.splice(i, 1);
            }

            // blasts grow then shrink; clear any incoming inside the radius
            for (let i = blasts.length - 1; i >= 0; i--) {
                const b = blasts[i];
                if (b.phase === 0) { b.r += 1.7 * f; if (b.r >= b.maxR) { b.r = b.maxR; b.phase = 1; } }
                else { b.r -= 1.15 * f; if (b.r <= 0) { blasts.splice(i, 1); continue; } }
                for (const m of incoming) {
                    if (!m.alive) continue;
                    const dx = m.x - b.x, dy = m.y - b.y;
                    if (dx * dx + dy * dy < b.r * b.r) {
                        m.alive = false;
                        detonate(m.x, m.y);     // chain reaction
                        sparks(m.x, m.y, 9, false);
                    }
                }
            }
            for (let i = incoming.length - 1; i >= 0; i--) {
                if (!incoming[i].alive) incoming.splice(i, 1);
            }

            // ground line
            ctx.strokeStyle = palette.accent;
            ctx.globalAlpha = 0.16;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, groundY + 6);
            ctx.lineTo(W, groundY + 6);
            ctx.stroke();
            ctx.globalAlpha = 1;

            // cities + bases (white, like the ship)
            ctx.strokeStyle = palette.head;
            ctx.shadowColor = palette.head;
            ctx.shadowBlur = 6;
            ctx.lineWidth = 1.4;
            for (const c of cities) {
                if (!c.alive) continue;
                ctx.beginPath();
                ctx.moveTo(c.x - 9, groundY + 5);
                ctx.lineTo(c.x - 9, groundY - 4);
                ctx.lineTo(c.x - 4, groundY - 4);
                ctx.lineTo(c.x - 4, groundY - 10);
                ctx.lineTo(c.x + 4, groundY - 10);
                ctx.lineTo(c.x + 4, groundY - 4);
                ctx.lineTo(c.x + 9, groundY - 4);
                ctx.lineTo(c.x + 9, groundY + 5);
                ctx.stroke();
            }
            for (const b of bases) {
                if (!b.alive) continue;
                // Empty-but-standing base dims; ammo shows as a short bar.
                ctx.globalAlpha = b.ammo > 0 ? 1 : 0.4;
                ctx.beginPath();
                ctx.moveTo(b.x - 12, groundY + 5);
                ctx.lineTo(b.x, groundY - 13);
                ctx.lineTo(b.x + 12, groundY + 5);
                ctx.closePath();
                ctx.stroke();
                if (b.ammo > 0) {
                    const bw = 20 * (b.ammo / AMMO);
                    ctx.beginPath();
                    ctx.moveTo(b.x - bw / 2, groundY - 17);
                    ctx.lineTo(b.x + bw / 2, groundY - 17);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }
            ctx.shadowBlur = 0;

            // incoming trails (accent)
            ctx.strokeStyle = palette.accent;
            ctx.fillStyle = palette.accent;
            ctx.shadowColor = palette.accent;
            ctx.shadowBlur = 6;
            ctx.lineWidth = 1.3;
            for (const m of incoming) {
                ctx.beginPath();
                ctx.moveTo(m.ox, m.oy);
                ctx.lineTo(m.x, m.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // interceptor trails (white)
            ctx.strokeStyle = palette.head;
            ctx.fillStyle = palette.head;
            ctx.shadowColor = palette.head;
            ctx.shadowBlur = 6;
            for (const fr of friendly) {
                ctx.beginPath();
                ctx.moveTo(fr.ox, fr.oy);
                ctx.lineTo(fr.x, fr.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(fr.x, fr.y, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // blasts — glowing ring + faint fill
            for (const b of blasts) {
                const r = Math.max(0, b.r);
                ctx.beginPath();
                ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
                ctx.fillStyle = palette.head;
                ctx.globalAlpha = 0.06;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = palette.head;
                ctx.lineWidth = 1.6;
                ctx.shadowColor = palette.head;
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // debris shards
            if (particles.length) {
                ctx.strokeStyle = palette.head;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = palette.head;
                ctx.shadowBlur = 7;
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx * f;
                    p.y += p.vy * f;
                    const pf = Math.pow(0.95, f);
                    p.vx *= pf; p.vy *= pf; p.vy += 0.04 * f;
                    p.ang += p.va * f;
                    p.life -= f;
                    if (p.life <= 0) { particles.splice(i, 1); continue; }
                    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.ang);
                    ctx.beginPath();
                    ctx.moveTo(-p.len / 2, 0);
                    ctx.lineTo(p.len / 2, 0);
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }

            const fieldClear = incoming.length === 0 && friendly.length === 0
                && blasts.length === 0 && particles.length === 0;

            if (dead) {
                // Game over (all cities gone) → pause, rebuild everything.
                if (now - deadAt > 1200 && incoming.length === 0
                    && blasts.length === 0 && particles.length === 0) {
                    buildDefenses();
                    wave = 1; waveSpawned = 0; waveQuota = quotaFor(1);
                    friendly.length = 0;
                    interWave = false;
                    dead = false;
                }
            } else if (!cities.some(c => c.alive)) {
                dead = true; deadAt = now;
            } else if (interWave) {
                // Between waves: bases revive + rearm, cities carry over.
                if (now - interWaveAt > 1100) {
                    for (const b of bases) { b.alive = true; b.ammo = AMMO; }
                    wave++; waveSpawned = 0; waveQuota = quotaFor(wave);
                    nextSpawn = now + 600;
                    interWave = false;
                }
            } else if (waveSpawned >= waveQuota && fieldClear) {
                interWave = true; interWaveAt = now;
            }

            raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('click', onCommand);
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
    let toggleEl = null;
    let config = { count: 6, shipOff: false };
    let mode = 'asteroids';

    // True when the current mode actually animates something. Asteroids
    // with an empty field + no ship (the links page) draws nothing, so it
    // gets no canvas loop and no toggle; missile command always plays.
    function backdropActive() {
        if (reducedMotion) return false;
        if (mode === 'missile') return true;
        return !(config.count === 0 && config.shipOff);
    }

    function startBackdrop() {
        if (stopFn) { stopFn(); stopFn = null; }
        if (reducedMotion || !canvasEl) return;
        const palette = readPalette();
        if (mode === 'missile') {
            stopFn = startMissileCommand(canvasEl, palette, Math.max(1, config.count || 1));
        } else {
            // Nothing to animate? Leave canvas transparent; glows + vignette stay.
            if (config.count === 0 && config.shipOff) return;
            stopFn = startAsteroids(canvasEl, palette, config.count, config.shipOff);
        }
    }

    // The label names the game you'd switch *to*, paired with the ⇄ glyph.
    function otherMode() { return mode === 'asteroids' ? 'missile command' : 'asteroids'; }
    function syncToggle() {
        if (!toggleEl) return;
        toggleEl.querySelector('.aurora-toggle-label').textContent = otherMode();
        toggleEl.setAttribute('aria-label', 'Switch backdrop to ' + otherMode());
    }
    function buildToggle() {
        if (toggleEl || !backdropActive()) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'aurora-toggle';
        b.innerHTML = '<span class="aurora-toggle-swap" aria-hidden="true">⇄</span>'
            + '<span class="aurora-toggle-label"></span>';
        b.addEventListener('click', () => {
            mode = mode === 'asteroids' ? 'missile' : 'asteroids';
            syncToggle();
            startBackdrop();
        });
        document.body.appendChild(b);
        toggleEl = b;
        syncToggle();
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
        const m = body.getAttribute('data-aurora-mode');
        if (m === 'missile' || m === 'asteroids') mode = m;

        canvasEl = buildRoot();
        startBackdrop();
        buildToggle();
        window.addEventListener('resize', onResize);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
