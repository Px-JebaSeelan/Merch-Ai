# 🎨 Merch AI - AI T-Shirt Design Generator

> Transform your ideas into stunning T-shirt designs using AI-powered image generation.

## 🚀 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend**: [Your Render URL]

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **AI Design Generation** | Describe any concept and get instant artwork |
| 👕 **6 T-Shirt Colors** | White, Black, Navy, Red, Forest, Purple |
| 🎭 **6 Style Presets** | Minimalist, Vintage, Neon, Watercolor, Cartoon, Abstract |
| 📥 **Download Mockup** | Export high-quality PNG images |
| 📚 **Design History** | Saves recent designs locally |
| 🖼️ **Realistic Mockup** | SVG-based with shadows and fabric effects |
| ⚡ **Smart Optimization** | Self-healing backend with retry logic and cold-start mitigation |

---

## 📝 Technical Write-up (195 words)

**AI Model Used**: Pollinations Flux API (based on Black Forest Labs' FLUX.1)

**Why Flux?** Flux offers high-quality, free text-to-image generation without API keys—perfect for merchandise designs with its excellent understanding of artistic styles and composition.

**How AI is Used**: Users enter a prompt. The backend improves it with T-shirt specific keywords, selects a style, and requests the image. We use a **robust backend architecture** that handles timeouts, retries throttled requests, and mitigates cold starts on free hosting tiers.

**Architecture**:
- **Frontend**: React + Vite + TailwindCSS v4 — Two-column responsive layout with color picker, style presets, design history (localStorage), and PNG export (html2canvas)
- **Backend**: Node.js + Express — Proxies to Pollinations API with exponential backoff retry logic, user-agent mimicking, and self-ping keep-alive.
- **AI**: Pollinations.ai Flux model — Generates artwork from combined prompt + style preset

**Wow Factors**: Real-time color switching, one-click style presets, instant PNG export, persistent design gallery, and a **"Wake-on-visit"** system that starts the server instantly when a user arrives.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                               │
│  React + Vite + TailwindCSS                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Color Picker│  │Style Presets│  │ Design History      │   │
│  └─────────────┘  └─────────────┘  │ (localStorage)      │   │
│                                     └─────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Interactive SVG T-Shirt Mockup (mix-blend-mode)         │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Wake-on-Visit Ping                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        BACKEND                                │
│  Node.js + Express                                            │
│  - Robust Fetch with Retry Logic (Exponential Backoff)        │
│  - Self-Ping Keep-Alive (Prevents Sleep)                      │
│  - CORS / User-Agent Handling                                 │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    POLLINATIONS API                           │
│  Flux AI Model - Text-to-Image Generation                     │
│  - No API key required                                        │
│  - 512x512 output                                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Local Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/merch-ai.git
cd merch-ai

# Backend
cd backend && npm install && npm start

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Open http://localhost:5173

---

## 📁 Project Structure

```
merch-ai/
├── backend/
│   ├── server.js       # Express API with retry logic & keep-alive
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx     # Main UI with all features
│   │   └── index.css   # TailwindCSS config
│   └── package.json
└── README.md
```

---

## 🚀 Deployment

**Backend → Render.com**
- Root: `backend`
- Build: `npm install`
- Start: `npm start`
- Environment Variables:
    - `RENDER_EXTERNAL_URL`: `https://your-backend-app.onrender.com` (Required for Keep-Alive feature)

**Frontend → Vercel**
- Root: `frontend`
- Environment Variables:
    - `VITE_API_URL`: `https://your-backend-app.onrender.com`

---

## 📄 License

MIT License
