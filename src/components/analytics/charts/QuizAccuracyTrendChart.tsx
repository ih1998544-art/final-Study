import React, { useState } from 'react';
import { QuizAccuracyTrendPoint } from '../../../types/analytics';
import { Award, TrendingUp, HelpCircle } from 'lucide-react';

interface QuizAccuracyTrendChartProps {
  trend: QuizAccuracyTrendPoint[];
}

export const QuizAccuracyTrendChart: React.FC<QuizAccuracyTrendChartProps> = ({ trend }) => {
  const [activePoint, setActivePoint] = useState<QuizAccuracyTrendPoint | null>(null);

  const minScore = 60;
  const maxScore = 100;
  const scoreRange = maxScore - minScore;

  // Generate SVG path for scores and rolling average
  const points = trend.map((item, idx) => {
    const x = (idx / (trend.length - 1)) * 100;
    const y = 100 - ((item.scorePercentage - minScore) / scoreRange) * 100;
    return { x, y, item };
  });

  const rollingPoints = trend.map((item, idx) => {
    const x = (idx / (trend.length - 1)) * 100;
    const y = 100 - ((item.rollingAverage - minScore) / scoreRange) * 100;
    return { x, y };
  });

  const scorePath = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const rollingPath = rollingPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Assessment Trajectory
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Quiz Accuracy Trendline (Last 10 Quizzes)
          </h3>
          <p className="text-xs text-slate-500">
            Chronological diagnostic test scores with rolling accuracy average
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span className="font-medium">Quiz Score (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-sky-500 inline-block" />
            <span className="font-medium text-sky-700">Rolling Average (88.4%)</span>
          </div>
        </div>
      </div>

      {/* SVG Line Chart Viewport */}
      <div className="relative pt-6 pb-2">
        {/* Active Point Card Popup */}
        {activePoint && (
          <div className="absolute top-2 right-4 z-20 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="font-bold text-emerald-300">{activePoint.quizTitle}</div>
            <div className="text-slate-300">
              Subject: {activePoint.subjectName} · {activePoint.date}
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-[11px]">
              <span>Score: <strong className="text-emerald-400 font-mono">{activePoint.scorePercentage}%</strong></span>
              <span className="text-sky-300 font-mono">Avg: {activePoint.rollingAverage}%</span>
            </div>
          </div>
        )}

        <div className="h-52 w-full relative">
          {/* Horizontal Gridlines */}
          {[100, 90, 80, 70].map((score) => {
            const yPercent = 100 - ((score - minScore) / scoreRange) * 100;
            return (
              <div
                key={score}
                className="absolute left-8 right-0 border-b border-slate-100 flex items-center pointer-events-none"
                style={{ top: `${yPercent}%` }}
              >
                <span className="text-[10px] font-mono text-slate-400 -left-8 absolute">
                  {score}%
                </span>
              </div>
            );
          })}

          {/* SVG Vector Path */}
          <svg
            className="w-full h-full overflow-visible pl-8"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Rolling Average Line */}
            <path
              d={rollingPath}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />

            {/* Score Area Fill Gradient */}
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`${scorePath} L 100 100 L 0 100 Z`}
              fill="url(#scoreGradient)"
            />

            {/* Score Main Line */}
            <path
              d={scorePath}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />

            {/* Interactive Data Dots */}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="2.5"
                className="cursor-pointer hover:r-6 hover:fill-emerald-600 transition-all"
                onMouseEnter={() => setActivePoint(p.item)}
                onMouseLeave={() => setActivePoint(null)}
              />
            ))}
          </svg>
        </div>

        {/* Date Labels Below */}
        <div className="flex justify-between pl-8 pt-3 text-[10px] font-mono text-slate-400">
          {trend.map((t, idx) => (
            <span key={idx} className="truncate">
              {t.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
