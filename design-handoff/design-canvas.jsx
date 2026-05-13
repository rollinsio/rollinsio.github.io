/* global React */
// Minimal preview shim for the DesignCanvas wrappers referenced by
// variations.jsx. The real internal tool is a pannable/zoomable canvas;
// for the GitHub Pages preview we just stack the artboards vertically
// at their native pixel dimensions.

function DesignCanvas({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "#131313",
        color: "#e8e8e8",
        padding: "32px 24px 64px",
        fontFamily: "'Inter', system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <header style={{ maxWidth: 960, margin: "0 auto 36px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 8px", letterSpacing: -0.4 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: "#888", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}

function DCSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 48 }}>
      {title && (
        <h2
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1.4,
            color: "#777",
            margin: "0 auto 24px",
            maxWidth: 720,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function DCArtboard({ id, label, width, height, children }) {
  return (
    <figure id={id} style={{ margin: 0 }}>
      <figcaption
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 12,
          color: "#9a9a9a",
          marginBottom: 10,
          letterSpacing: 0.4,
          width,
          maxWidth: "100%",
        }}
      >
        {label}
      </figcaption>
      <div
        style={{
          width,
          height,
          maxWidth: "100%",
          overflow: "hidden",
          border: "1px solid #2a2a2a",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          position: "relative",
          background: "#000",
        }}
      >
        <div style={{ width, height, position: "relative" }}>{children}</div>
      </div>
    </figure>
  );
}
