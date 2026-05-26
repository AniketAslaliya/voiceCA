import { useState } from "react";
import OutputCard from "./components/OutputCard";
import VoiceInput from "./components/VoiceInput";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranscript = async (text) => {
    setTranscript(text);
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Intent extraction failed");
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "32px 18px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 390,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <header style={{ paddingTop: 18 }}>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.05 }}>🎙️ VoiceCA</h1>
          <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 18, lineHeight: 1.35 }}>
            Boliye, baaki hum sambhal lenge
          </p>
        </header>

        <VoiceInput onTranscript={handleTranscript} onError={setError} />

        {loading && (
          <div style={{ color: "#16a34a", fontSize: 14, fontWeight: 700 }}>
            Samajh rahe hain...
          </div>
        )}

        {transcript && (
          <p style={{ margin: 0, color: "#64748b", fontSize: 15, lineHeight: 1.5 }}>
            "{transcript}"
          </p>
        )}

        {error && (
          <div
            style={{
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: 12,
              color: "#b91c1c",
              background: "#fef2f2",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {result && <OutputCard data={result} />}
      </section>
    </main>
  );
}
