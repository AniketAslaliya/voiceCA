import { useEffect, useRef, useState } from "react";
import DocScanner from "../components/DocScanner";
import EntryList from "../components/EntryList";
import FinancialSummary from "../components/FinancialSummary";
import MicButton from "../components/MicButton";
import NavBar from "../components/NavBar";
import OutputCard from "../components/OutputCard";
import { getUser } from "../lib/auth";
import { interpret, transcribe } from "../lib/api";

const tabs = ["Speak", "Summary", "Entries", "Scan Doc"];

function todayLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function loadEntries() {
  const entries = localStorage.getItem("voiceca_entries");
  return entries ? JSON.parse(entries) : [];
}

function saveEntries(entries) {
  localStorage.setItem("voiceca_entries", JSON.stringify(entries));
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Speak");
  const [recordingState, setRecordingState] = useState("idle");
  const [transcriptText, setTranscriptText] = useState("");
  const [result, setResult] = useState(null);
  const [entries, setEntries] = useState(loadEntries);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const user = getUser();

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const startRecording = async () => {
    setError("");
    setResult(null);
    setSaved(false);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      setRecordingState("processing");
      try {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const { text } = await transcribe(audioBlob);
        setTranscriptText(text);
        const interpreted = await interpret(text);
        setResult(interpreted);
      } catch (error) {
        setError(error.message);
      } finally {
        stream.getTracks().forEach((track) => track.stop());
        setRecordingState("idle");
      }
    };

    recorder.start();
    setRecordingState("recording");
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
  };

  const handleMicClick = async () => {
    try {
      if (recordingState === "recording") {
        stopRecording();
      } else if (recordingState === "idle") {
        await startRecording();
      }
    } catch (error) {
      setError(error.message);
      setRecordingState("idle");
    }
  };

  const handleSave = () => {
    if (!result || saved) return;
    const entry = {
      ...result,
      id: crypto.randomUUID(),
      transcript: transcriptText,
      createdAt: todayLabel(),
    };
    setEntries((current) => [entry, ...current]);
    setSaved(true);
  };

  return (
    <main className="app-shell">
      <NavBar user={user} />
      <section className="page dashboard-page" style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 14,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                padding: "10px 8px",
                background: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "#050505" : "var(--text-secondary)",
                fontWeight: 700,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Speak" && (
          <section className="fade-up dashboard-speak">
            <div className="speak-stage">
              <p style={{ color: "var(--text-secondary)", fontSize: 18 }}>Kya hua aaj?</p>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
                <MicButton state={recordingState} onClick={handleMicClick} />
              </div>
              <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
                {recordingState === "recording"
                  ? "Bolte rahiye..."
                  : recordingState === "processing"
                    ? "Samajh rahe hain..."
                    : "Tap karo aur boliye"}
              </p>
            </div>

            <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
              {transcriptText && (
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  “{transcriptText}”
                </p>
              )}

              {error && (
                <div
                  style={{
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    background: "rgba(239, 68, 68, 0.08)",
                    color: "var(--error)",
                    borderRadius: "var(--radius-sm)",
                    padding: 12,
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              <OutputCard data={result} onSave={handleSave} saved={saved} />
            </div>
          </section>
        )}

        {activeTab === "Summary" && <FinancialSummary entries={entries} />}
        {activeTab === "Entries" && <EntryList entries={entries} />}
        {activeTab === "Scan Doc" && <DocScanner />}
      </section>
    </main>
  );
}
