import { Link } from "react-router-dom";

const highlights = [
  { value: "15 sec", label: "speech to structured JSON" },
  { value: "3 intents", label: "credit, claims, expenses" },
  { value: "11+ languages", label: "Indian languages supported" },
];

const languages = [
  "Hindi",
  "Hinglish",
  "English",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
];

const features = [
  { icon: "💰", title: "Udhaari", body: "Speak credit entries in Hindi or Hinglish." },
  { icon: "📋", title: "Claims", body: "Log insurance claims without filling a form." },
  { icon: "📄", title: "Documents", body: "Understand notices in plain language." },
];

const steps = [
  {
    title: "Speak naturally",
    body: "Say the amount, person name, and date the way you normally would.",
  },
  {
    title: "VoiceCA structures it",
    body: "The app transcribes your speech and extracts a clean business intent.",
  },
  {
    title: "Save or act immediately",
    body: "Use the JSON output for entries, follow-ups, or document handling.",
  },
];

const sampleEntities = {
  person: "Ravi",
  amount: 2500,
  date: "2026-05-28",
  item: "grocery udhaari",
};

const sampleOutput = {
  type: "credit_entry",
  confirmation_hindi: "Ravi ka ₹2500 udhaari add ho gaya.",
  confirmation_english: "Credit entry captured and ready to save.",
  action_required: "Review once, then save it to the ledger.",
};

export default function Landing() {
  return (
    <main className="app-shell landing-shell">
      <section className="page landing-page">
        <header className="landing-topbar fade-up">
          <Link className="brand-lockup" to="/">
            <span className="logo-mark" />
            <span>VoiceCA</span>
          </Link>
          <span className="landing-tag">Now multilingual across Indian languages</span>
        </header>

        <div className="landing-layout">
          <div className="landing-copy fade-up">
            <p className="section-kicker">Voice-first business memory for India</p>
            <h1 className="landing-title">
              Boliye.
              <br />
              Baaki bookkeeping
              <br />
              hum kar denge.
            </h1>
            <p className="landing-subtitle">
              Speak a credit entry, insurance claim, or expense in the language your team already
              uses. VoiceCA turns it into structured JSON your workflow can use immediately.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {languages.map((language) => (
                <span className="landing-tag" key={language}>
                  {language}
                </span>
              ))}
            </div>

            <div className="landing-actions">
              <Link className="btn-primary" to="/auth">
                Start free
              </Link>
              <a className="btn-ghost" href="#how-it-works">
                See how it works
              </a>
            </div>

            <div className="metric-grid">
              {highlights.map((item) => (
                <article className="metric-card card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="landing-preview fade-up" aria-label="VoiceCA sample output">
            <div className="preview-orb preview-orb-one" aria-hidden="true" />
            <div className="preview-orb preview-orb-two" aria-hidden="true" />

            <div className="preview-panel card">
              <div className="preview-panel-head">
                <span className="preview-label">Speech in</span>
                <span className="preview-chip">Live example</span>
              </div>
              <p className="preview-quote">
                “Ravi ko aaj 2500 rupaye ka grocery udhaari likh do.”
              </p>

              <div className="preview-divider" />

              <div className="preview-panel-head">
                <span className="preview-label">JSON out</span>
                <span className="preview-chip preview-chip-accent">credit_entry</span>
              </div>
              <pre className="preview-json">{JSON.stringify(sampleEntities, null, 2)}</pre>

              <div className="preview-response">
                <p>{sampleOutput.confirmation_hindi}</p>
                <span>{sampleOutput.action_required}</span>
              </div>
            </div>
          </aside>
        </div>

        <section className="landing-section fade-up" id="how-it-works">
          <div className="section-heading">
            <p className="section-kicker">How it works</p>
            <h2>One voice note, one clean record.</h2>
          </div>
          <div className="step-grid">
            {steps.map((step, index) => (
              <article className="step-card card" key={step.title}>
                <span className="step-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section fade-up">
          <div className="section-heading">
            <p className="section-kicker">What it handles</p>
            <h2>Three common jobs, one simple interface.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta card fade-up">
          <div>
            <p className="section-kicker">Ready for the first users</p>
            <h2>Launch with a landing page that explains the product in one glance.</h2>
          </div>
          <Link className="btn-primary" to="/auth">
            Open VoiceCA
          </Link>
        </section>

        <footer className="landing-footer fade-up">
          Built by Aniket Aslaliya · LNMIIT · OpenAI x Outskill 2026
        </footer>
      </section>
    </main>
  );
}
