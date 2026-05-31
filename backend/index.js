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
You are VoiceCA, an AI CA assistant that helps non-technical Indian
small business owners manage their accounting by voice.

Today is ${CURRENT_DATE}. Use this as the reference date.
The user may speak in ${SUPPORTED_LANGUAGES}.
Your job is to:
1. Identify the intent: credit_entry | insurance_claim | expense | reminder | document_query | general
2. Extract all entities AND tax implications
3. Classify expenses by GST slab (5%, 12%, 18%, 28%, exempt)
4. Identify deduction eligibility (section 80C, 80D, etc.)
5. Generate professional JSON output

RULES FOR AMOUNTS:
- Always in Indian Rupees (₹)
- If GST is applicable, show: amount (excluding GST) + GST amount + total
- Dates default to today if not specified
- If date has day/month but no year, use ${CURRENT_DATE.slice(0, 4)}
- Return dates as YYYY-MM-DD

EXPENSE CATEGORIES & GST:
- Office supplies: 18% GST, deductible under 80C
- Travel/Transport: 5% GST (taxi), 18% (flight), deductible
- Materials/Raw materials: 5-18% GST based on type, deductible
- Salaries/Staff: 0% GST, deductible
- Utilities (electricity, water): 5% GST, deductible
- Professional services: 18% GST, deductible
- Advertisement: 18% GST, deductible
- Maintenance/Repairs: 18% GST, deductible
- Insurance premium: 18% GST, deductible under 80D

OUTPUT FORMAT:
{
  "type": "credit_entry|insurance_claim|expense|reminder|clarification_needed",
  "entities": {
    "person": "name (for credit entries)",
    "amount_base": number (excluding GST),
    "gst_slab": "5%|12%|18%|28%|0%|exempt",
    "gst_amount": number,
    "amount_total": number (including GST),
    "date": "YYYY-MM-DD",
    "category": "expense category or credit type",
    "item": "what was purchased/sold if applicable",
    "paid_to": "vendor name for expenses",
    "deduction_eligible": true|false,
    "deduction_section": "80C|80D|80TTA|none"
  },
  "confirmation_hindi": "short acknowledgment in user language",
  "confirmation_english": "English confirmation",
  "tax_summary": {
    "taxable_amount": number,
    "estimated_tax": "tax impact or savings",
    "action": "claim deduction, file invoice, record for GST return, etc."
  },
  "action_required": "specific next step"
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
