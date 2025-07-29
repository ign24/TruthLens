<p align="center">
  <img src="https://img.shields.io/badge/Built%20with-Bolt.new-blueviolet?logo=bolt" alt="Built with Bolt.new" />
  <img src="https://img.shields.io/badge/Voice%20AI-ElevenLabs-critical?logo=elevenlabs" alt="Voice AI with ElevenLabs" />
  <img src="https://img.shields.io/badge/Startup%20Infra-Supabase-3ECF8E?logo=supabase" alt="Startup Challenge Supabase" />
  <img src="https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify" alt="Deploy Challenge Netlify" />
</p>

# TruthLens

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend: Vue.js](https://img.shields.io/badge/Frontend-Vue.js-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Powered by: OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-4A90E2?logo=openai)](https://openai.com/)

> Built for the World's Largest Hackathon presented by Bolt — Empowering minds, not manipulating them.

---

## Submission Highlights

- **Project Name:** TruthLens  
- **Built with Bolt.new:** Yes (initial prototype and UI flows built on Bolt)  
- **Public Demo:** [truthlensai.netlify.app](https://truthlensai.netlify.app)  
- **Bolt Project URL:** [bolt.new/~/truthlens](https://bolt.new/~/truthlens)  
- **Video Demo:** [YouTube link](https://youtube.com/yourlink)  
- **Email used in Bolt.new:** ignacio_zu@outlook.com  
- **Region:** AMER  
- **Challenges Applied To:**  
  - Voice AI Challenge (ElevenLabs integration)  
  - Deploy Challenge (Netlify full-stack deployment)  
  - Startup Challenge (Supabase backend and scalability)  
  - Inspirational Story (solo founder, purpose-driven)  
  - Most Viral Project (UI/UX for shareability and impact)  
  - Future Unicorn

---

## Vision and Motivation

In a world where information is abundant but trust is scarce, TruthLens was conceived to restore agency and critical thinking to every digital citizen. The platform is designed not to filter or censor, but to illuminate the hidden layers of language, imagery, and intent that shape our perception of reality. TruthLens is a transparency engine for the age of AI-driven media.

---

## What is TruthLens?

TruthLens is a full-stack AI platform that analyzes news and public content for bias, emotional manipulation, misinformation risk, and synthetic media traces. It empowers users to question, verify, and understand—not just consume—the information that shapes their world.

TruthLens doesn't follow the headlines. It questions them.

---

## What Makes TruthLens Unique?

TruthLens introduces a novel hybrid approach to image authenticity analysis by combining:

- FFT-based spectral analysis to uncover high-frequency artifacts
- Metadata extraction (EXIF, compression signatures, inconsistencies)
- Symbolic reasoning via GPT‑4, prompted with structured descriptors derived from visual and forensic input

Unlike prior work that relies solely on learned classifiers, TruthLens emphasizes interpretable, modular, and transparent detection, empowering users to understand why a piece of content may be suspect—not just labeling it as fake or real.

This approach is inspired by recent advances in deepfake detection and multimodal LLM reasoning, but extends them in a unique, integrative way not yet present in the literature.

---

## References & Theoretical Foundation

TruthLens was conceptually inspired by—but does not replicate—the following works:

- Tan et al. (2024) — Frequency-Aware Deepfake Detection via FFT ([arXiv:2403.07240](https://arxiv.org/abs/2403.07240))
  Motivated the use of high-frequency spectrum analysis in image forensics.
- Ren et al. (2025) — Can Multimodal LLMs Work as Deepfake Detectors? ([arXiv:2503.20084](https://arxiv.org/abs/2503.20084))
  Inspired the idea of prompting LLMs with multimodal cues for interpretability.
- Chakraborty et al. (2025) — TruthLens: A Training-Free Paradigm for DeepFake Detection ([arXiv:2503.15342](https://arxiv.org/abs/2503.15342))
  Shares name and general vision of explainable detection, but uses a different pipeline (ours integrates FFT, EXIF and GPT‑4 prompting with symbolic inputs).

---

## Why TruthLens for the Hackathon?

TruthLens was created entirely after May 30, 2025, for the Bolt hackathon, with the following structure:

| Requirement                | Met |
|----------------------------|-----|
| Uses Bolt.new?             | Yes |
| Includes Bolt badge?       | Yes |
| Deployed & Publicly Available? | Yes |
| Video demo?                | Yes |
| Uses AI + Voice?           | Yes |
| Supports Scaling?          | Yes (Supabase backend) |
| Solo Builder?              | Yes |
| Purpose-driven story?      | Yes |

---

## Quick Links

| Section    | Link |
|------------|------|
| Live App   | [truthlensai.netlify.app](https://truthlensai.netlify.app) |
| Bolt Project | [bolt.new/~/truthlens](https://bolt.new/~/truthlens) |
| Demo Video | [YouTube](https://youtube.com/yourlink) |

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Folder Structure](#architecture--folder-structure)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [Security](#security)
6. [Setup & Installation](#setup--installation)
    - [Backend](#backend)
    - [Frontend](#frontend)
7. [Configuration](#configuration)
8. [Main Flows](#main-flows)
9. [Development Best Practices](#development-best-practices)
10. [Testing](#testing)
11. [Contributing](#contributing)
12. [Deployment & Production](#deployment--production)
13. [References](#references)
14. [License](#license)
15. [Author](#author)

---

## Project Overview

TruthLens is a professional-grade, AI-powered platform designed to empower critical thinking in the digital age. It analyzes news, articles, and public content through multiple advanced lenses—detecting political bias, emotional manipulation, misinformation risk, and synthetic media traces. TruthLens is not a censorship tool, but a transparency and awareness engine for the modern reader.

---

## Architecture & Folder Structure

```
TruthLens/
  backend/         # FastAPI backend (API, analysis, translation, image/voice, storage)
    app/
      api/         # API route definitions
      core/        # Core config and settings
      models/      # Pydantic schemas
      prompts/     # Prompt templates for AI
      routes/      # Additional route handlers
      services/    # Service layer (OpenAI, storage, cache, etc.)
      utils/       # Utility functions
      websockets/  # WebSocket handlers (voice)
      tests/       # Backend tests
    main.py        # Backend entry point
    requirements.txt
    .env           # Backend environment variables
  frontend/        # Vue 3 + Vite + TypeScript frontend
    src/
      components/  # Vue UI components
      composables/ # Vue composables (logic)
      config/      # Centralized config (API, env, chat, etc.)
      views/       # Page views
      assets/      # Static assets
    public/        # Static public files
    package.json   # Frontend dependencies & scripts
    .env           # Frontend environment variables
  README.md        # (This file)
```

---

## Key Features

| Feature                 | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| Fake News Score         | Estimates the presence of speculative or unverified claims.              |
| Political Bias Detection| Identifies ideological framing (left / right / neutral).                 |
| Emotional Language Analysis | Highlights manipulative or emotionally charged wording.              |
| AI-Generated Text Detection | Assesses whether the writing was produced by an LLM.                 |
| Image Forensics         | Detects AI-generated or manipulated visual content.                      |
| Translator Pro          | Translates tone, style, and intent—not just words—across 30+ languages.  |
| TruthLens Assistant     | A multilingual, RAG-powered assistant that reads documents and answers questions. |

---

## Tech Stack

| Area          | Technologies                                                                  |
| ------------- | ----------------------------------------------------------------------------- |
| Frontend      | Vue 3 (Composition API), Vite, Tailwind CSS, TypeScript                       |
| Backend       | FastAPI, Python 3.10+, Pydantic, Uvicorn, Supabase                            |
| AI & APIs     | OpenAI GPT-4, ElevenLabs (Voice Synthesis), Serper (Web Search)               |
| Deployment    | Netlify (Frontend), Railway (Backend)                                         |

---

## Security

TruthLens implements robust security measures:
- CORS Policy: Backend only accepts requests from trusted domains.
- Rate Limiting: API is protected against abuse and DoS attacks.
- Secret Management: All API keys are loaded via environment variables and never exposed in code.
- Production Hardening: API documentation endpoints are disabled in production.
- Input Validation: All user input is validated and sanitized.

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/ignacioz-ai/TruthLens
cd TruthLens
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Variables
Create a `.env` file inside the `backend` directory. Git is configured to ignore this file, so your keys will remain private.

`backend/.env`:
```env
OPENAI_API_KEY="your_openai_key_here"
SERPER_API_KEY="your_serper_key_here"
ELEVENLABS_API_KEY="your_elevenlabs_key_here"
```

### 5. Run the Application
You'll need two separate terminals.

- Terminal 1: Run the Backend
  ```bash
  # From the 'backend' directory
  uvicorn main:app --reload
  ```
- Terminal 2: Run the Frontend
  ```bash
  # From the 'frontend' directory
  npm run dev
  ```
The application should now be available at `http://localhost:5173`.

---

## Configuration

- Backend: All settings are managed via environment variables (see `.env`). Key variables: `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `SERPER_API_KEY`, etc. Use `.env` for local development. Never commit secrets.
- Frontend: Centralized config for API URLs, environment, chat settings, etc. Uses `VITE_` prefixed variables in `.env`.

---

## Main Flows

1. **Text Analysis**: Analyze articles for bias, emotional tone, credibility, and factual consistency. Uses OpenAI models and DOCA criteria for structured reports.
2. **Image Analysis**: Upload images to detect AI-generation, deepfakes, and manipulation. Provides confidence scores and breakdowns.
3. **Translator Pro**: Translate with context and tone preservation. Multiple translation styles (literal, idiomatic, technical, etc.).
4. **ChatBot & Voice Assistant**: Chat with "Clara" for fact-checking, bias detection, and source verification. Voice chat powered by ElevenLabs and OpenAI.

---

## Development Best Practices

- Centralize configuration: Use the config modules for all environment and API settings.
- Type safety: Use TypeScript (frontend) and Pydantic (backend) for all data models.
- Separation of concerns: Keep logic in services/composables, UI in components/views.
- Error handling: Use global exception handlers (see `main.py`) and user-friendly frontend messages.
- Rate limiting: Enabled via SlowAPI to prevent abuse.
- Security: Never expose secrets. Use CORS and validate all inputs.
- Testing: Place backend tests in `backend/app/tests/`. Use composables and unit tests for frontend logic.
- Documentation: Update this README and inline docstrings/comments for all major changes.

---

## Testing

- Backend: Use pytest or unittest. Place tests in `backend/app/tests/`.
- Frontend: Use Vue Test Utils and Jest/Vitest for components and composables.

---

## Contributing

1. Fork the repo and create a feature branch.
2. Follow code style and commit message conventions.
3. Add/Update tests for new features.
4. Submit a pull request with a clear description.

---

## Deployment & Production

- Production: Set `ENV=production` and use secure, production-ready values in `.env`.
- API keys: Use environment variables and secret managers in deployment.
- CORS: Restrict origins in production.
- Static files: Served via backend for audio and analysis results.
- Deployment: Can be deployed on any cloud supporting Python and Node.js (e.g., Railway, Netlify, Vercel).

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [OpenAI API](https://platform.openai.com/docs/)
- [ElevenLabs API](https://docs.elevenlabs.io/)
- [Supabase](https://supabase.com/docs)

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Author

**Ignacio Zúñiga Navarro**  
ML Engineer & AI Builder  
GitHub: [ignacioz-ai](https://github.com/ign24)  
Contact: ignacio_zu@outlook.com
