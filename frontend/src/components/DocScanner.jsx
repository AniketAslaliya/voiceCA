import { useState } from "react";
import { scanDocument } from "../lib/api";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocScanner() {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const image = await fileToDataUrl(file);
      const data = await scanDocument(image);
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="card fade-up"
      style={{
        minHeight: 360,
        padding: 24,
        display: "grid",
        alignContent: "center",
        gap: 18,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48 }}>📄</div>
      <div>
        <h2 style={{ fontSize: 38, lineHeight: 1 }}>Document ya notice ki photo lo</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 10, lineHeight: 1.5 }}>
          Photo upload karo. VoiceCA plain Hindi mein samjhayega.
        </p>
      </div>
      <label className="btn-primary" style={{ justifySelf: "center" }}>
        {loading ? "Scanning..." : "Upload Photo"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleUpload}
          disabled={loading}
          style={{ display: "none" }}
        />
      </label>
      {fileName && !result && !error && (
        <article className="card fade-up" style={{ padding: 14, textAlign: "left" }}>
          <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
            {loading ? "Scanning document" : "Photo ready"}
          </div>
          <p style={{ color: "var(--text-primary)", marginTop: 6 }}>{fileName}</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
            {loading ? "Thoda sa ruk jaiye..." : "Scan result yahin aayega."}
          </p>
        </article>
      )}
      {error && (
        <article
          className="card fade-up"
          style={{
            padding: 14,
            textAlign: "left",
            borderColor: "rgba(239, 68, 68, 0.35)",
          }}
        >
          <div style={{ color: "var(--error)", fontWeight: 700, fontSize: 14 }}>
            Scan failed
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 6 }}>
            {error}
          </p>
        </article>
      )}
      {result && (
        <article className="card fade-up" style={{ padding: 16, textAlign: "left" }}>
          <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
            Document samajh liya
          </div>
          <p style={{ color: "var(--text-primary)", marginTop: 10, lineHeight: 1.45 }}>
            {result.explanation_hindi}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 10 }}>
            {result.action_required}
          </p>
        </article>
      )}
    </section>
  );
}
