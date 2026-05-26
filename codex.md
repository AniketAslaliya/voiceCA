# VoiceCA — Claude Code Context File
## OpenAI x Outskill Hackathon | May 26–30, 2026

---

## WHAT WE ARE BUILDING

**VoiceCA** — Speak your business. AI handles the paperwork.

A voice-first AI assistant for non-technical Indians (shop owners,
insurance agents, small business owners) who can speak Hindi/Hinglish
but cannot type forms in English. They speak → VoiceCA understands →
documents, reminders, and letters are generated automatically.

**Core mechanic:** User speaks a voice note → Whisper transcribes →
Codex interprets intent + generates structured output → one-tap confirm.

---

## HACKATHON CONSTRAINTS — NON-NEGOTIABLE

- **Wednesday 28 May 11:59 PM IST:** Product brief + MVP screenshots + user flow
- **Friday 30 May:** Working prototype live + demo video + public launch post
- **Judging (100 pts):** Technical execution 25 + Usefulness 25 +
  Creativity 20 + Codex usage 20 + Presentation 10
- **Codex must be used meaningfully** — not just called in background
- **Speed + usefulness wins.** No overengineering. No perfectionism.

---

## TECH STACK — KEEP IT SIMPLE

```
Frontend:  React (Vite) — mobile-first, single page
Backend:   Node.js + Express
AI:        OpenAI Codex (core) + Whisper API (voice) + GPT-4o Vision (docs)
Storage:   In-memory for MVP (no DB needed for day 1-2)
Deploy:    Vercel (frontend) + Railway or Render (backend)
```

---

## THE 3 CORE USE CASES — BUILD THESE FIRST

### Use Case 1 — Udhaari Tracker (Credit Ledger)
User speaks: *"Ramesh ne aaj 450 rupaye ka saman liya, udhaar hai"*
Codex generates:
```json
{
  "type": "credit_entry",
  "person": "Ramesh",
  "amount": 450,
  "date": "today",
  "reminder_days": 7,
  "entry_text": "Ramesh owes ₹450 for goods taken on [date]"
}
```
Output: Ledger entry created + WhatsApp reminder scheduled

### Use Case 2 — Claim Logger (Insurance)
User speaks: *"Mrs Sharma ki car claim hai, 14 May accident, 35000 rupaye"*
Codex generates:
```json
{
  "type": "insurance_claim",
  "client": "Mrs Sharma",
  "claim_type": "car",
  "accident_date": "2026-05-14",
  "amount": 35000,
  "status": "documents_pending",
  "follow_up_date": "3 days from today"
}
```
Output: Claim card created + follow-up reminder

### Use Case 3 — Document Explainer
User uploads photo of notice/letter
GPT-4o Vision reads it → Codex generates plain Hindi explanation
+ exact action required + draft reply in formal English

---

## HOW CODEX IS USED — THE CORE DIFFERENTIATOR

Codex is NOT just called in the background to generate text.
Codex is the **intent engine** — it does the heavy lifting:

1. Takes raw Hindi/Hinglish transcript
2. Identifies intent (credit, claim, document, expense, reminder)
3. Extracts structured entities (person, amount, date, type)
4. Generates the correct output template
5. Produces human-readable confirmation in the user's language

This is Codex being used as a reasoning + extraction agent,
not just a text generator. This scores maximum on Codex usage (20pts).

---

## FILE STRUCTURE

```
voiceca/
├── CLAUDE.md                 ← YOU ARE HERE
├── SKILL.md                  ← patterns and shortcuts
├── frontend/
│   ├── src/
│   │   ├── App.jsx           ← main app
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx     ← record + transcribe
│   │   │   ├── OutputCard.jsx     ← show generated result
│   │   │   ├── LedgerView.jsx     ← list of entries
│   │   │   └── DocumentScan.jsx   ← photo upload
│   │   └── api.js            ← all API calls
├── backend/
│   ├── index.js              ← Express server
│   ├── routes/
│   │   ├── voice.js          ← POST /transcribe
│   │   ├── codex.js          ← POST /interpret
│   │   └── document.js       ← POST /scan-document
│   └── prompts/
│       ├── intent_prompt.js  ← Codex system prompt
│       └── explain_prompt.js ← Document explanation prompt
└── docs/
    ├── product_brief.md
    ├── user_flow.md
    └── one_pager.md
```

---

## THE CODEX PROMPT — CORE OF THE PRODUCT

```javascript
// backend/prompts/intent_prompt.js
const INTENT_PROMPT = `
You are VoiceCA, an AI assistant that helps non-technical Indian 
small business owners manage their business by voice.

The user has spoken in Hindi, English, or Hinglish. 
Your job is to:
1. Identify the intent: credit_entry | insurance_claim | expense | 
   reminder | document_query | general
2. Extract all entities: person names, amounts (₹), dates, types
3. Generate a structured JSON response
4. Generate a confirmation message in simple Hindi (under 20 words)

RULES:
- Always output valid JSON
- Amounts are always in Indian Rupees (₹)
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
```

---

## DAILY BUILD TARGETS

### Today (Mon May 26) — DAY 1
- [ ] Vite React app running locally
- [ ] Express backend with /health endpoint
- [ ] Whisper API connected — voice → text working
- [ ] Codex intent extraction working on 3 test inputs
- [ ] Basic UI: record button + show transcript + show JSON output

### Tomorrow (Tue May 27) — DAY 2  
- [ ] Three output card types (ledger, claim, document)
- [ ] In-memory storage for entries
- [ ] Simple ledger view (list of entries)
- [ ] Mobile-first UI polished enough for screenshots
- [ ] Document photo upload + GPT-4o Vision working

### Wednesday (Wed May 28) — CHECKPOINT DAY
- [ ] MVP screenshots taken
- [ ] Product brief written (use docs/product_brief.md template)
- [ ] User flow diagram done (use docs/user_flow.md)
- [ ] One-pager investor pitch done
- [ ] Submit by 11:59 PM IST

### Thursday (Thu May 29) — POLISH DAY
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render
- [ ] End-to-end test on mobile
- [ ] Record demo video (90 seconds max)
- [ ] Build in public LinkedIn post

### Friday (Fri May 30) — LAUNCH DAY
- [ ] Final live URL working
- [ ] Demo walkthrough video submitted
- [ ] Public launch post on LinkedIn + Twitter
- [ ] Submit all deliverables

---

## NEVER DO THESE

1. NEVER build a database on Day 1 — use in-memory arrays
2. NEVER add authentication before MVP is done
3. NEVER build more than 3 use cases for the demo
4. NEVER use Codex just to generate a summary — use it as the intent engine
5. NEVER skip the mobile-first constraint — target user has a phone, not a laptop
6. NEVER overthink the UI — one screen, one button, one clear output

---

## WINNING ANGLE FOR EACH CRITERION

| Criterion | How VoiceCA wins |
|-----------|-----------------|
| Technical execution (25) | Whisper + Codex pipeline working end-to-end |
| Usefulness (25) | 63M Indian SMBs cannot use existing tools — this works for them |
| Creativity (20) | Only submission targeting non-English, non-typing users |
| Codex usage (20) | Codex is the intent + extraction engine, not just text gen |
| Presentation (10) | Demo shows Papa using it — 90 second real use case video |

---

## THE STORY — USE THIS IN ALL PUBLIC POSTS

"My father is an insurance agent. Every day he takes notes in a
register because he cannot type fast enough on a computer.
Every evening he re-enters those notes into spreadsheets.
Every week he writes the same follow-up letters manually.

He is not alone. 63 million Indian small business owners do the same.

VoiceCA lets them speak their business — in Hindi, Hinglish,
whatever they speak — and handles everything else."

---

## KEY APIs

```javascript
// Whisper — voice to text
POST https://api.openai.com/v1/audio/transcriptions
model: "whisper-1"
file: audio_blob

// Codex / GPT-4o — intent extraction  
POST https://api.openai.com/v1/chat/completions
model: "gpt-4o" // use gpt-4o as Codex is accessed via API
system: INTENT_PROMPT
user: transcript_text

// GPT-4o Vision — document scanning
POST https://api.openai.com/v1/chat/completions
model: "gpt-4o"
content: [{ type: "image_url", image_url: { url: base64_image } }]
```