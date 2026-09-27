import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RotateCcw, Trophy } from 'lucide-react';
import { QuizQuestionItem } from '../../types/ai';
import { Button } from '../ui/Button';

export interface InteractiveQuizWidgetProps {
  quiz: QuizQuestionItem[];
}

export const InteractiveQuizWidget: React.FC<InteractiveQuizWidgetProps> = ({ quiz }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showSummary, setShowSummary] = useState(false);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (userAnswers[questionIndex] !== undefined) return; // Prevent changing after selected
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowSummary(false);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([qIdx, optIdx]) => quiz[Number(qIdx)].correctIndex === optIdx
  ).length;

  const isCompleted = answeredCount === quiz.length;

  return (
    <div className="my-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
      {/* Quiz Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h4 className="text-sm font-semibold tracking-wide font-display text-emerald-400 uppercase">
            Interactive Diagnostic Quiz
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span>
            Progress: <strong className="text-white">{answeredCount}</strong> / {quiz.length}
          </span>
          {answeredCount > 0 && (
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              Score: {correctCount} / {answeredCount}
            </span>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-4 space-y-6">
        {quiz.map((q, qIdx) => {
          const selectedOption = userAnswers[qIdx];
          const hasAnswered = selectedOption !== undefined;
          const isCorrect = hasAnswered && selectedOption === q.correctIndex;

          return (
            <div
              key={q.id || qIdx}
              className="bg-slate-950/60 rounded-lg p-4 border border-slate-800/80 transition-colors"
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                  Q{qIdx + 1}
                </span>
                <p className="text-sm font-medium text-slate-100 leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-8">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let buttonStyles = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white';

                  if (hasAnswered) {
                    if (isThisCorrect) {
                      buttonStyles = 'border-emerald-500/70 bg-emerald-950/80 text-emerald-200 font-medium';
                    } else if (isThisSelected && !isCorrect) {
                      buttonStyles = 'border-rose-500/70 bg-rose-950/80 text-rose-200';
                    } else {
                      buttonStyles = 'border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60';
                    }
                  }

                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 transition-all ${buttonStyles}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                        hasAnswered && isThisCorrect
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : hasAnswered && isThisSelected && !isCorrect
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {hasAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Diagnostic Explanation Callout */}
              {hasAnswered && (
                <div
                  className={`mt-3.5 ml-8 p-3 rounded-lg border text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold mb-1 text-emerald-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Explanation & Rationale:</span>
                  </div>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-600/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">
                Quiz Finished · Score: {correctCount} / {quiz.length} ({Math.round((correctCount / quiz.length) * 100)}%)
              </div>
              <p className="text-xs text-slate-300">
                {correctCount === quiz.length
                  ? 'Flawless recall! You have solid mastery of these concepts.'
                  : 'Diagnostic complete! Review the explanations above to cement any missed points.'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retake Quiz
          </Button>
        </div>
      )}
    </div>
  );
};
