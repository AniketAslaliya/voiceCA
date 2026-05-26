# SKILL.md — VoiceCA Token-Efficient Patterns
## Read before every Claude Code session

---

## SKILL 1: Voice Input Component Pattern

```jsx
// VoiceInput.jsx — always use this pattern
import { useState, useRef } from "react";

export default function VoiceInput({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRef.current.ondataavailable = e => chunksRef.current.push(e.data);
    mediaRef.current.onstop = async () => {
      setLoading(true);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("file", blob, "audio.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const { text } = await res.json();
      onTranscript(text);
      setLoading(false);
    };
    mediaRef.current.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRef.current.stop();
    setRecording(false);
  };

  return (
    <button onClick={recording ? stop : start} disabled={loading}
      style={{ background: recording ? "#ef4444" : "#16a34a" }}>
      {loading ? "Processing..." : recording ? "Stop" : "🎙️ Speak"}
    </button>
  );
}
```

---

## SKILL 2: Codex Intent Extraction Pattern

```javascript
// backend/routes/codex.js — always use this pattern
const { OpenAI } = require("openai");
const client = new OpenAI();

async function extractIntent(transcript) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: INTENT_PROMPT },
      { role: "user", content: transcript }
    ],
    response_format: { type: "json_object" }
  });
  return JSON.parse(completion.choices[0].message.content);
}
```

---

## SKILL 3: OutputCard Pattern (3 types)

```jsx
// OutputCard.jsx — handles all 3 types
export default function OutputCard({ data }) {
  if (!data) return null;
  const icons = { credit_entry: "💰", insurance_claim: "📋", expense: "🧾" };
  return (
    <div style={{ border: "1px solid #16a34a", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 24 }}>{icons[data.type] || "📌"}</div>
      <div style={{ fontWeight: "bold" }}>{data.confirmation_hindi}</div>
      <div style={{ color: "#666", fontSize: 14 }}>{data.confirmation_english}</div>
      <pre style={{ background: "#f1f5f9", padding: 8, borderRadius: 8, fontSize: 12 }}>
        {JSON.stringify(data.entities, null, 2)}
      </pre>
      <div style={{ color: "#16a34a", fontSize: 13 }}>→ {data.action_required}</div>
    </div>
  );
}
```

---

## SKILL 4: Express Backend Skeleton

```javascript
// backend/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// In-memory store (no DB needed for MVP)
const entries = [];

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  // Whisper call here
});

app.post("/api/interpret", async (req, res) => {
  // Codex call here
});

app.get("/api/entries", (req, res) => res.json(entries));

app.listen(3001, () => console.log("VoiceCA backend on :3001"));
```

---

## SKILL 5: End-of-session update prompt

```
Session complete. Update CLAUDE.md daily build targets:
- Mark completed items with ✅
- Add any new blockers or decisions made
- Write the exact first task for next session
```

---

## SHORTCUTS

| Say this | Means |
|----------|-------|
| "Use SKILL 1" | Build voice input with MediaRecorder |
| "Use SKILL 2" | Wire Codex intent extraction |
| "Use SKILL 3" | Build output card component |
| "Use SKILL 4" | Set up Express backend skeleton |
| "End session" | Update CLAUDE.md targets |

---

## NEVER DO

- Never add DB before MVP screenshots done
- Never build auth before demo works
- Never use streaming for MVP — simple await is fine
- Never skip mobile-first — test on 390px width always