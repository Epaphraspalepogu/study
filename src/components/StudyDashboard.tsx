import { Lightbulb, Layers, ClipboardList, Brain, ArrowRight } from 'lucide-react';
import type { StudyMaterial, Difficulty, TabKey } from '@/types/study';
import { SummaryCard } from './SummaryCard';
import { StatsCards } from './StatsCards';

interface StudyDashboardProps {
  data: StudyMaterial;
  difficulty: Difficulty;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  children: React.ReactNode;
}

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: Lightbulb },
  { key: 'flashcards', label: 'Flashcards', icon: Layers },
  { key: 'quiz', label: 'Quiz', icon: ClipboardList },
  { key: 'review', label: 'Review', icon: Brain },
];

export function StudyDashboard({
  data,
  difficulty,
  activeTab,
  onTabChange,
  onStartFlashcards,
  onStartQuiz,
  children,
}: StudyDashboardProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Study Session</h2>
          <p className="mt-0.5 text-sm text-slate-500">{data.title}</p>
        </div>
      </div>

      <StatsCards data={data} difficulty={difficulty} />

      {/* Navigation tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <SummaryCard data={data} />

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                How to use this session
              </h3>
              <ol className="space-y-3">
                {[
                  'Review flashcards to learn the material.',
                  'Take the quiz to test your knowledge.',
                  'Review any mistakes you made.',
                  'Retest yourself on wrong answers.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-sm text-slate-700">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={onStartFlashcards}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  <Layers className="h-4 w-4" />
                  Start Flashcards
                </button>
                <button
                  onClick={onStartQuiz}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <ClipboardList className="h-4 w-4" />
                  Start Quiz
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && children}
      </div>
    </div>
  );
}
