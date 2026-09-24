import { FileText } from 'lucide-react';
import type { StudyMaterial } from '@/types/study';

interface SummaryCardProps {
  data: StudyMaterial;
}

export function SummaryCard({ data }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Summary</h3>
      </div>
      <h4 className="mb-3 text-xl font-bold text-slate-900">{data.title}</h4>
      <p className="text-sm leading-relaxed text-slate-600">{data.summary}</p>
    </div>
  );
}
