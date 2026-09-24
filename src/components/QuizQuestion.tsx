import { Check, X } from 'lucide-react';
import type { QuizQuestion } from '@/types/study';

interface QuizQuestionProps {
  question: QuizQuestion;
  selectedAnswer: number | undefined;
  onSelect: (index: number) => void;
  questionNumber: number;
  total: number;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onSelect,
  questionNumber,
  total,
}: QuizQuestionProps) {
  const answered = selectedAnswer !== undefined;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          Question {questionNumber} of {total}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900">{question.question}</h3>

      <div className="space-y-2.5">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = answered && isCorrect;
          const showIncorrect = answered && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !answered && onSelect(index)}
              disabled={answered}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all ${
                showCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : showIncorrect
                  ? 'border-rose-500 bg-rose-50 text-rose-900'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : answered
                  ? 'border-slate-200 bg-white text-slate-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    showCorrect
                      ? 'bg-emerald-500 text-white'
                      : showIncorrect
                      ? 'bg-rose-500 text-white'
                      : isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
              {showCorrect && <Check className="h-5 w-5 shrink-0 text-emerald-600" />}
              {showIncorrect && <X className="h-5 w-5 shrink-0 text-rose-600" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`rounded-xl border p-4 ${
            selectedAnswer === question.correctAnswer
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-rose-200 bg-rose-50'
          }`}
        >
          <div className="mb-1.5 flex items-center gap-2">
            {selectedAnswer === question.correctAnswer ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Correct</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-rose-600" />
                <span className="text-sm font-bold text-rose-700">Incorrect</span>
                <span className="text-sm text-slate-600">
                  — Correct answer: {String.fromCharCode(65 + question.correctAnswer)}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-slate-600">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
