# VoiceCA

VoiceCA is a voice-first MVP for Indian small business owners. Speak in Hindi, Hinglish, English, or other Indian languages and the app turns the note into structured business JSON.

## Stack

- Frontend: Vite + React
- Backend: Express
- AI provider: Groq
- Speech: `whisper-large-v3-turbo`
- Intent JSON: `llama-3.3-70b-versatile`
- Vision scan: `meta-llama/llama-4-scout-17b-16e-instruct`

## Local Setup

```bash
cd backend
cp .env.example .env
# add GROQ_API_KEY
npm install
npm run dev
```

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Deploy

### Backend on Render

1. Create a Render Blueprint from this repo, or create a Web Service manually.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variable: `GROQ_API_KEY`
6. Health check path: `/health`

`render.yaml` is included for blueprint deployment.

### Backend on Railway

1. Create a Railway service from this repo.
2. Set root directory to `backend`.
3. Add `GROQ_API_KEY`.
4. Railway can use `backend/Procfile` or `npm start`.

### Frontend on Vercel

1. Import this repo into Vercel.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:

```env
VITE_API_URL=https://your-backend-url
```

`frontend/vercel.json` is included for SPA routing.

## MVP Smoke Tests

- `cd frontend && npm run build`
- `cd frontend && npm run lint`
- `cd backend && node -c index.js`
- `GET /health`
- `POST /api/interpret`
- `POST /api/transcribe`
- `POST /api/scan-document`