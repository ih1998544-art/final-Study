import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCw,
  Plus,
  SkipForward,
  CalendarDays,
  Target,
  BookOpen,
  Layers,
  Award,
  Zap,
  Flame,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  BarChart3,
  BookmarkCheck,
  RefreshCw,
  Check,
} from 'lucide-react';
import {
  CompleteStudyPlan,
  PlannerTask,
  DaySchedule,
  ExamTargetConfig,
} from '../../types/planner';
import { studyPlannerService } from '../../services/studyPlannerService';
import { PlannerSetupModal } from './PlannerSetupModal';
import { RescheduleTaskModal } from './RescheduleTaskModal';
import { AddTaskModal } from './AddTaskModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface StudyPlannerViewProps {
  onNavigateToSubjects?: () => void;
  onNavigateToPractice?: () => void;
  onNavigateToAITutor?: (prompt?: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  onNavigateToSubjects,
  onNavigateToPractice,
  onNavigateToAITutor,
}) => {
  const [plan, setPlan] = useState<CompleteStudyPlan>(() => studyPlannerService.getPlan());
  const [activeTab, setActiveTab] = useState<
    'calendar' | 'weekly_plan' | 'revision' | 'practice' | 'exam_prep' | 'weak_topics'
  >('calendar');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [reschedulingTask, setReschedulingTask] = useState<PlannerTask | null>(null);
  const [addingTaskDay, setAddingTaskDay] = useState<string | null>(null);
  const { showToast } = useToast();

  const progress = studyPlannerService.getProgress(plan);

  // Calculate days remaining to exam
  const calculateDaysRemaining = (examDateStr: string): number => {
    try {
      const examDate = new Date(examDateStr);
      const today = new Date('2026-09-27');
      const diffTime = examDate.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 52;
    }
  };

  const daysRemaining = calculateDaysRemaining(plan.config.examDate);

  const handleToggleTask = (taskId: string, topicName: string) => {
    const updated = studyPlannerService.toggleTaskStatus(taskId);
    setPlan(updated);
    showToast({
      type: 'success',
      title: 'Task Updated',
      message: `"${topicName}" marked as completed.`,
    });
  };

  const handleSkipTask = (taskId: string, topicName: string) => {
    const updated = studyPlannerService.skipTask(taskId);
    setPlan(updated);
    showToast({
      type: 'info',
      title: 'Task Skipped',
      message: `"${topicName}" skipped. You can reschedule anytime.`,
    });
  };

  const handleRescheduleConfirm = (taskId: string, targetDay: string) => {
    const updated = studyPlannerService.rescheduleTask(taskId, targetDay);
    setPlan(updated);
    showToast({
      type: 'success',
      title: 'Task Rescheduled',
      message: `Moved to ${targetDay}'s study block.`,
    });
  };

  const handleAddTaskConfirm = (
    dayName: string,
    taskData: Omit<PlannerTask, 'id' | 'status' | 'dayName' | 'date'>
  ) => {
    const updated = studyPlannerService.addTask(dayName, taskData);
    setPlan(updated);
    showToast({
      type: 'success',
      title: 'Task Added',
      message: `New session added to ${dayName}.`,
    });
  };

  const handleGenerateNewPlan = (config: ExamTargetConfig) => {
    const freshPlan = studyPlannerService.generatePlan(config);
    setPlan(freshPlan);
    showToast({
      type: 'success',
      title: 'AI Study Plan Generated',
      message: `Personalized schedule synthesized for ${config.examName}.`,
    });
  };

  const handleReset = () => {
    const freshPlan = studyPlannerService.resetToDefault();
    setPlan(freshPlan);
    showToast({
      type: 'info',
      title: 'Planner Reset',
      message: 'Restored standard university syllabus curriculum.',
    });
  };

  // Find today's day schedule
  const todaySchedule = plan.days.find((d) => d.isToday) || plan.days[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-16">
      {/* 1. Header Banner & Exam Countdown Hero */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 border border-slate-800 shadow-lg overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Study Planner Engine · 4 Weak Areas Prioritized</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-white">
                {plan.config.examName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Exam Scheduled: <strong className="text-emerald-300">{plan.config.examDate}</strong> ·{' '}
                {plan.config.availableHoursPerDay} hrs/day allocation · {plan.config.difficulty} Intensity
              </p>
            </div>

            {/* Quick Goals Pill Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {plan.config.goals.slice(0, 3).map((g, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-white/10 text-slate-200 px-2.5 py-0.5 rounded-full border border-white/15"
                >
                  ✓ {g}
                </span>
              ))}
            </div>
          </div>

          {/* Right Action & Countdown Metric Card */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-display font-black text-2xl">
                {daysRemaining}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Days Remaining
                </div>
                <div className="text-sm font-bold text-white font-display">
                  T-Minus Countdown
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSetupModalOpen(true)}
                className="gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Customize Plan</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5 cursor-pointer"
                title="Restore default curriculum"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Row: Overall Progress, Total Tasks, Minutes Studied */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Progress */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium">Study Plan Progress</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900 font-display">
                {progress.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                {progress.completedTasks}/{progress.totalTasks} Tasks
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Focus */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium">Today's Target</div>
            <div className="text-lg font-bold text-slate-900 font-display truncate">
              {todaySchedule.totalMinutes} Minutes
            </div>
            <div className="text-xs text-slate-400">
              {todaySchedule.tasks.filter((t) => t.status === 'completed').length}/
              {todaySchedule.tasks.length} Completed Today
            </div>
          </div>
        </div>

        {/* Metric 3: Weak Topics Remedies */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium">Weak Topics Synced</div>
            <div className="text-lg font-bold text-slate-900 font-display truncate">
              4 Prioritized
            </div>
            <div className="text-xs text-amber-700 font-medium">
              Direct from Diagnostic Quizzes
            </div>
          </div>
        </div>

        {/* Metric 4: Total Study Hours */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 font-medium">Completed Time</div>
            <div className="text-lg font-bold text-slate-900 font-display truncate">
              {(progress.completedMinutes / 60).toFixed(1)} hrs
            </div>
            <div className="text-xs text-slate-400">
              of {(progress.totalMinutes / 60).toFixed(1)} hrs scheduled
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs: Calendar, Weekly, Revision, Practice, Exam Prep, Weak Topics */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'calendar', label: 'Daily & Weekly Calendar', icon: CalendarDays },
          { id: 'weekly_plan', label: '4-Week Curriculum Plan', icon: BookOpen },
          { id: 'revision', label: 'Revision Schedule', icon: Layers },
          { id: 'practice', label: 'Practice Schedule', icon: Award },
          { id: 'exam_prep', label: 'Exam Countdown Prep', icon: Target },
          { id: 'weak_topics', label: 'Weak Topics Remediation', icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: DAILY & WEEKLY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Today's Focus Card */}
          <div className="bg-white rounded-xl border border-emerald-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                    <span>Today's Sessions · {todaySchedule.dayName} ({todaySchedule.date})</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Day
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Total: {todaySchedule.totalMinutes} min scheduled · Complete, skip, or reschedule sessions
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddingTaskDay(todaySchedule.dayName)}
                className="text-xs h-8 gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Session Today</span>
              </Button>
            </div>

            {/* Today's Task Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {todaySchedule.tasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isSkipped = task.status === 'skipped';

                return (
                  <div
                    key={task.id}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isSkipped
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-display">
                          {task.subject} — {task.durationMinutes} min
                        </span>
                        {task.isWeakTopicRemedy && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Weak Area
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold text-slate-900 font-display ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.topic}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      {task.weakTopicNote && (
                        <div className="text-[11px] text-amber-700 bg-amber-50/70 p-1.5 rounded border border-amber-200/60 mt-1">
                          ⚡ {task.weakTopicNote}
                        </div>
                      )}
                    </div>

                    {/* Task Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {/* Complete Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id, task.topic)}
                        className={`inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Skip Button */}
                        <button
                          type="button"
                          onClick={() => handleSkipTask(task.id, task.topic)}
                          className={`p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer ${
                            isSkipped ? 'text-amber-600' : ''
                          }`}
                          title={isSkipped ? 'Unskip task' : 'Skip task'}
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>

                        {/* Reschedule Button */}
                        <button
                          type="button"
                          onClick={() => setReschedulingTask(task)}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                          title="Reschedule to another day"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Calendar Matrix View */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Weekly Timetable & Session Allocations
                </h3>
                <p className="text-xs text-slate-500">
                  Example: Monday: Mathematics — 45 min, Physics — 30 min, Revision — 20 min
                </p>
              </div>

              {/* Day Filter */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedDayFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    selectedDayFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All 7 Days
                </button>
                {plan.days.map((d) => (
                  <button
                    key={d.dayName}
                    onClick={() => setSelectedDayFilter(d.dayName)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      selectedDayFilter === d.dayName
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.dayName.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plan.days
                .filter((d) => selectedDayFilter === 'all' || selectedDayFilter === d.dayName)
                .map((day) => {
                  return (
                    <div
                      key={day.dayName}
                      className={`bg-white rounded-xl border p-4 flex flex-col justify-between shadow-xs transition-all ${
                        day.isToday
                          ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                          : 'border-slate-200/90'
                      }`}
                    >
                      {/* Day Header */}
                      <div>
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-900 font-display">
                                {day.dayName}
                              </span>
                              {day.isToday && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  Today
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">{day.date}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-700">
                              {day.totalMinutes}m
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {day.tasks.length} {day.tasks.length === 1 ? 'task' : 'tasks'}
                            </div>
                          </div>
                        </div>

                        {/* Task List */}
                        <div className="mt-3 space-y-2.5">
                          {day.tasks.map((task) => {
                            const isCompleted = task.status === 'completed';
                            const isSkipped = task.status === 'skipped';
                            const isRescheduled = task.status === 'rescheduled';

                            return (
                              <div
                                key={task.id}
                                className={`rounded-lg border p-2.5 text-xs transition-all space-y-1.5 ${
                                  isCompleted
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : isSkipped
                                    ? 'bg-slate-50 border-slate-200 opacity-60'
                                    : isRescheduled
                                    ? 'bg-amber-50/40 border-amber-200 text-amber-800'
                                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-slate-800 uppercase tracking-tight text-[11px]">
                                    {task.subject} — {task.durationMinutes} min
                                  </span>
                                  {task.isWeakTopicRemedy && (
                                    <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800 shrink-0">
                                      Weak Topic
                                    </span>
                                  )}
                                </div>

                                <div
                                  className={`text-slate-900 font-medium ${
                                    isCompleted ? 'line-through text-slate-400' : ''
                                  }`}
                                >
                                  {task.topic}
                                </div>

                                {task.rescheduledTo && (
                                  <div className="text-[10px] text-amber-700 italic">
                                    Rescheduled to {task.rescheduledTo}
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-1.5 flex items-center justify-between border-t border-slate-100/80">
                                  <button
                                    onClick={() => handleToggleTask(task.id, task.topic)}
                                    className={`inline-flex items-center gap-1 font-semibold text-[11px] cursor-pointer ${
                                      isCompleted ? 'text-emerald-700' : 'text-slate-500 hover:text-emerald-700'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span>Completed</span>
                                      </>
                                    ) : (
                                      <>
                                        <Circle className="w-3 h-3" />
                                        <span>Mark Done</span>
                                      </>
                                    )}
                                  </button>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleSkipTask(task.id, task.topic)}
                                      className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                      title="Skip task"
                                    >
                                      <SkipForward className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => setReschedulingTask(task)}
                                      className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                      title="Reschedule to another day"
                                    >
                                      <RotateCw className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {day.tasks.length === 0 && (
                            <div className="py-6 text-center text-xs text-slate-400 italic">
                              Rest day / Free study
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add Session to Day Button */}
                      <button
                        onClick={() => setAddingTaskDay(day.dayName)}
                        className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-[11px] font-semibold text-slate-500 hover:text-emerald-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: 4-WEEK CURRICULUM PLAN */}
      {activeTab === 'weekly_plan' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              4-Week Progressive Examination Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Systematic progression from foundation and weak-topic remediation to high-speed past papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plan.weeklyOverview.map((week) => (
              <div
                key={week.weekNumber}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Week 0{week.weekNumber}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      Target: {week.targetHours} Study Hours
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {week.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {week.theme}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Focus Subjects:</span>
                      <div className="flex flex-wrap gap-1">
                        {week.focusSubjects.map((s, idx) => (
                          <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Revision Focus:</span>
                      <span className="text-slate-600">{week.revisionFocus}</span>
                    </div>

                    <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/70">
                      <span className="font-bold text-emerald-900 block mb-0.5">Practice Milestone:</span>
                      <span className="text-emerald-800">{week.practiceMilestone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Pacing: Optimal Spaced Distribution</span>
                  <span className="font-semibold text-emerald-700">Week 0{week.weekNumber} Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: REVISION SCHEDULE */}
      {activeTab === 'revision' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Spaced Repetition & Revision Schedule
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Combines 24-hour, 3-day, 7-day, and 21-day spaced retrieval intervals to eliminate the Ebbinghaus forgetting curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plan.revisionSchedule.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {item.spacedInterval}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        {item.phase}
                      </h3>
                      <span className="text-xs text-slate-400">{item.timeframe}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">Retrieval Strategy:</span>
                    <p className="text-slate-600 leading-relaxed">{item.strategy}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                      Targeted Concepts:
                    </span>
                    {item.topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-50/50 text-emerald-950 p-2 rounded-lg border border-emerald-100/80 flex items-center gap-2 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PRACTICE SCHEDULE */}
      {activeTab === 'practice' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Calibrated Practice & Diagnostic Schedule
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Untimed conceptual drills evolving into timed past paper examination blocks.
              </p>
            </div>

            {onNavigateToPractice && (
              <Button
                variant="primary"
                size="sm"
                onClick={onNavigateToPractice}
                className="gap-2 cursor-pointer shadow-xs shrink-0"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Launch Practice Engine</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plan.practiceSchedule.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {p.phase}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-display mt-2">
                      {p.drillType}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Frequency:</span>
                      <strong className="text-slate-800">{p.frequency}</strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Target Accuracy:</span>
                      <strong className="text-emerald-700">{p.targetAccuracy}</strong>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                        Recommended Drills:
                      </span>
                      {p.recommendedDrills.map((drill, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-slate-700 flex items-start gap-1.5 text-xs"
                        >
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{drill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-right">
                  <span className="text-[11px] text-slate-400">Integrated with Study Zone Quizzes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: EXAM PREP COUNTDOWN */}
      {activeTab === 'exam_prep' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Exam Room Countdown & Milestone Timeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Structured preparation stages counting down from T-40 days to 24 hours before the test.
            </p>
          </div>

          <div className="space-y-4">
            {plan.examPrepSchedule.map((phase, idx) => (
              <div
                key={phase.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start gap-5"
              >
                <div className="w-full md:w-56 shrink-0 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 block w-fit">
                    {phase.countdownDays}
                  </span>
                  <div className="text-base font-bold text-slate-900 font-display pt-1">
                    {phase.stageName}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {phase.focus}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Key Milestone Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.milestones.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: WEAK TOPICS REMEDIATION */}
      {activeTab === 'weak_topics' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Dashboard & Quiz Weak Topic Remediation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                These topics were detected with sub-65% accuracy in your recent diagnostic quizzes and are scheduled as high-priority sessions.
              </p>
            </div>

            {onNavigateToAITutor && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigateToAITutor('Explain Eigenvalues and Diagonalization step by step')}
                className="gap-2 cursor-pointer shadow-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Launch Socratic AI Tutor</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.weakRemedyTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-amber-200/90 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      {task.subject} · {task.durationMinutes} min
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    Scheduled: {task.dayName}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {task.topic}
                  </h3>
                  {task.weakTopicNote && (
                    <p className="text-xs text-amber-800 font-medium mt-1">
                      {task.weakTopicNote}
                    </p>
                  )}
                  {task.notes && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {task.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleTask(task.id, task.topic)}
                    className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {task.status === 'completed' ? 'Mastered & Completed' : 'Mark as Completed'}
                  </button>

                  {onNavigateToAITutor && (
                    <button
                      onClick={() => onNavigateToAITutor(`Please tutor me on ${task.subject}: ${task.topic}`)}
                      className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>Study with AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <PlannerSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onGenerate={handleGenerateNewPlan}
        currentConfig={plan.config}
      />

      <RescheduleTaskModal
        isOpen={Boolean(reschedulingTask)}
        task={reschedulingTask}
        onClose={() => setReschedulingTask(null)}
        onReschedule={handleRescheduleConfirm}
      />

      <AddTaskModal
        isOpen={Boolean(addingTaskDay)}
        dayName={addingTaskDay || 'Monday'}
        onClose={() => setAddingTaskDay(null)}
        onAddTask={handleAddTaskConfirm}
      />
    </div>
  );
};
