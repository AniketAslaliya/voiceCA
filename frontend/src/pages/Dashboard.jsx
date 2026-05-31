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
import { gettext } from "../lib/langHelper";

const tabKeys = ["speak", "summary", "entries", "scan"];

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
  const [activeTab, setActiveTab] = useState("speak");
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
    showToast(gettext("saved"), "success", 2000);
  };

  return (
    <main className="app-shell">
      <Toast />
      <NavBar user={user} />
      <section className="page dashboard-page" style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 14,
          }}
        >
          {tabKeys.map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                padding: "10px 8px",
                background: activeTab === tabKey ? "var(--accent)" : "transparent",
                color: activeTab === tabKey ? "#050505" : "var(--text-secondary)",
                fontWeight: 700,
              }}
            >
              {gettext(tabKey)}
            </button>
          ))}
        </div>

        {activeTab === "speak" && (
          <section className="fade-up dashboard-speak">
            <div className="speak-stage">
              {onboarding?.businessName && (
                <p style={{ color: "var(--accent)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  {getGreeting(onboarding.businessName)}
                </p>
              )}
              <p style={{ color: "var(--text-secondary)", fontSize: 18 }}>{gettext("kya_hua")}</p>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
                <MicButton state={recordingState} onClick={handleMicClick} />
              </div>
              <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
                {recordingState === "recording"
                  ? gettext("speaking")
                  : recordingState === "processing"
                    ? gettext("processing")
                    : gettext("tap_speak")}
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

              {!result && personalizedTips.length > 0 && (
                <article
                  className="card fade-up"
                  style={{
                    padding: 16,
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03))",
                    borderColor: "rgba(59, 130, 246, 0.16)",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20 }}>💡</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700, marginBottom: 6 }}>
                        PRO TIP FOR {onboarding?.businessType.toUpperCase()}
                      </p>
                      <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.5 }}>
                        {personalizedTips[Math.floor(Math.random() * personalizedTips.length)]}
                      </p>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </section>
        )}

        {activeTab === "summary" && <FinancialSummary entries={entries} />}
        {activeTab === "entries" && <EntryList entries={entries} />}
        {activeTab === "scan" && <DocScanner />}
      </section>
    </main>
  );
}
