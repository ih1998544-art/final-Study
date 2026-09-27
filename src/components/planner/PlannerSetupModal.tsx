import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Target,
  Layers,
  Flame,
  CheckCircle2,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ExamTargetConfig } from '../../types/planner';
import { AcademicLevel } from '../../types';
import { INITIAL_DASHBOARD_DATA } from '../../data/dashboardData';
import { Button } from '../ui/Button';

interface PlannerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: ExamTargetConfig) => void;
  currentConfig?: ExamTargetConfig;
}

export const PlannerSetupModal: React.FC<PlannerSetupModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  currentConfig,
}) => {
  const weakTopics = INITIAL_DASHBOARD_DATA.weakTopics;

  const [examName, setExamName] = useState(
    currentConfig?.examName || 'University Fall Finals & Honors Examination'
  );
  const [examDate, setExamDate] = useState(currentConfig?.examDate || '2026-11-18');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    currentConfig?.subjects || ['Mathematics', 'Physics', 'Chemistry', 'Computer Science']
  );
  const [availableHours, setAvailableHours] = useState<number>(
    currentConfig?.availableHoursPerDay || 2.5
  );
  const [currentLevel, setCurrentLevel] = useState<AcademicLevel>(
    currentConfig?.currentLevel || 'undergraduate'
  );
  const [difficulty, setDifficulty] = useState<
    'Standard' | 'Challenging' | 'Intensive' | 'Mastery Cram'
  >(currentConfig?.difficulty || 'Challenging');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    currentConfig?.goals || [
      'Score >90% Overall on All Papers',
      'Eliminate 4 High-Risk Weak Topics',
      'Daily Active Retrieval (Spaced Repetition)',
    ]
  );
  const [preferredDays, setPreferredDays] = useState<string[]>(
    currentConfig?.preferredStudyDays || [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
  );
  const [integrateWeakTopics, setIntegrateWeakTopics] = useState(
    currentConfig?.integrateWeakTopics ?? true
  );

  if (!isOpen) return null;

  const availableSubjectsList = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Economics',
    'Biology',
    'English & Writing',
    'Urdu & Polyglot',
    'History',
  ];

  const presetExams = [
    { label: 'University Term Finals', date: '2026-11-18' },
    { label: 'AP Calculus & Physics', date: '2026-12-05' },
    { label: 'SAT / ACT General', date: '2026-11-01' },
    { label: 'MCAT / GRE Scientific', date: '2026-12-15' },
  ];

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const goalOptions = [
    'Score >90% Overall on All Papers',
    'Eliminate 4 High-Risk Weak Topics',
    'Daily Active Retrieval (Spaced Repetition)',
    'Complete 3 Full Timed Practice Mocks',
    'Master Step-by-Step Formula Derivations',
    'Zero Rubric Deductions on Method Marks',
  ];

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleDay = (d: string) => {
    setPreferredDays((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || selectedSubjects.length === 0 || preferredDays.length === 0) return;

    onGenerate({
      examName: examName.trim(),
      examDate,
      subjects: selectedSubjects,
      availableHoursPerDay: availableHours,
      currentLevel,
      difficulty,
      goals: selectedGoals,
      preferredStudyDays: preferredDays,
      integrateWeakTopics,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                AI Study Planner Synthesis
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure your target exam, available hours, and syllabus goals.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Exam Details & Presets */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-display">
              1. Target Examination & Date
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. University Term Finals 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
              {presetExams.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setExamName(p.label);
                    setExamDate(p.date);
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 px-2 py-0.5 rounded border border-slate-200/80 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Enrolled Subjects Multi-Select */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                2. Select Focus Subjects ({selectedSubjects.length})
              </label>
              <span className="text-[11px] text-slate-400">Click to toggle</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableSubjectsList.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleSubject(subj)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Time, Level & Intensity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Daily Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display flex items-center justify-between">
                <span>Available Study Time</span>
                <span className="text-emerald-700 font-bold">{availableHours} hrs/day</span>
              </label>
              <input
                type="range"
                min={1}
                max={6}
                step={0.5}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1h (Light)</span>
                <span>2.5h (Optimal)</span>
                <span>6h (Intensive)</span>
              </div>
            </div>

            {/* Current Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Academic Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value as AcademicLevel)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="middle_school">Middle School</option>
                <option value="high_school">High School (AP/IB)</option>
                <option value="undergraduate">Undergraduate (College)</option>
                <option value="graduate">Graduate Degree</option>
                <option value="professional_certification">Professional Cert</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-display">
                Roadmap Intensity
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Standard">Standard (Steady Pace)</option>
                <option value="Challenging">Challenging (High Yield)</option>
                <option value="Intensive">Intensive (Accelerated)</option>
                <option value="Mastery Cram">Mastery Cram (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Section 4: Preferred Study Days */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-display">
              4. Preferred Active Study Days ({preferredDays.length}/7 Days)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {allDays.map((d) => {
                const isSelected = preferredDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Connect Weak Topics Connection Banner */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-950 font-display">
                  Connect Dashboard & Quiz Weak Topics
                </span>
              </div>
              <input
                type="checkbox"
                checked={integrateWeakTopics}
                onChange={(e) => setIntegrateWeakTopics(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
              />
            </div>

            <p className="text-xs text-emerald-800 leading-relaxed">
              Automatically schedules high-priority remediation sessions for your 4 detected weak topics:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {weakTopics.map((wt) => (
                <div
                  key={wt.id}
                  className="bg-white/90 rounded-lg p-2 border border-emerald-200/80 text-[11px] flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-800">{wt.subjectName}: </span>
                    <span className="text-slate-600 truncate">{wt.topicTitle}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-700 shrink-0">
                    {wt.masteryPercentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Key Goals Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-display">
              6. Specific Academic Goals
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((g) => {
                const isSelected = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="gap-2 px-5 py-2.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate AI Study Plan</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
