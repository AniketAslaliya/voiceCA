require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OpenAI, toFile } = require("openai");

const app = express();
const port = process.env.PORT || 3001;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });

const INTENT_PROMPT = `
You are VoiceCA, an AI assistant that helps non-technical Indian
small business owners manage their business by voice.

The user has spoken in Hindi, English, or Hinglish.
Your job is to:
1. Identify the intent: credit_entry | insurance_claim | expense |
   reminder | document_query | general
2. Extract all entities: person names, amounts (INR), dates, types
3. Generate a structured JSON response
4. Generate a confirmation message in simple Hindi (under 20 words)

RULES:
- Always output valid JSON
- Amounts are always in Indian Rupees
- Dates default to today if not specified
- Names use title case
- If intent is unclear, set type: "clarification_needed"

OUTPUT FORMAT:
{
  "type": "credit_entry|insurance_claim|expense|reminder|clarification_needed",
  "entities": { ...extracted fields },
  "confirmation_hindi": "short confirmation in Hindi",
  "confirmation_english": "short confirmation in English",
  "action_required": "what happens next"
}
`;

const entries = [];

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_key_here") {
      return res.status(500).json({ error: "Set OPENAI_API_KEY in backend/.env" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const file = await toFile(
      req.file.buffer,
      req.file.originalname || "audio.webm",
      { type: req.file.mimetype || "audio/webm" },
    );

    const transcription = await client.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    res.json({ text: transcription.text || "" });
  } catch (error) {
    console.error("Transcription failed:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.post("/api/interpret", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_key_here") {
      return res.status(500).json({ error: "Set OPENAI_API_KEY in backend/.env" });
    }

    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: INTENT_PROMPT },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content);
    entries.push({ ...data, transcript, created_at: new Date().toISOString() });
    res.json(data);
  } catch (error) {
    console.error("Intent extraction failed:", error);
    res.status(500).json({ error: "Intent extraction failed" });
  }
});

app.get("/api/entries", (req, res) => {
  res.json(entries);
});

app.listen(port, () => {
  console.log(`VoiceCA backend on :${port}`);
});
