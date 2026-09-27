import React from 'react';
import {
  Sparkles,
  Bot,
  GraduationCap,
  Award,
  Zap,
  Calendar,
  Flame,
  HelpCircle,
  Cpu,
  CheckCircle2,
  BookMarked,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AIRole, LearningMode, QuickActionType } from '../../types/ai';
import { AI_ROLES, QUICK_ACTIONS } from '../../data/aiConstants';

export interface AIEmptyStateProps {
  currentSubject: string;
  selectedRole: AIRole;
  onSelectRole: (role: AIRole) => void;
  onSelectQuickAction: (actionType: QuickActionType) => void;
  onSelectPrompt: (prompt: string, mode?: LearningMode) => void;
  suggestedPrompts: string[];
}

export const AIEmptyState: React.FC<AIEmptyStateProps> = ({
  currentSubject,
  selectedRole,
  onSelectRole,
  onSelectQuickAction,
  onSelectPrompt,
  suggestedPrompts,
}) => {
  const currentRoleMeta = AI_ROLES[selectedRole] || AI_ROLES.tutor;

  const roleList: { role: AIRole; icon: React.ReactNode; label: string }[] = [
    { role: 'tutor', icon: <Bot className="w-4 h-4" />, label: 'AI Tutor' },
    { role: 'teacher', icon: <GraduationCap className="w-4 h-4" />, label: 'AI Teacher' },
    { role: 'exam_coach', icon: <Award className="w-4 h-4" />, label: 'AI Exam Coach' },
    { role: 'practice_partner', icon: <Zap className="w-4 h-4" />, label: 'AI Practice Partner' },
    { role: 'study_planner', icon: <Calendar className="w-4 h-4" />, label: 'AI Study Planner' },
    { role: 'revision_assistant', icon: <Flame className="w-4 h-4" />, label: 'AI Revision' },
  ];

  const getQuickActionIcon = (actionType: QuickActionType) => {
    switch (actionType) {
      case 'explain':
        return <HelpCircle className="w-5 h-5 text-emerald-600" />;
      case 'solve':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'quiz':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'notes':
        return <BookMarked className="w-5 h-5 text-emerald-600" />;
      case 'exam_prep':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'flashcards':
        return <Layers className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 space-y-8 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Study Zone AI Pedagogical Agent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          What would you like to master today?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          Calibrated for <strong className="text-slate-800">{currentSubject}</strong>. Choose an agent persona or select a quick action to launch your personalized learning session.
        </p>
      </div>

      {/* 6 AI Role Persona Switcher Pill Row */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Active AI Persona
          </span>
          <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {currentRoleMeta.title}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {roleList.map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => onSelectRole(item.role)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {item.icon}
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Persona description banner */}
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>{currentRoleMeta.description}</span>
        </div>
      </div>

      {/* 6 Quick Action Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Actions
          </h2>
          <span className="text-xs text-slate-400">Instant educational outputs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.type}
              type="button"
              onClick={() => onSelectQuickAction(action.type)}
              className="group text-left p-4 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getQuickActionIcon(action.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                    {action.label}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {action.sublabel}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Suggested Prompts */}
      {suggestedPrompts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Suggested Prompts for {currentSubject}
            </h2>
            <span className="text-xs text-emerald-600 font-medium">Click to ask</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                className="text-left p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs sm:text-sm text-slate-700 hover:text-slate-900 transition-all flex items-start gap-2.5 group"
              >
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 group-hover:rotate-12 transition-transform" />
                <span className="leading-snug">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
