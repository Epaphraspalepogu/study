import { z } from 'zod';

const flashcardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

const quizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
});

const studyMaterialSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  flashcards: z.array(flashcardSchema),
  quiz: z.array(quizQuestionSchema),
});

export function validateStudyMaterial(data) {
  const result = studyMaterialSchema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    };
  }

  return { valid: true, data: result.data };
}
