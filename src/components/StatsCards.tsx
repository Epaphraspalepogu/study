import { Layers, ClipboardList, Gauge } from 'lucide-react';
import type { StudyMaterial, Difficulty } from '@/types/study';

interface StatsCardsProps {
  data: StudyMaterial;
  difficulty: Difficulty;
}

export function StatsCards({ data, difficulty }: StatsCardsProps) {
  const stats = [
    {
      icon: Layers,
      label: 'Flashcards',
      value: data.flashcards.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: ClipboardList,
      label: 'Quiz Questions',
      value: data.quiz.length,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Gauge,
      label: 'Difficulty',
      value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="truncate text-lg font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
