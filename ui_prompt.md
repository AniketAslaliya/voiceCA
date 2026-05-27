# VoiceCA â€” UI + Auth + Workflow Prompt
## Paste this into Claude Code. This builds the complete frontend.

---

Read CLAUDE.md and SKILL.md before writing any code.

Build the complete VoiceCA frontend â€” beautiful, minimal, dark,
mobile-first. Reference design: aniketaslaliya.dev â€” dark #080808
background, clean typography, no clutter, editorial feel.

This is a shipping competition. Build something judges remember.

---

## DESIGN DIRECTION â€” COMMIT TO THIS

**Aesthetic:** Dark editorial minimal. Like a premium fintech app
meets an Indian vernacular product. Black background. One sharp
accent colour: `#22c55e` (green â€” money, growth, go).

**Typography:**
- Display/headings: `Instrument Serif` (Google Fonts) â€” has character
- Body/UI: `DM Sans` (Google Fonts) â€” clean, slightly rounded
- Hindi text: same fonts work for Devanagari + Latin

**Core feeling:** When a kirana owner opens this, it should feel
trustworthy and simple â€” not intimidating like a bank app,
not cheap like a basic tool. Premium but approachable.

**One unforgettable thing:** The mic button. It pulses with a
breathing green glow animation when recording. This is the
centrepiece of the entire product.

---

## COLOUR TOKENS

```css
:root {
  --bg-primary: #080808;
  --bg-secondary: #111111;
  --bg-card: #161616;
  --bg-card-hover: #1c1c1c;
  --accent: #22c55e;
  --accent-dim: #16a34a;
  --accent-glow: rgba(34, 197, 94, 0.15);
  --text-primary: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #525252;
  --border: rgba(255,255,255,0.06);
  --border-accent: rgba(34, 197, 94, 0.3);
  --success: #22c55e;
  --error: #ef4444;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
}
```

---

## COMPLETE APP STRUCTURE

```
frontend/src/
â”œâ”€â”€ main.jsx
â”œâ”€â”€ App.jsx              â† router + auth gate
â”œâ”€â”€ index.css            â† global styles + fonts
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ Landing.jsx      â† marketing page (not logged in)
â”‚   â”œâ”€â”€ Auth.jsx         â† login / signup
â”‚   â””â”€â”€ Dashboard.jsx    â† main app (logged in)
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ MicButton.jsx    â† THE centrepiece
â”‚   â”œâ”€â”€ OutputCard.jsx   â† result display
â”‚   â”œâ”€â”€ EntryList.jsx    â† ledger of past entries
â”‚   â”œâ”€â”€ DocScanner.jsx   â† photo upload
â”‚   â””â”€â”€ NavBar.jsx       â† top bar with user + logout
â””â”€â”€ lib/
    â”œâ”€â”€ api.js           â† all fetch calls
    â””â”€â”€ auth.js          â† simple auth helpers
```

---

## PAGE 1: Landing.jsx (not logged in)

Hero section â€” full viewport height, centered:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                â”‚
â”‚   [small logo mark â€” green â—]  â”‚
â”‚                                â”‚
â”‚   Boliye.                      â”‚  â† Instrument Serif, 64px
â”‚   Baaki hum                    â”‚
â”‚   sambhal lenge.               â”‚
â”‚                                â”‚
â”‚   Voice-first AI for India's   â”‚  â† DM Sans, #a3a3a3
â”‚   63 million small businesses  â”‚
â”‚                                â”‚
â”‚   [Get Started â†’]  [Watch Demo]â”‚  â† green CTA + ghost btn
â”‚                                â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€   â”‚
â”‚   3 feature cards below fold   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

3 feature cards (horizontal scroll on mobile):
- ðŸ’° Udhaari â€” "Speak credit entries in Hindi"
- ðŸ“‹ Claims â€” "Log insurance claims by voice"
- ðŸ“„ Documents â€” "Understand any notice in plain language"

Each card: `#161616` bg, green left border `2px solid var(--accent)`,
no drop shadows (flat and minimal), hover lifts 2px.

Footer: "Built by Aniket Aslaliya Â· LNMIIT Â· OpenAI x Outskill 2026"

---

## PAGE 2: Auth.jsx (login + signup)

Single centered card, max-width 400px:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  â— VoiceCA         â”‚
â”‚                    â”‚
â”‚  [Name input]      â”‚  â† only on signup
â”‚  [Email input]     â”‚
â”‚  [Password input]  â”‚
â”‚                    â”‚
â”‚  [Continue â†’]      â”‚  â† green, full width
â”‚                    â”‚
â”‚  Already have an   â”‚
â”‚  account? Sign in  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Auth logic (simple, no backend needed for MVP):**
```javascript
// lib/auth.js
// Store in localStorage â€” no real auth for MVP, just name/email
export const login = (email, name) => {
  localStorage.setItem("voiceca_user",
    JSON.stringify({ email, name, loggedIn: true }));
};
export const logout = () => localStorage.removeItem("voiceca_user");
export const getUser = () => {
  const u = localStorage.getItem("voiceca_user");
  return u ? JSON.parse(u) : null;
};
export const isLoggedIn = () => !!getUser();
```

Input styling:
```css
input {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  transition: border-color 0.2s;
}
input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
```

---

## PAGE 3: Dashboard.jsx (the main app)

Three tabs at top: **Speak** | **Entries** | **Scan Doc**

### TAB 1 â€” SPEAK (default)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  NavBar: â— VoiceCA    ðŸ‘¤ Aniketâ”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚
â”‚  [Speak] [Entries] [Scan Doc] â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚
â”‚                                â”‚
â”‚     Kya hua aaj?               â”‚  â† #a3a3a3, DM Sans
â”‚                                â”‚
â”‚         â•”â•â•â•â•â•â•â•â•—              â”‚
â”‚         â•‘  ðŸŽ™ï¸  â•‘              â”‚  â† THE MIC BUTTON
â”‚         â•šâ•â•â•â•â•â•â•â•              â”‚
â”‚      Tap karo aur boliye       â”‚
â”‚                                â”‚
â”‚  [transcript appears here]     â”‚  â† #525252, italic
â”‚                                â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚ OutputCard (result)     â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### THE MIC BUTTON â€” build this perfectly

```jsx
// MicButton.jsx
// States: idle | recording | processing
// idle: solid green circle, 80px diameter
// recording: green circle with pulsing ring animation
// processing: spinner inside circle

const pulseKeyframes = `
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes pulse-ring-2 {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.9); opacity: 0; }
}
`;

// When recording: show 2 concentric animated rings behind the button
// Ring 1: animation-duration 1.2s
// Ring 2: animation-duration 1.2s, animation-delay 0.4s
// Both rings: background var(--accent), border-radius 50%
```

### TAB 2 â€” ENTRIES

Ledger list. Each entry is a card:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ðŸ’°  Ramesh â€” Udhaari        â”‚
â”‚     â‚¹450 Â· 26 May 2026      â”‚
â”‚     Follow-up: 2 Jun        â”‚
â”‚                        [â†’]  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Empty state: "Abhi koi entry nahi. Boliye kuch!" with mic icon.

### TAB 3 â€” SCAN DOC

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                             â”‚
â”‚   ðŸ“„                        â”‚
â”‚   Document ya notice ki     â”‚
â”‚   photo lo                  â”‚
â”‚                             â”‚
â”‚   [Upload Photo]            â”‚
â”‚                             â”‚
â”‚   [Result card appears]     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## ANIMATIONS â€” ALL CSS, NO LIBRARY NEEDED

```css
/* Page enter */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fade-up 0.4s ease forwards; }

/* Stagger children */
.fade-up:nth-child(1) { animation-delay: 0s; }
.fade-up:nth-child(2) { animation-delay: 0.08s; }
.fade-up:nth-child(3) { animation-delay: 0.16s; }

/* Card hover */
.card {
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--border-accent);
}

/* Button press */
.btn-primary:active { transform: scale(0.97); }
```

---

## OUTPUT CARD â€” ResultCard.jsx

```jsx
// When Codex returns a result, show this card
// Slide up animation on appear

const typeConfig = {
  credit_entry:     { icon: "ðŸ’°", label: "Udhaari Entry",    color: "#22c55e" },
  insurance_claim:  { icon: "ðŸ“‹", label: "Claim Logged",     color: "#3b82f6" },
  expense:          { icon: "ðŸ§¾", label: "Expense Recorded", color: "#f59e0b" },
  clarification:    { icon: "ðŸ¤”", label: "Thoda aur batao",  color: "#a3a3a3" },
};

// Card structure:
// - Top strip: icon + label in type colour
// - Middle: confirmation_hindi in large text (18px, text-primary)
// - Sub: confirmation_english in text-secondary
// - Bottom row: action_required in accent green + [Save] button
```

---

## NAVBAR

```jsx
// Simple top bar
// Left: green dot â— + "VoiceCA" in Instrument Serif
// Right: user initial in circle + dropdown (Profile, Logout)
// Height: 56px, border-bottom: 1px solid var(--border)
// position: sticky, top: 0, z-index: 100
// backdrop-filter: blur(12px) + background: rgba(8,8,8,0.85)
```

---

## ROUTING (React Router v6)

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./lib/auth";

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

Install: `npm install react-router-dom`

---

## GLOBAL CSS (index.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

h1, h2, h3 { font-family: 'Instrument Serif', serif; }

/* Green CTA button */
.btn-primary {
  background: var(--accent);
  color: #000;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover { background: #16a34a; }

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { border-color: var(--accent); color: var(--text-primary); }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 2px; }
```

---

## BUILD ORDER â€” DO THESE IN SEQUENCE

1. `index.css` â€” tokens + global styles + fonts
2. `lib/auth.js` â€” localStorage auth helpers
3. `App.jsx` â€” router with protected route
4. `Landing.jsx` â€” hero + 3 cards + CTA
5. `Auth.jsx` â€” login/signup form
6. `NavBar.jsx` â€” sticky top bar
7. `MicButton.jsx` â€” idle + recording + processing states
8. `OutputCard.jsx` â€” result display
9. `EntryList.jsx` â€” list of saved entries
10. `DocScanner.jsx` â€” photo upload placeholder
11. `Dashboard.jsx` â€” tabs wiring all components
12. `lib/api.js` â€” fetch calls to backend

Test after step 4 (landing renders).
Test after step 7 (auth flow works).
Test after step 11 (full flow works).

---

## WIRE BACKEND CALLS IN api.js

```javascript
// lib/api.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function transcribe(audioBlob) {
  const form = new FormData();
  form.append("file", audioBlob, "audio.webm");
  const r = await fetch(`${BASE}/api/transcribe`, { method: "POST", body: form });
  return r.json(); // { text: "..." }
}

export async function interpret(transcript) {
  const r = await fetch(`${BASE}/api/interpret`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript })
  });
  return r.json(); // { type, entities, confirmation_hindi, ... }
}

export async function scanDocument(imageBase64) {
  const r = await fetch(`${BASE}/api/scan-document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 })
  });
  return r.json();
}
```

---

## AFTER UI IS DONE â€” POST ON LINKEDIN

```
Day 2 â€” VoiceCA is taking shape.

Dark. Minimal. Built for India.

The mic button pulses green when you speak.
The AI understands Hindi.
The paperwork writes itself.

[screenshot of the UI]

Building live this week. ðŸš€
#OpenAI #BuildInPublic #VoiceCA
```

---

## FINAL CHECK BEFORE WEDNESDAY

- [x] Landing page renders and looks good on mobile (390px)
- [x] Auth flow works (signup -> dashboard, logout -> landing)
- [x] Landing/dashboard are responsive on desktop, not constrained to mobile width
- [x] Mic button enters recording state with browser microphone permission
- [x] Mic button records and transcribes via Groq Whisper
- [x] Groq returns structured JSON for Hindi/Hinglish input
- [x] OutputCard shows result clearly
- [x] Entries tab shows saved records after a result is saved
- [x] Scan Doc tab uploads a photo and calls `/api/scan-document`
- [x] Scan Doc returns document explanation
- [x] No app console errors in browser smoke test
- [ ] Screenshot taken from phone (not desktop)

## SMOKE TEST SUMMARY - May 27

- `npm run build` passed
- `npm run lint` passed
- Backend `/health` returned `{ "status": "ok" }`
- Playwright desktop smoke passed at 1366x900
- Playwright mobile smoke passed at 390x844
- Desktop landing width: 1120px
- Desktop dashboard width: 860px
- Mobile landing/dashboard width: 390px
- Seeded Entries tab smoke passed with a saved Ramesh credit entry
- Live Groq intent tests passed for `credit_entry`, `insurance_claim`, and `expense`
- Live audio pipeline passed: generated WAV -> `/api/transcribe` -> `/api/interpret`
- Live Scan Doc upload passed with generated bill image and returned Hindi explanation
- Full browser flow passed: landing -> auth -> dashboard -> mic -> save -> entries -> scan doc -> logout
