/* global React */
const { useState, useRef, useEffect } = React;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

// ---------- shared content ----------
const BIO = {
  nav: ["home", "workshop", "links"],
  domain: "rollins.io",
  initials: "MR",
  name: "Michael Rollins",
  tagline: "Pragmatic engineer and CTO shaping best practices for agentic engineering.",
  bullets: [
    "Scaled Flurry by Yahoo to 5 billion daily sessions",
    "Now: agentic systems at Rellify and FD",
    "Early AI at Outlier",
    "iOS, Android, backend, frontend, infrastructure",
  ],
  closer: "Builder, engineer, and host of the Δ-V live-build workshop.",
  workshop: {
    kicker: "UPCOMING WORKSHOP",
    date: "Thursday, May 14",
    title: "Agents building Agents",
    body: "Two hours, live. 60 minutes of coding on screen — Build an agent with Python — then 60 minutes of deep Q&A.",
  },
};

// ---------- variation 1: Midnight Amber (baseline) ----------
function MidnightAmber() {
  const T = {
    bg: "#0a0a0a",
    fg: "#f4f4f4",
    muted: "#8a8a8a",
    dim: "#5a5a5a",
    accent: "#e8782e",
    accentDim: "#7a3a14",
    card: "#0f0f0f",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.sans, minHeight: "100%", padding: "56px 40px 60px" }}>
      <Nav T={T} sep="·" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 36, marginBottom: 56 }}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${T.accent}, #6a2810 70%, #1a0a04)`, display: "grid", placeItems: "center", fontFamily: T.mono, fontSize: 22, color: "#1a0a04", letterSpacing: 1, fontWeight: 600 }}>
          {BIO.initials}
        </div>
        <div style={{ marginTop: 18, fontFamily: T.mono, fontSize: 15, color: T.muted, letterSpacing: 0.5 }}>{BIO.domain}</div>
      </div>
      <h1 style={{ fontSize: 56, lineHeight: 1.02, fontWeight: 600, letterSpacing: -1.5, margin: "20px 0 28px" }}>{BIO.name}</h1>
      <p style={{ fontSize: 22, lineHeight: 1.35, color: T.fg, margin: "0 0 36px" }}>{BIO.tagline}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 18 }}>
        {BIO.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 16, fontSize: 19, color: T.fg }}>
            <span style={{ color: T.dim, flexShrink: 0 }}>—</span><span>{b}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 19, color: T.muted, margin: "0 0 48px" }}>{BIO.closer}</p>
      <div style={{ border: `1px solid ${T.accentDim}`, borderRadius: 14, padding: "26px 28px", background: "linear-gradient(180deg, rgba(232,120,46,0.04), transparent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 13, color: T.accent, letterSpacing: 0.4 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: T.accent, marginRight: 10, verticalAlign: "middle" }}></span>
            {BIO.workshop.kicker} · {BIO.workshop.date}
          </div>
          <div style={{ color: T.accent, fontSize: 18 }}>→</div>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 12px", letterSpacing: -0.5 }}>{BIO.workshop.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: T.muted, margin: 0 }}>{BIO.workshop.body}</p>
      </div>
    </div>
  );
}

// ---------- variation 2: Paper Editorial ----------
function PaperEditorial() {
  const T = {
    bg: "#f3eee5",
    fg: "#1a1612",
    muted: "#6b5d4f",
    dim: "#a89a87",
    accent: "#8a2a1f",
    rule: "#cdc2ad",
    card: "#ebe4d4",
    serif: "'Newsreader', 'Crimson Pro', Georgia, serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.serif, minHeight: "100%", padding: "48px 44px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 16, borderBottom: `1px solid ${T.rule}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>Vol. 14 — Spring 2026</div>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, letterSpacing: 1 }}>{BIO.domain}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 28, padding: "20px 0 36px", fontFamily: T.mono, fontSize: 13, letterSpacing: 0.4 }}>
        {BIO.nav.map((n, i) => <span key={i} style={{ color: i === 0 ? T.fg : T.muted, borderBottom: i === 0 ? `1px solid ${T.fg}` : "none", paddingBottom: 2 }}>{n}</span>)}
      </div>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>— A Personal Letter —</div>
        <h1 style={{ fontSize: 76, lineHeight: 0.95, fontWeight: 400, fontStyle: "italic", letterSpacing: -2, margin: "0 0 6px" }}>Michael</h1>
        <h1 style={{ fontSize: 76, lineHeight: 0.95, fontWeight: 400, letterSpacing: -2, margin: 0 }}>Rollins</h1>
      </div>
      <div style={{ width: 40, height: 1, background: T.fg, margin: "0 auto 32px" }}></div>
      <p style={{ fontSize: 23, lineHeight: 1.4, margin: "0 0 36px", textAlign: "left" }}>
        <span style={{ float: "left", fontSize: 78, lineHeight: 0.85, fontWeight: 400, marginRight: 10, marginTop: 6, color: T.accent }}>P</span>
        ragmatic engineer and CTO shaping best practices for agentic engineering.
      </p>
      <div style={{ borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, padding: "20px 0", margin: "0 0 32px" }}>
        {BIO.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 20, padding: "10px 0", fontSize: 18, borderBottom: i < BIO.bullets.length - 1 ? `1px dotted ${T.rule}` : "none" }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, paddingTop: 6, minWidth: 24 }}>0{i + 1}</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 17, fontStyle: "italic", color: T.muted, margin: "0 0 40px", textAlign: "center" }}>{BIO.closer}</p>
      <div style={{ background: T.card, padding: "30px 28px", border: `1px solid ${T.rule}`, position: "relative" }}>
        <div style={{ position: "absolute", top: -10, left: 24, background: T.accent, color: T.bg, padding: "3px 12px", fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5 }}>UPCOMING</div>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, marginTop: 6, marginBottom: 8, letterSpacing: 0.5 }}>{BIO.workshop.date.toUpperCase()}</div>
        <h2 style={{ fontSize: 32, fontWeight: 400, fontStyle: "italic", margin: "0 0 14px", letterSpacing: -0.5 }}>{BIO.workshop.title}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: T.fg, margin: "0 0 16px" }}>{BIO.workshop.body}</p>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: 1, textTransform: "uppercase" }}>Reserve seat →</div>
      </div>
    </div>
  );
}

// ---------- variation 3: Lab Mono (brutalist) ----------
function LabMono() {
  const T = {
    bg: "#eeece4",
    fg: "#0c0c0c",
    muted: "#5a5a55",
    accent: "#c8ff00",
    accentInk: "#1a2200",
    rule: "#0c0c0c",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.mono, minHeight: "100%", padding: "32px 28px 40px", fontSize: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", borderBottom: `2px solid ${T.fg}`, paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 18, fontSize: 13 }}>
          {BIO.nav.map((n, i) => <span key={i} style={{ borderBottom: i === 0 ? `2px solid ${T.fg}` : "none", paddingBottom: 4 }}>[{n}]</span>)}
        </div>
        <div style={{ fontSize: 13, color: T.muted }}>{BIO.domain}</div>
      </div>
      <div style={{ marginTop: 32, marginBottom: 32, border: `2px solid ${T.fg}`, padding: 24, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, fontSize: 12, color: T.muted, marginBottom: 20 }}>
          <div>FILE: profile.md</div>
          <div style={{ textAlign: "right" }}>v.2026.05</div>
        </div>
        <div style={{ background: T.accent, color: T.accentInk, display: "inline-block", padding: "4px 10px", fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 18 }}>{BIO.initials} ▮</div>
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5, margin: "0 0 18px", textTransform: "uppercase" }}>
          Michael<br/>Rollins.
        </div>
        <div style={{ height: 2, background: T.fg, marginBottom: 18 }}></div>
        <p style={{ fontSize: 15, lineHeight: 1.55, margin: 0 }}>{BIO.tagline}</p>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, marginBottom: 14, color: T.muted }}>// LOG</div>
        {BIO.bullets.map((b, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, padding: "10px 0", borderBottom: `1px solid ${T.fg}`, fontSize: 14 }}>
            <span style={{ background: T.fg, color: T.bg, padding: "2px 8px", fontSize: 11, alignSelf: "start", marginTop: 2 }}>{String(i).padStart(2, "0")}</span>
            <span style={{ lineHeight: 1.45 }}>{b}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: T.muted, margin: "0 0 28px", padding: "12px 14px", border: `1px dashed ${T.fg}`, lineHeight: 1.5 }}>// {BIO.closer}</p>
      <div style={{ background: T.fg, color: T.bg, padding: "24px 22px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 11, letterSpacing: 2 }}>
          <span style={{ background: T.accent, color: T.accentInk, padding: "3px 8px" }}>● LIVE</span>
          <span>{BIO.workshop.date.toUpperCase()}</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 14px", letterSpacing: -0.5, textTransform: "uppercase" }}>{BIO.workshop.title}</h2>
        <p style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 18px", color: "#cfcfcf" }}>{BIO.workshop.body}</p>
        <div style={{ background: T.accent, color: T.accentInk, padding: "10px 14px", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textAlign: "center" }}>RSVP →</div>
      </div>
    </div>
  );
}

// ---------- variation 4: Aurora ----------
function Aurora() {
  const T = {
    bg: "#0a0e1f",
    bg2: "#141a35",
    fg: "#f1f0ff",
    muted: "#8b8db0",
    accent: "#a78bfa",
    accent2: "#22d3ee",
    rule: "#1f254a",
    sans: "'Space Grotesk', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  };
  return (
    <div style={{ background: `radial-gradient(ellipse at top, ${T.bg2}, ${T.bg} 60%)`, color: T.fg, fontFamily: T.sans, minHeight: "100%", padding: "52px 40px 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -120, left: -80, width: 320, height: 320, background: `radial-gradient(circle, ${T.accent}33, transparent 70%)`, filter: "blur(20px)" }}></div>
      <div style={{ position: "absolute", top: 80, right: -120, width: 280, height: 280, background: `radial-gradient(circle, ${T.accent2}26, transparent 70%)`, filter: "blur(20px)" }}></div>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", gap: 32, fontFamily: T.mono, fontSize: 13, marginBottom: 40, color: T.muted }}>
        {BIO.nav.map((n, i) => <span key={i} style={{ color: i === 0 ? T.fg : T.muted }}>{n}</span>)}
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 56 }}>
        <div style={{ width: 130, height: 130, borderRadius: "50%", background: `conic-gradient(from 220deg, ${T.accent}, ${T.accent2}, ${T.accent})`, padding: 2, display: "grid", placeItems: "center", boxShadow: `0 0 60px ${T.accent}55` }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: T.bg, display: "grid", placeItems: "center", fontFamily: T.mono, fontSize: 26, fontWeight: 500, letterSpacing: 1 }}>
            {BIO.initials}
          </div>
        </div>
        <div style={{ marginTop: 20, fontFamily: T.mono, fontSize: 14, color: T.muted, letterSpacing: 1 }}>{BIO.domain}</div>
      </div>
      <h1 style={{ position: "relative", fontSize: 60, lineHeight: 1, fontWeight: 500, letterSpacing: -2, margin: "0 0 28px", textAlign: "center" }}>
        Michael<br/>
        <span style={{ background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "italic", fontWeight: 400 }}>Rollins</span>
      </h1>
      <p style={{ position: "relative", fontSize: 20, lineHeight: 1.45, color: T.fg, margin: "0 0 40px", textAlign: "center" }}>{BIO.tagline}</p>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
        {BIO.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.rule}`, borderRadius: 12, backdropFilter: "blur(8px)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, boxShadow: `0 0 10px ${T.accent}`, flexShrink: 0 }}></span>
            <span style={{ fontSize: 16 }}>{b}</span>
          </div>
        ))}
      </div>
      <p style={{ position: "relative", fontSize: 17, color: T.muted, margin: "0 0 40px", textAlign: "center", fontStyle: "italic" }}>{BIO.closer}</p>
      <div style={{ position: "relative", borderRadius: 18, padding: 1, background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})` }}>
        <div style={{ background: T.bg, borderRadius: 17, padding: "26px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 2, color: T.accent2 }}>◆ {BIO.workshop.kicker}</div>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>{BIO.workshop.date}</div>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 12px", letterSpacing: -0.5 }}>{BIO.workshop.title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: T.muted, margin: "0 0 18px" }}>{BIO.workshop.body}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, borderRadius: 999, color: T.bg, fontFamily: T.mono, fontSize: 13, fontWeight: 500 }}>
            Reserve · May 14 →
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- variation 5: Sandstone ----------
function Sandstone() {
  const T = {
    bg: "#e9dfc8",
    bg2: "#dccfa8",
    fg: "#1c1812",
    muted: "#6b6047",
    dim: "#a39476",
    accent: "#c2410c",
    accent2: "#1c1812",
    rule: "#c4b48e",
    serif: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.serif, minHeight: "100%", padding: "48px 40px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 16, marginBottom: 56, fontFamily: T.mono, fontSize: 12, letterSpacing: 1, color: T.muted }}>
        <span style={{ textTransform: "uppercase" }}>{BIO.domain}</span>
        <span style={{ height: 1, background: T.rule }}></span>
        <span style={{ textTransform: "uppercase" }}>EST. 2003</span>
      </div>
      <div style={{ position: "relative", marginBottom: 48 }}>
        <div style={{ position: "absolute", inset: "auto 0 -8px 0", height: 1, background: T.rule }}></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, paddingBottom: 24 }}>
          <div style={{ width: 92, height: 92, borderRadius: "50%", background: `radial-gradient(circle at 30% 25%, ${T.accent}, #5a1c08 75%)`, flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", inset: 6, borderRadius: "50%", border: `1px solid ${T.bg}33` }}></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>A field guide</div>
            <h1 style={{ fontSize: 64, lineHeight: 0.92, fontWeight: 400, letterSpacing: -1.5, margin: 0, fontStyle: "italic" }}>Michael<br/>Rollins</h1>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 26, lineHeight: 1.35, margin: "0 0 44px", color: T.fg, fontStyle: "italic" }}>“{BIO.tagline}”</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, marginBottom: 40 }}>
        {BIO.bullets.map((b, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "baseline", gap: 16, padding: "18px 0", borderTop: `1px solid ${T.rule}`, borderBottom: i === BIO.bullets.length - 1 ? `1px solid ${T.rule}` : "none" }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, letterSpacing: 1 }}>§ {String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 20, lineHeight: 1.35 }}>{b}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 18, fontStyle: "italic", color: T.muted, margin: "0 0 44px", textAlign: "center", padding: "0 20px" }}>— {BIO.closer} —</p>
      <div style={{ background: T.bg2, padding: "30px 28px", borderRadius: 4, border: `1px solid ${T.rule}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: T.mono, fontSize: 11, letterSpacing: 2, color: T.accent, marginBottom: 14, textTransform: "uppercase" }}>
          <span style={{ width: 6, height: 6, background: T.accent, borderRadius: "50%" }}></span>
          {BIO.workshop.kicker}
          <span style={{ flex: 1, height: 1, background: T.rule, marginLeft: 8 }}></span>
          <span style={{ color: T.muted }}>MAY 14</span>
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 400, fontStyle: "italic", margin: "0 0 14px", letterSpacing: -0.5, lineHeight: 1 }}>{BIO.workshop.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: T.fg, margin: "0 0 18px" }}>{BIO.workshop.body}</p>
        <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: 1.5, color: T.accent, textTransform: "uppercase", borderTop: `1px solid ${T.rule}`, paddingTop: 14 }}>
          Reserve a seat ⟶
        </div>
      </div>
    </div>
  );
}

// ---------- variation 6: Frost ----------
function Frost() {
  const T = {
    bg: "#f6f7f9",
    fg: "#0c1220",
    muted: "#5b667a",
    dim: "#aab1bf",
    accent: "#1d4ed8",
    accent2: "#0ea5e9",
    rule: "#e3e7ee",
    card: "#ffffff",
    sans: "'Manrope', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.sans, minHeight: "100%", padding: "44px 36px 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: T.card, borderRadius: 999, border: `1px solid ${T.rule}`, marginBottom: 44, boxShadow: "0 1px 2px rgba(12,18,32,0.04)" }}>
        <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 600 }}>{BIO.domain}</div>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: T.muted }}>
          {BIO.nav.map((n, i) => <span key={i} style={{ color: i === 0 ? T.accent : T.muted, fontWeight: i === 0 ? 600 : 500 }}>{n}</span>)}
        </div>
      </div>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 8px", background: T.card, border: `1px solid ${T.rule}`, borderRadius: 999, marginBottom: 28 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, display: "grid", placeItems: "center", color: "white", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{BIO.initials}</span>
          <span style={{ fontSize: 13, color: T.muted }}>Available for advisory</span>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a" }}></span>
        </div>
        <h1 style={{ fontSize: 60, lineHeight: 1, fontWeight: 700, letterSpacing: -2, margin: "0 0 22px" }}>Michael Rollins.</h1>
        <p style={{ fontSize: 22, lineHeight: 1.4, color: T.muted, margin: 0, fontWeight: 400 }}>
          Pragmatic engineer and CTO shaping <span style={{ color: T.fg, fontWeight: 600 }}>best practices for agentic engineering.</span>
        </p>
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.rule}`, borderRadius: 20, padding: "8px", marginBottom: 28 }}>
        {BIO.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderBottom: i < BIO.bullets.length - 1 ? `1px solid ${T.rule}` : "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${T.accent}10`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: T.accent }}></div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>{b}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 16, color: T.muted, margin: "0 0 36px", textAlign: "center", lineHeight: 1.5 }}>{BIO.closer}</p>
      <div style={{ borderRadius: 20, padding: "28px 28px", background: `linear-gradient(160deg, ${T.accent}, ${T.accent2})`, color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}></div>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 11px", background: "rgba(255,255,255,0.15)", borderRadius: 999, fontFamily: T.mono, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, backdropFilter: "blur(4px)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }}></span>
              UPCOMING
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 12, opacity: 0.85 }}>{BIO.workshop.date}</div>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 700, margin: "0 0 10px", letterSpacing: -1 }}>{BIO.workshop.title}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 18px", opacity: 0.92 }}>{BIO.workshop.body}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "white", color: T.accent, borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
            Reserve seat <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- variation 7: Matrix ----------
const MATRIX_PALETTES = {
  classic: { name: "Classic",  bg: "#000000", rain: "#00ff66", head: "#dcffe6", fg: "#caffd4", muted: "#5fa872", accent: "#00ff66" },
  amber:   { name: "Amber",    bg: "#0a0500", rain: "#ffaa00", head: "#fff0c8", fg: "#ffe5b8", muted: "#b88a3f", accent: "#ffaa00" },
  ice:     { name: "Ice",      bg: "#000812", rain: "#00d9ff", head: "#dcf7ff", fg: "#cdeaff", muted: "#5fa3b8", accent: "#22ddff" },
  blood:   { name: "Blood",    bg: "#0a0204", rain: "#ff2855", head: "#ffd4d9", fg: "#ffcad0", muted: "#b85f6a", accent: "#ff3b66" },
  violet:  { name: "Violet",   bg: "#08000f", rain: "#b388ff", head: "#e8d8ff", fg: "#dccbff", muted: "#8a7fb8", accent: "#c099ff" },
  mono:    { name: "Bone",     bg: "#0a0a0a", rain: "#e8e8e8", head: "#ffffff", fg: "#e0e0e0", muted: "#888888", accent: "#ffffff" },
};

function MatrixRain({ palette, width, height, density = 1 }) {
  const ref = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const fontSize = Math.max(8, Math.round(18 / Math.max(0.4, density)));
    const cols = Math.floor(width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    // per-cell horizontal jitter offsets that push away from pointer
    const offsetsX = new Float32Array(cols);
    const offsetsY = new Float32Array(cols);
    const chars = "\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F30123456789{}[]<>=+-*/$#@%&!?";
    const [r, g, b] = hexToRgb(palette.bg);

    // pointer tracking — listen on the canvas's offsetParent (artboard) so the artboard's transform is already accounted for
    const host = canvas.parentElement;
    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width === 0 ? 1 : width / rect.width;
      const scaleY = rect.height === 0 ? 1 : height / rect.height;
      const t = e.touches && e.touches[0] ? e.touches[0] : e;
      if (t.clientX === undefined) return;
      pointerRef.current.x = (t.clientX - rect.left) * scaleX;
      pointerRef.current.y = (t.clientY - rect.top) * scaleY;
      pointerRef.current.active = true;
    }
    function onLeave() { pointerRef.current.active = false; pointerRef.current.x = -9999; pointerRef.current.y = -9999; }
    host && host.addEventListener("mousemove", onMove);
    host && host.addEventListener("mouseleave", onLeave);
    host && host.addEventListener("touchstart", onMove, { passive: true });
    host && host.addEventListener("touchmove", onMove, { passive: true });
    host && host.addEventListener("touchend", onLeave);

    const radius = 110;          // influence radius (px in canvas coords)
    const strength = 70;         // max push distance
    const ease = 0.18;           // spring back factor

    let raf;
    let prev = performance.now();
    function step(now) {
      const dt = Math.min(50, now - prev); prev = now;
      ctx.fillStyle = `rgba(${r},${g},${b},${0.07 * dt / 16})`;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.textBaseline = "top";

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const active = pointerRef.current.active;

      for (let i = 0; i < cols; i++) {
        const baseX = i * fontSize;
        const baseY = drops[i] * fontSize;

        // compute desired offset based on distance to pointer
        let targetOX = 0, targetOY = 0;
        if (active) {
          const dx = baseX - px;
          const dy = baseY - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius && dist > 0.001) {
            const force = (1 - dist / radius);
            const eased = force * force; // sharper near center
            targetOX = (dx / dist) * eased * strength;
            targetOY = (dy / dist) * eased * strength;
          }
        }
        offsetsX[i] += (targetOX - offsetsX[i]) * ease;
        offsetsY[i] += (targetOY - offsetsY[i]) * ease;

        const x = baseX + offsetsX[i];
        const y = baseY + offsetsY[i];

        if (y > 0 && y < height) {
          ctx.fillStyle = palette.head;
          ctx.shadowColor = palette.rain;
          ctx.shadowBlur = 8;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
          ctx.shadowBlur = 0;
          ctx.fillStyle = palette.rain;
          if (y - fontSize > 0) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);
        }
        if (baseY > height && Math.random() > 0.975) drops[i] = -Math.random() * 20;
        drops[i] += 0.45 * dt / 16;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      host && host.removeEventListener("mousemove", onMove);
      host && host.removeEventListener("mouseleave", onLeave);
      host && host.removeEventListener("touchstart", onMove);
      host && host.removeEventListener("touchmove", onMove);
      host && host.removeEventListener("touchend", onLeave);
    };
  }, [palette, width, height, density]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function Matrix() {
  const [paletteKey, setPaletteKey] = useState("classic");
  const T = MATRIX_PALETTES[paletteKey];
  const mono = "'JetBrains Mono', ui-monospace, monospace";
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: mono, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      <MatrixRain palette={T} width={720} height={1340} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${T.bg}99 0%, ${T.bg}cc 55%, ${T.bg}f0 100%)` }}></div>
      <div style={{ position: "relative", padding: "40px 36px 56px" }}>
        {/* color switcher */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, padding: "8px 12px", border: `1px solid ${T.rain}55`, borderRadius: 4, background: `${T.bg}aa`, backdropFilter: "blur(4px)" }}>
          <span style={{ fontSize: 11, color: T.muted, letterSpacing: 2 }}>// PALETTE</span>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(MATRIX_PALETTES).map(([key, p]) => (
              <button key={key} onClick={() => setPaletteKey(key)} title={p.name} style={{ width: 22, height: 22, borderRadius: "50%", background: p.rain, border: paletteKey === key ? `2px solid ${T.fg}` : `1px solid ${p.rain}55`, boxShadow: paletteKey === key ? `0 0 12px ${p.rain}` : "none", cursor: "pointer", padding: 0 }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 13, marginBottom: 36, letterSpacing: 1 }}>
          {BIO.nav.map((n, i) => (
            <span key={i} style={{ color: i === 0 ? T.head : T.muted, textShadow: i === 0 ? `0 0 6px ${T.rain}` : "none" }}>[{n}]</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 44 }}>
          <div style={{ width: 110, height: 110, border: `2px solid ${T.rain}`, display: "grid", placeItems: "center", fontSize: 26, fontWeight: 600, letterSpacing: 2, color: T.head, background: `${T.bg}cc`, boxShadow: `0 0 24px ${T.rain}66, inset 0 0 24px ${T.rain}33`, position: "relative" }}>
            <span style={{ textShadow: `0 0 8px ${T.rain}` }}>{BIO.initials}</span>
            <span style={{ position: "absolute", top: -6, left: -6, width: 8, height: 8, background: T.rain }}></span>
            <span style={{ position: "absolute", top: -6, right: -6, width: 8, height: 8, background: T.rain }}></span>
            <span style={{ position: "absolute", bottom: -6, left: -6, width: 8, height: 8, background: T.rain }}></span>
            <span style={{ position: "absolute", bottom: -6, right: -6, width: 8, height: 8, background: T.rain }}></span>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: T.muted, letterSpacing: 2 }}>&gt; {BIO.domain}_</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 3, marginBottom: 14 }}>$ whoami</div>
          <h1 style={{ fontSize: 52, lineHeight: 1, fontWeight: 700, margin: "0 0 4px", color: T.head, textShadow: `0 0 16px ${T.rain}88, 0 0 2px ${T.rain}`, letterSpacing: -1 }}>MICHAEL</h1>
          <h1 style={{ fontSize: 52, lineHeight: 1, fontWeight: 700, margin: 0, color: T.rain, textShadow: `0 0 16px ${T.rain}88`, letterSpacing: -1 }}>ROLLINS<span style={{ animation: "matrixBlink 1s steps(2) infinite" }}>_</span></h1>
        </div>

        <p style={{ fontSize: 17, lineHeight: 1.5, margin: "0 0 32px", color: T.fg, padding: "14px 16px", background: `${T.bg}cc`, border: `1px solid ${T.rain}33`, borderLeft: `3px solid ${T.rain}` }}>
          <span style={{ color: T.rain }}>&gt;&gt; </span>{BIO.tagline}
        </p>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 3, marginBottom: 12 }}>$ cat ./record.log</div>
          {BIO.bullets.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, padding: "10px 14px", background: `${T.bg}99`, borderTop: i === 0 ? `1px solid ${T.rain}33` : "none", borderBottom: `1px solid ${T.rain}33`, fontSize: 14 }}>
              <span style={{ color: T.rain }}>[{String(i).padStart(2, "0")}]</span>
              <span style={{ lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: T.muted, margin: "0 0 32px", textAlign: "center", padding: "10px", borderTop: `1px dashed ${T.rain}55`, borderBottom: `1px dashed ${T.rain}55` }}>~ {BIO.closer} ~</p>

        <div style={{ background: `${T.bg}ee`, border: `1px solid ${T.rain}`, padding: "22px 22px", boxShadow: `0 0 32px ${T.rain}33, inset 0 0 24px ${T.rain}11`, position: "relative" }}>
          <div style={{ position: "absolute", top: -1, left: 16, background: T.bg, padding: "0 10px", color: T.rain, fontSize: 11, letterSpacing: 2, transform: "translateY(-50%)" }}>// TRANSMISSION</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, marginTop: 4 }}>
            <div style={{ fontSize: 11, color: T.rain, letterSpacing: 2 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, background: T.rain, borderRadius: "50%", marginRight: 8, boxShadow: `0 0 8px ${T.rain}`, animation: "matrixPulse 1.4s ease-in-out infinite" }}></span>
              {BIO.workshop.kicker}
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>{BIO.workshop.date.toUpperCase()}</div>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", color: T.head, textShadow: `0 0 12px ${T.rain}66`, letterSpacing: -0.5, textTransform: "uppercase" }}>{BIO.workshop.title}</h2>
          <p style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 16px", color: T.fg }}>{BIO.workshop.body}</p>
          <div style={{ display: "inline-block", padding: "9px 14px", background: T.rain, color: T.bg, fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>JACK_IN →</div>
        </div>
      </div>
      <style>{`
        @keyframes matrixBlink { 50% { opacity: 0; } }
        @keyframes matrixPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

// ---------- variation 8: Aurora Rain (Aurora chrome + Matrix rain) ----------
const AURORA_PALETTES = {
  violet:  { name: "Violet",   bg: "#0a0e1f", accent: "#a78bfa", accent2: "#22d3ee", head: "#e8defd", muted: "#8b8db0" },
  emerald: { name: "Emerald",  bg: "#06140f", accent: "#34d399", accent2: "#22d3ee", head: "#d8fbe9", muted: "#7fa294" },
  magenta: { name: "Magenta",  bg: "#10081a", accent: "#f472b6", accent2: "#a78bfa", head: "#fbe4f1", muted: "#a08bb0" },
  sunset:  { name: "Sunset",   bg: "#180a08", accent: "#fb923c", accent2: "#f472b6", head: "#ffe1cc", muted: "#b08a7a" },
  ocean:   { name: "Ocean",    bg: "#040d1a", accent: "#22d3ee", accent2: "#60a5fa", head: "#d4f1ff", muted: "#7d99b3" },
  mono:    { name: "Mono",     bg: "#0a0a0d", accent: "#cbd5e1", accent2: "#94a3b8", head: "#ffffff", muted: "#7d8390" },
};
const DENSITY_LEVELS = [
  { name: "Sparse",  d: 0.55 },
  { name: "Medium",  d: 1.0 },
  { name: "Dense",   d: 1.6 },
  { name: "Storm",   d: 2.4 },
];
function AuroraRain() {
  const [paletteKey, setPaletteKey] = useState("violet");
  const [densityIdx, setDensityIdx] = useState(1);
  const P = AURORA_PALETTES[paletteKey];
  const T = {
    bg: P.bg,
    fg: "#f1f0ff",
    muted: P.muted,
    accent: P.accent,
    accent2: P.accent2,
    rule: "#1f254a",
    sans: "'Space Grotesk', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  };
  const rainPalette = { bg: T.bg, rain: T.accent, head: P.head };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.sans, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      {/* rain layer */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.95 }}>
        <MatrixRain palette={rainPalette} width={720} height={1340} density={DENSITY_LEVELS[densityIdx].d} />
      </div>
      {/* aurora glows on top of rain */}
      <div style={{ position: "absolute", top: -160, left: -120, width: 420, height: 420, background: `radial-gradient(circle, ${T.accent}40, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none", mixBlendMode: "screen" }}></div>
      <div style={{ position: "absolute", top: 200, right: -160, width: 360, height: 360, background: `radial-gradient(circle, ${T.accent2}30, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none", mixBlendMode: "screen" }}></div>
      {/* lighter vignette — only darkens the very center where copy lives */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 40% at 50% 42%, ${T.bg}d9 0%, ${T.bg}99 55%, transparent 100%)`, pointerEvents: "none" }}></div>

      <div style={{ position: "relative", padding: "30px 40px 60px", pointerEvents: "none" }}>
        {/* control panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28, pointerEvents: "auto" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.accent}33`, borderRadius: 12, padding: "10px 12px", backdropFilter: "blur(8px)" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.muted, marginBottom: 8 }}>PALETTE</div>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(AURORA_PALETTES).map(([key, p]) => (
                <button key={key} onClick={() => setPaletteKey(key)} title={p.name} style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`, border: paletteKey === key ? `2px solid ${T.fg}` : `1px solid rgba(255,255,255,0.1)`, boxShadow: paletteKey === key ? `0 0 10px ${p.accent}aa` : "none", cursor: "pointer", padding: 0 }} />
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.accent}33`, borderRadius: 12, padding: "10px 12px", backdropFilter: "blur(8px)" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.muted, marginBottom: 8 }}>DENSITY</div>
            <div style={{ display: "flex", gap: 4 }}>
              {DENSITY_LEVELS.map((lvl, i) => (
                <button key={lvl.name} onClick={() => setDensityIdx(i)} style={{ flex: 1, padding: "4px 0", background: i === densityIdx ? T.accent : "transparent", color: i === densityIdx ? T.bg : T.muted, border: `1px solid ${i === densityIdx ? T.accent : T.accent + "33"}`, borderRadius: 6, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: 1, fontWeight: 600 }}>{lvl.name}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, fontFamily: T.mono, fontSize: 13, marginBottom: 40, color: T.muted, pointerEvents: "auto" }}>
          {BIO.nav.map((n, i) => <span key={i} style={{ color: i === 0 ? T.fg : T.muted }}>{n}</span>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 56 }}>
          <div style={{ width: 130, height: 130, borderRadius: "50%", background: `conic-gradient(from 220deg, ${T.accent}, ${T.accent2}, ${T.accent})`, padding: 2, display: "grid", placeItems: "center", boxShadow: `0 0 60px ${T.accent}55` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: T.bg, display: "grid", placeItems: "center", fontFamily: T.mono, fontSize: 26, fontWeight: 500, letterSpacing: 1 }}>
              {BIO.initials}
            </div>
          </div>
          <div style={{ marginTop: 20, fontFamily: T.mono, fontSize: 14, color: T.muted, letterSpacing: 1 }}>{BIO.domain}</div>
        </div>
        <h1 style={{ fontSize: 60, lineHeight: 1, fontWeight: 500, letterSpacing: -2, margin: "0 0 28px", textAlign: "center" }}>
          Michael<br/>
          <span style={{ background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 500 }}>Rollins</span>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.45, color: T.fg, margin: "0 0 40px", textAlign: "center" }}>{BIO.tagline}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {BIO.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(10,14,31,0.78)", border: `1px solid ${T.rule}`, borderRadius: 12, backdropFilter: "blur(12px)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, boxShadow: `0 0 10px ${T.accent}`, flexShrink: 0 }}></span>
              <span style={{ fontSize: 16 }}>{b}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 17, color: T.muted, margin: "0 0 40px", textAlign: "center" }}>{BIO.closer}</p>
        <div style={{ borderRadius: 18, padding: 1, background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, pointerEvents: "auto" }}>
          <div style={{ background: "rgba(10,14,31,0.92)", borderRadius: 17, padding: "26px 26px", backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 2, color: T.accent2 }}>◆ {BIO.workshop.kicker}</div>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>{BIO.workshop.date}</div>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 12px", letterSpacing: -0.5 }}>{BIO.workshop.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: T.muted, margin: "0 0 18px" }}>{BIO.workshop.body}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, borderRadius: 999, color: T.bg, fontFamily: T.mono, fontSize: 13, fontWeight: 500 }}>
              Reserve · May 14 →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- variation 9: Asteroids ----------
const ASTEROIDS_PALETTES = {
  phosphor: { name: "Phosphor", bg: "#000000", line: "#00ff66", ship: "#9affc7", bullet: "#ffffff", accent: "#00ff66", muted: "#3f8a5a", fg: "#dcffe6" },
  amber:    { name: "Amber",    bg: "#0a0500", line: "#ffaa00", ship: "#ffe5a8", bullet: "#ffffff", accent: "#ffaa00", muted: "#9a7a3a", fg: "#ffe5b8" },
  ice:      { name: "Ice",      bg: "#000812", line: "#22d3ee", ship: "#dcf7ff", bullet: "#ffffff", accent: "#22d3ee", muted: "#5fa3b8", fg: "#cdeaff" },
  blood:    { name: "Blood",    bg: "#0a0204", line: "#ff2855", ship: "#ffd4d9", bullet: "#ffffff", accent: "#ff2855", muted: "#a64d5a", fg: "#ffcad0" },
  violet:   { name: "Violet",   bg: "#08000f", line: "#b388ff", ship: "#e8d8ff", bullet: "#ffffff", accent: "#b388ff", muted: "#7a6aa0", fg: "#dccbff" },
  bone:     { name: "Bone",     bg: "#080808", line: "#e8e8e8", ship: "#ffffff", bullet: "#ffffff", accent: "#ffffff", muted: "#7c7c7c", fg: "#e0e0e0" },
};
const ASTEROID_COUNTS = [
  { name: "Calm",   c: 3 },
  { name: "Field",  c: 6 },
  { name: "Belt",   c: 10 },
  { name: "Swarm",  c: 16 },
];

function AsteroidsGame({ width, height, palette, count }) {
  const ref = useRef(null);
  const scoreRef = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const ship = { x: width / 2, y: height / 2, angle: 0, drift: Math.random() * 1000, cooldown: 0 };
    let score = 0;
    const pointer = { x: -9999, y: -9999, active: false, lastSeen: 0 };
    const host = canvas.parentElement;
    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = rect.width === 0 ? 1 : width / rect.width;
      const sy = rect.height === 0 ? 1 : height / rect.height;
      const t = e.touches && e.touches[0] ? e.touches[0] : e;
      if (t.clientX === undefined) return;
      pointer.x = (t.clientX - rect.left) * sx;
      pointer.y = (t.clientY - rect.top) * sy;
      pointer.active = true;
      pointer.lastSeen = performance.now();
    }
    function onLeave() { pointer.active = false; }
    host && host.addEventListener("mousemove", onMove);
    host && host.addEventListener("mouseleave", onLeave);
    host && host.addEventListener("touchstart", onMove, { passive: true });
    host && host.addEventListener("touchmove", onMove, { passive: true });
    host && host.addEventListener("touchend", onLeave);

    function makeAsteroid(size = 3, x, y) {
      const px = x !== undefined ? x : (Math.random() < 0.5 ? -20 : width + 20);
      const py = y !== undefined ? y : Math.random() * height;
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

    let raf, prev = performance.now(), lastShot = 0, lastWobble = 0;

    function step(now) {
      const dt = Math.min(50, now - prev); prev = now;
      const f = dt / 16;

      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // AI: aim at nearest asteroid (with wrap)
      let near = null, nDist = Infinity;
      for (const a of asteroids) {
        let dx = a.x - ship.x, dy = a.y - ship.y;
        if (dx > width / 2) dx -= width; else if (dx < -width / 2) dx += width;
        if (dy > height / 2) dy -= height; else if (dy < -height / 2) dy += height;
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

      // ship motion: follow cursor when active, otherwise figure-8 wander
      let targetX, targetY;
      if (pointer.active && now - pointer.lastSeen < 2500) {
        targetX = pointer.x;
        targetY = pointer.y;
      } else {
        pointer.active = false;
        ship.drift += dt * 0.0014;
        targetX = width / 2 + Math.cos(ship.drift) * width * 0.38;
        targetY = height / 2 + Math.sin(ship.drift * 1.3) * height * 0.34;
      }
      const lerpAmt = Math.min(1, 0.05 * f);
      ship.x += (targetX - ship.x) * lerpAmt;
      ship.y += (targetY - ship.y) * lerpAmt;
      ship.x = Math.max(0, Math.min(width, ship.x));
      ship.y = Math.max(0, Math.min(height, ship.y));

      // asteroids
      for (const a of asteroids) {
        a.x = (a.x + a.vx * f + width) % width;
        a.y = (a.y + a.vy * f + height) % height;
        a.rot += a.rotSpeed * f;
      }

      // bullets + collisions
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * f; b.y += b.vy * f; b.life -= f;
        if (b.life <= 0 || b.x < 0 || b.x > width || b.y < 0 || b.y > height) { bullets.splice(i, 1); continue; }
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const a = asteroids[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          if (dx * dx + dy * dy < a.radius * a.radius) {
            asteroids.splice(j, 1);
            score += (4 - a.size) * 25;
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
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = palette.line;
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

      // draw bullets
      ctx.fillStyle = palette.bullet;
      ctx.shadowColor = palette.bullet;
      ctx.shadowBlur = 10;
      for (const b of bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // draw ship (classic triangle)
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = palette.ship;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = palette.ship;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-9, -7);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-9, 7);
      ctx.closePath();
      ctx.stroke();
      // thrust
      if ((now / 80 | 0) % 2) {
        ctx.beginPath();
        ctx.moveTo(-5, -3);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-5, 3);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      if (scoreRef.current) scoreRef.current.textContent = String(score).padStart(6, "0");
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      host && host.removeEventListener("mousemove", onMove);
      host && host.removeEventListener("mouseleave", onLeave);
      host && host.removeEventListener("touchstart", onMove);
      host && host.removeEventListener("touchmove", onMove);
      host && host.removeEventListener("touchend", onLeave);
    };
  }, [width, height, palette, count]);
  return (
    <>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: 14, left: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 2, color: palette.muted, pointerEvents: "none" }}>
        SCORE <span ref={scoreRef} style={{ color: palette.accent }}>000000</span>
      </div>
    </>
  );
}

function Asteroids() {
  const [paletteKey, setPaletteKey] = useState("phosphor");
  const [countIdx, setCountIdx] = useState(1);
  const P = ASTEROIDS_PALETTES[paletteKey];
  const T = {
    bg: P.bg, fg: P.fg, muted: P.muted, accent: P.accent,
    sans: "'Space Grotesk', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    rule: P.muted + "55",
  };
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.sans, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      <AsteroidsGame width={720} height={1340} palette={P} count={ASTEROID_COUNTS[countIdx].c} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 42% at 50% 46%, ${T.bg}e6 0%, ${T.bg}b0 60%, transparent 100%)`, pointerEvents: "none" }}></div>

      <div style={{ position: "relative", padding: "30px 40px 60px", pointerEvents: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28, marginLeft: 90, pointerEvents: "auto" }}>
          <div style={{ background: "rgba(0,0,0,0.55)", border: `1px solid ${T.accent}55`, borderRadius: 10, padding: "10px 12px", backdropFilter: "blur(6px)" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.muted, marginBottom: 8 }}>PALETTE</div>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(ASTEROIDS_PALETTES).map(([key, p]) => (
                <button key={key} onClick={() => setPaletteKey(key)} title={p.name} style={{ width: 22, height: 22, borderRadius: "50%", background: p.line, border: paletteKey === key ? `2px solid ${T.fg}` : `1px solid ${p.line}55`, boxShadow: paletteKey === key ? `0 0 10px ${p.line}` : "none", cursor: "pointer", padding: 0 }} />
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.55)", border: `1px solid ${T.accent}55`, borderRadius: 10, padding: "10px 12px", backdropFilter: "blur(6px)" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.muted, marginBottom: 8 }}>FIELD</div>
            <div style={{ display: "flex", gap: 4 }}>
              {ASTEROID_COUNTS.map((lvl, i) => (
                <button key={lvl.name} onClick={() => setCountIdx(i)} style={{ flex: 1, padding: "4px 0", background: i === countIdx ? T.accent : "transparent", color: i === countIdx ? T.bg : T.muted, border: `1px solid ${i === countIdx ? T.accent : T.accent + "55"}`, borderRadius: 5, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: 1, fontWeight: 600 }}>{lvl.name}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 32, fontFamily: T.mono, fontSize: 13, marginBottom: 40, color: T.muted, pointerEvents: "auto" }}>
          {BIO.nav.map((n, i) => <span key={i} style={{ color: i === 0 ? T.fg : T.muted }}>{n}</span>)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 56 }}>
          <div style={{ width: 110, height: 110, border: `1.5px solid ${T.accent}`, transform: "rotate(45deg)", display: "grid", placeItems: "center", boxShadow: `0 0 24px ${T.accent}55, inset 0 0 24px ${T.accent}22`, background: T.bg + "cc" }}>
            <span style={{ transform: "rotate(-45deg)", fontFamily: T.mono, fontSize: 22, fontWeight: 600, color: T.fg, letterSpacing: 2, textShadow: `0 0 8px ${T.accent}` }}>{BIO.initials}</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: T.mono, fontSize: 13, color: T.muted, letterSpacing: 2 }}>△ {BIO.domain}</div>
        </div>

        <h1 style={{ fontSize: 56, lineHeight: 1, fontWeight: 600, letterSpacing: -1.5, margin: "0 0 24px", textAlign: "center", color: T.fg, textShadow: `0 0 18px ${T.accent}55` }}>Michael Rollins</h1>
        <p style={{ fontSize: 19, lineHeight: 1.45, color: T.fg, margin: "0 0 36px", textAlign: "center", padding: "0 8px" }}>{BIO.tagline}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {BIO.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "rgba(0,0,0,0.7)", border: `1px solid ${T.rule}`, borderRadius: 6, backdropFilter: "blur(6px)" }}>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, letterSpacing: 1 }}>+{(i + 1) * 25}</span>
              <span style={{ fontSize: 16 }}>{b}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, color: T.muted, margin: "0 0 36px", textAlign: "center" }}>{BIO.closer}</p>

        <div style={{ border: `1px solid ${T.accent}`, padding: "24px 24px", background: "rgba(0,0,0,0.78)", boxShadow: `0 0 24px ${T.accent}33`, position: "relative", backdropFilter: "blur(6px)", pointerEvents: "auto" }}>
          <div style={{ position: "absolute", top: -1, left: 16, background: T.bg, padding: "0 10px", color: T.accent, fontFamily: T.mono, fontSize: 10, letterSpacing: 2.5, transform: "translateY(-50%)" }}>◆ NEXT WAVE</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 4 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, letterSpacing: 2 }}>{BIO.workshop.kicker}</div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: 1 }}>{BIO.workshop.date.toUpperCase()}</div>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 12px", color: T.fg, letterSpacing: -0.5, textShadow: `0 0 12px ${T.accent}55` }}>{BIO.workshop.title}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 16px", color: T.fg }}>{BIO.workshop.body}</p>
          <div style={{ display: "inline-block", padding: "9px 14px", background: T.accent, color: T.bg, fontFamily: T.mono, fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>INSERT COIN →</div>
        </div>
      </div>
    </div>
  );
}

// ---------- variation X: Aurora Live (combined backdrop + bottom dock) ----------
const LIVE_PALETTES = {
  violet:  { name: "Violet",  bg: "#0a0e1f", accent: "#a78bfa", accent2: "#22d3ee", head: "#e8defd", muted: "#8b8db0" },
  emerald: { name: "Emerald", bg: "#06140f", accent: "#34d399", accent2: "#22d3ee", head: "#d8fbe9", muted: "#7fa294" },
  magenta: { name: "Magenta", bg: "#10081a", accent: "#f472b6", accent2: "#a78bfa", head: "#fbe4f1", muted: "#a08bb0" },
  sunset:  { name: "Sunset",  bg: "#180a08", accent: "#fb923c", accent2: "#f472b6", head: "#ffe1cc", muted: "#b08a7a" },
  ocean:   { name: "Ocean",   bg: "#040d1a", accent: "#22d3ee", accent2: "#60a5fa", head: "#d4f1ff", muted: "#7d99b3" },
  mono:    { name: "Mono",    bg: "#0a0a0d", accent: "#cbd5e1", accent2: "#94a3b8", head: "#ffffff", muted: "#7d8390" },
};
const LIVE_INTENSITY = [
  { name: "Calm",  rainD: 0.55, ast: 3 },
  { name: "Med",   rainD: 1.0,  ast: 6 },
  { name: "Dense", rainD: 1.6,  ast: 10 },
  { name: "Storm", rainD: 2.4,  ast: 16 },
];
function AuroraLive() {
  const [paletteKey, setPaletteKey] = useState("violet");
  const [intensityIdx, setIntensityIdx] = useState(1);
  const [backdrop, setBackdrop] = useState("rain");
  const P = LIVE_PALETTES[paletteKey];
  const T = { bg: P.bg, fg: "#f1f0ff", muted: P.muted, accent: P.accent, accent2: P.accent2, rule: "#1f254a", sans: "'Space Grotesk', system-ui, sans-serif", mono: "'Geist Mono', ui-monospace, monospace" };
  const rainPalette = { bg: T.bg, rain: T.accent, head: P.head };
  const astPalette  = { bg: T.bg, line: T.accent, ship: P.head, bullet: "#ffffff", accent: T.accent, muted: T.muted, fg: T.fg };
  const intensity = LIVE_INTENSITY[intensityIdx];
  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: T.sans, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      {/* backdrop */}
      <div style={{ position: "absolute", inset: 0 }}>
        {backdrop === "rain"
          ? <MatrixRain key={`rain-${paletteKey}`} palette={rainPalette} width={720} height={1340} density={intensity.rainD} />
          : <AsteroidsGame key={`ast-${paletteKey}-${intensity.ast}`} palette={astPalette} width={720} height={1340} count={intensity.ast} />}
      </div>
      {/* aurora glows */}
      <div style={{ position: "absolute", top: -160, left: -120, width: 420, height: 420, background: `radial-gradient(circle, ${T.accent}40, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none", mixBlendMode: "screen" }}></div>
      <div style={{ position: "absolute", top: 200, right: -160, width: 360, height: 360, background: `radial-gradient(circle, ${T.accent2}30, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none", mixBlendMode: "screen" }}></div>
      {/* center vignette */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 40% at 50% 42%, ${T.bg}d9 0%, ${T.bg}99 55%, transparent 100%)`, pointerEvents: "none" }}></div>

      <div style={{ position: "relative", padding: "52px 40px 180px", pointerEvents: "none" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, fontFamily: T.mono, fontSize: 13, marginBottom: 40, color: T.muted, pointerEvents: "auto" }}>
          {BIO.nav.map((n, i) => <span key={i} style={{ color: i === 0 ? T.fg : T.muted }}>{n}</span>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 56 }}>
          <div style={{ width: 130, height: 130, borderRadius: "50%", background: `conic-gradient(from 220deg, ${T.accent}, ${T.accent2}, ${T.accent})`, padding: 2, display: "grid", placeItems: "center", boxShadow: `0 0 60px ${T.accent}55` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: T.bg, display: "grid", placeItems: "center", fontFamily: T.mono, fontSize: 26, fontWeight: 500, letterSpacing: 1 }}>{BIO.initials}</div>
          </div>
          <div style={{ marginTop: 20, fontFamily: T.mono, fontSize: 14, color: T.muted, letterSpacing: 1 }}>{BIO.domain}</div>
        </div>
        <h1 style={{ fontSize: 60, lineHeight: 1, fontWeight: 500, letterSpacing: -2, margin: "0 0 28px", textAlign: "center" }}>
          Michael<br/>
          <span style={{ background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 500 }}>Rollins</span>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.45, color: T.fg, margin: "0 0 40px", textAlign: "center" }}>{BIO.tagline}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {BIO.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(10,14,31,0.78)", border: `1px solid ${T.rule}`, borderRadius: 12, backdropFilter: "blur(12px)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, boxShadow: `0 0 10px ${T.accent}`, flexShrink: 0 }}></span>
              <span style={{ fontSize: 16 }}>{b}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 17, color: T.muted, margin: "0 0 40px", textAlign: "center" }}>{BIO.closer}</p>
        <div style={{ borderRadius: 18, padding: 1, background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, pointerEvents: "auto" }}>
          <div style={{ background: "rgba(10,14,31,0.92)", borderRadius: 17, padding: "26px 26px", backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 2, color: T.accent2 }}>◆ {BIO.workshop.kicker}</div>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>{BIO.workshop.date}</div>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 12px", letterSpacing: -0.5 }}>{BIO.workshop.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: T.muted, margin: "0 0 18px" }}>{BIO.workshop.body}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, borderRadius: 999, color: T.bg, fontFamily: T.mono, fontSize: 13, fontWeight: 500 }}>Reserve · May 14 →</div>
          </div>
        </div>
      </div>

      {/* DOCKED CONTROLS — anchored to bottom of artboard */}
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, padding: "12px 14px", background: `${T.bg}d9`, border: `1px solid ${T.accent}55`, borderRadius: 14, backdropFilter: "blur(14px)", pointerEvents: "auto", zIndex: 10, boxShadow: `0 -4px 30px ${T.bg}cc, 0 0 24px ${T.accent}22` }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 2, color: T.muted, marginBottom: 6 }}>BACKDROP</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[{k:"rain",label:"Rain"},{k:"asteroids",label:"Asteroids"}].map(({k,label}) => (
              <button key={k} onClick={() => setBackdrop(k)} style={{ padding: "6px 12px", background: backdrop === k ? T.accent : "transparent", color: backdrop === k ? T.bg : T.muted, border: `1px solid ${backdrop === k ? T.accent : T.accent + "55"}`, borderRadius: 6, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: 1, fontWeight: 600 }}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 2, color: T.muted, marginBottom: 6, textAlign: "center" }}>PALETTE</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", paddingTop: 2 }}>
            {Object.entries(LIVE_PALETTES).map(([key, p]) => (
              <button key={key} onClick={() => setPaletteKey(key)} title={p.name} style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})`, border: paletteKey === key ? `2px solid ${T.fg}` : `1px solid rgba(255,255,255,0.1)`, boxShadow: paletteKey === key ? `0 0 10px ${p.accent}aa` : "none", cursor: "pointer", padding: 0 }} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 2, color: T.muted, marginBottom: 6, textAlign: "right" }}>INTENSITY</div>
          <div style={{ display: "flex", gap: 4 }}>
            {LIVE_INTENSITY.map((lvl, i) => (
              <button key={lvl.name} onClick={() => setIntensityIdx(i)} style={{ padding: "6px 9px", background: i === intensityIdx ? T.accent : "transparent", color: i === intensityIdx ? T.bg : T.muted, border: `1px solid ${i === intensityIdx ? T.accent : T.accent + "55"}`, borderRadius: 5, cursor: "pointer", fontFamily: T.mono, fontSize: 10, letterSpacing: 0.5, fontWeight: 600 }}>{lvl.name}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- shared nav ----------
function Nav({ T, sep = "·" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 18, fontFamily: T.mono, fontSize: 14, color: T.muted, letterSpacing: 0.5 }}>
      {BIO.nav.map((n, i) => (
        <React.Fragment key={i}>
          <span style={{ color: i === 0 ? T.fg : T.muted }}>{n}</span>
          {i < BIO.nav.length - 1 && <span style={{ color: T.dim }}>{sep}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------- mount ----------
const ARTBOARD_W = 720;
const ARTBOARD_H = 1340;

const variations = [
  { id: "midnight-amber", label: "Midnight Amber · Inter + JetBrains Mono", Comp: MidnightAmber },
  { id: "paper-editorial", label: "Paper Editorial · Newsreader + Plex Mono", Comp: PaperEditorial },
  { id: "lab-mono", label: "Lab Mono · JetBrains Mono", Comp: LabMono },
  { id: "aurora", label: "Aurora · Space Grotesk + Geist Mono", Comp: Aurora },
  { id: "sandstone", label: "Sandstone · Instrument Serif + Geist Mono", Comp: Sandstone },
  { id: "frost", label: "Frost · Manrope + JetBrains Mono", Comp: Frost },
  { id: "matrix", label: "Matrix · falling rain · tap a swatch to recolor", Comp: Matrix },
  { id: "aurora-rain", label: "Aurora Rain · polished chrome · living backdrop", Comp: AuroraRain },
  { id: "asteroids", label: "Asteroids · vector arcade backdrop · self-playing", Comp: Asteroids },
  { id: "aurora-live", label: "Aurora Live · toggle Rain or Asteroids · docked controls", Comp: AuroraLive },
];

function App() {
  return (
    <DesignCanvas title="rollins.io — variations" subtitle="6 directions across color, mood and type. Click any artboard to focus.">
      <DCSection id="moods" title="Mood explorations">
        {variations.map(({ id, label, Comp }) => (
          <DCArtboard key={id} id={id} label={label} width={ARTBOARD_W} height={ARTBOARD_H}>
            <Comp />
          </DCArtboard>
        ))}
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
