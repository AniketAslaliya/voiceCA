require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Groq = require("groq-sdk");
const { toFile } = require("groq-sdk");

const app = express();
const port = process.env.PORT || 3001;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });

const GROQ_TRANSCRIBE_MODEL = "whisper-large-v3-turbo";
const GROQ_INTENT_MODEL = "llama-3.3-70b-versatile";
const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const SUPPORTED_LANGUAGES =
  "Hindi, Hinglish, English, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, and Odia";

function hasGroqKey() {
  return process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_key_here";
}

const INTENT_PROMPT = `
You are VoiceCA, an AI assistant that helps non-technical Indian
small business owners manage their business by voice.

Today is ${CURRENT_DATE}. Use this as the reference date.
The user may speak in ${SUPPORTED_LANGUAGES}.
Your job is to:
1. Identify the intent: credit_entry | insurance_claim | expense |
   reminder | document_query | general
2. Extract all entities: person names, amounts (INR), dates, types
3. Generate a structured JSON response
4. Generate a confirmation message in the user's language when possible

RULES:
- Always output valid JSON
- Amounts are always in Indian Rupees
- Dates default to today if not specified
- If a date has day and month but no year, use the current year from today's date
- Return normalized dates as YYYY-MM-DD where possible
- Names use title case
- If intent is unclear, set type: "clarification_needed"
- For credit_entry entities use: person, amount, date, item if available
- For insurance_claim entities use: client, claim_type, accident_date, amount, status
- For expense entities use: category, amount, date, paid_to if available

OUTPUT FORMAT:
{
  "type": "credit_entry|insurance_claim|expense|reminder|clarification_needed",
  "entities": { ...extracted fields },
  "confirmation_hindi": "short confirmation in the user's language",
  "confirmation_english": "short confirmation in English",
  "action_required": "what happens next"
}
`;

const DOCUMENT_PROMPT = `
You are VoiceCA. Read the uploaded business document, notice, bill, or letter.
Return simple JSON for a non-technical Indian small business owner.
The user may speak in ${SUPPORTED_LANGUAGES}.

OUTPUT FORMAT:
{
  "type": "document_query",
  "document_type": "short type",
  "explanation_hindi": "plain explanation in the user's language under 40 words",
  "summary_english": "short English summary",
  "action_required": "exact next action",
  "draft_reply_english": "short formal reply if useful"
}
`;

const entries = [];

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    provider: "groq",
    hasGroqKey: hasGroqKey(),
  });
});

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!hasGroqKey()) {
      return res.status(500).json({ error: "Set GROQ_API_KEY in backend/.env" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const file = await toFile(
      req.file.buffer,
      req.file.originalname || "audio.webm",
      { type: req.file.mimetype || "audio/webm" },
    );

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: GROQ_TRANSCRIBE_MODEL,
      response_format: "json",
      temperature: 0,
    });

    res.json({ text: transcription.text || "" });
  } catch (error) {
    console.error("Transcription failed:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.post("/api/interpret", async (req, res) => {
  try {
    if (!hasGroqKey()) {
      return res.status(500).json({ error: "Set GROQ_API_KEY in backend/.env" });
    }

    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_INTENT_MODEL,
      messages: [
        { role: "system", content: INTENT_PROMPT },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const data = JSON.parse(completion.choices[0].message.content);
    entries.push({ ...data, transcript, created_at: new Date().toISOString() });
    res.json(data);
  } catch (error) {
    console.error("Intent extraction failed:", error);
    res.status(500).json({ error: "Intent extraction failed" });
  }
});

app.post("/api/scan-document", async (req, res) => {
  try {
    if (!hasGroqKey()) {
      return res.status(500).json({ error: "Set GROQ_API_KEY in backend/.env" });
    }

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_VISION_MODEL,
      messages: [
        { role: "system", content: DOCUMENT_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Explain this document for the user." },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error("Document scan failed:", error);
    res.status(500).json({ error: "Document scan failed" });
  }
});

app.get("/api/entries", (req, res) => {
  res.json(entries);
});

app.listen(port, () => {
  console.log(`VoiceCA backend on :${port}`);
});
