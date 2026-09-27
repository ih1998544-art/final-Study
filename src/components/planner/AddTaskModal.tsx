import React, { useState } from 'react';
import { PlusCircle, Clock, BookOpen, AlertCircle, X } from 'lucide-react';
import { PlannerTask, TaskType } from '../../types/planner';
import { Button } from '../ui/Button';

interface AddTaskModalProps {
  isOpen: boolean;
  dayName: string;
  onClose: () => void;
  onAddTask: (dayName: string, task: Omit<PlannerTask, 'id' | 'status' | 'dayName' | 'date'>) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  dayName,
  onClose,
  onAddTask,
}) => {
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [taskType, setTaskType] = useState<TaskType>('subject_study');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onAddTask(dayName, {
      subject,
      topic: topic.trim(),
      durationMinutes: Number(duration),
      type: taskType,
      priority,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const subjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Economics',
    'Biology',
    'English & Writing',
    'Revision',
    'Practice Drill',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Add Task to {dayName}</h3>
              <p className="text-xs text-slate-500">Insert custom study or revision block</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Duration (minutes)
              </label>
              <div className="flex items-center gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      duration === mins
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">
              Topic or Milestone Objective
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Eigenvalues proof derivation or Chapter 3 quiz"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Activity Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="subject_study">New Lesson Study</option>
                <option value="revision">Spaced Revision & Flashcards</option>
                <option value="practice_quiz">Diagnostic Practice Quiz</option>
                <option value="weak_area_remedy">Weak Area Remediation</option>
                <option value="exam_simulation">Timed Mock Simulation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="high">High Priority (Urgent / Exam)</option>
                <option value="medium">Medium Priority (Standard)</option>
                <option value="low">Low Priority (Maintenance)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-display">
              Preparation Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Read textbook pages 140-155 first"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!topic.trim()}
              className="cursor-pointer shadow-xs"
            >
              Add to {dayName} Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
