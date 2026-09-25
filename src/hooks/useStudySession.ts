import { useState, useRef, useCallback } from 'react';
import type {
  StudyMaterial,
  GenerateRequest,
  AppError,
  AppState,
  TabKey,
  ContentType,
  Difficulty,
  StudyCount,
  QuizQuestion,
} from '@/types/study';
import { generateStudySession } from '@/lib/api';
import { getWrongAnswers } from '@/utils/studyUtils';

const MAX_INPUT_LENGTH = 10000;

export function useStudySession() {
  const [input, setInput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('flashcards_quiz');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count, setCount] = useState<StudyCount>(10);

  const [appState, setAppState] = useState<AppState>('empty');
  const [studyData, setStudyData] = useState<StudyMaterial | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardCompleted, setFlashcardCompleted] = useState(false);

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([]);

  // Reuses the same quiz index for retest navigation.
  const [retestMode, setRetestMode] = useState(false);
  const [retestQuestions, setRetestQuestions] = useState<QuizQuestion[]>([]);
  const [retestAnswers, setRetestAnswers] = useState<Record<string, number>>({});
  const [retestScore, setRetestScore] = useState(0);
  const [retestCompleted, setRetestCompleted] = useState(false);

  // Only the latest request may update the session state.
  const requestId = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async () => {
    if (!input.trim()) {
      setError({
        message: 'Please enter a topic or paste some notes.',
        type: 'validation',
        canRetry: false,
        canEdit: true,
      });
      setAppState('error');
      return;
    }

    if (input.length > MAX_INPUT_LENGTH) {
      setError({
        message: 'Your notes are too long. Please shorten them and try again.',
        type: 'validation',
        canRetry: false,
        canEdit: true,
      });
      setAppState('error');
      return;
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const id = ++requestId.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setAppState('loading');
    setError(null);

    const request: GenerateRequest = {
      input: input.trim(),
      type: contentType,
      difficulty,
      count,
    };

    const response = await generateStudySession(request, { signal: controller.signal });

    // Stale request check: only the latest request updates UI
    if (id !== requestId.current) return;

    if (response.error) {
      setError(response.error);
      setAppState('error');
      return;
    }

    if (response.data) {
      setStudyData(response.data);
      setAppState('dashboard');
      setActiveTab('overview');
      // Reset all study states
      setCurrentFlashcard(0);
      setIsFlipped(false);
      setFlashcardCompleted(false);
      setCurrentQuizIndex(0);
      setSelectedAnswers({});
      setQuizScore(0);
      setQuizCompleted(false);
      setWrongAnswers([]);
      setRetestMode(false);
      setRetestQuestions([]);
      setRetestAnswers({});
      setRetestScore(0);
      setRetestCompleted(false);
    }
  }, [input, contentType, difficulty, count]);

  const retry = useCallback(() => {
    generate();
  }, [generate]);

  const editInput = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setAppState('empty');
    setError(null);
  }, []);

  const resetSession = useCallback(() => {
    setStudyData(null);
    setAppState('empty');
    setError(null);
    setInput('');
    setActiveTab('overview');
    setCurrentFlashcard(0);
    setIsFlipped(false);
    setFlashcardCompleted(false);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizScore(0);
    setQuizCompleted(false);
    setWrongAnswers([]);
    setRetestMode(false);
    setRetestQuestions([]);
    setRetestAnswers({});
    setRetestScore(0);
    setRetestCompleted(false);
  }, []);

  const nextFlashcard = useCallback(() => {
    if (!studyData) return;
    setIsFlipped(false);
    setCurrentFlashcard((prev) => {
      if (prev < studyData.flashcards.length - 1) return prev + 1;
      setFlashcardCompleted(true);
      return prev;
    });
  }, [studyData]);

  const prevFlashcard = useCallback(() => {
    setIsFlipped(false);
    setCurrentFlashcard((prev) => Math.max(0, prev - 1));
  }, []);

  const flipFlashcard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const restartFlashcards = useCallback(() => {
    setCurrentFlashcard(0);
    setIsFlipped(false);
    setFlashcardCompleted(false);
  }, []);

  const selectQuizAnswer = useCallback((questionId: string, answerIndex: number) => {
    if (retestMode) {
      setRetestAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    } else {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    }
  }, [retestMode]);

  const nextQuizQuestion = useCallback(() => {
    if (!studyData) return;
    const questions = retestMode ? retestQuestions : studyData.quiz;
    if (currentQuizIndex < questions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      // Quiz complete
      const answers = retestMode ? retestAnswers : selectedAnswers;
      const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
      if (retestMode) {
        setRetestScore(score);
        setRetestCompleted(true);
      } else {
        setQuizScore(score);
        setQuizCompleted(true);
        const wrong = getWrongAnswers(questions, answers);
        setWrongAnswers(wrong);
      }
    }
  }, [studyData, currentQuizIndex, retestMode, retestQuestions, retestAnswers, selectedAnswers]);

  const restartQuiz = useCallback(() => {
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizScore(0);
    setQuizCompleted(false);
    setWrongAnswers([]);
  }, []);

  const startRetest = useCallback(() => {
    if (wrongAnswers.length === 0) return;
    setRetestMode(true);
    setRetestQuestions(wrongAnswers);
    setRetestAnswers({});
    setRetestScore(0);
    setRetestCompleted(false);
    setCurrentQuizIndex(0);
    setActiveTab('quiz');
  }, [wrongAnswers]);

  const restartRetest = useCallback(() => {
    setRetestAnswers({});
    setRetestScore(0);
    setRetestCompleted(false);
    setCurrentQuizIndex(0);
  }, []);

  const exitRetest = useCallback(() => {
    setRetestMode(false);
    setRetestQuestions([]);
    setRetestAnswers({});
    setRetestScore(0);
    setRetestCompleted(false);
    setCurrentQuizIndex(0);
    setActiveTab('review');
  }, []);

  return {
    // Input
    input,
    setInput,
    contentType,
    setContentType,
    difficulty,
    setDifficulty,
    count,
    setCount,
    // State
    appState,
    studyData,
    error,
    activeTab,
    setActiveTab,
    // Flashcards
    currentFlashcard,
    isFlipped,
    flashcardCompleted,
    nextFlashcard,
    prevFlashcard,
    flipFlashcard,
    restartFlashcards,
    // Quiz
    currentQuizIndex,
    selectedAnswers,
    quizScore,
    quizCompleted,
    wrongAnswers,
    selectQuizAnswer,
    nextQuizQuestion,
    restartQuiz,
    // Retest
    retestMode,
    retestQuestions,
    retestAnswers,
    retestScore,
    retestCompleted,
    startRetest,
    restartRetest,
    exitRetest,
    // Actions
    generate,
    retry,
    editInput,
    resetSession,
  };
}
