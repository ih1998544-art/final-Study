import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  HelpCircle,
  Award,
  Layers,
  FileText,
  Lightbulb,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { SubjectItem, Chapter, Topic, Lesson } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { useToast } from '../ui/Toast';
import { LessonWorkspaceView } from '../learning/LessonWorkspaceView';
import { LearningPathJourneyView } from '../learning/LearningPathJourneyView';

export interface SubjectDetailViewProps {
  subject: SubjectItem;
  onBack: () => void;
  onOpenAITutor: (contextQuery: string) => void;
  onUpdateSubjectProgress: (subjectId: string, updatedChapters: Chapter[], newOverallProgress: number) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  onBack,
  onOpenAITutor,
  onUpdateSubjectProgress,
}) => {
  const { showToast } = useToast();

  // Selected Chapter, Topic, and Lesson
  const chapters = subject.chapters || [];
  const initialChapter = chapters[0] || null;
  const initialTopic = initialChapter?.topics?.[0] || null;
  const initialLesson = initialTopic?.lessons?.[0] || null;

  const [activeChapterId, setActiveChapterId] = useState<string>(initialChapter?.id || '');
  const [activeTopicId, setActiveTopicId] = useState<string>(initialTopic?.id || '');
  const [activeLessonId, setActiveLessonId] = useState<string>(initialLesson?.id || '');
  
  // Phase tabs: [Learn] [Practice] [Quiz] [Review]
  const [activePhase, setActivePhase] = useState<'learn' | 'practice' | 'quiz' | 'review'>('learn');

  // View Mode: 'curriculum' (standard) | 'journey' (11-stage roadmap) | 'workspace' (immersive lesson)
  const [viewMode, setViewMode] = useState<'curriculum' | 'journey' | 'workspace'>('curriculum');

  // Practice check question state
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [isPracticeAnswerSubmitted, setIsPracticeAnswerSubmitted] = useState(false);

  // Active object references
  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];
  const activeTopic = activeChapter?.topics?.find((t) => t.id === activeTopicId) || activeChapter?.topics?.[0];
  const activeLesson = activeTopic?.lessons?.find((l) => l.id === activeLessonId) || activeTopic?.lessons?.[0];

  // All lessons for fluid prev/next navigation
  const allLessons = chapters.flatMap((c) => c.topics.flatMap((t) => t.lessons));
  const currentLessonIndex = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1;

  const handleNavigateLesson = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && hasPrevLesson) {
      const prev = allLessons[currentLessonIndex - 1];
      chapters.forEach((c) => {
        c.topics.forEach((t) => {
          if (t.lessons.some((l) => l.id === prev.id)) {
            setActiveChapterId(c.id);
            setActiveTopicId(t.id);
            setActiveLessonId(prev.id);
          }
        });
      });
    } else if (direction === 'next' && hasNextLesson) {
      const next = allLessons[currentLessonIndex + 1];
      chapters.forEach((c) => {
        c.topics.forEach((t) => {
          if (t.lessons.some((l) => l.id === next.id)) {
            setActiveChapterId(c.id);
            setActiveTopicId(t.id);
            setActiveLessonId(next.id);
          }
        });
      });
    }
  };

  // Handler for marking lesson completed
  const handleCompleteLesson = () => {
    if (!activeLesson) return;

    const updatedChapters = chapters.map((ch) => {
      const updatedTopics = ch.topics.map((top) => {
        const updatedLessons = top.lessons.map((les) => {
          if (les.id === activeLesson.id) {
            return { ...les, completed: true };
          }
          return les;
        });

        // Compute topic progress
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const total = updatedLessons.length || 1;
        const progressPercentage = Math.round((completedCount / total) * 100);
        const status =
          progressPercentage === 100
            ? ('completed' as const)
            : progressPercentage > 0
            ? ('in_progress' as const)
            : top.status;

        return { ...top, lessons: updatedLessons, progressPercentage, status };
      });

      const avgTopicProgress = Math.round(
        updatedTopics.reduce((acc, t) => acc + t.progressPercentage, 0) / (updatedTopics.length || 1)
      );

      return { ...ch, topics: updatedTopics, progressPercentage: avgTopicProgress };
    });

    const newOverall = Math.round(
      updatedChapters.reduce((acc, c) => acc + c.progressPercentage, 0) / (updatedChapters.length || 1)
    );

    onUpdateSubjectProgress(subject.id, updatedChapters, newOverall);

    showToast({
      type: 'success',
      title: 'Lesson Completed!',
      message: `You earned +${activeLesson.xp} XP and advanced your mastery in ${subject.name}.`,
    });
  };

  // 1. IF JOURNEY VIEW MODE IS ACTIVE:
  if (viewMode === 'journey') {
    return (
      <div className="space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
          <button
            onClick={() => setViewMode('curriculum')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curriculum Outline</span>
          </button>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            11-Stage Roadmap Mode
          </span>
        </div>
        <LearningPathJourneyView
          subjects={[subject]}
          currentSubjectId={subject.id}
          onSelectSubjectId={() => {}}
          onOpenAITutor={(prompt) => onOpenAITutor(prompt)}
          onUpdateSubjectProgress={onUpdateSubjectProgress}
        />
      </div>
    );
  }

  // 2. IF WORKSPACE VIEW MODE IS ACTIVE:
  if (viewMode === 'workspace' && activeLesson && activeChapter && activeTopic) {
    return (
      <LessonWorkspaceView
        subject={subject}
        chapter={activeChapter}
        topic={activeTopic}
        lesson={activeLesson}
        onBackToTopic={() => setViewMode('curriculum')}
        onNavigateLesson={handleNavigateLesson}
        hasPrevLesson={hasPrevLesson}
        hasNextLesson={hasNextLesson}
        onCompleteLesson={(lessonId) => {
          handleCompleteLesson();
        }}
        onOpenAITutor={(prompt) => onOpenAITutor(prompt)}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Breadcrumbs & Return Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Subjects</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Subjects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{subject.name}</span>
          {activeChapter && (
            <>
              <span>/</span>
              <span className="text-emerald-700 font-medium truncate max-w-[140px] sm:max-w-xs">
                {activeChapter.title}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 2. Subject Header Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded font-semibold border border-emerald-200/80">
                {subject.category}
              </span>
              <Badge
                variant={
                  subject.difficulty === 'Beginner'
                    ? 'neutral'
                    : subject.difficulty === 'Intermediate'
                    ? 'brand'
                    : 'warning'
                }
              >
                {subject.difficulty} Level
              </Badge>
              <span className="text-xs text-slate-400">
                ~{subject.estimatedHours} Total Hours
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              {subject.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Progress Card */}
          <div className="w-full lg:w-72 bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Overall Curriculum Progress</span>
              <span className="font-mono text-emerald-700 font-bold text-sm">
                {subject.overallProgress}%
              </span>
            </div>

            <ProgressBar value={subject.overallProgress} size="md" variant="brand" showPercentage={false} />

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{subject.chapterCount} Chapters</span>
              <span>·</span>
              <span>{subject.topicsCount} Topics</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 View Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Learning Experience:
          </span>
          <button
            type="button"
            onClick={() => setViewMode('curriculum')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-emerald-600 text-white shadow-xs"
          >
            Curriculum Outline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('journey')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>11-Stage Journey Roadmap</span>
          </button>
        </div>

        {activeLesson && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setViewMode('workspace')}
            className="text-xs py-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
            <span>Launch Full Lesson Workspace</span>
          </Button>
        )}
      </div>

      {/* 3. Smart Learning Path Bar (Assessment -> Learning -> Practice -> Quiz -> Weak Area Detection -> Revision -> Mastery) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[650px] gap-2 text-xs">
          {[
            { label: 'Assessment', done: true },
            { label: 'Learning', done: true, current: true },
            { label: 'Practice', done: subject.overallProgress > 20 },
            { label: 'Quiz', done: subject.overallProgress > 40 },
            { label: 'Weak Detection', done: subject.overallProgress > 60 },
            { label: 'Revision', done: subject.overallProgress > 80 },
            { label: 'Mastery', done: subject.overallProgress === 100 },
          ].map((step, idx, arr) => (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                    step.current
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                      : step.done
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step.done && !step.current ? '✓' : `0${idx + 1}`}
                </span>
                <span
                  className={`font-medium ${
                    step.current
                      ? 'text-emerald-800 font-bold'
                      : step.done
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex-1 h-px bg-slate-200 mx-1 min-w-[20px]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. Two-Column System: Chapter / Topic Hierarchy (Left) & Lesson Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chapters & Topics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Chapters & Topics</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {chapters.length} Modules
              </span>
            </div>

            {/* Chapter Accordion List */}
            <div className="space-y-3">
              {chapters.map((chapter) => {
                const isChapterActive = chapter.id === activeChapterId;

                return (
                  <div
                    key={chapter.id}
                    className={`rounded-xl border transition-all ${
                      isChapterActive
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200/80 bg-white'
                    }`}
                  >
                    {/* Chapter Header */}
                    <button
                      onClick={() => setActiveChapterId(chapter.id)}
                      className="w-full p-3.5 text-left flex items-start justify-between gap-2 cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded">
                            CH 0{chapter.number}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {chapter.title}
                          </span>
                        </div>
                        <div className="w-32">
                          <ProgressBar value={chapter.progressPercentage} size="sm" showPercentage={false} />
                        </div>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform ${
                          isChapterActive ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Topics Sub-list */}
                    {isChapterActive && (
                      <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-slate-100">
                        {chapter.topics.map((topic) => {
                          const isTopicActive = topic.id === activeTopicId;

                          return (
                            <div key={topic.id} className="space-y-1">
                              <button
                                onClick={() => {
                                  setActiveTopicId(topic.id);
                                  if (topic.lessons.length > 0) {
                                    setActiveLessonId(topic.lessons[0].id);
                                    setIsPracticeAnswerSubmitted(false);
                                    setSelectedPracticeOption(null);
                                  }
                                }}
                                className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                  isTopicActive
                                    ? 'bg-white shadow-xs text-emerald-800 font-semibold border border-slate-200'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {topic.status === 'completed' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : topic.status === 'in_progress' ? (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                                  )}
                                  <span className="truncate">{topic.title}</span>
                                </div>
                                <span className="text-[10px] font-mono tabular-nums text-slate-400 shrink-0">
                                  {topic.progressPercentage}%
                                </span>
                              </button>

                              {/* Lessons nested under active topic */}
                              {isTopicActive && topic.lessons.length > 0 && (
                                <div className="pl-4 pr-1 py-1 space-y-1">
                                  {topic.lessons.map((les) => {
                                    const isLesActive = les.id === activeLessonId;
                                    return (
                                      <button
                                        key={les.id}
                                        onClick={() => {
                                          setActiveLessonId(les.id);
                                          setIsPracticeAnswerSubmitted(false);
                                          setSelectedPracticeOption(null);
                                        }}
                                        className={`w-full px-2 py-1.5 rounded text-left text-[11px] flex items-center justify-between cursor-pointer ${
                                          isLesActive
                                            ? 'bg-emerald-100 text-emerald-900 font-medium'
                                            : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                      >
                                        <div className="flex items-center gap-1.5 truncate">
                                          {les.completed ? (
                                            <span className="text-emerald-700">✓</span>
                                          ) : (
                                            <span className="text-slate-300">○</span>
                                          )}
                                          <span className="truncate">{les.title}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 shrink-0">
                                          {les.durationMinutes}m
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Tutor Quick Access Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-slate-50 p-5 rounded-xl border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Study Zone Socratic Coach</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confused by anything in {activeTopic?.title || subject.name}? Launch a real-time Socratic dialogue.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center bg-white"
              onClick={() => onOpenAITutor(`Explain ${activeLesson?.title || activeTopic?.title || subject.name} in simple terms`)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Ask AI Tutor About Lesson
            </Button>
          </div>
        </div>

        {/* Right Column: Interactive Lesson Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
              {/* Top Lesson Control Bar */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 mb-1">
                    <span>{activeChapter?.title}</span>
                    <span>·</span>
                    <span>{activeTopic?.title}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                    {activeLesson.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeLesson.durationMinutes} min read</span>
                  </div>
                  <Badge variant={activeLesson.completed ? 'success' : 'neutral'}>
                    {activeLesson.completed ? 'Completed (+XP)' : 'In Progress'}
                  </Badge>
                </div>
              </div>

              {/* 4-Phase Topic Navigation: [Learn] [Practice] [Quiz] [Review] */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'learn', label: '1. Learn Concept', icon: BookOpen },
                  { id: 'practice', label: '2. Practice Example', icon: Lightbulb },
                  { id: 'quiz', label: '3. Quick Quiz Check', icon: HelpCircle },
                  { id: 'review', label: '4. Cornell Review', icon: FileText },
                ].map((phase) => {
                  const Icon = phase.icon;
                  const isActive = activePhase === phase.id;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => setActivePhase(phase.id as typeof activePhase)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{phase.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lesson Body Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* PHASE 1: LEARN */}
                {activePhase === 'learn' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                      <span className="font-bold text-slate-900 font-display block uppercase tracking-wider text-[11px] text-emerald-700">
                        Overview
                      </span>
                      <p>{activeLesson.content.overview}</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        Theoretical Breakdown
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {activeLesson.content.explanation}
                      </p>
                    </div>

                    {/* Formula / Code Block */}
                    {activeLesson.content.formulaOrCodeSnippet && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-mono">
                          Governing Equation / Formulation
                        </span>
                        <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                          {activeLesson.content.formulaOrCodeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                        Core Principles & Takeaways
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc">
                        {activeLesson.content.keyTakeaways.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* PHASE 2: PRACTICE */}
                {activePhase === 'practice' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        Real-World Context & Solved Examples
                      </h3>
                      <div className="space-y-3">
                        {activeLesson.content.examples.map((ex, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <span className="font-bold text-xs text-slate-900 block font-display">
                              Case {idx + 1}: {ex.title}
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {ex.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>Ready to test your comprehension?</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActivePhase('quiz')}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Take Concept Check Quiz
                      </Button>
                    </div>
                  </div>
                )}

                {/* PHASE 3: QUIZ */}
                {activePhase === 'quiz' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-emerald-800">
                          Immediate Concept Check
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          1 Question · 100% Passing Required
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-900">
                        {activeLesson.content.checkQuestion.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {activeLesson.content.checkQuestion.options.map((option, idx) => {
                          const isSelected = selectedPracticeOption === idx;
                          const isCorrect = idx === activeLesson.content.checkQuestion.correctIndex;

                          let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                          if (isPracticeAnswerSubmitted) {
                            if (isCorrect) {
                              style = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                            } else if (isSelected) {
                              style = 'bg-rose-100 border-rose-300 text-rose-900';
                            }
                          } else if (isSelected) {
                            style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium ring-1 ring-emerald-500';
                          }

                          return (
                            <button
                              key={idx}
                              disabled={isPracticeAnswerSubmitted}
                              onClick={() => setSelectedPracticeOption(idx)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${style}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPracticeOption(null);
                            setIsPracticeAnswerSubmitted(false);
                          }}
                          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        >
                          Reset
                        </Button>

                        {!isPracticeAnswerSubmitted ? (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={selectedPracticeOption === null}
                            onClick={() => setIsPracticeAnswerSubmitted(true)}
                          >
                            Verify Answer
                          </Button>
                        ) : (
                          <Badge variant="success" dot>
                            Verified
                          </Badge>
                        )}
                      </div>

                      {isPracticeAnswerSubmitted && (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-xs text-slate-700">
                          <span className="font-bold text-emerald-800 block">
                            Diagnostic Explanation:
                          </span>
                          <p className="leading-relaxed">
                            {activeLesson.content.checkQuestion.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PHASE 4: REVIEW */}
                {activePhase === 'review' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        Cornell Synthesis & Spaced Repetition Flashcard
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] text-emerald-700">
                            Recall Cue Questions
                          </span>
                          <ul className="text-slate-600 space-y-1 list-disc pl-4">
                            <li>What causes change in momentum?</li>
                            <li>How does mass modulate acceleration?</li>
                            <li>Why do third law forces not cancel?</li>
                          </ul>
                        </div>
                        <div className="md:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] text-emerald-700">
                            Summary & Mnemonics
                          </span>
                          <p className="text-slate-600 leading-relaxed">
                            Newtonian dynamics rests on three symmetry principles: conservation of state in the absence of net force (Law 1), proportionality between impetus and acceleration (Law 2), and mutual recoil reciprocity (Law 3).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenAITutor(`Tell me more about ${activeLesson.title}`)}
                  leftIcon={<Bot className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Discuss with AI Tutor
                </Button>

                <div className="flex items-center gap-3">
                  {!activeLesson.completed ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCompleteLesson}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Mark Lesson as Completed (+{activeLesson.xp} XP)
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      leftIcon={<Check className="w-3.5 h-3.5 text-emerald-600" />}
                    >
                      Lesson Completed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Select a topic or lesson to begin
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose any chapter from the left navigation tree to view theoretical notes, formulas, and interactive quizzes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
