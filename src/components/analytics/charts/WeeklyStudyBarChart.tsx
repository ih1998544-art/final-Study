import React, { useState } from 'react';
import { WeeklyChartDataPoint } from '../../../types/analytics';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

interface WeeklyStudyBarChartProps {
  data: WeeklyChartDataPoint[];
}

export const WeeklyStudyBarChart: React.FC<WeeklyStudyBarChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxMinutes = Math.max(...data.map((d) => Math.max(d.studiedMinutes, d.targetMinutes)), 240);
  const totalMinutes = data.reduce((sum, d) => sum + d.studiedMinutes, 0);
  const totalTarget = data.reduce((sum, d) => sum + d.targetMinutes, 0);
  const averageMinutes = Math.round(totalMinutes / data.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Time Investment Velocity
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Weekly Study Time Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Daily recorded study minutes vs 120-minute target goal (Mon – Sun)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
            <span className="font-medium">Studied Minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 inline-block border-t border-dashed border-slate-500" />
            <span className="font-medium text-slate-500">Daily Target (120m)</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Area */}
      <div className="relative pt-4 pb-2">
        {/* Target Dashed Line at 120m */}
        <div
          className="absolute left-10 right-2 border-b-2 border-dashed border-slate-300 z-10 pointer-events-none"
          style={{ bottom: `${(120 / maxMinutes) * 160 + 36}px` }}
        >
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/90 px-1.5 py-0.5 rounded -top-3 absolute right-0">
            Target: 120m
          </span>
        </div>

        {/* Chart Viewport */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pl-10 pr-2">
          {data.map((item, idx) => {
            const heightPercent = (item.studiedMinutes / maxMinutes) * 100;
            const isTargetMet = item.studiedMinutes >= item.targetMinutes;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.dayName}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold">{item.dayName}, {item.date}</div>
                    <div className="text-emerald-300">
                      {item.studiedMinutes} min ({item.lessonsCompleted} lessons)
                    </div>
                  </div>
                )}

                {/* Number Above Bar */}
                <span
                  className={`text-[11px] font-mono font-bold mb-1 transition-colors ${
                    isTargetMet ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {item.studiedMinutes}m
                </span>

                {/* Animated Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-40">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      isTargetMet
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-500 group-hover:from-emerald-700 group-hover:to-emerald-600'
                        : 'bg-gradient-to-t from-sky-500 to-sky-400 group-hover:from-sky-600 group-hover:to-sky-500'
                    } ${item.isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label Below */}
                <div className="text-center pt-2">
                  <span
                    className={`text-xs font-bold block ${
                      item.isToday
                        ? 'text-emerald-700'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {item.dayName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {item.date.slice(4)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer Statistics */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Total This Week</span>
          <span className="text-sm font-bold text-slate-900 font-display">
            {(totalMinutes / 60).toFixed(1)} hrs ({totalMinutes}m)
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Daily Average</span>
          <span className="text-sm font-bold text-emerald-700 font-display">
            {averageMinutes} min / day
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Target Goal Pace</span>
          <span className="text-sm font-bold text-slate-900 font-display">
            {Math.round((totalMinutes / totalTarget) * 100)}% of Goal
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Lessons Completed</span>
          <span className="text-sm font-bold text-slate-900 font-display">
            {data.reduce((sum, d) => sum + d.lessonsCompleted, 0)} Units
          </span>
        </div>
      </div>
    </div>
  );
};
