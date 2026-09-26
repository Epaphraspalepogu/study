import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateStudyMaterial, extractJson } from './ai.js';
import { validateStudyMaterial } from './validator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Request timeout (30 seconds)
const REQUEST_TIMEOUT_MS = 30000;

function validateRequest({ input, type, difficulty, count }) {
  if (!input || typeof input !== 'string' || !input.trim()) {
    return { valid: false, message: 'Please enter a topic or paste some notes.' };
  }

  if (input.length > 10000) {
    return { valid: false, message: 'Your notes are too long. Please shorten them and try again.' };
  }

  const validTypes = ['flashcards_quiz', 'flashcards', 'quiz'];
  if (!validTypes.includes(type)) {
    return { valid: false, message: 'Invalid content type.' };
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(difficulty)) {
    return { valid: false, message: 'Invalid difficulty.' };
  }

  const numCount = Number(count);
  if (![5, 10, 15].includes(numCount)) {
    return { valid: false, message: 'Invalid count.' };
  }

  return { valid: true };
}

app.post('/api/generate', async (req, res) => {
  // Set a timeout
  const timer = setTimeout(() => {
    res.status(504).json({ error: 'Taking longer than expected. Please try again.' });
  }, REQUEST_TIMEOUT_MS);

  try {
    const { input, type = 'flashcards_quiz', difficulty = 'medium', count = 10 } = req.body;

    const validation = validateRequest({ input, type, difficulty, count });
    if (!validation.valid) {
      clearTimeout(timer);
      return res.status(400).json({ error: validation.message });
    }

    const rawText = await generateStudyMaterial({ input, type, difficulty, count });

    if (!rawText || !rawText.trim()) {
      clearTimeout(timer);
      return res.status(422).json({ error: 'No study material was generated.' });
    }

    const jsonStr = extractJson(rawText);
    if (!jsonStr) {
      console.error('[Server] Could not extract JSON from AI response:', rawText.substring(0, 200));
      clearTimeout(timer);
      return res.status(422).json({ error: 'AI returned invalid data. Please try again.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[Server] JSON parse failed:', parseError.message);
      clearTimeout(timer);
      return res.status(422).json({ error: 'AI returned invalid data. Please try again.' });
    }

    const result = validateStudyMaterial(parsed);
    if (!result.valid) {
      console.error('[Server] Validation failed:', result.errors);
      clearTimeout(timer);
      return res.status(422).json({ error: 'The AI returned an unexpected format.' });
    }

    clearTimeout(timer);
    return res.json(result.data);
  } catch (error) {
    console.error('[Server] Error:', error.message);
    clearTimeout(timer);

    if (!res.headersSent) {
      const isConfigurationError = error.code === 'MISSING_LLM_API_KEY';
      const isProviderError = error.code === 'LLM_API_ERROR';
      return res.status(isConfigurationError || isProviderError ? 503 : 500).json({
        error: isConfigurationError
          ? error.message
          : isProviderError
            ? error.message
            : 'Something went wrong while generating your study session.',
      });
    }
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`StudyFlow AI server running on http://localhost:${PORT}`);
});
