export type ContentType = 'flashcards_quiz' | 'flashcards' | 'quiz';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type StudyCount = 5 | 10 | 15;

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyMaterial {
  title: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface GenerateRequest {
  input: string;
  type: ContentType;
  difficulty: Difficulty;
  count: StudyCount;
}

export type AppError = {
  message: string;
  type: 'validation' | 'malformed' | 'empty' | 'api' | 'timeout' | 'network';
  canRetry: boolean;
  canEdit: boolean;
};

export type AppState = 'empty' | 'loading' | 'dashboard' | 'error';
export type TabKey = 'overview' | 'flashcards' | 'quiz' | 'review';
