import React, { useState } from 'react';
import { SubjectPerformanceMetric } from '../../../types/analytics';
import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react';

interface SubjectPerformanceChartProps {
  metrics: SubjectPerformanceMetric[];
}

export const SubjectPerformanceChart: React.FC<SubjectPerformanceChartProps> = ({ metrics }) => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Curriculum Breakdown
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Subject Performance & Benchmark Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Student accuracy compared against the 75% cohort benchmark
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
            <span className="font-medium">Student Accuracy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            <span className="font-medium text-slate-400">Class Benchmark (75%)</span>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Comparative Chart */}
      <div className="space-y-4 pt-1">
        {metrics.map((s) => {
          const isSelected = activeSubject === s.subjectId;
          const exceedsBenchmark = s.accuracyPercentage >= s.benchmarkPercentage;
          const delta = (s.accuracyPercentage - s.benchmarkPercentage).toFixed(1);

          return (
            <div
              key={s.subjectId}
              onMouseEnter={() => setActiveSubject(s.subjectId)}
              onMouseLeave={() => setActiveSubject(null)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              {/* Row Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.colorHex }}
                  />
                  <span className="text-sm font-bold text-slate-900 font-display">
                    {s.subjectName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    ({s.category})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {s.accuracyPercentage}%
                  </span>
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      exceedsBenchmark
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {exceedsBenchmark ? `+${delta}%` : `${delta}%`} vs Peer
                  </span>
                </div>
              </div>

              {/* Stacked Progress Bar with Benchmark Pin */}
              <div className="relative w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
                {/* Student Accuracy Fill */}
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${s.accuracyPercentage}%`,
                    backgroundColor: s.colorHex,
                  }}
                />

                {/* Benchmark Marker (75%) */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
                  style={{ left: `${s.benchmarkPercentage}%` }}
                  title={`Benchmark: ${s.benchmarkPercentage}%`}
                />
              </div>

              {/* Sub-metrics */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-slate-400" />
                  {s.completedLessons}/{s.totalLessons} Lessons ({Math.round((s.completedLessons / s.totalLessons) * 100)}%)
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {s.totalStudyHours} hrs studied
                </span>

                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-400" />
                  {s.quizzesTaken} Quizzes ({s.averageScore}% avg)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
