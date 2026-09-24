import { Sparkles } from 'lucide-react';
import type { ContentType, Difficulty, StudyCount } from '@/types/study';

interface PromptInputProps {
  input: string;
  setInput: (v: string) => void;
  contentType: ContentType;
  setContentType: (v: ContentType) => void;
  difficulty: Difficulty;
  setDifficulty: (v: Difficulty) => void;
  count: StudyCount;
  setCount: (v: StudyCount) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const contentOptions: { value: ContentType; label: string }[] = [
  { value: 'flashcards_quiz', label: 'Flashcards + Quiz' },
  { value: 'flashcards', label: 'Flashcards' },
  { value: 'quiz', label: 'Quiz' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const countOptions: { value: StudyCount; label: string }[] = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
];

export function PromptInput({
  input,
  setInput,
  contentType,
  setContentType,
  difficulty,
  setDifficulty,
  count,
  setCount,
  onGenerate,
  isLoading,
}: PromptInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-900">Start studying</h2>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your notes or enter a topic..."
        disabled={isLoading}
        rows={5}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
      />
      <p className="mt-2 text-xs text-slate-400">
        Try: Explain DBMS normalization, ACID properties and indexing.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Content
          </label>
          <div className="flex flex-wrap gap-2">
            {contentOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setContentType(opt.value)}
                disabled={isLoading}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                  contentType === opt.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Difficulty
            </label>
            <div className="flex gap-2">
              {difficultyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  disabled={isLoading}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                    difficulty === opt.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Number
            </label>
            <div className="flex gap-2">
              {countOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCount(opt.value)}
                  disabled={isLoading}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                    count === opt.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !input.trim()}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        <Sparkles className="h-4 w-4" />
        Generate Study Session
      </button>
    </div>
  );
}
