import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { PlannerTask } from '../../types/planner';
import { Button } from '../ui/Button';

interface RescheduleTaskModalProps {
  isOpen: boolean;
  task: PlannerTask | null;
  onClose: () => void;
  onReschedule: (taskId: string, targetDay: string) => void;
}

export const RescheduleTaskModal: React.FC<RescheduleTaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onReschedule,
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState<string>('Tuesday');

  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    onReschedule(task.id, selectedDay);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Reschedule Task</h3>
              <p className="text-xs text-slate-500">Move session to a different study day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Summary Card */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
            {task.subject} · {task.durationMinutes} min
          </div>
          <div className="text-sm font-bold text-slate-900 font-display">
            {task.topic}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Currently scheduled on: <strong className="text-slate-700">{task.dayName}</strong></span>
          </div>
        </div>

        {/* Day Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 font-display block">
            Select Destination Study Day:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {days.map((day) => {
              const isCurrent = day.toLowerCase() === task.dayName.toLowerCase();
              const isSelected = selectedDay.toLowerCase() === day.toLowerCase();

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">{day}</div>
                  <div className="text-[10px] opacity-80">
                    {isCurrent ? 'Current day' : 'Available'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            className="gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Confirm Move</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
