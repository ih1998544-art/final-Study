import React, { useState } from 'react';
import {
  Award,
  Zap,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  Filter,
  Flame,
  Star,
  ChevronDown,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  PracticeMode,
  PracticeTestSummary,
} from '../../types/practice';
import { SubjectItem } from '../../types';
import {
  PRECONFIGURED_TESTS,
  buildPracticeTest,
} from '../../data/practiceData';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PracticeEngineView } from './PracticeEngineView';
import { useToast } from '../ui/Toast';

export interface PracticeDashboardProps {
  subjects: SubjectItem[];
  onOpenAITutor: (prompt: string, subjectName: string) => void;
  onOpenLesson?: (lessonTitle: string, subjectName: string) => void;
  initialSubjectId?: string | null;
}

export const PracticeDashboard: React.FC<PracticeDashboardProps> = ({
  subjects,
  onOpenAITutor,
  onOpenLesson,
  initialSubjectId,
}) => {
  const { showToast } = useToast();

  const [selectedModeFilter, setSelectedModeFilter] = useState<PracticeMode | 'all'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Active Live Test session state
  const [activeTestSession, setActiveTestSession] = useState<{
    testId: string;
    testTitle: string;
    subjectName: string;
    mode: PracticeMode;
    questions: any[];
    durationMinutes: number;
  } | null>(null);

  // Filtered preconfigured tests
  const filteredTests = PRECONFIGURED_TESTS.filter((t) => {
    if (selectedModeFilter !== 'all' && t.mode !== selectedModeFilter) return false;
    if (
      selectedSubjectFilter !== 'all' &&
      t.subjectName.toLowerCase() !== selectedSubjectFilter.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  // Launch a test
  const handleLaunchTest = (test: PracticeTestSummary) => {
    const session = buildPracticeTest(test.subjectName, test.mode);
    setActiveTestSession({
      testId: test.id,
      testTitle: test.title,
      subjectName: test.subjectName,
      mode: test.mode,
      questions: session.questions,
      durationMinutes: test.durationMinutes,
    });
    showToast({
      type: 'info',
      title: 'Practice Test Initialized',
      message: `Starting "${test.title}" (${test.durationMinutes} min timed limit).`,
    });
  };

  // Launch dynamic custom subject test
  const handleLaunchDynamicTest = (subjectName: string, mode: PracticeMode) => {
    const session = buildPracticeTest(subjectName, mode);
    setActiveTestSession({
      testId: session.id,
      testTitle: session.title,
      subjectName: session.subjectName,
      mode: session.mode,
      questions: session.questions,
      durationMinutes: session.durationMinutes,
    });
    showToast({
      type: 'info',
      title: 'Adaptive Drill Launched',
      message: `Configured ${mode.replace('_', ' ')} for ${subjectName}.`,
    });
  };

  // If a test session is actively running, render PracticeEngineView
  if (activeTestSession) {
    return (
      <PracticeEngineView
        testId={activeTestSession.testId}
        testTitle={activeTestSession.testTitle}
        subjectName={activeTestSession.subjectName}
        mode={activeTestSession.mode}
        questions={activeTestSession.questions}
        durationMinutes={activeTestSession.durationMinutes}
        onExit={() => setActiveTestSession(null)}
        onAskAIAboutMistakes={onOpenAITutor}
        onOpenLesson={onOpenLesson}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 animate-fadeIn">
      {/* ========================================================
          1. HEADER BANNER: Practice Hub Overview & Stats
      ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                Adaptive Testing & Diagnostic Engine
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Rigorous Evaluation
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              Practice & Assessment Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Master every academic subject across all 6 question formats: Multiple Choice, True/False, Short Answer, Long Rubric Essay, Numerical Computation, and Code Execution.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Tests Completed
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-display font-mono">
                18
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Avg Accuracy
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-display font-mono">
                88.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TESTING MODES SELECTOR PILLS
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[
          {
            mode: 'topic_practice' as PracticeMode,
            title: 'Topic Practice',
            desc: '5 focused questions on a single concept with hints',
            duration: '10 min',
            icon: BookOpen,
          },
          {
            mode: 'chapter_test' as PracticeMode,
            title: 'Chapter Test',
            desc: 'Standard 8-question curriculum module evaluation',
            duration: '15 min',
            icon: Layers,
          },
          {
            mode: 'subject_test' as PracticeMode,
            title: 'Subject Test',
            desc: '12 multi-format questions testing entire syllabus',
            duration: '25 min',
            icon: Award,
          },
          {
            mode: 'mock_exam' as PracticeMode,
            title: 'Mock Exam',
            desc: 'Full-length rigorous simulation under timed pressure',
            duration: '35 min',
            icon: Sparkles,
          },
          {
            mode: 'timed_quiz' as PracticeMode,
            title: 'Timed Blitz',
            desc: 'Rapid 6-question active recall drill against the clock',
            duration: '5 min',
            icon: Zap,
          },
        ].map((item) => (
          <div
            key={item.mode}
            onClick={() => handleLaunchDynamicTest(subjects[0]?.name || 'Mathematics', item.mode)}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.duration}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {item.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Launch Drill</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          3. FILTER BAR: Subject Selector & Mode Filter
      ======================================================== */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Filter Mode:
          </span>
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'topic_practice', label: 'Topic' },
            { id: 'chapter_test', label: 'Chapter' },
            { id: 'subject_test', label: 'Subject' },
            { id: 'mock_exam', label: 'Mock Exam' },
            { id: 'timed_quiz', label: 'Timed Blitz' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setSelectedModeFilter(btn.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedModeFilter === btn.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Subject:</span>
          <div className="relative">
            <select
              aria-label="Filter by Subject"
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold font-display rounded-lg px-2.5 py-1.5 pr-7 appearance-none cursor-pointer outline-none focus:border-emerald-600"
            >
              <option value="all">All Subjects (23+)</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ========================================================
          4. PRECONFIGURED & RECOMMENDED TESTS GRID
      ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900 font-display">
            Available Practice Tests & Simulations ({filteredTests.length})
          </h2>
          <span className="text-xs text-slate-400">
            Real exam calibration with auto-grading
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {test.subjectName}
                  </span>
                  <Badge variant={test.difficulty === 'Advanced' ? 'warning' : 'neutral'}>
                    {test.difficulty}
                  </Badge>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                  {test.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-2">
                  <span>{test.questionCount} Questions</span>
                  <span>·</span>
                  <span>{test.durationMinutes} Minutes</span>
                  <span>·</span>
                  <span className="text-amber-600 font-bold">+{test.xpReward} XP</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {test.completedBefore ? (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Last Score: {test.lastScorePercentage}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Not attempted yet</span>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLaunchTest(test)}
                  className="text-xs py-1.5 shadow-xs font-semibold"
                >
                  <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                  {test.completedBefore ? 'Retake' : 'Start Test'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
