import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  Zap,
  Award,
  Layers,
  RotateCcw,
  Target,
  ChevronDown,
  Play,
  Check,
  Lock,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { SubjectItem, Chapter, Topic, Lesson } from '../../types';
import { DiagnosticAssessmentQuestion } from '../../types/learning';
import { learningContentService } from '../../services/learningContentService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { DiagnosticAssessmentModal } from './DiagnosticAssessmentModal';
import { LessonWorkspaceView } from './LessonWorkspaceView';
import { useToast } from '../ui/Toast';

export interface LearningPathJourneyViewProps {
  subjects: SubjectItem[];
  currentSubjectId?: string | null;
  onSelectSubjectId: (id: string) => void;
  onOpenAITutor: (prompt: string, subjectName?: string) => void;
  onUpdateSubjectProgress?: (
    subjectId: string,
    updatedChapters: Chapter[],
    newOverallProgress: number
  ) => void;
}

export const LearningPathJourneyView: React.FC<LearningPathJourneyViewProps> = ({
  subjects,
  currentSubjectId,
  onSelectSubjectId,
  onOpenAITutor,
  onUpdateSubjectProgress,
}) => {
  const { showToast } = useToast();

  // Active Subject
  const activeSubject =
    subjects.find((s) => s.id === currentSubjectId) ||
    subjects.find((s) => s.name === 'Mathematics') ||
    subjects[0];

  const chapters = activeSubject.chapters || [];

  // Active navigation selection: Chapter -> Topic -> Lesson
  const [activeChapterId, setActiveChapterId] = useState<string>(chapters[0]?.id || '');
  const [activeTopicId, setActiveTopicId] = useState<string>(chapters[0]?.topics?.[0]?.id || '');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Diagnostic Pre-Assessment Modal
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const currentChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];
  const currentTopic = currentChapter?.topics?.find((t) => t.id === activeTopicId) || currentChapter?.topics?.[0];
  const currentLesson = currentTopic?.lessons?.find((l) => l.id === activeLessonId) || null;

  // Flattened list of all lessons in current subject for seamless prev/next
  const allLessons = chapters.flatMap((c) => c.topics.flatMap((t) => t.lessons));
  const currentLessonIndex = currentLesson ? allLessons.findIndex((l) => l.id === currentLesson.id) : -1;
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1;

  // Diagnostic questions
  const diagnosticQuestions: DiagnosticAssessmentQuestion[] =
    learningContentService.getDiagnosticAssessment(activeSubject.name);

  // Navigate Previous / Next Lesson
  const handleNavigateLesson = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && hasPrevLesson) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      // Locate chapter and topic for this lesson
      chapters.forEach((c) => {
        c.topics.forEach((t) => {
          if (t.lessons.some((l) => l.id === prevLesson.id)) {
            setActiveChapterId(c.id);
            setActiveTopicId(t.id);
            setActiveLessonId(prevLesson.id);
          }
        });
      });
    } else if (direction === 'next' && hasNextLesson) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      chapters.forEach((c) => {
        c.topics.forEach((t) => {
          if (t.lessons.some((l) => l.id === nextLesson.id)) {
            setActiveChapterId(c.id);
            setActiveTopicId(t.id);
            setActiveLessonId(nextLesson.id);
          }
        });
      });
    }
  };

  // Mark Lesson as Complete
  const handleCompleteLesson = (lessonId: string) => {
    const updatedChapters = chapters.map((ch) => {
      const updatedTopics = ch.topics.map((top) => {
        const updatedLessons = top.lessons.map((les) => {
          if (les.id === lessonId) {
            return { ...les, completed: true };
          }
          return les;
        });

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

    if (onUpdateSubjectProgress) {
      onUpdateSubjectProgress(activeSubject.id, updatedChapters, newOverall);
    }
  };

  // Assessment completed
  const handleAssessmentComplete = (score: number, total: number) => {
    setAssessmentScore(score);
    showToast({
      type: 'success',
      title: 'Assessment Baseline Registered',
      message: `Score: ${score} of ${total} (${Math.round((score / total) * 100)}%). Your learning path has been calibrated!`,
    });
  };

  // If a lesson is actively open, render the full-screen LessonWorkspaceView
  if (currentLesson && currentChapter && currentTopic) {
    return (
      <LessonWorkspaceView
        subject={activeSubject}
        chapter={currentChapter}
        topic={currentTopic}
        lesson={currentLesson}
        onBackToTopic={() => setActiveLessonId(null)}
        onNavigateLesson={handleNavigateLesson}
        hasPrevLesson={hasPrevLesson}
        hasNextLesson={hasNextLesson}
        onCompleteLesson={handleCompleteLesson}
        onOpenAITutor={onOpenAITutor}
      />
    );
  }

  // 11-Stage Learning Journey Definition
  const journeyStages = [
    { id: 'assessment', label: '1. Diagnostic Assessment', desc: 'Calibrate existing baseline knowledge' },
    { id: 'path', label: '2. Learning Path', desc: 'Personalized curriculum progression roadmap' },
    { id: 'chapter', label: '3. Chapter Core', desc: 'Formal curriculum syllabus unit' },
    { id: 'topic', label: '4. Topic Deep-Dive', desc: 'Specific conceptual building blocks' },
    { id: 'lesson', label: '5. Multi-Depth Lesson', desc: '5-tier pedagogical explanations (ELI5 to Proof)' },
    { id: 'examples', label: '6. Worked Examples', desc: 'Real-world problem walkthroughs' },
    { id: 'practice', label: '7. Adaptive Practice', desc: 'Progressive problem solving with tiered hints' },
    { id: 'quiz', label: '8. Topic Quiz', desc: 'Diagnostic multiple-choice verification' },
    { id: 'weak_area', label: '9. Weak Area Detection', desc: 'Automated misconception diagnosis' },
    { id: 'revision', label: '10. Rapid Revision', desc: '10-minute cheat sheets & active recall triggers' },
    { id: 'mastery', label: '11. Verified Mastery', desc: 'Curriculum completion certification' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* ========================================================
          1. HEADER BANNER & SUBJECT SELECTOR
      ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Complete 11-Stage Learning System
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Mastery Framework
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              {activeSubject.name} Learning Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Step through our research-backed pedagogical cycle: from pre-assessment to multi-depth explanations, interactive practice, automated weak-area detection, and rapid revision.
            </p>
          </div>

          {/* Subject Switcher & Pre-Assessment Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <select
                aria-label="Select Subject"
                value={activeSubject.id}
                onChange={(e) => {
                  onSelectSubjectId(e.target.value);
                  const newSubj = subjects.find((s) => s.id === e.target.value);
                  if (newSubj?.chapters?.[0]) {
                    setActiveChapterId(newSubj.chapters[0].id);
                    setActiveTopicId(newSubj.chapters[0].topics[0]?.id || '');
                  }
                }}
                className="bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-bold font-display rounded-xl px-3 py-2 pr-8 appearance-none cursor-pointer outline-none focus:border-emerald-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-emerald-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAssessmentModalOpen(true)}
              className="whitespace-nowrap shadow-md"
            >
              <Target className="w-4 h-4 mr-2" />
              <span>{assessmentScore !== null ? `Baseline: ${assessmentScore}/4` : 'Take Pre-Assessment'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. VISUAL 11-STAGE LEARNING JOURNEY TIMELINE
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Pedagogical Architecture
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              The 11-Stage Learning Cycle
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Subject Progress: <strong className="text-emerald-700">{activeSubject.overallProgress}%</strong>
          </span>
        </div>

        {/* 11 Horizontal Roadmap Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {journeyStages.slice(0, 6).map((stage, idx) => (
            <div
              key={stage.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all text-left space-y-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Stage {idx + 1}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate font-display">
                {stage.label.replace(/^\d+\.\s*/, '')}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {journeyStages.slice(6).map((stage, idx) => (
            <div
              key={stage.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all text-left space-y-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Stage {idx + 7}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate font-display">
                {stage.label.replace(/^\d+\.\s*/, '')}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. CHAPTERS DIRECTORY & TOPIC DRILLDOWN
      ======================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Curriculum Units
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Chapters in {activeSubject.name} ({chapters.length} Chapters)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chapters Navigation List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Select Chapter:
            </span>
            {chapters.map((ch, idx) => {
              const isSelected = ch.id === currentChapter?.id;
              const completedCount = ch.topics.filter((t) => t.status === 'completed').length;

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterId(ch.id);
                    setActiveTopicId(ch.topics[0]?.id || '');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-emerald-700">
                      Chapter {ch.number}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {ch.progressPercentage}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-display leading-snug">
                    {ch.title}
                  </h3>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${ch.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{ch.topics.length} Topics</span>
                    <span>{completedCount} / {ch.topics.length} Mastered</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 2 Columns: Topics & Lessons Grid inside selected Chapter */}
          {currentChapter && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              {/* Chapter Header */}
              <div className="pb-4 border-b border-slate-100 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Chapter {currentChapter.number} Curriculum
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Estimated Duration: {currentChapter.topics.length * 45} mins
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {currentChapter.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentChapter.description}
                </p>
              </div>

              {/* Topics List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Topics & Lessons in this Chapter:
                </h4>

                {currentChapter.topics.map((top, tIdx) => (
                  <div
                    key={top.id}
                    className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all space-y-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                          {tIdx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                          {top.title}
                        </h4>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          top.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : top.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {top.status === 'completed' ? '✓ Completed' : top.status === 'in_progress' ? 'In Progress' : 'Available'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {top.description}
                    </p>

                    {/* Lessons list in topic */}
                    <div className="space-y-2 pt-1 border-t border-slate-200/70">
                      {top.lessons.map((les) => (
                        <div
                          key={les.id}
                          className="p-3 rounded-lg bg-white border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                                les.completed
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-300'
                              }`}
                            >
                              {les.completed && '✓'}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-semibold text-slate-900 block truncate">
                                {les.title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {les.durationMinutes} min · +{les.xp} XP
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                onOpenAITutor(
                                  `I want an AI Socratic preview of "${les.title}" in ${activeSubject.name}. Explain the main takeaway.`,
                                  activeSubject.name
                                );
                              }}
                              className="text-xs py-1 h-7"
                            >
                              <Bot className="w-3 h-3 mr-1 text-emerald-600" />
                              AI Tutor
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setActiveChapterId(currentChapter.id);
                                setActiveTopicId(top.id);
                                setActiveLessonId(les.id);
                              }}
                              className="text-xs py-1 h-7 shadow-xs font-semibold"
                            >
                              <Play className="w-3 h-3 mr-1 fill-white" />
                              {les.completed ? 'Review' : 'Start Lesson'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pre-Assessment Diagnostic Modal */}
      <DiagnosticAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        subjectName={activeSubject.name}
        questions={diagnosticQuestions}
        onCompleteAssessment={handleAssessmentComplete}
      />
    </div>
  );
};
