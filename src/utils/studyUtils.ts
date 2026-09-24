import type { QuizQuestion } from '@/types/study';

export function calculateScore(
  questions: QuizQuestion[],
  answers: Record<string, number>
): { correct: number; total: number; percentage: number } {
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) {
      correct++;
    }
  }
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percentage };
}

export function getWrongAnswers(
  questions: QuizQuestion[],
  answers: Record<string, number>
): QuizQuestion[] {
  return questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-emerald-600';
  if (percentage >= 50) return 'text-amber-600';
  return 'text-rose-600';
}

export function getScoreBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}
