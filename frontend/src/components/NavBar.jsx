import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

export default function NavBar({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 56,
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        background: "rgba(8, 8, 8, 0.85)",
      }}
    >
      <div
        style={{
          width: "min(100%, 1120px)",
          height: "100%",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="logo-mark" />
          <span style={{ fontFamily: "Poppins", fontSize: 22, fontWeight: 700 }}>VoiceCA</span>
        </div>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Open profile menu"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            {initial}
          </button>
          {open && (
            <div
              className="card"
              style={{
                position: "absolute",
                right: 0,
                top: 42,
                width: 168,
                padding: 8,
                display: "grid",
                gap: 4,
              }}
            >
              <div style={{ color: "var(--text-secondary)", fontSize: 13, padding: "8px 10px" }}>
                {user?.name || "Profile"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: 0,
                  borderRadius: "var(--radius-sm)",
                  padding: "10px",
                  textAlign: "left",
                  background: "transparent",
                  color: "var(--text-primary)",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
