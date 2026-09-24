import { BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export function Header({ onReset, showReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
            <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none text-slate-900 sm:text-lg">
              StudyFlow AI
            </h1>
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
              Turn your notes into an interactive study session
            </p>
          </div>
        </div>
        {showReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        )}
      </div>
    </header>
  );
}
