# TruthLens

**TruthLens** is an AI-powered platform that empowers readers to think critically about the information they consume. It analyzes news articles and public content through multiple lenses—detecting political bias, emotional manipulation, misinformation risk, and even synthetic media traces such as AI-generated images or text.

> TruthLens doesn't follow the headlines. It questions them.

---

## 🧠 What It Does

TruthLens provides a multi-layered report from any article, paragraph, or media file. It includes:

- **Fake News Score** – Estimates the presence of speculative or unverified claims.
- **Political Bias Detection** – Identifies ideological framing (left / right / neutral).
- **Emotional Language Analysis** – Highlights manipulative or emotionally charged wording.
- **AI-Generated Text Detection** – Assesses whether the writing was produced by an LLM.
- **Image Forensics** – Detects AI-generated or manipulated visual content.
- **Multilingual Translator Pro** – Translates tone, style, and intent—not just words—across 35+ languages.
- **TruthLens Assistant** – A multilingual, RAG-powered assistant that reads documents, answers questions, and supports critical news analysis.

---

## 🔍 Why TruthLens?

The rise of AI-generated content, algorithmic polarization, and media bias demands more than fact-checking. **TruthLens was built to illuminate how language is framed**—emotionally, politically, and rhetorically—so users can think independently and contextually.

It is not a tool for censorship. It is a tool for awareness.

---

## 🌐 Multilingual by Design

TruthLens supports over **35 languages** across all modules. The translator adapts linguistic and cultural nuance. The Assistant speaks clearly in your native language. All analytics work globally—no English-only limitations.

---

## 🧪 Technologies Used

### Frontend
- **Vue 3** with **Vite**
- **Tailwind CSS** for design
- Fully modular components: Chatbot, Analysis blocks, Translator, Results viewer

### Backend
- **FastAPI** (Python 3.10+)
- Modular architecture (`routes`, `services`, `prompts`, `schemas`)
- **OpenAI GPT-4 API** for LLM tasks
- Image forensic pipeline (metadata + prompt-based heuristics)
- Audio voice synthesis via ElevenLabs or Amazon Polly

### AI & Architecture
- GPT-4 Prompt Engineering (modular prompt chains)
- Multimodal analysis: text, image, translation, voice
- RAG-ready Assistant architecture (can fetch live facts)

---

## 🧭 Project Structure

```
TruthLens/
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── data/
│       ├── models/
│       ├── prompts/
│       ├── routes/
│       └── services/
├── frontend/
│   └── src/
│       ├── components/
│       ├── views/
│       └── assets/
└── README.md
```

---

## ⚙️ Getting Started

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup (Vue 3)

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables

Create a `.env` file with the following:

```env
OPENAI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
```

## ✅ Features at a Glance

| Feature | Description |
|---------|-------------|
| Fake News Score | Flags unverifiable or speculative claims |
| Political Bias Detector | Detects ideological framing from text |
| Emotion & Tone Analyzer | Classifies persuasive emotional strategies |
| Translator Pro | Translates intent and tone, not just text |
| Image Forensics | Detects AI-generated or manipulated images |
| Voice + Assistant | AI assistant that speaks and reads your text in natural voice |
| Multilingual | Fully functional in 35+ languages |

## 📽 Demo Video

👉 Watch the full demo: [YouTube Link Placeholder]
👉 Live Prototype (Bolt): [Bolt.new Link Placeholder]

## 🧩 Built for the World's Largest Hackathon

TruthLens was created specifically for the World's Largest Hackathon by Bolt.
It was:

- Built with Bolt.new and includes the required badge
- Started after May 30, 2025
- Submitted within the official submission window
- Built by a single developer (no team or VC funding)
- Uses OpenAI API + Bolt + FastAPI + Vue

A project driven by purpose, not hype.

## 📄 License

MIT License

## 👨‍💻 Author

Ignacio Zúñiga Navarro
ML Engineer & Builder
GitHub: ignacioz-ai
Contact: ignacioz.ai@gmail.com 