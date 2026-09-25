import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MODEL_NAME =
  process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

const MODEL_FALLBACKS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
];

const OPENAI_MODEL_NAME =
  process.env.OPENAI_MODEL || 'gpt-4o-mini';

function buildSystemPrompt(type, difficulty, count) {
  const flashcardsRequested =
    type === 'flashcards' || type === 'flashcards_quiz';

  const quizRequested =
    type === 'quiz' || type === 'flashcards_quiz';

  const flashcardsSchema = flashcardsRequested
    ? `"flashcards": [
      {
        "id": "card-1",
        "question": "A clear, concise study question.",
        "answer": "A concise, accurate answer."
      }
    ]`
    : `"flashcards": []`;

  const quizSchema = quizRequested
    ? `"quiz": [
      {
        "id": "quiz-1",
        "question": "A clear multiple-choice question.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation of why the answer is correct."
      }
    ]`
    : `"quiz": []`;

  return `You are an educational study material generator.

Convert the user's notes or topic into accurate study material.

Return ONLY valid JSON matching this exact schema:

{
  "title": "A short descriptive title for the study topic",
  "summary": "A concise 2-3 sentence summary of the topic.",
  ${flashcardsSchema},
  ${quizSchema}
}

Rules:
- Return ONLY valid JSON. No Markdown. No code fences. No text before or after the JSON.
- Generate exactly ${count} flashcards${
    quizRequested ? ` and ${count} quiz questions` : ''
  }.
- Each quiz question must have exactly 4 options.
- correctAnswer must be a zero-based integer (0, 1, 2, or 3) representing the correct option.
- All content must be relevant to the user's input.
- Difficulty: ${difficulty}. Adjust complexity accordingly.
- All strings must be non-empty.
- Use unique, sequential ids (card-1, card-2, quiz-1, quiz-2, etc.).
- Do not include any commentary or explanation outside the JSON.`;
}

export async function generateStudyMaterial({
  input,
  type,
  difficulty,
  count,
}) {
  const geminiApiKey =
    process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;

  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (!geminiApiKey && !openAiApiKey) {
    const error = new Error(
      'Gemini API key is not configured. Add GEMINI_API_KEY or LLM_API_KEY to .env and restart the server.'
    );

    error.code = 'MISSING_LLM_API_KEY';

    throw error;
  }

  const systemPrompt = buildSystemPrompt(
    type,
    difficulty,
    count
  );

  const userPrompt = `Topic/Notes: ${input}

Generate study material following the schema exactly.`;

  if (geminiApiKey) {
    return generateWithGemini(
      systemPrompt,
      userPrompt
    );
  }

  return generateWithOpenAI(
    openAiApiKey,
    systemPrompt,
    userPrompt
  );
}

async function generateWithGemini(
  systemPrompt,
  userPrompt
) {
  const candidates = Array.from(
    new Set([MODEL_NAME, ...MODEL_FALLBACKS])
  );

  let lastError;

  for (const modelName of candidates) {
    console.log(`[AI] Trying Gemini model: ${modelName}`);

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    try {
      const result = await model.generateContent([
        systemPrompt,
        userPrompt,
      ]);

      const text = result.response.text();

      if (!text || !text.trim()) {
        return null;
      }

      console.log(
        `[AI] Successfully generated content using ${modelName}`
      );

      return text;
    } catch (error) {
      lastError = error;

      const message = error?.message || '';

      const isMissingModel =
        /404|Not Found|model.*not found|not found.*model/i.test(
          message
        );

      if (!isMissingModel) {
        console.error(
          '[AI] Gemini request failed:',
          message
        );

        const statusMatch = message.match(
          /\[(\d{3})\s+([^\]]+)\]/
        );

        const status = statusMatch
          ? statusMatch[1]
          : 'unknown status';

        const reason = statusMatch
          ? statusMatch[2]
          : 'unknown provider error';

        const providerError = new Error(
          `Gemini API request failed (${status}): ${reason}. Check the API key, enabled APIs, model access, and quota.`
        );

        providerError.code = 'LLM_API_ERROR';
        providerError.cause = error;

        throw providerError;
      }

      console.warn(
        `[AI] Model ${modelName} not available, trying fallback model.`
      );
    }
  }

  const message =
    lastError?.message ||
    'Gemini model not available.';

  console.error(
    '[AI] Gemini request failed:',
    message
  );

  const statusMatch = message.match(
    /\[(\d{3})\s+([^\]]+)\]/
  );

  const status = statusMatch
    ? statusMatch[1]
    : 'unknown status';

  const reason = statusMatch
    ? statusMatch[2]
    : 'unknown provider error';

  const providerError = new Error(
    `Gemini API request failed (${status}): ${reason}. Check the API key, enabled APIs, model access, and quota.`
  );

  providerError.code = 'LLM_API_ERROR';
  providerError.cause = lastError;

  throw providerError;
}

async function generateWithOpenAI(
  apiKey,
  systemPrompt,
  userPrompt
) {
  let response;

  try {
    response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          model: OPENAI_MODEL_NAME,
          temperature: 0.7,
          response_format: {
            type: 'json_object',
          },

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      }
    );
  } catch (error) {
    throw createProviderError(
      'OpenAI',
      'network error',
      error.message
    );
  }

  const body = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const reason =
      body.error?.message || 'request rejected';

    throw createProviderError(
      'OpenAI',
      `${response.status} ${response.statusText}`,
      reason
    );
  }

  const text =
    body.choices?.[0]?.message?.content;

  if (!text || !text.trim()) {
    return null;
  }

  return text;
}

function createProviderError(
  provider,
  status,
  reason
) {
  const error = new Error(
    `${provider} API request failed (${status}): ${reason}. Check the API key, model access, and account quota.`
  );

  error.code = 'LLM_API_ERROR';

  return error;
}

export function extractJson(rawText) {
  if (!rawText) {
    return null;
  }

  let text = rawText.trim();

  // Strip Markdown code fences if present
  const fenceMatch = text.match(
    /```(?:json)?\s*([\s\S]*?)```/
  );

  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Find the first { and last } to extract JSON object
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (
    firstBrace === -1 ||
    lastBrace === -1
  ) {
    return null;
  }

  return text.substring(
    firstBrace,
    lastBrace + 1
  );
}