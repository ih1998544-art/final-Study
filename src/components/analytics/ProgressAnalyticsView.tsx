import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Calendar,
  Flame,
  Target,
  Sparkles,
  BarChart3,
  HelpCircle,
  FileCheck2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  CORE_ANALYTICS_METRICS,
  WEEKLY_STUDY_CHART_DATA,
  SUBJECT_PERFORMANCE_METRICS,
  TOPIC_MASTERY_ITEMS,
  STUDY_TIME_DISTRIBUTION,
  QUIZ_ACCURACY_TREND,
  STRONG_TOPICS_LIST,
  WEAK_TOPICS_LIST,
  IMPROVING_TOPICS_LIST,
  RECOMMENDED_REVISION_LIST,
} from '../../data/analyticsData';
import { WeeklyStudyBarChart } from './charts/WeeklyStudyBarChart';
import { SubjectPerformanceChart } from './charts/SubjectPerformanceChart';
import { TopicMasterySpectrumChart } from './charts/TopicMasterySpectrumChart';
import { StudyTimeDistributionChart } from './charts/StudyTimeDistributionChart';
import { QuizAccuracyTrendChart } from './charts/QuizAccuracyTrendChart';
import { TopicPerformanceSection } from './TopicPerformanceSection';
import { Button } from '../ui/Button';

interface ProgressAnalyticsViewProps {
  onNavigateHome?: () => void;
  onNavigateToSubjects?: () => void;
  onNavigateToPractice?: () => void;
  onNavigateToPlanner?: () => void;
  onNavigateToAITutor?: (prompt?: string) => void;
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  onNavigateHome,
  onNavigateToSubjects,
  onNavigateToPractice,
  onNavigateToPlanner,
  onNavigateToAITutor,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'semester' | 'all'>('30d');
  const [activeSection, setActiveSection] = useState<'all' | 'charts' | 'topics' | 'quizzes'>('all');

  const metrics = CORE_ANALYTICS_METRICS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 pb-24 md:pb-16">
      {/* 1. Hero Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 border border-slate-800 shadow-lg overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Learning Velocity & Diagnostic Insights · Active Cohort Model</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-display text-white">
                Progress & Learning Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Comprehensive empirical tracking of study time velocity, subject accuracy benchmarks, topic mastery spectrum, and diagnostic retention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                Scholar Level 4: Senior Scholar
              </span>
              <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                {metrics.totalStudyHours} Total Hours Recorded
              </span>
              <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                {metrics.overallAccuracyPercentage}% Syllabus Accuracy
              </span>
            </div>
          </div>

          {/* Time Range Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15 flex items-center gap-1">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: 'semester', label: 'Semester' },
                { id: 'all', label: 'All Time' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeRange === range.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {onNavigateToPlanner && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToPlanner}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-9 gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Open Study Planner</span>
              </Button>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. THE 9 CORE TRACKED METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* 1. Study Time */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">1. Study Time</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.totalStudyHours} hrs
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {metrics.dailyAverageMinutes}m / day avg
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.weeklyStudyHours} hrs recorded this week
          </div>
        </div>

        {/* 2. Weekly Progress */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">2. Weekly Progress</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.weeklyCompletionPercentage}%
            </span>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              +{metrics.weeklyHoursChangePercent}% vs Last Wk
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.weeklyStudyHours} / {metrics.weeklyTargetHours} target hours completed
          </div>
        </div>

        {/* 3. Subject Accuracy */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">3. Subject Accuracy</span>
            <Target className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.overallAccuracyPercentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +{metrics.monthlyAccuracyDelta}% this month
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Across all 5 active subject test banks
          </div>
        </div>

        {/* 4. Quiz Performance */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">4. Quiz Performance</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.averageQuizScore}% avg
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {metrics.highestQuizScore}% High Score
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.totalQuizzesTaken} diagnostic quizzes ({metrics.perfectScoresCount} perfect)
          </div>
        </div>

        {/* 5. Topic Mastery */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">5. Topic Mastery</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.masteredTopicsCount} / {metrics.totalTopicsTracked}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {Math.round((metrics.masteredTopicsCount / metrics.totalTopicsTracked) * 100)}% Mastered
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.proficientTopicsCount} Proficient · {metrics.criticalTopicsCount} in Critical Review
          </div>
        </div>

        {/* 6. Study Streak */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">6. Study Streak</span>
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.currentStreakDays} Days
            </span>
            <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
              Record: {metrics.longestStreakDays} Days
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.streakFreezeShields} Streak Freeze Shield Active
          </div>
        </div>

        {/* 7. Completed Lessons */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">7. Completed Lessons</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.completedLessonsCount} / {metrics.totalSyllabusLessons}
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {metrics.syllabusCompletionRate}% Syllabus
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.totalSyllabusLessons - metrics.completedLessonsCount} remaining in semester curriculum
          </div>
        </div>

        {/* 8. Practice Questions */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">8. Practice Questions</span>
            <FileCheck2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.practiceQuestionsSolved} Solved
            </span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {metrics.practiceQuestionAccuracy}% Correct
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.practiceQuestionsCorrect} correct out of {metrics.practiceQuestionsSolved} attempted
          </div>
        </div>

        {/* 9. Exam Scores */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">9. Exam Scores</span>
            <Award className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-display">
              {metrics.latestMockExamScore}% Mock
            </span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              {metrics.projectedGrade}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {metrics.examReadinessPercentage}% overall exam readiness index
          </div>
        </div>
      </div>

      {/* 3. SECTION SWITCHER */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'All Analytics & Charts' },
          { id: 'charts', label: 'Core Visual Charts (5)' },
          { id: 'topics', label: 'Topic Performance Breakdown' },
          { id: 'quizzes', label: 'Quiz Accuracy & Trends' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. THE 5 CHARTS GRID */}
      {(activeSection === 'all' || activeSection === 'charts' || activeSection === 'quizzes') && (
        <div className="space-y-6">
          {/* Chart 1: Weekly Study-Time Bar Chart */}
          <WeeklyStudyBarChart data={WEEKLY_STUDY_CHART_DATA} />

          {/* Grid of 2 Charts: Subject Performance & Study Time Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 2: Subject Performance Chart */}
            <SubjectPerformanceChart metrics={SUBJECT_PERFORMANCE_METRICS} />

            {/* Chart 4: Study-Time Distribution Chart */}
            <StudyTimeDistributionChart
              distribution={STUDY_TIME_DISTRIBUTION}
              totalHours={metrics.totalStudyHours}
            />
          </div>

          {/* Chart 3: Topic Mastery Spectrum Chart */}
          <TopicMasterySpectrumChart topics={TOPIC_MASTERY_ITEMS} />

          {/* Chart 5: Quiz Accuracy Trendline Chart */}
          <QuizAccuracyTrendChart trend={QUIZ_ACCURACY_TREND} />
        </div>
      )}

      {/* 5. TOPIC PERFORMANCE & DIAGNOSTIC MATRICES */}
      {(activeSection === 'all' || activeSection === 'topics') && (
        <div className="pt-2">
          <TopicPerformanceSection
            strongTopics={STRONG_TOPICS_LIST}
            weakTopics={WEAK_TOPICS_LIST}
            improvingTopics={IMPROVING_TOPICS_LIST}
            recommendedRevision={RECOMMENDED_REVISION_LIST}
            onLaunchAITutor={onNavigateToAITutor}
            onLaunchPractice={onNavigateToPractice}
          />
        </div>
      )}
    </div>
  );
};
