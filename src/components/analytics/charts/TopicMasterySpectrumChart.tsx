import React, { useState } from 'react';
import { TopicMasteryItem } from '../../../types/analytics';
import { Target, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface TopicMasterySpectrumChartProps {
  topics: TopicMasteryItem[];
}

export const TopicMasterySpectrumChart: React.FC<TopicMasterySpectrumChartProps> = ({ topics }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | 'mastered' | 'proficient' | 'developing' | 'critical'>('all');

  const mastered = topics.filter((t) => t.tier === 'mastered');
  const proficient = topics.filter((t) => t.tier === 'proficient');
  const developing = topics.filter((t) => t.tier === 'developing');
  const critical = topics.filter((t) => t.tier === 'critical');

  const total = topics.length;
  const masteredPct = Math.round((mastered.length / total) * 100);
  const proficientPct = Math.round((proficient.length / total) * 100);
  const developingPct = Math.round((developing.length / total) * 100);
  const criticalPct = Math.round((critical.length / total) * 100);

  const filteredTopics = topics.filter(
    (t) => selectedTier === 'all' || t.tier === selectedTier
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Cognitive Spectrum
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Topic Mastery Spectrum & Retention
          </h3>
          <p className="text-xs text-slate-500">
            Categorized across Mastered (≥85%), Proficient (70-84%), Developing (50-69%), and Critical (&lt;50%)
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {mastered.length + proficient.length} / {total} Exam Ready (84%)
          </span>
        </div>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${masteredPct}%` }}
            className="bg-emerald-600 h-full transition-all duration-300"
            title={`Mastered: ${mastered.length} topics (${masteredPct}%)`}
          />
          <div
            style={{ width: `${proficientPct}%` }}
            className="bg-sky-500 h-full transition-all duration-300"
            title={`Proficient: ${proficient.length} topics (${proficientPct}%)`}
          />
          <div
            style={{ width: `${developingPct}%` }}
            className="bg-amber-500 h-full transition-all duration-300"
            title={`Developing: ${developing.length} topics (${developingPct}%)`}
          />
          <div
            style={{ width: `${criticalPct}%` }}
            className="bg-rose-500 h-full transition-all duration-300"
            title={`Critical Review: ${critical.length} topics (${criticalPct}%)`}
          />
        </div>

        {/* Legend / Filter Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedTier(selectedTier === 'mastered' ? 'all' : 'mastered')}
            className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
              selectedTier === 'mastered'
                ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="font-bold text-slate-800">Mastered (≥85%)</span>
            </div>
            <div className="text-slate-500 text-[11px] font-mono">
              {mastered.length} topics ({masteredPct}%)
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTier(selectedTier === 'proficient' ? 'all' : 'proficient')}
            className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
              selectedTier === 'proficient'
                ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-500'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="font-bold text-slate-800">Proficient (70-84%)</span>
            </div>
            <div className="text-slate-500 text-[11px] font-mono">
              {proficient.length} topics ({proficientPct}%)
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTier(selectedTier === 'developing' ? 'all' : 'developing')}
            className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
              selectedTier === 'developing'
                ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-bold text-slate-800">Developing (50-69%)</span>
            </div>
            <div className="text-slate-500 text-[11px] font-mono">
              {developing.length} topics ({developingPct}%)
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTier(selectedTier === 'critical' ? 'all' : 'critical')}
            className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
              selectedTier === 'critical'
                ? 'border-rose-500 bg-rose-50/70 shadow-xs ring-1 ring-rose-500'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-bold text-slate-800">Critical (&lt;50%)</span>
            </div>
            <div className="text-slate-500 text-[11px] font-mono">
              {critical.length} topics ({criticalPct}%)
            </div>
          </button>
        </div>
      </div>

      {/* Filtered Topic Cards List */}
      <div className="space-y-2 pt-1 max-h-80 overflow-y-auto pr-1">
        {filteredTopics.map((topic) => {
          let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          let barBg = 'bg-emerald-600';
          if (topic.tier === 'proficient') {
            badgeBg = 'bg-sky-50 text-sky-700 border-sky-200';
            barBg = 'bg-sky-500';
          } else if (topic.tier === 'developing') {
            badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
            barBg = 'bg-amber-500';
          } else if (topic.tier === 'critical') {
            badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
            barBg = 'bg-rose-500';
          }

          return (
            <div
              key={topic.id}
              className="p-3 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {topic.subjectName}
                  </span>
                  <span className="text-xs text-slate-400">Tested: {topic.lastTestedDate}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                  {topic.topicTitle}
                </h4>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-28 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{topic.correctAnswersCount}/{topic.questionsAttempted}</span>
                    <span className="font-bold text-slate-800">{topic.masteryPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barBg}`}
                      style={{ width: `${topic.masteryPercentage}%` }}
                    />
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeBg} capitalize shrink-0`}
                >
                  {topic.tier}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
