import React from 'react';
import { StudyTimeDistributionItem } from '../../../types/analytics';
import { Clock, BookOpen, Bot, Award, Layers, ShieldCheck } from 'lucide-react';

interface StudyTimeDistributionChartProps {
  distribution: StudyTimeDistributionItem[];
  totalHours: number;
}

export const StudyTimeDistributionChart: React.FC<StudyTimeDistributionChartProps> = ({
  distribution,
  totalHours,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Pedagogical Allocation
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Study-Time Distribution by Modality
          </h3>
          <p className="text-xs text-slate-500">
            Total {totalHours} cumulative learning hours categorized across study activities
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{totalHours} Total Hours</span>
        </div>
      </div>

      {/* Stacked Proportional Bar */}
      <div className="space-y-2">
        <div className="w-full h-5 rounded-xl overflow-hidden flex bg-slate-100 shadow-inner">
          {distribution.map((item) => (
            <div
              key={item.activityId}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.colorHex,
              }}
              className="h-full transition-all duration-300 hover:opacity-90"
              title={`${item.activityLabel}: ${item.hours} hrs (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Breakdown List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {distribution.map((item) => {
            return (
              <div
                key={item.activityId}
                className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {item.activityLabel}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {item.percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.hours} hrs</span>
                  <span className="truncate text-slate-400">{item.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
