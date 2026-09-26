# StudyFlow AI

Turn your notes into an interactive study session.

StudyFlow AI is a React study assistant that accepts a topic or pasted notes and turns them into structured flashcards and quiz questions. The backend requests JSON from Gemini (or the supported OpenAI fallback), parses and validates the response, then returns validated study material to the frontend.

This project was built for the FLAM Frontend Internship Assignment.

## Project Overview

This app is not a chatbot. It follows a structured generation pipeline:

1. The user enters a topic or notes and chooses content type, difficulty, and item count.
2. The frontend sends a JSON request to the relative `/api/generate` endpoint.
3. Locally, the Vite development proxy forwards the request to Express. On Vercel, `api/generate.js` handles the request as a serverless function.
4. Both routes use `server/api-handlers.js` to validate the request, call `server/ai.js`, extract and parse the provider response, and validate it through `server/validator.js`.
5. The frontend validates the returned object again before storing it in React state and rendering the study session.

Raw AI text is not displayed as a chat transcript.

## Features

- AI-generated flashcards with flip interaction and navigation
- AI-generated quiz questions with four answer options
- Answer feedback, score tracking, and quiz completion results
- Wrong-answer review and retesting of missed questions
- Structured response validation on the backend and frontend
- Loading, empty, and error states
- Stale-response protection using request IDs and AbortController
- Responsive UI for desktop and mobile widths

## How It Works

- Frontend: React, Vite, and TypeScript; session state is managed by `src/hooks/useStudySession.ts`.
- Frontend API client: `src/lib/api.ts` posts to `/api/generate`; it never calls an AI provider directly.
- Local backend: `server/server.js` runs Express on port 3001 by default. During `npm run dev`, `vite-plugin-api-proxy.js` forwards local `/api` requests to Express.
- Vercel backend: `api/generate.js` and `api/health.js` are serverless entry points that reuse `server/api-handlers.js`; they do not start the local Express listener.
- AI provider logic: `server/ai.js` uses Gemini when a Gemini key is configured. If neither Gemini key is set, it can use the supported OpenAI fallback.
- Validation: `server/validator.js` validates provider results with Zod, and `src/lib/validateResult.ts` checks the response again before the UI uses it.

## Setup

### Prerequisites

- Node.js 18 or later
- A supported provider API key: Gemini, or OpenAI if using the fallback

### Install

```bash
npm install
```

### Configure Local Environment

Create a private `.env` file in the project root. Use the provider key that matches your setup. All values below are placeholders, not real credentials:

```env
LLM_API_KEY=your_api_key_here
# Or use GEMINI_API_KEY instead of LLM_API_KEY; it takes precedence if both are set.
# GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=your_gemini_model_name

# Alternatively, configure OpenAI and leave both Gemini key variables unset.
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=your_openai_model_name

# Optional; used only by the local Express server.
PORT=3001
```

API keys are server-side only. Do not use a `VITE_` variable for an LLM key, put a key in frontend code, or commit a real key to GitHub. `.env` is local/private and ignored by Git. `.env.example` contains placeholders only.

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `LLM_API_KEY` | Gemini API key using the alternate supported name; recommended for Vercel | Required for Gemini if `GEMINI_API_KEY` is not set |
| `GEMINI_API_KEY` | Gemini API key; takes precedence over `LLM_API_KEY` | Required for Gemini if `LLM_API_KEY` is not set |
| `GEMINI_MODEL` | Optional Gemini model override | No |
| `OPENAI_API_KEY` | OpenAI API key, used only when neither Gemini key is set | Required only when using the OpenAI fallback |
| `OPENAI_MODEL` | Optional OpenAI model override | No |
| `PORT` | Local Express server port; defaults to 3001 | No; local development only |

## Usage

Start the complete local app with the `dev` script:

```bash
npm run dev
```

This runs the Express backend on port 3001 by default and the Vite frontend on port 5173 by default. Open the Vite URL printed in the terminal. The Vite development proxy sends `/api` requests to the local Express backend.

To run only the backend, use the `server` script in a terminal:

```bash
npm run server
```

To create a production frontend build, use:

```bash
npm run build
```

For a local production preview after building, use `npm run preview`. This project does not define an `npm start` script.

In the app, enter notes or a topic, choose the content type, difficulty, and number of items, then generate a session. Flip and navigate flashcards, answer quiz questions to see feedback and explanations, view the score, and review or retest wrong answers.

## Error Handling

- Empty input, excessive input length, invalid content type, difficulty, or count is rejected before provider access.
- Empty AI output, malformed JSON, and schema-invalid output produce explicit API errors instead of being rendered.
- The backend applies a 30-second request timeout. The frontend applies a 45-second abort timeout and presents timeout, network, and API errors in the error state.
- Provider failures are returned as server errors with a useful provider message where available.
- The frontend validates successful responses before the study hook stores them.
- Request IDs and AbortController prevent an older generation request from replacing the result of a newer generation request.
- Retry is available for retryable failures; malformed results can also offer input editing.

## AI Usage Note

AI coding assistants were used during development for brainstorming, implementation support, debugging, and documentation. The implementation was reviewed and understood before being included. The app uses server-side provider APIs to generate structured study material.

## Known Limitations

- Generating study material requires a valid Gemini or OpenAI API key and internet access.
- AI output can still contain factual inaccuracies.
- Study sessions are held in React state and are not persisted across page refreshes.
- The quality of generated flashcards and quiz questions depends on the input quality.

## Project Structure

```text
project/
├── api/
│   ├── generate.js
│   └── health.js
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── Flashcard.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── PromptInput.tsx
│   │   ├── Quiz.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── QuizResults.tsx
│   │   ├── StatsCards.tsx
│   │   ├── StudyDashboard.tsx
│   │   ├── SummaryCard.tsx
│   │   └── WrongAnswerReview.tsx
│   ├── hooks/
│   │   └── useStudySession.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── validateResult.ts
│   ├── types/
│   │   └── study.ts
│   └── utils/
│       └── studyUtils.ts
├── server/
│   ├── ai.js
│   ├── api-handlers.js
│   ├── server.js
│   └── validator.js
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite-plugin-api-proxy.js
├── vite.config.ts
└── .env (local/private; not committed)
```

## Vercel Deployment

The production request flow is:

```text
Frontend
  -> /api/generate
  -> api/generate.js
  -> server/api-handlers.js
  -> server/ai.js
  -> Gemini
```

Vercel discovers `api/generate.js` and `api/health.js` as serverless functions. The local Express server and its `app.listen()` call are retained for development; Vercel does not need that server or a `PORT` environment variable. The frontend uses the same relative `/api/generate` endpoint in both environments, and the local Vite proxy is not the production backend.

To configure Vercel:

1. Import the repository and keep the project root as the root directory.
2. Select the Vite framework preset, use `npm run build` as the build command, and set `dist` as the output directory.
3. Add `LLM_API_KEY` as a server-side environment variable for each Vercel environment you use. `GEMINI_API_KEY` is also supported; if both Gemini keys are set, `GEMINI_API_KEY` takes precedence.
4. Do not add provider keys to Vite/frontend variables. Vercel manages the serverless runtime; do not configure `PORT` for the API functions.

The API functions share local request validation, AI generation, JSON extraction and parsing, response validation, timeout, and error handling through `server/api-handlers.js`.

## Time Spent

Approximately 8 hours.