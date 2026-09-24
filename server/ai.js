import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '');

const MODEL_NAME = 'gemini-1.5-flash';

function buildSystemPrompt(type, difficulty, count) {
  const flashcardsRequested = type === 'flashcards' || type === 'flashcards_quiz';
  const quizRequested = type === 'quiz' || type === 'flashcards_quiz';

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
- Generate exactly ${count} flashcards${quizRequested ? ` and ${count} quiz questions` : ''}.
- Each quiz question must have exactly 4 options.
- correctAnswer must be a zero-based integer (0, 1, 2, or 3) representing the correct option.
- All content must be relevant to the user's input.
- Difficulty: ${difficulty}. Adjust complexity accordingly.
- All strings must be non-empty.
- Use unique, sequential ids (card-1, card-2, quiz-1, quiz-2, etc.).
- Do not include any commentary or explanation outside the JSON.`;
}

export async function generateStudyMaterial({ input, type, difficulty, count }) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  const systemPrompt = buildSystemPrompt(type, difficulty, count);
  const userPrompt = `Topic/Notes: ${input}\n\nGenerate study material following the schema exactly.`;

  const result = await model.generateContent([systemPrompt, userPrompt]);
  const text = result.response.text();

  if (!text || !text.trim()) {
    return null;
  }

  return text;
}

export function extractJson(rawText) {
  if (!rawText) return null;

  let text = rawText.trim();

  // Strip Markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Find the first { and last } to extract JSON object
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  return text.substring(firstBrace, lastBrace + 1);
}
