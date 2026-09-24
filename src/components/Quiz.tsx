import { useEffect, useCallback } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '@/types/study';
import { QuizQuestion as QuizQuestionComponent } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { ProgressBar } from './ProgressBar';

interface QuizProps {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedAnswers: Record<string, number>;
  completed: boolean;
  score: number;
  isRetest: boolean;
  onSelectAnswer: (questionId: string, answerIndex: number) => void;
  onNext: () => void;
  onRetake: () => void;
  onBackToDashboard: () => void;
  onReviewWrong: () => void;
  hasWrongAnswers: boolean;
}

export function Quiz({
  questions,
  currentIndex,
  selectedAnswers,
  completed,
  score,
  isRetest,
  onSelectAnswer,
  onNext,
  onRetake,
  onBackToDashboard,
  onReviewWrong,
  hasWrongAnswers,
}: QuizProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (completed) return;
      const currentQ = questions[currentIndex];
      if (!currentQ) return;
      const answered = selectedAnswers[currentQ.id] !== undefined;
      if (answered && e.key === 'Enter') {
        onNext();
      } else if (!answered && e.key >= '1' && e.key <= '4') {
        onSelectAnswer(currentQ.id, Number(e.key) - 1);
      }
    },
    [completed, questions, currentIndex, selectedAnswers, onSelectAnswer, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">No quiz questions were generated for this session.</p>
      </div>
    );
  }

  if (completed) {
    return (
      <QuizResults
        score={score}
        total={questions.length}
        onReviewWrong={onReviewWrong}
        onRetake={onRetake}
        onBackToDashboard={onBackToDashboard}
        hasWrongAnswers={hasWrongAnswers}
      />
    );
  }

  const currentQ = questions[currentIndex];
  const answered = selectedAnswers[currentQ.id] !== undefined;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="space-y-5">
      <div className="mb-1">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <QuizQuestionComponent
        question={currentQ}
        selectedAnswer={selectedAnswers[currentQ.id]}
        onSelect={(index) => onSelectAnswer(currentQ.id, index)}
        questionNumber={currentIndex + 1}
        total={questions.length}
      />

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            {isLast ? (isRetest ? 'Finish Retest' : 'See Results') : 'Next Question'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        Keyboard: Press 1-4 to answer, Enter for next
      </p>
    </div>
  );
}
