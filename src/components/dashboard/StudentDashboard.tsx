import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  ArrowRight,
  Play,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  RefreshCw,
  Zap,
  BarChart2,
  Check,
  Shield,
  Star,
  ExternalLink,
} from 'lucide-react';
import {
  StudentDashboardData,
  INITIAL_DASHBOARD_DATA,
} from '../../data/dashboardData';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { NavigationTab, SubjectItem } from '../../types';

export interface StudentDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectSubject?: (subjectId: string) => void;
  onOpenAITutorWithPrompt?: (prompt: string, subjectName?: string) => void;
  subjects?: SubjectItem[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onSelectSubject,
  onOpenAITutorWithPrompt,
  subjects = [],
}) => {
  const { showToast } = useToast();
  const [data, setData] = useState<StudentDashboardData>(INITIAL_DASHBOARD_DATA);

  // Modals state
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [selectedWeakTopicForPractice, setSelectedWeakTopicForPractice] = useState<string | null>(null);

  // Goal edit inputs
  const [goalMinutesInput, setGoalMinutesInput] = useState(data.todaysGoal.targetMinutes);
  const [goalLessonsInput, setGoalLessonsInput] = useState(data.todaysGoal.targetLessons);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      upcomingTasks: prev.upcomingTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  // Save updated daily goals
  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      todaysGoal: {
        ...prev.todaysGoal,
        targetMinutes: goalMinutesInput,
        targetLessons: goalLessonsInput,
      },
    }));
    setIsEditGoalModalOpen(false);
    showToast({
      type: 'success',
      title: 'Daily Goals Updated',
      message: `Target set to ${goalMinutesInput} minutes and ${goalLessonsInput} lessons.`,
    });
  };

  // Continue Learning handler
  const handleContinueLearning = () => {
    const topSubject = data.enrolledSubjectsProgress[0];
    showToast({
      type: 'info',
      title: 'Resuming Curriculum',
      message: `Opening "${topSubject.currentLessonTitle}" in ${topSubject.name}...`,
    });
    if (onSelectSubject) {
      onSelectSubject(topSubject.id);
    } else {
      onNavigate('subjects');
    }
  };

  // Review weak topic via AI
  const handleReviewWeakTopic = (topicTitle: string, subjectName: string) => {
    if (onOpenAITutorWithPrompt) {
      onOpenAITutorWithPrompt(
        `I need a targeted Socratic diagnostic review of "${topicTitle}" in ${subjectName}. Explain where students commonly make mistakes and give me 2 practice problems.`,
        subjectName
      );
    } else {
      onNavigate('ai_tutor');
    }
  };

  // Start general practice
  const handleStartPractice = (subjectTitle?: string) => {
    setIsPracticeModalOpen(true);
    setSelectedWeakTopicForPractice(subjectTitle || null);
  };

  // Calculated overall goal completion percentage
  const goalMinutesPercent = Math.min(
    100,
    Math.round((data.todaysGoal.completedMinutes / data.todaysGoal.targetMinutes) * 100)
  );
  const goalLessonsPercent = Math.min(
    100,
    Math.round((data.todaysGoal.completedLessons / data.todaysGoal.targetLessons) * 100)
  );
  const totalGoalScore = Math.round((goalMinutesPercent + goalLessonsPercent) / 2);

  // Active weekly hours percentage
  const weeklyHoursPercent = Math.min(
    100,
    Math.round((data.user.weeklyStudyHours / data.user.weeklyTargetHours) * 100)
  );

  // Highest study day in weekly chart
  const maxWeeklyMinutes = Math.max(...data.weeklyStats.map((s) => s.minutes), 240);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* ========================================================
          1. HEADER BANNER: Welcome, Scholar Level, XP Progress
      ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Welcome copy */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {data.user.scholarTitle} · Level {data.user.scholarLevel}
              </span>
              <span className="text-slate-400 text-xs font-mono">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              {getGreeting()}, {data.user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You are currently on a <strong className="text-emerald-400 font-semibold">{data.user.studyStreakDays}-day streak</strong>! You have completed{' '}
              <strong className="text-white font-semibold">{data.todaysGoal.completedMinutes} of {data.todaysGoal.targetMinutes} minutes</strong> of today’s goal.
            </p>
          </div>

          {/* XP & Fast Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* XP progress card */}
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-700/80 min-w-[200px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> Total XP
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {data.user.currentXp.toLocaleString()} / {data.user.nextLevelXp.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${(data.user.currentXp / data.user.nextLevelXp) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block text-right font-mono">
                {data.user.nextLevelXp - data.user.currentXp} XP to Level 5 Scholar
              </span>
            </div>

            {/* Quick Action: Launch Real AI Tools */}
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('ai_tutor')}
              className="shadow-md whitespace-nowrap justify-center"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Launch Real AI Tools
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. CONTINUE LEARNING HERO RESUME CARD
      ======================================================== */}
      {data.enrolledSubjectsProgress[0] && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
              <Play className="w-5 h-5 fill-emerald-600 ml-0.5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Resume Where You Left Off
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {data.enrolledSubjectsProgress[0].name}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                {data.enrolledSubjectsProgress[0].currentLessonTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {data.enrolledSubjectsProgress[0].currentChapter} · Last studied {data.enrolledSubjectsProgress[0].lastStudied}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => handleStartPractice(data.enrolledSubjectsProgress[0].name)}
              className="text-xs sm:text-sm font-semibold"
            >
              <Zap className="w-4 h-4 mr-1.5 text-amber-500" />
              Practice Drill
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleContinueLearning}
              className="text-xs sm:text-sm font-bold shadow-xs"
            >
              <span>Continue Lesson</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================
          3. 4 KEY LEARNING METRICS STAT CARDS
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Streak */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {data.user.studyStreakDays}
              </span>
              <span className="text-sm font-semibold text-slate-600">Days</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Longest: {data.user.longestStreakDays} days</span>
              <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                Active Shield
              </span>
            </div>
          </div>
          {/* Weekly dot matrix */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            {data.streakDaysMatrix.map((d, i) => (
              <div key={i} className="text-center">
                <span className="text-[10px] text-slate-400 block mb-1 font-mono">
                  {d.dayName}
                </span>
                <span
                  className={`w-3.5 h-3.5 rounded-full inline-block ${
                    d.completedGoal
                      ? 'bg-emerald-600 ring-2 ring-emerald-100'
                      : 'bg-slate-200'
                  }`}
                  title={`${d.dayName}: ${d.studiedMinutes} min`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Weekly Study Time */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Time (This Week)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {data.user.weeklyStudyHours}
              </span>
              <span className="text-sm font-semibold text-slate-600">Hours</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Target: {data.user.weeklyTargetHours} hrs/week</span>
              <span className="text-emerald-600 font-semibold font-mono">
                {weeklyHoursPercent}%
              </span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${weeklyHoursPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Total lifetime study: {data.user.totalStudyHours} hours
            </span>
          </div>
        </div>

        {/* Card 3: Lessons Completed */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lessons Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {data.user.completedLessonsCount}
              </span>
              <span className="text-sm font-semibold text-slate-600">Lessons</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Across 5 Enrolled Subjects</span>
              <span className="text-blue-600 font-semibold">+4 this week</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Scholar Tier</span>
            <span className="font-semibold text-slate-800">Advanced 4 / 6</span>
          </div>
        </div>

        {/* Card 4: Quiz Accuracy */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quiz Accuracy
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {data.user.overallAccuracyPercentage}%
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +{data.user.monthlyAccuracyChange}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>76 Quizzes Evaluated</span>
              <span className="text-purple-600 font-medium">Top 8% Tier</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Diagnosed 4 weak topics</span>
            <button
              type="button"
              onClick={() => handleStartPractice()}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Start Drill →
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. CHARTS SECTION: Weekly Study Time Bar Chart & Accuracy Breakdown
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Time Bar Chart (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Learning Analytics
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Weekly Study Time Distribution
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('analytics')}
                className="text-xs h-8 px-2.5 gap-1.5 cursor-pointer text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
              >
                <span>Full Analytics & Diagnostics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* SVG / CSS Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200 relative">
              {/* Daily Target Guide Line (120 min) */}
              <div
                className="absolute left-0 right-0 border-b border-dashed border-slate-300 pointer-events-none"
                style={{ bottom: `${(120 / maxWeeklyMinutes) * 100}%` }}
              >
                <span className="text-[10px] text-slate-400 font-mono -top-4 absolute right-1">
                  Target 120m
                </span>
              </div>

              {data.weeklyStats.map((item, idx) => {
                const heightPercent = Math.round((item.minutes / maxWeeklyMinutes) * 100);
                const isTargetMet = item.minutes >= item.targetMinutes;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-10 font-mono">
                      {item.minutes} mins · {item.lessons} lessons
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isTargetMet
                            ? 'bg-emerald-600 group-hover:bg-emerald-700'
                            : 'bg-emerald-400/80 group-hover:bg-emerald-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-xs font-semibold text-slate-600 font-mono">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-1">
              <span>Avg Study: <strong>144 min / day</strong></span>
              <span className="text-emerald-600 font-semibold">100% Target Met this week!</span>
            </div>
          </div>
        </div>

        {/* Today's Goal Gauge Card (Right 1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Daily Focus
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Today's Goal
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditGoalModalOpen(true)}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Edit Goal
            </button>
          </div>

          {/* Circular / Concentric Goal Progress */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-600 transition-all duration-700 ease-out"
                  strokeDasharray={`${totalGoalScore}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 font-display">
                  {totalGoalScore}%
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Goal items breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Study Minutes
              </span>
              <span className="font-semibold text-slate-900 font-mono">
                {data.todaysGoal.completedMinutes} / {data.todaysGoal.targetMinutes}m
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-600 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Completed Lessons
              </span>
              <span className="font-semibold text-slate-900 font-mono">
                {data.todaysGoal.completedLessons} / {data.todaysGoal.targetLessons}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-600" /> AI Socratic Drill
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Completed ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. SUBJECT PROGRESS CARDS SECTION
      ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Enrolled Curricula
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Subject Progress & Mastery
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('subjects')}
            className="text-xs"
          >
            <span>Explore All 23+ Subjects</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.enrolledSubjectsProgress.map((subj) => (
            <div
              key={subj.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {subj.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {subj.progressPercentage}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display">
                  {subj.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Next: {subj.currentLessonTitle}
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${subj.progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    {subj.completedLessons} of {subj.totalLessons} lessons
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {subj.lastStudied}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleReviewWeakTopic(subj.currentLessonTitle, subj.name)}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  Ask AI Tutor
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (onSelectSubject) onSelectSubject(subj.id);
                    else onNavigate('subjects');
                  }}
                  className="text-xs py-1 h-7"
                >
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          6. DIAGNOSED WEAK TOPICS SECTION (< 65% MASTERY)
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Diagnostic Mastery Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Weak Topics Requiring Review
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified through recent quizzes and problem sets where mastery fell below 65%.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStartPractice()}
            className="text-xs border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Review All Weak Topics
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {data.weakTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">
                    {topic.subjectName} · {topic.chapterTitle}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono">
                    {topic.masteryPercentage}% Mastery
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-display">
                  {topic.topicTitle}
                </h3>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>Recommended Focus:</strong> {topic.recommendedAction}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Last tested: {topic.lastTestedDate}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartPractice(topic.topicTitle)}
                    className="text-xs py-1 h-7"
                  >
                    Take Diagnostic
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReviewWeakTopic(topic.topicTitle, topic.subjectName)}
                    className="text-xs py-1 h-7 bg-amber-600 hover:bg-amber-700 border-amber-600"
                  >
                    <Bot className="w-3.5 h-3.5 mr-1" />
                    AI Socratic Review
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          7. AI RECOMMENDED LEARNING CARDS
      ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              AI Intelligent Curation
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Recommended for You Today
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Curated by Study Zone AI algorithm
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rec.subjectName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {rec.durationMinutes} min
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-display line-clamp-2">
                  {rec.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-snug">
                  {rec.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 font-mono">
                  +{rec.xpReward} XP
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    showToast({
                      type: 'success',
                      title: 'Starting Lesson',
                      message: `Launching "${rec.title}"...`,
                    });
                    if (onSelectSubject) onSelectSubject(rec.subjectId);
                    else onNavigate('subjects');
                  }}
                  className="text-xs py-1 h-7"
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          8. 2-COLUMN SPLIT: RECENT ACTIVITY & UPCOMING TASKS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Audit Trail
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Recent Learning Activity
              </h3>
            </div>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>

          <div className="space-y-3">
            {data.recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    act.type === 'lesson'
                      ? 'bg-emerald-50 text-emerald-600'
                      : act.type === 'quiz'
                      ? 'bg-blue-50 text-blue-600'
                      : act.type === 'ai_chat'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {act.type === 'lesson' && <BookOpen className="w-4 h-4" />}
                  {act.type === 'quiz' && <Award className="w-4 h-4" />}
                  {act.type === 'ai_chat' && <Bot className="w-4 h-4" />}
                  {act.type === 'flashcards' && <Layers className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {act.subjectName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {act.timestamp}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {act.title}
                  </h4>
                  {act.scoreOrProgress && (
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {act.scoreOrProgress}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-amber-600 font-mono shrink-0">
                  +{act.xpEarned} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Academic Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Schedule & Deliverables
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Upcoming Academic Tasks
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {data.upcomingTasks.filter((t) => !t.completed).length} Pending
            </span>
          </div>

          <div className="space-y-2.5">
            {data.upcomingTasks.map((task) => (
              <label
                key={task.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {task.subjectName}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm font-medium leading-snug ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {task.dueDate}</span>
                    {task.isUrgent && !task.completed && (
                      <span className="text-rose-600 font-semibold ml-1">
                        · Urgent
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('planner')}
              className="w-full justify-center text-xs"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Open Full Study Calendar & Roadmap
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL: EDIT DAILY STUDY GOALS
      ======================================================== */}
      <Modal
        isOpen={isEditGoalModalOpen}
        onClose={() => setIsEditGoalModalOpen(false)}
        title="Customize Daily Study Targets"
        description="Calibrate your daily learning goals based on your exam dates and cognitive capacity."
      >
        <form onSubmit={handleSaveGoals} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Study Time (Minutes per Day)
            </label>
            <input
              type="number"
              min={15}
              max={360}
              step={15}
              value={goalMinutesInput}
              onChange={(e) => setGoalMinutesInput(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Recommended: 60 - 90 minutes for optimal spaced retention.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Lessons per Day
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={goalLessonsInput}
              onChange={(e) => setGoalLessonsInput(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditGoalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Daily Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================
          MODAL: TARGET PRACTICE DRILL
      ======================================================== */}
      <Modal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        title="Diagnostic Practice Session"
        description={
          selectedWeakTopicForPractice
            ? `Targeted drill for "${selectedWeakTopicForPractice}".`
            : 'Select a curriculum or launch an AI-generated adaptive diagnostic test.'
        }
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm leading-relaxed">
            <strong className="block font-bold mb-1">Study Zone Adaptive Testing Engine</strong>
            Questions will automatically calibrate from foundational to advanced difficulty based on your real-time responses.
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choose Diagnostic Focus:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.weakTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setIsPracticeModalOpen(false);
                    handleReviewWeakTopic(topic.topicTitle, topic.subjectName);
                  }}
                  className="p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left text-xs transition-all"
                >
                  <span className="font-bold text-slate-900 block truncate">
                    {topic.topicTitle}
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    {topic.subjectName} · {topic.masteryPercentage}% Mastery
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsPracticeModalOpen(false);
                onNavigate('practice');
              }}
            >
              Open Full Practice Arena
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsPracticeModalOpen(false);
                if (onOpenAITutorWithPrompt) {
                  onOpenAITutorWithPrompt(
                    'Generate a 5-question comprehensive diagnostic test covering my top weak topics with explanations.',
                    'Comprehensive'
                  );
                } else {
                  onNavigate('ai_tutor');
                }
              }}
            >
              Launch Adaptive AI Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
