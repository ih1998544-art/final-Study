import React from 'react';
import { Check, Minus, Sparkles } from 'lucide-react';

export const PlanComparisonTable: React.FC = () => {
  const comparisonSections = [
    {
      category: '1. Socratic AI Engine & Tutoring',
      rows: [
        { feature: 'Daily AI Inquiries', free: '25 / day', student: '250 / day', pro: 'Unlimited' },
        { feature: 'Response Model Tier', free: 'Flash 2.5', student: 'Flash 2.5 Turbo', pro: 'Pro Reasoning Tier' },
        { feature: 'Socratic Dialogue & Probing', free: 'Basic', student: 'Full Multistep', pro: 'Deep Research Grade' },
        { feature: 'Voice / Audio Debate Debriefs', free: false, student: true, pro: true },
        { feature: 'Syllabus PDF Grounding & OCR', free: false, student: 'Up to 25 MB', pro: 'Up to 500 MB' },
      ],
    },
    {
      category: '2. Study Tools & Interactive Modules',
      rows: [
        { feature: 'Interactive Study Tools', free: '4 Core Tools', student: 'All 15 Tools', pro: 'All 15 Tools + Beta' },
        { feature: 'Cornell Notes Generator', free: 'Basic Text', student: 'Full Two-Column + LaTeX', pro: 'Full + BibTeX Sync' },
        { feature: 'AI Flashcard Synthesis', free: 'Up to 5 cards/deck', student: 'Unlimited cards', pro: 'Unlimited cards' },
        { feature: 'Automated Leitner Spaced Repetition', free: false, student: true, pro: true },
        { feature: 'Coding Tutor Sandbox (Python/JS)', free: false, student: true, pro: true },
      ],
    },
    {
      category: '3. Practice Drills & Mock Exam Papers',
      rows: [
        { feature: 'Daily Practice Questions', free: '30 / day', student: 'Unlimited', pro: 'Unlimited' },
        { feature: 'Distractor Analysis & Explanations', free: 'Brief', student: 'Comprehensive', pro: 'Comprehensive + Mark Scheme' },
        { feature: 'Timed Mock Exam Mode', free: false, student: true, pro: true },
        { feature: 'Custom Exam Paper Synthesizer', free: false, student: false, pro: true },
      ],
    },
    {
      category: '4. Learning Analytics & Velocity Diagnostics',
      rows: [
        { feature: 'Weekly Study-Time Bar Chart', free: '7 Days', student: 'Unlimited History', pro: 'Unlimited History' },
        { feature: 'Subject Accuracy Benchmarking', free: false, student: true, pro: true },
        { feature: 'Topic Mastery Spectrum (4 Tiers)', free: false, student: true, pro: true },
        { feature: 'Quiz Accuracy Chronological Trendline', free: false, student: true, pro: true },
        { feature: 'Predictive Final Exam Grade Model', free: false, student: false, pro: '98% Precision Model' },
      ],
    },
    {
      category: '5. Workspace Storage & Academic Vault',
      rows: [
        { feature: 'Cloud Storage Capacity', free: '50 MB', student: '5 GB', pro: '50 GB' },
        { feature: 'Official Past Papers & PDF Reader', free: 'Preview Only', student: 'Full PDF Viewer', pro: 'Full + Annotations' },
        { feature: 'Saved Socratic Dialogues', free: 'Up to 5', student: 'Unlimited', pro: 'Unlimited' },
        { feature: 'LaTeX & Markdown Export', free: false, student: true, pro: true },
      ],
    },
    {
      category: '6. Support & Guarantees',
      rows: [
        { feature: 'Peak Traffic Queue Priority', free: 'Standard', student: 'High Priority', pro: 'Dedicated GPU Pool' },
        { feature: 'Streak Protection Freeze Shields', free: false, student: '3 per month', pro: 'Unlimited' },
        { feature: '24/7 Academic Concierge', free: false, student: false, pro: true },
        { feature: 'Cancel Anytime Guarantee', free: true, student: true, pro: true },
      ],
    },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
      ) : (
        <Minus className="w-4 h-4 text-slate-300 mx-auto" />
      );
    }
    return <span className="font-semibold text-slate-800 text-xs">{val}</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1.5 pb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          Full Feature & Capacity Comparison
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent empirical comparison of capabilities across all three academic tiers.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-900 font-display">
              <th className="py-3 px-4 w-2/5">Capability Specification</th>
              <th className="py-3 px-4 text-center w-1/5 bg-slate-50/50">Free Scholar</th>
              <th className="py-3 px-4 text-center w-1/5 bg-emerald-50/50 text-emerald-800">
                Student Scholar
              </th>
              <th className="py-3 px-4 text-center w-1/5 bg-slate-50/50">Pro Research</th>
            </tr>
          </thead>
          <tbody>
            {comparisonSections.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                {/* Category Header */}
                <tr className="bg-slate-100/70 border-y border-slate-200">
                  <td
                    colSpan={4}
                    className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-700 font-display"
                  >
                    {section.category}
                  </td>
                </tr>

                {/* Rows */}
                {section.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors text-xs"
                  >
                    <td className="py-3 px-4 font-medium text-slate-700">{row.feature}</td>
                    <td className="py-3 px-4 text-center bg-slate-50/30">
                      {renderValue(row.free)}
                    </td>
                    <td className="py-3 px-4 text-center bg-emerald-50/20 font-medium">
                      {renderValue(row.student)}
                    </td>
                    <td className="py-3 px-4 text-center bg-slate-50/30">
                      {renderValue(row.pro)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
