import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BUSINESS_TYPES = [
  { id: "retail", icon: "🛒", label: "Retail Shop", desc: "Clothes, electronics, groceries" },
  { id: "manufacturing", icon: "🏭", label: "Manufacturing", desc: "Make or bulk goods" },
  { id: "services", icon: "🔧", label: "Services", desc: "Plumbing, consulting, coaching" },
  { id: "b2b", icon: "💼", label: "B2B", desc: "Sell to other businesses" },
  { id: "freelancer", icon: "👤", label: "Freelancer", desc: "Solo, projects, work-from-home" },
  { id: "ecommerce", icon: "🏪", label: "E-commerce", desc: "Online store, marketplace" },
];

const PAIN_POINTS = [
  { id: "profit", icon: "📊", label: "Don't know profit or loss" },
  { id: "tax", icon: "💰", label: "Tax season is a nightmare" },
  { id: "paperwork", icon: "📋", label: "Too much paperwork" },
  { id: "credit", icon: "🤝", label: "Forget credit follow-ups" },
  { id: "accountant", icon: "🧾", label: "Accountant charges too much" },
  { id: "mobile", icon: "📱", label: "Need mobile solution" },
];

const LANGUAGES = [
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

const FREQUENCY = [
  { id: "daily", label: "⚡ Daily", desc: "Log entries constantly" },
  { id: "weekly", label: "🕐 Weekly", desc: "Sunday review sessions" },
  { id: "monthly", label: "📅 Monthly", desc: "Accountant checkup" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0);
  const [formData, setFormData] = useState({
    businessType: null,
    painPoints: [],
    language: "Hindi",
    frequency: "weekly",
    businessName: "",
  });

  const handleNext = () => {
    if (screen < 4) {
      setScreen(screen + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (screen > 0) setScreen(screen - 1);
  };

  const completeOnboarding = () => {
    localStorage.setItem("voiceca_onboarding", JSON.stringify(formData));
    localStorage.setItem("voiceca_hasOnboarded", "true");
    navigate("/app");
  };

  const togglePainPoint = (id) => {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.includes(id)
        ? prev.painPoints.filter((p) => p !== id)
        : [...prev.painPoints, id],
    }));
  };

  return (
    <main className="app-shell" style={{ background: "var(--bg-primary)" }}>
      <section className="page page-narrow" style={{ minHeight: "100vh", display: "grid", gap: 24, placeItems: "center" }}>
        {/* Screen 0: Welcome */}
        {screen === 0 && (
          <article className="fade-up" style={{ textAlign: "center", display: "grid", gap: 20, paddingTop: 40 }}>
            <div style={{ fontSize: 48 }}>🎙️</div>
            <div style={{ display: "grid", gap: 8 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700 }}>Namaste!</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6 }}>
                Welcome to VoiceCA, your voice-first accounting assistant.
              </p>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Let's set you up in 60 seconds. We'll ask a few quick things so VoiceCA becomes YOUR accounting assistant.
            </p>
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: 20 }}>
              Let's Go
            </button>
          </article>
        )}

        {/* Screen 1: Business Type */}
        {screen === 1 && (
          <article className="fade-up" style={{ display: "grid", gap: 20, width: "100%" }}>
            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Step 1 of 4
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>What's your business?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Pick the closest match</p>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, businessType: type.id })}
                  style={{
                    border: `2px solid ${formData.businessType === type.id ? "var(--accent)" : "var(--border)"}`,
                    background:
                      formData.businessType === type.id
                        ? "rgba(74, 222, 128, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{type.icon}</span>
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{type.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={handleBack} style={{ flex: 1 }}>
                Back
              </button>
              <button className="btn-primary" onClick={handleNext} style={{ flex: 1 }} disabled={!formData.businessType}>
                Next
              </button>
            </div>
          </article>
        )}

        {/* Screen 2: Pain Points */}
        {screen === 2 && (
          <article className="fade-up" style={{ display: "grid", gap: 20, width: "100%" }}>
            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Step 2 of 4
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>What keeps you up at night?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Pick up to 2</p>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {PAIN_POINTS.map((pain) => (
                <button
                  key={pain.id}
                  onClick={() => togglePainPoint(pain.id)}
                  style={{
                    border: `2px solid ${
                      formData.painPoints.includes(pain.id) ? "var(--accent)" : "var(--border)"
                    }`,
                    background:
                      formData.painPoints.includes(pain.id)
                        ? "rgba(74, 222, 128, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{pain.icon}</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{pain.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={handleBack} style={{ flex: 1 }}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                style={{ flex: 1 }}
                disabled={formData.painPoints.length === 0}
              >
                Next
              </button>
            </div>
          </article>
        )}

        {/* Screen 3: Language & Frequency */}
        {screen === 3 && (
          <article className="fade-up" style={{ display: "grid", gap: 20, width: "100%" }}>
            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Step 3 of 4
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>Language & Habits</h2>
            </div>

            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                LANGUAGE
              </p>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                HOW OFTEN DO YOU LOG ENTRIES?
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {FREQUENCY.map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setFormData({ ...formData, frequency: freq.id })}
                    style={{
                      border: `2px solid ${
                        formData.frequency === freq.id ? "var(--accent)" : "var(--border)"
                      }`,
                      background:
                        formData.frequency === freq.id
                          ? "rgba(74, 222, 128, 0.08)"
                          : "rgba(255, 255, 255, 0.02)",
                      borderRadius: "var(--radius-md)",
                      padding: 14,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{freq.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                      {freq.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={handleBack} style={{ flex: 1 }}>
                Back
              </button>
              <button className="btn-primary" onClick={handleNext} style={{ flex: 1 }}>
                Next
              </button>
            </div>
          </article>
        )}

        {/* Screen 4: Business Name */}
        {screen === 4 && (
          <article className="fade-up" style={{ display: "grid", gap: 20, width: "100%" }}>
            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Final Step
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>What's your business name?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                We'll personalize everything with this
              </p>
            </div>

            <input
              type="text"
              placeholder="e.g., Sharma Textiles, Priya's Salon"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && formData.businessName && completeOnboarding()}
              style={{
                fontSize: 16,
                padding: "14px 16px",
              }}
            />

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={handleBack} style={{ flex: 1 }}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={completeOnboarding}
                style={{ flex: 1 }}
                disabled={!formData.businessName}
              >
                Start VoiceCA
              </button>
            </div>
          </article>
        )}

        {/* Progress Indicator */}
        {screen > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: 20,
              right: 20,
              height: 4,
              background: "var(--border)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                background: "var(--accent)",
                borderRadius: 2,
                width: `${(screen / 5) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}
