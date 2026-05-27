import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("Aniket");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login(email, mode === "signup" ? name : email.split("@")[0]);
    navigate("/app");
  };

  return (
    <main className="app-shell">
      <section
        className="page page-narrow"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <form
          className="card fade-up"
          onSubmit={handleSubmit}
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

          <div style={{ display: "grid", gap: 12 }}>
            {mode === "signup" && (
              <label>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
            )}
            <label>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
          </div>

          <button className="btn-primary" type="submit" style={{ width: "100%" }}>
            Continue →
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
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
      </section>
    </main>
  );
}
