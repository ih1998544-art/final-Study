import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Pause,
  Play,
  Layers,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  PracticeQuestion,
  PracticeMode,
  StudentAnswer,
  PracticeResult,
  WeakTopicAnalysisItem,
  RecommendedLessonCard,
} from '../../types/practice';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { PracticeQuestionRenderer } from './PracticeQuestionRenderer';
import { PracticeResultView } from './PracticeResultView';
import { useToast } from '../ui/Toast';

export interface PracticeEngineViewProps {
  testId: string;
  testTitle: string;
  subjectName: string;
  mode: PracticeMode;
  questions: PracticeQuestion[];
  durationMinutes: number;
  onExit: () => void;
  onAskAIAboutMistakes: (prompt: string, subjectName: string) => void;
  onOpenLesson?: (lessonTitle: string, subjectName: string) => void;
}

export const PracticeEngineView: React.FC<PracticeEngineViewProps> = ({
  testId,
  testTitle,
  subjectName,
  mode,
  questions,
  durationMinutes,
  onExit,
  onAskAIAboutMistakes,
  onOpenLesson,
}) => {
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(durationMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || { questionId: currentQuestion.id };

  // Countdown Timer
  useEffect(() => {
    if (result) return; // Stop timer if test finished

    timerRef.current = setInterval(() => {
      if (!isTimerPaused) {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isTimerPaused, result]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Answer modification handler
  const handleAnswerChange = (newFields: Partial<StudentAnswer>) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        questionId: currentQuestion.id,
        ...newFields,
      },
    }));
  };

  // Flag toggle
  const handleToggleFlag = () => {
    const currentlyFlagged = !!currentAnswer.isFlagged;
    handleAnswerChange({ isFlagged: !currentlyFlagged });
    showToast({
      type: 'info',
      title: !currentlyFlagged ? 'Question Flagged for Review' : 'Flag Removed',
      message: !currentlyFlagged
        ? `Question ${currentIndex + 1} marked for review.`
        : `Question ${currentIndex + 1} unflagged.`,
    });
  };

  // Clear answer
  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Evaluate & Grade Test on Submit
  const gradeTest = (): PracticeResult => {
    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const evaluatedAnswers: Record<string, StudentAnswer> = {};
    const topicStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      maxScore += q.marks;
      const ans = answers[q.id];

      if (!topicStats[q.topicName]) {
        topicStats[q.topicName] = { total: 0, correct: 0 };
      }
      topicStats[q.topicName].total += 1;

      if (!ans) {
        unansweredCount += 1;
        evaluatedAnswers[q.id] = { questionId: q.id, isCorrect: false, marksAwarded: 0 };
        return;
      }

      let isCorrect = false;

      // Evaluation by question type
      if (q.type === 'mcq' || q.type === 'true_false') {
        isCorrect = ans.selectedOptionIndex === q.correctIndex;
      } else if (q.type === 'numerical') {
        const val = parseFloat(ans.numericalAnswer || '');
        if (!isNaN(val) && q.correctNumber !== undefined) {
          const tol = q.tolerance !== undefined ? q.tolerance : 0.05;
          isCorrect = Math.abs(val - q.correctNumber) <= tol;
        }
      } else if (q.type === 'short_question' || q.type === 'long_question') {
        // Text responses awarded full marks if non-empty (AI evaluation simulation)
        isCorrect = (ans.textAnswer || '').trim().length > 15;
      } else if (q.type === 'coding') {
        // Coding responses awarded full marks if length > 30
        isCorrect = (ans.codeAnswer || '').trim().length > 30;
      }

      if (isCorrect) {
        correctCount += 1;
        totalScore += q.marks;
        topicStats[q.topicName].correct += 1;
      } else {
        incorrectCount += 1;
      }

      evaluatedAnswers[q.id] = {
        ...ans,
        isCorrect,
        marksAwarded: isCorrect ? q.marks : 0,
      };
    });

    setAnswers(evaluatedAnswers);

    const accuracyPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    // Determine Weak Topics (< 75% accuracy)
    const weakTopics: WeakTopicAnalysisItem[] = Object.entries(topicStats)
      .filter(([_, stats]) => stats.correct / stats.total < 0.75)
      .map(([topic, stats]) => ({
        topic,
        subject: subjectName,
        accuracyPercentage: Math.round((stats.correct / stats.total) * 100),
        missedQuestionsCount: stats.total - stats.correct,
        recommendation: `Targeted review recommended: run practice drills on foundational principles and boundary constraints for ${topic}.`,
      }));

    // Curate Recommended Revision Lessons
    const recommendedLessons: RecommendedLessonCard[] = weakTopics.slice(0, 3).map((w, idx) => ({
      id: `rec-les-${idx}`,
      title: `Mastering ${w.topic}`,
      subject: subjectName,
      durationMinutes: 15,
      xpReward: 40,
    }));

    return {
      sessionId: `res-${Date.now()}`,
      testTitle,
      subjectName,
      mode,
      score: totalScore,
      maxScore,
      accuracyPercentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      totalQuestions: questions.length,
      timeTakenSeconds,
      totalTimeAllocatedSeconds: durationMinutes * 60,
      xpEarned: Math.round(totalScore * 10),
      weakTopics,
      recommendedLessons,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const handleFinalSubmit = () => {
    setIsSubmitConfirmOpen(false);
    const calculatedResult = gradeTest();
    setResult(calculatedResult);
    showToast({
      type: 'success',
      title: 'Test Completed & Evaluated',
      message: `Score: ${calculatedResult.accuracyPercentage}%. Earned +${calculatedResult.xpEarned} XP!`,
    });
  };

  const handleAutoSubmit = () => {
    showToast({
      type: 'warning',
      title: 'Time Limit Expired',
      message: 'Time ran out! Your test has been automatically graded.',
    });
    const calculatedResult = gradeTest();
    setResult(calculatedResult);
  };

  // If test has been evaluated, render the detailed result page
  if (result) {
    return (
      <PracticeResultView
        result={result}
        questions={questions}
        answers={answers}
        onRetake={() => {
          setResult(null);
          setAnswers({});
          setTimeRemainingSeconds(durationMinutes * 60);
          setCurrentIndex(0);
          startTimeRef.current = Date.now();
        }}
        onBackToHub={onExit}
        onAskAIAboutMistakes={onAskAIAboutMistakes}
        onOpenLesson={onOpenLesson}
      />
    );
  }

  // Answer statistics
  const answeredCount = Object.values(answers).filter(
    (a) =>
      a.selectedOptionIndex !== undefined ||
      (a.textAnswer && a.textAnswer.trim().length > 0) ||
      (a.numericalAnswer && a.numericalAnswer.trim().length > 0) ||
      (a.codeAnswer && a.codeAnswer.trim().length > 0)
  ).length;

  const flaggedCount = Object.values(answers).filter((a) => a.isFlagged).length;
  const isTimeLow = timeRemainingSeconds < 120; // less than 2 mins

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ========================================================
          TOP LIVE BAR: Subject, Title, Live Timer, Question Counter
      ======================================================== */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 px-4 sm:px-6 py-3 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Practice</span>
            </button>
            <span className="text-slate-700">|</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  {mode.replace('_', ' ')}
                </span>
                <span className="text-slate-500 text-xs hidden sm:inline">·</span>
                <span className="text-xs text-slate-300 hidden sm:inline">{subjectName}</span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md font-display">
                {testTitle}
              </h2>
            </div>
          </div>

          {/* Right Timer & Submit Action */}
          <div className="flex items-center gap-3">
            {/* Live Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold tracking-wider ${
                isTimeLow
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-emerald-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="ml-1 text-slate-400 hover:text-white"
                title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              >
                {isTimerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSubmitConfirmOpen(true)}
              className="text-xs font-bold shadow-xs px-4"
            >
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================================
          QUESTION NAVIGATION STRIP (1 .. N)
      ======================================================== */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const isCurrent = idx === currentIndex;
              const hasAnswered =
                ans &&
                (ans.selectedOptionIndex !== undefined ||
                  (ans.textAnswer && ans.textAnswer.trim().length > 0) ||
                  (ans.numericalAnswer && ans.numericalAnswer.trim().length > 0) ||
                  (ans.codeAnswer && ans.codeAnswer.trim().length > 0));
              const isFlagged = ans?.isFlagged;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer relative shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 ring-offset-1'
                      : isFlagged
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : hasAnswered
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-1 -right-1 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0 hidden md:flex font-mono">
            <span>
              Answered: <strong className="text-emerald-700">{answeredCount}</strong>/{questions.length}
            </span>
            {flaggedCount > 0 && (
              <span className="text-amber-700 font-semibold">
                · {flaggedCount} Flagged
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          QUESTION WORKSPACE CARD
      ======================================================== */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Question Header: Question number, Type, Marks, Flag toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-sm flex items-center justify-center font-mono">
                {currentIndex + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {currentQuestion.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    {currentQuestion.topicName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
              </span>

              {/* Flag for Review Button */}
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentAnswer.isFlagged
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
                title="Flag question for review before final submission"
              >
                <Flag className={`w-3.5 h-3.5 ${currentAnswer.isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">
                  {currentAnswer.isFlagged ? 'Flagged' : 'Flag'}
                </span>
              </button>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Question Input Renderer (MCQ, True/False, Short, Long, Numerical, Coding) */}
          <div className="pt-2">
            <PracticeQuestionRenderer
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
          </div>
        </div>

        {/* ========================================================
            NAVIGATION & ACTION BUTTONS
        ======================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous Question
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAnswer}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Clear Response
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6 shadow-sm"
              >
                Submit Test
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================
          SUBMISSION CONFIRMATION MODAL
      ======================================================== */}
      <Modal
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
        title="Ready to Submit Test?"
        description="Verify your completion status before finalizing your evaluation."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xl font-bold font-mono text-emerald-800">
                {answeredCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mt-0.5">
                Answered
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xl font-bold font-mono text-slate-700">
                {questions.length - answeredCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mt-0.5">
                Unanswered
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xl font-bold font-mono text-amber-800">
                {flaggedCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-700 block mt-0.5">
                Flagged
              </span>
            </div>
          </div>

          {questions.length - answeredCount > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                You have {questions.length - answeredCount} unanswered questions. Unanswered questions will receive 0 marks.
              </span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitConfirmOpen(false)}
            >
              Resume Test
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleFinalSubmit}
            >
              Confirm & Submit Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
