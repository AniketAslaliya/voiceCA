import { useRef, useState } from "react";

export default function VoiceInput({ onTranscript, onError }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRef.current.onstop = async () => {
        setLoading(true);
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const form = new FormData();
          form.append("file", blob, "audio.webm");
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const { text, error } = await res.json();
          if (!res.ok) throw new Error(error || "Transcription failed");
          onTranscript(text);
        } catch (error) {
          onError(error.message);
        } finally {
          setLoading(false);
          mediaRef.current?.stream.getTracks().forEach((track) => track.stop());
        }
      };
      mediaRef.current.start();
      setRecording(true);
    } catch (error) {
      onError(error.message);
    }
  };

  const stop = () => {
    mediaRef.current.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stop : start}
      disabled={loading}
      style={{
        width: "100%",
        border: 0,
        borderRadius: 8,
        padding: "16px 18px",
        background: recording ? "#ef4444" : "#16a34a",
        color: "white",
        fontSize: 18,
        fontWeight: 700,
        boxShadow: "0 10px 24px rgba(22, 163, 74, 0.24)",
      }}
    >
      {loading ? "Processing..." : recording ? "Stop" : "🎙️ Speak"}
    </button>
  );
}
