import { AlertCircle, RefreshCw, Pencil } from 'lucide-react';
import type { AppError } from '@/types/study';

interface ErrorStateProps {
  error: AppError;
  onRetry?: () => void;
  onEdit?: () => void;
}

export function ErrorState({ error, onRetry, onEdit }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">
        <AlertCircle className="h-7 w-7 text-rose-600" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-600">{error.message}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {error.canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
        {error.canEdit && onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Input
          </button>
        )}
      </div>
    </div>
  );
}
