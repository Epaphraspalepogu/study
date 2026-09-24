import { Header } from '@/components/Header';
import { PromptInput } from '@/components/PromptInput';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { StudyDashboard } from '@/components/StudyDashboard';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { Quiz } from '@/components/Quiz';
import { WrongAnswerReview } from '@/components/WrongAnswerReview';
import { QuizResults } from '@/components/QuizResults';
import { useStudySession } from '@/hooks/useStudySession';

function App() {
  const session = useStudySession();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onReset={session.resetSession} showReset={session.appState === 'dashboard'} />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {session.appState === 'empty' && (
          <div className="space-y-6">
            <PromptInput
              input={session.input}
              setInput={session.setInput}
              contentType={session.contentType}
              setContentType={session.setContentType}
              difficulty={session.difficulty}
              setDifficulty={session.setDifficulty}
              count={session.count}
              setCount={session.setCount}
              onGenerate={session.generate}
              isLoading={false}
            />
            <EmptyState />
          </div>
        )}

        {session.appState === 'loading' && (
          <div className="space-y-6">
            <PromptInput
              input={session.input}
              setInput={session.setInput}
              contentType={session.contentType}
              setContentType={session.setContentType}
              difficulty={session.difficulty}
              setDifficulty={session.setDifficulty}
              count={session.count}
              setCount={session.setCount}
              onGenerate={session.generate}
              isLoading={true}
            />
            <LoadingState />
          </div>
        )}

        {session.appState === 'error' && session.error && (
          <div className="space-y-6">
            {session.error.type !== 'validation' && (
              <PromptInput
                input={session.input}
                setInput={session.setInput}
                contentType={session.contentType}
                setContentType={session.setContentType}
                difficulty={session.difficulty}
                setDifficulty={session.setDifficulty}
                count={session.count}
                setCount={session.setCount}
                onGenerate={session.generate}
                isLoading={false}
              />
            )}
            <ErrorState
              error={session.error}
              onRetry={session.error.canRetry ? session.retry : undefined}
              onEdit={session.error.canEdit ? session.editInput : undefined}
            />
          </div>
        )}

        {session.appState === 'dashboard' && session.studyData && (
          <StudyDashboard
            data={session.studyData}
            difficulty={session.difficulty}
            activeTab={session.activeTab}
            onTabChange={session.setActiveTab}
            onStartFlashcards={() => session.setActiveTab('flashcards')}
            onStartQuiz={() => session.setActiveTab('quiz')}
          >
            {session.activeTab === 'flashcards' && (
              <FlashcardDeck
                cards={session.studyData.flashcards}
                current={session.currentFlashcard}
                isFlipped={session.isFlipped}
                completed={session.flashcardCompleted}
                onNext={session.nextFlashcard}
                onPrev={session.prevFlashcard}
                onFlip={session.flipFlashcard}
                onRestart={session.restartFlashcards}
                onStartQuiz={() => session.setActiveTab('quiz')}
              />
            )}

            {session.activeTab === 'quiz' && (
              <>
                {session.retestMode ? (
                  session.retestCompleted ? (
                    <QuizResults
                      score={session.retestScore}
                      total={session.retestQuestions.length}
                      onReviewWrong={session.restartRetest}
                      onRetake={session.restartRetest}
                      onBackToDashboard={session.exitRetest}
                      hasWrongAnswers={session.retestScore < session.retestQuestions.length}
                    />
                  ) : (
                    <Quiz
                      questions={session.retestQuestions}
                      currentIndex={session.currentQuizIndex}
                      selectedAnswers={session.retestAnswers}
                      completed={false}
                      score={0}
                      isRetest={true}
                      onSelectAnswer={session.selectQuizAnswer}
                      onNext={session.nextQuizQuestion}
                      onRetake={session.restartRetest}
                      onBackToDashboard={session.exitRetest}
                      onReviewWrong={session.restartRetest}
                      hasWrongAnswers={false}
                    />
                  )
                ) : session.quizCompleted ? (
                  <QuizResults
                    score={session.quizScore}
                    total={session.studyData.quiz.length}
                    onReviewWrong={() => session.setActiveTab('review')}
                    onRetake={session.restartQuiz}
                    onBackToDashboard={() => session.setActiveTab('overview')}
                    hasWrongAnswers={session.wrongAnswers.length > 0}
                  />
                ) : (
                  <Quiz
                    questions={session.studyData.quiz}
                    currentIndex={session.currentQuizIndex}
                    selectedAnswers={session.selectedAnswers}
                    completed={session.quizCompleted}
                    score={session.quizScore}
                    isRetest={false}
                    onSelectAnswer={session.selectQuizAnswer}
                    onNext={session.nextQuizQuestion}
                    onRetake={session.restartQuiz}
                    onBackToDashboard={() => session.setActiveTab('overview')}
                    onReviewWrong={() => session.setActiveTab('review')}
                    hasWrongAnswers={session.wrongAnswers.length > 0}
                  />
                )}
              </>
            )}

            {session.activeTab === 'review' && (
              <WrongAnswerReview
                wrongQuestions={session.wrongAnswers}
                wrongAnswers={session.selectedAnswers}
                onRetest={session.startRetest}
                onBackToDashboard={() => session.setActiveTab('overview')}
              />
            )}
          </StudyDashboard>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-slate-400 sm:px-6">
          StudyFlow AI — Structured AI study sessions. Built for the Flam Frontend Internship Assignment.
        </div>
      </footer>
    </div>
  );
}

export default App;
