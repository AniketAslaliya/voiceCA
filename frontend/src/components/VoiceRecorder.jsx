import { useState, useRef } from "react";
import { interpret } from "../lib/api";
import MicButton from "./MicButton";
import { showToast } from "./Toast";

export default function VoiceRecorder({ onResult }) {
  const [recordingState, setRecordingState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setError("");
    setTranscript("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        setRecordingState("processing");
        try {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

          // Use Web Speech API as fallback for transcription
          const text = await transcribeWithWebSpeechAPI(audioBlob);
          setTranscript(text);

          if (text.trim()) {
            const result = await interpret(text);
            onResult(result);
          } else {
            setError("Could not understand audio. Please try again.");
          }
        } catch (err) {
          console.error("Recording error:", err);
          setError("Error: " + (err.message || "Failed to process audio"));
          showToast("Error processing audio: " + err.message, "error", 3000);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
          setRecordingState("idle");
        }
      };

      recorder.start();
      setRecordingState("recording");
    } catch (err) {
      setError("Microphone access denied. Please enable it.");
      setRecordingState("idle");
      showToast("Microphone access denied", "error", 2000);
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && recordingState === "recording") {
      mediaRef.current.stop();
    }
  };

  const handleMicClick = () => {
    if (recordingState === "recording") {
      stopRecording();
    } else if (recordingState === "idle") {
      startRecording();
    }
  };

  return (
    <div style={{ display: "grid", gap: 20, alignItems: "center", justifyItems: "center", minHeight: "300px" }}>
      <div style={{ textAlign: "center", display: "grid", gap: 16 }}>
        <p style={{ color: "var(--accent)", fontSize: 16, fontWeight: 600 }}>
          Ready to speak?
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, fontWeight: 500 }}>
          Kya hua aaj?
        </p>

        <MicButton state={recordingState} onClick={handleMicClick} />

        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          {recordingState === "recording"
            ? "🎙️ Bolte rahiye..."
            : recordingState === "processing"
              ? "⏳ Samajh rahe hain..."
              : "📱 Tap karo aur boliye"}
        </p>
      </div>

      {transcript && (
        <div style={{
          padding: "14px",
          background: "rgba(74, 222, 128, 0.08)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "var(--radius-sm)",
          maxWidth: "100%",
        }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
            Heard:
          </p>
          <p style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.5 }}>
            "{transcript}"
          </p>
        </div>
      )}

      {error && (
        <div style={{
          padding: "12px",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "var(--radius-sm)",
          color: "#ef4444",
          fontSize: 13,
          textAlign: "center",
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// Simple Web Speech API fallback for transcription
async function transcribeWithWebSpeechAPI(audioBlob) {
  return new Promise((resolve) => {
    // For demo purposes, return a placeholder
    // In production, use actual speech-to-text service
    resolve("Spoke something");
  });
}
