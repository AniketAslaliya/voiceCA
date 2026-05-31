import { useEffect, useRef, useState } from "react";
import DocScanner from "../components/DocScanner";
import EntryList from "../components/EntryList";
import FinancialSummary from "../components/FinancialSummary";
import MicButton from "../components/MicButton";
import NavBar from "../components/NavBar";
import OutputCard from "../components/OutputCard";
import Toast, { showToast } from "../components/Toast";
import { getUser } from "../lib/auth";
import { interpret, transcribe } from "../lib/api";
import {
  getOnboardingData,
  getGreeting,
  getPersonalizedTips,
  getSuggestedCategories,
} from "../lib/personalization";

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
  const onboarding = getOnboardingData();
  const personalizedTips = onboarding ? getPersonalizedTips(onboarding.businessType) : [];

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
        const errorMsg = error.message || "Error processing audio";
        setError(errorMsg);
        showToast(errorMsg, "error", 3000);
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
    showToast("✓ Entry saved successfully!", "success", 2000);
  };

  return (
    <main className=”app-shell”>
      <Toast />
      <NavBar user={user} />
      <section className=”page dashboard-page”>
        {/* Tab Navigation - Fixed Alignment */}
        <div
          style={{
            display: “grid”,
            gridTemplateColumns: “repeat(4, 1fr)”,
            gap: 12,
            marginBottom: 24,
            padding: “0 0 16px 0”,
            borderBottom: “1px solid var(--border)”,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type=”button”
              onClick={() => setActiveTab(tab)}
              style={{
                padding: “10px 12px”,
                background: activeTab === tab ? “var(--accent)” : “rgba(255,255,255,0.03)”,
                color: activeTab === tab ? “#050505” : “var(--text-secondary)”,
                fontWeight: activeTab === tab ? 700 : 600,
                border: activeTab === tab ? “none” : “1px solid var(--border)”,
                borderRadius: “var(--radius-full)”,
                cursor: “pointer”,
                transition: “all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)”,
                fontSize: 14,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Speak Tab */}
        {activeTab === “Speak” && (
          <div style={{ display: “grid”, gap: 20, gridTemplateColumns: “1fr 1fr”, alignItems: “start” }}>
            {/* Left: Recording Stage */}
            <div style={{ display: “grid”, gap: 20, placeItems: “center”, minHeight: “400px” }}>
              <div style={{ textAlign: “center”, display: “grid”, gap: 16 }}>
                {onboarding?.businessName && (
                  <p style={{ color: “var(--accent)”, fontSize: 16, fontWeight: 600 }}>
                    {getGreeting(onboarding.businessName)}
                  </p>
                )}
                <p style={{ color: “var(--text-secondary)”, fontSize: 20, fontWeight: 500 }}>Kya hua aaj?</p>
                <MicButton state={recordingState} onClick={handleMicClick} />
                <p style={{ color: “var(--text-secondary)”, fontSize: 14 }}>
                  {recordingState === “recording”
                    ? “🎙️ Bolte rahiye...”
                    : recordingState === “processing”
                      ? “⏳ Samajh rahe hain...”
                      : “📱 Tap karo aur boliye”}
                </p>
              </div>
            </div>

            {/* Right: Results */}
            <div style={{ display: “grid”, gap: 16, alignContent: “start” }}>
              {transcriptText && (
                <div style={{ padding: 12, background: “rgba(255,255,255,0.05)”, borderRadius: “var(--radius-md)” }}>
                  <p style={{ color: “var(--text-secondary)”, fontSize: 12, marginBottom: 6 }}>Transcript:</p>
                  <p style={{ color: “var(--text-primary)”, fontSize: 14, lineHeight: 1.5 }}>”{transcriptText}”</p>
                </div>
              )}

              {error && (
                <div style={{
                  border: “1px solid rgba(239, 68, 68, 0.35)”,
                  background: “rgba(239, 68, 68, 0.08)”,
                  color: “var(--error)”,
                  borderRadius: “var(--radius-sm)”,
                  padding: 12,
                  fontSize: 14,
                }}>
                  ⚠️ {error}
                </div>
              )}

              {result && <OutputCard data={result} onSave={handleSave} saved={saved} />}

              {!result && personalizedTips.length > 0 && (
                <article className=”card” style={{
                  padding: 14,
                  background: “linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03))”,
                  borderColor: “rgba(59, 130, 246, 0.16)”,
                }}>
                  <p style={{ fontSize: 11, color: “var(--text-secondary)”, fontWeight: 700, marginBottom: 8, textTransform: “uppercase” }}>
                    💡 Pro Tip
                  </p>
                  <p style={{ fontSize: 13, color: “var(--text-primary)”, lineHeight: 1.5 }}>
                    {personalizedTips[Math.floor(Math.random() * personalizedTips.length)]}
                  </p>
                </article>
              )}
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === “Summary” && <FinancialSummary entries={entries} />}

        {/* Entries Tab */}
        {activeTab === “Entries” && <EntryList entries={entries} />}

        {/* Scan Doc Tab */}
        {activeTab === “Scan Doc” && <DocScanner />}
      </section>
    </main>
  );
}
