# StudyFlow AI

**Turn your notes into an interactive study session.**

StudyFlow AI is an interactive study assistant that takes your free-form notes or a topic, sends them to a backend that calls the Gemini LLM, receives structured JSON, validates it, and renders it into interactive flashcards, quizzes, wrong-answer review, and retesting — all in a clean, modern UI.

Built for the **Flam Frontend Internship Assignment**.

---

## Overview

This is **not a chatbot**. The application uses a structured AI pipeline:

1. The user enters notes or a topic.
2. The frontend sends the input to a backend API route.
3. The backend constructs a system prompt requesting strict JSON output.
4. The backend calls the Gemini LLM API.
5. The backend extracts and parses the JSON.
6. The backend validates the structure using Zod.
7. The validated JSON is returned to the frontend.
8. The frontend re-validates the response defensively.
9. The validated data is rendered into interactive React components.

At no point is raw AI text rendered to the user.

---

## Features

- **AI-generated flashcards** with flip animation, keyboard navigation, and progress tracking
- **AI-generated quizzes** with multiple-choice questions, instant feedback, and explanations
- **Quiz scoring** with a visual progress ring and percentage
- **Wrong-answer review** showing your answer vs. the correct answer with explanations
- **Retesting** — re-answer only the questions you got wrong
- **Structured AI output** — JSON schema enforced on both backend and frontend
- **Defensive validation** — Zod on the backend, manual validation on the frontend
- **Comprehensive error handling** — malformed JSON, wrong shape, empty response, API failure, timeout, network errors
- **Stale request protection** — request IDs + AbortController prevent older responses from overwriting newer ones
- **Responsive UI** — works on mobile, tablet, and desktop
- **Accessibility** — semantic HTML, keyboard navigation, ARIA labels, visible focus states
- **Loading, error, and empty states** — every state is handled

---

## Architecture

```
React Frontend (Vite)
       │
       ▼
   /api/generate  (Vite dev proxy → Express backend)
       │
       ▼
  Express Server (server/server.js)
       │
       ├── Validates request
       ├── Builds system prompt (server/ai.js)
       ├── Calls Gemini LLM API
       ├── Extracts JSON from response
       ├── Parses JSON
       ├── Validates with Zod (server/validator.js)
       └── Returns validated JSON
       │
       ▼
  Frontend receives JSON
       │
       ├── Re-validates with validateResult.ts
       ├── Stores in React state via useStudySession hook
       └── Renders interactive components
```

### Key Design Decisions

- **API key is server-side only** — the Gemini API key lives in `.env` on the backend. The frontend never sees it.
- **Double validation** — the backend validates with Zod; the frontend validates again defensively. Neither trusts the other.
- **Stale request protection** — a `useRef` counter tracks the latest request ID. When a response arrives, if its ID doesn't match the current counter, it's discarded. An `AbortController` also cancels in-flight requests when a new one starts.
- **AI provider is isolated** — all Gemini-specific code is in `server/ai.js`. Swapping to another provider (OpenAI, Anthropic) only requires changing that file.

---

## Project Structure

```
studyflow-ai/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── PromptInput.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── StudyDashboard.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── StatsCards.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── Flashcard.tsx
│   │   ├── Quiz.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── QuizResults.tsx
│   │   ├── WrongAnswerReview.tsx
│   │   └── ProgressBar.tsx
│   ├── hooks/
│   │   └── useStudySession.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── validateResult.ts
│   ├── types/
│   │   └── study.ts
│   ├── utils/
│   │   └── studyUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   ├── server.js
│   ├── ai.js
│   └── validator.js
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── vite.config.ts
└── vite-plugin-api-proxy.js
```

---

## Setup

### Prerequisites

- Node.js 18+
- A Gemini API key (get one free at https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env

# 3. Add your Gemini API key to .env
# Edit .env and replace your_api_key_here with your actual key

# 4. Start both the backend and frontend
npm run dev
```

This starts:
- The Express backend on `http://localhost:3001`
- The Vite dev server on `http://localhost:5173` (with API proxying to the backend)

Open `http://localhost:5173` in your browser.

### Running backend separately (optional)

```bash
npm run server    # Starts only the Express backend
npm run dev       # Starts both backend and frontend concurrently
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `LLM_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Backend server port (defaults to 3001) | No |

---

## Error Handling

The application handles every failure mode explicitly:

| Scenario | Detection | User Message |
|---|---|---|
| **Empty input** | Frontend validation | "Please enter a topic or paste some notes." |
| **Input too long** | Frontend + backend validation | "Your notes are too long. Please shorten them and try again." |
| **Malformed JSON** | `JSON.parse` fails on backend | "AI returned invalid data. Please try again." |
| **Wrong JSON shape** | Zod validation fails on backend | "The AI returned an unexpected format." |
| **Wrong shape (frontend)** | `validateResult.ts` check fails | "The AI returned an unexpected format." |
| **Empty AI response** | Backend checks for empty text | "No study material was generated." |
| **API failure** | HTTP error from backend | "Something went wrong while generating your study session." |
| **Timeout** | AbortController after 45s | "Taking longer than expected. Please try again." |
| **Network error** | fetch() throws | "Something went wrong while generating your study session." |
| **Stale response** | Request ID mismatch | (Silently discarded — newer response wins) |

Each error state offers appropriate actions: Retry, Edit Input, or both.

---

## AI Usage

AI coding assistants were used during development for brainstorming, implementation assistance, debugging, and documentation. All generated code was reviewed and understood before inclusion. The AI-generated study content uses the Google Gemini API (`gemini-1.5-flash` model) with structured JSON output mode.

---

## Known Limitations

- Requires a valid Gemini API key and internet connection.
- AI-generated content may occasionally contain inaccuracies — always verify important information.
- The free tier of the Gemini API has rate limits.
- No session persistence — refreshing the page clears the current study session.
- Flashcard and quiz content quality depends on the input quality.

---

## Time Spent

Time spent: approximately 8 hours.

---

## Future Improvements

- **Save sessions** — persist study sessions to localStorage or a database
- **Dark mode** — theme toggle for night studying
- **Streaming responses** — show content as it's generated
- **Authentication** — user accounts to track progress over time
- **More study modes** — matching, fill-in-the-blank, true/false
- **Spaced repetition** — schedule cards based on difficulty
- **Export** — download flashcards as PDF or Anki deck
- **Regenerate wrong questions** — ask AI for new questions on missed topics
