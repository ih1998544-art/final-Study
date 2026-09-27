import React, { useState } from 'react';
import {
  StrongTopicItem,
  WeakTopicItemAnalytics,
  ImprovingTopicItem,
  RecommendedRevisionItem,
} from '../../types/analytics';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Award,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface TopicPerformanceSectionProps {
  strongTopics: StrongTopicItem[];
  weakTopics: WeakTopicItemAnalytics[];
  improvingTopics: ImprovingTopicItem[];
  recommendedRevision: RecommendedRevisionItem[];
  onLaunchAITutor?: (prompt: string) => void;
  onLaunchPractice?: () => void;
}

export const TopicPerformanceSection: React.FC<TopicPerformanceSectionProps> = ({
  strongTopics,
  weakTopics,
  improvingTopics,
  recommendedRevision,
  onLaunchAITutor,
  onLaunchPractice,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'strong' | 'weak' | 'improving' | 'revision'>('all');

  return (
    <div className="space-y-6">
      {/* Category Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Topic Diagnostics & Pedagogical Recommendations
          </h3>
          <p className="text-xs text-slate-500">
            Real-time mastery classification based on continuous quiz performance and spaced recall
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All 4 Categories' },
            { id: 'strong', label: `Strong Topics (${strongTopics.length})` },
            { id: 'weak', label: `Weak Topics (${weakTopics.length})` },
            { id: 'improving', label: `Improving (${improvingTopics.length})` },
            { id: 'revision', label: `Recommended (${recommendedRevision.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. STRONG TOPICS */}
        {(activeTab === 'all' || activeTab === 'strong') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900 font-display">
                Strong Topics (Mastery ≥ 90%)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                High retention & minimal error frequency
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strongTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-display">
                      {topic.subjectName} · {topic.masteryPercentage}% Mastery
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {topic.questionsSolved} Questions Solved
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-900 font-display">
                      {topic.topicTitle}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {topic.keyStrength}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {topic.retentionScore}% Memory Retention
                    </span>
                    <span className="font-mono text-slate-400">
                      {topic.streakDaysConsistent}-day consistency
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. WEAK TOPICS */}
        {(activeTab === 'all' || activeTab === 'weak') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="text-base font-bold text-slate-900 font-display">
                Weak Topics (Immediate Reinforcement Required)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Sub-65% diagnostic accuracy in recent assessments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weakTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl border border-rose-200/90 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-display">
                      {topic.subjectName} · {topic.masteryPercentage}% Mastery
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      High Priority
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-900 font-display">
                      {topic.topicTitle}
                    </h5>
                    <p className="text-xs text-rose-900/80 bg-rose-50/50 p-2 rounded-lg border border-rose-100 mt-1.5 leading-relaxed">
                      <strong>Deficit:</strong> {topic.primaryDeficit}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 truncate">
                      {topic.recommendedAction}
                    </span>

                    {onLaunchAITutor && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          onLaunchAITutor(
                            `Please tutor me on ${topic.subjectName}: ${topic.topicTitle}. Focus on: ${topic.primaryDeficit}`
                          )
                        }
                        className="text-xs h-7 px-2.5 gap-1 shrink-0 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>AI Tutor</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. IMPROVING TOPICS */}
        {(activeTab === 'all' || activeTab === 'improving') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <h4 className="text-base font-bold text-slate-900 font-display">
                Improving Topics (Accelerating Mastery)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Largest percentage gains over the past 14 days
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-display">
                      {topic.subjectName}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{topic.percentageGain}% Gain
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-900 font-display">
                      {topic.topicTitle}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {topic.recentMilestone}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>{topic.previousMastery}%</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                      <strong className="text-emerald-700 font-mono">{topic.currentMastery}%</strong>
                    </div>

                    <span className="text-slate-400 font-mono">
                      {topic.studySessionsCount} study sessions logged
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. RECOMMENDED REVISION */}
        {(activeTab === 'all' || activeTab === 'revision') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h4 className="text-base font-bold text-slate-900 font-display">
                Recommended Revision (Next Steps)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Actionable study sessions ranked by pedagogical priority
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedRevision.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl border border-amber-200/90 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-display">
                      {rec.subjectName} · {rec.urgency}
                    </span>
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {rec.estimatedMinutes} min
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-900 font-display">
                      {rec.topicTitle}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rec.pedagogicalReason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    {rec.suggestedPrompt && onLaunchAITutor && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onLaunchAITutor(rec.suggestedPrompt!)}
                        className="text-xs h-7 px-3 gap-1 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>Launch Socratic Session</span>
                      </Button>
                    )}

                    {rec.suggestedActionType === 'practice_quiz' && onLaunchPractice && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onLaunchPractice}
                        className="text-xs h-7 px-3 gap-1 cursor-pointer"
                      >
                        <Award className="w-3 h-3 text-emerald-600" />
                        <span>Take Diagnostic Quiz</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
