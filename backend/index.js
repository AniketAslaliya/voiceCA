require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const SUPPORTED_LANGUAGES =
  "Hindi, Hinglish, English, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, and Odia";

function hasApiKey() {
  if (AI_PROVIDER === "gemini") {
    return GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_key_here";
  }
  return false;
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
    provider: AI_PROVIDER,
    hasApiKey: hasApiKey(),
  });
});

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!hasApiKey()) {
      return res.status(500).json({ error: `Set ${AI_PROVIDER.toUpperCase()}_API_KEY in backend/.env` });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const base64Audio = req.file.buffer.toString("base64");
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "audio/webm",
                  data: base64Audio,
                },
              },
              {
                text: "Transcribe this audio and return only the transcribed text as JSON with key 'text'.",
              },
            ],
          },
        ],
      },
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/"text":\s*"([^"]*)"/);
    const text = jsonMatch ? jsonMatch[1] : content;

    res.json({ text });
  } catch (error) {
    console.error("Transcription failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.post("/api/interpret", async (req, res) => {
  try {
    if (!hasApiKey()) {
      return res.status(500).json({ error: `Set ${AI_PROVIDER.toUpperCase()}_API_KEY in backend/.env` });
    }

    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: INTENT_PROMPT + "\n\nUser input: " + transcript,
              },
            ],
          },
        ],
      },
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    const data = JSON.parse(jsonStr);

    entries.push({ ...data, transcript, created_at: new Date().toISOString() });
    res.json(data);
  } catch (error) {
    console.error("Intent extraction failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Intent extraction failed" });
  }
});

app.post("/api/scan-document", async (req, res) => {
  try {
    if (!hasApiKey()) {
      return res.status(500).json({ error: `Set ${AI_PROVIDER.toUpperCase()}_API_KEY in backend/.env` });
    }

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, "");
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "image/png",
                  data: base64Image,
                },
              },
              {
                text: "Analyze this document/image and return JSON with: 'title', 'description', 'action_items', 'tax_implications'",
              },
            ],
          },
        ],
      },
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("Document scan failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Document scan failed" });
  }
});

app.get("/api/entries", (req, res) => {
  res.json(entries);
});

app.listen(port, () => {
  console.log(`VoiceCA backend on :${port}`);
});
