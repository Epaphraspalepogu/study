import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <div className="relative mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-2 animate-ping rounded-2xl bg-blue-100 opacity-20" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">Creating your study session...</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        AI is preparing your flashcards and quiz.
      </p>
      <div className="mt-6 flex items-center gap-1.5">
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
      </div>
    </div>
  );
}
