import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

const BUSINESS_TYPES = [
  { id: "retail", icon: "🛒", label: "Retail Shop" },
  { id: "manufacturing", icon: "🏭", label: "Manufacturing" },
  { id: "services", icon: "🔧", label: "Services" },
  { id: "b2b", icon: "💼", label: "B2B" },
  { id: "freelancer", icon: "👤", label: "Freelancer" },
  { id: "ecommerce", icon: "🏪", label: "E-commerce" },
];

const PAIN_POINTS = [
  { id: "profit", icon: "📊", label: "Don't know profit/loss" },
  { id: "tax", icon: "💰", label: "Tax nightmare" },
  { id: "paperwork", icon: "📋", label: "Too much paperwork" },
  { id: "credit", icon: "🤝", label: "Forget credit follow-ups" },
  { id: "accountant", icon: "🧾", label: "Accountant costs too much" },
  { id: "mobile", icon: "📱", label: "Need mobile solution" },
];

const LANGUAGES = [
  "Hindi", "Hinglish", "English", "Marathi", "Gujarati",
  "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi", "Odia"
];

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("credentials"); // credentials, business, pain, language, name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState(null);
  const [painPoints, setPainPoints] = useState([]);
  const [language, setLanguage] = useState("Hindi");
  const [businessName, setBusinessName] = useState("");
  const navigate = useNavigate();

  const handleSignupStart = (event) => {
    event.preventDefault();
    if (mode === "login") {
      login(email, email.split("@")[0]);
      navigate("/app");
    } else {
      setStep("business");
    }
  };

  const togglePainPoint = (id) => {
    setPainPoints((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleBusinessSelect = () => {
    if (businessType) setStep("pain");
  };

  const handlePainSelect = () => {
    if (painPoints.length > 0) setStep("language");
  };

  const handleLanguageSelect = () => {
    setStep("name");
  };

  const handleCompleteSignup = (event) => {
    event.preventDefault();
    if (businessName.trim()) {
      // Create account and save onboarding
      login(email, businessName);
      const onboarding = {
        businessType,
        painPoints,
        language,
        businessName,
      };
      localStorage.setItem("voiceca_onboarding", JSON.stringify(onboarding));
      localStorage.setItem("voiceca_hasOnboarded", "true");
      navigate("/app");
    }
  };

  return (
    <main className="app-shell">
      <section
        className="page page-narrow"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "20px",
        }}
      >
        {/* Credentials Step */}
        {(step === "credentials" || mode === "login") && (
          <form
            className="card fade-up"
            onSubmit={handleSignupStart}
            style={{
              width: "100%",
              maxWidth: 400,
              padding: 24,
              display: "grid",
              gap: 18,
            }}
          >
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="logo-mark" />
              <span style={{ fontFamily: "Poppins", fontSize: 24, fontWeight: 700 }}>VoiceCA</span>
            </Link>

            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>
                {mode === "signup" ? "Create your account" : "Sign in to your account"}
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <label>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>
            </div>

            <button className="btn-primary" type="submit" style={{ width: "100%" }}>
              {mode === "signup" ? "Next →" : "Sign in →"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setStep("credentials");
              }}
              style={{
                background: "transparent",
                border: 0,
                color: "var(--text-secondary)",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Create account"}
            </button>
          </form>
        )}

        {/* Business Type Step */}
        {step === "business" && (
          <div
            className="card fade-up"
            style={{
              width: "100%",
              maxWidth: 500,
              padding: 24,
              display: "grid",
              gap: 18,
            }}
          >
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="logo-mark" />
              <span style={{ fontFamily: "Poppins", fontSize: 24, fontWeight: 700 }}>VoiceCA</span>
            </Link>

            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Step 1 of 3
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>What's your business?</h2>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setBusinessType(type.id)}
                  style={{
                    border: `2px solid ${businessType === type.id ? "var(--accent)" : "var(--border)"}`,
                    background: businessType === type.id ? "rgba(74, 222, 128, 0.08)" : "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{type.icon}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{type.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setStep("credentials")}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleBusinessSelect}
                disabled={!businessType}
                style={{ flex: 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Pain Points Step */}
        {step === "pain" && (
          <div
            className="card fade-up"
            style={{
              width: "100%",
              maxWidth: 500,
              padding: 24,
              display: "grid",
              gap: 18,
            }}
          >
            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Step 2 of 3
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>What keeps you up at night?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>Pick up to 2</p>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {PAIN_POINTS.map((pain) => (
                <button
                  key={pain.id}
                  type="button"
                  onClick={() => togglePainPoint(pain.id)}
                  style={{
                    border: `2px solid ${painPoints.includes(pain.id) ? "var(--accent)" : "var(--border)"}`,
                    background: painPoints.includes(pain.id) ? "rgba(74, 222, 128, 0.08)" : "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{pain.icon}</span>
                  <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{pain.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setStep("business")}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handlePainSelect}
                disabled={painPoints.length === 0}
                style={{ flex: 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Language Step */}
        {step === "language" && (
          <div
            className="card fade-up"
            style={{
              width: "100%",
              maxWidth: 500,
              padding: 24,
              display: "grid",
              gap: 18,
            }}
          >
            <div>
              <p style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Step 3 of 3
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>Language & Business Name</h2>
            </div>

            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                LANGUAGE
              </p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
                BUSINESS NAME
              </p>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Sharma Textiles, Priya's Salon"
                required
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setStep("pain")}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleCompleteSignup}
                disabled={!businessName.trim()}
                style={{ flex: 1 }}
              >
                Launch VoiceCA →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
