import React, { useState } from 'react';
import {
  Code2,
  Lightbulb,
  Check,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { PracticeQuestion, StudentAnswer } from '../../types/practice';

export interface PracticeQuestionRendererProps {
  question: PracticeQuestion;
  answer: StudentAnswer;
  onAnswerChange: (newAnswer: Partial<StudentAnswer>) => void;
  showHint?: boolean;
}

export const PracticeQuestionRenderer: React.FC<PracticeQuestionRendererProps> = ({
  question,
  answer,
  onAnswerChange,
}) => {
  const [showFormulaHint, setShowFormulaHint] = useState(false);

  // 1. MCQ RENDERER
  if (question.type === 'mcq' && question.options) {
    return (
      <div className="space-y-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select one option:
        </span>
        <div className="space-y-2.5">
          {question.options.map((option, optIdx) => {
            const isSelected = answer.selectedOptionIndex === optIdx;
            const letter = String.fromCharCode(65 + optIdx);

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => onAnswerChange({ selectedOptionIndex: optIdx })}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 font-bold ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. TRUE / FALSE RENDERER
  if (question.type === 'true_false' && question.options) {
    return (
      <div className="space-y-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select True or False:
        </span>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, optIdx) => {
            const isSelected = answer.selectedOptionIndex === optIdx;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => onAnswerChange({ selectedOptionIndex: optIdx })}
                className={`p-6 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold font-display block">
                  {option}
                </span>
                <span className={`text-[11px] block mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {option === 'True' ? 'Statistically & conceptually valid' : 'Counter-example or false premise'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. NUMERICAL PROBLEM RENDERER
  if (question.type === 'numerical') {
    return (
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Computed Numerical Value ({question.unit || 'units'}):
          </label>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="e.g. 32.0 or 2.50"
                value={answer.numericalAnswer || ''}
                onChange={(e) => onAnswerChange({ numericalAnswer: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
              {question.unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {question.unit}
                </span>
              )}
            </div>

            {question.tolerance && (
              <span className="text-xs text-slate-500 font-mono">
                Accepted tolerance: ±{question.tolerance}
              </span>
            )}
          </div>
        </div>

        {/* Formula Hint Toggle */}
        {question.formula && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowFormulaHint(!showFormulaHint)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 hover:underline"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showFormulaHint ? 'Hide Governing Formula' : 'Show Governing Formula Hint'}</span>
            </button>

            {showFormulaHint && (
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-center text-xs sm:text-sm border border-slate-800">
                {question.formula}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 4. SHORT QUESTION RENDERER
  if (question.type === 'short_question') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Your Concise Academic Explanation (1-3 sentences):
          </label>
          <textarea
            rows={4}
            placeholder="State the core conditions and definitions clearly..."
            value={answer.textAnswer || ''}
            onChange={(e) => onAnswerChange({ textAnswer: e.target.value })}
            className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none leading-relaxed resize-none"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Minimum requirements: state key definitions and verify domain limits</span>
            <span>{(answer.textAnswer || '').length} characters</span>
          </div>
        </div>

        {question.keyRubricPoints && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1 text-slate-600">
            <strong className="text-slate-800 block text-[11px] uppercase tracking-wider font-bold">
              Examiner Assessment Criteria:
            </strong>
            <ul className="list-disc pl-4 space-y-1">
              {question.keyRubricPoints.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // 5. LONG QUESTION RENDERER
  if (question.type === 'long_question') {
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Structured Essay / Detailed Derivation:
            </label>
            <span className="text-xs text-amber-700 font-mono font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {question.marks} Total Marks
            </span>
          </div>
          <textarea
            rows={7}
            placeholder="Structure your answer systematically: Introduction & Principles, Comparative Analysis, Trade-offs, and Verification..."
            value={answer.textAnswer || ''}
            onChange={(e) => onAnswerChange({ textAnswer: e.target.value })}
            className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none leading-relaxed resize-none"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>Tip: Address all criteria listed in the rubric below for full marks</span>
            <span>{(answer.textAnswer || '').length} characters</span>
          </div>
        </div>

        {/* Rubric Mark Breakdown */}
        {question.rubricCriteria && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Official Rubric Scoring Grid:
            </span>
            <div className="space-y-1.5">
              {question.rubricCriteria.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-600 p-2 rounded bg-white border border-slate-200/60">
                  <span>{c.criterion}</span>
                  <span className="font-mono font-bold text-slate-800 shrink-0 ml-2">
                    {c.marks} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 6. CODING PROBLEM RENDERER
  if (question.type === 'coding') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
            <Code2 className="w-4 h-4" /> Language: {question.language || 'typescript'}
          </span>
          <button
            type="button"
            onClick={() => onAnswerChange({ codeAnswer: question.starterCode })}
            className="text-slate-400 hover:text-slate-700 flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset Starter Code
          </button>
        </div>

        {/* Code Editor Area */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner font-mono text-xs sm:text-sm">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>solution.{question.language === 'python' ? 'py' : 'ts'}</span>
            <span>Auto-indent enabled</span>
          </div>
          <textarea
            rows={8}
            value={answer.codeAnswer !== undefined ? answer.codeAnswer : question.starterCode}
            onChange={(e) => onAnswerChange({ codeAnswer: e.target.value })}
            className="w-full p-4 bg-transparent text-emerald-300 font-mono outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Sample Test Cases Table */}
        {question.testCases && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Sample Test Cases:
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {question.testCases.map((tc, idx) => (
                <div key={idx} className="p-2 rounded bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-600">
                    Input: <strong className="text-slate-900">{tc.input}</strong>
                  </span>
                  <span className="text-emerald-700 font-bold">
                    Output: {tc.expectedOutput}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
