import { Link } from "react-router-dom";

const features = [
  { icon: "💰", title: "Udhaari", body: "Speak credit entries in Hindi" },
  { icon: "📋", title: "Claims", body: "Log insurance claims by voice" },
  { icon: "📄", title: "Documents", body: "Understand any notice in plain language" },
];

export default function Landing() {
  return (
    <main className="app-shell">
      <section
        className="page landing-page"
      >
        <div className="fade-up landing-hero">
          <span className="logo-mark" />
          <div>
            <h1 className="landing-title">
              Boliye.
              <br />
              Baaki hum
              <br />
              sambhal lenge.
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 18, lineHeight: 1.45, marginTop: 24 }}>
              Voice-first AI for India's 63 million small businesses.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn-primary" to="/auth">
              Get Started →
            </Link>
            <a className="btn-ghost" href="https://reflections.outskill.com/openai" target="_blank">
              Watch Demo
            </a>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border)" }} />

        <div
          className="fade-up feature-grid"
        >
          {features.map((feature) => (
            <article
              className="card"
              key={feature.title}
              style={{
                padding: 18,
                borderLeft: "2px solid var(--accent)",
                minHeight: 132,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 26 }}>{feature.icon}</div>
              <div>
                <h2 style={{ fontSize: 28 }}>{feature.title}</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                  {feature.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        <footer className="fade-up" style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Built by Aniket Aslaliya · LNMIIT · OpenAI x Outskill 2026
        </footer>
      </section>
    </main>
  );
}
