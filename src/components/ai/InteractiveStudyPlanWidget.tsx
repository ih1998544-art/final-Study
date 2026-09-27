import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, Target, Award } from 'lucide-react';
import { StudyPlanDay } from '../../types/ai';

export interface InteractiveStudyPlanWidgetProps {
  plan: StudyPlanDay[];
}

export const InteractiveStudyPlanWidget: React.FC<InteractiveStudyPlanWidgetProps> = ({ plan }) => {
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    plan.forEach((period) => {
      period.tasks.forEach((t) => {
        if (t.completed) initial.add(t.id);
      });
    });
    return initial;
  });

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const allTasks = plan.flatMap((p) => p.tasks);
  const totalTasksCount = allTasks.length;
  const completedCount = completedTaskIds.size;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;
  const totalEstimatedMinutes = allTasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0);

  return (
    <div className="my-4 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
      {/* Plan Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Actionable Study Plan & Milestone Checklist
            </h4>
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              Total Estimated Study: {Math.round(totalEstimatedMinutes / 60)} hrs {totalEstimatedMinutes % 60} mins
            </span>
          </div>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-700">
              {completedCount} of {totalTasksCount} Tasks Completed
            </span>
            <div className="text-[11px] text-emerald-600 font-medium">
              {completionPercentage}% Target Reached
            </div>
          </div>
          <div className="w-14 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Days & Tasks Accordion */}
      <div className="mt-4 space-y-4">
        {plan.map((periodItem, pIdx) => {
          const periodCompleted = periodItem.tasks.every((t) => completedTaskIds.has(t.id));

          return (
            <div
              key={pIdx}
              className={`rounded-xl border p-4 transition-all ${
                periodCompleted
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-slate-50/70 border-slate-200/80'
              }`}
            >
              {/* Day title & milestone */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-bold font-mono">
                    {periodItem.period}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    {periodItem.theme}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Target className="w-3 h-3" />
                  <span className="truncate max-w-[220px]">
                    Goal: {periodItem.milestoneGoal}
                  </span>
                </div>
              </div>

              {/* Tasks checklist */}
              <div className="space-y-2">
                {periodItem.tasks.map((task) => {
                  const isDone = completedTaskIds.has(task.id);

                  return (
                    <label
                      key={task.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-white/80 border-emerald-200 text-slate-500 line-through'
                          : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTask(task.id)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex-1 leading-snug">{task.label}</span>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                        {task.durationMinutes} min
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
