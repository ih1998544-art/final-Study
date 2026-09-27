import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Binary,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export const InteractivePracticePreview: React.FC<{
  onStartExam: () => void;
}> = ({ onStartExam }) => {
  const [selectedFormat, setSelectedFormat] = useState<
    'mcq' | 'true_false' | 'numerical' | 'coding'
  >('mcq');

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [trueFalseChoice, setTrueFalseChoice] = useState<boolean | null>(null);
  const [numericalInput, setNumericalInput] = useState('');
  const [codingAnswer, setCodingAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = (format: typeof selectedFormat) => {
    setSelectedFormat(format);
    setSelectedOption(null);
    setTrueFalseChoice(null);
    setNumericalInput('');
    setCodingAnswer('');
    setSubmitted(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Practice Engine
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
            Real Exam Questions with Instant Diagnostic Feedback
          </h3>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'mcq', label: 'MCQs' },
            { id: 'true_false', label: 'True / False' },
            { id: 'numerical', label: 'Numerical' },
            { id: 'coding', label: 'Coding' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => handleReset(fmt.id as typeof selectedFormat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Sandbox */}
      <div className="space-y-4">
        {selectedFormat === 'mcq' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Physics · Classical Mechanics</span>
              <span className="font-mono">Difficulty: Intermediate</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              A satellite orbits Earth in a circular trajectory of radius $r$. If the orbital radius is doubled to $2r$, by what factor does its orbital speed change?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 1, text: 'A) Increases by a factor of 2' },
                { id: 2, text: 'B) Decreases by a factor of √2 (1/√2)', isCorrect: true },
                { id: 3, text: 'C) Remains unchanged' },
                { id: 4, text: 'D) Decreases by a factor of 4' },
              ].map((opt) => {
                const isPicked = selectedOption === opt.id;
                let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                if (submitted) {
                  if (opt.isCorrect) {
                    style = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-medium';
                  } else if (isPicked) {
                    style = 'bg-rose-100 border-rose-300 text-rose-900';
                  }
                } else if (isPicked) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium ring-1 ring-emerald-500';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={submitted}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${style}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedFormat === 'true_false' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Chemistry · Thermodynamics</span>
              <span className="font-mono">Difficulty: Fundamental</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              True or False: In any spontaneous isolated process, the total entropy of the system and its surroundings always increases or remains constant (ΔS_univ ≥ 0).
            </p>
            <div className="flex items-center gap-3">
              {[
                { val: true, label: 'True', isCorrect: true },
                { val: false, label: 'False', isCorrect: false },
              ].map((item) => {
                const isPicked = trueFalseChoice === item.val;
                let style = 'bg-slate-50 border-slate-200 text-slate-700';
                if (submitted) {
                  if (item.isCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                  else if (isPicked) style = 'bg-rose-100 border-rose-300 text-rose-900';
                } else if (isPicked) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium ring-1 ring-emerald-500';
                }

                return (
                  <button
                    key={String(item.val)}
                    disabled={submitted}
                    onClick={() => setTrueFalseChoice(item.val)}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all text-center cursor-pointer ${style}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedFormat === 'numerical' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Mathematics · Probability</span>
              <span className="font-mono">Difficulty: Numerical</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              A fair standard 6-sided die is rolled twice. What is the probability (expressed as a simplified fraction or decimal to 3 places) of rolling a sum equal to 7?
            </p>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                disabled={submitted}
                value={numericalInput}
                onChange={(e) => setNumericalInput(e.target.value)}
                placeholder="Enter answer (e.g. 1/6 or 0.167)"
                className="flex-1 bg-slate-50 text-slate-900 text-xs sm:text-sm rounded-lg border border-slate-300 px-3.5 py-2.5 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        )}

        {selectedFormat === 'coding' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Programming · Algorithms</span>
              <span className="font-mono">Python 3 / TypeScript</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              Complete the function to determine if a string is a palindrome ignoring case and non-alphanumeric characters:
            </p>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <p className="text-slate-400"># Type your return statement</p>
              <p className="text-white">def is_palindrome(s: str) -&gt; bool:</p>
              <p className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;cleaned = [c.lower() for c in s if c.isalnum()]</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-indigo-300">&nbsp;&nbsp;&nbsp;&nbsp;return</span>
                <input
                  type="text"
                  disabled={submitted}
                  value={codingAnswer}
                  onChange={(e) => setCodingAnswer(e.target.value)}
                  placeholder="cleaned == cleaned[::-1]"
                  className="bg-slate-800 text-emerald-300 font-mono text-xs px-2 py-1 rounded border border-slate-700 focus:border-emerald-400 focus:outline-none flex-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReset(selectedFormat)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>

          {!submitted ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSubmitted(true)}
            >
              Submit Answer
            </Button>
          ) : (
            <Badge variant="success" dot>
              Graded & Analyzed
            </Badge>
          )}
        </div>

        {/* Post-Completion Diagnostics (As requested in master spec) */}
        {submitted && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">
                  Concept Solution & Step-by-Step Explanation
                </span>
              </div>
              <span className="font-mono text-emerald-700 font-semibold">
                Accuracy: 100% (+15 XP)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Orbital speed is given by v = √(GM / r). When the distance r is replaced with 2r, the velocity scales by 1/√2 ≈ 0.707, showing that further orbits travel slower.
            </p>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Weak Topic Identified
                </span>
                <span className="text-slate-800 font-medium">
                  Inverse-square gravitation proportionality
                </span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Recommended Revision
                </span>
                <span className="text-emerald-700 font-medium">
                  Review 3-question drill: Kepler’s 3rd Law
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>Includes full Chapter Tests, Mock Exams, and Time-bound Assessments</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onStartExam}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Explore Complete Question Bank
        </Button>
      </div>
    </div>
  );
};
