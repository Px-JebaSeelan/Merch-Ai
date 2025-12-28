# 🎨 Merch AI - AI T-Shirt Design Generator

> Transform your ideas into stunning T-shirt designs using AI-powered image generation.

## 🚀 Live Demo

- **Frontend**: [Vercel Deployment URL]
- **Backend**: [Render Deployment URL]

---

## 📝 Technical Write-up

**AI Model Used**: Pollination's Flux API (open-source text-to-image model based on Black Forest Labs' FLUX.1)

**Why Flux?** Flux offers free, high-quality image generation without API keys, making it ideal for demonstrations. It produces clean, centered artwork perfect for merchandise designs with its advanced understanding of composition.

**How AI is Used**: Users enter a text prompt describing their design idea. The backend enhances this prompt with T-shirt-specific keywords (vector art, white background, centered composition) before sending it to Flux. The generated image is converted to base64 and displayed on a realistic SVG T-shirt mockup using CSS `mix-blend-multiply` for authentic print simulation.

**Architecture**:
- **Frontend**: React + Vite + TailwindCSS v4 — Handles UI, user input, and renders the realistic T-shirt mockup with SVG gradients and shadows
- **Backend**: Node.js + Express — Proxies requests to Pollinations API, enhances prompts for optimal design output, and handles image conversion
- **AI Service**: Pollinations.ai (Flux model) — Generates 512x512 images from text prompts

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│  Pollinations   │
│  React + Vite   │     │  Node + Express │     │   Flux API      │
│  TailwindCSS    │◀────│                 │◀────│  (AI Model)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
   Realistic SVG          Prompt Enhancement
   T-Shirt Mockup         + Image Conversion
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd merch-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

```bash
# Terminal 1 - Start Backend (Port 3001)
cd backend
npm start

# Terminal 2 - Start Frontend (Port 5173)
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
merch-ai/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── index.css      # TailwindCSS imports
│   │   └── main.tsx       # React entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md
```

---

## 🔧 Environment Variables

### Backend (.env)
```
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

---

## ✨ Features

- 🎨 **AI-Powered Design Generation** — Describe any concept and get a printable design
- 👕 **Realistic T-Shirt Mockup** — SVG-based with fabric gradients, shadows, and fold lines
- 🖼️ **Print Simulation** — CSS blend modes for authentic printed look
- ⚡ **Pure TailwindCSS** — Modern, responsive UI with no custom CSS
- 🚀 **Fast Generation** — Images generated in ~10-20 seconds

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 👨‍💻 Author

Built for AI Builder Intern Assignment
