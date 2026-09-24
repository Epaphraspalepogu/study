import { BookOpen, Lightbulb, ClipboardList, Brain } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <BookOpen className="h-8 w-8 text-blue-600" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Ready to study?</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Paste your notes or enter a topic to create your interactive study session.
      </p>

      <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-4">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <p className="text-xs font-medium text-slate-600">AI Flashcards</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-4">
          <ClipboardList className="h-6 w-6 text-blue-500" />
          <p className="text-xs font-medium text-slate-600">Interactive Quiz</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-4">
          <Brain className="h-6 w-6 text-indigo-500" />
          <p className="text-xs font-medium text-slate-600">Smart Retest</p>
        </div>
      </div>
    </div>
  );
}
