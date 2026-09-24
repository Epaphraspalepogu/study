import { X, Check, AlertCircle, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '@/types/study';

interface WrongAnswerReviewProps {
  wrongQuestions: QuizQuestion[];
  wrongAnswers: Record<string, number>;
  onRetest: () => void;
  onBackToDashboard: () => void;
}

export function WrongAnswerReview({
  wrongQuestions,
  wrongAnswers,
  onRetest,
  onBackToDashboard,
}: WrongAnswerReviewProps) {
  if (wrongQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <Check className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No wrong answers!</h3>
        <p className="mt-2 text-sm text-slate-500">You got every question right. Well done!</p>
        <button
          onClick={onBackToDashboard}
          className="mt-6 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-rose-500" />
        <h3 className="text-lg font-bold text-slate-900">
          Wrong Answer Review ({wrongQuestions.length})
        </h3>
      </div>

      {wrongQuestions.map((q, i) => {
        const userAnswer = wrongAnswers[q.id];
        return (
          <div
            key={q.id}
            className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm"
          >
            <div className="mb-3 flex items-start gap-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                {i + 1}
              </span>
              <p className="font-semibold text-slate-900">{q.question}</p>
            </div>

            <div className="ml-8 space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-rose-100/60 px-3 py-2">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div>
                  <span className="text-xs font-medium text-rose-600">Your answer:</span>
                  <p className="text-sm text-slate-700">{q.options[userAnswer]}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-emerald-100/60 px-3 py-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <span className="text-xs font-medium text-emerald-600">Correct answer:</span>
                  <p className="text-sm text-slate-700">{q.options[q.correctAnswer]}</p>
                </div>
              </div>

              <div className="rounded-lg bg-white/60 px-3 py-2">
                <span className="text-xs font-medium text-slate-500">Explanation:</span>
                <p className="text-sm text-slate-600">{q.explanation}</p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={onRetest}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <RotateCcw className="h-4 w-4" />
          Retest Wrong Answers
        </button>
        <button
          onClick={onBackToDashboard}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
