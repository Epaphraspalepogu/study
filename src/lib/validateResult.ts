import type { StudyMaterial } from '@/types/study';

export interface ValidationResult {
  valid: boolean;
  data?: StudyMaterial;
  error?: string;
}

export function validateStudyMaterial(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'The AI returned an unexpected format.' };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== 'string' || !obj.title.trim()) {
    return { valid: false, error: 'The AI returned an unexpected format.' };
  }

  if (typeof obj.summary !== 'string' || !obj.summary.trim()) {
    return { valid: false, error: 'The AI returned an unexpected format.' };
  }

  if (!Array.isArray(obj.flashcards)) {
    return { valid: false, error: 'The AI returned an unexpected format.' };
  }

  if (!Array.isArray(obj.quiz)) {
    return { valid: false, error: 'The AI returned an unexpected format.' };
  }

  for (const card of obj.flashcards) {
    if (
      !card ||
      typeof card.id !== 'string' || !card.id.trim() ||
      typeof card.question !== 'string' || !card.question.trim() ||
      typeof card.answer !== 'string' || !card.answer.trim()
    ) {
      return { valid: false, error: 'The AI returned an unexpected format.' };
    }
  }

  for (const q of obj.quiz) {
    if (
      !q ||
      typeof q.id !== 'string' || !q.id.trim() ||
      typeof q.question !== 'string' || !q.question.trim() ||
      !Array.isArray(q.options) || q.options.length !== 4 ||
      typeof q.correctAnswer !== 'number' ||
      q.correctAnswer < 0 || q.correctAnswer >= q.options.length ||
      typeof q.explanation !== 'string' || !q.explanation.trim()
    ) {
      return { valid: false, error: 'The AI returned an unexpected format.' };
    }

    for (const opt of q.options) {
      if (typeof opt !== 'string' || !opt.trim()) {
        return { valid: false, error: 'The AI returned an unexpected format.' };
      }
    }
  }

  return {
    valid: true,
    data: {
      title: obj.title,
      summary: obj.summary,
      flashcards: obj.flashcards as StudyMaterial['flashcards'],
      quiz: obj.quiz as StudyMaterial['quiz'],
    },
  };
}
