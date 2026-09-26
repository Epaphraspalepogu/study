# StudyFlow AI

Turn your notes into an interactive study session.

StudyFlow AI is a study assistant that accepts a topic or pasted notes, sends them to a backend API, requests structured JSON from Gemini, validates that response, and renders the result into interactive flashcards and quiz content.

This project was built for the FLAM Frontend Internship Assignment.

## Overview

This app is not a chatbot. It follows a structured AI pipeline:

1. The user enters a topic or notes in the frontend textarea.
2. The frontend sends the request to the backend route `/api/generate`.
3. The backend validates the request and builds a strict JSON schema prompt.
4. The backend calls the Gemini API on the server.
5. The backend extracts and parses the JSON response.
6. The backend validates the shape with Zod.
7. The frontend performs a defensive validation before rendering.
8. The app stores the result in React state and renders interactive flashcards and quiz UI.

At no point is raw AI text shown as a chat transcript.

## Features

- AI-generated flashcards with flip interaction and navigation
- AI-generated quiz questions with four answer options
- Score tracking and quiz completion flow
- Wrong-answer review and retesting of missed questions
- Structured JSON validation on the backend and frontend
- Loading, empty, and error states
- Stale-response protection using request IDs and AbortController
- Responsive UI for desktop and mobile widths

## Project architecture

- Frontend: React + Vite
- Backend: Express server in `server/server.js`
- AI provider: `server/ai.js`
- Validation: `server/validator.js`
- Frontend API client: `src/lib/api.ts`
- Frontend validation: `src/lib/validateResult.ts`
- State management: `src/hooks/useStudySession.ts`

## Setup

### Prerequisites

- Node.js 18+
- A Gemini API key from Google AI Studio

### Install

```bash
npm install
```

### Configure environment

Create a `.env` file in the project root and add your API key:

```env
GEMINI_API_KEY=your_api_key_here
# or
LLM_API_KEY=your_api_key_here

PORT=3001
```

The key is kept server-side. The frontend does not access it directly.

### Run the app

```bash
npm run dev
```

This starts:
- Express backend on `http://localhost:3001`
- Vite frontend on `http://localhost:5173`

You can also run the backend separately:

```bash
npm run server
```

### Deploy to Vercel

Deploy the repository with the Vite framework preset and `dist` as the output directory. Vercel deploys `api/generate.js` and `api/health.js` as serverless functions; the local Vite proxy is used only by `npm run dev`.

Add `LLM_API_KEY` in the Vercel project environment variables for each environment you deploy. `GEMINI_API_KEY` is also supported, and takes precedence if both are set. Keep either key server-side and do not add it to a `VITE_` variable.

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `GEMINI_API_KEY` | Gemini API key | Yes |
| `LLM_API_KEY` | Alternate supported key name | Yes if `GEMINI_API_KEY` is not used |
| `PORT` | Backend port | No |
| `GEMINI_MODEL` | Optional override for Gemini model name | No |

## AI usage note

AI coding assistants were used during development for brainstorming, implementation support, debugging, and documentation. The generated code was reviewed and understood before being included in the project. The app uses Google Gemini to generate structured study material in JSON format.

## Validation and error handling

The app validates both the incoming request and the returned AI data:

- Empty or whitespace-only input is rejected.
- Invalid difficulty or count values are rejected.
- The backend checks for malformed JSON and empty output.
- Zod validates the result schema before returning data.
- The frontend validates again before rendering.
- Slow and failed requests show visible error states.
- Older requests are ignored if a newer request resolves later.

## Known limitations

- Requires a valid Gemini API key and internet access.
- AI output can still contain factual inaccuracies.
- There is no persistent session storage across page refreshes.
- The quality of generated flashcards and quiz questions depends on the input quality.

## Project structure

```text
project/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
├── server/
│   ├── ai.js
│   ├── server.js
│   └── validator.js
├── .gitignore
├── package.json
├── README.md
├── vite-plugin-api-proxy.js
├── vite.config.ts
└── .env
```

## Notes

- The frontend calls `/api/generate`; it does not directly call the Gemini API.
- The backend builds a strict JSON schema prompt to reduce malformed output.
- Flashcards and quizzes are rendered from parsed, validated data rather than raw AI text.
