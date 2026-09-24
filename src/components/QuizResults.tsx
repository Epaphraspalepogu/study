import { CheckCircle2, XCircle, RotateCcw, ClipboardList, LayoutDashboard } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { getScoreColor, getScoreBgColor } from '@/utils/studyUtils';

interface QuizResultsProps {
  score: number;
  total: number;
  onReviewWrong: () => void;
  onRetake: () => void;
  onBackToDashboard: () => void;
  hasWrongAnswers: boolean;
}

export function QuizResults({
  score,
  total,
  onReviewWrong,
  onRetake,
  onBackToDashboard,
  hasWrongAnswers,
}: QuizResultsProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">Quiz Complete</h3>

      <div className="my-6 flex flex-col items-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={getScoreColor(percentage)}
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-3xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</span>
            <span className="text-sm text-slate-500">{score} / {total}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex w-full max-w-xs gap-3">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">Correct: {score}</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 py-3">
          <XCircle className="h-5 w-5 text-rose-600" />
          <span className="text-sm font-semibold text-rose-700">Incorrect: {total - score}</span>
        </div>
      </div>

      <ProgressBar current={score} total={total} />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasWrongAnswers && (
          <button
            onClick={onReviewWrong}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <ClipboardList className="h-4 w-4" />
            Review Wrong Answers
          </button>
        )}
        <button
          onClick={onRetake}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </button>
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
        >
          <LayoutDashboard className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
