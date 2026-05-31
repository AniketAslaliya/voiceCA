# VoiceCA — Speak Business into Structure

> Voice-first AI for India's 63 million small businesses.
> Speak in Hindi, Hinglish, or any Indian language.
> VoiceCA turns it into structured business records instantly.

🌐 Live: https://voice-ca-two.vercel.app  
📹 Demo: https://youtu.be/[add-your-demo-video-id]  
💻 GitHub: https://github.com/AniketAslaliya/voiceCA

## The Problem
63 million Indian SMBs run on memory and WhatsApp — not because 
they're uneducated, but because every tool requires typing in English.
India loses ₹10,000+ crore to insurance fraud annually. The data 
exists in people's heads. VoiceCA gets it out.

## What It Does
Speak a credit entry, insurance claim, or expense → Whisper 
transcribes → Llama extracts structured intent → one-tap save.

Three use cases:
- 💰 **Udhaari** — Credit ledger by voice
- 📋 **Claims** — Insurance claim logging
- 📄 **Documents** — Photo any notice, get plain Hindi explanation

## How Llama Is Used
Llama is the intent engine — not just a text generator.
It reads raw Hindi/Hinglish speech, identifies the business intent,
extracts entities (person, amount, date, GST slab, deduction 
eligibility), and returns structured JSON. Multi-language reasoning 
over unstructured speech.

## Tech Stack
- **Speech:** Groq Whisper large-v3-turbo (fastest transcription)
- **Intent:** Llama 3.3 70B via Groq (reasoning engine)
- **Vision:** Llama 4 Scout (document scanning)
- **Frontend:** React + Vite → Vercel
- **Backend:** Node.js + Express → Render

## Built By
Aniket Aslaliya · LNMIIT  
🏆 3rd Place — Meta PyTorch × Scaler Hackathon 2026 (70,000+ developers)  
OpenAI × Outskill AI Builders Hackathon 2026
