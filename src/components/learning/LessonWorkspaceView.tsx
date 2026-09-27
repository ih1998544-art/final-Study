import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Bot,
  Zap,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Check,
  Code2,
  FileText,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { SubjectItem, Chapter, Topic, Lesson } from '../../types';
import { ExplanationLevel } from '../../types/learning';
import { learningContentService } from '../../services/learningContentService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useToast } from '../ui/Toast';
import { WeakAreaDetectionModal } from './WeakAreaDetectionModal';

export interface LessonWorkspaceViewProps {
  subject: SubjectItem;
  chapter: Chapter;
  topic: Topic;
  lesson: Lesson;
  onBackToTopic: () => void;
  onNavigateLesson: (direction: 'prev' | 'next') => void;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  onCompleteLesson: (lessonId: string) => void;
  onOpenAITutor: (prompt: string, subjectName?: string) => void;
}

export const LessonWorkspaceView: React.FC<LessonWorkspaceViewProps> = ({
  subject,
  chapter,
  topic,
  lesson,
  onBackToTopic,
  onNavigateLesson,
  hasPrevLesson,
  hasNextLesson,
  onCompleteLesson,
  onOpenAITutor,
}) => {
  const { showToast } = useToast();

  // 5 Explanation Levels: Simple | Normal | Detailed | Exam | Step-by-Step
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('normal');

  // Active view tab: Content | Examples | Practice | Quiz | Revision
  const [activeTab, setActiveTab] = useState<'content' | 'examples' | 'practice' | 'quiz' | 'revision'>('content');

  // Saved / Bookmarked state
  const [isSaved, setIsSaved] = useState(false);

  // Practice exercises state
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [isPracticeSubmitted, setIsPracticeSubmitted] = useState(false);

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Weak area modal state
  const [isWeakAreaModalOpen, setIsWeakAreaModalOpen] = useState(false);
  const [weakAreaReport, setWeakAreaReport] = useState(() =>
    learningContentService.evaluateWeakAreas(0, 1, subject.name, topic.title)
  );

  // Multi-depth pedagogical explanation data
  const multiDepth = learningContentService.getMultiDepthExplanation(
    subject.name,
    lesson.title,
    lesson.content.explanation,
    lesson.content.keyTakeaways
  );

  // Practice problems & Revision data
  const practiceProblems = learningContentService.getPracticeExercises(subject.name, lesson.title);
  const revisionSheet = learningContentService.getRapidRevisionSheet(subject.name, topic.title);

  // Reset practice & quiz state on lesson change
  useEffect(() => {
    setSelectedPracticeOption(null);
    setRevealedHints(0);
    setIsPracticeSubmitted(false);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setIsSaved(false);
  }, [lesson.id]);

  // Keyboard navigation: ArrowLeft (prev), ArrowRight (next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' && hasPrevLesson) {
        onNavigateLesson('prev');
      } else if (e.key === 'ArrowRight' && hasNextLesson) {
        onNavigateLesson('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevLesson, hasNextLesson, onNavigateLesson]);

  // Handle Mark Complete
  const handleMarkComplete = () => {
    onCompleteLesson(lesson.id);
    showToast({
      type: 'success',
      title: 'Lesson Completed! +35 XP',
      message: `Mastery recorded for "${lesson.title}".`,
    });
  };

  // Handle Save Lesson
  const handleSaveLesson = () => {
    setIsSaved(!isSaved);
    showToast({
      type: isSaved ? 'info' : 'success',
      title: isSaved ? 'Removed from Notebook' : 'Saved to Notebook',
      message: isSaved
        ? 'Lesson removed from your saved bookmarks.'
        : `"${lesson.title}" bookmarked with your selected notes.`,
    });
  };

  // Handle Ask AI
  const handleAskAI = () => {
    const prompt = `I am studying "${lesson.title}" in ${subject.name} (${chapter.title} - ${topic.title}). Can you explain the core concepts and give me a practical exercise to test my understanding?`;
    onOpenAITutor(prompt, subject.name);
  };

  // Handle Quiz submission
  const handleQuizSubmit = (selectedOpt: number) => {
    setSelectedQuizOption(selectedOpt);
    setIsQuizSubmitted(true);

    const isCorrect = selectedOpt === lesson.content.checkQuestion.correctIndex;
    const report = learningContentService.evaluateWeakAreas(
      isCorrect ? 1 : 0,
      1,
      subject.name,
      topic.title
    );
    setWeakAreaReport(report);

    if (!isCorrect) {
      showToast({
        type: 'warning',
        title: 'Diagnostic Misconception Detected',
        message: 'Review the rationale or launch an AI Socratic coaching session.',
      });
      setIsWeakAreaModalOpen(true);
    } else {
      showToast({
        type: 'success',
        title: 'Diagnostic Check Passed! +20 XP',
        message: 'Accurate active recall confirmed.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ========================================================
          TOP BREADCRUMB & CONTEXT NAVIGATION BAR
      ======================================================== */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-4 sm:px-6 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back button + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToTopic}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Curriculum</span>
            </button>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
              <span className="font-semibold text-emerald-700">{subject.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{chapter.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:inline" />
              <span className="truncate max-w-[160px] font-medium text-slate-800 hidden sm:inline">{topic.title}</span>
            </div>
          </div>

          {/* Quick Actions: Ask AI & Save */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveLesson}
              className={`text-xs py-1 h-8 ${isSaved ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : ''}`}
            >
              <Bookmark className="w-3.5 h-3.5 mr-1" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleAskAI}
              className="text-xs py-1 h-8 shadow-xs"
            >
              <Bot className="w-3.5 h-3.5 mr-1.5" />
              <span>Ask AI Tutor</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================================
          LESSON HERO & EXPLANATION DEPTH CONTROLS
      ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Interactive Lesson
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {lesson.durationMinutes} Minutes
                </span>
                {lesson.completed && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 ml-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" /> Completed
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                {lesson.title}
              </h1>
            </div>

            {/* XP Award Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                +{lesson.xp} XP Upon Mastery
              </span>
            </div>
          </div>

          {/* 5 EXPLANATION DEPTH SELECTOR BUTTONS */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Select Explanation Depth:</span>
              <span className="text-emerald-600 font-medium">
                {explanationLevel === 'simple' && 'Intuitive Analogies & ELI5'}
                {explanationLevel === 'normal' && 'Curriculum Standard Explanation'}
                {explanationLevel === 'detailed' && 'Rigorous Proofs & Academic Derivations'}
                {explanationLevel === 'exam' && 'Mark Scheme Keywords & Examiner Traps'}
                {explanationLevel === 'step_by_step' && 'Numbered Stage Walkthrough'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              {[
                { id: 'simple' as ExplanationLevel, label: 'Simple / ELI5' },
                { id: 'normal' as ExplanationLevel, label: 'Normal' },
                { id: 'detailed' as ExplanationLevel, label: 'Detailed / Proof' },
                { id: 'exam' as ExplanationLevel, label: 'Exam-Ready' },
                { id: 'step_by_step' as ExplanationLevel, label: 'Step-by-Step' },
              ].map((btn) => {
                const isSelected = explanationLevel === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setExplanationLevel(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5 LEARNING PHASE TABS: Content | Examples | Practice | Quiz | Revision
      ======================================================== */}
      <nav aria-label="Learning Phase Navigation" className="bg-white border-b border-slate-200/90 px-4 sm:px-6 sticky top-[57px] z-10 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'content' as const, label: 'Lesson Theory', icon: BookOpen },
            { id: 'examples' as const, label: 'Worked Examples', icon: Lightbulb },
            { id: 'practice' as const, label: 'Interactive Practice', icon: Zap },
            { id: 'quiz' as const, label: 'Diagnostic Quiz', icon: Award },
            { id: 'revision' as const, label: 'Rapid Revision', icon: RotateCcw },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================
          MAIN WORKSPACE TAB CONTENT
      ======================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 space-y-6">
        {/* TAB 1: LESSON THEORY (Driven by 5 Explanation Levels) */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* LEVEL: SIMPLE */}
            {explanationLevel === 'simple' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    The Plain English Analogy
                  </span>
                  <p className="text-sm sm:text-base text-emerald-950 leading-relaxed font-medium">
                    {multiDepth.simple.analogy}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Big Picture Summary
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {multiDepth.simple.summary}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Core Everyday Principles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {multiDepth.simple.keyPoints.map((pt, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm text-slate-700">
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL: NORMAL */}
            {explanationLevel === 'normal' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Curriculum Overview
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {multiDepth.normal.overview}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Core Pedagogical Explanation
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {multiDepth.normal.explanation}
                  </p>
                </div>

                {lesson.content.formulaOrCodeSnippet && (
                  <div className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-center text-sm sm:text-base border border-slate-800 shadow-inner">
                    {lesson.content.formulaOrCodeSnippet}
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Key Takeaways
                  </h4>
                  <div className="space-y-2">
                    {multiDepth.normal.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL: DETAILED */}
            {explanationLevel === 'detailed' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Theoretical Foundation & Invariance Axioms
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {multiDepth.detailed.theoreticalBasis}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm border border-slate-800 leading-relaxed overflow-x-auto shadow-inner">
                  <div className="text-emerald-400 font-bold mb-2 uppercase tracking-wider text-[11px]">
                    Formal Mathematical / Structural Derivation:
                  </div>
                  {multiDepth.detailed.formalDerivationOrProof}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Higher-Order Academic Implications
                  </h4>
                  <div className="space-y-2">
                    {multiDepth.detailed.advancedImplications.map((imp, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL: EXAM-READY */}
            {explanationLevel === 'exam' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4" /> Official Mark Scheme Rubric Requirements
                  </span>
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    {multiDepth.exam.rubricRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-amber-700">✓</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    High-Yield Keywords (Mandatory on Exams)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {multiDepth.exam.highYieldKeywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Full-Marks Model Answer
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                    {multiDepth.exam.modelAnswerSnippet}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Common Examiner Traps
                  </h4>
                  <div className="space-y-2">
                    {multiDepth.exam.commonExaminerTraps.map((trap, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-rose-950">
                        {trap}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL: STEP-BY-STEP */}
            {explanationLevel === 'step_by_step' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Algorithmic Step-by-Step Execution Protocol
                  </h3>

                  <div className="space-y-4">
                    {multiDepth.stepByStep.steps.map((step) => (
                      <div key={step.stepNumber} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                            {step.stepNumber}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 pl-9 leading-relaxed">
                          <strong>Action:</strong> {step.instruction}
                        </p>
                        <p className="text-xs text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/80 pl-9">
                          <strong>Pedagogical Reasoning:</strong> {step.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-800 flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-white">Verification:</span>
                    <span>{multiDepth.stepByStep.verificationCheck}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WORKED EXAMPLES */}
        {activeTab === 'examples' && (
          <div className="space-y-4">
            {lesson.content.examples.map((ex, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                    {ex.title}
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {ex.detail}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: INTERACTIVE PRACTICE DRILL */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {practiceProblems.map((prob, pIdx) => (
              <div key={prob.id} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Practice Drill #{pIdx + 1}
                  </span>
                  <span className="text-xs text-slate-400">Adaptive Hint Support</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {prob.question}
                </h3>

                {/* Progressive Hints */}
                {revealedHints > 0 && (
                  <div className="space-y-2 pt-2">
                    {prob.hints.slice(0, revealedHints).map((hint, hIdx) => (
                      <div key={hIdx} className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Hint {hIdx + 1}:</strong> {hint}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Practice Options */}
                {prob.options && (
                  <div className="space-y-2 pt-2">
                    {prob.options.map((opt, oIdx) => {
                      const isSelected = selectedPracticeOption === oIdx;
                      const isCorrect = isPracticeSubmitted && oIdx === prob.correctOptionIndex;

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isPracticeSubmitted}
                          onClick={() => setSelectedPracticeOption(oIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-all ${
                            isPracticeSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                                : isSelected
                                ? 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                              : isSelected
                              ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 bg-slate-100 border border-slate-200">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Solution Walkthrough on submit */}
                {isPracticeSubmitted && (
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    <strong className="block mb-1 text-emerald-900 font-bold">
                      Full Solution Walkthrough:
                    </strong>
                    {prob.solutionWalkthrough}
                  </div>
                )}

                {/* Controls: Reveal Hint & Submit */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    disabled={revealedHints >= prob.hints.length}
                    onClick={() => setRevealedHints((h) => Math.min(prob.hints.length, h + 1))}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 disabled:opacity-40"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Reveal Hint ({revealedHints}/{prob.hints.length})</span>
                  </button>

                  {!isPracticeSubmitted ? (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={selectedPracticeOption === null}
                      onClick={() => setIsPracticeSubmitted(true)}
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsPracticeSubmitted(false);
                        setSelectedPracticeOption(null);
                      }}
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DIAGNOSTIC QUIZ (With Weak Area Detection) */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Diagnostic Recall Check
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  {lesson.content.checkQuestion.question}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                +20 XP
              </span>
            </div>

            <div className="space-y-2.5">
              {lesson.content.checkQuestion.options.map((option, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                const isCorrect = isQuizSubmitted && optIdx === lesson.content.checkQuestion.correctIndex;

                let buttonStyles = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                if (isQuizSubmitted) {
                  if (isCorrect) {
                    buttonStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                  } else if (isSelected) {
                    buttonStyles = 'border-rose-400 bg-rose-50 text-rose-900';
                  } else {
                    buttonStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  buttonStyles = 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isQuizSubmitted}
                    onClick={() => handleQuizSubmit(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${buttonStyles}`}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 bg-slate-100 border border-slate-200">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isQuizSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Weak Area Action Callout */}
            {isQuizSubmitted && (
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="block mb-1 text-slate-900 font-bold">
                    Diagnostic Explanation:
                  </strong>
                  {lesson.content.checkQuestion.explanation}
                </div>

                {selectedQuizOption !== lesson.content.checkQuestion.correctIndex && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-amber-900">
                          Weak Area Identified
                        </span>
                        <p className="text-xs text-amber-800">
                          Review this topic with targeted AI Socratic inquiry.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsWeakAreaModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-700 border-amber-600 text-xs"
                    >
                      View Diagnostic Report
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RAPID REVISION SHEET */}
        {activeTab === 'revision' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                10-Minute Rapid Review Sheet
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {revisionSheet.cheatSheetSummary}
              </h3>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Core Governing Formulas & Laws
              </h4>
              <div className="space-y-2">
                {revisionSheet.coreFormulasOrPrinciples.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-800">
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Recall Trigger Questions
              </h4>
              <div className="space-y-2.5">
                {revisionSheet.activeRecallTriggers.map((trig, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      Q: {trig.question}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 pl-4 border-l-2 border-emerald-500">
                      {trig.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {revisionSheet.mnemonics && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Memory Consolidation Mnemonics
                </span>
                <div className="space-y-1 text-xs sm:text-sm text-emerald-950 font-medium">
                  {revisionSheet.mnemonics.map((m, idx) => (
                    <div key={idx}>• {m}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================
          PERSISTENT BOTTOM ACTION BAR (Previous/Next, Mark Complete, Keyboard Shortcuts)
      ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 py-3 px-4 sm:px-6 shadow-xl z-30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Previous Lesson Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrevLesson}
            onClick={() => onNavigateLesson('prev')}
            className="text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Previous Lesson</span>
          </Button>

          {/* Center: Mark Complete / Completed State */}
          <div className="flex items-center gap-3">
            {!lesson.completed ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleMarkComplete}
                className="text-xs sm:text-sm font-bold shadow-xs px-6"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Mark as Complete (+35 XP)
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed (+35 XP Earned)</span>
              </div>
            )}
          </div>

          {/* Next Lesson Button */}
          <Button
            variant={hasNextLesson ? 'primary' : 'outline'}
            size="sm"
            disabled={!hasNextLesson}
            onClick={() => onNavigateLesson('next')}
            className="text-xs"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </footer>

      {/* Weak Area Detection Modal */}
      <WeakAreaDetectionModal
        isOpen={isWeakAreaModalOpen}
        onClose={() => setIsWeakAreaModalOpen(false)}
        report={weakAreaReport}
        subjectName={subject.name}
        topicTitle={topic.title}
        onLaunchAIReview={(prompt) => {
          setIsWeakAreaModalOpen(false);
          onOpenAITutor(prompt, subject.name);
        }}
        onSwitchToStepByStep={() => {
          setIsWeakAreaModalOpen(false);
          setActiveTab('content');
          setExplanationLevel('step_by_step');
        }}
      />
    </div>
  );
};
