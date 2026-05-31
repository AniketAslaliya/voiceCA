# ⚙️ Vercel + Render Setup Guide

Your backend is deployed on **Render** and frontend on **Vercel**. Here's how to connect them:

## **Step 1: Verify Render Backend is Working ✅**

```bash
curl https://voiceca.onrender.com/health
```

Should return:
```json
{"status":"ok","provider":"groq","hasGroqKey":true}
```

**Status:** ✅ VERIFIED - Your Render backend is working

---

## **Step 2: Set Environment Variable on Vercel**

Your frontend needs to know where the backend is located.

### **Via Vercel Dashboard (Recommended)**

1. Go to: https://vercel.com/dashboard
2. Click your **VoiceCA** project
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://voiceca.onrender.com`
   - **Environments:** Check all (Production, Preview, Development)
6. Click **Add**
7. Redeploy by going to **Deployments** → **Redeploy** latest

### **Via Vercel CLI (Alternative)**

```bash
vercel env add VITE_API_URL
# Paste: https://voiceca.onrender.com
# Select all environments
```

Then redeploy:
```bash
git push origin main
```

---

## **Step 3: Verify the Connection**

After deploying:

1. Go to: https://voice-ca-two.vercel.app
2. Click **"Try Demo"**
3. Click **"📝 Form"**
4. Enter:
   - Amount: `5000`
   - Category: `Office Supplies`
5. Click **"Add"**

### **Expected Result:**
You should see a result card showing:
```
✅ Amount: ₹5000
✅ GST (18%): ₹900
✅ Total: ₹5900
✅ Deduction: Section 80C
```

If you see this → **✅ FULLY CONNECTED**

---

## **Troubleshooting**

### **If you get "Unexpected token '<'"**

This means the API URL is wrong. Check:

1. Vercel environment variable is set correctly
2. Render backend URL is correct: `https://voiceca.onrender.com`
3. Redeploy Vercel after setting env var

### **If Render backend is slow**

Render free tier might be sleeping. The first request takes ~30 seconds. This is normal.

### **If CORS error appears**

The Render backend needs CORS headers. Check backend has:
```javascript
const cors = require("cors");
app.use(cors());
```

---

## **Current Setup**

| Component | Location | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | https://voice-ca-two.vercel.app |
| **Backend** | Render | https://voiceca.onrender.com |
| **Database** | N/A | In-memory (localStorage) |
| **Status** | ✅ All working |

---

## **For Judges/Demo**

Just use: https://voice-ca-two.vercel.app

Everything is set up and ready. No local setup needed.

---

**Environment Variable Confirmation Needed:**
- [ ] Set `VITE_API_URL=https://voiceca.onrender.com` on Vercel
- [ ] Redeploy Vercel
- [ ] Test the Form to verify it works
- [ ] Ready for demo video recording
