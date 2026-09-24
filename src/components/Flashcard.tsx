import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Flashcard } from '@/types/study';

interface FlashcardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div
      className="relative h-64 w-full cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard. ${isFlipped ? 'Answer' : 'Question'}: ${isFlipped ? card.answer : card.question}. Click to flip.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onFlip();
      }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="absolute left-4 top-4 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
            Question
          </span>
          <p className="text-lg font-semibold text-slate-900">{card.question}</p>
          <p className="absolute bottom-4 text-xs text-slate-400">Click to flip</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 text-center shadow-md"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="absolute left-4 top-4 rounded-md bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-600">
            Answer
          </span>
          <p className="text-lg font-semibold text-slate-900">{card.answer}</p>
          <p className="absolute bottom-4 flex items-center gap-1 text-xs text-slate-400">
            <RotateCcw className="h-3 w-3" /> Click to flip back
          </p>
        </div>
      </div>
    </div>
  );
}
