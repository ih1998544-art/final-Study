import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Filter,
  Eye,
  Check,
  ChevronDown,
  Layers,
  Code2,
} from 'lucide-react';
import {
  PracticeQuestion,
  PracticeResult,
  StudentAnswer,
} from '../../types/practice';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export interface PracticeResultViewProps {
  result: PracticeResult;
  questions: PracticeQuestion[];
  answers: Record<string, StudentAnswer>;
  onRetake: () => void;
  onBackToHub: () => void;
  onAskAIAboutMistakes: (prompt: string, subjectName: string) => void;
  onOpenLesson?: (lessonTitle: string, subjectName: string) => void;
}

export const PracticeResultView: React.FC<PracticeResultViewProps> = ({
  result,
  questions,
  answers,
  onRetake,
  onBackToHub,
  onAskAIAboutMistakes,
  onOpenLesson,
}) => {
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'flagged'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Filter questions for review
  const filteredQuestions = questions.filter((q) => {
    const ans = answers[q.id];
    if (reviewFilter === 'correct') return ans?.isCorrect;
    if (reviewFilter === 'incorrect') return ans && !ans.isCorrect;
    if (reviewFilter === 'flagged') return ans?.isFlagged;
    return true;
  });

  const isPassing = result.accuracyPercentage >= 70;

  // Build AI prompt for mistakes
  const handleAskAIMistakes = () => {
    const missed = questions
      .filter((q) => answers[q.id] && !answers[q.id].isCorrect)
      .map((q) => `• In ${q.topicName}: Question was "${q.question}"`)
      .join('\n');

    const prompt = `I just completed a ${result.testTitle} in ${result.subjectName} with an accuracy of ${result.accuracyPercentage}%. I missed the following questions:\n\n${missed}\n\nCan you give me a diagnostic Socratic explanation of where my conceptual understanding slipped and provide 2 practice exercises to verify my grasp?`;
    onAskAIAboutMistakes(prompt, result.subjectName);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24 animate-fadeIn">
      {/* ========================================================
          1. SCORE HERO CARD & OVERVIEW
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Test Assessment Complete
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {result.subjectName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {result.testTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Completed on {result.completedAt}
            </p>
          </div>

          {/* Quick Hub Return */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onBackToHub}>
              Back to Practice Hub
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onRetake}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retake Test
            </Button>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Score & Accuracy */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Score & Accuracy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {result.accuracyPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ({result.score}/{result.maxScore} marks)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-500 ${
                  isPassing ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{ width: `${result.accuracyPercentage}%` }}
              />
            </div>
          </div>

          {/* Card 2: Correct Answers */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Correct Answers
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-display">
                {result.correctCount}
              </span>
              <span className="text-xs text-emerald-700 font-mono">
                of {result.totalQuestions} questions
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-1">
              +{result.xpEarned} XP Earned ✓
            </span>
          </div>

          {/* Card 3: Incorrect Answers */}
          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 space-y-1">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              Incorrect / Missed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-800 font-display">
                {result.incorrectCount}
              </span>
              <span className="text-xs text-rose-700 font-mono">
                {result.unansweredCount > 0 && `(${result.unansweredCount} skipped)`}
              </span>
            </div>
            <span className="text-[11px] text-rose-700 block mt-1">
              {result.incorrectCount === 0 ? 'Flawless recall!' : 'Review rationale below'}
            </span>
          </div>

          {/* Card 4: Time Taken */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Time Taken
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display font-mono">
                {formatTime(result.timeTakenSeconds)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              Pacing: ~{Math.round(result.timeTakenSeconds / (result.totalQuestions || 1))}s / question
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. WEAK-TOPIC ANALYSIS SECTION
      ======================================================== */}
      {result.weakTopics && result.weakTopics.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Automated Diagnostic Analysis
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Diagnosed Weak Areas & Gaps
              </h2>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleAskAIMistakes}
              className="bg-amber-600 hover:bg-amber-700 border-amber-600 shadow-xs text-xs"
            >
              <Bot className="w-3.5 h-3.5 mr-1.5" />
              Discuss Mistakes with AI Coach
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {result.weakTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {topic.topic}
                  </h4>
                  <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {topic.accuracyPercentage}% Mastery
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Prescribed Action:</strong> {topic.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          3. RECOMMENDED REVISION LESSONS
      ======================================================== */}
      {result.recommendedLessons && result.recommendedLessons.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recommended Revision Lessons
            </h3>
            <span className="text-xs text-slate-400">Curated based on your test results</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.recommendedLessons.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rec.subject}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display mt-2 line-clamp-2">
                    {rec.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {rec.durationMinutes} min
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenLesson && onOpenLesson(rec.title, rec.subject)}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>Start Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          4. IN-DEPTH QUESTION & ANSWER REVIEW
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Comprehensive Audit
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Question-by-Question Review ({questions.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {(['all', 'correct', 'incorrect', 'flagged'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setReviewFilter(tab)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all capitalize ${
                  reviewFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, qIdx) => {
            const ans = answers[q.id];
            const isCorrect = ans?.isCorrect;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isCorrect
                    ? 'border-emerald-200/80 bg-white'
                    : 'border-rose-200/80 bg-rose-50/20'
                }`}
              >
                {/* Collapsible Question Row Header */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓' : '✗'}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {q.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {q.topicName}
                        </span>
                        {ans?.isFlagged && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Flagged
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-600">
                      {ans?.marksAwarded || 0} / {q.marks} pts
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details: Student Answer vs Correct Answer + Explanation */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-4 text-xs sm:text-sm">
                    {/* MCQ Options review */}
                    {q.options && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Options & Breakdown:
                        </span>
                        <div className="space-y-1.5 pl-2">
                          {q.options.map((opt, optIdx) => {
                            const isStudentSelected = ans?.selectedOptionIndex === optIdx;
                            const isCorrectOpt = q.correctIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                                  isCorrectOpt
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                    : isStudentSelected
                                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                                    : 'bg-slate-50 border-slate-200 text-slate-500'
                                }`}
                              >
                                <span className="flex-1">
                                  <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                                </span>
                                {isCorrectOpt && (
                                  <span className="text-[11px] font-bold text-emerald-700">
                                    Correct Answer
                                  </span>
                                )}
                                {isStudentSelected && !isCorrectOpt && (
                                  <span className="text-[11px] font-bold text-rose-600">
                                    Your Choice
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Numerical Review */}
                    {q.type === 'numerical' && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span>Your Submitted Answer: <strong>{ans?.numericalAnswer || 'None'} {q.unit}</strong></span>
                          <span>Verified Correct Answer: <strong className="text-emerald-700">{q.correctNumber} {q.unit}</strong></span>
                        </div>
                        {q.formula && (
                          <div className="text-xs font-mono text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                            Governing Formula: {q.formula}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Short / Long Question Review */}
                    {(q.type === 'short_question' || q.type === 'long_question') && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-xs font-bold text-slate-500 block mb-1">
                            Your Written Response:
                          </span>
                          <p className="text-xs text-slate-800 whitespace-pre-wrap">
                            {ans?.textAnswer || '(No response recorded)'}
                          </p>
                        </div>

                        {q.modelAnswer && (
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                            <span className="text-xs font-bold text-emerald-900 block mb-1">
                              Official Benchmark Model Answer:
                            </span>
                            <p className="text-xs leading-relaxed">{q.modelAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Coding Problem Review */}
                    {q.type === 'coding' && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Your Submitted Code:
                        </span>
                        <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                          <code>{ans?.codeAnswer || q.starterCode}</code>
                        </pre>
                        {q.solutionCode && (
                          <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-2">
                              Optimal Solution:
                            </span>
                            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
                              <code>{q.solutionCode}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rationale & Explanation */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                      <span className="text-xs font-bold text-slate-900 block font-display">
                        Pedagogical Rationale:
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
