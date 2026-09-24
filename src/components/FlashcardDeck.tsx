import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, CheckCircle2, ClipboardList } from 'lucide-react';
import type { Flashcard as FlashcardType } from '@/types/study';
import { Flashcard } from './Flashcard';
import { ProgressBar } from './ProgressBar';

interface FlashcardDeckProps {
  cards: FlashcardType[];
  current: number;
  isFlipped: boolean;
  completed: boolean;
  onNext: () => void;
  onPrev: () => void;
  onFlip: () => void;
  onRestart: () => void;
  onStartQuiz: () => void;
}

export function FlashcardDeck({
  cards,
  current,
  isFlipped,
  completed,
  onNext,
  onPrev,
  onFlip,
  onRestart,
  onStartQuiz,
}: FlashcardDeckProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (completed) return;
      if (e.key === ' ') {
        e.preventDefault();
        onFlip();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    },
    [completed, onFlip, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Flashcards complete!</h3>
        <p className="mt-2 text-sm text-slate-500">
          You've reviewed all {cards.length} flashcards.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onStartQuiz}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <ClipboardList className="h-4 w-4" />
            Take Quiz
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Review Again
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">No flashcards were generated for this session.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">
          Card {current + 1} of {cards.length}
        </p>
      </div>
      <ProgressBar current={current + 1} total={cards.length} />

      <Flashcard card={cards[current]} isFlipped={isFlipped} onFlip={onFlip} />

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={onFlip}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          Flip
        </button>

        <button
          onClick={onNext}
          disabled={current === cards.length - 1 && !completed}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Keyboard: Space to flip, Arrow keys to navigate
      </p>
    </div>
  );
}
